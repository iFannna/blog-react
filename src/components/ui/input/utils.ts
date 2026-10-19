/**
 * 与官方 input/src/utils.ts 对齐的 textarea 自适应高度计算。
 *
 * 官方靠一个隐藏 textarea 复制目标元素的计算样式来量文字高度，
 * 这里保持同样的做法，否则行高/字距有任何差异都会算错。
 */

const CONTEXT_STYLE = [
  "letter-spacing",
  "line-height",
  "padding-top",
  "padding-bottom",
  "font-family",
  "font-weight",
  "font-size",
  "text-rendering",
  "text-transform",
  "width",
  "text-indent",
  "padding-left",
  "padding-right",
  "border-width",
  "box-sizing",
  "word-break",
] as const;

export type TextAreaHeight = {
  height: string;
  minHeight?: string;
};

let hiddenTextarea: HTMLTextAreaElement | undefined;

/** 官方 looseToNumber：parseFloat 失败时原样返回。 */
export function looseToNumber(val: unknown): unknown {
  const n = Number.parseFloat(String(val));
  return Number.isNaN(n) ? val : n;
}

export function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows = 1,
  maxRows?: number,
): TextAreaHeight {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    (targetElement.parentNode ?? document.body).appendChild(hiddenTextarea);
  }

  const style = window.getComputedStyle(targetElement);
  const boxSizing = style.getPropertyValue("box-sizing");
  const paddingSize =
    Number.parseFloat(style.getPropertyValue("padding-bottom")) +
    Number.parseFloat(style.getPropertyValue("padding-top"));
  const borderSize =
    Number.parseFloat(style.getPropertyValue("border-bottom-width")) +
    Number.parseFloat(style.getPropertyValue("border-top-width"));

  for (const name of CONTEXT_STYLE) {
    hiddenTextarea.style.setProperty(name, style.getPropertyValue(name));
  }

  // 隐藏样式用 important 覆盖，避免继承到可见布局
  hiddenTextarea.style.setProperty("height", "0", "important");
  hiddenTextarea.style.setProperty("visibility", "hidden", "important");
  hiddenTextarea.style.setProperty("overflow", "hidden", "important");
  hiddenTextarea.style.setProperty("position", "absolute", "important");
  hiddenTextarea.style.setProperty("z-index", "-1000", "important");
  hiddenTextarea.style.setProperty("top", "0", "important");
  hiddenTextarea.style.setProperty("right", "0", "important");

  hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";

  let height = hiddenTextarea.scrollHeight;
  const result = {} as TextAreaHeight;

  if (boxSizing === "border-box") {
    height += borderSize;
  } else if (boxSizing === "content-box") {
    height -= paddingSize;
  }

  hiddenTextarea.value = "";
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  if (typeof minRows === "number") {
    let minHeight = singleRowHeight * minRows;
    if (boxSizing === "border-box") {
      minHeight = minHeight + paddingSize + borderSize;
    }
    height = Math.max(minHeight, height);
    result.minHeight = `${minHeight}px`;
  }

  if (typeof maxRows === "number") {
    let maxHeight = singleRowHeight * maxRows;
    if (boxSizing === "border-box") {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    height = Math.min(maxHeight, height);
  }

  result.height = `${height}px`;

  hiddenTextarea.parentNode?.removeChild(hiddenTextarea);
  hiddenTextarea = undefined;

  return result;
}
