"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";

import { ElDynamicSizeList } from "../virtual-list/ElDynamicSizeList";
import { ElFixedSizeList } from "../virtual-list/ElFixedSizeList";

import { GroupItem } from "./GroupItem";
import { OptionItem } from "./OptionItem";

import type { EndReachedDirection, VirtualListHandle } from "../virtual-list";
import type {
  SelectOptionRenderParams,
  SelectOptionType,
  SelectValue,
} from "./types";

export interface SelectDropdownHandle {
  scrollToItem: (index: number) => void;
  resetScrollTop: () => void;
}

export interface SelectDropdownProps {
  data: SelectOptionType[];
  width: number;
  height: number;
  itemHeight: number;
  estimatedOptionHeight?: number;
  hoveringIndex: number;
  id: string;
  ariaLabel?: string;
  multiple: boolean;
  scrollbarAlwaysOn?: boolean;
  modelValue: SelectValue;
  multipleLimit: number;
  disabled: boolean;
  valueKey: string;
  getLabel: (item: SelectOptionType) => string | number | undefined;
  getValue: (item: SelectOptionType) => unknown;
  getDisabled: (item: SelectOptionType) => boolean;
  renderOption?: (params: SelectOptionRenderParams) => ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  empty?: ReactNode;
  loadingContent?: ReactNode;
  onSelect: (item: SelectOptionType, index: number) => void;
  onHover: (index: number) => void;
  onEndReached?: (direction: EndReachedDirection) => void;
  ref?: Ref<SelectDropdownHandle>;
}

const isObjectValue = (value: unknown) =>
  typeof value === "object" && value !== null;

/** 对应官方 select-dropdown.tsx 的 isEqual / contains。 */
function createValueComparer(valueKey: string) {
  const equal = (left: unknown, right: unknown) => {
    if (!isObjectValue(left) && !isObjectValue(right)) return left === right;
    return (
      (left as Record<string, unknown> | null)?.[valueKey] ===
      (right as Record<string, unknown> | null)?.[valueKey]
    );
  };

  const contains = (list: unknown[], target: unknown) =>
    list.some((item) => equal(item, target));

  return { equal, contains };
}

/**
 * 对应官方 ElSelectDropdown。
 *
 * 虚拟列表按 estimatedOptionHeight 是否存在在固定/动态尺寸之间切换；
 * 动态模式下沿用官方的估算行高（官方缓存的实测高度未填充，等价于全估算）。
 */
export const SelectDropdown = forwardRef<
  SelectDropdownHandle,
  SelectDropdownProps
>(function SelectDropdown(
  {
    data,
    width,
    height,
    itemHeight,
    estimatedOptionHeight,
    hoveringIndex,
    id,
    ariaLabel,
    multiple,
    scrollbarAlwaysOn = false,
    modelValue,
    multipleLimit,
    disabled,
    valueKey,
    getLabel,
    getValue,
    getDisabled,
    renderOption,
    header,
    footer,
    empty,
    loadingContent,
    onSelect,
    onHover,
    onEndReached,
  },
  ref,
) {
  const listRef = useRef<VirtualListHandle>(null);
  const sized = estimatedOptionHeight === undefined;
  const { equal, contains } = createValueComparer(valueKey);

  useImperativeHandle(ref, () => ({
    scrollToItem: (index: number) => listRef.current?.scrollToItem(index),
    resetScrollTop: () => listRef.current?.resetScrollTop(),
  }));

  const isItemSelected = (item: SelectOptionType) => {
    const optionValue = getValue(item);
    if (multiple) {
      return Array.isArray(modelValue) && contains(modelValue, optionValue);
    }
    return equal(modelValue, optionValue);
  };

  const isItemDisabled = (item: SelectOptionType, selected: boolean) => {
    if (disabled) return true;
    if (selected || !multiple) return false;
    return multipleLimit > 0 &&
      Array.isArray(modelValue) &&
      modelValue.length >= multipleLimit;
  };

  const renderItem = (
    dataSource: SelectOptionType[],
    index: number,
    style: CSSProperties,
  ) => {
    const item = dataSource[index];
    if (!item) return null;

    if (item.type === "Group") {
      return (
        <GroupItem
          key={index}
          item={item}
          style={style}
          height={sized ? itemHeight : estimatedOptionHeight}
        />
      );
    }

    const selected = isItemSelected(item);
    const itemDisabled = getDisabled(item) || isItemDisabled(item, selected);

    return (
      <OptionItem
        key={index}
        item={item}
        index={index}
        style={style}
        selected={selected}
        disabled={itemDisabled}
        created={Boolean(item.created)}
        hovering={hoveringIndex === index}
        contentId={id}
        getLabel={getLabel}
        renderOption={renderOption}
        onSelect={onSelect}
        onHover={onHover}
      />
    );
  };

  const listProps = {
    className: "el-select-dropdown__list",
    data,
    height,
    width,
    total: data.length,
    scrollbarAlwaysOn,
    innerElement: "ul" as const,
    innerProps: {
      id,
      role: "listbox",
      "aria-label": ariaLabel,
      "aria-orientation": "vertical",
    },
    onEndReached,
  };

  const list = sized ? (
    <ElFixedSizeList<SelectOptionType> {...listProps} ref={listRef} itemSize={itemHeight}>
      {({ data: items, index, style }) => renderItem(items, index, style)}
    </ElFixedSizeList>
  ) : (
    <ElDynamicSizeList<SelectOptionType>
      {...listProps}
      ref={listRef}
      itemSize={() => estimatedOptionHeight}
      estimatedItemSize={estimatedOptionHeight}
    >
      {({ data: items, index, style }) => renderItem(items, index, style)}
    </ElDynamicSizeList>
  );

  return (
    <div
      className={["el-select-dropdown", multiple && "is-multiple"]
        .filter(Boolean)
        .join(" ")}
      style={{ width: `${width}px` }}
    >
      {header !== undefined && (
        <div
          className="el-select-dropdown__header"
          onClick={(event) => event.stopPropagation()}
        >
          {header}
        </div>
      )}

      {loadingContent ?? empty ?? list}

      {footer !== undefined && (
        <div
          className="el-select-dropdown__footer"
          onClick={(event) => event.stopPropagation()}
        >
          {footer}
        </div>
      )}
    </div>
  );
});
