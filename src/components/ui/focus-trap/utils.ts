/**
 * 对应官方 focus-trap/src/utils.ts 的工具函数集合。
 */

/**
 * 对应官方 obtainAllFocusableElements。
 * 用 TreeWalker 遍历，跳过 disabled / hidden / hidden-input 节点，
 * 只保留 tabIndex >= 0 或当前已聚焦的元素。
 */
export function obtainAllFocusableElements(element: HTMLElement): HTMLElement[] {
  const nodes: HTMLElement[] = [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node: Element) {
      const el = node as HTMLElement & {
        disabled?: boolean;
        hidden?: boolean;
        type?: string;
      };

      const isHiddenInput = el.tagName === "INPUT" && el.type === "hidden";
      if (el.disabled || el.hidden || isHiddenInput) {
        return NodeFilter.FILTER_SKIP;
      }

      return el.tabIndex >= 0 || node === document.activeElement
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });

  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);

  return nodes;
}

/** 对应官方 isHidden：向上追溯 display，遇到 container 即停。 */
export function isHidden(element: HTMLElement, container: HTMLElement): boolean {
  if (getComputedStyle(element).visibility === "hidden") return true;

  let node: HTMLElement | null = element;
  while (node) {
    if (container && node === container) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }

  return false;
}

export function getVisibleElement(
  elements: HTMLElement[],
  container: HTMLElement,
): HTMLElement | undefined {
  for (const element of elements) {
    if (!isHidden(element, container)) return element;
  }
  return undefined;
}

/** 对应官方 getEdges：返回容器内可见的首个与末个可聚焦元素。 */
export function getEdges(container: HTMLElement): [HTMLElement?, HTMLElement?] {
  const focusable = obtainAllFocusableElements(container);
  const first = getVisibleElement(focusable, container);
  const last = getVisibleElement([...focusable].reverse(), container);
  return [first, last];
}

function isSelectable(
  element: unknown,
): element is HTMLInputElement & { select: () => void } {
  return element instanceof HTMLInputElement && "select" in element;
}

/** 对应官方 tryFocus：聚焦元素，必要时顺带选中其内容。 */
export function tryFocus(
  element?: HTMLElement | { focus: () => void } | null,
  shouldSelect = false,
): void {
  if (!element) return;

  const prevFocused = document.activeElement;

  (element as HTMLElement).focus?.({ preventScroll: true });

  if (element !== prevFocused && isSelectable(element) && shouldSelect) {
    element.select();
  }
}

/** 对应官方 focusFirstDescendant：聚焦第一个能真正拿到焦点的元素。 */
export function focusFirstDescendant(
  elements: HTMLElement[],
  shouldSelect = false,
): void {
  const prevFocused = document.activeElement;

  for (const element of elements) {
    tryFocus(element, shouldSelect);
    if (document.activeElement !== prevFocused) return;
  }
}

/**
 * 对应官方 createFocusableStack：多层浮层共存时，
 * 新层入栈会暂停旧层，出栈时恢复旧层。
 */
export interface FocusLayer {
  paused: boolean;
  pause: () => void;
  resume: () => void;
}

export function createFocusableStack() {
  let stack: FocusLayer[] = [];

  const removeFromStack = (list: FocusLayer[], item: FocusLayer) => {
    const copy = [...list];
    const index = list.indexOf(item);
    if (index !== -1) copy.splice(index, 1);
    return copy;
  };

  return {
    push(layer: FocusLayer) {
      const currentLayer = stack[0];
      // 新层压住旧层，避免两个层同时争抢焦点
      if (currentLayer && layer !== currentLayer) currentLayer.pause();

      stack = removeFromStack(stack, layer);
      stack.unshift(layer);
    },
    remove(layer: FocusLayer) {
      stack = removeFromStack(stack, layer);
      stack[0]?.resume?.();
    },
  };
}

/** 全局共享的焦点层栈，对应官方的模块级 focusableStack。 */
export const focusableStack = createFocusableStack();

/**
 * 对应官方 useFocusReason 记录的用户操作来源。
 * 用于释放焦点时判断该不该把焦点还回去：
 * 键盘操作（如 Esc）释放时归还，鼠标点别处则不抢。
 */
const focusReason = { current: undefined as "pointer" | "keyboard" | undefined };
let lastUserFocusTimestamp = 0;
let lastAutomatedFocusTimestamp = 0;
let focusReasonUserCount = 0;

function notifyFocusReasonPointer() {
  focusReason.current = "pointer";
  lastUserFocusTimestamp = window.performance.now();
}

function notifyFocusReasonKeydown() {
  focusReason.current = "keyboard";
  lastUserFocusTimestamp = window.performance.now();
}

/** 对应官方 useFocusReason：挂载时注册全局监听，计数归零时移除。 */
export function useFocusReason() {
  const mount = () => {
    if (focusReasonUserCount === 0) {
      document.addEventListener("mousedown", notifyFocusReasonPointer);
      document.addEventListener("touchstart", notifyFocusReasonPointer);
      document.addEventListener("keydown", notifyFocusReasonKeydown);
    }
    focusReasonUserCount++;
  };

  const unmount = () => {
    focusReasonUserCount--;
    if (focusReasonUserCount <= 0) {
      document.removeEventListener("mousedown", notifyFocusReasonPointer);
      document.removeEventListener("touchstart", notifyFocusReasonPointer);
      document.removeEventListener("keydown", notifyFocusReasonKeydown);
    }
  };

  return {
    mount,
    unmount,
    focusReason,
    /** 对应 isFocusCausedByUserEvent */
    isFocusCausedByUserEvent: () => lastUserFocusTimestamp > lastAutomatedFocusTimestamp,
    markAutomatedFocus: () => {
      lastAutomatedFocusTimestamp = window.performance.now();
    },
  };
}
