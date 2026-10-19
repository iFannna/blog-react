"use client";

import { useSyncExternalStore } from "react";
import { useTranslator } from "../config-provider/context";
import { useSlider } from "./use-slider";
import type Color from "./color";

export interface AlphaSliderProps {
  color: Color;
  vertical?: boolean;
  disabled?: boolean;
  className?: string;
}

const MIN_VALUE = 0;
const MAX_VALUE = 100;

/** 对应官方 color-picker-panel/components/alpha-slider。 */
export function AlphaSlider({
  color,
  vertical = false,
  disabled = false,
  className,
}: AlphaSliderProps) {
  useSyncExternalStore(color.subscribe, color.getVersion, color.getVersion);

  const t = useTranslator();
  const { rootRef, barRef, thumbRef, currentValue, handleClick, handleKeydown, thumbStyle } =
    useSlider(color, {
      key: "alpha",
      minValue: MIN_VALUE,
      maxValue: MAX_VALUE,
      vertical,
      disabled,
    });

  const { r, g, b } = color.toRgb();
  const background = color.value
    ? `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`
    : "";

  return (
    <div
      ref={rootRef}
      className={[
        "el-color-alpha-slider",
        vertical && "is-vertical",
        disabled && "is-disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        ref={barRef}
        className="el-color-alpha-slider__bar"
        style={{ background }}
        onClick={handleClick}
      />
      <div
        ref={thumbRef}
        className="el-color-alpha-slider__thumb"
        style={thumbStyle}
        role="slider"
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled}
        aria-label={t("el.colorpicker.alphaLabel")}
        aria-valuenow={currentValue}
        aria-valuetext={t("el.colorpicker.alphaDescription", {
          alpha: currentValue,
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
