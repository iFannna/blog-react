"use client";

import { useRef, useState } from "react";
import { ElTooltip } from "../tooltip";
import { ElCheckbox, ElCheckboxGroup } from "../checkbox";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, ArrowUp } from "../generated/icons";
import type { PopperPlacement } from "../popper/use-popper";
import { TABLE_LOCALE } from "./config";
import type { DefaultRow, TableColumnCtx } from "./context";

/**
 * 对应官方 table/src/filter-panel.vue。
 *
 * 多选面板带确认/重置按钮；单选面板点击即生效。
 * 面板内容在 ElTooltip 内部受控渲染，避免每列再维护一层 popper。
 */
export function TableFilterPanel<T extends DefaultRow>({
  column,
  values,
  onConfirm,
}: {
  column: TableColumnCtx<T>;
  values: string[];
  onConfirm: (values: string[]) => void;
}) {
  // 草稿跟着外部值走：外部数组换了引用就丢弃本地草稿，避免 effect 里同步 state
  const [draftState, setDraftState] = useState<{ source: string[]; value: string[] }>({
    source: values,
    value: values,
  });
  const draft = draftState.source === values ? draftState.value : values;
  const setDraft = (next: string[]) =>
    setDraftState({ source: values, value: next });
  const [panelVisible, setPanelVisible] = useState(false);
  const filters = column.filters ?? [];
  const multiple = column.filterMultiple !== false;
  const active = values.length > 0;

  const confirmAndClose = (next: string[]) => {
    onConfirm(next);
    setPanelVisible(false);
  };

  const classes = ["el-table-filter", column.filterClassName]
    .filter(Boolean)
    .join(" ");

  const content = multiple ? (
    <div className="el-table-filter__multiple" tabIndex={-1}>
      <div className="el-table-filter__content">
        <ElCheckboxGroup
          className="el-table-filter__checkbox-group"
          value={draft}
          onChange={(next) => setDraft(next.map(String))}
        >
          {filters.map((filter) => (
            <ElCheckbox key={filter.value} value={filter.value}>
              {filter.text}
            </ElCheckbox>
          ))}
        </ElCheckboxGroup>
      </div>
      <div className="el-table-filter__bottom">
        <button
          type="button"
          className={draft.length === 0 ? "is-disabled" : undefined}
          disabled={draft.length === 0}
          onClick={() => confirmAndClose(draft)}
        >
          {TABLE_LOCALE.confirmFilter}
        </button>
        <button type="button" onClick={() => confirmAndClose([])}>
          {TABLE_LOCALE.resetFilter}
        </button>
      </div>
    </div>
  ) : (
    <SingleFilterList
      filters={filters}
      value={values[0]}
      onSelect={(value) =>
        confirmAndClose(value === undefined ? [] : [value])
      }
    />
  );

  return (
    <ElTooltip
      placement={(column.filterPlacement || "bottom-start") as PopperPlacement}
      showArrow={false}
      trigger="click"
      visible={panelVisible}
      onVisibleChange={setPanelVisible}
      role="dialog"
      effect="light"
      pure
      persistent
      offset={0}
      popperClass={classes}
      content={content}
    >
      <button
        type="button"
        className="el-table__column-filter-trigger"
        aria-label={`${TABLE_LOCALE.filterLabel}${column.label || ""}`}
      >
        <ElIcon>{active ? <ArrowUp /> : <ArrowDown />}</ElIcon>
      </button>
    </ElTooltip>
  );
}

/** 单选筛选列表，对应官方 `ul.el-table-filter__list`。 */
function SingleFilterList({
  filters,
  value,
  onSelect,
}: {
  filters: NonNullable<TableColumnCtx["filters"]>;
  value?: string;
  onSelect: (value?: string) => void;
}) {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const items: Array<{ text: string; value?: string }> = [
    { text: TABLE_LOCALE.clearFilter, value: undefined },
    ...filters,
  ];
  const checkedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );

  const focusItem = (index: number) => {
    const next = (index + items.length) % items.length;
    itemRefs.current[next]?.focus();
  };

  return (
    <ul className="el-table-filter__list" role="radiogroup" tabIndex={-1}>
      {items.map((item, index) => (
        <li
          key={item.value ?? "__clear__"}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          role="radio"
          aria-checked={item.value === value}
          tabIndex={index === checkedIndex ? 0 : -1}
          className={[
            "el-table-filter__list-item",
            item.value === value ? "is-active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onSelect(item.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              focusItem(index + 1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              focusItem(index - 1);
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(item.value);
            }
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}
