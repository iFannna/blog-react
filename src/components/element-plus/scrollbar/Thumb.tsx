"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react";
import { BAR_MAP, renderThumbStyle, type BarMapItem } from "./util";

export interface ThumbProps {
  /** 滑块相对轨道的位移百分比 */
  move: number;
  /** 轨道尺寸与滑块尺寸的比值，用于换算拖动距离 */
  ratio: number;
  /** 滑块尺寸，空串表示不显示 */
  size: string;
  /** 是否总是显示 */
  always: boolean;
  vertical?: boolean;
  /** 滚动条容器的 ref，滑块靠它读滚动尺寸 */
  scrollbarElement: React.RefObject<HTMLDivElement | null>;
  /** 可滚动容器的 ref */
  wrapElement: React.RefObject<HTMLDivElement | null>;
}

/**
 * 对应官方 thumb.vue：单条滚动条轨道 + 可拖动的滑块。
 *
 * 滑块的显隐、拖动中的中间量都直接操作 DOM / ref，不走 React 状态，
 * 与官方 v-show 的语义一致，同时避开拖动这种高频操作引发的重渲染。
 */
export const ElScrollbarThumb = forwardRef<HTMLDivElement, ThumbProps>(
  function ElScrollbarThumb(
    { move, ratio, size, always, vertical = false, scrollbarElement, wrapElement },
    ref,
  ) {
    const instanceRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const stateRef = useRef({
      cursorDown: false,
      cursorLeave: false,
      thumbState: undefined as number | undefined,
      baseScrollSize: 0,
      /** 拖动时禁止选中文本，结束后要还原成原值 */
      originalOnSelectStart: null as GlobalEventHandlers["onselectstart"],
    });

    const bar: BarMapItem = vertical ? BAR_MAP.vertical : BAR_MAP.horizontal;

    useImperativeHandle(ref, () => instanceRef.current!, []);

    const setVisible = useCallback((next: boolean) => {
      const el = instanceRef.current;
      if (el) el.style.display = next || always ? "" : "none";
    }, [always]);

    /** 对齐官方 offsetRatio：把「轨道/滑块/比例」三者合成一次拖动换算。 */
    const offsetRatio = useCallback(() => {
      const instance = instanceRef.current;
      const thumb = thumbRef.current;
      const wrap = wrapElement.current;
      if (!instance || !thumb || !wrap) return 1;

      return (
        instance[bar.offset] ** 2 / wrap[bar.scrollSize] / ratio / thumb[bar.offset] ||
        1
      );
    }, [bar, ratio, wrapElement]);

    const restoreOnselectstart = useCallback(() => {
      if (document.onselectstart !== stateRef.current.originalOnSelectStart) {
        document.onselectstart = stateRef.current.originalOnSelectStart;
      }
    }, []);

    const onMouseMoveDocument = useCallback(
      (event: MouseEvent) => {
        const instance = instanceRef.current;
        const thumb = thumbRef.current;
        const wrap = wrapElement.current;
        if (!instance || !thumb || !wrap) return;
        if (!stateRef.current.cursorDown) return;

        const prevPage = stateRef.current.thumbState;
        if (!prevPage) return;

        const offset =
          (instance.getBoundingClientRect()[bar.direction] - event[bar.client]) * -1;
        const thumbClickPosition = thumb[bar.offset] - prevPage;
        const thumbPositionPercentage =
          ((offset - thumbClickPosition) * 100 * offsetRatio()) / instance[bar.offset];

        wrap[bar.scroll] =
          (thumbPositionPercentage * stateRef.current.baseScrollSize) / 100;
      },
      [bar, offsetRatio, wrapElement],
    );

    const onMouseUpDocument = useCallback(() => {
      stateRef.current.cursorDown = false;
      stateRef.current.thumbState = 0;
      document.removeEventListener("mousemove", onMouseMoveDocument);
      document.removeEventListener("mouseup", onMouseUpDocument);
      restoreOnselectstart();
      if (stateRef.current.cursorLeave) setVisible(false);
    }, [onMouseMoveDocument, restoreOnselectstart, setVisible]);

    const startDrag = useCallback(
      (event: MouseEvent) => {
        event.stopImmediatePropagation();
        const wrap = wrapElement.current;
        if (!wrap) return;

        stateRef.current.cursorDown = true;
        stateRef.current.baseScrollSize = vertical
          ? wrap.scrollHeight
          : wrap.scrollWidth;
        stateRef.current.originalOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;

        document.addEventListener("mousemove", onMouseMoveDocument);
        document.addEventListener("mouseup", onMouseUpDocument);
      },
      [onMouseMoveDocument, onMouseUpDocument, vertical, wrapElement],
    );

    const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      // 中键与右键不触发拖动
      event.stopPropagation();
      if (event.ctrlKey || [1, 2].includes(event.button)) return;

      window.getSelection()?.removeAllRanges();
      startDrag(event.nativeEvent);

      const el = event.currentTarget;
      stateRef.current.thumbState =
        el[bar.offset] -
        (event[bar.client] - el.getBoundingClientRect()[bar.direction]);
    };

    /** 点击轨道空白处：按点击位置直接把可滚动容器定位过去。 */
    const handleTrackMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      const thumb = thumbRef.current;
      const instance = instanceRef.current;
      const wrap = wrapElement.current;
      if (!thumb || !instance || !wrap) return;

      const offset = Math.abs(
        (event.target as HTMLElement).getBoundingClientRect()[bar.direction] -
          event[bar.client],
      );
      const thumbHalf = thumb[bar.offset] / 2;
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100 * offsetRatio()) / instance[bar.offset];

      wrap[bar.scroll] = (thumbPositionPercentage * wrap[bar.scrollSize]) / 100;
    };

    // 鼠标进出滚动容器时控制滑块显隐，与官方一致：拖动中不隐藏
    useEffect(() => {
      const el = scrollbarElement.current;
      if (!el) return;

      const onMove = () => {
        stateRef.current.cursorLeave = false;
        setVisible(!!size);
      };
      const onLeave = () => {
        stateRef.current.cursorLeave = true;
        setVisible(stateRef.current.cursorDown);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    }, [scrollbarElement, setVisible, size]);

    // 卸载时清掉可能残留的全局监听与 onselectstart 覆盖
    useEffect(
      () => () => {
        document.removeEventListener("mousemove", onMouseMoveDocument);
        document.removeEventListener("mouseup", onMouseUpDocument);
        restoreOnselectstart();
      },
      [onMouseMoveDocument, onMouseUpDocument, restoreOnselectstart],
    );

    const thumbStyle: CSSProperties = renderThumbStyle({ size, move, bar });

    return (
      <div
        ref={instanceRef}
        className={["el-scrollbar__bar", `is-${bar.key}`].join(" ")}
        style={{ display: always ? "" : "none" }}
        onMouseDown={handleTrackMouseDown}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={thumbRef}
          className="el-scrollbar__thumb"
          style={thumbStyle}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    );
  },
);
