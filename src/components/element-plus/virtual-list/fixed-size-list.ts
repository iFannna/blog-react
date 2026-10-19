import {
  AUTO_ALIGNMENT,
  CENTERED_ALIGNMENT,
  END_ALIGNMENT,
  SMART_ALIGNMENT,
  START_ALIGNMENT,
} from "./defaults";
import { isHorizontal } from "./utils";

import type { ListCalculator, VirtualizedListProps } from "./types";

type Props = VirtualizedListProps<unknown>;

const num = (value: number | string | undefined) => Number(value) || 0;

/**
 * 对应官方 FixedSizeList：行高固定，不需要尺寸缓存。
 */
export const fixedSizeListCalculator: ListCalculator<unknown> = {
  getItemOffset: ({ itemSize }, index) => index * (itemSize as number),

  getItemSize: ({ itemSize }) => itemSize as number,

  getEstimatedTotalSize: ({ total, itemSize }) => (itemSize as number) * total,

  getOffset: (
    { height, total, itemSize, layout, width },
    index,
    alignment,
    scrollOffset,
  ) => {
    const size = num(isHorizontal(layout) ? width : height);
    const lastItemOffset = Math.max(0, total * (itemSize as number) - size);
    const maxOffset = Math.min(lastItemOffset, index * (itemSize as number));
    const minOffset = Math.max(
      0,
      (index + 1) * (itemSize as number) - size,
    );

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
      case CENTERED_ALIGNMENT: {
        const middleOffset = Math.round(
          minOffset + (maxOffset - minOffset) / 2,
        );
        if (middleOffset < Math.ceil(size / 2)) return 0;
        if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
          return lastItemOffset;
        }
        return middleOffset;
      }
      case AUTO_ALIGNMENT:
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        }
        return scrollOffset < minOffset ? minOffset : maxOffset;
    }
  },

  getStartIndexForOffset: ({ total, itemSize }, offset) =>
    Math.max(
      0,
      Math.min(total - 1, Math.floor(offset / (itemSize as number))),
    ),

  getStopIndexForStartIndex: (
    { height, total, itemSize, layout, width }: Props,
    startIndex,
    scrollOffset,
  ) => {
    const offset = startIndex * (itemSize as number);
    const size = num(isHorizontal(layout) ? width : height);
    const numVisibleItems = Math.ceil(
      (size + scrollOffset - offset) / (itemSize as number),
    );
    return Math.max(
      0,
      Math.min(total - 1, startIndex + numVisibleItems - 1),
    );
  },

  initCache: () => null,

  clearCache: true,
};
