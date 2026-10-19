"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ElInput } from "../input/ElInput";
import { useFormDisabled, useFormItem } from "../form/use-form";
import Color from "./color";
import { ColorContext } from "./context";
import { AlphaSlider } from "./AlphaSlider";
import { HueSlider } from "./HueSlider";
import { Predefine } from "./Predefine";
import { SvPanel } from "./SvPanel";
import type { ColorPickerPanelProps } from "./types";

/** 对应官方 ElColorPickerPanel。 */
export function ElColorPickerPanel({
  value,
  border = true,
  showAlpha = false,
  colorFormat,
  disabled: disabledProp,
  predefine,
  validateEvent = true,
  hueSliderClass,
  hueSliderStyle,
  footer,
  className,
  style,
  onChange,
  onKeyDown,
  ref,
}: ColorPickerPanelProps) {
  const { formItem } = useFormItem();
  const disabled = useFormDisabled(disabledProp);

  const contextColor = useContext(ColorContext);
  const [ownColor] = useState(
    () =>
      new Color({
        enableAlpha: showAlpha,
        format: colorFormat || "",
        value,
      }),
  );
  const color = contextColor ?? ownColor;

  useSyncExternalStore(color.subscribe, color.getVersion, color.getVersion);

  const [, setUpdateTick] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onChangeRef = useRef(onChange);
  const lastEmittedRef = useRef(color.value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 外部绑定值变化时同步到颜色对象，与官方 watch(modelValue) 一致
  useEffect(() => {
    if (value === color.value) return;
    if (value) color.fromString(value);
    else color.clear();
  }, [value, color]);

  // showAlpha / colorFormat 变化后重新生成颜色字符串，并沿用官方「未传格式则保留旧格式」的语义
  const prevConfigRef = useRef({ showAlpha, colorFormat });
  useEffect(() => {
    const prev = prevConfigRef.current;
    if (prev.showAlpha === showAlpha && prev.colorFormat === colorFormat) return;

    prevConfigRef.current = { showAlpha, colorFormat };
    color.configure(showAlpha, colorFormat);
  }, [color, colorFormat, showAlpha]);

  // 颜色变化时向外回传，对应官方 watch(() => color.value)
  useEffect(
    () =>
      color.subscribe(() => {
        if (color.value === lastEmittedRef.current) return;
        lastEmittedRef.current = color.value;
        onChangeRef.current?.(color.value);
      }),
    [color],
  );

  // 输入框内容跟随颜色值；渲染期同步，避免受控值回写时闪一帧旧文本
  const [inputState, setInputState] = useState({
    colorValue: color.value,
    text: color.value,
  });
  if (inputState.colorValue !== color.value) {
    setInputState({ colorValue: color.value, text: color.value });
  }

  const handleConfirm = () => {
    color.fromString(inputState.text);
  };

  const handleFocusout = () => {
    if (!validateEvent) return;
    formItem?.validate("blur").catch(() => {});
  };

  const handleNativeInputRef = useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el;
  }, []);

  const update = useCallback(() => {
    setUpdateTick((tick) => tick + 1);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      color,
      get inputRef() {
        return inputRef.current;
      },
      update,
    }),
    [color, update],
  );

  return (
    <div
      className={[
        "el-color-picker-panel",
        disabled && "is-disabled",
        border && "is-border",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onBlur={handleFocusout}
      onKeyDown={onKeyDown}
    >
      <div className="el-color-picker-panel__wrapper">
        <HueSlider
          color={color}
          vertical
          disabled={disabled}
          className={["hue-slider", hueSliderClass].filter(Boolean).join(" ")}
          style={hueSliderStyle}
        />
        <SvPanel color={color} disabled={disabled} />
      </div>

      {showAlpha && <AlphaSlider color={color} disabled={disabled} />}

      {predefine && (
        <Predefine
          colors={predefine}
          color={color}
          enableAlpha={showAlpha}
          disabled={disabled}
        />
      )}

      <div className="el-color-picker-panel__footer">
        <ElInput
          value={inputState.text}
          size="small"
          disabled={disabled}
          validateEvent={false}
          inputRef={handleNativeInputRef}
          onChange={(next) =>
            setInputState({ colorValue: color.value, text: next })
          }
          onValueChange={handleConfirm}
        />
        {footer}
      </div>
    </div>
  );
}
