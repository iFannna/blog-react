"use client";

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElRadio } from "./ElRadio";
import { RadioGroupContext, type RadioValue } from "./context";
import { useFormItem, useFormItemInputId } from "../form/use-form";
import type { ComponentSize } from "../button/types";

export interface RadioGroupProps {
  /** 容器 id，对应官方 id */
  id?: string;
  /** 无障碍标签，对应官方 aria-label */
  ariaLabel?: string;
  /** 当前选中值，对应官方 v-model */
  value?: RadioValue;
  /** 选中值变化，对应官方 v-model + change */
  onChange?: (value: RadioValue) => void;
  disabled?: boolean;
  size?: ComponentSize;
  /** 选中值变化时是否触发表单校验，对应官方 validate-event */
  validateEvent?: boolean;
  /** 原生 name */
  name?: string;
  /** button 形态下选中态的背景色 */
  fill?: string;
  /** button 形态下选中态的字体色 */
  textColor?: string;
  /** 数据化渲染选项，对应官方 options */
  options?: Array<Record<string, unknown>>;
  /** 选项字段别名，对应官方 props */
  optionProps?: { value?: string; label?: string; disabled?: string };
  /** 渲染形态，对应官方 type */
  type?: "radio" | "button";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const DEFAULT_OPTION_PROPS = {
  value: "value",
  label: "label",
  disabled: "disabled",
} as const;

/** 对应官方 ElRadioGroup：把选中值与禁用/尺寸下发到组内 Radio。 */
export function ElRadioGroup({
  id,
  ariaLabel = "radio-group",
  value,
  onChange,
  disabled,
  size,
  validateEvent = true,
  name,
  fill,
  textColor,
  options,
  optionProps,
  type = "radio",
  className,
  style,
  children,
}: RadioGroupProps) {
  const alias = { ...DEFAULT_OPTION_PROPS, ...optionProps };
  const { inputId } = useFormItemInputId({ id, ariaLabel });
  // 官方未传 name 时会生成一个组内共用的 name，保证浏览器原生单选组语义
  const generatedName = useId();
  const resolvedName = name ?? generatedName;

  // 对应官方 watch(modelValue)：值变化后触发 change 校验
  const { formItem } = useFormItem();
  const prevValueRef = useRef(value);
  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;
    if (validateEvent && prev !== value) {
      formItem?.validate("change").catch(() => {});
    }
  }, [value, validateEvent, formItem]);

  const classes = ["el-radio-group", className].filter(Boolean).join(" ");

  const optionNodes = options?.map((option, index) => (
    <ElRadio
      key={index}
      value={option[alias.value] as RadioValue}
      label={option[alias.label] as ReactNode}
      disabled={option[alias.disabled] as boolean | undefined}
      button={type === "button"}
    />
  ));

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        onChange: onChange ?? (() => {}),
        disabled,
        size,
        name: resolvedName,
        fill,
        textColor,
        type,
      }}
    >
      <div
        id={inputId}
        className={classes}
        style={style}
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {children ?? optionNodes}
      </div>
    </RadioGroupContext.Provider>
  );
}
