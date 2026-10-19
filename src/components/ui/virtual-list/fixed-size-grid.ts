import {
  AUTO_ALIGNMENT,
  CENTERED_ALIGNMENT,
  END_ALIGNMENT,
  SMART_ALIGNMENT,
  START_ALIGNMENT,
} from "./defaults";

import type { GridCalculator } from "./types";

const num = (value: number | string | undefined) => Number(value) || 0;

/**
 * 对应官方 FixedSizeGrid：列宽、行高固定。
 */
export const fixedSizeGridCalculator: GridCalculator<unknown> = {
  getColumnPosition: ({ columnWidth }, index) => [
    columnWidth as number,
    index * (columnWidth as number),
  ],

  getRowPosition: ({ rowHeight }, index) => [
    rowHeight as number,
    index * (rowHeight as number),
  ],

  getEstimatedTotalHeight: ({ totalRow, rowHeight }) =>
    (rowHeight as number) * totalRow,

  getEstimatedTotalWidth: ({ totalColumn, columnWidth }) =>
    (columnWidth as number) * totalColumn,

  getColumnOffset: (
    props,
    columnIndex,
    alignment,
    scrollLeft,
    _cache,
    scrollBarWidth,
  ) => {
    const { totalColumn, columnWidth } = props;
    const width = num(props.width);
    const itemWidth = columnWidth as number;
    const lastColumnOffset = Math.max(0, totalColumn * itemWidth - width);
    const maxOffset = Math.min(lastColumnOffset, columnIndex * itemWidth);
    const minOffset = Math.max(
      0,
      columnIndex * itemWidth - width + scrollBarWidth + itemWidth,
    );

    if (alignment === SMART_ALIGNMENT) {
      alignment =
        scrollLeft >= minOffset - width && scrollLeft <= maxOffset + width
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
        if (middleOffset < Math.ceil(width / 2)) return 0;
        if (middleOffset > lastColumnOffset + Math.floor(width / 2)) {
          return lastColumnOffset;
        }
        return middleOffset;
      }
      case AUTO_ALIGNMENT:
      default:
        if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
          return scrollLeft;
        }
        if (minOffset > maxOffset) return minOffset;
        return scrollLeft < minOffset ? minOffset : maxOffset;
    }
  },

  getRowOffset: (
    props,
    rowIndex,
    alignment,
    scrollTop,
    _cache,
    scrollBarWidth,
  ) => {
    const { rowHeight, totalRow } = props;
    const height = num(props.height);
    const itemHeight = rowHeight as number;
    const lastRowOffset = Math.max(0, totalRow * itemHeight - height);
    const maxOffset = Math.min(lastRowOffset, rowIndex * itemHeight);
    const minOffset = Math.max(
      0,
      rowIndex * itemHeight - height + scrollBarWidth + itemHeight,
    );

    if (alignment === SMART_ALIGNMENT) {
      alignment =
        scrollTop >= minOffset - height && scrollTop <= maxOffset + height
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
        if (middleOffset < Math.ceil(height / 2)) return 0;
        if (middleOffset > lastRowOffset + Math.floor(height / 2)) {
          return lastRowOffset;
        }
        return middleOffset;
      }
      case AUTO_ALIGNMENT:
      default:
        if (scrollTop >= minOffset && scrollTop <= maxOffset) {
          return scrollTop;
        }
        if (minOffset > maxOffset) return minOffset;
        return scrollTop < minOffset ? minOffset : maxOffset;
    }
  },

  getColumnStartIndexForOffset: ({ columnWidth, totalColumn }, scrollLeft) =>
    Math.max(
      0,
      Math.min(
        totalColumn - 1,
        Math.floor(scrollLeft / (columnWidth as number)),
      ),
    ),

  getColumnStopIndexForStartIndex: (
    { columnWidth, totalColumn, width },
    startIndex,
    scrollLeft,
  ) => {
    const left = startIndex * (columnWidth as number);
    const visibleColumnsCount = Math.ceil(
      (num(width) + scrollLeft - left) / (columnWidth as number),
    );
    return Math.max(
      0,
      Math.min(totalColumn - 1, startIndex + visibleColumnsCount - 1),
    );
  },

  getRowStartIndexForOffset: ({ rowHeight, totalRow }, scrollTop) =>
    Math.max(
      0,
      Math.min(totalRow - 1, Math.floor(scrollTop / (rowHeight as number))),
    ),

  getRowStopIndexForStartIndex: (
    { rowHeight, totalRow, height },
    startIndex,
    scrollTop,
  ) => {
    const top = startIndex * (rowHeight as number);
    const numVisibleRows = Math.ceil(
      (num(height) + scrollTop - top) / (rowHeight as number),
    );
    return Math.max(
      0,
      Math.min(totalRow - 1, startIndex + numVisibleRows - 1),
    );
  },

  initCache: () => ({
    column: {},
    row: {},
    estimatedColumnWidth: 0,
    estimatedRowHeight: 0,
    lastVisitedColumnIndex: -1,
    lastVisitedRowIndex: -1,
  }),

  clearCache: true,
};
