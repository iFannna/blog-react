"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import type { ComponentSize } from "../button/types";

/** 对应官方 types.ts 的 Option。 */
export type SegmentedOption =
  | Record<string, unknown>
  | string
  | number
  | boolean;

export type SegmentedValue = string | number | boolean;

/** 对应官方 props 里可自定义的字段别名。 */
export interface SegmentedOptionProps {
  value?: string;
  label?: string;
  disabled?: string;
}

export interface SegmentedProps {
  /** 选中值，对应官方 v-model */
  value?: SegmentedValue;
  /** 选中值变化，对应官方 v-model + change */
  onChange?: (value: SegmentedValue) => void;
  /** 选项数据 */
  options?: SegmentedOption[];
  /** 选项字段别名，对应官方 props */
  optionProps?: SegmentedOptionProps;
  /** 是否撑满父容器宽度 */
  block?: boolean;
  /** 尺寸 */
  size?: ComponentSize;
  /** 是否禁用整个组件 */
  disabled?: boolean;
  /** 是否触发表单校验（本项目未接 FormItem 校验链） */
  validateEvent?: boolean;
  /** 原生 id */
  id?: string;
  /** 原生 name */
  name?: string;
  /** 原生 aria-label */
  ariaLabel?: string;
  /** 排列方向 */
  direction?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
  /** 自定义选项内容，对应官方 default 作用域插槽，参数为当前选项 */
  children?: (item: SegmentedOption, index: number) => ReactNode;
}

const DEFAULT_OPTION_PROPS = {
  label: "label",
  value: "value",
  disabled: "disabled",
} as const;

function isObject(item: SegmentedOption): item is Record<string, unknown> {
  return typeof item === "object" && item !== null;
}

/**
 * 对应官方 ElSegmented。
 *
 * DOM 与官网一致：
 *   .el-segmented > .el-segmented__group
 *     > .el-segmented__item-selected（绝对定位的滑动选中块）
 *     > label.el-segmented__item > input.el-segmented__item-input + .el-segmented__item-label
 *
 * 滑动块的定位采用官方做法：量出选中项的 offsetLeft/offsetWidth（纵向则是
 * offsetTop/offsetHeight），用 transform 平移过去。因此这里必须用内联样式承载
 * 运行时几何量——与 ElTabs 的激活条同一处理方式。
 */
export function ElSegmented({
  value,
  onChange,
  options = [],
  optionProps,
  block,
  size,
  disabled,
  validateEvent = true,
  id,
  name,
  ariaLabel,
  direction = "horizontal",
  className,
  style,
  children,
}: SegmentedProps) {
  const alias = { ...DEFAULT_OPTION_PROPS, ...optionProps };

  const segmentedDisabled = useFormDisabled(disabled);
  const segmentedSize = useFormSize(size);
  const { formItem } = useFormItem();
  const { inputId, isLabeledByFormItem } = useFormItemInputId({ id, ariaLabel });
  const generatedName = useId();

  // 对应官方 watch(modelValue)：值变化后触发 change 校验
  const prevValueRef = useRef(value);
  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;
    if (validateEvent && prev !== value) {
      formItem?.validate("change").catch(() => {});
    }
  }, [value, validateEvent, formItem]);

  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedStyle, setSelectedStyle] = useState<CSSProperties>({
    display: "none",
  });
  const [focusVisible, setFocusVisible] = useState(false);

  /** 对应官方 updateSelect */
  const updateSelect = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const selectedItem = root.querySelector<HTMLElement>(".is-selected");
    const selectedInput = root.querySelector<HTMLElement>(".is-selected input");
    if (!selectedItem || !selectedInput) {
      setSelectedStyle({ display: "none" });
      setFocusVisible(false);
      return;
    }

    const next: CSSProperties =
      direction === "vertical"
        ? {
            width: "100%",
            height: `${selectedItem.offsetHeight}px`,
            transform: `translateY(${selectedItem.offsetTop}px)`,
            display: "block",
          }
        : {
            width: `${selectedItem.offsetWidth}px`,
            height: "100%",
            transform: `translateX(${selectedItem.offsetLeft}px)`,
            display: "block",
          };

    // layout effect 每次渲染后都跑，值未变时保持原对象，避免无谓的再渲染
    setSelectedStyle((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
    );

    let visible = false;
    try {
      visible = selectedInput.matches(":focus-visible");
    } catch {
      visible = false;
    }
    setFocusVisible(visible);
  }, [direction]);

  const updateRef = useRef(updateSelect);
  useEffect(() => {
    updateRef.current = updateSelect;
  }, [updateSelect]);

  // 对应官方 useResizeObserver(segmentedRef, updateSelect)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateRef.current());
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // 对应官方 watch(activeElement, updateSelect)：焦点变化时重算 :focus-visible
  useEffect(() => {
    const handler = () => updateRef.current();
    document.addEventListener("focusin", handler);
    document.addEventListener("focusout", handler);
    window.addEventListener("resize", handler);
    return () => {
      document.removeEventListener("focusin", handler);
      document.removeEventListener("focusout", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  useLayoutEffect(() => {
    updateRef.current();
  });

  // 无选项时官方 v-if 不渲染任何内容
  if (options.length === 0) return null;

  const getValue = (item: SegmentedOption): SegmentedValue =>
    isObject(item) ? (item[alias.value] as SegmentedValue) : item;

  const getLabel = (item: SegmentedOption): ReactNode =>
    isObject(item) ? (item[alias.label] as ReactNode) : item;

  const getDisabled = (item: SegmentedOption | undefined): boolean =>
    Boolean(
      segmentedDisabled ||
        (item !== undefined && isObject(item)
          ? item[alias.disabled]
          : false),
    );

  const getSelected = (item: SegmentedOption): boolean =>
    value === getValue(item);

  const getItemClasses = (item: SegmentedOption) =>
    [
      "el-segmented__item",
      getSelected(item) && "is-selected",
      getDisabled(item) && "is-disabled",
    ]
      .filter(Boolean)
      .join(" ");

  const rootClasses = [
    "el-segmented",
    segmentedSize && `el-segmented--${segmentedSize}`,
    block && "is-block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const groupClasses = ["el-segmented__group", `el-segmented--${direction}`].join(
    " ",
  );

  const selectedOption = options.find((item) => getValue(item) === value);

  const selectedClasses = [
    "el-segmented__item-selected",
    getDisabled(selectedOption) && "is-disabled",
    focusVisible && "is-focus-visible",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={inputId}
      ref={rootRef}
      className={rootClasses}
      style={style}
      role="radiogroup"
      aria-label={!isLabeledByFormItem ? ariaLabel || "segmented" : undefined}
      aria-labelledby={isLabeledByFormItem ? formItem?.labelId : undefined}
    >
      <div className={groupClasses}>
        <div className={selectedClasses} style={selectedStyle} />

        {options.map((item, index) => (
          <label key={index} className={getItemClasses(item)}>
            <input
              className="el-segmented__item-input"
              type="radio"
              name={name || generatedName}
              disabled={getDisabled(item)}
              checked={getSelected(item)}
              onChange={() => onChange?.(getValue(item))}
            />
            <div className="el-segmented__item-label">
              {/* 官方 default 插槽有传参，故 children 采用函数式 */}
              {children ? children(item, index) : getLabel(item)}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
