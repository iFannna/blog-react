/**
 * Message — Element Plus replica: imperative global toast API.
 *
 * Usage:
 *   import { message } from "@/stores/message";
 *   message.success("saved");
 *   message({ message: "hi", type: "info", placement: "top-right", duration: 3000, showClose: true });
 *
 * The React rendering lives in MessageContainer.tsx, which subscribes to this
 * store via useSyncExternalStore. The store is client-only; on the server it
 * stays empty (no mutations), so SSR is safe.
 */

export type MessageType = "primary" | "success" | "info" | "warning" | "error";

export type MessagePlacement =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

export interface MessageOptions {
  /** Toast body text. Default "". */
  message?: string;
  /** Message type. Default "info". */
  type?: MessageType;
  /** Auto-close after N ms. 0 = stay until manually closed. Default 3000. */
  duration?: number;
  /** Show the close (x) button. Default false. */
  showClose?: boolean;
  /** Distance (rem) from the viewport edge — top for top placements, bottom for bottom. Default 1.6. */
  offset?: number;
  /** Placement. Default "top". */
  placement?: MessagePlacement;
  /** Called once when the toast closes. */
  onClose?: () => void;
}

export interface MessageInstance {
  id: number;
  type: MessageType;
  content: string;
  duration: number;
  showClose: boolean;
  offset: number;
  placement: MessagePlacement;
  zIndex: number;
  /** True once close() has been requested — drives the leave animation. */
  closing: boolean;
  onClose?: () => void;
}

export interface MessageHandler {
  close: () => void;
}

export interface MessageFn {
  (options?: string | MessageOptions): MessageHandler;
  primary: (options: string | MessageOptions) => MessageHandler;
  success: (options: string | MessageOptions) => MessageHandler;
  info: (options: string | MessageOptions) => MessageHandler;
  warning: (options: string | MessageOptions) => MessageHandler;
  error: (options: string | MessageOptions) => MessageHandler;
  closeAll: () => void;
}

const DEFAULT_DURATION = 3000;
const DEFAULT_OFFSET = 5;
const DEFAULT_PLACEMENT: MessagePlacement = "top";
const BASE_Z_INDEX = 2003;
const LEAVE_MS = 400;

let seed = 1;
let zIndexSeed = BASE_Z_INDEX;
let instances: MessageInstance[] = [];
const EMPTY: MessageInstance[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Subscribe to store changes (for useSyncExternalStore). */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Current instance list (snapshot for useSyncExternalStore). */
export function getSnapshot(): MessageInstance[] {
  return instances;
}

/** SSR snapshot — always empty (store is never mutated on the server). */
export function getServerSnapshot(): MessageInstance[] {
  return EMPTY;
}

function normalize(options?: string | MessageOptions): MessageOptions {
  if (options === undefined) return { message: "" };
  return typeof options === "string" ? { message: options } : options;
}

function withType(options: string | MessageOptions, type: MessageType): MessageOptions {
  const opts = normalize(options);
  return { ...opts, type };
}

/** Begin the leave animation for a toast (removed after the animation finishes). */
export function closeMessage(id: number) {
  const inst = instances.find((m) => m.id === id);
  if (!inst || inst.closing) return;
  inst.onClose?.();
  // New array + new object so useSyncExternalStore detects the change.
  instances = instances.map((m) =>
    m.id === id ? { ...m, closing: true } : m,
  );
  emit();
}

/** Remove a toast from the store immediately (called after the leave animation). */
export function removeMessage(id: number) {
  if (!instances.some((m) => m.id === id)) return;
  instances = instances.filter((m) => m.id !== id);
  emit();
}

/** Begin the leave animation for every open toast. */
export function closeAllMessages() {
  let changed = false;
  const next = instances.map((m) => {
    if (m.closing) return m;
    changed = true;
    m.onClose?.();
    return { ...m, closing: true };
  });
  if (changed) {
    instances = next;
    emit();
  }
}

export const LEAVE_DURATION_MS = LEAVE_MS;

const message: MessageFn = (options) => {
  const opts = normalize(options);
  const id = seed++;
  const inst: MessageInstance = {
    id,
    type: opts.type ?? "info",
    content: opts.message ?? "",
    duration: opts.duration ?? DEFAULT_DURATION,
    showClose: opts.showClose ?? false,
    offset: opts.offset ?? DEFAULT_OFFSET,
    placement: opts.placement ?? DEFAULT_PLACEMENT,
    zIndex: zIndexSeed++,
    closing: false,
    onClose: opts.onClose,
  };
  instances = [...instances, inst];
  emit();
  return { close: () => closeMessage(id) };
};

message.primary = (options) => message(withType(options, "primary"));
message.success = (options) => message(withType(options, "success"));
message.info = (options) => message(withType(options, "info"));
message.warning = (options) => message(withType(options, "warning"));
message.error = (options) => message(withType(options, "error"));
message.closeAll = closeAllMessages;

export { message };
