import type { MentionCtx, MentionOption } from "./types";

/** 键盘事件的 code 常量，与官方 packages/constants/aria.ts 的 EVENT_CODE 一致。 */
export const EVENT_CODE = {
  tab: "Tab",
  enter: "Enter",
  space: "Space",
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  esc: "Escape",
  delete: "Delete",
  backspace: "Backspace",
  numpadEnter: "NumpadEnter",
  pageUp: "PageUp",
  pageDown: "PageDown",
  home: "Home",
  end: "End",
} as const;

/**
 * 对应官方 getEventCode。
 *
 * 优先取 event.code，Android 上 code 恒为空所以回退到 event.key。
 */
export function getEventCode(event: KeyboardEvent): string {
  if (event.code && event.code !== "Unidentified") return event.code;

  const key = event.key && event.key !== "Unidentified" ? event.key : "";

  if (key) {
    if ((Object.values(EVENT_CODE) as string[]).includes(key)) return key;
    if (key === " ") return EVENT_CODE.space;
  }

  return "";
}

function isFirefox(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("firefox")
  );
}

/** 对应官方 ensureArray（lodash castArray 的别名）。 */
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/** 默认过滤逻辑，对应官方 helper.filterOption。 */
export function filterOption(pattern: string, option: MentionOption): boolean {
  const lowerCase = pattern.toLowerCase();
  const label = option.label || option.value || "";
  return label.toLowerCase().includes(lowerCase);
}

/**
 * 对应官方 getMentionCtx。
 *
 * 从光标处向前回溯：先记录最近一个分隔符（split / 换行）位置，
 * 再继续向前找到第一个 prefix 字符，两者之间就是这次的提及词。
 * 只有 mentionCtx.splitIndex === -1（即光标后还没有分隔符）时才认为筛选未结束。
 */
export function getMentionCtx(
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  prefix: string | string[],
  split: string,
): MentionCtx | undefined {
  const { selectionEnd } = inputEl;
  if (selectionEnd === null) return undefined;

  const inputValue = inputEl.value;
  const prefixArray = ensureArray(prefix);
  let splitIndex = -1;
  let mentionCtx: MentionCtx | undefined;

  for (let i = selectionEnd - 1; i >= 0; --i) {
    const char = inputValue[i];

    if (splitIndex === -1 && (char === split || char === "\n" || char === "\r")) {
      splitIndex = i;
      continue;
    }

    if (prefixArray.includes(char)) {
      const end = splitIndex === -1 ? selectionEnd : splitIndex;
      mentionCtx = {
        pattern: inputValue.slice(i + 1, end),
        start: i + 1,
        end,
        prefix: char,
        prefixIndex: i,
        splitIndex,
        selectionEnd,
      };
      break;
    }
  }

  return mentionCtx;
}

export interface CursorPosition {
  top: number;
  left: number;
  height: number;
}

/**
 * 对应官方 getCursorPosition（fork 自 textarea-caret-position）。
 *
 * 思路：造一个样式与目标输入框完全一致的隐藏镜像 div，把光标前的文本塞进去，
 * 再用一个 span 包住光标后的文本，span 的 offset 就是光标坐标。
 */
export function getCursorPosition(
  element: HTMLInputElement | HTMLTextAreaElement,
  options: { useSelectionEnd?: boolean } = {},
): CursorPosition {
  const selectionStart =
    element.selectionStart !== null ? element.selectionStart : 0;
  const selectionEnd = element.selectionEnd !== null ? element.selectionEnd : 0;
  const position = options.useSelectionEnd ? selectionEnd : selectionStart;

  // 逐个列出要拷贝的属性：Firefox 等浏览器不会把 padding-top 之类归并到 padding
  const properties = [
    "direction",
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderStyle",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontSizeAdjust",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",
    "letterSpacing",
    "wordSpacing",
    "tabSize",
    "MozTabSize",
  ];

  const div = document.createElement("div");
  document.body.appendChild(div);

  const style = div.style as unknown as Record<string, string>;
  const computed = window.getComputedStyle(element) as unknown as Record<
    string,
    string
  >;
  const isInput = element.nodeName === "INPUT";

  style.whiteSpace = isInput ? "nowrap" : "pre-wrap";
  if (!isInput) style.wordWrap = "break-word";

  // 必须 absolute 才能拿到有意义的 offset 坐标；用 visibility 而非 display 保证参与渲染
  style.position = "absolute";
  style.visibility = "hidden";

  properties.forEach((prop) => {
    if (isInput && prop === "lineHeight") {
      // input 的文本垂直居中，行高常与高度不等，需要按 border-box 高度反推
      if (computed.boxSizing === "border-box") {
        const height = Number.parseInt(computed.height);
        const outerHeight =
          Number.parseInt(computed.paddingTop) +
          Number.parseInt(computed.paddingBottom) +
          Number.parseInt(computed.borderTopWidth) +
          Number.parseInt(computed.borderBottomWidth);
        const targetHeight = outerHeight + Number.parseInt(computed.lineHeight);

        if (height > targetHeight) style.lineHeight = `${height - outerHeight}px`;
        else if (height === targetHeight) style.lineHeight = computed.lineHeight;
        else style.lineHeight = "0";
      } else {
        style.lineHeight = computed.height;
      }
    } else {
      style[prop] = computed[prop];
    }
  });

  if (isFirefox()) {
    // Firefox 对 textarea 的 overflow 判断有误（bug 984275）
    if (element.scrollHeight > Number.parseInt(computed.height))
      style.overflowY = "scroll";
  } else {
    style.overflow = "hidden";
  }

  div.textContent = element.value.slice(0, Math.max(0, position));

  // input 里的空格要换成不换行空格，否则镜像 div 会把行尾空格吃掉
  if (isInput && div.textContent) {
    div.textContent = div.textContent.replace(/\s/g, " ");
  }

  const span = document.createElement("span");
  // 光标后的全部文本都要放进 span，长单词换行的位置才与真实输入框一致
  span.textContent = element.value.slice(Math.max(0, position)) || ".";
  span.style.position = "relative";
  span.style.left = `${-element.scrollLeft}px`;
  span.style.top = `${-element.scrollTop}px`;
  div.appendChild(span);

  const relativePosition = {
    top: span.offsetTop + Number.parseInt(computed.borderTopWidth),
    left: span.offsetLeft + Number.parseInt(computed.borderLeftWidth),
    // 不用 lineHeight，input 的它可能远大于实际字高
    height: Number.parseInt(computed.fontSize) * 1.5,
  };

  document.body.removeChild(div);

  if (relativePosition.left >= element.clientWidth) {
    relativePosition.left = element.clientWidth;
  }

  return relativePosition;
}

/**
 * 对应官方 utils/dom/scroll.ts 的 scrollIntoView：
 * 把 selected 滚动到 container 可视区（超出下边界时贴着下边界对齐）。
 */
export function scrollIntoView(
  container: HTMLElement,
  selected: HTMLElement,
): void {
  if (!container || !selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents: HTMLElement[] = [];
  let pointer = selected.offsetParent as HTMLElement | null;

  while (pointer !== null && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent as HTMLElement | null;
  }

  const top =
    selected.offsetTop +
    offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}
