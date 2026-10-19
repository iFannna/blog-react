export interface DraggableOptions {
  drag?: (event: MouseEvent | TouchEvent) => void;
  start?: (event: MouseEvent | TouchEvent) => void;
  end?: (event: MouseEvent | TouchEvent) => void;
}

// 官方用一个模块级标记避免多个滑块同时拖拽
let isDragging = false;

/** 对应官方 color-picker-panel/utils/draggable。返回清理函数供 React effect 使用。 */
export function draggable(element: HTMLElement, options: DraggableOptions) {
  if (typeof window === "undefined") return () => {};

  const moveFn = (event: MouseEvent | TouchEvent) => {
    options.drag?.(event);
  };

  const upFn = (event: MouseEvent | TouchEvent) => {
    document.removeEventListener("mousemove", moveFn);
    document.removeEventListener("mouseup", upFn);
    document.removeEventListener("touchmove", moveFn);
    document.removeEventListener("touchend", upFn);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    options.end?.(event);
  };

  const downFn = (event: MouseEvent | TouchEvent) => {
    if (isDragging) return;
    document.onselectstart = () => false;
    document.ondragstart = () => false;
    document.addEventListener("mousemove", moveFn);
    document.addEventListener("mouseup", upFn);
    document.addEventListener("touchmove", moveFn);
    document.addEventListener("touchend", upFn);

    isDragging = true;

    options.start?.(event);
  };

  element.addEventListener("mousedown", downFn);
  element.addEventListener("touchstart", downFn, { passive: false });

  return () => {
    element.removeEventListener("mousedown", downFn);
    element.removeEventListener("touchstart", downFn);
    document.removeEventListener("mousemove", moveFn);
    document.removeEventListener("mouseup", upFn);
    document.removeEventListener("touchmove", moveFn);
    document.removeEventListener("touchend", upFn);
  };
}
