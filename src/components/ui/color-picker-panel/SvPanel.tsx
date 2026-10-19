"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { addUnit } from "../utils";
import { useTranslator } from "../config-provider/context";
import { draggable } from "./draggable";
import { getClientXY } from "./use-slider";
import type Color from "./color";

export interface SvPanelProps {
  color: Color;
  disabled?: boolean;
  className?: string;
}

// 官方二维滑块用逗号分隔的 aria 值，React 的类型只接受 number，运行时仍输出字符串
const ariaRangeValue = (value: string) => value as unknown as number;

/** 对应官方 color-picker-panel/components/sv-panel。 */
export function SvPanel({ color, disabled = false, className }: SvPanelProps) {
  useSyncExternalStore(color.subscribe, color.getVersion, color.getVersion);

  const t = useTranslator();
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const next = { width: root.clientWidth, height: root.clientHeight };
      setSize((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root || disabled) return;

      const rect = root.getBoundingClientRect();
      const { clientX, clientY } = getClientXY(event);

      let left = clientX - rect.left;
      let top = clientY - rect.top;
      left = Math.max(0, left);
      left = Math.min(left, rect.width);

      top = Math.max(0, top);
      top = Math.min(top, rect.height);

      color.set({
        saturation: (left / rect.width) * 100,
        value: 100 - (top / rect.height) * 100,
      });
    },
    [color, disabled],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    return draggable(root, { drag: handleDrag, end: handleDrag });
  }, [handleDrag]);

  const saturation = color.get("saturation") as number;
  const brightness = color.get("value") as number;
  const hue = color.get("hue") as number;

  const cursorLeft = (saturation * size.width) / 100;
  const cursorTop = ((100 - brightness) * size.height) / 100;

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.target !== cursorRef.current) handleDrag(event.nativeEvent);
    cursorRef.current?.focus({ preventScroll: true });
  };

  const handleKeydown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const step = event.shiftKey ? 10 : 1;
    let isPreventDefault = true;

    const incrementSaturation = (delta: number) => {
      let next = saturation + delta;
      next = next < 0 ? 0 : next > 100 ? 100 : next;
      color.set("saturation", next);
    };

    const incrementBrightness = (delta: number) => {
      let next = brightness + delta;
      next = next < 0 ? 0 : next > 100 ? 100 : next;
      color.set("value", next);
    };

    switch (event.key) {
      case "ArrowLeft":
        incrementSaturation(-step);
        break;
      case "ArrowRight":
        incrementSaturation(step);
        break;
      case "ArrowUp":
        incrementBrightness(step);
        break;
      case "ArrowDown":
        incrementBrightness(-step);
        break;
      default:
        isPreventDefault = false;
        break;
    }

    if (isPreventDefault) event.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      className={["el-color-svpanel", className].filter(Boolean).join(" ")}
      style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
      onClick={handleClick}
    >
      <div
        ref={cursorRef}
        className="el-color-svpanel__cursor"
        style={{ top: addUnit(cursorTop), left: addUnit(cursorLeft) }}
        role="slider"
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled}
        aria-valuemin={ariaRangeValue("0,0")}
        aria-valuemax={ariaRangeValue("100,100")}
        aria-label={t("el.colorpicker.svLabel")}
        aria-valuenow={ariaRangeValue(`${saturation},${brightness}`)}
        aria-valuetext={t("el.colorpicker.svDescription", {
          saturation,
          brightness,
          color: color.value,
        })}
        onKeyDown={handleKeydown}
      />
    </div>
  );
}
