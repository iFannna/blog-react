/**
 * ElNotification 的实例存储，对应官方 notification/src/notify.ts 的职责。
 *
 * 官方命令式挂载 Vue 组件；React 侧用「模块级 store + useSyncExternalStore」，
 * 对外 API 与官方一致：
 *   Notification.success({ title: "标题", message: "内容" })
 */

import type { ReactNode } from "react";
import { getGlobalConfig } from "../config-provider/context";
import { nextZIndex } from "../config-provider/use-z-index";
import type { ProgressProps } from "../progress";

export type NotificationType = "primary" | "success" | "info" | "warning" | "error";
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

/** 进度条可配置项，对应官方 progress 传入 ElProgress 的对象形式 */
export type NotificationProgressOptions = Pick<
  ProgressProps,
  "color" | "status" | "strokeWidth" | "type" | "showText" | "striped" | "stripedFlow"
>;

export interface NotificationOptions {
  /** 标题 */
  title?: ReactNode;
  /** 正文，可为函数以延迟求值 */
  message?: ReactNode | (() => ReactNode);
  /** 类型 */
  type?: NotificationType;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 自定义关闭图标 */
  closeIcon?: ReactNode;
  /** 自动关闭时长（毫秒），0 表示不自动关闭 */
  duration?: number;
  /** 位置 */
  position?: NotificationPosition;
  /** 距视口边缘的偏移（px） */
  offset?: number;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 自动关闭进度条，可传对象自定义颜色等 */
  progress?: boolean | NotificationProgressOptions;
  /** 是否悬停暂停自动关闭 */
  pauseOnHover?: boolean;
  /** 是否以 HTML 渲染 message */
  dangerouslyUseHTMLString?: boolean;
  /** 挂载目标 */
  appendTo?: string | HTMLElement;
  /** 自定义类名 */
  customClass?: string;
  /** 层级 */
  zIndex?: number;
  /** 点击通知的回调 */
  onClick?: () => void;
  /** 关闭时的回调 */
  onClose?: () => void;
}

export interface NotificationState {
  id: number;
  title: ReactNode;
  message: ReactNode | (() => ReactNode);
  type?: NotificationType;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  duration: number;
  position: NotificationPosition;
  offset: number;
  showClose: boolean;
  progress: boolean | NotificationProgressOptions;
  pauseOnHover: boolean;
  dangerouslyUseHTMLString: boolean;
  appendTo?: string | HTMLElement;
  customClass?: string;
  zIndex: number;
  onClick?: () => void;
  onClose?: () => void;
  closing: boolean;
}

export const NOTIFICATION_DEFAULTS = {
  duration: 4500,
  position: "top-right" as NotificationPosition,
  offset: 0,
};

export const LEAVE_DURATION_MS = 300;

let seed = 1;
let instances: NotificationState[] = [];
const EMPTY: NotificationState[] = [];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): NotificationState[] {
  return instances;
}

export function getServerSnapshot(): NotificationState[] {
  return EMPTY;
}

export function closeNotification(id: number) {
  const inst = instances.find((n) => n.id === id);
  if (!inst || inst.closing) return;

  inst.onClose?.();
  instances = instances.map((n) => (n.id === id ? { ...n, closing: true } : n));
  emit();
}

export function removeNotification(id: number) {
  if (!instances.some((n) => n.id === id)) return;
  instances = instances.filter((n) => n.id !== id);
  emit();
}

export function closeAllNotifications() {
  let changed = false;
  const next = instances.map((n) => {
    if (n.closing) return n;
    changed = true;
    n.onClose?.();
    return { ...n, closing: true };
  });

  if (changed) {
    instances = next;
    emit();
  }
}

function normalize(options?: string | NotificationOptions): NotificationOptions {
  if (options === undefined) return {};
  return typeof options === "string" ? { message: options } : options;
}

function withType(
  options: string | NotificationOptions,
  type: NotificationType,
): NotificationOptions {
  return { ...normalize(options), type };
}

const Notification = (options?: string | NotificationOptions) => {
  const opts = normalize(options);

  const state: NotificationState = {
    id: seed++,
    title: opts.title ?? "",
    message: opts.message ?? "",
    type: opts.type,
    icon: opts.icon,
    closeIcon: opts.closeIcon,
    duration: opts.duration ?? NOTIFICATION_DEFAULTS.duration,
    position: opts.position ?? NOTIFICATION_DEFAULTS.position,
    offset: opts.offset ?? NOTIFICATION_DEFAULTS.offset,
    showClose: opts.showClose ?? true,
    progress: opts.progress ?? false,
    pauseOnHover: opts.pauseOnHover ?? true,
    dangerouslyUseHTMLString: opts.dangerouslyUseHTMLString ?? false,
    appendTo: opts.appendTo,
    customClass: opts.customClass,
    zIndex: opts.zIndex ?? nextZIndex(getGlobalConfig()?.zIndex),
    onClick: opts.onClick,
    onClose: opts.onClose,
    closing: false,
  };

  instances = [...instances, state];
  emit();

  return { close: () => closeNotification(state.id) };
};

/** 与官方一致：Notification 上挂各类型的快捷方法。 */
export const notification = Object.assign(Notification, {
  primary: (options: string | NotificationOptions) =>
    Notification(withType(options, "primary")),
  success: (options: string | NotificationOptions) =>
    Notification(withType(options, "success")),
  info: (options: string | NotificationOptions) =>
    Notification(withType(options, "info")),
  warning: (options: string | NotificationOptions) =>
    Notification(withType(options, "warning")),
  error: (options: string | NotificationOptions) =>
    Notification(withType(options, "error")),
  closeAll: closeAllNotifications,
});

export type NotificationFn = typeof notification;
