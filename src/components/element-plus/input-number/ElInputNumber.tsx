"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ElInput } from "../input";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, ArrowUp, Minus, Plus } from "../icons";
import { useFormDisabled, useFormItem, useFormSize } from "../form/use-form";
import type { ComponentSize } from "../button/types";

/** 官方 v-repeat-click 的两个时间常量，长按控件时按此节奏连续触发。 */
const REPEAT_INTERVAL = 100;
const REPEAT_DELAY = 600;

export type InputNumberAlign = "left" | "right" | "center";
export type InputNumberValueOnClear = "min" | "max" | number | null;
/** 官方直接复用 ElInput 的 inputmode 类型，取值与原生 HTML 属性一致。 */
export type InputNumberInputMode = InputHTMLAttributes<HTMLInputElement>["inputMode"];

export interface InputNumberProps {
  /** 绑定值，对应官方 modelValue */
  value?: number | null;
  /** 值变化，合并官方 update:modelValue 与 change，第二参为旧值 */
  onChange?: (currentValue: number | null, oldValue: number | null) => void;
  /** 原生 id */
  id?: string;
  /** 增量步长 */
  step?: number;
  /** 输入值只能为 step 的整数倍 */
  stepStrictly?: boolean;
  /** 允许的最大值 */
  max?: number;
  /** 允许的最小值 */
  min?: number;
  /** 同原生 readonly */
  readonly?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  /** 是否显示控制按钮 */
  controls?: boolean;
  /** 控制按钮的位置 */
  controlsPosition?: "" | "right";
  /** 输入框清空时赋的值 */
  valueOnClear?: InputNumberValueOnClear;
  /** 原生 name */
  name?: string;
  placeholder?: string;
  /** 数值精度 */
  precision?: number;
  /** 是否触发表单校验 */
  validateEvent?: boolean;
  /** 原生 aria-label */
  ariaLabel?: string;
  /** 原生 inputmode */
  inputmode?: InputNumberInputMode;
  /** 内部输入框的对齐方式 */
  align?: InputNumberAlign;
  /** 是否禁用科学计数法输入（e / E） */
  disabledScientific?: boolean;
  /** 展示值的格式化函数 */
  formatter?: (value: string) => string;
  /** 从格式化后的输入中还原值的函数 */
  parser?: (value: string) => string;
  /** 原生 tabindex */
  tabindex?: string | number;
  /** 内部输入框聚焦 */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** 内部输入框失焦 */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
  /** 自定义减少按钮图标 */
  decreaseIcon?: ReactNode;
  /** 自定义增加按钮图标 */
  increaseIcon?: ReactNode;
  /** 内部输入框前缀 */
  prefix?: ReactNode;
  /** 内部输入框后缀 */
  suffix?: ReactNode;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface InputNumberExpose {
  focus: () => void;
  blur: () => void;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** 官方 debugWarn 的降级实现，这里只做提示，不中断渲染。 */
function debugWarn(scope: string, message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[${scope}] ${message}`);
  }
}

/** 官方 throwError，仅用于 min > max 这类用法错误。 */
function throwError(scope: string, message: string) {
  throw new Error(`[${scope}] ${message}`);
}

function getPrecision(value: number | null | undefined) {
  if (isNil(value)) return 0;
  const valueString = value.toString();
  const dotPosition = valueString.indexOf(".");
  let precision = 0;
  if (dotPosition !== -1) {
    precision = valueString.length - dotPosition - 1;
  }
  return precision;
}

/** 官方 toPrecision：末位为 5 时先改成 6 再取整，规避 JS 的浮点舍入偏差。 */
function toPrecision(num: number, pre?: number) {
  if (pre === undefined) pre = 0;
  if (pre === 0) return Math.round(num);
  let snum = String(num);
  const pointPos = snum.indexOf(".");
  if (pointPos === -1) return num;
  const nums = snum.replace(".", "").split("");
  const datum = nums[pointPos + pre];
  if (!datum) return num;
  const length = snum.length;
  if (snum.charAt(length - 1) === "5") {
    snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
  }
  return Number.parseFloat(Number(snum).toFixed(pre));
}

/**
 * 对应官方 ElInputNumber。
 *
 * 数值处理（toPrecision / getPrecision / ensurePrecision / verifyValue /
 * setCurrentValue / displayValue / handleInput / handleInputChange）逐行对齐官方：
 * 当前值先落在内部 state，编辑期间以 userInput 优先展示，失焦或回车后再回写受控值。
 */
export const ElInputNumber = forwardRef<InputNumberExpose, InputNumberProps>(
  function ElInputNumber(props, ref) {
    const {
      value,
      onChange,
      id,
      step = 1,
      stepStrictly = false,
      max = Number.MAX_SAFE_INTEGER,
      min = Number.MIN_SAFE_INTEGER,
      readonly = false,
      disabled,
      size,
      controls = true,
      controlsPosition = "",
      valueOnClear = null,
      name,
      placeholder,
      precision,
      validateEvent = true,
      ariaLabel,
      inputmode,
      align = "center",
      disabledScientific = false,
      formatter,
      parser,
      tabindex = 0,
      onFocus,
      onBlur,
      className,
      style,
      decreaseIcon,
      increaseIcon,
      prefix,
      suffix,
    } = props;

    // 官方 inputNumberSize / inputNumberDisabled 优先取组件自身，其次 FormItem / Form
    const inputNumberSize = useFormSize(size);
    const isDisabled = useFormDisabled(disabled);
    const { formItem } = useFormItem();

    const rootRef = useRef<HTMLDivElement>(null);

    const [currentValue, setCurrentValueState] = useState<number | null>(
      value ?? null,
    );
    // null 表示非编辑态；与官方 data.userInput 语义一致
    const [userInput, setUserInput] = useState<string | number | null>(null);

    /**
     * verifyValue 读的是「当前值」，官方直接读响应式 data.currentValue；
     * React 的 state 更新是异步的，因此额外维护一份 ref 镜像给同步逻辑用。
     */
    const currentValueRef = useRef<number | null>(currentValue);
    currentValueRef.current = currentValue;

    const formatterRef = useRef(formatter);
    formatterRef.current = formatter;

    const getInnerInput = useCallback(
      () => rootRef.current?.querySelector("input") ?? null,
      [],
    );

    const minDisabled = isNumber(value) && value <= min;
    const maxDisabled = isNumber(value) && value >= max;

    const stepPrecision = getPrecision(step);
    // 官方 numPrecision 未指定 precision 时取 modelValue 与 step 中较大的精度
    const numPrecision = useMemo(() => {
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          debugWarn(
            "InputNumber",
            "precision should not be less than the decimal places of step",
          );
        }
        return precision;
      }
      return Math.max(getPrecision(value), stepPrecision);
    }, [precision, stepPrecision, value]);

    const numPrecisionRef = useRef(numPrecision);
    numPrecisionRef.current = numPrecision;

    const controlsAtRight = controls && controlsPosition === "right";

    // 编辑期间以 userInput 优先展示，与官方 displayValue 一致
    const displayValue = useMemo(() => {
      if (userInput !== null) return userInput;
      const next = currentValue;
      if (isNil(next)) return "";
      if (isNumber(next)) {
        if (Number.isNaN(next)) return "";
        if (precision !== undefined) return next.toFixed(precision);
      }
      return next;
    }, [userInput, currentValue, precision]);

    const verifyValue = useCallback(
      (
        val: number | string | null | undefined,
        update?: boolean,
      ): number | null => {
        if (max < min) {
          throwError("InputNumber", "min should not be greater than max.");
        }
        let newVal = !val ? Number(val) : Number.parseFloat(String(val));
        if (isNil(val) || Number.isNaN(newVal)) {
          return null;
        }
        if (val === "") {
          if (valueOnClear === null) {
            return null;
          }
          newVal = isString(valueOnClear)
            ? ({ min, max } as Record<string, number>)[valueOnClear]
            : valueOnClear;
        }
        if (stepStrictly) {
          // 官方 toPrecision 的默认精度是 numPrecision；显式传 undefined 会退化为 0，
          // 对 0.1 这类 step 会把严格步长结果舍入成整数。
          newVal = toPrecision(
            Math.round(toPrecision(newVal / step, numPrecision)) * step,
            numPrecision,
          );
          if (newVal !== val && update) {
            onChange?.(newVal, currentValueRef.current);
          }
        }
        if (precision !== undefined) {
          newVal = toPrecision(newVal, precision);
        }
        if (newVal > max || newVal < min) {
          newVal = newVal > max ? max : min;
          if (update) onChange?.(newVal, currentValueRef.current);
        }
        return newVal;
      },
      [
        max,
        min,
        step,
        stepStrictly,
        valueOnClear,
        precision,
        numPrecision,
        onChange,
      ],
    );

    // 两个 watch 语义的 effect 需要「最新的 verifyValue」但不该因它重建而重跑
    const verifyValueRef = useRef(verifyValue);
    verifyValueRef.current = verifyValue;

    const setCurrentValue = useCallback(
      (val: number | string | null | undefined, emitChange = true) => {
        const oldVal = currentValueRef.current;
        const newVal = verifyValue(val);
        if (!emitChange) {
          onChange?.(newVal, oldVal);
          return;
        }
        setUserInput(null);
        if (oldVal === newVal && val) return;
        // 官方此处依次抛 update:modelValue 与 change，React 侧合并为一次 onChange
        onChange?.(newVal, oldVal);
        if (validateEvent) formItem?.validate("change").catch(() => {});
        setCurrentValueState(newVal);
      },
      [verifyValue, onChange, validateEvent, formItem],
    );

    const setCurrentValueToModelValue = useCallback(() => {
      if (currentValueRef.current !== (value ?? null)) {
        setCurrentValueState(value ?? null);
      }
    }, [value]);

    const ensurePrecision = useCallback(
      (val: number, coefficient: 1 | -1 = 1) => {
        if (!isNumber(val)) return currentValueRef.current;
        if (val >= Number.MAX_SAFE_INTEGER && coefficient === 1) {
          debugWarn(
            "InputNumber",
            "The value has reached the maximum safe integer limit.",
          );
          return val;
        } else if (val <= Number.MIN_SAFE_INTEGER && coefficient === -1) {
          debugWarn(
            "InputNumber",
            "The value has reached the minimum safe integer limit.",
          );
          return val;
        }
        // 先把小数运算转成整数运算，再按默认精度收敛，规避浮点误差
        return toPrecision(
          val + step * coefficient,
          precision === undefined ? numPrecisionRef.current : precision,
        );
      },
      [step, precision],
    );

    const increase = useCallback(() => {
      if (readonly || isDisabled || maxDisabled) return;
      const val = Number(displayValue) || 0;
      const newVal = ensurePrecision(val);
      setCurrentValue(newVal);
      setCurrentValueToModelValue();
    }, [
      readonly,
      isDisabled,
      maxDisabled,
      displayValue,
      ensurePrecision,
      setCurrentValue,
      setCurrentValueToModelValue,
    ]);

    const decrease = useCallback(() => {
      if (readonly || isDisabled || minDisabled) return;
      const val = Number(displayValue) || 0;
      const newVal = ensurePrecision(val, -1);
      setCurrentValue(newVal);
      setCurrentValueToModelValue();
    }, [
      readonly,
      isDisabled,
      minDisabled,
      displayValue,
      ensurePrecision,
      setCurrentValue,
      setCurrentValueToModelValue,
    ]);

    const handleInput = useCallback(
      (inputValue: string) => {
        setUserInput(inputValue);
        let newVal: number | null = Number.parseFloat(inputValue);
        if (Number.isNaN(newVal)) {
          newVal = null;
        }
        // 官方在此抛 input 事件，本项目不暴露该事件，仅同步内部值
        setCurrentValue(newVal, false);
      },
      [setCurrentValue],
    );

    const handleInputChange = useCallback(
      (inputValue: string) => {
        // ElInput 已在 change 时套过 formatter/parser，这里拿到的就是解析后的文本
        const newVal: number | string =
          inputValue !== "" ? Number.parseFloat(inputValue) : "";
        if (
          (isNumber(newVal) && !Number.isNaN(newVal)) ||
          (formatter && Number.isNaN(newVal)) ||
          newVal === ""
        ) {
          setCurrentValue(newVal);
        }
        setCurrentValueToModelValue();
        setUserInput(null);
      },
      [formatter, setCurrentValue, setCurrentValueToModelValue],
    );

    const handleKeydown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // 官方用 getEventCode 处理 Android 上 event.code 为空的情况，这里退回 event.key
        const code =
          event.code && event.code !== "Unidentified" ? event.code : event.key;

        if (disabledScientific && ["e", "E"].includes(event.key)) {
          event.preventDefault();
          return;
        }

        if (code === "ArrowUp") {
          event.preventDefault();
          increase();
        } else if (code === "ArrowDown") {
          event.preventDefault();
          decrease();
        }
      },
      [disabledScientific, increase, decrease],
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onFocus?.(event as FocusEvent<HTMLInputElement>);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserInput(null);
        // 非数值内容清空后 Firefox 不会刷新原生显示值，需手动写回
        const inner = getInnerInput();
        if (currentValueRef.current === null && inner) {
          inner.value = formatterRef.current?.("") ?? "";
        }
        onBlur?.(event as FocusEvent<HTMLInputElement>);
        if (validateEvent) formItem?.validate("blur").catch(() => {});
      },
      [getInnerInput, onBlur, validateEvent, formItem],
    );

    useImperativeHandle(
      ref,
      (): InputNumberExpose => ({
        focus: () => getInnerInput()?.focus(),
        blur: () => getInnerInput()?.blur(),
      }),
      [getInnerInput],
    );

    // 组件卸载时要停掉尚未结束的连发计时器
    const repeatCleanupRef = useRef<(() => void) | null>(null);

    const stopRepeat = useCallback(() => {
      repeatCleanupRef.current?.();
      repeatCleanupRef.current = null;
    }, []);

    useEffect(() => stopRepeat, [stopRepeat]);

    /** 长按连续触发，对应官方 v-repeat-click：点击立即执行，按住 600ms 后每 100ms 执行一次。 */
    const startRepeat = useCallback(
      (handler: () => void) => (event: React.MouseEvent<HTMLSpanElement>) => {
        if (event.button !== 0) return;

        stopRepeat();

        let delayId: number | undefined;
        let intervalId: number | undefined;

        const clear = () => {
          // 短按后也要取消延迟计时器，否则 600ms 后仍会开始无限连发
          if (delayId !== undefined) window.clearTimeout(delayId);
          if (intervalId !== undefined) window.clearInterval(intervalId);
          delayId = undefined;
          intervalId = undefined;
          document.removeEventListener("mouseup", clear, true);
          if (repeatCleanupRef.current === clear) {
            repeatCleanupRef.current = null;
          }
        };

        repeatCleanupRef.current = clear;
        handler();
        document.addEventListener("mouseup", clear, {
          once: true,
          capture: true,
        });
        // 先等 REPEAT_DELAY 再开始连发，避免双击被误判成长按
        delayId = window.setTimeout(() => {
          intervalId = window.setInterval(handler, REPEAT_INTERVAL);
        }, REPEAT_DELAY);
      },
      [stopRepeat],
    );

    const handleDecreaseMouseDown = useMemo(
      () => startRepeat(decrease),
      [startRepeat, decrease],
    );
    const handleIncreaseMouseDown = useMemo(
      () => startRepeat(increase),
      [startRepeat, increase],
    );

    // 对应官方 watch(modelValue, { immediate: true })：仅在非编辑态同步内部值
    useEffect(() => {
      const prev = currentValueRef.current;
      const newValue = verifyValueRef.current(value, true);
      if (userInput === null && newValue !== prev) {
        setCurrentValueState(newValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // 对应官方 watch(precision)
    const prevPrecisionRef = useRef(precision);
    useEffect(() => {
      if (prevPrecisionRef.current === precision) return;
      prevPrecisionRef.current = precision;
      setCurrentValueState(verifyValueRef.current(value));
      // 编辑态下 precision 变化同样要让展示值重新按新精度渲染
      setUserInput(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [precision]);

    // 对应官方 onMounted 给内层 input 补的 spinbutton 无障碍属性与滚轮拦截
    const ariaMax = Number.isFinite(max) ? String(max) : null;
    const ariaMin = Number.isFinite(min) ? String(min) : null;

    useLayoutEffect(() => {
      const inner = getInnerInput();
      if (!inner) return;
      inner.setAttribute("role", "spinbutton");
      if (ariaMax !== null) inner.setAttribute("aria-valuemax", ariaMax);
      else inner.removeAttribute("aria-valuemax");
      if (ariaMin !== null) inner.setAttribute("aria-valuemin", ariaMin);
      else inner.removeAttribute("aria-valuemin");
      inner.setAttribute("aria-disabled", String(isDisabled));

      // 聚焦时滚轮会直接改数值，容易误操作，官方在此阻止默认滚动
      const handleWheel = (event: WheelEvent) => {
        if (document.activeElement === event.target) event.preventDefault();
      };
      inner.addEventListener("wheel", handleWheel, { passive: false });
      return () => inner.removeEventListener("wheel", handleWheel);
    }, [getInnerInput, ariaMax, ariaMin, isDisabled]);

    // 对应官方 onUpdated 刷新 aria-valuenow
    useEffect(() => {
      getInnerInput()?.setAttribute(
        "aria-valuenow",
        currentValue || currentValue === 0 ? String(currentValue) : "",
      );
    }, [getInnerInput, currentValue]);

    /**
     * 对应官方 onMounted 里的类型收敛：非数字的 modelValue 统一回写为 number | null。
     * 官方在挂载期同步 emit，React 侧放进 effect，避免渲染期触发父组件 setState。
     */
    useEffect(() => {
      if (!isNumber(value) && value != null) {
        const num = Number(value);
        onChange?.(Number.isNaN(num) ? null : num, currentValueRef.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const rootClasses = [
      "el-input-number",
      inputNumberSize && `el-input-number--${inputNumberSize}`,
      isDisabled && "is-disabled",
      !controls && "is-without-controls",
      controlsAtRight && "is-controls-right",
      `is-${align}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const decreaseClasses = [
      "el-input-number__decrease",
      minDisabled && "is-disabled",
    ]
      .filter(Boolean)
      .join(" ");

    const increaseClasses = [
      "el-input-number__increase",
      maxDisabled && "is-disabled",
    ]
      .filter(Boolean)
      .join(" ");

    const decreaseNode = (
      <span
        role="button"
        aria-label="减少数值"
        aria-disabled={minDisabled || isDisabled}
        className={decreaseClasses}
        onMouseDown={handleDecreaseMouseDown}
        onKeyDown={(event) => {
          if (event.key === "Enter") decrease();
        }}
      >
        {decreaseIcon ?? (
          <ElIcon>{controlsAtRight ? <ArrowDown /> : <Minus />}</ElIcon>
        )}
      </span>
    );

    const increaseNode = (
      <span
        role="button"
        aria-label="增加数值"
        aria-disabled={maxDisabled || isDisabled}
        className={increaseClasses}
        onMouseDown={handleIncreaseMouseDown}
        onKeyDown={(event) => {
          if (event.key === "Enter") increase();
        }}
      >
        {increaseIcon ?? (
          <ElIcon>{controlsAtRight ? <ArrowUp /> : <Plus />}</ElIcon>
        )}
      </span>
    );

    return (
      <div
        ref={rootRef}
        className={rootClasses}
        style={style}
        onDragStart={(event) => event.preventDefault()}
      >
        {controls && decreaseNode}
        {controls && increaseNode}
        <ElInput
          id={id}
          // 有 formatter 时放开为 text，允许非数字字符输入
          type={formatter ? "text" : "number"}
          step={step}
          min={min}
          max={max}
          // 主题样式按 .el-input-number--large .el-input--large 选择，内层输入框必须带尺寸
          size={(inputNumberSize || undefined) as ComponentSize | undefined}
          value={String(displayValue)}
          placeholder={placeholder}
          readOnly={readonly}
          disabled={isDisabled}
          name={name}
          aria-label={ariaLabel}
          inputMode={inputmode}
          // 校验由 InputNumber 统一触发，内层 ElInput 再触发会重复一次
          validateEvent={false}
          formatter={formatter}
          parser={parser}
          tabIndex={Number(tabindex)}
          onChange={handleInput}
          onValueChange={handleInputChange}
          onKeyDown={handleKeydown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
    );
  },
) as (props: InputNumberProps & { ref?: React.Ref<InputNumberExpose> }) => ReactNode;
