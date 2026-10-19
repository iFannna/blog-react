"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useCheckboxGroup } from "./CheckboxGroupContext";
import {
  useFormDisabled,
  useFormItem,
  useFormSize,
} from "../form/use-form";
import type { CheckboxValueType, ComponentSize } from "./context";

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "checked" | "defaultChecked" | "onChange" | "size" | "type"
  > {
  /**
   * 独立使用时是否选中。组内使用时忽略，由 group 的 value 推导。
   * 对应官方 modelValue 的布尔形态。
   */
  checked?: boolean;
  /** 独立使用时选中态变化，对应官方 modelValue 布尔形态 + change 事件 */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * 组内使用时标识本选项的值。
   * 同时兼容官方 value 与 label 两种写法（官方在无 value 时以 label 代替 value）。
   */
  value?: CheckboxValueType;
  /** 显示文案，对应官方默认插槽的简化写法 */
  label?: ReactNode;
  /** 半选状态，仅控制样式 */
  indeterminate?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示边框 */
  border?: boolean;
  /** 尺寸 */
  size?: ComponentSize;
  /** 选中态变化时是否触发表单校验，对应官方 validate-event */
  validateEvent?: boolean;
  /**
   * button 形态，对应官方 ElCheckboxButton。
   * 组内使用时由 group 的 type 决定，无需单独传。
   */
  button?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElCheckbox。
 *
 * 两套取值语义与官方一致：
 * - 独立使用：checked 布尔 + onCheckedChange
 * - 组内使用：由 ElCheckboxGroup 的 value 数组与本组件的 value 决定选中态
 *
 * button 形态（官方 ElCheckboxButton）的 DOM 结构完全不同，单独走一条渲染分支。
 * 组内使用时该形态由 group 的 type 下发，与官方由 group 选择渲染哪个组件的行为对齐。
 */
export function ElCheckbox({
  checked,
  onCheckedChange,
  value,
  label,
  indeterminate = false,
  disabled,
  border = false,
  size,
  validateEvent = true,
  button,
  className,
  style,
  children,
  id,
  ...restProps
}: CheckboxProps) {  const group = useCheckboxGroup();
  const generatedId = useId();
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id ?? generatedId;
  const inGroup = group !== null;

  // 组内以 group.type 决定形态，独立使用时看自身 button
  const isButton = button ?? group?.type === "button";

  const isChecked = inGroup
    ? value !== undefined && group.value.includes(value)
    : !!checked;

  // 对应官方 watch(modelValue)：值变化后触发 change 校验；
  // 组内由 CheckboxGroup 统一校验，这里跳过以免重复触发
  const { formItem } = useFormItem();
  const prevCheckedRef = useRef(checked);
  useEffect(() => {
    const prev = prevCheckedRef.current;
    prevCheckedRef.current = checked;
    if (inGroup || !validateEvent || prev === checked) return;
    formItem?.validate("change").catch(() => {});
  }, [checked, inGroup, validateEvent, formItem]);

  /** 组内选中数上下限判定，对应官方 useCheckboxDisabled 的 isLimitDisabled。 */
  const isLimitDisabled = (() => {
    if (!inGroup) return false;

    const count = group.value.length;
    const { min, max } = group;

    return (
      (max !== undefined && count >= max && !isChecked) ||
      (min !== undefined && count <= min && isChecked)
    );
  })();

  // 官方：组内是 group.disabled || 数量限制，独立使用时回退到 Form 的 disabled
  const isDisabled = useFormDisabled(
    disabled ?? (inGroup && (group.disabled || isLimitDisabled) ? true : undefined),
  );
  // 官方 button 形态与非 button 形态各取一次 useFormSize；两次调用都无条件执行，
  // 只在取值时按形态选择，避免违反 Hooks 的调用顺序约束
  const buttonFormSize = useFormSize(group?.size);
  const plainFormSize = useFormSize(size ?? group?.size);
  const resolvedSize = isButton ? buttonFormSize : plainFormSize;

  const hasOwnLabel = children !== undefined || label !== undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (inGroup) {
      const next = event.target.checked
        ? [...group.value, value as CheckboxValueType]
        : group.value.filter((item) => item !== value);

      group.onChange(next, event.nativeEvent);
      return;
    }

    onCheckedChange?.(event.target.checked);
  };

  const commonInputProps = {
    ...restProps,
    id: inputId,
    type: "checkbox" as const,
    checked: isChecked,
    disabled: isDisabled,
    onChange: handleChange,
    onFocus: (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      restProps.onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      restProps.onBlur?.(event);
    },
    // 阻止冒泡，避免 label 包装导致二次触发
    onClick: (event: React.MouseEvent<HTMLInputElement>) => event.stopPropagation(),
  };

  // button 形态：官方 ElCheckboxButton，独立结构与普通 Checkbox 不同
  if (isButton) {
    const fill = group?.fill ?? "";
    const activeStyle: CSSProperties | undefined = isChecked
      ? {
          backgroundColor: fill,
          borderColor: fill,
          color: group?.textColor ?? "",
          boxShadow: fill ? `-1px 0 0 0 ${fill}` : undefined,
        }
      : undefined;

    const buttonClasses = [
      "el-checkbox-button",
      resolvedSize && `el-checkbox-button--${resolvedSize}`,
      isDisabled && "is-disabled",
      isChecked && "is-checked",
      isFocused && "is-focus",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={buttonClasses} style={style} htmlFor={inputId}>
        <input
          {...commonInputProps}
          className="el-checkbox-button__original"
        />
        {hasOwnLabel && (
          <span className="el-checkbox-button__inner" style={activeStyle}>
            {children ?? label}
          </span>
        )}
      </label>
    );
  }

  const rootClasses = [
    "el-checkbox",
    resolvedSize && `el-checkbox--${resolvedSize}`,
    isDisabled && "is-disabled",
    border && "is-bordered",
    isChecked && "is-checked",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spanClasses = [
    "el-checkbox__input",
    isDisabled && "is-disabled",
    isChecked && "is-checked",
    indeterminate && "is-indeterminate",
    isFocused && "is-focus",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={rootClasses} style={style} htmlFor={inputId}>
      <span className={spanClasses}>
        <input
          {...commonInputProps}
          className="el-checkbox__original"
          // 原生 indeterminate 只能经属性设置，React 无对应 prop
          ref={(node) => {
            if (node) node.indeterminate = indeterminate;
          }}
        />
        <span className="el-checkbox__inner" />
      </span>
      {hasOwnLabel && (
        <span className="el-checkbox__label">{children ?? label}</span>
      )}
    </label>
  );
}
