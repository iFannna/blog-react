"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { addUnit } from "../utils";
import { draggable } from "./draggable";
import type Color from "./color";

interface SliderOptions {
  key: "hue" | "alpha";
  minValue: number;
  maxValue: number;
  vertical?: boolean;
  disabled?: boolean;
}

export function getClientXY(event: MouseEvent | TouchEvent) {
  if ("touches" in event && event.touches.length > 0) {
    return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
  }
  if ("changedTouches" in event && event.changedTouches.length > 0) {
    return {
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY,
    };
  }
  const mouseEvent = event as MouseEvent;
  return { clientX: mouseEvent.clientX, clientY: mouseEvent.clientY };
}

/**
 * 官方 useSlider + useSliderDOM 的合并版。
 * 位置由容器尺寸与颜色值推导（官方在 update() 里做同样的计算），
 * 尺寸变化交给 ResizeObserver。
 */
export function useSlider(color: Color, options: SliderOptions) {
  const { key, minValue, maxValue, vertical = false, disabled = false } = options;

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
    thumbWidth: 0,
    thumbHeight: 0,
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const thumb = thumbRef.current;
    if (!root || !thumb) return;

    const measure = () => {
      const next = {
        width: root.offsetWidth,
        height: root.offsetHeight,
        thumbWidth: thumb.offsetWidth,
        thumbHeight: thumb.offsetHeight,
      };
      setLayout((prev) =>
        prev.width === next.width &&
        prev.height === next.height &&
        prev.thumbWidth === next.thumbWidth &&
        prev.thumbHeight === next.thumbHeight
          ? prev
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const currentValue = color.get(key) as number;

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      const thumb = thumbRef.current;
      if (!root || !thumb || disabled) return;

      const rect = root.getBoundingClientRect();
      const { clientX, clientY } = getClientXY(event);
      let value: number;

      if (!vertical) {
        let left = clientX - rect.left;
        left = Math.max(thumb.offsetWidth / 2, left);
        left = Math.min(left, rect.width - thumb.offsetWidth / 2);

        value = Math.round(
          ((left - thumb.offsetWidth / 2) /
            (rect.width - thumb.offsetWidth)) *
            maxValue,
        );
      } else {
        let top = clientY - rect.top;
        top = Math.max(thumb.offsetHeight / 2, top);
        top = Math.min(top, rect.height - thumb.offsetHeight / 2);

        value = Math.round(
          ((top - thumb.offsetHeight / 2) /
            (rect.height - thumb.offsetHeight)) *
            maxValue,
        );
      }

      color.set(key, value);
    },
    [color, disabled, key, maxValue, vertical],
  );

  useLayoutEffect(() => {
    const bar = barRef.current;
    const thumb = thumbRef.current;
    if (!bar || !thumb) return;

    const config = { drag: handleDrag, end: handleDrag };
    const cleanupBar = draggable(bar, config);
    const cleanupThumb = draggable(thumb, config);

    return () => {
      cleanupBar();
      cleanupThumb();
    };
  }, [handleDrag]);

  const incrementPosition = useCallback(
    (step: number) => {
      let next = currentValue + step;
      next = next < minValue ? minValue : next > maxValue ? maxValue : next;
      color.set(key, next);
    },
    [color, currentValue, key, maxValue, minValue],
  );

  const handleKeydown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      const { shiftKey } = event;
      const step = shiftKey ? 10 : 1;
      // 官方：色相滑块方向与常规滑块相反
      const reverse = key === "hue" ? -1 : 1;
      let isPreventDefault = true;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowDown":
          incrementPosition(-step * reverse);
          break;
        case "ArrowRight":
        case "ArrowUp":
          incrementPosition(step * reverse);
          break;
        case "Home":
          color.set(key, key === "hue" ? maxValue : minValue);
          break;
        case "End":
          color.set(key, key === "hue" ? minValue : maxValue);
          break;
        case "PageDown":
          incrementPosition(-4 * reverse);
          break;
        case "PageUp":
          incrementPosition(4 * reverse);
          break;
        default:
          isPreventDefault = false;
          break;
      }

      if (isPreventDefault) event.preventDefault();
    },
    [color, disabled, incrementPosition, key, maxValue, minValue],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.target !== thumbRef.current) handleDrag(event.nativeEvent);
      thumbRef.current?.focus();
    },
    [disabled, handleDrag],
  );

  const thumbLeft = vertical
    ? 0
    : Math.round(
        (currentValue * (layout.width - layout.thumbWidth / 2)) / maxValue,
      );
  const thumbTop = vertical
    ? Math.round(
        (currentValue * (layout.height - layout.thumbHeight / 2)) / maxValue,
      )
    : 0;

  return {
    rootRef,
    barRef,
    thumbRef,
    currentValue,
    handleClick,
    handleDrag,
    handleKeydown,
    thumbStyle: {
      left: addUnit(thumbLeft),
      top: addUnit(thumbTop),
    },
  };
}
