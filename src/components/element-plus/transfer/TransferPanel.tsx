"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ElCheckbox } from "../checkbox/ElCheckbox";
import { ElCheckboxGroup } from "../checkbox/ElCheckboxGroup";
import { ElInput } from "../input/ElInput";
import { Search } from "../generated/icons";
import { useTranslator } from "../config-provider/context";
import { TransferVirtualList } from "./VirtualList";
import { DEFAULT_PROPS_ALIAS, keysSignature } from "./types";
import type {
  TransferDataItem,
  TransferFormat,
  TransferKey,
  TransferPropsAlias,
} from "./types";
import type { CheckboxValueType } from "../checkbox/context";

/** 对应官方 defineExpose({ query })：query 可读可写，setQuery 供内部复用。 */
export interface TransferPanelHandle {
  query: string;
  setQuery: (query: string) => void;
}

export interface TransferPanelProps {
  data: TransferDataItem[];
  /** 数据项的渲染结果，对应官方 option-render 的返回值 */
  optionRender?: (option: TransferDataItem) => ReactNode;
  placeholder?: string;
  title?: string;
  filterable?: boolean;
  format?: TransferFormat;
  filterMethod?: (query: string, item: TransferDataItem) => boolean;
  defaultChecked?: TransferKey[];
  /** 字段别名，对应官方 props */
  optionProps?: TransferPropsAlias;
  virtualScroll?: boolean;
  itemSize?: number;
  /**
   * 勾选集合变化。第二参仅在「用户勾选」时下发，
   * 对应官方 checked-change 事件对 checkChangeByUser 的区分。
   */
  onCheckedChange: (checked: TransferKey[], movedKeys?: TransferKey[]) => void;
  /** 空态内容，对应官方 empty 插槽 */
  emptyNode?: ReactNode;
  /** 底部内容，对应官方默认插槽 */
  footer?: ReactNode;
  /** 父级持有的面板实例，对应官方 defineExpose 的 query */
  instanceRef?: React.RefObject<TransferPanelHandle | null>;
}

/**
 * 对应官方 ElTransferPanel。
 *
 * 勾选集合与查询词是面板的局部状态（官方即 panelState），
 * 变化后经 onCheckedChange 上报给父级 Transfer。
 */
export function TransferPanel({
  data,
  optionRender,
  placeholder,
  title,
  filterable = false,
  format = {},
  filterMethod,
  defaultChecked = [],
  optionProps,
  virtualScroll = false,
  itemSize = 30,
  onCheckedChange,
  emptyNode,
  footer,
  instanceRef,
}: TransferPanelProps) {
  const alias = { ...DEFAULT_PROPS_ALIAS, ...optionProps };
  const t = useTranslator();

  const keyOf = (item: TransferDataItem): TransferKey => item[alias.key];
  const isDisabledItem = (item: TransferDataItem) => !!item[alias.disabled];

  const filter = (item: TransferDataItem, query: string) => {
    if (filterMethod) return filterMethod(query, item);
    const label = String(item[alias.label] || item[alias.key]);
    return label.toLowerCase().includes(query.toLowerCase());
  };

  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQueryState] = useState("");
  // handle 的 getter 在首次渲染后固定，需要 ref 才能读到最新查询词；
  // query 只会经由 setQuery 更新，两者始终同步。
  const queryRef = useRef(query);
  const setQuery = useCallback((next: string) => {
    queryRef.current = next;
    setQueryState(next);
  }, []);
  const [checked, setChecked] = useState<TransferKey[]>(() =>
    // 官方 defaultChecked 的 watch 是 immediate，初始即按可勾选数据取交集
    defaultChecked.filter((key) =>
      data.some((item) => keyOf(item) === key && !isDisabledItem(item)),
    ),
  );

  const filteredData = data.filter((item) => filter(item, query));
  const checkableData = filteredData.filter((item) => !isDisabledItem(item));

  const checkedLength = checked.length;
  const dataLength = data.length;
  const checkableKeys = checkableData.map(keyOf);
  const allChecked =
    checkableKeys.length > 0 && checkableKeys.every((key) => checked.includes(key));
  const isIndeterminate = checkedLength > 0 && checkedLength < checkableData.length;

  const checkedSummary = (() => {
    const { noChecked, hasChecked } = format;
    if (noChecked && hasChecked) {
      return checkedLength > 0
        ? hasChecked
            .replace(/\$\{checked\}/g, String(checkedLength))
            .replace(/\$\{total\}/g, String(dataLength))
        : noChecked.replace(/\$\{total\}/g, String(dataLength));
    }
    return `${checkedLength}/${dataLength}`;
  })();

  const hasNoMatch = query !== "" && filteredData.length === 0;
  const hasFooter = footer !== undefined && footer !== null && footer !== false;

  /**
   * 官方用 checkChangeByUser 区分「用户勾选」与「程序回写」：
   * 程序回写时只上报勾选值，不下发 movedKeys，父级因此不触发 check-change 事件。
   */
  const checkChangeByUser = useRef(true);

  /** 对应官方 watch(panelState.checked)：比较出本次移动的 key 集合。 */
  const prevCheckedRef = useRef<TransferKey[] | null>(null);
  useEffect(() => {
    const prev = prevCheckedRef.current;

    // 官方 immediate watch 把 defaultChecked 写进 checked 时，会因值变化触发
    // checked watch，把初始勾选同步给父级；React 的初始 state 不产生变化，
    // 因此这里补一次上报（否则 moved 按钮初始为禁用）。
    if (prev === null) {
      prevCheckedRef.current = checked;
      if (checked.length > 0) onCheckedChange(checked);
      return;
    }
    // 父级重渲染会让本 effect 重跑，勾选内容没变时不能误报；
    // 程序回写若没有带来实际变化，也要把 checkChangeByUser 复位，否则会吞掉下一次 movedKeys
    if (keysSignature(prev) === keysSignature(checked)) {
      checkChangeByUser.current = true;
      return;
    }

    prevCheckedRef.current = checked;

    if (checkChangeByUser.current) {
      const movedKeys = checked
        .concat(prev)
        .filter((value) => !checked.includes(value) || !prev.includes(value));
      onCheckedChange(checked, movedKeys);
    } else {
      onCheckedChange(checked);
      checkChangeByUser.current = true;
    }
  }, [checked, onCheckedChange]);

  // 官方 watch(defaultChecked, ..., { immediate: true })：内容真正变化时才回写
  const defaultCheckedSignature = keysSignature(defaultChecked);
  const prevDefaultSignature = useRef(defaultCheckedSignature);
  useEffect(() => {
    if (prevDefaultSignature.current === defaultCheckedSignature) return;
    prevDefaultSignature.current = defaultCheckedSignature;

    checkChangeByUser.current = false;
    // 官方按 checkableData（已按当前查询词过滤并剔除禁用项）取交集
    const checkableKeys = filteredData
      .filter((item) => !isDisabledItem(item))
      .map(keyOf);
    setChecked(defaultChecked.filter((key) => checkableKeys.includes(key)));
    // keyOf / isDisabledItem 每次渲染都是新函数，只以签名驱动同步
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCheckedSignature]);

  // 官方 watch(data)：过滤后仍存在的勾选项才保留
  const dataSignature = data.map(keyOf).join("|");
  const prevDataSignature = useRef(dataSignature);
  useEffect(() => {
    if (prevDataSignature.current === dataSignature) return;
    prevDataSignature.current = dataSignature;

    const filteredKeys = data.filter((item) => filter(item, query)).map(keyOf);
    checkChangeByUser.current = false;
    setChecked((prev) => prev.filter((key) => filteredKeys.includes(key)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSignature]);

  useEffect(() => {
    if (!instanceRef) return;
    instanceRef.current = {
      get query() {
        return queryRef.current;
      },
      set query(next: string) {
        setQuery(next);
      },
      setQuery,
    };
  }, [instanceRef, setQuery]);

  // 对应官方 watch(panelState.query)：虚拟列表在筛选词变化后回到顶部
  useEffect(() => {
    if (!virtualScroll) return;
    const el = panelRef.current?.querySelector<HTMLElement>(".el-vl__window");
    if (el) el.scrollTop = 0;
  }, [query, virtualScroll]);

  /** 对应官方 useElementSize(checkboxGroupRef)：量取列表面板高度给虚拟列表。 */
  const [listHeight, setListHeight] = useState(0);
  useEffect(() => {
    if (!virtualScroll) return;

    const el = panelRef.current?.querySelector<HTMLElement>(
      ".el-transfer-panel__list",
    );
    if (!el) return;

    // 官方 useElementSize 默认取 content-box，需要扣掉上下 padding/边框，
    // 否则虚拟列表会多渲染一行。
    const update = () => {
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      setListHeight(
        rect.height -
          parseFloat(cs.paddingTop) -
          parseFloat(cs.paddingBottom) -
          parseFloat(cs.borderTopWidth) -
          parseFloat(cs.borderBottomWidth),
      );
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [virtualScroll]);

  const listHidden = hasNoMatch || data.length === 0;

  const renderCheckbox = (item: TransferDataItem) => (
    <ElCheckbox
      className="el-transfer-panel__item"
      value={keyOf(item)}
      disabled={isDisabledItem(item)}
      label={optionRender?.(item)}
    />
  );

  return (
    <div className="el-transfer-panel" ref={panelRef}>
      <p className="el-transfer-panel__header">
        <ElCheckbox
          checked={allChecked}
          indeterminate={isIndeterminate}
          onCheckedChange={(next) => {
            checkChangeByUser.current = true;
            setChecked(next ? checkableData.map(keyOf) : []);
          }}
        >
          <span className="el-transfer-panel__header-title">{title}</span>
          <span className="el-transfer-panel__header-count">{checkedSummary}</span>
        </ElCheckbox>
      </p>

      <div
        className={["el-transfer-panel__body", hasFooter && "is-with-footer"]
          .filter(Boolean)
          .join(" ")}
      >
        {filterable && (
          <ElInput
            className="el-transfer-panel__filter"
            value={query}
            onChange={setQuery}
            size="default"
            placeholder={placeholder}
            prefixIcon={<Search />}
            clearable
            validateEvent={false}
          />
        )}

        <ElCheckboxGroup
          // 官方把列表类名直接挂在 checkbox-group 根节点上（v-show 也在同一节点）
          className={[
            "el-transfer-panel__list",
            filterable && "is-filterable",
          ]
            .filter(Boolean)
            .join(" ")}
          style={listHidden ? { display: "none" } : undefined}
          value={checked}
          onChange={(value: CheckboxValueType[]) => {
            checkChangeByUser.current = true;
            setChecked(value as TransferKey[]);
          }}
        >
            {virtualScroll ? (
              <TransferVirtualList
                data={filteredData}
                itemSize={itemSize}
                height={listHeight}
                renderItem={(item, index, style) => (
                  <div key={String(keyOf(item))} style={style}>
                    {renderCheckbox(item)}
                  </div>
                )}
              />
            ) : (
              // Fragment 不产生 DOM 节点，勾选项保持为 checkbox-group 的直接子元素
              filteredData.map((item) => (
                <Fragment key={String(keyOf(item))}>
                  {renderCheckbox(item)}
                </Fragment>
              ))
            )}
        </ElCheckboxGroup>

        <div
          className="el-transfer-panel__empty"
          style={listHidden ? undefined : { display: "none" }}
        >
          {emptyNode !== undefined && emptyNode !== null
            ? emptyNode
            : hasNoMatch
              ? t("el.transfer.noMatch")
              : t("el.transfer.noData")}
        </div>
      </div>

      {hasFooter && <p className="el-transfer-panel__footer">{footer}</p>}
    </div>
  );
}
