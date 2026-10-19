import type Node from "./node";

export const getMenuIndex = (el: HTMLElement) => {
  if (!el) return 0;
  const pieces = el.id.split("-");
  return Number(pieces[pieces.length - 2]);
};

export const checkNode = (el: HTMLElement) => {
  if (!el) return;

  const input = el.querySelector("input");
  if (input) {
    input.click();
  } else if (!el.getAttribute("aria-owns")) {
    el.click();
  }
};

export const sortByOriginalOrder = (oldNodes: Node[], newNodes: Node[]) => {
  const newNodesCopy = newNodes.slice(0);
  const newIds = newNodesCopy.map((node) => node.uid);
  const res = oldNodes.reduce((acc, item) => {
    const index = newIds.indexOf(item.uid);
    if (index > -1) {
      acc.push(item);
      newNodesCopy.splice(index, 1);
      newIds.splice(index, 1);
    }
    return acc;
  }, [] as Node[]);

  res.push(...newNodesCopy);

  return res;
};

export const castArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

export const unique = <T>(value: T[]): T[] => Array.from(new Set(value));

export const noop = () => {};
