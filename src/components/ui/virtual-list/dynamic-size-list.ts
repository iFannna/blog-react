import {
  AUTO_ALIGNMENT,
  CENTERED_ALIGNMENT,
  DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
  END_ALIGNMENT,
  SMART_ALIGNMENT,
  START_ALIGNMENT,
} from "./defaults";
import { isHorizontal } from "./utils";

import type {
  ItemSize,
  ListCache,
  ListCalculator,
  ListItem,
  VirtualizedListProps,
} from "./types";

type Props = VirtualizedListProps<unknown>;

const num = (value: number | string | undefined) => Number(value) || 0;

/** 供组件层调用，避免在组件内直接修改缓存对象。 */
export function resetListCacheAfterIndex(cache: ListCache, index: number) {
  cache.lastVisitedIndex = Math.min(cache.lastVisitedIndex, index - 1);
}

const getItemFromCache = (
  props: Props,
  index: number,
  listCache: ListCache,
): ListItem => {
  const { itemSize } = props;
  const { items, lastVisitedIndex } = listCache;

  if (index > lastVisitedIndex) {
    let offset = 0;

    if (lastVisitedIndex >= 0) {
      const item = items[lastVisitedIndex];
      offset = item.offset + item.size;
    }

    for (let i = lastVisitedIndex + 1; i <= index; i++) {
      const size = (itemSize as ItemSize)(i);
      items[i] = { offset, size };
      offset += size;
    }

    listCache.lastVisitedIndex = index;
  }

  return items[index];
};

const bs = (
  props: Props,
  listCache: ListCache,
  low: number,
  high: number,
  offset: number,
) => {
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const currentOffset = getItemFromCache(props, mid, listCache).offset;

    if (currentOffset === offset) return mid;
    if (currentOffset < offset) low = mid + 1;
    else high = mid - 1;
  }

  return Math.max(0, low - 1);
};

const es = (
  props: Props,
  listCache: ListCache,
  index: number,
  offset: number,
) => {
  const { total } = props;
  let exponent = 1;

  while (
    index < total &&
    getItemFromCache(props, index, listCache).offset < offset
  ) {
    index += exponent;
    exponent *= 2;
  }

  return bs(
    props,
    listCache,
    Math.floor(index / 2),
    Math.min(index, total - 1),
    offset,
  );
};

const findItem = (props: Props, listCache: ListCache, offset: number) => {
  const { items, lastVisitedIndex } = listCache;
  const lastVisitedOffset =
    lastVisitedIndex > 0 ? items[lastVisitedIndex].offset : 0;

  return lastVisitedOffset >= offset
    ? bs(props, listCache, 0, lastVisitedIndex, offset)
    : es(props, listCache, Math.max(0, lastVisitedIndex), offset);
};

const getEstimatedTotalSize = (
  { total }: Props,
  cache: ListCache | null,
) => {
  if (!cache) return 0;

  let { lastVisitedIndex } = cache;
  const { items, estimatedItemSize } = cache;

  if (lastVisitedIndex >= total) lastVisitedIndex = total - 1;

  let totalSizeOfMeasuredItems = 0;
  if (lastVisitedIndex >= 0) {
    const item = items[lastVisitedIndex];
    totalSizeOfMeasuredItems = item.offset + item.size;
  }

  const numUnmeasuredItems = total - lastVisitedIndex - 1;
  return totalSizeOfMeasuredItems + numUnmeasuredItems * estimatedItemSize;
};

/**
 * 对应官方 DynamicSizeList：行高由 itemSize(index) 提供，按需填充缓存。
 */
export const dynamicSizeListCalculator: ListCalculator<unknown> = {
  getItemOffset: (props, index, cache) =>
    getItemFromCache(props, index, cache as ListCache).offset,

  getItemSize: (_, index, cache) =>
    (cache as ListCache).items[index].size,

  getEstimatedTotalSize,

  getOffset: (props, index, alignment, scrollOffset, cache) => {
    const listCache = cache as ListCache;
    const { height, layout, width } = props;
    const size = num(isHorizontal(layout) ? width : height);
    const item = getItemFromCache(props, index, listCache);
    const estimatedTotalSize = getEstimatedTotalSize(props, listCache);

    const maxOffset = Math.max(
      0,
      Math.min(estimatedTotalSize - size, item.offset),
    );
    const minOffset = Math.max(0, item.offset - size + item.size);

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
        return scrollOffset < minOffset ? minOffset : maxOffset;
    }
  },

  getStartIndexForOffset: (props, offset, cache) =>
    findItem(props, cache as ListCache, offset),

  getStopIndexForStartIndex: (props, startIndex, scrollOffset, cache) => {
    const listCache = cache as ListCache;
    const { height, total, layout, width } = props;
    const size = num(isHorizontal(layout) ? width : height);
    const item = getItemFromCache(props, startIndex, listCache);
    const maxOffset = scrollOffset + size;

    let offset = item.offset + item.size;
    let stopIndex = startIndex;

    while (stopIndex < total - 1 && offset < maxOffset) {
      stopIndex++;
      offset += getItemFromCache(props, stopIndex, listCache).size;
    }

    return stopIndex;
  },

  initCache: ({ estimatedItemSize }) => ({
    items: {},
    estimatedItemSize:
      estimatedItemSize ?? DEFAULT_DYNAMIC_LIST_ITEM_SIZE,
    lastVisitedIndex: -1,
  }),

  clearCache: false,

  validateProps: ({ itemSize }) => {
    if (process.env.NODE_ENV !== "production" && typeof itemSize !== "function") {
      throw new Error(
        `[ElDynamicSizeList] itemSize is required as function, but the given value was ${typeof itemSize}`,
      );
    }
  },
};
