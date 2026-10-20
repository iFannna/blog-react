"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { useTranslator } from "../config-provider/context";
import "./hue-bar.module.css";
import { useSlider } from "./use-slider";
import type Color from "./color";

export interface HueSliderProps {
  color: Color;
  vertical?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const MIN_VALUE = 0;
const MAX_VALUE = 360;

/** 对应官方 color-picker-panel/components/hue-slider。 */
export function HueSlider({
  color,
  vertical = false,
  disabled = false,
  className,
  style,
}: HueSliderProps) {
  useSyncExternalStore(color.subscribe, color.getVersion, color.getVersion);

  const t = useTranslator();
  const { rootRef, barRef, thumbRef, currentValue, handleClick, handleKeydown, thumbStyle } =
    useSlider(color, {
      key: "hue",
      minValue: MIN_VALUE,
      maxValue: MAX_VALUE,
      vertical,
      disabled,
    });

  return (
    <div
      ref={rootRef}
      className={[
        "el-color-hue-slider",
        vertical && "is-vertical",
        disabled && "is-disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div ref={barRef} className="el-color-hue-slider__bar" onClick={handleClick} />
      <div
        ref={thumbRef}
        className="el-color-hue-slider__thumb"
        style={thumbStyle}
        role="slider"
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled}
        aria-label={t("el.colorpicker.hueLabel")}
        aria-valuenow={currentValue}
        aria-valuetext={t("el.colorpicker.hueDescription", {
          hue: currentValue,
          color: color.value,
        })}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        aria-valuemin={MIN_VALUE}
        aria-valuemax={MAX_VALUE}
        onKeyDown={handleKeydown}
      />
    </div>
  );
}
