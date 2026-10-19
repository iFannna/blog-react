import {
  AUTO_ALIGNMENT,
  CENTERED_ALIGNMENT,
  DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
  END_ALIGNMENT,
  SMART_ALIGNMENT,
  START_ALIGNMENT,
} from "./defaults";

import type {
  GridCalculator,
  GridCache,
  ItemSize,
  ListItem,
  VirtualizedGridProps,
} from "./types";

type Props = VirtualizedGridProps<unknown>;
type CacheItemType = "column" | "row";

const { max, min, floor } = Math;

const ACCESS_SIZER_KEY_MAP = {
  column: "columnWidth",
  row: "rowHeight",
} as const;

const ACCESS_LAST_VISITED_KEY_MAP = {
  column: "lastVisitedColumnIndex",
  row: "lastVisitedRowIndex",
} as const;

/** 供组件层调用，避免在组件内直接修改缓存对象。 */
export function resetGridCacheAfterIndices(
  cache: GridCache,
  indices: { columnIndex?: number; rowIndex?: number },
) {
  const { columnIndex, rowIndex } = indices;

  if (typeof columnIndex === "number" && !Number.isNaN(columnIndex)) {
    cache.lastVisitedColumnIndex = Math.min(
      cache.lastVisitedColumnIndex,
      columnIndex - 1,
    );
  }
  if (typeof rowIndex === "number" && !Number.isNaN(rowIndex)) {
    cache.lastVisitedRowIndex = Math.min(
      cache.lastVisitedRowIndex,
      rowIndex - 1,
    );
  }
}

const getItemFromCache = (
  props: Props,
  index: number,
  gridCache: GridCache,
  type: CacheItemType,
): ListItem => {
  const cachedItems = gridCache[type];
  const sizer = props[ACCESS_SIZER_KEY_MAP[type]] as ItemSize;
  const lastVisited = gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]];

  if (index > lastVisited) {
    let offset = 0;

    if (lastVisited >= 0) {
      const item = cachedItems[lastVisited];
      offset = item.offset + item.size;
    }

    for (let i = lastVisited + 1; i <= index; i++) {
      const size = sizer(i);
      cachedItems[i] = { offset, size };
      offset += size;
    }

    gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]] = index;
  }

  return cachedItems[index];
};

const bs = (
  props: Props,
  gridCache: GridCache,
  low: number,
  high: number,
  offset: number,
  type: CacheItemType,
) => {
  while (low <= high) {
    const mid = low + floor((high - low) / 2);
    const currentOffset = getItemFromCache(props, mid, gridCache, type).offset;

    if (currentOffset === offset) return mid;
    if (currentOffset < offset) low = mid + 1;
    else high = mid - 1;
  }

  return max(0, low - 1);
};

const es = (
  props: Props,
  gridCache: GridCache,
  idx: number,
  offset: number,
  type: CacheItemType,
) => {
  const total = type === "column" ? props.totalColumn : props.totalRow;
  let exponent = 1;

  while (
    idx < total &&
    getItemFromCache(props, idx, gridCache, type).offset < offset
  ) {
    idx += exponent;
    exponent *= 2;
  }

  return bs(props, gridCache, floor(idx / 2), min(idx, total - 1), offset, type);
};

const findItem = (
  props: Props,
  gridCache: GridCache,
  offset: number,
  type: CacheItemType,
) => {
  const cache = gridCache[type];
  const lastVisitedIndex = gridCache[ACCESS_LAST_VISITED_KEY_MAP[type]];
  const lastVisitedItemOffset =
    lastVisitedIndex > 0 ? cache[lastVisitedIndex].offset : 0;

  return lastVisitedItemOffset >= offset
    ? bs(props, gridCache, 0, lastVisitedIndex, offset, type)
    : es(props, gridCache, max(0, lastVisitedIndex), offset, type);
};

const getEstimatedTotalHeight = (
  { totalRow }: Props,
  cache: GridCache,
) => {
  let { lastVisitedRowIndex } = cache;
  const { estimatedRowHeight, row } = cache;

  if (lastVisitedRowIndex >= totalRow) lastVisitedRowIndex = totalRow - 1;

  let sizeOfVisitedRows = 0;
  if (lastVisitedRowIndex >= 0) {
    const item = row[lastVisitedRowIndex];
    sizeOfVisitedRows = item.offset + item.size;
  }

  const unvisitedItems = totalRow - lastVisitedRowIndex - 1;
  return sizeOfVisitedRows + unvisitedItems * estimatedRowHeight;
};

const getEstimatedTotalWidth = (
  { totalColumn }: Props,
  cache: GridCache,
) => {
  let { lastVisitedColumnIndex } = cache;
  const { column, estimatedColumnWidth } = cache;

  if (lastVisitedColumnIndex > totalColumn) {
    lastVisitedColumnIndex = totalColumn - 1;
  }

  let sizeOfVisitedColumns = 0;
  if (lastVisitedColumnIndex >= 0) {
    const item = column[lastVisitedColumnIndex];
    sizeOfVisitedColumns = item.offset + item.size;
  }

  const unvisitedItems = totalColumn - lastVisitedColumnIndex - 1;
  return sizeOfVisitedColumns + unvisitedItems * estimatedColumnWidth;
};

const ACCESS_ESTIMATED_SIZE_KEY_MAP = {
  column: getEstimatedTotalWidth,
  row: getEstimatedTotalHeight,
};

const getOffset = (
  props: Props,
  index: number,
  alignment: Parameters<GridCalculator<unknown>["getColumnOffset"]>[2],
  scrollOffset: number,
  cache: GridCache,
  type: CacheItemType,
  scrollBarWidth: number,
) => {
  const size =
    type === "row" ? Number(props.height) || 0 : Number(props.width) || 0;
  const estimatedSizeAssociates = ACCESS_ESTIMATED_SIZE_KEY_MAP[type];
  const item = getItemFromCache(props, index, cache, type);
  const estimatedSize = estimatedSizeAssociates(props, cache);

  const maxOffset = max(0, min(estimatedSize - size, item.offset));
  const minOffset = max(0, item.offset - size + scrollBarWidth + item.size);

  if (alignment === SMART_ALIGNMENT) {
    alignment =
      scrollOffset >= minOffset - size && scrollOffset <= maxOffset + size
        ? AUTO_ALIGNMENT
        : CENTERED_ALIGNMENT;
  }

  switch (alignment) {
    case START_ALIGNMENT:
      return maxOffset;
    case END_ALIGNMENT:
      return minOffset;
    case CENTERED_ALIGNMENT:
      return Math.round(minOffset + (maxOffset - minOffset) / 2);
    case AUTO_ALIGNMENT:
    default:
      if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
        return scrollOffset;
      }
      if (minOffset > maxOffset) return minOffset;
      return scrollOffset < minOffset ? minOffset : maxOffset;
  }
};

/**
 * 对应官方 DynamicSizeGrid：列宽、行高均为函数，按需填充缓存。
 */
export const dynamicSizeGridCalculator: GridCalculator<unknown> = {
  getColumnPosition: (props, idx, cache) => {
    const item = getItemFromCache(props, idx, cache, "column");
    return [item.size, item.offset];
  },

  getRowPosition: (props, idx, cache) => {
    const item = getItemFromCache(props, idx, cache, "row");
    return [item.size, item.offset];
  },

  getColumnOffset: (props, index, alignment, scrollLeft, cache, width) =>
    getOffset(props, index, alignment, scrollLeft, cache, "column", width),

  getRowOffset: (props, index, alignment, scrollTop, cache, width) =>
    getOffset(props, index, alignment, scrollTop, cache, "row", width),

  getColumnStartIndexForOffset: (props, scrollLeft, cache) =>
    findItem(props, cache, scrollLeft, "column"),

  getColumnStopIndexForStartIndex: (props, startIndex, scrollLeft, cache) => {
    const item = getItemFromCache(props, startIndex, cache, "column");
    const maxOffset = scrollLeft + (Number(props.width) || 0);

    let offset = item.offset + item.size;
    let stopIndex = startIndex;

    while (stopIndex < props.totalColumn - 1 && offset < maxOffset) {
      stopIndex++;
      // 与官方实现保持一致：这里取的是 startIndex 的尺寸
      offset += getItemFromCache(props, startIndex, cache, "column").size;
    }

    return stopIndex;
  },

  getEstimatedTotalHeight,
  getEstimatedTotalWidth,

  getRowStartIndexForOffset: (props, scrollTop, cache) =>
    findItem(props, cache, scrollTop, "row"),

  getRowStopIndexForStartIndex: (props, startIndex, scrollTop, cache) => {
    const { totalRow } = props;
    const item = getItemFromCache(props, startIndex, cache, "row");
    const maxOffset = scrollTop + (Number(props.height) || 0);

    let offset = item.size + item.offset;
    let stopIndex = startIndex;

    while (stopIndex < totalRow - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache(props, stopIndex, cache, "row").size;
    }

    return stopIndex;
  },

  initCache: ({
    estimatedColumnWidth = DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
    estimatedRowHeight = DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
  }) => ({
    column: {},
    row: {},
    estimatedColumnWidth,
    estimatedRowHeight,
    lastVisitedColumnIndex: -1,
    lastVisitedRowIndex: -1,
  }),

  clearCache: false,

  validateProps: ({ columnWidth, rowHeight }) => {
    if (process.env.NODE_ENV !== "production") {
      if (typeof columnWidth !== "function") {
        throw new Error(
          `[ElDynamicSizeGrid] columnWidth must be passed as function, instead ${typeof columnWidth} was given.`,
        );
      }
      if (typeof rowHeight !== "function") {
        throw new Error(
          `[ElDynamicSizeGrid] rowHeight must be passed as function, instead ${typeof rowHeight} was given.`,
        );
      }
    }
  },
};
