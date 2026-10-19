"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { addUnit } from "../utils";
import { ElScrollbarThumb } from "./Thumb";
import { GAP } from "./util";

export type ScrollbarDirection = "top" | "bottom" | "left" | "right";

export interface ScrollbarProps {
  /** 触发 end-reached 的距离阈值（px） */
  distance?: number;
  /** 滚动容器高度 */
  height?: number | string;
  /** 滚动容器最大高度 */
  maxHeight?: number | string;
  /** 是否使用原生滚动条 */
  native?: boolean;
  /** wrap 的样式 */
  wrapStyle?: CSSProperties;
  /** wrap 的类名 */
  wrapClass?: string;
  /** view 的类名 */
  viewClass?: string;
  /** view 的样式 */
  viewStyle?: CSSProperties;
  /** 容器尺寸不变时置为 true 可省去尺寸监听 */
  noresize?: boolean;
  /** view 的标签名 */
  tag?: string;
  /** 是否总是显示滚动条 */
  always?: boolean;
  /** 滚动条最小尺寸 */
  minSize?: number;
  /** wrap 的 tabindex */
  tabindex?: number | string;
  /** view 的 id */
  id?: string;
  /** view 的 role */
  role?: string;
  /** view 的 aria-label */
  ariaLabel?: string;
  /** view 的 aria-orientation */
  ariaOrientation?: "horizontal" | "vertical";
  /** 滚动时触发 */
  onScroll?: (payload: { scrollTop: number; scrollLeft: number }) => void;
  /** 滚动到边界时触发 */
  onEndReached?: (direction: ScrollbarDirection) => void;
  /** 透传到滚动容器根元素的鼠标事件，对应 Vue 的 attrs 透传 */
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface ScrollbarExpose {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  update: () => void;
  scrollTo: {
    (x: number, y?: number): void;
    (options: ScrollToOptions): void;
  };
  setScrollTop: (value: number) => void;
  setScrollLeft: (value: number) => void;
  handleScroll: () => void;
}

const DIRECTION_PAIRS: Record<ScrollbarDirection, ScrollbarDirection> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * 对应官方 ElScrollbar。
 *
 * 结构：.el-scrollbar > .el-scrollbar__wrap > .el-scrollbar__view + 两条 .el-scrollbar__bar。
 * 原生滚动条隐藏（wrap--hidden-default），可见滚动条自绘并支持拖动，换算逻辑与官方一致。
 */
export const ElScrollbar = forwardRef<ScrollbarExpose, ScrollbarProps>(
  function ElScrollbar(
    {
      distance = 0,
      height = "",
      maxHeight = "",
      native = false,
      wrapStyle,
      wrapClass,
      viewClass,
      viewStyle,
      noresize = false,
      tag = "div",
      always = false,
      minSize = 20,
      tabindex,
      id,
      role,
      ariaLabel,
      ariaOrientation,
      onScroll,
      onEndReached,
      onMouseMove,
      onMouseLeave,
      onKeyDown,
      className,
      style,
      children,
    },
    ref,
  ) {
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);

    const [moveX, setMoveX] = useState(0);
    const [moveY, setMoveY] = useState(0);
    const [sizeWidth, setSizeWidth] = useState("");
    const [sizeHeight, setSizeHeight] = useState("");
    const [ratioX, setRatioX] = useState(1);
    const [ratioY, setRatioY] = useState(1);

    // 比例值既要参与渲染（传给滑块），又要在滚动回调里同步读到最新值，
    // 因此渲染用 state、换算用 ref 双份持有，避免读到过期闭包
    const ratioXRef = useRef(1);
    const ratioYRef = useRef(1);

    // 命令式中间量，不参与渲染，对应官方组件作用域的 let
    const stateRef = useRef({
      wrapScrollTop: 0,
      wrapScrollLeft: 0,
      direction: "" as ScrollbarDirection | "",
      distanceScrollState: { bottom: false, top: false, right: false, left: false },
    });

    /** 对应官方 bar.vue 的 update：按滚动尺寸算出滑块大小与位移比例。 */
    const updateBar = useCallback(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const offsetHeight = wrap.offsetHeight - GAP;
      const offsetWidth = wrap.offsetWidth - GAP;

      const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
      const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
      const thumbHeight = Math.max(originalHeight, minSize);
      const thumbWidth = Math.max(originalWidth, minSize);

      const nextRatioY =
        originalHeight /
        (offsetHeight - originalHeight) /
        (thumbHeight / (offsetHeight - thumbHeight));
      const nextRatioX =
        originalWidth /
        (offsetWidth - originalWidth) /
        (thumbWidth / (offsetWidth - thumbWidth));

      ratioYRef.current = nextRatioY || 1;
      ratioXRef.current = nextRatioX || 1;
      setRatioY(nextRatioY || 1);
      setRatioX(nextRatioX || 1);

      setSizeHeight(thumbHeight + GAP < offsetHeight ? `${thumbHeight}px` : "");
      setSizeWidth(thumbWidth + GAP < offsetWidth ? `${thumbWidth}px` : "");
    }, [minSize]);

    /** 对应官方 bar.vue 的 handleScroll：把滚动量换算成滑块位移百分比。 */
    const syncBarPosition = useCallback(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const offsetHeight = wrap.offsetHeight - GAP;
      const offsetWidth = wrap.offsetWidth - GAP;

      setMoveY(((wrap.scrollTop * 100) / offsetHeight) * ratioYRef.current);
      setMoveX(((wrap.scrollLeft * 100) / offsetWidth) * ratioXRef.current);
    }, []);

    const update = useCallback(() => {
      updateBar();
      if (wrapRef.current) syncBarPosition();
      const dir = stateRef.current.direction;
      if (dir) stateRef.current.distanceScrollState[dir] = false;
    }, [syncBarPosition, updateBar]);

    const handleScroll = useCallback(() => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      syncBarPosition();

      const prevTop = stateRef.current.wrapScrollTop;
      const prevLeft = stateRef.current.wrapScrollLeft;
      stateRef.current.wrapScrollTop = wrap.scrollTop;
      stateRef.current.wrapScrollLeft = wrap.scrollLeft;

      const arrivedStates = {
        bottom: !(
          wrap.scrollHeight - distance >
          wrap.clientHeight + stateRef.current.wrapScrollTop
        ),
        top: stateRef.current.wrapScrollTop <= distance && prevTop !== 0,
        right:
          !(
            wrap.scrollWidth - distance >
            wrap.clientWidth + stateRef.current.wrapScrollLeft
          ) && prevLeft !== stateRef.current.wrapScrollLeft,
        left: stateRef.current.wrapScrollLeft <= distance && prevLeft !== 0,
      };

      onScroll?.({
        scrollTop: stateRef.current.wrapScrollTop,
        scrollLeft: stateRef.current.wrapScrollLeft,
      });

      if (prevTop !== stateRef.current.wrapScrollTop) {
        stateRef.current.direction =
          stateRef.current.wrapScrollTop > prevTop ? "bottom" : "top";
      }
      if (prevLeft !== stateRef.current.wrapScrollLeft) {
        stateRef.current.direction =
          stateRef.current.wrapScrollLeft > prevLeft ? "right" : "left";
      }

      const dir = stateRef.current.direction;
      if (!dir) return;

      if (distance > 0) {
        if (stateRef.current.distanceScrollState[dir]) return;

        // 到达某方向后，要等相反方向也到达才允许再次派发，避免连续触发
        const opposite = DIRECTION_PAIRS[dir];
        if (arrivedStates[dir]) stateRef.current.distanceScrollState[dir] = true;
        if (
          !arrivedStates[opposite] &&
          stateRef.current.distanceScrollState[opposite]
        ) {
          stateRef.current.distanceScrollState[opposite] = false;
        }
      }

      if (arrivedStates[dir]) onEndReached?.(dir);
    }, [distance, onEndReached, onScroll, syncBarPosition]);

    const scrollTo = useCallback(
      (arg1: number | ScrollToOptions, arg2?: number) => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        if (typeof arg1 === "object") {
          wrap.scrollTo(arg1);
        } else if (typeof arg2 === "number") {
          wrap.scrollTo(arg1, arg2);
        }
      },
      [],
    ) as ScrollbarExpose["scrollTo"];

    const setScrollTop = useCallback((value: number) => {
      if (typeof value !== "number") return;
      if (wrapRef.current) wrapRef.current.scrollTop = value;
    }, []);

    const setScrollLeft = useCallback((value: number) => {
      if (typeof value !== "number") return;
      if (wrapRef.current) wrapRef.current.scrollLeft = value;
    }, []);

    // 尺寸变化时重算滑块；noresize 时省掉监听
    useEffect(() => {
      if (native || noresize) return;

      const observer = new ResizeObserver(() => update());
      if (viewRef.current) observer.observe(viewRef.current);
      if (wrapRef.current) observer.observe(wrapRef.current);
      window.addEventListener("resize", update);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", update);
      };
    }, [native, noresize, update]);

    // 挂载与高度变化后各量一次，对应官方 onMounted 与 watch([maxHeight, height])
    useEffect(() => {
      if (native) return;
      const timer = window.setTimeout(update, 0);
      return () => window.clearTimeout(timer);
    }, [height, maxHeight, native, update]);

    useImperativeHandle(
      ref,
      () => ({ wrapRef, update, scrollTo, setScrollTop, setScrollLeft, handleScroll }),
      [handleScroll, scrollTo, setScrollLeft, setScrollTop, update],
    );

    const wrapStyles: CSSProperties = { ...wrapStyle };
    const heightUnit = addUnit(height);
    const maxHeightUnit = addUnit(maxHeight);
    if (heightUnit) wrapStyles.height = heightUnit;
    if (maxHeightUnit) wrapStyles.maxHeight = maxHeightUnit;

    const ViewTag = tag as "div";

    return (
      <div
        ref={scrollbarRef}
        className={["el-scrollbar", className].filter(Boolean).join(" ")}
        style={style}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
      >
        <div
          ref={wrapRef}
          className={[
            "el-scrollbar__wrap",
            !native && "el-scrollbar__wrap--hidden-default",
            wrapClass,
          ]
            .filter(Boolean)
            .join(" ")}
          style={wrapStyles}
          tabIndex={tabindex === undefined ? undefined : Number(tabindex)}
          onScroll={handleScroll}
        >
          <ViewTag
            ref={viewRef}
            id={id}
            className={["el-scrollbar__view", viewClass].filter(Boolean).join(" ")}
            style={viewStyle}
            role={role}
            aria-label={ariaLabel}
            aria-orientation={ariaOrientation}
          >
            {children}
          </ViewTag>
        </div>

        {!native && (
          <>
            <ElScrollbarThumb
              move={moveX}
              ratio={ratioX}
              size={sizeWidth}
              always={always}
              scrollbarElement={scrollbarRef}
              wrapElement={wrapRef}
            />
            <ElScrollbarThumb
              move={moveY}
              ratio={ratioY}
              size={sizeHeight}
              always={always}
              vertical
              scrollbarElement={scrollbarRef}
              wrapElement={wrapRef}
            />
          </>
        )}
      </div>
    );
  },
);
