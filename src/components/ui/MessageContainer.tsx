"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import {
  closeAllMessages,
  closeMessage,
  getServerSnapshot,
  getSnapshot,
  removeMessage,
  subscribe,
  LEAVE_DURATION_MS,
  type MessageInstance,
  type MessagePlacement,
} from "@/lib/message";

/* Element Plus filled icons (viewBox 0 0 1024 1024, fill: currentColor).
   primary and info share the InfoFilled icon (per Element Plus's type map). */
const INFO_ICON =
  "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.99 12.99 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z";

const ICON_PATHS: Record<MessageInstance["type"], string> = {
  primary: INFO_ICON,
  success:
    "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.27 38.27 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z",
  info: INFO_ICON,
  warning:
    "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.43 58.43 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.43 58.43 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4",
  error:
    "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z",
};

const CLOSE_PATH =
  "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z";

// Toast sizes/offsets are rem, but offsetHeight returns px — convert via the live rem base.
function getRemBase(): number {
  if (typeof window === "undefined") return 10;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
}

const MESSAGE_GAP_REM = 1.6;

interface MessagePosition {
  edge: number;
  verticalProp: "top" | "bottom";
  horizontalClass: string;
  verticalClass: string;
}

interface MessageItemProps {
  instance: MessageInstance;
  position: MessagePosition;
  onHeight: (id: number, height: number) => void;
}

function MessageItem({ instance, position, onHeight }: MessageItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Measure height so the stack can position subsequent toasts.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => onHeight(instance.id, el.offsetHeight / getRemBase());
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [instance.id, onHeight]);

  // Leave: remove the instance once the animation has played out.
  useEffect(() => {
    if (!instance.closing) return;
    const t = setTimeout(() => removeMessage(instance.id), LEAVE_DURATION_MS);
    return () => clearTimeout(t);
  }, [instance.closing, instance.id]);

  // Auto-close timer; paused while hovered (resumes with a fresh countdown).
  useEffect(() => {
    if (instance.duration <= 0 || instance.closing || hovered) return;
    const t = setTimeout(() => closeMessage(instance.id), instance.duration);
    return () => clearTimeout(t);
  }, [instance.duration, instance.closing, instance.id, hovered]);

  const phaseClass = instance.closing ? "is-leave" : "";
  const className = [
    "message",
    `is-${instance.type}`,
    position.horizontalClass,
    position.verticalClass,
    phaseClass,
  ]
    .filter(Boolean)
    .join(" ");

  // Offset and z-index are per-toast runtime values — inline style is the only
  // way (no <style> allowed, and classes can't express arbitrary offsets).
  const style: CSSProperties = { zIndex: instance.zIndex };
  style[position.verticalProp] = `${position.edge}rem`;

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      role="alert"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg className="message-icon" viewBox="0 0 1024 1024" aria-hidden="true">
        <path fill="currentColor" d={ICON_PATHS[instance.type]} />
      </svg>
      <p className="message-content">{instance.content}</p>
      {instance.showClose && (
        <button
          type="button"
          className="message-close"
          aria-label="关闭"
          onClick={() => closeMessage(instance.id)}
        >
          <svg viewBox="0 0 1024 1024" aria-hidden="true">
            <path fill="currentColor" d={CLOSE_PATH} />
          </svg>
        </button>
      )}
    </div>
  );
}

function placementClasses(placement: MessagePlacement) {
  const isBottom = placement.startsWith("bottom");
  return {
    verticalProp: (isBottom ? "bottom" : "top") as "top" | "bottom",
    verticalClass: isBottom ? "is-bottom" : "is-top",
    horizontalClass: placement.includes("left")
      ? "is-left"
      : placement.includes("right")
        ? "is-right"
        : "is-center",
  };
}

export default function MessageContainer() {
  const messages = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [heights, setHeights] = useState<Record<number, number>>({});

  const handleHeight = useCallback((id: number, height: number) => {
    setHeights((prev) =>
      prev[id] === height ? prev : { ...prev, [id]: height },
    );
  }, []);

  // ESC closes every open toast (Element Plus closes each instance on ESC).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAllMessages();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Group by placement and compute each toast's edge offset. First toast in a
  // placement sits at `offset`; each next toast is MESSAGE_GAP_REM past the
  // previous bottom.
  const positions = useMemo(() => {
    const pos: Record<number, MessagePosition> = {};
    const groups = new Map<MessagePlacement, MessageInstance[]>();
    for (const m of messages) {
      const arr = groups.get(m.placement) ?? [];
      arr.push(m);
      groups.set(m.placement, arr);
    }
    for (const [placement, list] of groups) {
      const classes = placementClasses(placement);
      let acc = 0;
      list.forEach((m, i) => {
        const edge = i === 0 ? m.offset : acc + MESSAGE_GAP_REM;
        acc = edge + (heights[m.id] ?? 0);
        pos[m.id] = { edge, ...classes };
      });
    }
    return pos;
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
