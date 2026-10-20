"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { Star, StarFilled } from "../icons";
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import type { ComponentSize } from "../button/types";

/** 官方 iconPropType：既接受组件，也接受直接传入的 vnode/节点 */
export type IconPropType =
  | ComponentType<SVGProps<SVGSVGElement>>
  | ReactNode;

export interface RateProps {
  /** 当前值，对应官方 modelValue */
  value?: number;
  /** 值变化，合并官方 update:modelValue 与 change */
  onChange?: (value: number) => void;
  /** 原生 id */
  id?: string;
  /** 低分与中分的阈值，阈值本身算低分 */
  lowThreshold?: number;
  /** 中分与高分的阈值，阈值本身算高分 */
  highThreshold?: number;
  /** 最大分值 */
  max?: number;
  /** 图标颜色。数组需 3 个元素，对象则以阈值作键 */
  colors?: string[] | Record<number, string>;
  /** 未选中图标的颜色 */
  voidColor?: string;
  /** 只读时未选中图标的颜色 */
  disabledVoidColor?: string;
  /** 图标组件，形态同 colors */
  icons?: IconPropType[] | Record<number, IconPropType>;
  /** 未选中时的图标组件 */
  voidIcon?: IconPropType;
  /** 只读时未选中图标组件 */
  disabledVoidIcon?: IconPropType;
  /** 是否只读 */
  disabled?: boolean;
  /** 是否允许半选 */
  allowHalf?: boolean;
  /** 是否显示辅助文字 */
  showText?: boolean;
  /** 是否显示当前分值，与 showText 互斥 */
  showScore?: boolean;
  /** 辅助文字的颜色 */
  textColor?: string;
  /** 辅助文字数组 */
  texts?: string[];
  /** 分值模板，必须含 {value} */
  scoreTemplate?: string;
  /** 尺寸 */
  size?: ComponentSize;
  /** 再次点击相同值是否清空为 0 */
  clearable?: boolean;
  /** 原生 aria-label */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** 官方 defineExpose 暴露的实例方法 */
export interface RateExpose {
  /** 设置当前高亮值，对应官方 setCurrentValue(value) */
  setCurrentValue: (value: number) => void;
  /** 重置为 value 对应的高亮值，对应官方 resetCurrentValue() */
  resetCurrentValue: () => void;
}

/** 官方用 lodash clamp，这里手写一份，避免引入 lodash */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** 判断某个键的映射项是否带 excluded 语义 */
function isRateMapItem(
  val: unknown,
): val is { excluded?: boolean; value: IconPropType | string } {
  return typeof val === "object" && val !== null;
}

/**
 * 从阈值映射里取值。带 excluded 的键要求 value < key 才算命中，否则 value <= key。
 */
function getValueFromMap<T>(
  value: number,
  map: Record<string | number, T | { excluded?: boolean; value: T }>,
): T {
  const matchedKeys = Object.keys(map)
    .map((key) => +key)
    .filter((key) => {
      const val = map[key];
      const excluded = isRateMapItem(val) ? val.excluded : false;
      return excluded ? value < key : value <= key;
    })
    .sort((a, b) => a - b);

  const matchedValue = map[matchedKeys[0]];
  // 命中的既可能是 { value, excluded } 包装，也可能直接是值本身，官方同样是宽松类型
  return ((isRateMapItem(matchedValue) && matchedValue.value) ||
    matchedValue) as T;
}

/**
 * 解析图标 prop。官方把 v-show 的 display 与 decimal--box 类直接打在图标组件
 * 渲染出的 svg 上；这里同样把 props 透传给组件 / 已有元素，避免额外包一层
 * span 改变 DOM 结构。非元素节点才退回 span 包裹。
 */
function renderIconContent(
  icon: IconPropType | undefined,
  props?: SVGProps<SVGSVGElement>,
): ReactNode {
  if (typeof icon === "function") {
    const Comp = icon as ComponentType<SVGProps<SVGSVGElement>>;
    return <Comp {...props} />;
  }
  if (isValidElement(icon)) {
    return cloneElement(icon as React.ReactElement<SVGProps<SVGSVGElement>>, props);
  }
  if (props) {
    return (
      <span className={props.className} style={props.style}>
        {icon as ReactNode}
      </span>
    );
  }
  return icon as ReactNode;
}

const KEY_CODE = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
} as const;

const DEFAULT_TEXTS = [
  "Extremely bad",
  "Disappointed",
  "Fair",
  "Satisfied",
  "Surprise",
];

/**
 * 对应官方 ElRate。
 *
 * 双向绑定换成 React 惯用式 value + onChange，官方 update:modelValue 与 change
 * 合并在 onChange 上；官方通过 cssVarBlock 下发的颜色变量在这里直接写进根元素 style。
 */
export const ElRate = forwardRef<RateExpose, RateProps>(function ElRate(
  {
    value = 0,
    onChange,
    id,
    lowThreshold = 2,
    highThreshold = 4,
    max = 5,
    colors = ["", "", ""],
    voidColor = "",
    disabledVoidColor = "",
    icons = [StarFilled, StarFilled, StarFilled],
    voidIcon = Star,
    disabledVoidIcon = StarFilled,
    disabled,
    allowHalf = false,
    showText = false,
    showScore = false,
    textColor = "",
    texts = DEFAULT_TEXTS,
    scoreTemplate = "{value}",
    size,
    clearable = false,
    ariaLabel,
    className,
    style,
  },
  ref,
) {
  // 官方 currentValue 是就地维护的展示值：hover 时被改写，离开或 value 变化时回归
  const [currentValue, setCurrentValue] = useState(() =>
    clamp(value, 0, max),
  );
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [pointerAtLeftHalf, setPointerAtLeftHalf] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLElement | null)[]>([]);

  const rateDisabled = useFormDisabled(disabled);
  // 官方 rateSize 用于尺寸类名，优先取组件自身，其次 FormItem / Form
  const rateSize = useFormSize(size);
  // 有 FormItem label 时用 aria-labelledby 关联，避免 aria-label 抢走语义
  const { formItem } = useFormItem();
  const { inputId, isLabeledByFormItem } = useFormItemInputId({
    id,
    ariaLabel,
  });

  // 官方用 watch(props.modelValue) 同步。React 里若放进 useEffect，会有一帧
  // currentValue 仍是旧值、图标高亮滞后；改成渲染期比较上一次的值就地同步，
  // 语义与原版一致（例如 selectValue 里 allowHalf 分支读到的就是刚被指向的值）。
  const lastValueRef = useRef(value);
  if (lastValueRef.current !== value) {
    lastValueRef.current = value;
    setCurrentValue(clamp(value, 0, max));
    setPointerAtLeftHalf(value !== Math.floor(value));
  }

  const activeColor = useMemo(() => {
    const colorMap = Array.isArray(colors)
      ? {
          [lowThreshold]: colors[0],
          [highThreshold]: { value: colors[1], excluded: true },
          [max]: colors[2],
        }
      : colors;
    const color = getValueFromMap(currentValue, colorMap);
    // 命中 {value: '', excluded: true} 时返回空串，与官方一致
    return isRateMapItem(color) ? "" : color;
  }, [colors, currentValue, highThreshold, lowThreshold, max]);

  const componentMap = useMemo(() => {
    const list = icons;
    return Array.isArray(list)
      ? {
          [lowThreshold]: list[0],
          [highThreshold]: { value: list[1], excluded: true },
          [max]: list[2],
        }
      : list;
  }, [icons, highThreshold, lowThreshold, max]);

  const activeComponent = useMemo(
    () => getValueFromMap(currentValue, componentMap),
    [componentMap, currentValue],
  );
  const decimalIconComponent = useMemo(
    () => getValueFromMap(value, componentMap),
    [componentMap, value],
  );
  const voidComponent = rateDisabled ? disabledVoidIcon : voidIcon;

  const valueDecimal = value * 100 - Math.floor(value) * 100;

  const showDecimalIcon = (item: number) => {
    const showWhenDisabled =
      rateDisabled &&
      valueDecimal > 0 &&
      item - 1 < value &&
      item > value;
    const showWhenAllowHalf =
      allowHalf &&
      pointerAtLeftHalf &&
      item - 0.5 <= currentValue &&
      item > currentValue;
    return showWhenDisabled || showWhenAllowHalf;
  };

  const decimalStyle: CSSProperties = {
    color: activeColor,
    // 只读时按小数部分裁切宽度，允许半选时固定 50%
    width: rateDisabled ? `${valueDecimal}%` : allowHalf ? "50%" : "",
  };

  const text = (() => {
    if (showScore) {
      return scoreTemplate.replace(
        /\{\s*value\s*\}/,
        rateDisabled ? `${value}` : `${currentValue}`,
      );
    }
    if (showText) {
      return texts[Math.ceil(currentValue) - 1];
    }
    return "";
  })();

  const classes = [
    "el-rate",
    // 官方 ns.m(rateSize) 只在 size 有值时才追加类名
    rateSize && `el-rate--${rateSize}`,
    rateDisabled && "is-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: CSSProperties = {
    ...style,
    // 官方 rateStyles = cssVarBlock({...})，空值不下发变量
    ...(voidColor ? { "--el-rate-void-color": voidColor } : {}),
    ...(disabledVoidColor
      ? { "--el-rate-disabled-void-color": disabledVoidColor }
      : {}),
    ...(activeColor ? { "--el-rate-fill-color": activeColor } : {}),
  };

  /**
   * 官方 emitValue：change 只在值确实变了时抛出。合并到 onChange 后仍按此判定，
   * 避免「点中同值时 change 静默但 onChange 触发」与官方不一致。
   */
  const emitValue = (nextValue: number) => {
    // 可清空且点中当前值时归零
    const emitted = clearable && nextValue === value ? 0 : nextValue;
    if (emitted !== value) onChange?.(emitted);
  };

  const selectValue = (item: number) => {
    if (rateDisabled) return;
    if (allowHalf && pointerAtLeftHalf) {
      emitValue(currentValue);
    } else {
      emitValue(item);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (rateDisabled) return;
    const step = allowHalf ? 0.5 : 1;
    let nextValue = currentValue;

    if (event.code === KEY_CODE.up || event.code === KEY_CODE.right) {
      nextValue += step;
    } else if (
      event.code === KEY_CODE.left ||
      event.code === KEY_CODE.down
    ) {
      nextValue -= step;
    }

    nextValue = clamp(nextValue, 0, max);
    if (nextValue === currentValue) return;

    event.stopPropagation();
    event.preventDefault();
    // 官方键盘路径同时抛 update:modelValue 与 change，这里合并为一次 onChange
    onChange?.(nextValue);
  };

  const handleItemMove = (item: number, event: MouseEvent<HTMLSpanElement>) => {
    if (rateDisabled) return;
    if (allowHalf) {
      const atLeftHalf =
        event.nativeEvent.offsetX * 2 <=
        (iconRefs.current[item - 1]?.clientWidth ?? 0);
      setPointerAtLeftHalf(atLeftHalf);
      setCurrentValue(atLeftHalf ? item - 0.5 : item);
    } else {
      setCurrentValue(item);
    }
    setHoverIndex(item);
  };

  const handleItemLeave = () => {
    if (rateDisabled) return;
    if (allowHalf) {
      setPointerAtLeftHalf(value !== Math.floor(value));
    }
    setCurrentValue(clamp(value, 0, max));
    setHoverIndex(-1);
  };

  // 官方 defineExpose 的 setCurrentValue / resetCurrentValue 语义：
  // 只改高亮，不回写 value。
  useImperativeHandle(
    ref,
    () => ({
      setCurrentValue: (val: number) => {
        if (rateDisabled) return;
        setCurrentValue(val);
      },
      resetCurrentValue: () => {
        if (rateDisabled) return;
        if (allowHalf) setPointerAtLeftHalf(value !== Math.floor(value));
        setCurrentValue(clamp(value, 0, max));
        setHoverIndex(-1);
      },
    }),
    [allowHalf, max, rateDisabled, value],
  );

  const items = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <div
      ref={rootRef}
      id={inputId}
      className={classes}
      style={rootStyle}
      role="slider"
      aria-label={!isLabeledByFormItem ? ariaLabel || "rating" : undefined}
      aria-labelledby={isLabeledByFormItem ? formItem?.labelId : undefined}
      aria-valuenow={currentValue}
      aria-valuetext={text || undefined}
      aria-valuemin={0}
      aria-valuemax={max}
      tabIndex={rateDisabled ? undefined : 0}
      aria-disabled={rateDisabled}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => {
        const isDecimal = showDecimalIcon(item);
        return (
          <span
            key={item}
            className="el-rate__item"
            onMouseMove={(event) => handleItemMove(item, event)}
            onMouseLeave={handleItemLeave}
            onClick={() => selectValue(item)}
          >
            <ElIcon
              ref={(node: HTMLElement | null) => {
                iconRefs.current[item - 1] = node;
              }}
              className={[
                "el-rate__icon",
                hoverIndex === item && "hover",
                item <= currentValue && "is-active",
                item === Math.ceil(currentValue || 1) && "is-focus-visible",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* 三种图标互斥显示：小数图标优先，其次实心/空心 */}
              {renderIconContent(activeComponent, {
                style: {
                  display:
                    !isDecimal && item <= currentValue ? undefined : "none",
                },
              })}
              {renderIconContent(voidComponent, {
                style: {
                  display:
                    !isDecimal && item > currentValue ? undefined : "none",
                },
              })}
              {renderIconContent(voidComponent, {
                className: "el-rate__decimal--box",
                style: { display: isDecimal ? undefined : "none" },
              })}
              <ElIcon
                className="el-rate__icon el-rate__decimal"
                style={{ ...decimalStyle, display: isDecimal ? undefined : "none" }}
              >
                {renderIconContent(decimalIconComponent)}
              </ElIcon>
            </ElIcon>
          </span>
        );
      })}

      {(showText || showScore) && (
        <span className="el-rate__text" style={{ color: textColor }}>
          {text}
        </span>
      )}
    </div>
  );
});
