"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DefaultRow, TableColumnCtx } from "./context";
import { flattenColumns } from "./utils";

/**
 * 对应官方 table-layout.ts。
 *
 * 职责是把「列宽」算成最终值：带 width 的列用固定宽度，
 * 其余列（flex）平分剩余空间，并判断是否需要横向滚动。
 */
export function useTableLayout<T extends DefaultRow>(options: {
  columns: TableColumnCtx<T>[];
  fixedColumns: TableColumnCtx<T>[];
  rightFixedColumns: TableColumnCtx<T>[];
  fit: boolean;
}) {
  const { columns, fixedColumns, rightFixedColumns, fit } = options;

  const tableRef = useRef<HTMLDivElement>(null);
  const [bodyWidth, setBodyWidth] = useState<number | null>(null);
  const [scrollX, setScrollX] = useState(false);
  const [scrollY, setScrollY] = useState(false);
  const [fixedWidth, setFixedWidth] = useState<number | null>(null);
  const [rightFixedWidth, setRightFixedWidth] = useState<number | null>(null);
  // 列宽算完后自增，驱动一次重渲染让 realWidth 落到 DOM 上
  const [widthVersion, setWidthVersion] = useState(0);

  /** 对应官方 updateColumnsWidth。 */
  const updateColumnsWidth = useCallback(() => {
    const el = tableRef.current;
    if (!el) return;

    const containerWidth = el.clientWidth;
    let bodyMinWidth = 0;

    const flatten = flattenColumns(columns);
    const flexColumns = flatten.filter((column) => typeof column.width !== "number");

    flatten.forEach((column) => {
      // 宽度由 flex 变为固定时清掉旧的 realWidth
      if (typeof column.width === "number" && column.realWidth) {
        column.realWidth = null;
      }
    });

    if (flexColumns.length > 0 && fit) {
      flatten.forEach((column) => {
        bodyMinWidth += Number(column.width || column.minWidth || 80);
      });

      if (bodyMinWidth <= containerWidth) {
        setScrollX(false);
        const totalFlexWidth = containerWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce(
            (prev, column) => prev + Number(column.minWidth || 80),
            0,
          );
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(
              Number(column.minWidth || 80) * flexWidthPerPixel,
            );
            noneFirstWidth += flexWidth;
            column.realWidth = Number(column.minWidth || 80) + flexWidth;
          });

          flexColumns[0].realWidth =
            Number(flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
        }
      } else {
        // 内容宽于容器，出现横向滚动条
        setScrollX(true);
        flexColumns.forEach((column) => {
          column.realWidth = Number(column.minWidth);
        });
      }

      setBodyWidth(Math.max(bodyMinWidth, containerWidth));
    } else {
      flatten.forEach((column) => {
        if (!column.width && !column.minWidth) {
          column.realWidth = 80;
        } else {
          column.realWidth = Number(column.width || column.minWidth);
        }
        bodyMinWidth += column.realWidth;
      });
      setScrollX(bodyMinWidth > containerWidth);
      setBodyWidth(bodyMinWidth);
    }

    if (fixedColumns.length > 0) {
      setFixedWidth(
        fixedColumns.reduce(
          (sum, column) => sum + Number(column.realWidth || column.width),
          0,
        ),
      );
    }
    if (rightFixedColumns.length > 0) {
      setRightFixedWidth(
        rightFixedColumns.reduce(
          (sum, column) => sum + Number(column.realWidth || column.width),
          0,
        ),
      );
    }

    setWidthVersion((v) => v + 1);
  }, [columns, fit, fixedColumns, rightFixedColumns]);

  const doLayout = useCallback(() => {
    updateColumnsWidth();
    // 同步判断纵向滚动，与官方 updateScrollY 一致
    const el = tableRef.current;
    const bodyWrapper = el?.querySelector(".el-table__body-wrapper .el-scrollbar__wrap");
    if (bodyWrapper) {
      setScrollY(bodyWrapper.scrollHeight > bodyWrapper.clientHeight);
    }
  }, [updateColumnsWidth]);

  // 列变化与容器尺寸变化时重算；官方在 mounted 后 nextTick 调一次，这里同理延后一帧
  useEffect(() => {
    const timer = window.setTimeout(doLayout, 0);
    return () => window.clearTimeout(timer);
  }, [doLayout]);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => doLayout());
    observer.observe(el);
    window.addEventListener("resize", doLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", doLayout);
    };
  }, [doLayout]);

  return {
    tableRef,
    bodyWidth,
    scrollX,
    scrollY,
    fixedWidth,
    rightFixedWidth,
    doLayout,
    /** 列宽写入后自增，用于让依赖 realWidth 的渲染重新执行 */
    widthVersion,
  };
}
