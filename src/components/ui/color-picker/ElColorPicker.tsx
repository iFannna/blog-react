"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { ElButton } from "../button/ElButton";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, Close } from "../icons";
import { ElTooltip } from "../tooltip/ElTooltip";
import { useFormDisabled, useFormItem, useFormItemInputId, useFormSize } from "../form/use-form";
import { useEmptyValues, useTranslator } from "../config-provider/context";
import { debounce } from "../utils";
import Color from "../color-picker-panel/color";
import { ColorContext } from "../color-picker-panel/context";
import {
  ElColorPickerPanel,
  type ColorPickerPanelExpose,
} from "../color-picker-panel";
import type { ColorPickerProps } from "./types";

/** 对应官方 ElColorPicker。 */
export function ElColorPicker({
  value,
  id,
  showAlpha = false,
  colorFormat,
  disabled: disabledProp,
  clearable = true,
  size,
  popperClass,
  popperStyle,
  tabindex = 0,
  teleported = true,
  appendTo,
  predefine,
  validateEvent = true,
  persistent = true,
  emptyValues,
  valueOnClear: valueOnClearProp,
  ariaLabel,
  className,
  style,
  onChange,
  onActiveChange,
  onFocus,
  onBlur,
  onClear,
  ref,
}: ColorPickerProps) {
  const t = useTranslator();
  const { formItem } = useFormItem();
  const colorDisabled = useFormDisabled(disabledProp);
  const colorSize = useFormSize(size);
  const { valueOnClear, isEmptyValue } = useEmptyValues({
    emptyValues,
    valueOnClear: valueOnClearProp,
  });
  const { inputId, isLabeledByFormItem } = useFormItemInputId({ id, ariaLabel });

  const [color] = useState(
    () =>
      new Color({
        enableAlpha: showAlpha,
        format: colorFormat || "",
        value,
      }),
  );
  useSyncExternalStore(color.subscribe, color.getVersion, color.getVersion);

  const [showPicker, setShowPicker] = useState(false);
  const [showPanelColor, setShowPanelColor] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pickerPanelRef = useRef<ColorPickerPanelExpose>(null);

  // active-change 不应由外部绑定值回写触发
  const shouldActiveChangeRef = useRef(true);
  const valueRef = useRef(value);
  const onActiveChangeRef = useRef(onActiveChange);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  const debounceSetShowPicker = useMemo(
    () => debounce(setShowPicker, 100, true),
    [],
  );

  useEffect(() => () => debounceSetShowPicker.cancel(), [debounceSetShowPicker]);

  // 绑定值变化时同步颜色；回写期间抑制 active-change
  useEffect(() => {
    if (!value) {
      // 同步 setState 会触发级联渲染，放到微任务里与官方 nextTick 的心智一致
      queueMicrotask(() => setShowPanelColor(false));
    } else if (value !== color.value) {
      shouldActiveChangeRef.current = false;
      color.fromString(value);
    }
  }, [value, color]);

  // 颜色变化时向外派发 active-change，并在无绑定值时保持面板颜色可见
  useEffect(
    () =>
      color.subscribe(() => {
        if (shouldActiveChangeRef.current) {
          onActiveChangeRef.current?.(color.value || null);
        }
        shouldActiveChangeRef.current = true;

        if (!value && !showPanelColor) setShowPanelColor(true);
      }),
    [color, showPanelColor, value],
  );

  const resetColor = useCallback(() => {
    // 与官方一样等一拍，让受控值先完成回写
    window.setTimeout(() => {
      const latest = valueRef.current;
      if (latest) {
        color.fromString(latest);
      } else {
        color.value = "";
        setShowPanelColor(false);
      }
    }, 0);
  }, [color]);

  const hide = useCallback(() => {
    debounceSetShowPicker(false);
    resetColor();
  }, [debounceSetShowPicker, resetColor]);

  const show = useCallback(() => {
    if (colorDisabled) return;
    setShowPicker(true);
  }, [colorDisabled]);

  const handleTrigger = () => {
    if (colorDisabled) return;
    if (showPicker) resetColor();
    debounceSetShowPicker(!showPicker);
  };

  const confirmValue = () => {
    const next = isEmptyValue(color.value) ? valueOnClear : color.value;
    onChange?.((next as string | null) ?? null);
    if (validateEvent) formItem?.validate("change").catch(() => {});

    debounceSetShowPicker(false);
    resetColor();
  };

  const clear = () => {
    debounceSetShowPicker(false);
    onChange?.((valueOnClear as string | null) ?? null);
    if (value !== valueOnClear && validateEvent) {
      formItem?.validate("change").catch(() => {});
    }
    resetColor();
    onClear?.();
  };

  const handleEsc = (event: KeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPicker(false);
    resetColor();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        event.stopPropagation();
        show();
        break;
      case "Escape":
        handleEsc(event);
        break;
      default:
        break;
    }
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const activeElement =
      (event.relatedTarget as Node | null) || document.activeElement;

    if (
      triggerRef.current?.contains(activeElement) ||
      contentRef.current?.contains(activeElement)
    ) {
      return;
    }

    setIsFocused(false);
    hide();
    if (validateEvent) formItem?.validate("blur").catch(() => {});
    onBlur?.(event);
  };

  // 面板打开后聚焦面板输入框，对应官方 handleShowTooltip
  useEffect(() => {
    if (!showPicker) return;

    const timer = window.setTimeout(() => {
      pickerPanelRef.current?.update();
      pickerPanelRef.current?.inputRef?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [showPicker]);

  // 点击触发器与面板之外时关闭；对应官方 v-click-outside
  useEffect(() => {
    if (!showPicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;

      hide();
      if (isFocused) triggerRef.current?.focus();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hide, isFocused, showPicker]);

  const focus = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    triggerRef.current?.blur();
  }, []);

  useImperativeHandle(
    ref,
    () => ({ color, show, hide, focus, blur }),
    [blur, color, focus, hide, show],
  );

  const displayedColor = (() => {
    if (!value && !showPanelColor) return "transparent";
    const { r, g, b, a } = color.toRgb();
    return showAlpha ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  })();

  const btnClasses = [
    "el-color-picker",
    colorDisabled && "is-disabled",
    colorSize && `el-color-picker--${colorSize}`,
    isFocused && "is-focused",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ColorContext.Provider value={color}>
      <ElTooltip
        visible={showPicker}
        showArrow={false}
        fallbackPlacements={["bottom", "top", "right", "left"]}
        offset={0}
        popperClass={["el-color-picker__panel", popperClass]
          .filter(Boolean)
          .join(" ")}
        popperStyle={popperStyle}
        pure
        role="dialog"
        effect="light"
        trigger={[]}
        teleported={teleported}
        persistent={persistent}
        appendTo={appendTo}
        contentRef={contentRef}
        triggerRef={triggerRef}
        content={
          <ElColorPickerPanel
            ref={pickerPanelRef}
            value={value}
            showAlpha={showAlpha}
            colorFormat={colorFormat}
            predefine={predefine}
            disabled={colorDisabled}
            border={false}
            validateEvent={false}
            onKeyDown={handleEsc}
            footer={
              <div>
                {clearable && (
                  <ElButton
                    className="el-color-footer__link-btn"
                    text
                    size="small"
                    onClick={clear}
                  >
                    {t("el.colorpicker.clear")}
                  </ElButton>
                )}
                <ElButton
                  className="el-color-footer__btn"
                  plain
                  size="small"
                  onClick={confirmValue}
                >
                  {t("el.colorpicker.confirm")}
                </ElButton>
              </div>
            }
          />
        }
      >
        {/* 官方 trigger 使用 aria-description，jsx-a11y 尚未支持该属性的 role 校验 */}
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <div
          id={inputId}
          className={btnClasses}
          style={style}
          role="button"
          tabIndex={colorDisabled ? undefined : Number(tabindex)}
          aria-label={
            isLabeledByFormItem
              ? undefined
              : ariaLabel || t("el.colorpicker.defaultLabel")
          }
          aria-labelledby={isLabeledByFormItem ? formItem?.labelId : undefined}
          aria-description={t("el.colorpicker.description", {
            color: value || "",
          })}
          aria-disabled={colorDisabled}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <div
            className="el-color-picker__trigger"
            onClick={handleTrigger}
          >
            <span
              className={[
                "el-color-picker__color",
                showAlpha && "is-alpha",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span
                className="el-color-picker__color-inner"
                style={{ backgroundColor: displayedColor }}
              >
                <ElIcon
                  className="el-color-picker__icon is-icon-arrow-down"
                  style={{ display: value || showPanelColor ? undefined : "none" }}
                >
                  <ArrowDown />
                </ElIcon>
                <ElIcon
                  className="el-color-picker__empty is-icon-close"
                  style={{ display: !value && !showPanelColor ? undefined : "none" }}
                >
                  <Close />
                </ElIcon>
              </span>
            </span>
          </div>
        </div>
      </ElTooltip>
    </ColorContext.Provider>
  );
}
