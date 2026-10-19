/**
 * ElMessageBox 的实例存储，对应官方 message-box/src/messageBox.ts 的职责。
 *
 * 官方是命令式挂载 Vue 组件并把 Promise 挂在实例上；
 * React 侧改为「模块级 store + useSyncExternalStore」，
 * 对外返回 Promise，用法与官方一致：
 *   MessageBox.confirm("确定删除？").then(() => ...).catch(() => ...)
 */

import type { CSSProperties, ReactNode } from "react";
import { getGlobalConfig, translate } from "../config-provider/context";
import { en } from "../config-provider/locales";

export type MessageBoxType = "primary" | "success" | "info" | "warning" | "error";
export type MessageBoxAction = "confirm" | "cancel" | "close";
export type MessageBoxButtonType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "text";

export type MessageBoxBoxType = "alert" | "confirm" | "prompt";

/** prompt 的确认结果带输入值，对应官方 MessageBoxData */
export type MessageBoxData =
  | MessageBoxAction
  | { value: string; action: MessageBoxAction };

/** message 为函数时收到的动作处理器，对应官方 message({ confirm, cancel, close }) */
export interface MessageBoxActionHelpers {
  confirm: () => void;
  cancel: () => void;
  close: () => void;
}

/** beforeClose / callback 收到的实例 API，对应官方组件实例常用字段 */
export interface MessageBoxInstanceApi {
  inputValue: string;
  action?: MessageBoxAction;
  confirmButtonLoading: boolean;
  cancelButtonLoading: boolean;
  confirmButtonDisabled: boolean;
  /** 可在 beforeClose 中改写按钮文案，对应官方 instance.confirmButtonText */
  confirmButtonText: string;
  cancelButtonText: string;
  doClose: () => void;
  /** 兼容官方实例上的属性赋值写法 */
  setConfirmButtonLoading: (loading: boolean) => void;
  setCancelButtonLoading: (loading: boolean) => void;
}

export interface MessageBoxOptions {
  /** 标题。传 null 不渲染头部 */
  title?: ReactNode;
  /** 消息正文，可为函数以获取 confirm/cancel/close 处理器 */
  message?:
    | ReactNode
    | ((helpers: MessageBoxActionHelpers) => ReactNode);
  /** 图标类型 */
  type?: MessageBoxType;
  /** 自定义图标 */
  icon?: ReactNode;
  /** 是否显示取消按钮 */
  showCancelButton?: boolean;
  /** 是否显示确认按钮 */
  showConfirmButton?: boolean;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 确认按钮文案 */
  confirmButtonText?: string;
  /** 取消按钮文案 */
  cancelButtonText?: string;
  /** 确认按钮类型 */
  confirmButtonType?: MessageBoxButtonType;
  /** 取消按钮类型 */
  cancelButtonType?: MessageBoxButtonType;
  /** 是否让内容居中 */
  center?: boolean;
  /** 是否显示遮罩 */
  modal?: boolean;
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean;
  /** 按 ESC 是否关闭 */
  closeOnPressEscape?: boolean;
  /**
   * 是否区分「取消」与「关闭」：
   * 开启后点关闭按钮会以 'close' 拒绝，否则以 'cancel' 拒绝。
   */
  distinguishCancelAndClose?: boolean;
  /** 是否显示输入框 */
  showInput?: boolean;
  /** 输入框占位文本 */
  inputPlaceholder?: string;
  /** 输入框初始值 */
  inputValue?: string;
  /** 输入框类型 */
  inputType?: string;
  /** 输入内容必须匹配的正则 */
  inputPattern?: RegExp;
  /** 输入校验函数，返回字符串表示错误信息 */
  inputValidator?: (value: string) => string | boolean | undefined;
  /** 输入错误时的提示文案 */
  inputErrorMessage?: string;
  /** 是否把 message 当 HTML 渲染 */
  dangerouslyUseHTMLString?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: ReactNode;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 拖拽是否允许超出视口 */
  overflow?: boolean;
  /** 是否锁定 body 滚动 */
  lockScroll?: boolean;
  /** 是否在 hash 变化时关闭 */
  closeOnHashChange?: boolean;
  /** 关闭后回调。传入后 Promise 不再 resolve/reject，由回调接管 */
  callback?: (result: MessageBoxData, instance: MessageBoxInstanceApi) => void;
  /** 自定义类名 */
  customClass?: string;
  /** 自定义样式 */
  customStyle?: CSSProperties;
  /** 遮罩类名 */
  modalClass?: string;
  /** 确认按钮 class */
  confirmButtonClass?: string;
  /** 取消按钮 class */
  cancelButtonClass?: string;
  /** 按钮尺寸 */
  btnSize?: "small" | "default" | "large";
  /** 是否圆角按钮 */
  roundButton?: boolean;
  /** 挂载目标 */
  appendTo?: string | HTMLElement;
  /** 内部使用：区分 alert / confirm / prompt */
  boxType?: MessageBoxBoxType;
  /** 层级 */
  zIndex?: number;
  /** 关闭前的钩子。官方签名为 (action, instance, done)；
   * 为保证既有两参调用仍可用，函数参数少于 3 个时按 (action, done) 调用 */
  beforeClose?: (
    action: MessageBoxAction,
    instance: MessageBoxInstanceApi,
    done: () => void,
  ) => void;
}

export interface MessageBoxState extends Required<
  Pick<
    MessageBoxOptions,
    | "title"
    | "message"
    | "showCancelButton"
    | "showConfirmButton"
    | "showClose"
    | "confirmButtonText"
    | "cancelButtonText"
    | "confirmButtonType"
    | "cancelButtonType"
    | "center"
    | "modal"
    | "closeOnClickModal"
    | "closeOnPressEscape"
    | "distinguishCancelAndClose"
    | "showInput"
  >
> {
  id: number;
  type?: MessageBoxType;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  inputPlaceholder?: string;
  inputValue?: string;
  inputType?: string;
  inputPattern?: RegExp;
  inputValidator?: (value: string) => string | boolean | undefined;
  inputErrorMessage: string;
  dangerouslyUseHTMLString: boolean;
  draggable: boolean;
  overflow: boolean;
  lockScroll: boolean;
  closeOnHashChange: boolean;
  customClass?: string;
  customStyle?: CSSProperties;
  modalClass?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  btnSize?: "small" | "default" | "large";
  roundButton: boolean;
  appendTo?: string | HTMLElement;
  callback?: (result: MessageBoxData, instance: MessageBoxInstanceApi) => void;
  zIndex: number;
  beforeClose?: (
    action: MessageBoxAction,
    instance: MessageBoxInstanceApi,
    done: () => void,
  ) => void;
  /** 对应官方 boxType：alert / confirm / prompt。prompt 确认前要过输入校验 */
  boxType: MessageBoxBoxType;
  /** 按钮 loading / 禁用状态，供 beforeClose 异步场景使用 */
  confirmButtonLoading: boolean;
  cancelButtonLoading: boolean;
  confirmButtonDisabled: boolean;
  /** 已选择的动作 */
  action?: MessageBoxAction;
  /** 正在播放离场动画 */
  closing: boolean;
  /** 输入框当前的错误提示 */
  validationError: string;
  /** 是否已完成动作，避免重复 resolve */
  settled: boolean;
}

export interface MessageBoxHandler {
  /** 关闭对话框，action 决定 Promise 的走向 */
  close: (action?: MessageBoxAction) => void;
}

/**
 * 每次调用返回的 Promise，与官方一致：
 * 确认时 resolve（prompt 为 { value, action }），取消/关闭时 reject('cancel' | 'close')。
 */
export type MessageBoxPromise = Promise<MessageBoxData> & MessageBoxHandler;

/**
 * 默认文案，与官方 locale 的 messagebox 段对应（此处以英文包为准，供对照）。
 * 实际调用时若 ConfigProvider 下发了 locale，会优先取该语言包的文案。
 */
export const MESSAGE_BOX_DEFAULTS = {
  title: "Message",
  confirm: "OK",
  cancel: "Cancel",
  error: "Illegal input",
} as const;

export const LEAVE_DURATION_MS = 300;

let seed = 1;
let zIndexSeed = 2001;
let instances: MessageBoxState[] = [];
const EMPTY: MessageBoxState[] = [];

const listeners = new Set<() => void>();

interface MessageBoxSettler {
  resolve: (result: MessageBoxData) => void;
  reject: (reason: MessageBoxAction) => void;
}

const resolvers = new Map<number, MessageBoxSettler>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): MessageBoxState[] {
  return instances;
}

export function getServerSnapshot(): MessageBoxState[] {
  return EMPTY;
}

/** 构造官方实例上常用的可变字段，供 beforeClose / callback 使用 */
export function getMessageBoxInstanceApi(
  id: number,
): MessageBoxInstanceApi | undefined {
  const current = getMessageBox(id);
  if (!current) return undefined;

  return {
    get inputValue() {
      return getMessageBox(id)?.inputValue ?? "";
    },
    set inputValue(value: string) {
      updateMessageBoxInput(id, value);
    },
    get action() {
      return getMessageBox(id)?.action;
    },
    get confirmButtonLoading() {
      return getMessageBox(id)?.confirmButtonLoading ?? false;
    },
    set confirmButtonLoading(loading: boolean) {
      setMessageBoxButtonState(id, { confirmButtonLoading: loading });
    },
    get cancelButtonLoading() {
      return getMessageBox(id)?.cancelButtonLoading ?? false;
    },
    set cancelButtonLoading(loading: boolean) {
      setMessageBoxButtonState(id, { cancelButtonLoading: loading });
    },
    get confirmButtonDisabled() {
      return getMessageBox(id)?.confirmButtonDisabled ?? false;
    },
    set confirmButtonDisabled(disabled: boolean) {
      setMessageBoxButtonState(id, { confirmButtonDisabled: disabled });
    },
    get confirmButtonText() {
      return getMessageBox(id)?.confirmButtonText ?? "";
    },
    set confirmButtonText(text: string) {
      setMessageBoxButtonState(id, { confirmButtonText: text });
    },
    get cancelButtonText() {
      return getMessageBox(id)?.cancelButtonText ?? "";
    },
    set cancelButtonText(text: string) {
      setMessageBoxButtonState(id, { cancelButtonText: text });
    },
    doClose: () => closeMessageBox(id, "close"),
    setConfirmButtonLoading: (loading) =>
      setMessageBoxButtonState(id, { confirmButtonLoading: loading }),
    setCancelButtonLoading: (loading) =>
      setMessageBoxButtonState(id, { cancelButtonLoading: loading }),
  };
}

/** 更新按钮状态，供异步 beforeClose 控制 loading */
export function setMessageBoxButtonState(
  id: number,
  patch: Partial<
    Pick<
      MessageBoxState,
      | "confirmButtonLoading"
      | "cancelButtonLoading"
      | "confirmButtonDisabled"
      | "confirmButtonText"
      | "cancelButtonText"
    >
  >,
) {
  if (!instances.some((m) => m.id === id)) return;
  instances = instances.map((m) => (m.id === id ? { ...m, ...patch } : m));
  emit();
}

/** 开始离场动画，并按官方语义结算 Promise 或调用 callback */
export function closeMessageBox(id: number, action: MessageBoxAction) {
  const inst = instances.find((m) => m.id === id);
  if (!inst || inst.closing) return;

  if (!inst.settled) {
    inst.settled = true;

    const result: MessageBoxData = inst.showInput
      ? { value: inst.inputValue ?? "", action }
      : action;

    if (inst.callback) {
      const api = getMessageBoxInstanceApi(id);
      if (api) inst.callback(result, api);
    } else if (action === "confirm") {
      resolvers.get(id)?.resolve(result);
    } else {
      // 官方：区分 close/cancel 时关闭按钮 reject('close')，其余取消场景 reject('cancel')
      const reason =
        inst.distinguishCancelAndClose && action === "close" ? "close" : "cancel";
      resolvers.get(id)?.reject(reason);
    }
  }

  instances = instances.map((m) => (m.id === id ? { ...m, closing: true, action } : m));
  emit();
}

/** 离场动画结束后移除 */
export function removeMessageBox(id: number) {
  if (!instances.some((m) => m.id === id)) return;
  instances = instances.filter((m) => m.id !== id);
  resolvers.delete(id);
  emit();
}

/** 更新输入框的值与校验状态 */
export function updateMessageBoxInput(id: number, value: string) {
  const inst = instances.find((m) => m.id === id);
  if (!inst) return;

  const patternInvalid = !!inst.inputPattern && !inst.inputPattern.test(value);
  const result = inst.inputValidator?.(value);
  const validationError = patternInvalid
    ? inst.inputErrorMessage
    : typeof result === "string"
      ? result
      : result === false
        ? inst.inputErrorMessage
        : "";

  instances = instances.map((m) =>
    m.id === id ? { ...m, inputValue: value, validationError } : m,
  );
  emit();
}

/**
 * prompt 确认前的输入校验，对应官方 validate：
 * 失败时把错误写进状态并返回 false，调用方据此阻止关闭。
 */
function validateInput(inst: NonNullable<ReturnType<typeof getMessageBox>>): boolean {
  const value = inst.inputValue ?? "";

  // 官方 validate：先匹配 inputPattern，再走 inputValidator
  if (inst.inputPattern && !inst.inputPattern.test(value)) {
    instances = instances.map((m) =>
      m.id === inst.id ? { ...m, validationError: m.inputErrorMessage } : m,
    );
    emit();
    return false;
  }

  const validator = inst.inputValidator;
  if (!validator) return true;

  const result = validator(value);

  if (typeof result === "string" && result) {
    instances = instances.map((m) =>
      m.id === inst.id ? { ...m, validationError: result } : m,
    );
    emit();
    return false;
  }

  if (result === false) {
    instances = instances.map((m) =>
      m.id === inst.id ? { ...m, validationError: m.inputErrorMessage } : m,
    );
    emit();
    return false;
  }

  return true;
}

function getMessageBox(id: number) {
  return instances.find((m) => m.id === id);
}

/**
 * 打开一个 MessageBox。
 *
 * 对应官方 MessageBox 的调用逻辑：
 * 有 beforeClose 时先交给它，由它决定何时调用 done；
 * 没有则直接关闭。返回的 Promise 在关闭时以动作名 resolve。
 */
/**
 * 动作的统一入口，对应官方 handleAction：
 * 1. prompt 确认前先过输入校验，失败留在原地
 * 2. 有 beforeClose 时交给它，由它决定何时调用 done
 * 3. 否则直接关闭
 *
 * 容器按钮与返回句柄都必须走这里，保证两条路径行为一致。
 */
export function dispatchMessageBoxAction(id: number, action: MessageBoxAction) {
  const inst = instances.find((m) => m.id === id);
  if (!inst || inst.closing) return;

  if (inst.boxType === "prompt" && action === "confirm" && !validateInput(inst)) {
    return;
  }

  if (inst.beforeClose) {
    const done = () => closeMessageBox(id, action);
    const instance = getMessageBoxInstanceApi(id);

    // 官方三参签名优先；既有二参调用仍按 (action, done) 工作
    if (inst.beforeClose.length >= 3 && instance) {
      inst.beforeClose(action, instance, done);
    } else {
      (inst.beforeClose as unknown as (
        action: MessageBoxAction,
        done: () => void,
      ) => void)(action, done);
    }
    return;
  }

  closeMessageBox(id, action);
}

export function createMessageBox(options: MessageBoxOptions): MessageBoxPromise {
  const id = seed++;

  // 对应官方 message-box/src/index.vue 的 t('el.messagebox.*') 兜底：
  // 调用方未传文案时取当前 locale
  const locale = getGlobalConfig()?.locale ?? en;
  const t = (path: string) => translate(path, locale);

  const state: MessageBoxState = {
    id,
    title: options.title === undefined ? t("el.messagebox.title") : options.title,
    message: options.message ?? "",
    type: options.type,
    icon: options.icon,
    showCancelButton: options.showCancelButton ?? false,
    showConfirmButton: options.showConfirmButton ?? true,
    showClose: options.showClose ?? true,
    confirmButtonText: options.confirmButtonText ?? t("el.messagebox.confirm"),
    cancelButtonText: options.cancelButtonText ?? t("el.messagebox.cancel"),
    confirmButtonType: options.confirmButtonType ?? "primary",
    cancelButtonType: options.cancelButtonType ?? "text",
    center: options.center ?? false,
    modal: options.modal ?? true,
    closeOnClickModal: options.closeOnClickModal ?? true,
    closeOnPressEscape: options.closeOnPressEscape ?? true,
    distinguishCancelAndClose: options.distinguishCancelAndClose ?? false,
    showInput: options.showInput ?? false,
    inputPlaceholder: options.inputPlaceholder,
    inputValue: options.inputValue ?? "",
    inputType: options.inputType ?? "text",
    inputPattern: options.inputPattern,
    inputValidator: options.inputValidator,
    inputErrorMessage: options.inputErrorMessage ?? t("el.messagebox.error"),
    dangerouslyUseHTMLString: options.dangerouslyUseHTMLString ?? false,
    closeIcon: options.closeIcon,
    draggable: options.draggable ?? false,
    overflow: options.overflow ?? false,
    lockScroll: options.lockScroll ?? true,
    closeOnHashChange: options.closeOnHashChange ?? true,
    customClass: options.customClass,
    customStyle: options.customStyle,
    modalClass: options.modalClass,
    confirmButtonClass: options.confirmButtonClass,
    cancelButtonClass: options.cancelButtonClass,
    btnSize: options.btnSize,
    roundButton: options.roundButton ?? false,
    appendTo: options.appendTo,
    callback: options.callback,
    zIndex: options.zIndex ?? zIndexSeed++,
    beforeClose: options.beforeClose,
    boxType:
      options.boxType ?? (options.showInput ? "prompt" : "alert"),
    confirmButtonLoading: false,
    cancelButtonLoading: false,
    confirmButtonDisabled: false,
    closing: false,
    validationError: "",
    settled: false,
  };

  instances = [...instances, state];
  emit();

  let resolveFn: (result: MessageBoxData) => void = () => {};
  let rejectFn: (reason: MessageBoxAction) => void = () => {};
  const promise = new Promise<MessageBoxData>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });
  resolvers.set(id, { resolve: resolveFn, reject: rejectFn });

  /** 供外部统一触发的关闭入口，走与容器一致的校验流程 */
  const handleAction = (action: MessageBoxAction = "confirm") => {
    dispatchMessageBoxAction(id, action);
  };

  (promise as MessageBoxPromise).close = handleAction;

  return promise as MessageBoxPromise;
}

/**
 * 参数归一化，对应官方 messageBox.ts 的 initInstance 逻辑：
 * 快捷方法同时支持三种签名
 *   alert(message)
 *   alert(message, title)
 *   alert(message, title, options)
 * 第三个参数是 options 时，message 与 title 覆盖其中的同名字段。
 */
type ShortcutMessage = MessageBoxOptions["message"];

type ShortcutArgs = [
  message: ShortcutMessage | MessageBoxOptions,
  titleOrOptions?: ReactNode | MessageBoxOptions,
  maybeOptions?: MessageBoxOptions,
];

function normalizeShortcut([message, title, options]: ShortcutArgs): MessageBoxOptions {
  // alert(options) 形式。ReactElement 自带 $$typeof，需排除，避免被当成配置对象
  if (
    typeof message === "object" &&
    message !== null &&
    !("$$typeof" in (message as object)) &&
    !Array.isArray(message)
  ) {
    return message as MessageBoxOptions;
  }

  // alert(message, options) 形式：第二参为对象且不像 ReactNode 时视为 options
  if (
    title !== undefined &&
    typeof title === "object" &&
    title !== null &&
    !("$$typeof" in (title as object)) &&
    !Array.isArray(title) &&
    options === undefined
  ) {
    return { ...(title as MessageBoxOptions), message: message as ShortcutMessage };
  }

  return {
    ...options,
    // 走到这里 message 已排除 options 对象，收窄为消息内容
    message: message as ShortcutMessage,
    // 走到这里 title 已排除 MessageBoxOptions，收窄为 ReactNode
    ...(title !== undefined ? { title: title as ReactNode } : {}),
  };
}

/**
 * 带类型的快捷方法，对应官方 MessageBox.alert / confirm / prompt。
 * alert 不显示取消按钮，confirm 显示取消按钮，prompt 额外显示输入框。
 */
export const MessageBox = Object.assign(
  (options: MessageBoxOptions | string) =>
    createMessageBox(
      typeof options === "string" ? { message: options } : options,
    ),
  {
    alert: (...args: ShortcutArgs) =>
      createMessageBox({
        // 官方 alert 默认禁用 ESC 与点击遮罩关闭
        closeOnPressEscape: false,
        closeOnClickModal: false,
        showCancelButton: false,
        ...normalizeShortcut(args),
        boxType: "alert",
      }),
    confirm: (...args: ShortcutArgs) =>
      createMessageBox({
        ...normalizeShortcut(args),
        showCancelButton: true,
        boxType: "confirm",
      }),
    prompt: (...args: ShortcutArgs) =>
      createMessageBox({
        ...normalizeShortcut(args),
        showCancelButton: true,
        showInput: true,
        boxType: "prompt",
      }),
    closeAll: () => {
      for (const inst of instances) {
        if (!inst.closing) closeMessageBox(inst.id, "close");
      }
    },
  },
);

export type MessageBoxFn = typeof MessageBox;
