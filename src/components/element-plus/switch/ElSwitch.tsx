"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { Loading } from "../icons";
import { useFormItem, useFormItemInputId } from "../form/use-form";
import { addUnit } from "../utils";
import type { ComponentSize } from "../button/types";

type SwitchValue = boolean | string | number;

export interface SwitchProps {
  /** 布尔模式下的选中态，对应官方 modelValue 的布尔形态 */
  checked?: boolean;
  /** 布尔模式下选中态变化 */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * 自定义值模式下的当前值，对应官方 modelValue 的非布尔形态。
   * 传了 activeValue / inactiveValue 时启用该模式。
   */
  value?: SwitchValue;
  /** 自定义值模式下值变化 */
  onChange?: (value: SwitchValue) => void;
  /** 开启时的值，传入即启用自定义值模式 */
  activeValue?: SwitchValue;
  /** 关闭时的值 */
  inactiveValue?: SwitchValue;
  disabled?: boolean;
  loading?: boolean;
  size?: ComponentSize;
  /** 值变化时是否触发表单校验，对应官方 validate-event */
  validateEvent?: boolean;
  /** 开关宽度，对应官方 width */
  width?: string | number;
  /** 文字或图标是否显示在圆点内部 */
  inlinePrompt?: boolean;
  activeText?: string;
  inactiveText?: string;
  activeIcon?: ReactNode;
  inactiveIcon?: ReactNode;
  activeActionIcon?: ReactNode;
  inactiveActionIcon?: ReactNode;
  /** 开启态动作区自定义内容，对应官方 active-action 插槽 */
  activeActionContent?: ReactNode;
  /** 关闭态动作区自定义内容，对应官方 inactive-action 插槽 */
  inactiveActionContent?: ReactNode;
  name?: string;
  id?: string;
  /** 原生 tabindex 属性 */
  tabindex?: string | number;
  /** 无障碍标签，对应官方 aria-label */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** 开启态自定义内容，对应官方 active 插槽 */
  activeContent?: ReactNode;
  /** 关闭态自定义内容，对应官方 inactive 插槽 */
  inactiveContent?: ReactNode;
  /**
   * 切换前钩子。返回 false 或 reject 的 Promise 会阻止切换。
   * 对应官方 beforeChange。
   */
  beforeChange?: () => boolean | Promise<boolean>;
}

/**
 * 对应官方 ElSwitch。
 *
 * 两种取值模式互斥：
 * - 布尔模式（默认）：checked + onCheckedChange
 * - 自定义值模式：传 activeValue/inactiveValue，配合 value + onChange
 */
export function ElSwitch({
  checked,
  onCheckedChange,
  value,
  onChange,
  activeValue,
  inactiveValue,
  disabled,
  loading = false,
  size,
  validateEvent = true,
  width,
  inlinePrompt = false,
  activeText = "",
  inactiveText = "",
  activeIcon,
  inactiveIcon,
  activeActionIcon,
  inactiveActionIcon,
  activeActionContent,
  inactiveActionContent,
  name = "",
  id,
  tabindex,
  ariaLabel,
  className,
  style,
  activeContent,
  inactiveContent,
  beforeChange,
}: SwitchProps) {
  const { inputId } = useFormItemInputId({ id, ariaLabel });

  // 传了 activeValue/inactiveValue 即为自定义值模式，与官方一致
  const isCustomValueMode =
    activeValue !== undefined || inactiveValue !== undefined;

  const resolvedActive = activeValue ?? true;
  const resolvedInactive = inactiveValue ?? false;

  const actualValue: SwitchValue = isCustomValueMode
    ? (value ?? resolvedInactive)
    : (checked ?? false);

  const isChecked = actualValue === resolvedActive;

  // 对应官方 watch(modelValue)：值变化后触发 change 校验
  const { formItem } = useFormItem();
  const prevValueRef = useRef(actualValue);
  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = actualValue;
    if (validateEvent && prev !== actualValue) {
      formItem?.validate("change").catch(() => {});
    }
  }, [actualValue, validateEvent, formItem]);

  const isDisabled = disabled ?? false;
  // 官网在 loading 时也禁用，对应 useFormDisabled 里的判断
  const switchDisabled = isDisabled || loading;

  const emitChange = (next: SwitchValue) => {
    if (isCustomValueMode) {
      onChange?.(next);
    } else {
      onCheckedChange?.(next as boolean);
    }
  };

  const toggle = async () => {
    if (switchDisabled) return;

    const next = isChecked ? resolvedInactive : resolvedActive;

    if (!beforeChange) {
      emitChange(next);
      return;
    }

    try {
      const shouldChange = await beforeChange();
      if (shouldChange) emitChange(next);
    } catch {
      // 官方在此只做 debugWarn，不抛出
    }
  };

  const rootClasses = [
    "el-switch",
    size && `el-switch--${size}`,
    switchDisabled && "is-disabled",
    isChecked && "is-checked",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelLeftClasses = [
    "el-switch__label",
    "el-switch__label--left",
    !isChecked && "is-active",
  ]
    .filter(Boolean)
    .join(" ");

  const labelRightClasses = [
    "el-switch__label",
    "el-switch__label--right",
    isChecked && "is-active",
  ]
    .filter(Boolean)
    .join(" ");

  const coreStyle: CSSProperties = width ? { width: addUnit(width) } : {};

  /** 圆点内部的内容：inlinePrompt 时按状态显示 active/inactive。 */
  const innerNode = (
    <div className="el-switch__inner">
      {!isChecked ? (
        <div className="el-switch__inner-wrapper">
          {inactiveContent ??
            (inactiveIcon ? (
              <ElIcon>{inactiveIcon}</ElIcon>
            ) : (
              inactiveText && <span>{inactiveText}</span>
            ))}
        </div>
      ) : (
        <div className="el-switch__inner-wrapper">
          {activeContent ??
            (activeIcon ? (
              <ElIcon>{activeIcon}</ElIcon>
            ) : (
              activeText && <span>{activeText}</span>
            ))}
        </div>
      )}
    </div>
  );

  /** 圆点上的动作区：loading 优先，其次按状态显示 action 图标。 */
  const actionNode = (
    <div className="el-switch__action">
      {loading ? (
        <ElIcon className="is-loading">
          <Loading />
        </ElIcon>
      ) : isChecked ? (
        activeActionContent ??
        (activeActionIcon ? <ElIcon>{activeActionIcon}</ElIcon> : null)
      ) : (
        inactiveActionContent ??
        (inactiveActionIcon ? <ElIcon>{inactiveActionIcon}</ElIcon> : null)
      )}
    </div>
  );

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    void toggle();
  };

  return (
    <div className={rootClasses} style={style} onClick={handleClick}>
      <input
        id={inputId}
        className="el-switch__input"
        type="checkbox"
        role="switch"
        aria-checked={isChecked}
        aria-disabled={switchDisabled}
        aria-label={ariaLabel}
        name={name || undefined}
        tabIndex={tabindex === undefined ? undefined : Number(tabindex)}
        disabled={switchDisabled}
        checked={isChecked}
        // 真实交互由外层 div 的 onClick 驱动，避免与 label 行为重复
        onChange={() => {}}
        onKeyDown={(event) => {
          if (event.key === "Enter") void toggle();
        }}
      />

      {!inlinePrompt && (inactiveIcon || inactiveText || inactiveContent) && (
        <span className={labelLeftClasses}>
          {inactiveContent ??
            (inactiveIcon ? (
              <ElIcon>{inactiveIcon}</ElIcon>
            ) : (
              inactiveText && <span aria-hidden={isChecked}>{inactiveText}</span>
            ))}
        </span>
      )}

      <span className="el-switch__core" style={coreStyle}>
        {inlinePrompt && innerNode}
        {actionNode}
      </span>

      {!inlinePrompt && (activeIcon || activeText || activeContent) && (
        <span className={labelRightClasses}>
          {activeContent ??
            (activeIcon ? (
              <ElIcon>{activeIcon}</ElIcon>
            ) : (
              activeText && <span aria-hidden={!isChecked}>{activeText}</span>
            ))}
        </span>
      )}
    </div>
  );
}
