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
  type ReactNode,
} from "react";
import { ElInputNumber } from "../input-number";
import { ElTooltip } from "../tooltip";
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import type { ComponentSize } from "../button/types";
import type { PopperPlacement } from "../popper";

export interface SliderMarkConfig {
  style?: CSSProperties;
  label?: ReactNode;
}

export type SliderMarks = Record<number, ReactNode | SliderMarkConfig>;
export type SliderValue = number | number[];

export interface SliderProps {
  /** 绑定值，范围选择时为双元素数组 */
  value?: SliderValue;
  /** 值变化（对应官方 v-model / update:modelValue），拖拽过程中持续触发 */
  onChange?: (value: SliderValue) => void;
  /** 拖拽过程中持续触发，与 onChange 同值，对应官方 input 事件 */
  onInput?: (value: SliderValue) => void;
  /** 拖拽结束或点击定位时触发，对应官方 change 事件 */
  onValueChange?: (value: SliderValue) => void;
  id?: string;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长，传 'mark' 时只能取 marks 上的点 */
  step?: number | "mark";
  /** 是否显示输入框，range 为真或 step 为 'mark' 时不生效 */
  showInput?: boolean;
  /** showInput 为真时是否显示输入框的控制按钮 */
  showInputControls?: boolean;
  /** 尺寸，纵向模式不生效 */
  size?: ComponentSize;
  /** 输入框尺寸，省略时跟随 size */
  inputSize?: ComponentSize;
  /** 是否显示间断点 */
  showStops?: boolean;
  /** 是否显示提示 */
  showTooltip?: boolean;
  /** 提示内容的格式化函数 */
  formatTooltip?: (value: number) => number | string;
  disabled?: boolean;
  /** 是否范围选择 */
  range?: boolean;
  /** 纵向模式 */
  vertical?: boolean;
  /** 高度，纵向模式必填 */
  height?: string;
  /** range 为真时给屏幕阅读器的起始值标签 */
  rangeStartLabel?: string;
  /** range 为真时给屏幕阅读器的结束值标签 */
  rangeEndLabel?: string;
  /** aria-valuenow 的格式化函数 */
  formatValueText?: (value: number) => string;
  /** 提示的自定义类名 */
  tooltipClass?: string;
  /** 提示位置 */
  placement?: PopperPlacement;
  /** 标记点 */
  marks?: SliderMarks;
  /** 是否触发表单校验，本项目无 FormItem，见文档差异表 */
  validateEvent?: boolean;
  /** 提示是否常驻，showTooltip 为假时恒为假 */
  persistent?: boolean;
  /** 根元素的 aria-label */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** 对应官方 defineExpose 暴露的方法。 */
export interface SliderExpose {
  /** 按鼠标/触摸位置设置值 */
  onSliderClick: (event: MouseEvent | TouchEvent) => void;
}

interface SliderButtonExpose {
  onButtonDown: (event: MouseEvent | TouchEvent) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /** 返回落点对应的值，供调用方同步抛出 change，避免读到尚未回传的旧 prop */
  setPosition: (position: number) => number | undefined;
}

interface MarkItem {
  point: number;
  position: number;
  mark: ReactNode | SliderMarkConfig;
}

/** 官方 useLocale 的 el.slider 中文文案。 */
const LOCALE = {
  defaultLabel: (min: number, max: number) => `滑块介于 ${min} 至 ${max}`,
  rangeStartLabel: "选择起始值",
  rangeEndLabel: "选择结束值",
};

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isArray(value: unknown): value is number[] {
  return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * mark 既可以是任意 ReactNode，也可以是 { style, label } 配置。
 * React 元素本身也是对象，不能只看 typeof object，否则会被误判成配置而丢标签。
 */
function isMarkConfig(mark: ReactNode | SliderMarkConfig): boolean {
  return isObject(mark) && ("label" in mark || "style" in mark);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function debugWarn(scope: string, message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[${scope}] ${message}`);
  }
}

function getClientXY(event: MouseEvent | TouchEvent) {
  if (event.type.startsWith("touch")) {
    const touch = (event as TouchEvent).touches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return {
    clientX: (event as MouseEvent).clientX,
    clientY: (event as MouseEvent).clientY,
  };
}

/**
 * 官方 use-marks：把 marks 对象整理成按 value 升序、且落在 [min,max] 内的列表。
 */
function buildMarkList(marks: SliderMarks | undefined, min: number, max: number): MarkItem[] {
  if (!marks) return [];

  const invalid: string[] = [];
  const list = Object.keys(marks)
    .map(Number.parseFloat)
    .sort((a, b) => a - b)
    .filter((point) => {
      if (Number.isNaN(point) || point > max || point < min) {
        invalid.push(String(point));
        return false;
      }
      return true;
    })
    .map((point): MarkItem => ({
      point,
      position: ((point - min) * 100) / (max - min),
      mark: marks[point],
    }));

  if (invalid.length > 0) {
    debugWarn(
      "ElSlider",
      `Some marks keys are invalid (not a number or out of [min, max]): [${invalid
        .map((k) => `'${k}'`)
        .join(", ")}] and will be ignored.`,
    );
  }

  return list;
}

/** 官方 use-slider-button 的 useTooltip：50ms 防抖的显隐。 */
function useTooltip(el: number, showTooltip: boolean, formatTooltip?: (value: number) => number | string) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const schedule = useCallback(
    (next: boolean) => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (showTooltip) setVisible(next);
      }, 50);
    },
    [showTooltip],
  );

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // showTooltip 关闭时要收掉已经弹出的提示，否则重新开启会残留；
  // 放到下一个宏任务里重置，避免在 effect 内同步 setState 触发级联渲染
  useEffect(() => {
    if (showTooltip) return;
    window.clearTimeout(timerRef.current);
    const timer = window.setTimeout(() => setVisible(false), 0);
    return () => window.clearTimeout(timer);
  }, [showTooltip]);

  const formatValue =
    (typeof formatTooltip === "function" && formatTooltip(el)) || el;

  return {
    // showTooltip 为假时无视尚未重置的内部状态，保证提示立即消失
    tooltipVisible: showTooltip && visible,
    formatValue,
    displayTooltip: () => schedule(true),
    hideTooltip: () => schedule(false),
  };
}

/** 两个滑块按钮的身份，用于把单侧的新值还原成范围数组。 */
type SliderButtonRole = "first" | "second";

interface SliderButtonProps {
  value: number;
  id?: string;
  which: SliderButtonRole;
  vertical: boolean;
  tooltipClass?: string;
  placement: PopperPlacement;
  ctx: SliderContext;
  /** 该按钮代表范围中的起始值（决定 aria 边界） */
  aria: {
    role: string;
    label?: string;
    labelledby?: string;
    valueMin: number;
    valueMax: number;
    valueText: string;
    disabled: boolean;
  };
  tabIndex?: number;
  onUpdateValue: (value: number) => void;
}

interface SliderContext {
  disabled: boolean;
  min: number;
  max: number;
  step: number | "mark";
  precision: number;
  showTooltip: boolean;
  persistent: boolean;
  formatTooltip?: (value: number) => number | string;
  sliderSizeRef: React.RefObject<number>;
  markList: MarkItem[];
  emitChange: (which: SliderButtonRole, value?: number) => void;
  resetSize: () => void;
  updateDragging: (dragging: boolean) => void;
}

/** 对应官方 SliderButton：单个滑块，负责拖拽、键盘与提示。 */
const SliderButton = forwardRef<SliderButtonExpose, SliderButtonProps>(
  function SliderButton(
    {
      value,
      id,
      which,
      vertical,
      tooltipClass,
      placement,
      ctx,
      aria,
      tabIndex,
      onUpdateValue,
    },
    ref,
  ) {
    const {
      disabled,
      min,
      max,
      step,
      showTooltip,
      persistent,
      sliderSizeRef,
      markList,
      emitChange,
      resetSize,
      updateDragging,
    } = ctx;

    const { tooltipVisible, formatValue, displayTooltip, hideTooltip } = useTooltip(
      value,
      showTooltip,
      ctx.formatTooltip,
    );

    const buttonRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);
    const [dragging, setDragging] = useState(false);

    // 官方把拖拽中间态放在 initData 里，不参与渲染，这里同样用 ref 存放
    const dragRef = useRef({
      isClick: false,
      startX: 0,
      currentX: 0,
      startY: 0,
      currentY: 0,
      startPosition: 0,
      newPosition: 0,
    });

    // 拖拽中按钮自己的 modelValue 会由父层回传更新，但拖拽位移计算需要本次拖拽的起点值
    const valueRef = useRef(value);
    useLayoutEffect(() => {
      valueRef.current = value;
    }, [value]);

    const currentPosition = `${((value - min) / (max - min)) * 100}%`;

    const wrapperStyle: CSSProperties = vertical
      ? { bottom: currentPosition }
      : { left: currentPosition };

    const setPosition = useCallback(
      (newPosition: number): number | undefined => {
        if (newPosition === null || Number.isNaN(+newPosition)) return;

        const position = clamp(newPosition, 0, 100);
        let next: number;

        if (step === "mark") {
          if (markList.length === 0) {
            next = position <= 50 ? min : max;
          } else {
            const closestMark = markList.reduce((prev, curr) =>
              Math.abs(curr.position - position) < Math.abs(prev.position - position)
                ? curr
                : prev,
            );
            next = closestMark.point;
          }
        } else {
          const fullSteps = Math.floor((max - min) / step);
          const fullRangePercentage = ((fullSteps * step) / (max - min)) * 100;
          const threshold = fullRangePercentage + (100 - fullRangePercentage) / 2;

          if (position < fullRangePercentage) {
            const valueBetween = fullRangePercentage / fullSteps;
            const steps = Math.round(position / valueBetween);
            next = min + steps * step;
          } else if (position < threshold) {
            next = min + fullSteps * step;
          } else {
            next = max;
          }
          next = Number.parseFloat(next.toFixed(ctx.precision));
        }

        if (next !== valueRef.current) {
          onUpdateValue(next);
        }
        return next;
      },
      [ctx.precision, markList, max, min, onUpdateValue, step],
    );

    const incrementPosition = useCallback(
      (amount: number) => {
        if (disabled) return;
        dragRef.current.newPosition =
          Number.parseFloat(currentPosition) + (amount / (max - min)) * 100;
        emitChange(which, setPosition(dragRef.current.newPosition));
      },
      [currentPosition, disabled, emitChange, max, min, setPosition, which],
    );

    /** 对应官方 moveToMark：按 marks 列表跳固定步数。 */
    const moveToMark = useCallback(
      (amount: number) => {
        if (disabled || !markList.length) return;

        const current = valueRef.current;
        const epsilon = Number.EPSILON;
        const stride = Math.abs(amount);
        let target: number | undefined;

        if (amount > 0) {
          const startIndex = markList.findIndex((m) => m.point > current + epsilon);
          if (startIndex !== -1) {
            const targetIndex = Math.min(startIndex + stride - 1, markList.length - 1);
            target = markList[targetIndex].point;
          }
        } else {
          let startIndex = -1;
          for (let i = markList.length - 1; i >= 0; i--) {
            if (markList[i].point < current - epsilon) {
              startIndex = i;
              break;
            }
          }
          if (startIndex !== -1) {
            const targetIndex = Math.max(startIndex - (stride - 1), 0);
            target = markList[targetIndex].point;
          }
        }

        if (target !== undefined && target !== current) {
          emitChange(which, setPosition(((target - min) / (max - min)) * 100));
        }
      },
      [disabled, emitChange, markList, max, min, setPosition, which],
    );

    const shouldMoveToMark = step === "mark" && markList.length > 0;

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const stepAmount = shouldMoveToMark ? undefined : (step as number);
        let handled = true;

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowDown":
            if (shouldMoveToMark) moveToMark(-1);
            else incrementPosition(-(stepAmount as number));
            break;
          case "ArrowRight":
          case "ArrowUp":
            if (shouldMoveToMark) moveToMark(1);
            else incrementPosition(stepAmount as number);
            break;
          case "Home":
            if (disabled) return;
            emitChange(which, setPosition(0));
            break;
          case "End":
            if (disabled) return;
            emitChange(which, setPosition(100));
            break;
          case "PageDown":
            if (shouldMoveToMark) moveToMark(-4);
            else incrementPosition(-(stepAmount as number) * 4);
            break;
          case "PageUp":
            if (shouldMoveToMark) moveToMark(4);
            else incrementPosition((stepAmount as number) * 4);
            break;
          default:
            handled = false;
            break;
        }

        if (handled) event.preventDefault();
      },
      [
        disabled,
        emitChange,
        incrementPosition,
        moveToMark,
        setPosition,
        shouldMoveToMark,
        step,
        which,
      ],
    );

    const onDragging = useCallback(
      (event: MouseEvent | TouchEvent) => {
        if (!dragRef.current.isClick && !dragging) return;
        if (!dragging) return;

        dragRef.current.isClick = false;
        displayTooltip();
        resetSize();

        const { clientX, clientY } = getClientXY(event);
        let diff: number;

        if (vertical) {
          dragRef.current.currentY = clientY;
          diff =
            ((dragRef.current.startY - dragRef.current.currentY) /
              (sliderSizeRef.current || 1)) *
            100;
        } else {
          dragRef.current.currentX = clientX;
          diff =
            ((dragRef.current.currentX - dragRef.current.startX) /
              (sliderSizeRef.current || 1)) *
            100;
        }

        dragRef.current.newPosition = dragRef.current.startPosition + diff;
        setPosition(dragRef.current.newPosition);
      },
      [displayTooltip, dragging, resetSize, setPosition, sliderSizeRef, vertical],
    );

    // 收尾时要移除自身监听，回调里无法直接引用自己的初始化器，经 ref 取当前函数
    const onDragEndRef = useRef<() => void>(() => undefined);

    const onDragEnd = useCallback(() => {
      /*
       * 防止 mouseup 之后立刻触发的 click 造成滑块再位移一小段，
       * 与官方一致地放到下一个宏任务里收尾。
       */
      window.setTimeout(() => {
        setDragging(false);
        updateDragging(false);
        if (!hovering) hideTooltip();
        const next = dragRef.current.isClick
          ? valueRef.current
          : setPosition(dragRef.current.newPosition);
        emitChange(which, next);
      }, 0);

      window.removeEventListener("mousemove", onDragging);
      window.removeEventListener("touchmove", onDragging);
      window.removeEventListener("mouseup", onDragEndRef.current);
      window.removeEventListener("touchend", onDragEndRef.current);
      window.removeEventListener("contextmenu", onDragEndRef.current);
    }, [
      emitChange,
      hideTooltip,
      hovering,
      onDragging,
      setPosition,
      updateDragging,
      which,
    ]);

    useLayoutEffect(() => {
      onDragEndRef.current = onDragEnd;
    }, [onDragEnd]);

    const onDragStart = useCallback(
      (event: MouseEvent | TouchEvent) => {
        setDragging(true);
        updateDragging(true);
        dragRef.current.isClick = true;

        const { clientX, clientY } = getClientXY(event);
        if (vertical) {
          dragRef.current.startY = clientY;
        } else {
          dragRef.current.startX = clientX;
        }
        dragRef.current.startPosition = Number.parseFloat(currentPosition);
        dragRef.current.newPosition = dragRef.current.startPosition;
      },
      [currentPosition, updateDragging, vertical],
    );

    const onButtonDown = useCallback(
      (event: MouseEvent | TouchEvent) => {
        if (disabled) return;
        event.preventDefault();
        onDragStart(event);
        window.addEventListener("mousemove", onDragging);
        window.addEventListener("touchmove", onDragging);
        window.addEventListener("mouseup", onDragEnd);
        window.addEventListener("touchend", onDragEnd);
        window.addEventListener("contextmenu", onDragEnd);
        buttonRef.current?.focus();
      },
      [disabled, onDragEnd, onDragStart, onDragging],
    );

    // 卸载时清掉可能残留的全局监听
    useEffect(
      () => () => {
        window.removeEventListener("mousemove", onDragging);
        window.removeEventListener("touchmove", onDragging);
        window.removeEventListener("mouseup", onDragEnd);
        window.removeEventListener("touchend", onDragEnd);
        window.removeEventListener("contextmenu", onDragEnd);
      },
      [onDragEnd, onDragging],
    );

    useImperativeHandle(ref, () => ({ onButtonDown, onKeyDown, setPosition }), [
      onButtonDown,
      onKeyDown,
      setPosition,
    ]);

    const tooltipPersistent = !showTooltip ? false : persistent;

    return (
      <div
        className={[
          "el-slider__button-wrapper",
          hovering && "hover",
          dragging && "dragging",
        ]
          .filter(Boolean)
          .join(" ")}
        style={wrapperStyle}
        id={id}
        tabIndex={disabled ? undefined : (tabIndex ?? 0)}
        role={aria.role}
        aria-label={aria.label}
        aria-labelledby={aria.labelledby}
        aria-valuemin={aria.valueMin}
        aria-valuemax={aria.valueMax}
        aria-valuenow={value}
        aria-valuetext={aria.valueText}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        aria-disabled={aria.disabled}
        onMouseEnter={() => {
          setHovering(true);
          displayTooltip();
        }}
        onMouseLeave={() => {
          setHovering(false);
          if (!dragging) hideTooltip();
        }}
        onMouseDown={(event) => onButtonDown(event.nativeEvent)}
        onTouchStart={(event) => onButtonDown(event.nativeEvent)}
        onFocus={() => {
          setHovering(true);
          displayTooltip();
        }}
        onBlur={() => {
          setHovering(false);
          hideTooltip();
        }}
        onKeyDown={onKeyDown}
      >
        <ElTooltip
          content={<span>{formatValue}</span>}
          visible={tooltipVisible}
          placement={placement}
          fallbackPlacements={["top", "bottom", "right", "left"]}
          popperClass={tooltipClass}
          disabled={!showTooltip}
          persistent={tooltipPersistent}
          // 官方 slider 的按钮也是键盘可达的，提示不该抢焦点
          role="tooltip"
          offset={12}
        >
          <div
            ref={buttonRef}
            className={["el-slider__button", hovering && "hover", dragging && "dragging"]
              .filter(Boolean)
              .join(" ")}
          />
        </ElTooltip>
      </div>
    );
  },
);

/** 对应官方 ElSlider。 */
export const ElSlider = forwardRef<SliderExpose, SliderProps>(function ElSlider(
  {
    value = 0,
    onChange,
    onInput,
    onValueChange,
    id,
    min = 0,
    max = 100,
    step = 1,
    showInput = false,
    showInputControls = true,
    size,
    inputSize,
    showStops = false,
    showTooltip = true,
    formatTooltip,
    disabled,
    range = false,
    vertical = false,
    height,
    rangeStartLabel,
    rangeEndLabel,
    formatValueText,
    tooltipClass,
    placement = "top",
    marks,
    validateEvent = true,
    persistent = true,
    ariaLabel,
    className,
    style,
  },
  ref,
) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<SliderButtonExpose>(null);
  const secondButtonRef = useRef<SliderButtonExpose>(null);

  const sliderSizeRef = useRef(1);
  const draggingRef = useRef(false);
  const oldValueRef = useRef<number | number[]>(0);

  const [dragging, setDragging] = useState(false);

  const initialValues = useMemo(() => {
    if (range) {
      if (isArray(value)) {
        return {
          first: Math.max(min, value[0]),
          second: Math.min(max, value[1]),
        };
      }
      return { first: min, second: max };
    }
    if (!isNumber(value) || Number.isNaN(value)) return { first: min, second: min };
    return { first: Math.min(max, Math.max(min, value)), second: min };
    // 只在挂载时求初值，与官方 onMounted 的初值逻辑对应
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [firstValue, setFirstValue] = useState(initialValues.first);
  const [secondValue, setSecondValue] = useState(initialValues.second);

  const minValue = Math.min(firstValue, secondValue);
  const maxValue = Math.max(firstValue, secondValue);

  const resetSize = useCallback(() => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    sliderSizeRef.current = rect[vertical ? "height" : "width"];
  }, [vertical]);

  const emit = useCallback(
    (next: SliderValue) => {
      onChange?.(next);
      onInput?.(next);
    },
    [onChange, onInput],
  );

  const emitChange = useCallback(
    (which: SliderButtonRole, next?: number) => {
      if (!range) {
        // 事件回调里父层 state 尚未回传，由调用方把刚落定的值显式传进来
        onValueChange?.(next ?? value);
        return;
      }
      // 只有被拖动的这一侧是新值，另一侧沿用当前渲染的值
      const first = which === "first" ? (next ?? firstValue) : firstValue;
      const second = which === "second" ? (next ?? secondValue) : secondValue;
      onValueChange?.([Math.min(first, second), Math.max(first, second)]);
    },
    [firstValue, onValueChange, range, secondValue, value],
  );

  const markList = useMemo(() => buildMarkList(marks, min, max), [marks, max, min]);

  useEffect(() => {
    if (step === "mark" && !marks) {
      debugWarn("ElSlider", "marks prop must be provided when step is mark");
    }
  }, [marks, step]);

  const sliderDisabled = useFormDisabled(disabled);
  // 官方 sliderSize 用于尺寸类名，优先取组件自身，其次 FormItem / Form
  const sliderSize = useFormSize(size);
  const { formItem } = useFormItem();
  // 官方把 id 挂到 range 的根节点 / 非 range 的滑块按钮，并注册给 FormItem
  const { inputId, isLabeledByFormItem } = useFormItemInputId({
    id,
    ariaLabel,
  });
  const precision = useMemo(() => {
    const stepValue = isNumber(step) ? step : 1;
    return Math.max(
      ...[min, max, stepValue].map((item) => {
        const decimal = `${item}`.split(".")[1];
        return decimal ? decimal.length : 0;
      }),
    );
  }, [max, min, step]);

  const context: SliderContext = {
    disabled: sliderDisabled,
    min,
    max,
    step,
    precision,
    showTooltip,
    persistent,
    formatTooltip,
    sliderSizeRef,
    markList,
    emitChange,
    resetSize,
    updateDragging: (next: boolean) => {
      draggingRef.current = next;
      setDragging(next);
    },
  };

  /** 对应官方 use-watch 的 setValues：把外部值夹到 [min,max] 并同步内部状态。 */
  const setValues = useCallback(() => {
    if (min > max) {
      throw new Error("[Slider] min should not be greater than max.");
    }

    if (range && isArray(value)) {
      if (value[1] < min) {
        emit([min, min]);
      } else if (value[0] > max) {
        emit([max, max]);
      } else if (value[0] < min) {
        emit([min, value[1]]);
      } else if (value[1] > max) {
        emit([value[0], max]);
      } else {
        setFirstValue(value[0]);
        setSecondValue(value[1]);
        const old = oldValueRef.current as number[];
        const changed = ![value[0], value[1]].every((item, index) => item === old[index]);
        if (changed) {
          if (validateEvent) formItem?.validate?.("change").catch(() => {});
          oldValueRef.current = value.slice();
        }
      }
    } else if (!range && isNumber(value) && !Number.isNaN(value)) {
      if (value < min) {
        emit(min);
      } else if (value > max) {
        emit(max);
      } else {
        setFirstValue(value);
        if (value !== oldValueRef.current) {
          if (validateEvent) formItem?.validate?.("change").catch(() => {});
          oldValueRef.current = value;
        }
      }
    }
  }, [emit, formItem, max, min, range, validateEvent, value]);

  // 初值与官方 useLifecycle 的 onMounted 对齐
  useLayoutEffect(() => {
    if (range) {
      oldValueRef.current = [initialValues.first, initialValues.second];
    } else {
      oldValueRef.current = initialValues.first;
    }
    resetSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 拖拽过程中不让外部值覆盖内部状态，否则会和拖拽位移打架
    if (draggingRef.current) return;
    setValues();
  }, [setValues]);

  useEffect(() => {
    // 拖拽结束后按最新外部值校正一次，对应官方 watch(dragging)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!dragging) setValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  useEffect(() => {
    window.addEventListener("resize", resetSize);
    return () => window.removeEventListener("resize", resetSize);
  }, [resetSize]);

  const setFirstValueFromButton = useCallback(
    (next?: number) => {
      const nextFirst = next ?? min;
      setFirstValue(nextFirst);
      const mn = Math.min(nextFirst, secondValue);
      const mx = Math.max(nextFirst, secondValue);
      const out: SliderValue = range ? [mn, mx] : nextFirst;
      onChange?.(out);
      onInput?.(out);
    },
    [min, onInput, onChange, range, secondValue],
  );

  const setSecondValueFromButton = useCallback(
    (next: number) => {
      setSecondValue(next);
      if (!range) return;
      const mn = Math.min(firstValue, next);
      const mx = Math.max(firstValue, next);
      const out: SliderValue = [mn, mx];
      onChange?.(out);
      onInput?.(out);
    },
    [firstValue, onInput, onChange, range],
  );

  const renderInput = showInput && !range && step !== "mark";

  const barSize = range
    ? `${(100 * (maxValue - minValue)) / (max - min)}%`
    : `${(100 * (firstValue - min)) / (max - min)}%`;
  const barStart = range ? `${(100 * (minValue - min)) / (max - min)}%` : "0%";

  const runwayStyle: CSSProperties = vertical ? { height } : {};
  const barStyle: CSSProperties = vertical
    ? { height: barSize, bottom: barStart }
    : { width: barSize, left: barStart };

  /** 对应官方 getButtonRefByPercent：按位置挑最近的按钮。 */
  const getButtonByPercent = useCallback(
    (percent: number) => {
      const targetValue = min + (percent * (max - min)) / 100;
      if (!range) return firstButtonRef;

      if (Math.abs(minValue - targetValue) < Math.abs(maxValue - targetValue)) {
        return firstValue < secondValue ? firstButtonRef : secondButtonRef;
      }
      return firstValue > secondValue ? firstButtonRef : secondButtonRef;
    },
    [firstValue, max, maxValue, min, minValue, range, secondValue],
  );

  const handleSliderPointerEvent = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (sliderDisabled || draggingRef.current) return undefined;
      resetSize();

      let newPercent = 0;
      if (vertical) {
        const { clientY } = getClientXY(event);
        const bottom = sliderRef.current!.getBoundingClientRect().bottom;
        newPercent = ((bottom - clientY) / sliderSizeRef.current) * 100;
      } else {
        const { clientX } = getClientXY(event);
        const left = sliderRef.current!.getBoundingClientRect().left;
        newPercent = ((clientX - left) / sliderSizeRef.current) * 100;
      }

      if (newPercent < 0 || newPercent > 100) return undefined;

      const button = getButtonByPercent(newPercent);
      const which: SliderButtonRole =
        button === secondButtonRef ? "second" : "first";
      const value = button.current?.setPosition(newPercent);
      return { button, value, which };
    },
    [getButtonByPercent, resetSize, sliderDisabled, vertical],
  );

  const onSliderDown = (event: MouseEvent | TouchEvent) => {
    const result = handleSliderPointerEvent(event);
    if (result) {
      const { button } = result;
      // 等一次渲染，让 setPosition 的结果先落到 DOM 上再开始拖拽
      window.setTimeout(() => button.current?.onButtonDown(event), 0);
    }
  };

  const onSliderClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const result = handleSliderPointerEvent(event);
      if (result) emitChange(result.which, result.value);
    },
    [emitChange, handleSliderPointerEvent],
  );

  useImperativeHandle(ref, () => ({ onSliderClick }), [onSliderClick]);

  const onSliderMarkerDown = (position: number) => {
    if (sliderDisabled || draggingRef.current) return;
    const button = getButtonByPercent(min + (position * (max - min)) / 100);
    const which: SliderButtonRole =
      button === secondButtonRef ? "second" : "first";
    emitChange(which, button.current?.setPosition(position));
  };

  // 触摸拖拽时阻止页面滚动，对应官方 onSliderWrapperPrevent
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prevent = (event: TouchEvent) => {
      if (draggingRef.current) event.preventDefault();
    };

    el.addEventListener("touchstart", prevent, { passive: false });
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      el.removeEventListener("touchstart", prevent);
      el.removeEventListener("touchmove", prevent);
    };
  }, []);

  const getStopStyle = (position: number): CSSProperties =>
    vertical ? { bottom: `${position}%` } : { left: `${position}%` };

  const stops = useMemo(() => {
    if (!showStops || min > max) return [];
    if (step === "mark" || step === 0) {
      if (step === 0) debugWarn("ElSlider", "step should not be 0.");
      return [];
    }

    const stopCount = Math.ceil((max - min) / step);
    const stepWidth = (100 * step) / (max - min);
    const result = Array.from<number>({ length: stopCount - 1 }).map(
      (_, index) => (index + 1) * stepWidth,
    );

    if (range) {
      return result.filter(
        (item) =>
          item < (100 * (minValue - min)) / (max - min) ||
          item > (100 * (maxValue - min)) / (max - min),
      );
    }
    return result.filter((item) => item > (100 * (firstValue - min)) / (max - min));
  }, [firstValue, max, maxValue, min, minValue, range, showStops, step]);

  const groupLabel = ariaLabel || LOCALE.defaultLabel(min, max);
  const firstButtonLabel = range ? rangeStartLabel || LOCALE.rangeStartLabel : groupLabel;
  const secondButtonLabel = rangeEndLabel || LOCALE.rangeEndLabel;

  const rootClasses = [
    "el-slider",
    sliderSize && `el-slider--${sliderSize}`,
    vertical && "is-vertical",
    renderInput && "el-slider--with-input",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={range ? inputId : undefined}
      ref={wrapperRef}
      className={rootClasses}
      style={style}
      role={range ? "group" : undefined}
      aria-label={range && !isLabeledByFormItem ? groupLabel : undefined}
      aria-labelledby={
        range && isLabeledByFormItem ? formItem?.labelId : undefined
      }
    >
      <div
        ref={sliderRef}
        className={["el-slider__runway", renderInput && "show-input", sliderDisabled && "is-disabled"]
          .filter(Boolean)
          .join(" ")}
        style={runwayStyle}
        onMouseDown={(event) => onSliderDown(event.nativeEvent)}
        onTouchStart={(event) => onSliderDown(event.nativeEvent)}
      >
        <div className="el-slider__bar" style={barStyle} />

        <SliderButton
          ref={firstButtonRef}
          value={firstValue}
          id={range ? undefined : inputId}
          which="first"
          vertical={vertical}
          tooltipClass={tooltipClass}
          placement={placement}
          ctx={context}
          onUpdateValue={setFirstValueFromButton}
          tabIndex={0}
          aria={{
            role: "slider",
            label: range || !isLabeledByFormItem ? firstButtonLabel : undefined,
            labelledby:
              !range && isLabeledByFormItem ? formItem?.labelId : undefined,
            valueMin: min,
            valueMax: range ? secondValue : max,
            valueText: formatValueText ? formatValueText(firstValue) : `${firstValue}`,
            disabled: sliderDisabled,
          }}
        />

        {range && (
          <SliderButton
            ref={secondButtonRef}
            value={secondValue}
            which="second"
            vertical={vertical}
            tooltipClass={tooltipClass}
            placement={placement}
            ctx={context}
            onUpdateValue={setSecondValueFromButton}
            aria={{
              role: "slider",
              label: secondButtonLabel,
              valueMin: firstValue,
              valueMax: max,
              valueText: formatValueText ? formatValueText(secondValue) : `${secondValue}`,
              disabled: sliderDisabled,
            }}
          />
        )}

        {showStops && (
          <div>
            {stops.map((item, index) => (
              <div
                key={index}
                className="el-slider__stop"
                style={getStopStyle(item)}
              />
            ))}
          </div>
        )}

        {markList.length > 0 && (
          <>
            <div>
              {markList.map((item) => (
                <div
                  key={item.point}
                  className="el-slider__stop el-slider__marks-stop"
                  style={getStopStyle(item.position)}
                />
              ))}
            </div>

            <div className="el-slider__marks">
              {markList.map((item) => {
                const isConfig = isMarkConfig(item.mark);
                const config = item.mark as SliderMarkConfig;
                const label = isConfig ? config.label : (item.mark as ReactNode);
                const markStyle = isConfig ? config.style : undefined;

                return (
                  <div
                    key={item.point}
                    className="el-slider__marks-text"
                    style={{ ...markStyle, ...getStopStyle(item.position) }}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                      onSliderMarkerDown(item.position);
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {renderInput && (
        <ElInputNumber
          className="el-slider__input"
          value={firstValue}
          // 官方用 input-number 的 change 事件做「拖拽结束」通知，这里同样在加减/失焦改值后回调
          onChange={(next) => {
            const resolved = next ?? min;
            setFirstValueFromButton(resolved);
            emitChange("first", resolved);
          }}
          step={isNumber(step) ? step : 1}
          disabled={sliderDisabled}
          controls={showInputControls}
          min={min}
          max={max}
          precision={precision}
          size={inputSize ?? ((sliderSize as ComponentSize) || undefined)}
        />
      )}
    </div>
  );
});
