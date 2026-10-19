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
import { ElButton } from "../button";
import { ElInput } from "../input";
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Close,
  InfoFilled,
  WarningFilled,
} from "../icons";
import {
  getServerSnapshot,
  getSnapshot,
  removeMessageBox,
  dispatchMessageBoxAction,
  subscribe,
  updateMessageBoxInput,
  LEAVE_DURATION_MS,
  type MessageBoxState,
  type MessageBoxAction,
  type MessageBoxType,
} from "./store";

/** 对应官方 TypeComponentsMap 中 message-box 用到的部分。 */
const TYPE_ICONS: Record<MessageBoxType, ReactNode> = {
  primary: <InfoFilled />,
  success: <CircleCheckFilled />,
  info: <InfoFilled />,
  warning: <WarningFilled />,
  error: <CircleCloseFilled />,
};

/** 滚动锁按实例计数，多个消息框叠加时不会提前解锁 */
let lockCount = 0;

function lockBody() {
  lockCount += 1;
  if (lockCount === 1) {
    document.body.classList.add("el-message-box-parent--hidden");
  }
}

function unlockBody() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.classList.remove("el-message-box-parent--hidden");
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveAppendTo(appendTo: string | HTMLElement) {
  if (typeof appendTo !== "string") return appendTo;
  return (document.querySelector(appendTo) as HTMLElement | null) ?? document.body;
}

function MessageBoxItem({ instance }: { instance: MessageBoxState }) {
  const {
    id,
    title,
    message,
    type,
    icon,
    showCancelButton,
    showConfirmButton,
    showClose,
    confirmButtonText,
    cancelButtonText,
    confirmButtonType,
    cancelButtonType,
    center,
    modal,
    closeOnClickModal,
    closeOnPressEscape,
    distinguishCancelAndClose,
    showInput,
    inputPlaceholder,
    inputValue = "",
    inputType,
    dangerouslyUseHTMLString,
    closeIcon,
    draggable,
    overflow,
    lockScroll,
    closeOnHashChange,
    customClass,
    customStyle,
    modalClass,
    confirmButtonClass,
    cancelButtonClass,
    btnSize,
    roundButton,
    zIndex,
    closing,
    validationError,
    confirmButtonLoading,
    cancelButtonLoading,
    confirmButtonDisabled,
  } = instance;

  const contentId = useId();
  const inputId = useId();

  const [phase, setPhase] = useState<"enter-from" | "enter" | "leave" | null>(
    "enter-from",
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // 拖拽位移，算法与官方 useDraggable 一致
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  /** 关闭动画结束后移除实例 */
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => removeMessageBox(id), LEAVE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [closing, id]);

  // 过渡状态：初始以 enter-from 挂载，下一帧切到 enter；closing 后播放反向动画
  useEffect(() => {
    if (closing) {
      const frame = requestAnimationFrame(() => setPhase("leave"));
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => setPhase("enter"));
    const timer = setTimeout(() => setPhase(null), LEAVE_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [closing]);

  // 与官方一致：消息框显示期间锁定滚动
  useEffect(() => {
    if (!lockScroll) return;
    lockBody();
    return () => unlockBody();
  }, [lockScroll]);

  // 统一走 dispatchMessageBoxAction：校验 + beforeClose 都在其中处理
  const handleAction = useCallback(
    (action: MessageBoxAction) => dispatchMessageBoxAction(id, action),
    [id],
  );

  // 官方 closeOnHashChange：默认在 hash 变化时关闭
  useEffect(() => {
    if (!closeOnHashChange || closing) return;
    const onHashChange = () => handleAction("close");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [closeOnHashChange, closing, handleAction]);

  // ESC 关闭：区分 cancel 与 close 时按 close 处理，与官方一致
  useEffect(() => {
    if (!closeOnPressEscape || closing) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleAction(distinguishCancelAndClose ? "close" : "cancel");
      }
    };

    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [closeOnPressEscape, closing, distinguishCancelAndClose, handleAction]);

  const adjustDragPosition = useCallback(
    (moveX: number, moveY: number) => {
      const target = rootRef.current;
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
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!draggable) return;

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
    [draggable, adjustDragPosition],
  );

  const iconComponent = icon ?? (type ? TYPE_ICONS[type] : null);
  const hasMessage = message !== undefined && message !== null && message !== "";

  // 官方 message 允许函数形式，参数是 confirm / cancel / close
  const messageNode =
    typeof message === "function"
      ? message({
          confirm: () => handleAction("confirm"),
          cancel: () => handleAction("cancel"),
          close: () => handleAction("close"),
        })
      : message;

  const transitionClasses = [
    phase === "enter-from" &&
      "fade-in-linear-enter-active fade-in-linear-enter-from",
    phase === "enter" && "fade-in-linear-enter-active",
    phase === "leave" && "fade-in-linear-leave-active fade-in-linear-leave-to",
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    "el-message-box",
    customClass,
    center && "el-message-box--center",
    draggable && "is-draggable",
    isDragging && "is-dragging",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: CSSProperties = {
    ...(draggable
      ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }
      : {}),
    ...customStyle,
  };

  const renderMessage = () => {
    if (showInput) {
      return dangerouslyUseHTMLString && typeof messageNode === "string" ? (
        <label
          htmlFor={inputId}
          dangerouslySetInnerHTML={{ __html: messageNode }}
        />
      ) : (
        <label htmlFor={inputId}>{messageNode}</label>
      );
    }

    return dangerouslyUseHTMLString && typeof messageNode === "string" ? (
      <p dangerouslySetInnerHTML={{ __html: messageNode }} />
    ) : (
      <p>{messageNode}</p>
    );
  };

  const handleInputEnter = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (inputType === "textarea") return;
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    handleAction("confirm");
  };

  const overlay = (
    <ElOverlay
      mask={modal}
      zIndex={zIndex}
      overlayClass={["is-message-box", modalClass, transitionClasses]
        .filter(Boolean)
        .join(" ")}
      onClick={
        closeOnClickModal
          ? () => handleAction(distinguishCancelAndClose ? "close" : "cancel")
          : undefined
      }
    >
      <div
        role="dialog"
        aria-label={typeof title === "string" ? title : undefined}
        aria-modal="true"
        aria-describedby={!showInput ? contentId : undefined}
        className="el-overlay-message-box"
      >
        <ElFocusTrap trapped={!closing} loop focusStartEl="first" style={{ display: "contents" }}>
          <div
            ref={rootRef}
            className={classes}
            style={rootStyle}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {title !== null && title !== undefined && (
              <div
                ref={headerRef}
                className={["el-message-box__header", showClose && "show-close"]
                  .filter(Boolean)
                  .join(" ")}
                onMouseDown={handleHeaderMouseDown}
              >
                <div className="el-message-box__title">
                  {/* 居中时图标显示在标题行，否则显示在正文左侧 */}
                  {iconComponent && center && (
                    <ElIcon
                      className={`el-message-box__status el-message-box-icon--${type}`}
                    >
                      {iconComponent}
                    </ElIcon>
                  )}
                  <span>{title}</span>
                </div>

                {showClose && (
                  <button
                    type="button"
                    className="el-message-box__headerbtn"
                    aria-label="关闭此对话框"
                    onClick={() =>
                      handleAction(distinguishCancelAndClose ? "close" : "cancel")
                    }
                  >
                    <ElIcon className="el-message-box__close">
                      {closeIcon ?? <Close />}
                    </ElIcon>
                  </button>
                )}
              </div>
            )}

            <div id={contentId} className="el-message-box__content">
              <div className="el-message-box__container">
                {iconComponent && !center && hasMessage && (
                  <ElIcon
                    className={`el-message-box__status el-message-box-icon--${type}`}
                  >
                    {iconComponent}
                  </ElIcon>
                )}

                {hasMessage && (
                  <div className="el-message-box__message">{renderMessage()}</div>
                )}
              </div>

              {showInput && (
                <div className="el-message-box__input">
                  <ElInput
                    id={inputId}
                    value={inputValue}
                    onChange={(value) => updateMessageBoxInput(id, value)}
                    onKeyDown={handleInputEnter}
                    type={inputType}
                    placeholder={inputPlaceholder}
                    aria-invalid={!!validationError}
                    className={validationError ? "invalid" : undefined}
                  />
                  <div
                    className="el-message-box__errormsg"
                    style={{ visibility: validationError ? "visible" : "hidden" }}
                  >
                    {validationError}
                  </div>
                </div>
              )}
            </div>

            {(showCancelButton || showConfirmButton) && (
              <div className="el-message-box__btns">
                {showCancelButton && (
                  <ElButton
                    type={cancelButtonType === "text" ? undefined : cancelButtonType}
                    text={cancelButtonType === "text"}
                    loading={cancelButtonLoading}
                    round={roundButton}
                    size={btnSize}
                    className={cancelButtonClass}
                    onClick={() => handleAction("cancel")}
                  >
                    {cancelButtonText}
                  </ElButton>
                )}
                {showConfirmButton && (
                  <ElButton
                    type={confirmButtonType === "text" ? undefined : confirmButtonType}
                    text={confirmButtonType === "text"}
                    loading={confirmButtonLoading}
                    disabled={confirmButtonDisabled}
                    round={roundButton}
                    size={btnSize}
                    className={confirmButtonClass}
                    onClick={() => handleAction("confirm")}
                  >
                    {confirmButtonText}
                  </ElButton>
                )}
              </div>
            )}
          </div>
        </ElFocusTrap>
      </div>
    </ElOverlay>
  );

  if (instance.appendTo && typeof document !== "undefined") {
    return createPortal(overlay, resolveAppendTo(instance.appendTo));
  }

  return overlay;
}

/**
 * MessageBox 的渲染容器，对应官方挂载实例的部分。
 * 需要在应用根部渲染一次，与 ElMessageContainer 同理。
 */
export default function ElMessageBoxContainer() {
  const boxes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      {boxes.map((box) => (
        <MessageBoxItem key={box.id} instance={box} />
      ))}
    </>
  );
}
