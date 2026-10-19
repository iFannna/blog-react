"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";
import { ElCheckbox } from "./ElCheckbox";
import { CheckboxGroupContext } from "./CheckboxGroupContext";
import { useFormDisabled, useFormItem } from "../form/use-form";
import type { CheckboxValueType, ComponentSize } from "./context";

export interface CheckboxGroupProps {
  /** 容器 id，对应官方 id */
  id?: string;
  /** 无障碍标签，对应官方 aria-label */
  ariaLabel?: string;
  /** 选中值集合，对应官方 v-model 的数组形态 */
  value?: CheckboxValueType[];
  /** 选中集合变化 */
  onChange?: (value: CheckboxValueType[]) => void;
  /** 是否禁用组内所有选项 */
  disabled?: boolean;
  /** 最少选中数量 */
  min?: number;
  /** 最多选中数量 */
  max?: number;
  /** 尺寸 */
  size?: ComponentSize;
  /** 选中集合变化时是否触发表单校验，对应官方 validate-event */
  validateEvent?: boolean;
  /** button 形态下选中态的背景色 */
  fill?: string;
  /** button 形态下选中态的字体色 */
  textColor?: string;
  /** 容器标签名，对应官方 tag */
  tag?: string;
  /** 数据化渲染选项，对应官方 options */
  options?: Array<Record<string, unknown>>;
  /** 选项字段别名，对应官方 props */
  optionProps?: { value?: string; label?: string; disabled?: string };
  /** 渲染形态，对应官方 type */
  type?: "checkbox" | "button";
  className?: string;
  children?: ReactNode;
}

const DEFAULT_OPTION_PROPS = {
  value: "value",
  label: "label",
  disabled: "disabled",
} as const;

/** 对应官方 ElCheckboxGroup：把选中集合与禁用/尺寸等下发到组内 Checkbox。 */
export function ElCheckboxGroup({
  id,
  ariaLabel = "checkbox-group",
  value = [],
  onChange,
  disabled,
  min,
  max,
  size,
  validateEvent = true,
  fill,
  textColor,
  tag = "div",
  options,
  optionProps,
  type = "checkbox",
  className,
  children,
}: CheckboxGroupProps) {
  const alias = { ...DEFAULT_OPTION_PROPS, ...optionProps };
  // 官方在 group 层解析 Form 的 disabled，再下发给组内所有 Checkbox
  const resolvedDisabled = useFormDisabled(disabled);

  // 对应官方 watch(modelValue)：集合内容变化后触发 change 校验
  const { formItem } = useFormItem();
  const prevValueRef = useRef(value);
  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;
    if (!validateEvent) return;
    const unchanged =
      prev.length === value.length &&
      value.every((item, index) => item === prev[index]);
    if (unchanged) return;
    formItem?.validate("change").catch(() => {});
  }, [value, validateEvent, formItem]);

  const classes = ["el-checkbox-group", className].filter(Boolean).join(" ");

  // options 数据化渲染，字段名可经 optionProps 重命名
  const optionNodes = options?.map((option, index) => {
    const { value: valueKey, label: labelKey, disabled: disabledKey } = alias;

    return (
      <ElCheckbox
        key={index}
        value={option[valueKey] as CheckboxValueType}
        label={option[labelKey] as ReactNode}
        disabled={option[disabledKey] as boolean | undefined}
        button={type === "button"}
      />
    );
  });

  return (
    <CheckboxGroupContext.Provider
      value={{
        value,
        onChange: onChange ?? (() => {}),
        disabled: resolvedDisabled,
        size,
        min,
        max,
        fill,
        textColor,
        type,
      }}
    >
      {createElement(
        tag,
        { id, className: classes, role: "group", "aria-label": ariaLabel },
        children ?? optionNodes,
      )}
    </CheckboxGroupContext.Provider>
  );
}
