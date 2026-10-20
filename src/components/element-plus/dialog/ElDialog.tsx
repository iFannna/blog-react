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
import { useGlobalConfig } from "../config-provider/context";

/** 服务端渲染 false、客户端首次渲染 true，用于延后 portal 到挂载后 */
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** body 滚动锁按弹层数量计数，避免嵌套弹窗关闭时提前解锁 */
let bodyLockCount = 0;

/** 打开中的弹窗栈，ESC 只关闭最上层，对应官方 focus trap 的层级协调 */
const openDialogStack: symbol[] = [];

export function lockBodyScroll() {
  bodyLockCount += 1;
  if (bodyLockCount === 1) {
    document.body.classList.add("el-popup-parent--hidden");
  }
}

export function unlockBodyScroll() {
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) {
    document.body.classList.remove("el-popup-parent--hidden");
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** 官方 appendTo 同时接受选择器与元素 */
function resolveAppendTo(appendTo: string | HTMLElement) {
  if (typeof appendTo !== "string") return appendTo;
  return (document.querySelector(appendTo) as HTMLElement | null) ?? document.body;
}

const TRANSITION_DURATION_MS = 300;

/** header 渲染函数的参数，对应官方 header 插槽的 { close, titleId, titleClass } */
export interface DialogHeaderHelpers {
  close: () => void;
  titleId: string;
  titleClass: string;
}

export interface DialogProps {
  /** 是否显示，对应官方 v-model */
  visible?: boolean;
  /** 显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 标题 */
  title?: ReactNode;
  /** 关闭前的钩子。done(true) 取消关闭，对应官方 done(false) 语义 */
  beforeClose?: (done: (shouldCancel?: boolean) => void) => void;
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnPressEscape?: boolean;
  /** 是否显示右上角关闭按钮 */
  showClose?: boolean;
  /** 是否垂直居中 */
  alignCenter?: boolean;
  /** 内容是否居中 */
  center?: boolean;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 宽度 */
  width?: string | number;
  /** 顶部距离 */
  top?: string;
  /** 是否渲染遮罩 */
  modal?: boolean;
  /** 遮罩类名 */
  modalClass?: string;
  /** 遮罩是否可穿透（需 modal=false 且非全屏） */
  modalPenetrable?: boolean;
  /** 是否开启滚动锁 */
  lockScroll?: boolean;
  /** 关闭后是否销毁内容 */
  destroyOnClose?: boolean;
  /** 打开延迟 */
  openDelay?: number;
  /** 关闭延迟 */
  closeDelay?: number;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 拖拽时是否允许超出视口 */
  overflow?: boolean;
  /** 是否启用焦点陷阱 */
  trapFocus?: boolean;
  /** 标题 aria-level，默认 2 */
  headerAriaLevel?: number | string;
  /** 打开动画名，默认 dialog-fade */
  transition?: string;
  /** 挂载目标，默认 body */
  appendTo?: string | HTMLElement;
  /** 是否挂载到 appendTo。默认 false（appendTo 非 body 时自动挂载） */
  appendToBody?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: ReactNode;
  /** 内容区 class */
  bodyClass?: string;
  /** 头部 class */
  headerClass?: string;
  /** 底部 class */
  footerClass?: string;
  /** 开始打开 */
  onOpen?: () => void;
  /** 完全关闭（动画结束）后 */
  onClosed?: () => void;
  /** 打开完成（动画结束）后 */
  onOpened?: () => void;
  /** 开始关闭（延迟结束、动画开始前） */
  onClose?: () => void;
  /** 焦点陷阱激活后 */
  onOpenAutoFocus?: () => void;
  /** 焦点陷阱释放后 */
  onCloseAutoFocus?: () => void;
  /** 层级 */
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
  /** 标题插槽，可传渲染函数以获取 close 与标题无障碍属性 */
  header?: ReactNode | ((helpers: DialogHeaderHelpers) => ReactNode);
  /** 底部插槽 */
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * 对应官方 ElDialog。
 *
 * 内部状态对齐官方 useDialog：
 * - `rendered` 控制内容是否挂载（destroyOnClose 在离场后置 false）
 * - `internalVisible` 控制遮罩显示，受 openDelay / closeDelay 影响
 * - 关闭回调在离场动画开始前触发，closed 在动画结束后触发
 *
 * 结构分层与官方一致：
 *   el-overlay（遮罩，el-modal-dialog）
 *     └ el-overlay-dialog（role=dialog，承载 aria 与点击判定）
 *         └ el-dialog（内容，受 FocusTrap 包裹）
 */
export function ElDialog({
  visible = false,
  onVisibleChange,
  title,
  beforeClose,
  closeOnClickModal = true,
  closeOnPressEscape = true,
  showClose = true,
  alignCenter,
  center = false,
  fullscreen = false,
  width,
  top,
  modal = true,
  modalClass,
  modalPenetrable = false,
  lockScroll = true,
  destroyOnClose = false,
  openDelay = 0,
  closeDelay = 0,
  draggable: draggableProp,
  overflow: overflowProp,
  trapFocus = true,
  headerAriaLevel = 2,
  transition,
  appendTo = "body",
  appendToBody = false,
  closeIcon,
  bodyClass,
  headerClass,
  footerClass,
  onOpen,
  onClosed,
  onOpened,
  onClose,
  onOpenAutoFocus,
  onCloseAutoFocus,
  zIndex: zIndexProp,
  className,
  style,
  header,
  footer,
  children,
}: DialogProps) {
  const { currentZIndex, nextZIndex } = useZIndex(zIndexProp);

  // 对应官方 use-dialog 的 _alignCenter / transition：
  // props.alignCenter ?? globalConfig.alignCenter ?? false，transition 同构
  const globalDialogConfig = useGlobalConfig("dialog");
  const resolvedAlignCenter =
    alignCenter ?? globalDialogConfig?.alignCenter ?? false;
  const resolvedTransition = transition ?? globalDialogConfig?.transition ?? "dialog-fade";
  // 与官方 use-dialog 一致：draggable / overflow 同样支持 ConfigProvider 全局配置
  const draggable = draggableProp ?? globalDialogConfig?.draggable ?? false;
  const overflow = overflowProp ?? globalDialogConfig?.overflow ?? false;

  const titleId = useId();
  const bodyId = useId();

  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [rendered, setRendered] = useState(visible);
  const [internalVisible, setInternalVisible] = useState(visible);
  const [transitionState, setTransitionState] = useState<"enter" | "leave" | null>(
    visible ? "enter" : null,
  );
  const [closing, setClosing] = useState(false);

  const everOpenedRef = useRef(visible);
  const internalVisibleRef = useRef(visible);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackTokenRef = useRef<symbol | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);
  // 与官方 useSameTarget 等价：只有 mousedown 与 mouseup 都落在该层本身才算点击遮罩
  const mousedownOnSelfRef = useRef(false);

  // 拖拽位移。用 ref 保存实时值，state 只驱动 transform 与拖拽中样式
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    internalVisibleRef.current = internalVisible;
  }, [internalVisible]);

  // 官方 useLockscreen：visible 期间锁定 body 滚动
  useEffect(() => {
    if (!internalVisible || !lockScroll) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [internalVisible, lockScroll]);

  const pushToStack = useCallback(() => {
    if (stackTokenRef.current) return;
    const token = Symbol("dialog");
    stackTokenRef.current = token;
    openDialogStack.push(token);
  }, []);

  const popFromStack = useCallback(() => {
    const token = stackTokenRef.current;
    if (!token) return;
    const index = openDialogStack.indexOf(token);
    if (index >= 0) openDialogStack.splice(index, 1);
    stackTokenRef.current = null;
  }, []);

  useEffect(
    () => () => {
      popFromStack();
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    },
    [popFromStack],
  );

  // 控制打开与关闭。依赖只取 visible，避免使用方内联回调导致重复触发事件
  useEffect(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    if (visible) {
      everOpenedRef.current = true;
      onOpen?.();

      const doOpen = () => {
        setRendered(true);
        setClosing(false);
        setInternalVisible(true);
        internalVisibleRef.current = true;
        setTransitionState("enter");
        pushToStack();
        nextZIndex();

        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        animTimerRef.current = setTimeout(() => {
          setTransitionState(null);
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

      setClosing(true);
      onClose?.();
      setTransitionState("leave");

      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        setInternalVisible(false);
        internalVisibleRef.current = false;
        setClosing(false);
        setTransitionState(null);
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

  // 打开/关闭后的焦点事件，对应官方 focus trap 的两枚事件
  useEffect(() => {
    if (!trapFocus) return;
    if (internalVisible) onOpenAutoFocus?.();
    else if (everOpenedRef.current) onCloseAutoFocus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalVisible, trapFocus]);

  /**
   * 统一关闭入口。对应官方 useDialog 的 handleClose：
   * 有 beforeClose 时交给它，由它决定何时调用 done。
   */
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

  // ESC 关闭，仅最上层弹窗响应
  useEffect(() => {
    if (!internalVisible || !closeOnPressEscape) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openDialogStack[openDialogStack.length - 1] !== stackTokenRef.current) return;
      handleClose();
    };

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [internalVisible, closeOnPressEscape, handleClose]);

  /**
   * 拖拽。算法与官方 useDraggable 一致：
   * 以当前 rect 反算允许的位移范围，overflow=false 时夹在视口内。
   */
  const adjustDragPosition = useCallback(
    (moveX: number, moveY: number) => {
      const target = dialogRef.current;
      if (!target) return;

      const { x: offsetX, y: offsetY } = dragOffsetRef.current;
      const targetRect = target.getBoundingClientRect();
      const targetLeft = Math.max(targetRect.left, 0);
      const targetTop = Math.max(targetRect.top, 0);
      const targetWidth = targetRect.width;
      const targetHeight = targetRect.height;
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;

      const minLeft = -targetLeft + offsetX;
      const minTop = -targetTop + offsetY;
      const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
      const maxTop =
        clientHeight - targetTop - (targetHeight < clientHeight ? targetHeight : 0) + offsetY;

      if (!overflow) {
        moveX = clamp(moveX, minLeft, maxLeft);
        moveY = clamp(moveY, minTop, maxTop);
      }

      dragOffsetRef.current = { x: moveX, y: moveY };
      setDragOffset({ x: moveX, y: moveY });
    },
    [overflow],
  );

  const handleHeaderMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!draggable || fullscreen) return;

      const downX = event.clientX;
      const downY = event.clientY;
      const { x: offsetX, y: offsetY } = dragOffsetRef.current;

      const onMousemove = (moveEvent: MouseEvent) => {
        setIsDragging(true);
        adjustDragPosition(
          offsetX + moveEvent.clientX - downX,
          offsetY + moveEvent.clientY - downY,
        );
      };

      const onMouseup = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", onMousemove);
        document.removeEventListener("mouseup", onMouseup);
      };

      document.addEventListener("mousemove", onMousemove);
      document.addEventListener("mouseup", onMouseup);
    },
    [draggable, fullscreen, adjustDragPosition],
  );

  // 视口变化后重新夹取位置，避免弹窗被拖出可见范围
  useEffect(() => {
    if (!draggable) return;
    const onResize = () => {
      adjustDragPosition(dragOffsetRef.current.x, dragOffsetRef.current.y);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draggable, adjustDragPosition]);

  if (!rendered && !visible) return null;

  const dialogClasses = [
    "el-dialog",
    resolvedAlignCenter && "is-align-center",
    center && "el-dialog--center",
    fullscreen && "is-fullscreen",
    draggable && !fullscreen && "is-draggable",
    isDragging && "is-dragging",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const dialogStyle: CSSProperties = {
    ...(fullscreen
      ? {}
      : {
          ...(top ? { "--el-dialog-margin-top": top } : {}),
          ...(width
            ? { "--el-dialog-width": typeof width === "number" ? `${width}px` : width }
            : {}),
        }),
    ...(draggable && !fullscreen
      ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
      : {}),
    ...style,
  } as CSSProperties;

  const overlayClasses = [
    modalClass,
    "el-modal-dialog",
    modalPenetrable && !modal && !fullscreen && "is-penetrable",
    transitionState === "enter" &&
      `${resolvedTransition}-enter-active ${resolvedTransition}-enter-from`,
    transitionState === "leave" &&
      `${resolvedTransition}-leave-active ${resolvedTransition}-leave-to`,
  ]
    .filter(Boolean)
    .join(" ");

  const overlayDialogClasses = [
    "el-overlay-dialog",
    closing && "is-closing",
  ]
    .filter(Boolean)
    .join(" ");

  const handleOverlayDialogMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    mousedownOnSelfRef.current = event.target === event.currentTarget;
  };

  const handleOverlayDialogMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const mouseupOnSelf = event.target === event.currentTarget;
    if (mousedownOnSelfRef.current && mouseupOnSelf && closeOnClickModal) {
      handleClose();
    }
    mousedownOnSelfRef.current = false;
  };

  // 遮罩可穿透时，点击内容需要把当前弹窗提到最前
  const handleDialogMouseDown = () => {
    if (!internalVisible || !modalPenetrable || zIndexProp !== undefined) return;
    nextZIndex();
  };

  const titleText = typeof title === "string" ? title : undefined;

  const dialogContent = rendered ? (
    <div
      ref={dialogRef}
      className={dialogClasses}
      style={dialogStyle}
      tabIndex={-1}
      onMouseDown={handleDialogMouseDown}
    >
      <header
        ref={headerRef}
        className={["el-dialog__header", headerClass, showClose && "show-close"]
          .filter(Boolean)
          .join(" ")}
        onMouseDown={handleHeaderMouseDown}
      >
        {typeof header === "function"
          ? header({
              close: handleClose,
              titleId,
              titleClass: "el-dialog__title",
            })
          : (header ?? (
              <span
                role="heading"
                aria-level={Number(headerAriaLevel) || 2}
                id={titleId}
                className="el-dialog__title"
              >
                {title}
              </span>
            ))}

        {showClose && (
          <button
            type="button"
            aria-label="关闭"
            className="el-dialog__headerbtn"
            onClick={handleClose}
          >
            <ElIcon className="el-dialog__close">
              {closeIcon ?? <Close />}
            </ElIcon>
          </button>
        )}
      </header>

      <div
        id={bodyId}
        className={["el-dialog__body", bodyClass].filter(Boolean).join(" ")}
      >
        {children}
      </div>

      {footer !== undefined && (
        <footer
          className={["el-dialog__footer", footerClass].filter(Boolean).join(" ")}
        >
          {footer}
        </footer>
      )}
    </div>
  ) : null;

  const overlay = (
    <ElOverlay
      mask={modal}
      customMaskEvent
      overlayClass={overlayClasses}
      zIndex={currentZIndex}
      style={internalVisible ? undefined : { display: "none" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titleText}
        aria-labelledby={titleText ? undefined : titleId}
        aria-describedby={bodyId}
        className={overlayDialogClasses}
        style={resolvedAlignCenter ? { display: "flex" } : undefined}
        onMouseDown={handleOverlayDialogMouseDown}
        onMouseUp={handleOverlayDialogMouseUp}
      >
        {trapFocus ? (
          <ElFocusTrap
            trapped={internalVisible}
            loop
            // 与官方 focusStartEl="container" 对应的近似：聚焦第一个可交互元素
            focusStartEl="first"
            // 官方 FocusTrap 不产生额外盒子，这里用 contents 保持居中布局不变
            style={{ display: "contents" }}
          >
            {dialogContent}
          </ElFocusTrap>
        ) : (
          dialogContent
        )}
      </div>
    </ElOverlay>
  );

  // 官方默认仅在 appendToBody 或 appendTo !== 'body' 时 teleport
  const shouldTeleport = appendTo !== "body" || appendToBody;

  if (shouldTeleport && mounted) {
    return createPortal(overlay, resolveAppendTo(appendTo));
  }

  return overlay;
}
