"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ElOverlay } from "../overlay/ElOverlay";
import { ElFocusTrap } from "../focus-trap/ElFocusTrap";
import { ElIcon } from "../icon/ElIcon";
import { Close } from "../icons";
import { useZIndex } from "../popper/use-z-index";
import { lockBodyScroll, unlockBodyScroll } from "../dialog/ElDialog";

export type DrawerDirection = "ltr" | "rtl" | "ttb" | "btt";

/** 服务端渲染 false、客户端首次渲染 true，用于延后 portal 到挂载后 */
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** 打开中的抽屉栈，ESC 只关闭最上层 */
const openDrawerStack: symbol[] = [];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveAppendTo(appendTo: string | HTMLElement) {
  if (typeof appendTo !== "string") return appendTo;
  return (document.querySelector(appendTo) as HTMLElement | null) ?? document.body;
}

function addUnit(value: string | number) {
  return typeof value === "number" ? `${value}px` : value;
}

const TRANSITION_DURATION_MS = 300;

/** header 渲染函数的参数，对应官方 header 插槽的 { close, titleId, titleClass } */
export interface DrawerHeaderHelpers {
  close: () => void;
  titleId: string;
  titleClass: string;
}

export interface DrawerProps {
  /** 是否显示 */
  visible?: boolean;
  /** 显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 抽屉标题 */
  title?: ReactNode;
  /**
   * 打开方向。
   * ltr 从左侧、rtl 从右侧（默认）、ttb 从上、btt 从下。
   */
  direction?: DrawerDirection;
  /** 尺寸。横向方向对应宽度，纵向对应高度，默认 30% */
  size?: string | number;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 是否显示遮罩 */
  modal?: boolean;
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnPressEscape?: boolean;
  /** 是否渲染头部 */
  withHeader?: boolean;
  /** 是否可拖拽调整尺寸 */
  resizable?: boolean;
  /** 是否开启滚动锁 */
  lockScroll?: boolean;
  /** 关闭后是否销毁内容 */
  destroyOnClose?: boolean;
  /** 打开延迟 */
  openDelay?: number;
  /** 关闭延迟 */
  closeDelay?: number;
  /** 遮罩是否可穿透（需 modal=false） */
  modalPenetrable?: boolean;
  /** 是否启用焦点陷阱 */
  trapFocus?: boolean;
  /** 标题 aria-level，默认 2 */
  headerAriaLevel?: number | string;
  /** 遮罩淡入淡出，保留兼容 */
  modalFade?: boolean;
  /** 关闭前的钩子。done(true) 取消关闭 */
  beforeClose?: (done: (shouldCancel?: boolean) => void) => void;
  /** 挂载目标 */
  appendTo?: string | HTMLElement;
  /** 是否挂载到 appendTo */
  appendToBody?: boolean;
  /** 遮罩类名 */
  modalClass?: string;
  /** 头部类名 */
  headerClass?: string;
  /** 内容类名 */
  bodyClass?: string;
  /** 底部类名 */
  footerClass?: string;
  /** 层级 */
  zIndex?: number;
  /** 开始打开 */
  onOpen?: () => void;
  /** 开始关闭 */
  onClose?: () => void;
  /** 打开完成 */
  onOpened?: () => void;
  /** 完全关闭 */
  onClosed?: () => void;
  /** 焦点激活 */
  onOpenAutoFocus?: () => void;
  /** 焦点释放 */
  onCloseAutoFocus?: () => void;
  /** 拖拽调整尺寸开始 */
  onResizeStart?: (event: React.MouseEvent | MouseEvent, size: number) => void;
  /** 拖拽调整尺寸中 */
  onResize?: (event: MouseEvent, size: number) => void;
  /** 拖拽调整尺寸结束 */
  onResizeEnd?: (event: MouseEvent, size: number) => void;
  className?: string;
  style?: CSSProperties;
  header?: ReactNode | ((helpers: DrawerHeaderHelpers) => ReactNode);
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * 对应官方 ElDrawer。
 *
 * 与 Dialog 共享同一套 useDialog 生命周期（rendered / 延迟 / 滚动锁 / 事件），
 * 差异在：
 * - 方向决定尺寸落在 width 还是 height
 * - 过渡使用 el-drawer-fade 的 enter-from / leave-to 类做滑入滑出
 * - resizable 通过拖拽手柄实时改尺寸，并抛出 resize 系列事件
 */
export function ElDrawer({
  visible = false,
  onVisibleChange,
  title,
  direction = "rtl",
  size = "30%",
  showClose = true,
  modal = true,
  closeOnClickModal = true,
  closeOnPressEscape = true,
  withHeader = true,
  resizable = false,
  lockScroll = true,
  destroyOnClose = false,
  openDelay = 0,
  closeDelay = 0,
  modalPenetrable = false,
  trapFocus = true,
  headerAriaLevel = 2,
  beforeClose,
  appendTo = "body",
  appendToBody = false,
  modalClass,
  headerClass,
  bodyClass,
  footerClass,
  zIndex: zIndexProp,
  onOpen,
  onClose,
  onOpened,
  onClosed,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onResizeStart,
  onResize,
  onResizeEnd,
  className,
  style,
  header,
  footer,
  children,
}: DrawerProps) {
  const { currentZIndex, nextZIndex } = useZIndex(zIndexProp);

  const titleId = useId();
  const bodyId = useId();

  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [rendered, setRendered] = useState(visible);
  const [internalVisible, setInternalVisible] = useState(visible);
  const [phase, setPhase] = useState<
    "enter-from" | "enter" | "leave-from" | "leave" | null
  >(visible ? "enter-from" : null);
  const [isResizing, setIsResizing] = useState(false);

  const everOpenedRef = useRef(visible);
  const internalVisibleRef = useRef(visible);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackTokenRef = useRef<symbol | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  // 拖拽改尺寸。hasResized 之后尺寸固定为 px，与官方 useResizable 一致
  const hasResizedRef = useRef(false);
  const resizingRef = useRef(false);
  const startSizeRef = useRef(0);
  const startPosRef = useRef([0, 0]);
  const currentSizeRef = useRef(0);
  const moveHandlerRef = useRef<((event: MouseEvent) => void) | null>(null);
  const upHandlerRef = useRef<((event: MouseEvent) => void) | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);

  const isHorizontal = direction === "ltr" || direction === "rtl";
  const sign = direction === "ltr" || direction === "ttb" ? 1 : -1;

  useEffect(() => {
    internalVisibleRef.current = internalVisible;
  }, [internalVisible]);

  // 官方 useLockscreen
  useEffect(() => {
    if (!internalVisible || !lockScroll) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [internalVisible, lockScroll]);

  const pushToStack = useCallback(() => {
    if (stackTokenRef.current) return;
    const token = Symbol("drawer");
    stackTokenRef.current = token;
    openDrawerStack.push(token);
  }, []);

  const popFromStack = useCallback(() => {
    const token = stackTokenRef.current;
    if (!token) return;
    const index = openDrawerStack.indexOf(token);
    if (index >= 0) openDrawerStack.splice(index, 1);
    stackTokenRef.current = null;
  }, []);

  const removeResizeListeners = useCallback(() => {
    if (moveHandlerRef.current) {
      document.removeEventListener("mousemove", moveHandlerRef.current);
      moveHandlerRef.current = null;
    }
    if (upHandlerRef.current) {
      document.removeEventListener("mouseup", upHandlerRef.current);
      upHandlerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      popFromStack();
      removeResizeListeners();
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    },
    [popFromStack, removeResizeListeners],
  );

  // 打开/关闭生命周期，与官方 useDialog 对齐
  useEffect(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    if (visible) {
      everOpenedRef.current = true;
      onOpen?.();

      const doOpen = () => {
        setRendered(true);
        setInternalVisible(true);
        internalVisibleRef.current = true;
        setPhase("enter-from");
        pushToStack();
        nextZIndex();

        // 先以 enter-from 挂载，下一帧移除，transition 才能算出位移差
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase("enter"));
        });

        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        animTimerRef.current = setTimeout(() => {
          setPhase(null);
          onOpened?.();
        }, TRANSITION_DURATION_MS);
      };

      if (openDelay > 0) {
        openTimerRef.current = setTimeout(doOpen, openDelay);
      } else {
        doOpen();
      }

      return;
    }

    if (!everOpenedRef.current) return;

    const doClose = () => {
      if (!internalVisibleRef.current) return;

      onClose?.();
      setPhase("leave-from");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("leave"));
      });

      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        setInternalVisible(false);
        internalVisibleRef.current = false;
        setPhase(null);
        popFromStack();
        onClosed?.();
        if (destroyOnClose) setRendered(false);
      }, TRANSITION_DURATION_MS);
    };

    if (closeDelay > 0) {
      closeTimerRef.current = setTimeout(doClose, closeDelay);
    } else {
      doClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在显隐变化时跑完整生命周期
  }, [visible]);

  useEffect(() => {
    if (!trapFocus) return;
    if (internalVisible) onOpenAutoFocus?.();
    else if (everOpenedRef.current) onCloseAutoFocus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalVisible, trapFocus]);

  const handleClose = useCallback(() => {
    if (beforeClose) {
      beforeClose((shouldCancel) => {
        if (shouldCancel) return;
        onVisibleChange?.(false);
      });
      return;
    }

    onVisibleChange?.(false);
  }, [beforeClose, onVisibleChange]);

  useEffect(() => {
    if (!internalVisible || !closeOnPressEscape) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openDrawerStack[openDrawerStack.length - 1] !== stackTokenRef.current) return;
      handleClose();
    };

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [internalVisible, closeOnPressEscape, handleClose]);

  // size / resizable 变化时重置拖拽结果，对应官方 watch
  useEffect(() => {
    hasResizedRef.current = false;
    resizingRef.current = false;
    startSizeRef.current = 0;
    currentSizeRef.current = 0;
    removeResizeListeners();

    const frame = requestAnimationFrame(() => {
      setIsResizing(false);
      setResizedSize(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [size, resizable, removeResizeListeners]);

  const getActualSize = () => {
    const drawerEl = drawerRef.current;
    if (!drawerEl) return 100;
    return isHorizontal ? drawerEl.offsetWidth : drawerEl.offsetHeight;
  };

  const handleDraggerMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!resizable) return;

    if (!hasResizedRef.current) {
      startSizeRef.current = getActualSize();
      hasResizedRef.current = true;
    }

    startPosRef.current = [event.pageX, event.pageY];
    resizingRef.current = true;
    setIsResizing(true);
    currentSizeRef.current = startSizeRef.current;
    onResizeStart?.(event, startSizeRef.current);

    const onMousemove = (moveEvent: MouseEvent) => {
      const offsetX = moveEvent.pageX - startPosRef.current[0];
      const offsetY = moveEvent.pageY - startPosRef.current[1];
      const offset = isHorizontal ? offsetX : offsetY;
      const windowSize = isHorizontal
        ? document.documentElement.clientWidth
        : document.documentElement.clientHeight;
      const nextSize = clamp(startSizeRef.current + sign * offset, 4, windowSize);

      currentSizeRef.current = nextSize;
      setResizedSize(nextSize);
      onResize?.(moveEvent, nextSize);
    };

    const onMouseup = (upEvent: MouseEvent) => {
      if (!resizingRef.current) return;
      startSizeRef.current = currentSizeRef.current;
      resizingRef.current = false;
      setIsResizing(false);
      removeResizeListeners();
      onResizeEnd?.(upEvent, currentSizeRef.current);
    };

    removeResizeListeners();
    moveHandlerRef.current = onMousemove;
    upHandlerRef.current = onMouseup;
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("mouseup", onMouseup);
  };

  if (!rendered && !visible) return null;

  const renderSize = resizedSize !== null ? `${resizedSize}px` : addUnit(size);

  const overlayClasses = [
    "is-drawer",
    modalClass,
    "el-modal-drawer",
    modalPenetrable && !modal && "is-penetrable",
    phase === "enter-from" &&
      "el-drawer-fade-enter-active el-drawer-fade-enter-from",
    phase === "enter" && "el-drawer-fade-enter-active",
    phase === "leave-from" &&
      "el-drawer-fade-leave-active el-drawer-fade-leave-from",
    phase === "leave" && "el-drawer-fade-leave-active el-drawer-fade-leave-to",
  ]
    .filter(Boolean)
    .join(" ");

  const drawerClasses = [
    "el-drawer",
    direction,
    internalVisible && "open",
    isResizing && "is-dragging",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const drawerStyle: CSSProperties = {
    ...(isHorizontal ? { width: renderSize } : { height: renderSize }),
    ...style,
  };

  const titleText = typeof title === "string" ? title : undefined;

  const drawer = (
    <div
      ref={drawerRef}
      className={drawerClasses}
      style={drawerStyle}
      role="dialog"
      aria-modal="true"
      aria-label={titleText}
      aria-labelledby={titleText ? undefined : titleId}
      aria-describedby={bodyId}
      onClick={(event) => event.stopPropagation()}
    >
      {/* 对应官方 sr-focus：不可见的焦点起点，供 FocusTrap 兜底聚焦 */}
      <span className="el-drawer__sr-focus" tabIndex={-1} />

      {withHeader && (
        <header className={["el-drawer__header", headerClass].filter(Boolean).join(" ")}>
          {typeof header === "function"
            ? header({
                close: handleClose,
                titleId,
                titleClass: "el-drawer__title",
              })
            : (header ?? (
                <span
                  role="heading"
                  aria-level={Number(headerAriaLevel) || 2}
                  id={titleId}
                  className="el-drawer__title"
                >
                  {title}
                </span>
              ))}

          {showClose && (
            <button
              type="button"
              aria-label="关闭"
              className="el-drawer__close-btn"
              onClick={handleClose}
            >
              <ElIcon className="el-drawer__close">
                <Close />
              </ElIcon>
            </button>
          )}
        </header>
      )}

      {rendered && (
        <div
          id={bodyId}
          className={["el-drawer__body", bodyClass].filter(Boolean).join(" ")}
        >
          {children}
        </div>
      )}

      {footer !== undefined && (
        <footer className={["el-drawer__footer", footerClass].filter(Boolean).join(" ")}>
          {footer}
        </footer>
      )}

      {resizable && (
        <div
          className="el-drawer__dragger"
          style={{ zIndex: currentZIndex }}
          onMouseDown={handleDraggerMouseDown}
        />
      )}
    </div>
  );

  const overlay = (
    <ElOverlay
      mask={modal}
      overlayClass={overlayClasses}
      zIndex={currentZIndex}
      style={internalVisible ? undefined : { display: "none" }}
      onClick={closeOnClickModal ? handleClose : undefined}
    >
      {trapFocus ? (
        <ElFocusTrap
          trapped={internalVisible}
          loop
          focusStartEl="first"
          style={{ display: "contents" }}
        >
          {drawer}
        </ElFocusTrap>
      ) : (
        drawer
      )}
    </ElOverlay>
  );

  const shouldTeleport = appendTo !== "body" || appendToBody;

  if (shouldTeleport && mounted) {
    return createPortal(overlay, resolveAppendTo(appendTo));
  }

  return overlay;
}
