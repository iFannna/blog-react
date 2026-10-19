"use client";

import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react";

import type {
  SelectV2OptionRenderParams,
  SelectV2OptionType,
} from "./types";

export interface OptionItemProps {
  item: SelectV2OptionType;
  index: number;
  style?: CSSProperties;
  selected: boolean;
  disabled: boolean;
  created: boolean;
  hovering: boolean;
  contentId: string;
  getLabel: (item: SelectV2OptionType) => string | number | undefined;
  renderOption?: (params: SelectV2OptionRenderParams) => ReactNode;
  onSelect: (item: SelectV2OptionType, index: number) => void;
  onHover: (index: number) => void;
}

const FOCUSABLE_SELECTOR =
  'input, textarea, button, select, a[href], [tabindex]:not([tabindex="-1"])';

function isFocusable(element: HTMLElement) {
  return element.matches(FOCUSABLE_SELECTOR);
}

/** 对应官方 option-item.vue。 */
export function OptionItem({
  item,
  index,
  style,
  selected,
  disabled,
  created,
  hovering,
  contentId,
  getLabel,
  renderOption,
  onSelect,
  onHover,
}: OptionItemProps) {
  const classes = [
    "el-select-dropdown__item",
    selected && "is-selected",
    disabled && "is-disabled",
    created && "is-created",
    hovering && "is-hovering",
  ]
    .filter(Boolean)
    .join(" ");

  // 点中选项里的可聚焦元素时保留默认行为，其余情况阻止 mousedown
  // 以免输入框失焦、下拉被收起
  const handleMousedown = (event: ReactMouseEvent<HTMLLIElement>) => {
    let target = event.target as HTMLElement | null;
    const currentTarget = event.currentTarget;

    while (target && target !== currentTarget) {
      if (isFocusable(target)) return;
      target = target.parentElement;
    }

    event.preventDefault();
  };

  return (
    <li
      id={`${contentId}-${index}`}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      style={style}
      className={classes}
      onMouseMove={() => {
        if (!disabled) onHover(index);
      }}
      onMouseDown={handleMousedown}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onSelect(item, index);
      }}
    >
      {renderOption ? (
        renderOption({ item, index, disabled })
      ) : (
        <span>{getLabel(item)}</span>
      )}
    </li>
  );
}
