/**
 * ElMessage 的实例存储，对应官方 message/src/instance.ts 与 method.ts 的职责。
 *
 * 官方是命令式挂载 Vue 组件（createVNode + render），
 * React 侧改为「模块级 store + useSyncExternalStore」，
 * 对外 API 与官方一致，用法保持 message.success("已保存")。
 *
 * 与官方的对应关系：
 * - placementInstances（按位置分组）→ instances 里带 placement 字段，消费侧再分组
 * - getOffsetOrSpace 的 16px 间距 → STACK_GAP
 * - 每个实例暴露的 bottom → 消费侧测量高度后累加
 */

import { getGlobalConfig } from "../config-provider/context";
import type { MessageConfigContext } from "../config-provider/types";

export type MessageType = "primary" | "success" | "info" | "warning" | "error";

export const messagePlacement = [
  "top",
  "top-left",
  "top-right",
  "bottom",
  "bottom-left",
  "bottom-right",
] as const;

export type MessagePlacement = (typeof messagePlacement)[number];

export const MESSAGE_DEFAULT_PLACEMENT: MessagePlacement = "top";

/** 与官方 messageDefaults.offset 一致，单位 px。 */
export const DEFAULT_OFFSET = 16;

/** 与官方 getOffsetOrSpace 一致：非首个实例的堆叠间距固定 16px。 */
export const STACK_GAP = 16;

/** 对应官方 messageDefaults.duration。 */
export const DEFAULT_DURATION = 3000;

/** 离场动画时长，与官方 el-message-fade 过渡时长对应。 */
export const LEAVE_DURATION_MS = 300;

export interface MessageOptions {
  /** 消息文字，对应官方 string | VNode | function */
  message?: React.ReactNode | (() => React.ReactNode);
  /** 消息类型 */
  type?: MessageType;
  /** 是否以 HTML 片段渲染 message */
  dangerouslyUseHTMLString?: boolean;
  /** 自定义图标 */
  icon?: React.ReactNode;
  /** 自定义类名 */
  customClass?: string;
  /** 显示时长（毫秒），0 表示不自动关闭 */
  duration?: number;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 是否使用朴素样式 */
  plain?: boolean;
  /** 距离视口边缘的距离（px） */
  offset?: number;
  /** 位置 */
  placement?: MessagePlacement;
  /** 层级 */
  zIndex?: number;
  /** 相同内容是否合并为一条并显示数量徽标 */
  grouping?: boolean;
  /** 挂载目标，默认 body */
  appendTo?: string | HTMLElement;
  /** 关闭时的回调 */
  onClose?: () => void;
}

export interface MessageInstance {
  id: number;
  type: MessageType;
  content: React.ReactNode | (() => React.ReactNode);
  dangerouslyUseHTMLString: boolean;
  icon?: React.ReactNode;
  customClass?: string;
  duration: number;
  showClose: boolean;
  plain: boolean;
  offset: number;
  placement: MessagePlacement;
  zIndex: number;
  /** 合并次数，对应官方 repeatNum */
  repeatNum: number;
  appendTo?: string | HTMLElement;
  /** 已请求关闭，正在播放离场动画 */
  closing: boolean;
  onClose?: () => void;
}

export interface MessageHandler {
  /** 手动关闭本条消息 */
  close: () => void;
}

export interface MessageFn {
  (options?: string | MessageOptions): MessageHandler;
  primary: (options: string | MessageOptions) => MessageHandler;
  success: (options: string | MessageOptions) => MessageHandler;
  info: (options: string | MessageOptions) => MessageHandler;
  warning: (options: string | MessageOptions) => MessageHandler;
  error: (options: string | MessageOptions) => MessageHandler;
  /** 关闭全部消息 */
  closeAll: () => void;
}

let seed = 1;
let zIndexSeed = 2003;
let instances: MessageInstance[] = [];
const EMPTY: MessageInstance[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** 供 useSyncExternalStore 订阅 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): MessageInstance[] {
  return instances;
}

/** SSR 快照，store 在服务端始终为空 */
export function getServerSnapshot(): MessageInstance[] {
  return EMPTY;
}

function normalize(options?: string | MessageOptions): MessageOptions {
  if (options === undefined) return { message: "" };
  return typeof options === "string" ? { message: options } : options;
}

function withType(
  options: string | MessageOptions,
  type: MessageType,
): MessageOptions {
  return { ...normalize(options), type };
}

/** 开始离场动画，动画结束后由消费侧调用 removeMessage 真正移除 */
export function closeMessage(id: number) {
  const inst = instances.find((m) => m.id === id);
  if (!inst || inst.closing) return;

  inst.onClose?.();
  // 换新数组与新对象，useSyncExternalStore 才能感知变化
  instances = instances.map((m) => (m.id === id ? { ...m, closing: true } : m));
  emit();
}

/** 离场动画结束后立即移除 */
export function removeMessage(id: number) {
  if (!instances.some((m) => m.id === id)) return;
  instances = instances.filter((m) => m.id !== id);
  emit();
}

/** 关闭全部 */
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

const message: MessageFn = (options) => {
  const opts = normalize(options);
  // 对应官方 messageConfig：ConfigProvider 下发的 message 配置作为兜底，
  // 显式传入的 options 优先；placement 未传时用全局配置的 placement
  const globalMessageConfig: MessageConfigContext =
    getGlobalConfig()?.message ?? {};

  const placement = messagePlacement.includes(opts.placement as MessagePlacement)
    ? (opts.placement as MessagePlacement)
    : (globalMessageConfig.placement as MessagePlacement | undefined) &&
        messagePlacement.includes(
          globalMessageConfig.placement as MessagePlacement,
        )
      ? (globalMessageConfig.placement as MessagePlacement)
      : MESSAGE_DEFAULT_PLACEMENT;

  const grouping = opts.grouping ?? globalMessageConfig.grouping ?? false;
  const content = opts.message ?? "";

  // 对应官方 grouping：同位置、同内容的消息合并，重复次数 +1 并刷新类型
  if (grouping) {
    const existing = instances.find(
      (m) => m.placement === placement && !m.closing && m.content === content,
    );

    if (existing) {
      instances = instances.map((m) =>
        m.id === existing.id
          ? { ...m, type: opts.type ?? "info", repeatNum: m.repeatNum + 1 }
          : m,
      );
      emit();
      return { close: () => closeMessage(existing.id) };
    }
  }

  const id = seed++;

  const inst: MessageInstance = {
    id,
    type: opts.type ?? "info",
    content,
    dangerouslyUseHTMLString: opts.dangerouslyUseHTMLString ?? false,
    icon: opts.icon,
    customClass: opts.customClass,
    duration: opts.duration ?? globalMessageConfig.duration ?? DEFAULT_DURATION,
    showClose: opts.showClose ?? globalMessageConfig.showClose ?? false,
    plain: opts.plain ?? globalMessageConfig.plain ?? false,
    offset: opts.offset ?? globalMessageConfig.offset ?? DEFAULT_OFFSET,
    placement,
    zIndex: opts.zIndex ?? zIndexSeed++,
    repeatNum: 1,
    appendTo: opts.appendTo,
    closing: false,
    onClose: opts.onClose,
  };

  // 对应官方 messageConfig.max：同位置的数量达到上限时不再新增，返回空句柄
  if (
    typeof globalMessageConfig.max === "number" &&
    instances.filter((m) => m.placement === placement && !m.closing).length >=
      globalMessageConfig.max
  ) {
    return { close: () => undefined };
  }

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
