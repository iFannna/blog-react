export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum Alignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export enum FixedDir {
  LEFT = "left",
  RIGHT = "right",
}

export const oppositeOrderMap: Record<SortOrder, SortOrder> = {
  [SortOrder.ASC]: SortOrder.DESC,
  [SortOrder.DESC]: SortOrder.ASC,
};

export const sortOrders = [SortOrder.ASC, SortOrder.DESC] as const;

/** 固定列在主表里占位用的标记，对应官方 private.ts 的 placeholderSign。 */
export const placeholderSign = Symbol("placeholder");
