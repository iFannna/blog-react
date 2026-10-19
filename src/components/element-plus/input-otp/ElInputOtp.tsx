"use client";

import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type FocusEvent as ReactFocusEvent,
  type ChangeEvent as ReactChangeEvent,
  type ReactNode,
} from "react";
import { useFormDisabled, useFormItem, useFormItemInputId, useFormSize } from "../form/use-form";
import type { ComponentSize } from "../button/types";

export type InputOtpType = "outlined" | "filled" | "underlined";

export interface InputOtpProps {
  /**
   * OTP 各框的值。官方约定：数字不能有前导零，因此仅允许在初始化时传数字。
   */
  value?: string | number;
  /** OTP 输入框数量 */
  length?: number;
  /** 自定义校验函数，返回 false 时该字符不写入 */
  validator?: (char: string, index: number) => boolean;
  /** 原生 inputmode 属性，用于指定虚拟键盘类型 */
  inputmode?: string;
  /** 边框类型 */
  type?: InputOtpType;
  /** 尺寸 */
  size?: ComponentSize;
  /** 是否密码模式（掩码显示） */
  mask?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 原生 id */
  id?: string;
  /** 原生 aria-label */
  ariaLabel?: string;
  /** 是否触发表单校验 */
  validateEvent?: boolean;
  /** 值变化，对应官方 update:modelValue */
  onChange?: (value: string) => void;
  /** 失焦且值相比获焦时有变化时触发，对应官方 change */
  onValueChange?: (value: string) => void;
  /** 所有框填满时触发，对应官方 finish */
  onFinish?: (value: string) => void;
  /** 获焦，对应官方 focus（官方会跳过内部框之间的焦点转移） */
  onFocus?: (event: ReactFocusEvent<HTMLInputElement>) => void;
  /** 失焦，对应官方 blur（官方会跳过内部框之间的焦点转移） */
  onBlur?: (event: ReactFocusEvent<HTMLInputElement>) => void;
  /**
   * 框之间的分隔符。字符串 / ReactNode / (index) => ReactNode。
   * 对应官方 `separator` prop：结果为假值时该位置不渲染分隔符。
   */
  separator?: ReactNode | ((index: number) => ReactNode);
  /**
   * 分隔符插槽，对应官方 `separator` 具名插槽：只要提供就始终渲染（即使内容为空串）。
   */
  separatorSlot?: (index: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface InputOtpExpose {
  /** HTML input 元素数组 */
  inputRefs: (HTMLInputElement | undefined)[];
  /** 聚焦到指定 OTP 框 */
  focus: (index?: number) => void;
  /** 让当前聚焦的 OTP 框失焦 */
  blur: () => void;
}

/** 官方 EVENT_CODE，用于按键分支判断。 */
const EVENT_CODE = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  space: "Space",
  delete: "Delete",
  backspace: "Backspace",
} as const;

/** 官方 getEventCode：优先取 event.code，兼容部分安卓浏览器退回 event.key。 */
function getEventCode(event: KeyboardEvent): string {
  if (event.code && event.code !== "Unidentified") return event.code;

  const key = event.key && event.key !== "Unidentified" ? event.key : "";
  if (key) {
    if ((Object.values(EVENT_CODE) as string[]).includes(key)) return key;
    if (key === " ") return EVENT_CODE.space;
  }

  return "";
}

/** 官方 locale 的 el.inputOTP 文案。 */
const GROUP_LABEL = "一次性密码输入框";
const defaultLabel = (index: number) => `请输入第 ${index + 1} 位 OTP 字符`;

/** 把受控值拆成定长字符数组，对应官方 initialValue。 */
function toChars(value: string | number | undefined, length: number): string[] {
  const str = String(value ?? "");
  return Array.from({ length }, (_, i) => str.charAt(i));
}

/**
 * 对应官方 ElInputOtp。
 *
 * 逐行对齐官方 input-otp.vue：键位分支（backspace / delete / 方向键）、
 * 粘贴与自动填充的多字符写入、validator 校验回退、获焦失焦时跳过内部框之间的
 * 焦点转移，以及失焦后与获焦值比较再抛 change。
 *
 * 内部值用 state 数组承载（官方是 reactive 数组的就地改写），
 * 输入框走受控 value，保证外部改值能同步回显。
 */
export const ElInputOtp = forwardRef<InputOtpExpose, InputOtpProps>(
  function ElInputOtp(props, ref) {
    const {
      value,
      length = 6,
      validator = () => true,
      inputmode,
      type = "outlined",
      size,
      mask,
      disabled,
      readonly = false,
      id,
      ariaLabel,
      validateEvent = true,
      onChange,
      onValueChange,
      onFinish,
      onFocus,
      onBlur,
      separator,
      separatorSlot,
      className,
      style,
    } = props;

    // 官方 inputOtpSize / disabled 优先取组件自身，其次 FormItem / Form
    const otpSize = useFormSize(size);
    const isDisabled = useFormDisabled(disabled);
    const { formItem } = useFormItem();
    const { inputId, isLabeledByFormItem } = useFormItemInputId({ id, ariaLabel });

    const [innerValue, setInnerValue] = useState<string[]>(() => toChars(value, length));
    const [isFocused, setIsFocused] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | undefined)[]>([]);
    // 获焦时的值，用于失焦后判断是否触发 change
    const valueOnFocus = useRef<string | number | undefined>(value);

    const separators = useMemo(() => {
      const resolve =
        typeof separator === "function" ? separator : () => separator;
      return Array.from({ length: Math.max(length - 1, 0) }, (_, i) => resolve(i));
    }, [separator, length]);

    const updateModelValue = useCallback(
      (chars: string[], emitFinish = true) => {
        const next = chars.join("").slice(0, length);
        if (next !== value) {
          onChange?.(next);
          if (emitFinish && next.length === length) onFinish?.(next);
        }
      },
      [value, length, onChange, onFinish],
    );

    const focus = useCallback(
      (index = 0) => {
        const focusIndex = Math.min(Math.max(index, 0), length - 1);
        const target = inputRefs.current[focusIndex];

        if (document.activeElement !== target) target?.focus();
        requestAnimationFrame(() => {
          // 调用后焦点可能已被其它元素抢占（如快速输入后删除），此处再确认一次
          if (!readonly && document.activeElement === target) target?.select();
        });
      },
      [length, readonly],
    );

    const blur = useCallback(() => {
      const target = inputRefs.current.find(
        (input) => document.activeElement === input,
      );
      target?.blur();
    }, []);

    useImperativeHandle(
      ref,
      (): InputOtpExpose => ({
        inputRefs: inputRefs.current,
        focus,
        blur,
      }),
      [focus, blur],
    );

    // 官方 watch(modelValue)：外部改值时重置内部数组
    const valueMounted = useRef(false);
    useEffect(() => {
      if (!valueMounted.current) {
        valueMounted.current = true;
        return;
      }
      setInnerValue(toChars(value, length));
      if (validateEvent) formItem?.validate("change").catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // 官方 watch(length)：长度变化时重置并把截断后的值回写
    const lengthOnMount = useRef(length);
    useEffect(() => {
      if (lengthOnMount.current === length) return;
      lengthOnMount.current = length;
      const next = toChars(value, length);
      setInnerValue(next);
      updateModelValue(next, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length]);

    // 官方 watch(isFocused)：失焦且值相比获焦时变化，抛 change
    useEffect(() => {
      if (isFocused) {
        valueOnFocus.current = value;
        return;
      }
      if (valueOnFocus.current !== value) {
        onValueChange?.(String(value ?? ""));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    const getFirstIndex = (maxIndex: number) => {
      const index = innerValue.findIndex((char, i) => !char && i <= maxIndex);
      return index === -1 ? maxIndex : index;
    };

    const handleFocus = (event: ReactFocusEvent<HTMLInputElement>) => {
      if (inputRefs.current.includes(event.relatedTarget as HTMLInputElement)) {
        return;
      }
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: ReactFocusEvent<HTMLInputElement>) => {
      if (inputRefs.current.includes(event.relatedTarget as HTMLInputElement)) {
        return;
      }
      setIsFocused(false);
      onBlur?.(event);
      if (validateEvent) formItem?.validate("blur").catch(() => {});
    };

    const handleKeydown = (
      event: ReactKeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      const code = getEventCode(event.nativeEvent);
      let preventDefault = true;

      switch (code) {
        case EVENT_CODE.backspace: {
          if (readonly) break;
          const next = [...innerValue];
          next[index] = "";
          setInnerValue(next);
          focus(index - 1);
          updateModelValue(next);
          break;
        }
        case EVENT_CODE.delete: {
          if (readonly) break;
          const next = [...innerValue];
          next[index] = "";
          setInnerValue(next);
          focus(index);
          updateModelValue(next);
          break;
        }
        case EVENT_CODE.up:
        case EVENT_CODE.left:
          focus(index - 1);
          break;
        case EVENT_CODE.down:
        case EVENT_CODE.right:
          focus(index + 1);
          break;
        default:
          preventDefault = false;
      }

      if (preventDefault) event.preventDefault();
    };

    const castValues = (raw: string | number | undefined, startIndex = 0) => {
      const chars = `${raw ?? ""}`.split("");
      const result: string[] = [];
      for (const char of chars) {
        if (result.length + startIndex >= length) break;
        if (validator(char, result.length + startIndex)) result.push(char);
      }
      return result;
    };

    const handleInput = (
      event: ReactChangeEvent<HTMLInputElement>,
      index: number,
    ) => {
      const target = event.target;
      const targetIndex = getFirstIndex(index);
      let focusIndex = targetIndex + 1;
      let nextValue = target.value;

      // Safari / Firefox 自动填充时不触发 paste 事件，多字符写入需在 input 事件里处理
      if (nextValue.length > 1) {
        const chars = castValues(nextValue, targetIndex);

        // 避免粘贴内容无变化时，内部数组与输入框显示不一致
        target.value = innerValue[index] ?? "";

        const next = [...innerValue];
        chars.forEach((char, i) => (next[targetIndex + i] = char));
        setInnerValue(next);
        focus(targetIndex + chars.length);
        updateModelValue(next);
        return;
      }

      if (!validator(nextValue, targetIndex)) {
        target.value = innerValue[index] ?? "";
        nextValue = target.value;
        focusIndex = targetIndex;
      }

      const next = [...innerValue];
      next[targetIndex] = nextValue;
      if (targetIndex !== index) {
        target.value = innerValue[index] ?? "";
      }
      setInnerValue(next);
      focus(focusIndex);
      updateModelValue(next);
    };

    const rootClasses = [
      "el-input-otp",
      otpSize && `el-input-otp--${otpSize}`,
      `el-input-otp--${type}`,
      isDisabled && "is-disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        id={inputId}
        className={rootClasses}
        role="group"
        aria-label={
          !isLabeledByFormItem ? ariaLabel || GROUP_LABEL : undefined
        }
        aria-labelledby={isLabeledByFormItem ? formItem?.labelId : undefined}
        style={style}
      >
        {Array.from({ length }, (_, index) => {
          const sepContent = separatorSlot
            ? separatorSlot(index)
            : separators[index];
          // 官方：提供插槽即渲染；否则按 prop 结果的真假值决定
          const showSeparator =
            index < length - 1 &&
            (separatorSlot ? true : Boolean(separators[index]));

          return (
            <Fragment key={index}>
              <label className="el-input-otp__input-field">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el ?? undefined;
                  }}
                  className="el-input-otp__input"
                  value={innerValue[index] ?? ""}
                  type={mask ? "password" : "text"}
                  disabled={isDisabled}
                  readOnly={readonly}
                  inputMode={inputmode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
                  autoComplete="one-time-code"
                  aria-label={defaultLabel(index)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onClick={() => focus(index)}
                  onKeyDown={(event) => handleKeydown(event, index)}
                  onChange={(event) => handleInput(event, index)}
                />
              </label>
              {showSeparator && <Fragment>{sepContent}</Fragment>}
            </Fragment>
          );
        })}
      </div>
    );
  },
) as (props: InputOtpProps & { ref?: React.Ref<InputOtpExpose> }) => ReactNode;
