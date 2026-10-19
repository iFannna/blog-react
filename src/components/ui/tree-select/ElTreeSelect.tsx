"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from "react";
import { ElTree } from "../tree";
import {
  escapeStringRegexp,
  isValidArray,
  isValidValue,
  toValidArray,
  treeEach,
  treeFind,
} from "./utils";
import { ElScrollbar } from "../scrollbar";
import { ElTag } from "../tag";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, CircleClose } from "../icons";
import { useEmptyValues, useTranslator } from "../config-provider/context";
import { useFormDisabled, useFormSize } from "../form/use-form";
import type { ValueOnClear } from "../config-provider/types";
import type { ComponentSize } from "../button/types";
import type {
  FilterNodeMethodFunction,
  FilterValue,
  RenderContentFunction,
  TreeData,
  TreeInstance,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
  TreeProps,
} from "../tree";

/** 单值形态。 */
export type TreeSelectSingleValue = string | number;
/** 单选为单值，多选为数组。 */
export type TreeSelectValue = TreeSelectSingleValue | TreeSelectSingleValue[];

/** 对应官方 CacheOption：懒加载节点的缓存，用于取未加载节点的 label。 */
export interface CacheOption {
  value: string | number | boolean | object;
  label?: ReactNode;
  disabled?: boolean;
}

export interface TreeSelectProps extends TreeProps {
  /** 选中值，单选为单值、多选为数组（对应官方 v-model） */
  value?: TreeSelectValue;
  /** 选中值变化 */
  onChange?: (value: TreeSelectValue | undefined) => void;
  /** 清空时触发 */
  onClear?: () => void;
  /** 多选移除标签时触发，参数为该标签的值 */
  onRemoveTag?: (value: TreeSelectSingleValue) => void;
  /** 输入框聚焦，对应官方 select 的 focus */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** 输入框失焦，对应官方 select 的 blur */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** 下拉是否展开，传入即为受控 */
  visible?: boolean;
  /** 下拉展开态变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 是否多选 */
  multiple?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 是否可筛选 */
  filterable?: boolean;
  /** 是否禁用，对应官方 ElSelect 的 disabled */
  disabled?: boolean;
  /** 占位文本 */
  placeholder?: string;
  /** 尺寸 */
  size?: ComponentSize;
  /** 取值的字段名，对应官方 value-key */
  valueKey?: string;
  /** 懒加载节点的缓存数据 */
  cacheData?: CacheOption[];
  /** 自定义筛选方法，对应官方 filter-method，命中时由调用方重建 data */
  filterMethod?: (keyword: string) => void;
  /** 远程筛选方法，对应官方 remote-method */
  remoteMethod?: (keyword: string) => void;
  /** 空值集合，对应官方 empty-values，缺省取全局配置 */
  emptyValues?: unknown[];
  /** 清空时返回的值，对应官方 value-on-clear，缺省取全局配置 */
  valueOnClear?: ValueOnClear;
  /** 下拉浮层的额外类名，对应官方 popper-class */
  popperClass?: string;
  className?: string;
  style?: CSSProperties;
}

/** 官方 useNamespace('tree-select') 的 e('popper')。 */
const TREE_SELECT_POPPER_CLASS = "el-tree-select__popper";

/** 归一化键值：统一按字符串比较，避免 number / string 键混用导致误判。 */
const keyOf = (value: unknown): string => String(value);

/**
 * 对应官方 ElTreeSelect。
 *
 * 官方把 ElSelect 与 ElTree 组合：ElTree 作为 ElSelect 的默认插槽放进下拉，
 * 再把 select 的 cachedOptions / handleOptionSelect 与 tree 的
 * onNodeClick / onCheck 互相接线。本仓的 ElSelect 只实现了单选数据驱动，
 * 不具备 multiple / filterable / 插槽能力，因此这里自行渲染与官方同构的
 * el-select 外壳（wrapper / selection / input / placeholder / suffix），
 * 树部分复用本仓的 ElTree。
 *
 * 关键结构：树节点内容会再包一层 `.el-select-dropdown__item`，
 * 与官方 TreeSelectOption（extends ElOption）一致，否则 theme-chalk 里
 * `.el-tree-select__popper .el-select-dropdown__item` 的
 * flex / height / line-height / is-selected 规则全部失效。
 */
export function ElTreeSelect(props: TreeSelectProps) {
  const {
    value,
    onChange,
    onClear,
    onRemoveTag,
    onFocus,
    onBlur,
    visible,
    onVisibleChange,
    multiple = false,
    clearable = false,
    filterable = false,
    placeholder,
    size,
    valueKey,
    cacheData,
    filterMethod,
    remoteMethod,
    nodeKey,
    showCheckbox = false,
    checkStrictly = false,
    expandOnClickNode = true,
    checkOnClickNode = false,
    disabled,
    lazy,
    load,
    data,
    props: treeOptionProps,
    emptyText,
    className,
    style,
    popperClass,
    renderContent,
    children: renderNodeContent,
    onReady,
    onCheck,
    onNodeClick,
    onNodeExpand,
    emptyValues,
    valueOnClear,
    ...restTreeProps
  } = props;

  const t = useTranslator();
  const { valueOnClear: resolvedValueOnClear, isEmptyValue } = useEmptyValues({
    emptyValues,
    valueOnClear,
  });

  const selectDisabled = useFormDisabled(disabled);
  const selectSize = useFormSize(size);

  const resolvedPlaceholder = placeholder ?? t("el.select.placeholder");
  const resolvedEmptyText = emptyText ?? t("el.select.noData");

  const [internalOpen, setInternalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tree, setTree] = useState<TreeInstance | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // combobox 必须关联弹层；官方 select 也有同样的 aria-controls 关系
  const listboxId = useId();

  const isOpenControlled = visible !== undefined;
  const open = isOpenControlled ? Boolean(visible) : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setInternalOpen(next);
      if (next !== open) onVisibleChange?.(next);
      // 官方在收起时清空输入框，再次展开按空关键词重新过滤
      if (!next) setInputValue("");
    },
    [isOpenControlled, onVisibleChange, open],
  );

  // 值取值字段：官方 key = nodeKey || valueKey || 'value'
  const valuePropName = nodeKey || valueKey || "value";

  // 对应官方 propsMap：value/label/children/disabled/isLeaf 与用户 props 合并
  const propsMap = useMemo(() => {
    const userProps = (treeOptionProps ?? {}) as TreeOptionProps & {
      value?: string;
    };
    return {
      value: userProps.value ?? valuePropName,
      label: userProps.label ?? "label",
      children: userProps.children ?? "children",
      disabled: userProps.disabled ?? "disabled",
      isLeaf: userProps.isLeaf ?? "isLeaf",
    };
  }, [treeOptionProps, valuePropName]);

  /**
   * 对应官方 getNodeValByProp。
   *
   * 官方把树 Node 实例作为函数式取值器的第二个参数；React 侧节点尚未建好时
   * 允许为空，仅按 data 取值的函数行为一致。
   */
  const getByProp = useCallback(
    (
      prop: "value" | "label" | "children" | "disabled" | "isLeaf",
      item: TreeNodeData,
    ): unknown => {
      const config = propsMap[prop];
      if (typeof config === "function") {
        return (config as (data: TreeNodeData) => unknown)(item);
      }
      return item[config as string];
    },
    [propsMap],
  );

  /** ElTree 只认 children/label/disabled/isLeaf/class 四项，其余原样透传。 */
  const treeOptionPropsForTree = useMemo<TreeOptionProps>(
    () => ({
      ...treeOptionProps,
      label: propsMap.label as TreeOptionProps["label"],
      children: propsMap.children as string,
      disabled: propsMap.disabled as TreeOptionProps["disabled"],
      isLeaf: propsMap.isLeaf as TreeOptionProps["isLeaf"],
    }),
    [treeOptionProps, propsMap],
  );

  // 默认空数组也 memo：否则每次渲染都是新引用，会把下面依赖它的 memo 与树的重建全部打断
  const treeData = useMemo(() => (data ?? []) as TreeData, [data]);
  const getChildren = useCallback(
    (item: TreeNodeData) => getByProp("children", item) as TreeNodeData[],
    [getByProp],
  );

  /**
   * 值 -> 显示文本的映射。
   *
   * 官方从两处取 label：渲染出的 ElOption 注册表，以及 renderAfterExpand=false /
   * lazy 时的 cacheOptions（data + cacheData 展平）。这里统一用展平 data + cacheData，
   * 是官方两处的超集，折叠节点与未加载节点都能显示文本。
   */
  const labelMap = useMemo(() => {
    const map = new Map<string, ReactNode>();
    treeEach(
      treeData,
      (item) => {
        const itemValue = getByProp("value", item);
        if (isValidValue(itemValue)) {
          map.set(keyOf(itemValue), getByProp("label", item) as ReactNode);
        }
      },
      getChildren,
    );
    (cacheData ?? []).forEach((item) => {
      if (isValidValue(item.value)) map.set(keyOf(item.value), item.label);
    });
    return map;
  }, [treeData, cacheData, getByProp, getChildren]);

  const valueArray = useMemo(() => toValidArray(value), [value]);
  const hasModelValue = multiple
    ? valueArray.length > 0
    : !isEmptyValue(value ?? undefined);

  const getLabel = useCallback(
    (val: unknown): ReactNode => {
      const label = labelMap.get(keyOf(val));
      return label === undefined ? (val as ReactNode) : label;
    },
    [labelMap],
  );

  /** 选定值所在父链的键，用于打开时展开到选中项，对应官方 defaultExpandedParentKeys。 */
  const defaultExpandedParentKeys = useMemo(() => {
    const keys: TreeKey[] = [];
    valueArray.forEach((entry) => {
      const found = treeFind(
        treeData,
        (item) => keyOf(getByProp("value", item)) === keyOf(entry),
        getChildren,
        (item, _index, _array, parent) =>
          parent ? getByProp("value", parent) : undefined,
      );
      if (isValidValue(found)) keys.push(found as TreeKey);
    });
    return keys;
  }, [valueArray, treeData, getByProp, getChildren]);

  const mergedExpandedKeys = useMemo(
    () =>
      props.defaultExpandedKeys
        ? [...props.defaultExpandedKeys, ...defaultExpandedParentKeys]
        : defaultExpandedParentKeys,
    [props.defaultExpandedKeys, defaultExpandedParentKeys],
  );

  /** 对应官方 filterNodeMethod 默认实现：无关键词全通过，否则按 label 正则匹配。 */
  const effectiveFilterNodeMethod = useMemo<FilterNodeMethodFunction>(
    () =>
      props.filterNodeMethod ??
      ((filterValue: FilterValue, item: TreeNodeData) => {
        if (!filterValue) return true;
        const regexp = new RegExp(escapeStringRegexp(String(filterValue)), "i");
        return regexp.test(String(getByProp("label", item) ?? ""));
      }),
    [props.filterNodeMethod, getByProp],
  );

  /** 节点可见计数，等价官方 filteredOptionsCount：自身命中或存在可见子节点。 */
  const visibleNodeCount = useMemo(() => {
    let count = 0;
    const walk = (items: TreeNodeData[]): boolean => {
      let anyVisible = false;
      items.forEach((item) => {
        const childVisible = walk(
          (getByProp("children", item) as TreeNodeData[]) ?? [],
        );
        // 自定义 filter-node-method 会用到第三个 node 参数；懒加载未创建的节点允许为空
        const node = tree?.getNode(item) ?? undefined;
        const selfVisible = Boolean(
          effectiveFilterNodeMethod(inputValue, item, node as never),
        );
        if (selfVisible || childVisible) {
          count += 1;
          anyVisible = true;
        }
      });
      return anyVisible;
    };
    walk(treeData);
    return count;
  }, [treeData, inputValue, effectiveFilterNodeMethod, getByProp, tree]);

  // 对应官方 watch(() => props.data) + filterable：数据变化后按当前关键词重新过滤
  useEffect(() => {
    if (!filterable || !tree) return;
    tree.filter(inputValue);
    // 数据引用变化才重跑，关键词变化由下面的 effect 负责
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, filterable, tree]);

  // 关键词变化即过滤；自定义 filterMethod / remoteMethod 交给调用方重建 data
  useEffect(() => {
    if (!filterable || !tree) return;
    if (filterMethod || remoteMethod) return;
    tree.filter(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, filterable, tree]);

  // 值是数组时把勾选态同步进树，对应官方 watch([modelValue, tree]) + showCheckbox
  useEffect(() => {
    if (!showCheckbox || !tree) return;
    const keys = toValidArray(value) as TreeKey[];
    const current = tree.getCheckedKeys();
    const same =
      current.length === keys.length &&
      current.every((key) => keys.some((k) => keyOf(k) === keyOf(key)));
    if (!same) tree.setCheckedKeys(keys);
  }, [value, tree, showCheckbox]);

  // 点击外部收起并失焦，对应官方 v-click-outside
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, setOpen]);

  // ESC 先清关键词再收起；Enter / Space 切换展开，对应官方 handleEsc / selectOption
  useEffect(() => {
    if (!open) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (inputValue) setInputValue("");
        else setOpen(false);
      }
      // 可筛选时空格是输入内容，不能拿来切换下拉
      if (event.key === " " && filterable) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open, inputValue, setOpen, filterable]);

  const emitChange = useCallback(
    (next: TreeSelectValue | undefined) => {
      onChange?.(next);
    },
    [onChange],
  );

  /** 对应官方 select 的 handleOptionSelect：多选切换、单选替换并收起。 */
  const handleOptionSelect = useCallback(
    (item: TreeNodeData) => {
      const itemValue = getByProp("value", item) as TreeSelectSingleValue;
      if (multiple) {
        const list = (
          Array.isArray(value) ? value : []
        ).slice() as TreeSelectSingleValue[];
        const index = list.findIndex((entry) => keyOf(entry) === keyOf(itemValue));
        if (index > -1) list.splice(index, 1);
        else list.push(itemValue);
        emitChange(list);
      } else {
        emitChange(itemValue);
        setOpen(false);
      }
    },
    [getByProp, multiple, value, emitChange, setOpen],
  );

  /** 只取叶子节点的勾选键，对应官方 getChildCheckedKeys。 */
  const getChildCheckedKeys = useCallback((): TreeKey[] => {
    if (!tree) return [];
    return tree.getCheckedKeys().filter((checkedKey) => {
      const node = tree.getNode(checkedKey);
      return Boolean(node) && node!.childNodes.length === 0;
    });
  }, [tree]);

  /**
   * 对应官方 onCheck：把树的勾选态映射回 modelValue。
   *
   * 数据里不存在的键（懒加载未展开、或 cacheData 中的值）作为 cachedKeys 保留，
   * 避免勾选操作把它们丢掉。
   */
  const handleCheck = useCallback<TreeCheckHandler>(
    (item, info) => {
      if (!showCheckbox) return;

      const dataValue = getByProp("value", item);
      const dataMap: Record<string, boolean> = {};
      treeEach(
        treeData,
        (entry) => {
          const entryValue = getByProp("value", entry);
          if (isValidValue(entryValue)) dataMap[keyOf(entryValue)] = true;
        },
        getChildren,
      );

      const cachedKeys = multiple
        ? (valueArray.filter(
            (entry) =>
              !(keyOf(entry) in dataMap) &&
              !info.checkedKeys.some((key) => keyOf(key) === keyOf(entry)),
          ) as TreeSelectSingleValue[])
        : [];
      const checkedKeys: TreeSelectSingleValue[] = [
        ...cachedKeys,
        ...(info.checkedKeys as TreeSelectSingleValue[]),
      ];

      let nextValue: TreeSelectValue | undefined;
      if (checkStrictly) {
        nextValue = multiple
          ? checkedKeys
          : checkedKeys.some((key) => keyOf(key) === keyOf(dataValue))
            ? (dataValue as TreeSelectSingleValue)
            : undefined;
      } else if (multiple) {
        nextValue = [
          ...(cachedKeys as TreeSelectSingleValue[]),
          ...(getChildCheckedKeys() as TreeSelectSingleValue[]),
        ];
      } else {
        // 单选非严格模式：勾选父节点时落到第一个可用叶子
        const firstLeaf = treeFind(
          [item],
          (entry) =>
            !isValidArray(getByProp("children", entry)) &&
            !getByProp("disabled", entry),
          getChildren,
        ) as TreeNodeData | undefined;
        const firstLeafKey = firstLeaf ? getByProp("value", firstLeaf) : undefined;
        const hasCheckedChild =
          isValidValue(value) &&
          Boolean(
            treeFind(
              [item],
              (entry) => keyOf(getByProp("value", entry)) === keyOf(value),
              getChildren,
            ),
          );
        nextValue =
          keyOf(firstLeafKey) === keyOf(value) || hasCheckedChild
            ? undefined
            : (firstLeafKey as TreeSelectSingleValue | undefined);
      }

      emitChange(nextValue);

      // 勾选联动下一轮才算完，与官方 nextTick 后回写勾选态一致
      queueMicrotask(() => {
        tree?.setCheckedKeys(toValidArray(nextValue) as TreeKey[]);
        onCheck?.(item, {
          checkedKeys: tree?.getCheckedKeys() ?? [],
          checkedNodes: tree?.getCheckedNodes() ?? [],
          halfCheckedKeys: tree?.getHalfCheckedKeys() ?? [],
          halfCheckedNodes: tree?.getHalfCheckedNodes() ?? [],
        });
      });

      inputRef.current?.focus();
    },
    [
      showCheckbox,
      getByProp,
      treeData,
      getChildren,
      multiple,
      valueArray,
      checkStrictly,
      value,
      getChildCheckedKeys,
      emitChange,
      tree,
      onCheck,
    ],
  );

  /**
   * 对应官方 onNodeClick。
   *
   * 官方在 ElTree 已按自身 expandOnClickNode 处理展开之后，又在 onNodeClick 里
   * 调节点实例的 handleExpandIconClick；由于节点本地 expanded 要 nextTick 才同步，
   * 这一次调用实际是幂等的。React 没有这层延迟，两次同步调用会互相抵消，
   * 因此把展开统一放到本回调里、并让 ElTree 的内建展开关闭，行为与官方等价。
   */
  const handleNodeClick = useCallback<TreeClickHandler>(
    (item, node, event) => {
      onNodeClick?.(item, node, event);

      if (showCheckbox && checkOnClickNode) return;

      if (!showCheckbox && (checkStrictly || node.isLeaf)) {
        if (!getByProp("disabled", item)) handleOptionSelect(item);
        return;
      }

      if (expandOnClickNode && !node.isLeaf) {
        if (node.expanded) node.collapse();
        else node.expand();
      }
    },
    [
      onNodeClick,
      showCheckbox,
      checkOnClickNode,
      checkStrictly,
      getByProp,
      handleOptionSelect,
      expandOnClickNode,
    ],
  );

  /**
   * 懒加载 + 多选时，展开节点后补算子叶子的勾选键，对应官方 onNodeExpand。
   *
   * 用户回调与自身逻辑经 ref 转稳定引用：ElTree 侧以引用是否变化来决定是否重建，
   * 直接内联会随每次渲染新建、把整棵树打断。
   */
  const onNodeExpandPropRef = useRef(onNodeExpand);

  const handleNodeExpandLogic = useCallback(
    (item: TreeNodeData, node: Parameters<TreeExpandHandler>[1]) => {
      if (!(!checkStrictly && lazy && multiple && node.checked)) return;

      const dataMap: Record<string, boolean> = {};
      treeEach(
        treeData,
        (entry) => {
          dataMap[keyOf(getByProp("value", entry))] = true;
        },
        getChildren,
      );
      const uncachedCheckedKeys = tree?.getCheckedKeys() ?? [];
      const cachedKeys = valueArray.filter(
        (entry) =>
          !(keyOf(entry) in dataMap) &&
          !uncachedCheckedKeys.some((key) => keyOf(key) === keyOf(entry)),
      );
      emitChange([
        ...(cachedKeys as TreeSelectSingleValue[]),
        ...(getChildCheckedKeys() as TreeSelectSingleValue[]),
      ]);
    },
    [
      checkStrictly,
      lazy,
      multiple,
      treeData,
      getByProp,
      getChildren,
      tree,
      valueArray,
      emitChange,
      getChildCheckedKeys,
    ],
  );

  const handleNodeExpandRef = useRef(handleNodeExpandLogic);

  useEffect(() => {
    onNodeExpandPropRef.current = onNodeExpand;
    handleNodeExpandRef.current = handleNodeExpandLogic;
  }, [onNodeExpand, handleNodeExpandLogic]);

  const onNodeExpandStable = useCallback<TreeExpandHandler>((item, node) => {
    onNodeExpandPropRef.current?.(item, node);
    handleNodeExpandRef.current(item, node);
  }, []);

  /**
   * 对应官方 renderContent 包装的 TreeSelectOption：
   * 节点内容外层套 `.el-select-dropdown__item`，主题样式才会生效。
   */
  const renderNode = useCallback<RenderContentFunction>(
    (context) => {
      const item = context.data;
      const itemValue = getByProp("value", item);
      const isDisabled = Boolean(getByProp("disabled", item));
      const isSelected = valueArray.some(
        (entry) => keyOf(entry) === keyOf(itemValue),
      );

      const inner = renderContent
        ? renderContent(context)
        : renderNodeContent
          ? renderNodeContent(context)
          : (getByProp("label", item) as ReactNode);

      return (
        <li
          className={[
            "el-select-dropdown__item",
            isDisabled && "is-disabled",
            isSelected && "is-selected",
          ]
            .filter(Boolean)
            .join(" ")}
          role="option"
          aria-disabled={isDisabled || undefined}
          aria-selected={isSelected}
        >
          {inner}
        </li>
      );
    },
    [getByProp, valueArray, renderContent, renderNodeContent],
  );

  const rootClasses = [
    "el-select",
    selectSize && `el-select--${selectSize}`,
    open && "is-open",
    selectDisabled && "is-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 官方 showClearBtn：clearable && 有值 && (聚焦或悬停)
  const showClear =
    clearable && !selectDisabled && hasModelValue && (isFocused || isHovering);

  // 官方 shouldShowPlaceholder
  const showPlaceholder = multiple
    ? valueArray.length === 0 && !inputValue
    : filterable
      ? !inputValue
      : true;

  const placeholderTransparent = multiple
    ? true
    : !hasModelValue || (open && !inputValue);

  const inputHidden =
    !filterable || selectDisabled || (multiple && !inputValue && !isFocused);

  const popperClasses = [
    "el-select__popper",
    TREE_SELECT_POPPER_CLASS,
    "el-popper",
    "is-light",
    "is-pure",
    popperClass,
  ]
    .filter(Boolean)
    .join(" ");

  const dropdownClasses = ["el-select-dropdown", multiple && "is-multiple"]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={rootRef}
      className={rootClasses}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={[
          "el-select__wrapper",
          isFocused && "is-focused",
          isHovering && !isFocused && "is-hovering",
          filterable && "is-filterable",
          selectDisabled && "is-disabled",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => {
          if (selectDisabled) return;
          setOpen(!open);
          inputRef.current?.focus();
        }}
      >
        <div
          className={[
            "el-select__selection",
            multiple && valueArray.length > 0 && "is-near",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {multiple &&
            valueArray.map((entry) => (
              <div className="el-select__selected-item" key={keyOf(entry)}>
                <ElTag
                  type="info"
                  effect="light"
                  // 官方 collapseTagSize：small 尺寸下标签用 small，否则 default
                  size={selectSize === "small" ? "small" : "default"}
                  disableTransitions
                  closable={!selectDisabled}
                  onClose={() => {
                    if (selectDisabled) return;
                    emitChange(
                      valueArray
                        .filter((item) => keyOf(item) !== keyOf(entry))
                        .map((item) => item as TreeSelectSingleValue),
                    );
                    onRemoveTag?.(entry as TreeSelectSingleValue);
                  }}
                >
                  <span className="el-select__tags-text">
                    {getLabel(entry)}
                  </span>
                </ElTag>
              </div>
            ))}

          <div
            className={[
              "el-select__selected-item",
              "el-select__input-wrapper",
              inputHidden && "is-hidden",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              ref={inputRef}
              className="el-select__input"
              value={inputValue}
              type="text"
              role="combobox"
              autoComplete="off"
              spellCheck={false}
              readOnly={!filterable}
              disabled={selectDisabled}
              tabIndex={selectDisabled ? undefined : 0}
              aria-expanded={open}
              aria-controls={listboxId}
              aria-haspopup="listbox"
              onFocus={(event) => {
                setIsFocused(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                setIsFocused(false);
                onBlur?.(event);
              }}
              onChange={(event) => {
                const next = event.target.value;
                setInputValue(next);
                if (!open) setOpen(true);
                if (filterMethod) filterMethod(next);
                else if (remoteMethod) remoteMethod(next);
              }}
            />
          </div>

          {showPlaceholder && (
            <div
              className={[
                "el-select__selected-item",
                "el-select__placeholder",
                placeholderTransparent && "is-transparent",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span>
                {!multiple && hasModelValue
                  ? getLabel(value)
                  : resolvedPlaceholder}
              </span>
            </div>
          )}
        </div>

        <div className="el-select__suffix">
          {showClear ? (
            <ElIcon
              className="el-select__caret el-select__icon el-select__clear"
              onClick={(event) => {
                event.stopPropagation();
                emitChange(
                  multiple
                    ? []
                    : (resolvedValueOnClear as TreeSelectValue | undefined),
                );
                onClear?.();
                setOpen(false);
              }}
            >
              <CircleClose />
            </ElIcon>
          ) : (
            <ElIcon
              className={[
                "el-select__caret",
                "el-select__icon",
                open && "is-reverse",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <ArrowDown />
            </ElIcon>
          )}
        </div>
      </div>

      <div
        className={popperClasses}
        // 未走 Popper，用绝对定位跟随触发器；收起时保留挂载以维持树的展开与勾选态
        style={{
          position: "absolute",
          top: "calc(100% + 12px)",
          left: 0,
          width: "100%",
          zIndex: 2001,
          display: open ? undefined : "none",
        }}
      >
        <div className={dropdownClasses}>
          <ElScrollbar
            id={listboxId}
            tag="ul"
            wrapClass="el-select-dropdown__wrap"
            viewClass="el-select-dropdown__list"
            role="listbox"
            ariaOrientation="vertical"
          >
            <ElTree
              {...restTreeProps}
              props={treeOptionPropsForTree}
              data={treeData}
              // 官方 nodeKey = nodeKey || valueKey || 'value'，value-key 也参与节点寻址
              nodeKey={valuePropName}
              showCheckbox={showCheckbox}
              checkStrictly={checkStrictly}
              checkOnClickNode={checkOnClickNode}
              // 展开/收起统一由 handleNodeClick 负责，避免与 ElTree 内建逻辑重复触发
              expandOnClickNode={false}
              lazy={lazy}
              load={load}
              defaultExpandedKeys={mergedExpandedKeys}
              renderContent={renderNode}
              filterNodeMethod={effectiveFilterNodeMethod}
              // 空态统一由下拉层承担（官方 tree-select 场景下树的 empty-block 恒不渲染）
              onNodeClick={handleNodeClick}
              onCheck={handleCheck}
              onNodeExpand={onNodeExpandStable}
              onReady={(instance) => {
                setTree(instance);
                onReady?.(instance);
              }}
            />
          </ElScrollbar>

          {visibleNodeCount === 0 && (
            <div className="el-select-dropdown__empty">
              <span>{resolvedEmptyText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** 树节点的 click 回调类型，取自 ElTree 的 props。 */
type TreeClickHandler = NonNullable<TreeProps["onNodeClick"]>;
/** 树节点的 check 回调类型。 */
type TreeCheckHandler = NonNullable<TreeProps["onCheck"]>;
/** 树节点的 expand 回调类型。 */
type TreeExpandHandler = NonNullable<TreeProps["onNodeExpand"]>;
