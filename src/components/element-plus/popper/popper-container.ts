/**
 * 对应官方 packages/hooks/use-popper-container。
 *
 * 官方所有浮层默认挂到 body 下一个 `#el-popper-container-0` 容器里，
 * 保持这个 DOM 结构，方便与官网样式/选择器对齐。
 */
export const POPPER_CONTAINER_ID = "el-popper-container-0";

let container: HTMLElement | null = null;

export function getPopperContainer() {
  if (typeof document === "undefined") return null;

  if (!container || !document.body.contains(container)) {
    container =
      document.getElementById(POPPER_CONTAINER_ID) ??
      (() => {
        const el = document.createElement("div");
        el.id = POPPER_CONTAINER_ID;
        document.body.appendChild(el);
        return el;
      })();
  }

  return container;
}

/** 解析官方 appendTo 语义：字符串选择器、HTMLElement，缺省时用全局容器。 */
export function resolveAppendTo(appendTo?: string | HTMLElement) {
  if (typeof document === "undefined") return null;
  if (!appendTo) return getPopperContainer();

  if (typeof appendTo !== "string") return appendTo;
  if (appendTo === "body") return document.body;

  return document.querySelector<HTMLElement>(appendTo) ?? getPopperContainer();
}
