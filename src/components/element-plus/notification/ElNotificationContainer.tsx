"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ElIcon } from "../icon/ElIcon";
import { ElProgress } from "../progress";
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Close,
  InfoFilled,
  WarningFilled,
} from "../generated/icons";
import {
  closeNotification,
  getServerSnapshot,
  getSnapshot,
  removeNotification,
  subscribe,
  LEAVE_DURATION_MS,
  type NotificationPosition,
  type NotificationState,
  type NotificationType,
} from "./store";

/** 对应官方 TypeComponentsMap 中 notification 用到的部分。 */
const TYPE_ICONS: Record<NotificationType, ReactNode> = {
  primary: <InfoFilled />,
  success: <CircleCheckFilled />,
  info: <InfoFilled />,
  warning: <WarningFilled />,
  error: <CircleCloseFilled />,
};

const GAP = 16;

/** 对应官方 horizontalClass：位置以 -right / -left 结尾。 */
function horizontalClass(position: NotificationPosition) {
  return position.endsWith("right")
    ? "right"
    : "left";
}

function isBottom(position: NotificationPosition) {
  return position.startsWith("bottom");
}

function NotificationItem({
  instance,
  onHeight,
}: {
  instance: NotificationState;
  onHeight: (id: number, height: number) => void;
}) {
  const {
    id,
    title,
    message,
    type,
    icon,
    closeIcon,
    duration,
    position,
    offset,
    showClose,
    progress,
    pauseOnHover,
    dangerouslyUseHTMLString,
    appendTo,
    customClass,
    zIndex,
    onClick,
    closing,
  } = instance;

  const itemRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState<"enter-from" | "enter" | "leave" | null>(
    "enter-from",
  );
  /** 剩余时长，用于进度条显示；悬停暂停时冻结 */
  const [remaining, setRemaining] = useState(duration);
  const pauseStartRef = useRef<number | null>(null);

  // 测量高度，供同位置的多条通知累加偏移
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const measure = () => onHeight(id, el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, onHeight]);

  // 过渡状态：初始以 enter-from 挂载，下一帧切到 enter；closing 后离场淡出
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

  // 离场动画结束后移除
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => removeNotification(id), LEAVE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [closing, id]);

  // 自动关闭：悬停时暂停，移开后按剩余时间继续
  useEffect(() => {
    if (duration <= 0 || closing) return;
    if (pauseOnHover && hovered) return;

    const timer = setTimeout(() => closeNotification(id), remaining);
    return () => clearTimeout(timer);
  }, [duration, closing, id, remaining, hovered, pauseOnHover]);

  // 悬停暂停时记录剩余时间
  useEffect(() => {
    if (!pauseOnHover) return;

    if (hovered) {
      pauseStartRef.current = Date.now();
    } else if (pauseStartRef.current !== null) {
      const elapsed = Date.now() - pauseStartRef.current;
      pauseStartRef.current = null;
      setRemaining((prev) => Math.max(0, prev - elapsed));
    }
  }, [hovered, pauseOnHover]);

  const transitionClasses = [
    phase === "enter-from" &&
      "el-notification-fade-enter-active el-notification-fade-enter-from",
    phase === "enter" && "el-notification-fade-enter-active",
    phase === "leave" &&
      "el-notification-fade-leave-active el-notification-fade-leave-to",
  ]
    .filter(Boolean)
    .join(" ");

  const classes = [
    "el-notification",
    customClass,
    horizontalClass(position),
    transitionClasses,
  ]
    .filter(Boolean)
    .join(" ");

  // 与官方 positionStyle 一致：只设垂直属性 + zIndex，
  // 水平定位由 CSS 的 .right / .left 类提供
  const style: React.CSSProperties = {
    zIndex,
    [isBottom(position) ? "bottom" : "top"]: `${offset}px`,
  };

  const iconComponent = icon ?? (type ? TYPE_ICONS[type] : null);
  const messageNode = typeof message === "function" ? message() : message;
  const hasMessage =
    messageNode !== undefined && messageNode !== null && messageNode !== "";

  const progressOptions = typeof progress === "object" ? progress : {};
  const showProgressBar = !!progress && duration > 0;
  const progressStatus =
    type === "success"
      ? "success"
      : type === "warning"
        ? "warning"
        : type === "error"
          ? "exception"
          : undefined;

  const element = (
    <div
      ref={itemRef}
      className={classes}
      style={style}
      role="alert"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {iconComponent && (
        // 官方 typeClass 是 ns.m(type) 即 el-notification--{type}，
        // 配色规则为 `.el-notification .el-notification--{type}`
        <ElIcon className={`el-notification__icon el-notification--${type}`}>
          {iconComponent}
        </ElIcon>
      )}

      <div className="el-notification__group">
        <h2 className="el-notification__title">{title}</h2>

        {hasMessage && (
          <div
            className="el-notification__content"
            style={title ? undefined : { margin: 0 }}
          >
            {dangerouslyUseHTMLString ? (
              <p dangerouslySetInnerHTML={{ __html: String(messageNode) }} />
            ) : (
              <p>{messageNode}</p>
            )}
          </div>
        )}

        {showClose && (
          <ElIcon
            className="el-notification__closeBtn"
            onClick={(event) => {
              event.stopPropagation();
              closeNotification(id);
            }}
          >
            {closeIcon ?? <Close />}
          </ElIcon>
        )}
      </div>

      {showProgressBar && (
        <div className="el-notification__progress" aria-hidden="true">
          <ElProgress
            percentage={duration <= 0 ? 0 : (remaining / duration) * 100}
            status={progressStatus}
            showText={false}
            strokeWidth={3}
            {...progressOptions}
          />
        </div>
      )}
    </div>
  );

  // 对应官方 appendTo
  if (appendTo && typeof document !== "undefined") {
    const target =
      typeof appendTo === "string"
        ? ((document.querySelector(appendTo) as HTMLElement | null) ?? document.body)
        : appendTo;
    return createPortal(element, target);
  }

  return element;
}

/**
 * Notification 的渲染容器。
 *
 * 同位置的多个通知会累加偏移：每个通知的位置是
 * 「前一个的底边 + 16px」，与官方一致。
 */
export default function ElNotificationContainer() {
  const notifications = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [heights, setHeights] = useState<Record<number, number>>({});

  const handleHeight = useCallback((id: number, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  /** 按位置分组，累加每条通知的 offset */
  const offsets = useMemo(() => {
    const result: Record<number, number> = {};
    const groups = new Map<NotificationPosition, NotificationState[]>();

    for (const n of notifications) {
      const list = groups.get(n.position) ?? [];
      list.push(n);
      groups.set(n.position, list);
    }

    for (const list of groups.values()) {
      let accumulated = 0;
      list.forEach((n, index) => {
        // 官方首个通知的 offset 也要再加一个 GAP（默认 0 + 16）
        const value = index === 0 ? n.offset + GAP : accumulated + GAP;
        accumulated = value + (heights[n.id] ?? 0);
        result[n.id] = value;
      });
    }

    return result;
  }, [notifications, heights]);

  return (
    <>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          instance={{ ...n, offset: offsets[n.id] ?? n.offset }}
          onHeight={handleHeight}
        />
      ))}
    </>
  );
}
