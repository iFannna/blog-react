"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ElIcon } from "../icon/ElIcon";
import { ElBadge, type BadgeType } from "../badge";
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Close,
  InfoFilled,
  WarningFilled,
} from "../generated/icons";
import {
  closeAllMessages,
  closeMessage,
  getServerSnapshot,
  getSnapshot,
  removeMessage,
  subscribe,
  LEAVE_DURATION_MS,
  STACK_GAP,
  type MessageInstance,
  type MessagePlacement,
} from "./store";

/** 对应官方 TypeComponentsMap 中 message 用到的部分。 */
const TYPE_ICONS: Record<MessageInstance["type"], React.ReactNode> = {
  primary: <InfoFilled />,
  success: <CircleCheckFilled />,
  info: <InfoFilled />,
  warning: <WarningFilled />,
  error: <CircleCloseFilled />,
};

interface MessagePosition {
  /** 距视口上/下边缘的距离，px */
  edge: number;
  /** 用哪个 CSS 属性定位 */
  verticalProp: "top" | "bottom";
  /** 水平方位类名 */
  horizontalClass: string;
}

interface MessageItemProps {
  instance: MessageInstance;
  position: MessagePosition;
  onHeight: (id: number, height: number) => void;
}

/** 官方 badgeType：error 映射为 danger，其余直接用类型，缺省 info */
function toBadgeType(type: MessageInstance["type"]): BadgeType {
  if (type === "error") return "danger";
  return type ?? "info";
}

function resolveAppendTo(appendTo: string | HTMLElement) {
  if (typeof appendTo !== "string") return appendTo;
  return (document.querySelector(appendTo) as HTMLElement | null) ?? document.body;
}

function MessageItem({ instance, position, onHeight }: MessageItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [phase, setPhase] = useState<"enter-from" | "enter" | "leave" | null>(
    "enter-from",
  );

  // 测量高度，供堆叠时计算下一条的位置
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => onHeight(instance.id, el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [instance.id, onHeight]);

  // 过渡状态机：初始以 enter-from 挂载，下一帧切到 enter；closing 后切到离场
  useEffect(() => {
    if (instance.closing) {
      const frame = requestAnimationFrame(() => setPhase("leave"));
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => setPhase("enter"));
    const timer = setTimeout(() => setPhase(null), LEAVE_DURATION_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [instance.closing]);

  // 离场动画结束后真正移除
  useEffect(() => {
    if (!instance.closing) return;
    const timer = setTimeout(
      () => removeMessage(instance.id),
      LEAVE_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [instance.closing, instance.id]);

  // 自动关闭；悬停时暂停，移开后重新计时。repeatNum 变化会重置计时
  useEffect(() => {
    if (instance.duration <= 0 || instance.closing || hovered) return;
    const timer = setTimeout(() => closeMessage(instance.id), instance.duration);
    return () => clearTimeout(timer);
  }, [instance.duration, instance.closing, instance.id, instance.repeatNum, hovered]);

  const transitionClasses = [
    phase === "enter-from" &&
      "el-message-fade-enter-active el-message-fade-enter-from",
    phase === "enter" && "el-message-fade-enter-active",
    phase === "leave" &&
      "el-message-fade-leave-active el-message-fade-leave-to",
  ]
    .filter(Boolean)
    .join(" ");

  /**
   * 类名与官方 message.vue 的 class 绑定一致：
   * el-message + el-message--{type} + is-closable / is-plain / is-bottom +
   * 水平方位类。官方用 is-bottom 表示垂直方向在下，上方向不加类。
   */
  const classes = [
    "el-message",
    `el-message--${instance.type}`,
    instance.showClose && "is-closable",
    instance.plain && "is-plain",
    position.verticalProp === "bottom" && "is-bottom",
    position.horizontalClass,
    instance.customClass,
    transitionClasses,
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {
    zIndex: instance.zIndex,
    [position.verticalProp]: `${position.edge}px`,
  };

  // 官方允许 message 传函数以延迟求值，渲染时统一取结果
  const contentNode: ReactNode =
    typeof instance.content === "function" ? instance.content() : instance.content;

  const element = (
    <div
      ref={ref}
      className={classes}
      style={style}
      role="alert"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {instance.repeatNum > 1 && (
        <ElBadge
          className="el-message__badge"
          value={instance.repeatNum}
          type={toBadgeType(instance.type)}
        />
      )}

      <ElIcon className={`el-message__icon el-message-icon--${instance.type}`}>
        {instance.icon ?? TYPE_ICONS[instance.type]}
      </ElIcon>

      {instance.dangerouslyUseHTMLString && typeof contentNode === "string" ? (
        // 官方在此处也有相同的安全提示：不要传入用户可控内容
        <p
          className="el-message__content"
          dangerouslySetInnerHTML={{ __html: contentNode }}
        />
      ) : (
        <p className="el-message__content">{contentNode}</p>
      )}

      {instance.showClose && (
        <ElIcon
          className="el-message__closeBtn"
          onClick={() => closeMessage(instance.id)}
        >
          <Close />
        </ElIcon>
      )}
    </div>
  );

  // 对应官方 appendTo：每条消息可挂到不同容器
  if (instance.appendTo && typeof document !== "undefined") {
    return createPortal(element, resolveAppendTo(instance.appendTo));
  }

  return element;
}

/** 对应官方 message.vue 的 horizontalClass 计算。 */
function placementClasses(placement: MessagePlacement) {
  return {
    verticalProp: (placement.startsWith("top") ? "top" : "bottom") as
      | "top"
      | "bottom",
    horizontalClass: placement.includes("left")
      ? "is-left"
      : placement.includes("right")
        ? "is-right"
        : "is-center",
  };
}

/**
 * Message 的渲染容器，对应官方 method.ts 里挂载实例的部分。
 *
 * 官方把每个实例渲染成独立 DOM 节点，位置由前一个实例暴露的 bottom 累加得出；
 * React 侧用一个容器组件统一渲染，堆叠算法与之等价：
 * 同一 placement 内首个用 offset，后续每个是「前一个的底边 + 16px」。
 */
export default function ElMessageContainer() {
  const messages = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [heights, setHeights] = useState<Record<number, number>>({});

  const handleHeight = useCallback((id: number, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  // ESC 关闭全部，与官方一致
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAllMessages();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const positions = useMemo(() => {
    const result: Record<number, MessagePosition> = {};
    const groups = new Map<MessagePlacement, MessageInstance[]>();

    for (const m of messages) {
      const list = groups.get(m.placement) ?? [];
      list.push(m);
      groups.set(m.placement, list);
    }

    for (const [placement, list] of groups) {
      const { verticalProp, horizontalClass } = placementClasses(placement);
      let accumulated = 0;

      list.forEach((m, index) => {
        // 对应官方 getOffsetOrSpace：首个用 offset，其余固定 16px 间距
        const edge = index === 0 ? m.offset : accumulated + STACK_GAP;
        accumulated = edge + (heights[m.id] ?? 0);
        result[m.id] = { edge, verticalProp, horizontalClass };
      });
    }

    return result;
  }, [messages, heights]);

  return (
    <>
      {messages.map((m) => {
        const position = positions[m.id];
        if (!position) return null;
        return (
          <MessageItem
            key={m.id}
            instance={m}
            position={position}
            onHeight={handleHeight}
          />
        );
      })}
    </>
  );
}
