/**
 * ElLoading 的实例管理，对应官方 loading/src/service.ts 的职责。
 *
 * 官方是往目标元素里挂一个 Vue 实例并操作其真实 DOM；
 * React 侧改为「模块级 store + 容器组件」，容器把遮罩渲染到目标元素内。
 *
 * 用法与官方一致：
 *   const loading = Loading.service({ target: "#app" });
 *   loading.close();
 */

import { getGlobalConfig } from "../config-provider/context";
import { nextZIndex } from "../config-provider/use-z-index";

export interface LoadingOptions {
  /**
   * 需要覆盖的目标元素。传字符串会经 querySelector 解析，
   * 不传时覆盖整个页面（body）。
   */
  target?: HTMLElement | string;
  /** 遮罩背景色 */
  background?: string;
  /** 自定义加载图标 */
  spinner?: boolean | string;
  /** 自定义 spinner 的 svg viewBox，对应官方 svgViewBox */
  svgViewBox?: string;
  /** 加载文案 */
  text?: string;
  /** 是否全屏 */
  fullscreen?: boolean;
  /**
   * 全屏时是否锁定页面滚动。
   * 开启后会给 body 加 `el-loading-parent--hidden`。
   */
  lock?: boolean;
  /** 自定义类名 */
  customClass?: string;
  /** 关闭前的钩子，返回 false 阻止关闭 */
  beforeClose?: () => boolean;
  /** 完全关闭后的回调 */
  closed?: () => void;
  /** 层级 */
  zIndex?: number;
}

export interface LoadingInstance {
  /** 关闭加载 */
  close: () => void;
  /** 目标元素解析结果 */
  target: HTMLElement;
}

export interface LoadingState extends LoadingOptions {
  id: number;
  /** 解析后的真实目标元素 */
  resolvedTarget: HTMLElement;
  /** 关闭后是否保留（用于过渡动画） */
  closing: boolean;
  zIndex?: number;
  /** 关闭前的 body 原始样式，用于还原 */
  originalBodyOverflow?: string;
  originalBodyPosition?: string;
}

export const LEAVE_DURATION_MS = 300;

let seed = 1;
let instances: LoadingState[] = [];
const EMPTY: LoadingState[] = [];

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

export function getSnapshot(): LoadingState[] {
  return instances;
}

export function getServerSnapshot(): LoadingState[] {
  return EMPTY;
}

/** 解析 target：字符串走 querySelector，失败或未传时回落到 body */
function resolveTarget(target?: HTMLElement | string): HTMLElement {
  if (typeof window === "undefined") return document.body as unknown as HTMLElement;

  if (!target) return document.body;

  if (typeof target === "string") {
    return document.querySelector(target) ?? document.body;
  }

  return target;
}

export function removeLoading(id: number) {
  const inst = instances.find((l) => l.id === id);
  if (!inst) return;

  // 还原 body 样式
  if (inst.fullscreen || inst.resolvedTarget === document.body) {
    if (inst.originalBodyOverflow !== undefined) {
      document.body.style.overflow = inst.originalBodyOverflow;
    }
    if (inst.originalBodyPosition !== undefined) {
      document.body.style.position = inst.originalBodyPosition;
    }

    if (inst.lock) {
      document.body.classList.remove("el-loading-parent--hidden");
    }
  }

  instances = instances.filter((l) => l.id !== id);
  emit();
}

export function closeLoading(id: number) {
  const inst = instances.find((l) => l.id === id);
  if (!inst || inst.closing) return;

  if (inst.beforeClose && inst.beforeClose() === false) return;

  instances = instances.map((l) => (l.id === id ? { ...l, closing: true } : l));
  emit();

  setTimeout(() => {
    removeLoading(id);
    inst.closed?.();
  }, LEAVE_DURATION_MS);
}

export function closeAllLoading() {
  for (const inst of instances) {
    if (!inst.closing) closeLoading(inst.id);
  }
}

/**
 * 对应官方 Loading.service(options)。
 *
 * 全屏或目标为 body 时：
 * - 给 body 加 `el-loading-parent--relative`，让遮罩的 absolute 定位基于它
 * - lock 开启时再加 `el-loading-parent--hidden` 锁滚动
 */
export function createLoading(options: LoadingOptions = {}): LoadingInstance {
  const resolvedTarget = resolveTarget(options.target);
  // 与官方一致：未指定 target 时以 body 为目标，且默认按全屏处理
  const isFullscreen =
    resolvedTarget === document.body && (options.fullscreen ?? true);

  const id = seed++;

  const state: LoadingState = {
    ...options,
    id,
    resolvedTarget,
    closing: false,
    zIndex:
      options.zIndex ??
      (isFullscreen ? nextZIndex(getGlobalConfig()?.zIndex) : undefined),
    fullscreen: isFullscreen,
  };

  // 记录并修改 body 样式
  if (isFullscreen || resolvedTarget === document.body) {
    state.originalBodyOverflow = document.body.style.overflow;
    state.originalBodyPosition = document.body.style.position;

    if (isFullscreen) {
      // 全屏时锁住页面滚动
      document.body.classList.add("el-loading-parent--relative");
      if (options.lock) {
        document.body.classList.add("el-loading-parent--hidden");
      }
    }
  }

  instances = [...instances, state];
  emit();

  return {
    close: () => closeLoading(id),
    target: resolvedTarget,
  };
}

/**
 * 给目标元素加定位类，对应官方 addClassList。
 *
 * 用 `loading-number` 属性做引用计数：同一目标上叠加多个 loading 时，
 * 每个实例都会 +1，只有计数归零才移除 `el-loading-parent--relative`。
 * 否则先关闭的那个会把还在使用的定位类一并摘掉。
 */
export function addLoadingClass(target: HTMLElement, isFullscreen: boolean) {
  const current = target.getAttribute("loading-number");
  const next = current ? Number.parseInt(current, 10) + 1 : 1;
  target.setAttribute("loading-number", String(next));

  const position = getComputedStyle(target).position;
  if (!["absolute", "fixed", "sticky"].includes(position)) {
    target.classList.add("el-loading-parent--relative");
  }

  if (isFullscreen) {
    target.classList.add("el-loading-parent--hidden");
  }
}

/** 对应官方 destroySelf 里的清理：计数归零才摘类 */
export function removeLoadingClass(target: HTMLElement) {
  const current = target.getAttribute("loading-number");
  const next = current ? Number.parseInt(current, 10) - 1 : 0;

  if (next <= 0) {
    target.classList.remove("el-loading-parent--relative");
    target.removeAttribute("loading-number");
  } else {
    target.setAttribute("loading-number", String(next));
  }

  target.classList.remove("el-loading-parent--hidden");
}

/**
 * 命令式 API，对应官方 `ElLoading.service`。
 * Loading 没有类型之分，故只暴露 service。
 */
export const Loading = {
  service: createLoading,
  closeAll: closeAllLoading,
};
