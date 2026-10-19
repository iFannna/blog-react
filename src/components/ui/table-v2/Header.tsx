"use client";

import {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

import { enforceUnit, ensureArray, ns } from "./utils";

import type {
  Column,
  TableGridRowSlotParams,
  TableV2HeaderRendererParams,
  TableV2Row,
} from "./types";

export interface HeaderExpose {
  scrollToLeft: (left?: number) => void;
}

export interface HeaderProps<T = unknown> {
  className?: string;
  columns: Column<T>[];
  fixedHeaderData?: TableV2Row[];
  headerHeight: number | number[];
  rowWidth: number;
  rowHeight: number;
  height: number;
  width: number;
  scrollLeft?: number;
  renderHeader: (params: TableV2HeaderRendererParams<T>) => ReactNode;
  renderRow: (params: TableGridRowSlotParams<T>) => ReactNode;
}

/** 对应官方 components/header.tsx。 */
export const Header = forwardRef<HeaderExpose, HeaderProps>(
  function Header(
    {
      className,
      columns,
      fixedHeaderData,
      headerHeight,
      rowWidth,
      rowHeight,
      height,
      width,
      scrollLeft,
      renderHeader,
      renderRow,
    },
    ref,
  ) {
    const headerRef = useRef<HTMLDivElement>(null);

    const scrollToLeft = (left?: number) => {
      headerRef.current?.scrollTo?.({ left });
    };

    useImperativeHandle(ref, () => ({ scrollToLeft }));

    // 主表横向滚动时，表头跟随同一偏移
    useLayoutEffect(() => {
      if (scrollLeft) {
        scrollToLeft(scrollLeft);
      }
    }, [scrollLeft]);

    if (height <= 0) return null;

    const headerHeights = ensureArray(headerHeight);

    const headerStyle: CSSProperties = enforceUnit({ width, height });
    const rowStyle: CSSProperties = enforceUnit({ width: rowWidth, height });

    return (
      <div
        ref={headerRef}
        className={className}
        style={headerStyle}
        role="rowgroup"
      >
        <div style={rowStyle} className={ns.e("header")}>
          {headerHeights.map((rowHeightValue, rowIndex) => (
            <Fragment key={`header-row-${rowIndex}`}>
              {renderHeader({
                className: ns.e("dynamic-header-row"),
                columns,
                headerIndex: rowIndex,
                style: enforceUnit({
                  width: "100%",
                  height: rowHeightValue,
                }),
              })}
            </Fragment>
          ))}

          {fixedHeaderData?.map((fixedRowData, fixedRowIndex) => (
            <Fragment key={`fixed-row-${fixedRowIndex}`}>
              {renderRow({
                className: ns.e("fixed-header-row"),
                columns,
                rowData: fixedRowData,
                rowIndex: -(fixedRowIndex + 1),
                style: enforceUnit({
                  height: rowHeight,
                  width: "100%",
                }),
              })}
            </Fragment>
          ))}
        </div>
      </div>
    );
  },
);
