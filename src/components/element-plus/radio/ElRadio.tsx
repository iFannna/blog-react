"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useRadioGroup, type RadioValue } from "./context";
import { useFormDisabled, useFormSize } from "../form/use-form";
import type { ComponentSize } from "../button/types";

export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "checked" | "defaultChecked" | "onChange" | "size" | "type"
  > {
  /** 本选项的值，选中时与 group 的 value 相等 */
  value?: RadioValue;
  /** 独立使用时的选中态，对应官方 model-value */
  checked?: boolean;
  /** 独立使用时选中态变化，对应官方 update:model-value */
  onCheckedChange?: (checked: boolean) => void;
  /** 显示文案，对应官方默认插槽的简化写法 */
  label?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示边框 */
  border?: boolean;
  /** 尺寸 */
  size?: ComponentSize;
  /**
   * button 形态，对应官方 ElRadioButton。
   * 组内使用时由 group 的 type 决定，无需单独传。
   */
  button?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElRadio。
 *
 * Radio 通常配合 ElRadioGroup 使用：选中值由 group 的 value 决定，
 * 本组件只用 value 标识自己。
 */
export function ElRadio({
  value,
  checked,
  onCheckedChange,
  label,
  disabled,
  border = false,
  size,
  button,
  className,
  style,
  children,
  id,
  name,
  ...restProps
}: RadioProps) {
  const group = useRadioGroup();
  const generatedId = useId();
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id ?? generatedId;

  // 组内以 group.type 决定形态，独立使用时看自身 button
  const isButton = button ?? group?.type === "button";

  const isChecked = group ? group.value === value : !!checked;
  // 官方 size / disabled 优先取组件自身，其次 radio-group，再次 FormItem / Form
  const isDisabled = useFormDisabled(disabled ?? group?.disabled);
  const resolvedSize = useFormSize(size ?? group?.size);
  const resolvedName = name ?? group?.name;

  const actualValue = value;

  const handleChange = () => {
    if (group) group.onChange(actualValue as RadioValue);
    else onCheckedChange?.(true);
  };

  const activeStyle: CSSProperties | undefined =
    isButton && isChecked
      ? {
          backgroundColor: group?.fill ?? "",
          borderColor: group?.fill ?? "",
          color: group?.textColor ?? "",
          boxShadow: group?.fill ? `-1px 0 0 0 ${group.fill}` : undefined,
        }
      : undefined;

  // button 形态：官方 ElRadioButton，结构与普通 Radio 不同
  if (isButton) {
    const classes = [
      "el-radio-button",
      isChecked && "is-active",
      isDisabled && "is-disabled",
      isFocused && "is-focus",
      resolvedSize && `el-radio-button--${resolvedSize}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={classes} style={style}>
        <input
          {...restProps}
          id={inputId}
          className="el-radio-button__original-radio"
          type="radio"
          value={String(actualValue)}
          name={resolvedName}
          disabled={isDisabled}
          checked={isChecked}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(event) => event.stopPropagation()}
        />
        <span
          className="el-radio-button__inner"
          style={activeStyle}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {children ?? label}
        </span>
      </label>
    );
  }

  const rootClasses = [
    "el-radio",
    isDisabled && "is-disabled",
    isFocused && "is-focus",
    border && "is-bordered",
    isChecked && "is-checked",
    resolvedSize && `el-radio--${resolvedSize}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spanClasses = [
    "el-radio__input",
    isDisabled && "is-disabled",
    isChecked && "is-checked",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={rootClasses} style={style}>
      <span className={spanClasses}>
        <input
          {...restProps}
          id={inputId}
          className="el-radio__original"
          type="radio"
          value={String(actualValue)}
          name={resolvedName}
          disabled={isDisabled}
          checked={isChecked}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={(event) => event.stopPropagation()}
        />
        <span className="el-radio__inner" />
      </span>
      <span
        className="el-radio__label"
        onKeyDown={(event) => event.stopPropagation()}
      >
        {children ?? label}
      </span>
    </label>
  );
}
