"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DefaultRow,
  LazyTreeNode,
  Sort,
  TableColumnCtx,
  TableFilter,
  TableProps,
  TableSortOrder,
} from "./context";
import {
  flattenColumns,
  getRowIdentity,
  orderBy,
} from "./utils";

/** 展开后参与渲染的一行，树形数据的层级、展开态都在这里算好。 */
export interface TreeDisplayRow<T extends DefaultRow> {
  row: T;
  index: number;
  level: number;
  expanded: boolean;
  loading: boolean;
  /** 是否不再有子节点（决定缩进后是展开图标还是占位） */
  noLazyChildren: boolean;
  hasChildren: boolean;
}

export interface TableStates<T extends DefaultRow> {
  data: T[];
  columns: TableColumnCtx<T>[];
  /** 顶层列（分组表头时会带 children） */
  originColumnTree: TableColumnCtx<T>[];
  fixedColumns: TableColumnCtx<T>[];
  rightFixedColumns: TableColumnCtx<T>[];
  fixedLeafColumnsLength: number;
  rightFixedLeafColumnsLength: number;
  selection: T[];
  currentRow: T | null;
  sortingColumn: TableColumnCtx<T> | null;
  sortProp: string | null;
  sortOrder: TableSortOrder | null;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  expandKeys: string[];
  /** 过滤 + 排序后的数据 */
  filteredData: T[];
  /** 按展开态拍平的树形数据；非树形时等同于 filteredData */
  visibleRows: TreeDisplayRow<T>[];
  hasTree: boolean;
  filterState: Record<string, string[]>;
  treeExpanded: Record<string, boolean>;
  lazyLoading: Record<string, boolean>;
  indent: number;
}

/**
 * 对应官方 store/watcher.ts 的职责。
 *
 * 官方把状态放在 `ref` + `reactive` 里由 Vue 追踪；React 侧用 useState 持有，
 * 列的注册/注销由 ElTableColumn 通过回调写入 `registerColumn` / `unregisterColumn`。
 */
export function useTableStore<T extends DefaultRow>(props: TableProps<T>) {
  const [originColumns, setOriginColumns] = useState<TableColumnCtx<T>[]>([]);
  const [selection, setSelection] = useState<T[]>([]);
  const [currentRowState, setCurrentRowState] = useState<T | null>(null);
  const [sortingColumn, setSortingColumn] = useState<TableColumnCtx<T> | null>(null);
  const [sortProp, setSortProp] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<TableSortOrder | null>(null);
  // 展开行的 key 集合；无 rowKey 时退化为数据下标
  const [expandKeys, setExpandKeys] = useState<string[]>([]);
  // 筛选状态按列 id 存；列对象上的 filteredValue 是它的外部投影
  const [filterState, setFilterState] = useState<Record<string, string[]>>({});
  // 只记录用户显式改过的展开态；默认展开由 defaultExpandAll / expandRowKeys 推导，
  // 这样数据变化时不必在 effect 里重置整份状态。
  const [treeToggled, setTreeToggled] = useState<Record<string, boolean>>({});
  const [lazyMap, setLazyMap] = useState<Record<string, T[]>>({});
  const [lazyLoading, setLazyLoading] = useState<Record<string, boolean>>({});
  const [lazyLoaded, setLazyLoaded] = useState<Record<string, boolean>>({});

  // 命令式回调（事件处理里）需要读到最新值，用 effect 同步，避免渲染期读写 ref
  const selectionRef = useRef<T[]>(selection);
  const currentRowRef = useRef<T | null>(currentRowState);
  const loadingRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);
  useEffect(() => {
    currentRowRef.current = currentRowState;
  }, [currentRowState]);

  const rowKeyValue = props.rowKey;
  const data = useMemo(() => props.data ?? [], [props.data]);
  const childrenKey = props.treeProps?.children || "children";
  const hasChildrenKey = props.treeProps?.hasChildren || "hasChildren";
  const checkStrictly = !!props.treeProps?.checkStrictly;
  const indent = props.indent ?? 16;

  /**
   * 对应官方 store.updateColumns：把列按「固定左 + 普通 + 固定右」重排，
   * 并把分组表头拍平成叶子列。
   */
  const { columns, fixedColumns, rightFixedColumns, originColumnTree } = useMemo(() => {
    // 先把注册上来的扁平列按 parentId 组装成树，供分组表头使用
    const tree = buildColumnTree(originColumns);

    let fixedCols = tree.filter((column) => column.fixed === "left");
    const rightFixedCols = tree.filter((column) => column.fixed === "right");

    // 选择列若在首位且存在固定列，跟随一起固定到左侧（与官方一致）
    const selectColumn = tree.find((column) => column.type === "selection");
    let selectColFixLeft = false;
    if (
      selectColumn &&
      selectColumn.fixed !== "right" &&
      !fixedCols.includes(selectColumn)
    ) {
      const selectColumnIndex = tree.indexOf(selectColumn);
      if (selectColumnIndex === 0 && fixedCols.length) {
        fixedCols = [selectColumn, ...fixedCols];
        selectColFixLeft = true;
      }
    }

    const notFixedColumns = tree.filter(
      (column) =>
        (selectColFixLeft ? column.type !== "selection" : true) && !column.fixed,
    );

    const fixedLeafColumns = flattenColumns(fixedCols);
    const leafColumns = flattenColumns(notFixedColumns);
    const rightFixedLeafColumns = flattenColumns(rightFixedCols);

    return {
      columns: [...fixedLeafColumns, ...leafColumns, ...rightFixedLeafColumns],
      fixedColumns: fixedCols,
      rightFixedColumns: rightFixedCols,
      originColumnTree: [...fixedCols, ...notFixedColumns, ...rightFixedCols],
    };
  }, [originColumns]);

  // 列的 filteredValue 是受控初始值，未在本地筛选状态里出现时以它为准
  const resolvedFilterState = useMemo(() => {
    const merged = { ...filterState };
    columns.forEach((column) => {
      if (merged[column.id] === undefined && column.filteredValue?.length) {
        merged[column.id] = column.filteredValue;
      }
    });
    return merged;
  }, [columns, filterState]);

  const filteredData = useMemo(() => {
    const activeFilters = Object.entries(resolvedFilterState).filter(
      ([, values]) => values.length > 0,
    );
    if (!activeFilters.length) return data;

    return data.filter((row) =>
      activeFilters.every(([columnId, values]) => {
        const column = columns.find((item) => item.id === columnId);
        if (!column?.filterMethod) return true;
        return values.some((value) => column.filterMethod!(value, row, column));
      }),
    );
  }, [columns, data, resolvedFilterState]);

  // 对应官方 execSort：只在有排序列时生效
  const sortedData = useMemo(() => {
    if (!sortingColumn || typeof sortingColumn.sortable === "string") {
      return filteredData;
    }
    return orderBy(
      filteredData,
      sortProp,
      sortOrder,
      sortingColumn.sortMethod,
      sortingColumn.sortBy,
    );
  }, [filteredData, sortProp, sortOrder, sortingColumn]);

  const getKey = useCallback(
    (row: T) =>
      rowKeyValue ? getRowIdentity(row, rowKeyValue) : String(data.indexOf(row)),
    [data, rowKeyValue],
  );

  const getChildren = useCallback(
    (row: T): T[] => {
      const inline = (row as Record<string, unknown>)[childrenKey];
      const inlineChildren = Array.isArray(inline) ? (inline as T[]) : [];
      const lazyChildren = lazyMap[getKey(row)] ?? [];
      return [...lazyChildren, ...inlineChildren];
    },
    [childrenKey, getKey, lazyMap],
  );

  const hasTree = useMemo(() => {
    if (props.lazy) return !!rowKeyValue;
    if (!rowKeyValue) return false;
    return data.some((row) => {
      const children = (row as Record<string, unknown>)[childrenKey];
      return Array.isArray(children) && children.length > 0;
    });
  }, [childrenKey, data, props.lazy, rowKeyValue]);

  /** 全量拍平（含未展开/懒加载子节点），供全选与父子联动使用。 */
  const allRows = useMemo(() => {
    const result: T[] = [];
    const seen = new Set<string>();
    const walk = (rows: T[]) => {
      rows.forEach((row) => {
        const key = getKey(row);
        if (seen.has(key)) return;
        seen.add(key);
        result.push(row);
        walk(getChildren(row));
      });
    };
    walk(data);
    return result;
  }, [data, getChildren, getKey]);

  /** 节点 -> 父节点，用于选择联动向上回写。 */
  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (rows: T[], parentKey?: string) => {
      rows.forEach((row) => {
        const key = getKey(row);
        if (parentKey && !map.has(key)) map.set(key, parentKey);
        walk(getChildren(row), key);
      });
    };
    walk(data);
    return map;
  }, [data, getChildren, getKey]);

  const rowLevelMap = useMemo(() => {
    const map = new Map<string, number>();
    const walk = (rows: T[], level: number) => {
      rows.forEach((row) => {
        map.set(getKey(row), level);
        walk(getChildren(row), level + 1);
      });
    };
    walk(data, 1);
    return map;
  }, [data, getChildren, getKey]);

  const getDescendants = useCallback(
    (row: T): T[] => {
      const result: T[] = [];
      const seen = new Set<string>();
      const walk = (current: T) => {
        getChildren(current).forEach((child) => {
          const key = getKey(child);
          if (seen.has(key)) return;
          seen.add(key);
          result.push(child);
          walk(child);
        });
      };
      walk(row);
      return result;
    },
    [getChildren, getKey],
  );

  /** 默认展开 / expandRowKeys：显式展开态优先，否则按配置推导。 */
  const expandRowKeysSet = useMemo(
    () => new Set(props.expandRowKeys ?? []),
    [props.expandRowKeys],
  );
  const treeExpanded = useMemo(() => {
    const next: Record<string, boolean> = {};
    if (!hasTree) return next;
    const walk = (rows: T[]) => {
      rows.forEach((row) => {
        const key = getKey(row);
        next[key] =
          treeToggled[key] !== undefined
            ? treeToggled[key]
            : !!props.defaultExpandAll || expandRowKeysSet.has(key);
        walk(getChildren(row));
      });
    };
    walk(data);
    return next;
  }, [
    data,
    expandRowKeysSet,
    getChildren,
    getKey,
    hasTree,
    props.defaultExpandAll,
    treeToggled,
  ]);

  const visibleRows = useMemo<TreeDisplayRow<T>[]>(() => {
    if (!hasTree) {
      return sortedData.map((row, index) => ({
        row,
        index,
        level: 1,
        expanded: false,
        loading: false,
        noLazyChildren: true,
        hasChildren: false,
      }));
    }

    const result: TreeDisplayRow<T>[] = [];
    let displayIndex = 0;

    const walk = (rows: T[], level: number) => {
      rows.forEach((row) => {
        const key = getKey(row);
        const children = getChildren(row);
        const lazyChildren =
          !!props.lazy && !lazyLoaded[key] && !!row[hasChildrenKey];
        const expanded = !!treeExpanded[key];
        const hasChildren = children.length > 0 || lazyChildren;
        result.push({
          row,
          index: displayIndex++,
          level,
          expanded,
          loading: !!lazyLoading[key],
          noLazyChildren: !hasChildren,
          hasChildren,
        });
        if (expanded && children.length) walk(children, level + 1);
      });
    };

    walk(sortedData, 1);
    return result;
  }, [
    getChildren,
    getKey,
    hasChildrenKey,
    hasTree,
    lazyLoaded,
    lazyLoading,
    props.lazy,
    sortedData,
    treeExpanded,
  ]);

  const selectedKeyMap = useMemo(() => {
    if (!rowKeyValue) return null;
    const map = new Map<string, number>();
    selection.forEach((row, index) => {
      map.set(getRowIdentity(row, rowKeyValue), index);
    });
    return map;
  }, [rowKeyValue, selection]);

  const containsRow = useCallback(
    (list: T[], row: T) => {
      if (rowKeyValue) {
        const key = getRowIdentity(row, rowKeyValue);
        return list.some((item) => getRowIdentity(item, rowKeyValue) === key);
      }
      return list.includes(row);
    },
    [rowKeyValue],
  );

  const isSelected = useCallback(
    (row: T) => {
      if (selectedKeyMap) return selectedKeyMap.has(getRowIdentity(row, rowKeyValue));
      return selection.includes(row);
    },
    [rowKeyValue, selectedKeyMap, selection],
  );

  const selectionColumn = useMemo(
    () => columns.find((column) => column.type === "selection"),
    [columns],
  );

  const isRowSelectable = useCallback(
    (row: T) => {
      if (!selectionColumn?.selectable) return true;
      return selectionColumn.selectable(row, allRows.indexOf(row));
    },
    [allRows, selectionColumn],
  );

  const isAllSelected = useMemo(() => {
    if (allRows.length === 0) return false;
    let selectedCount = 0;
    for (const row of allRows) {
      if (!isSelected(row)) {
        if (isRowSelectable(row)) return false;
      } else {
        selectedCount++;
      }
    }
    return selectedCount > 0;
  }, [allRows, isRowSelectable, isSelected]);

  const isIndeterminate = useMemo(() => {
    if (selection.length === 0) return false;
    return !isAllSelected;
  }, [isAllSelected, selection.length]);

  /** 某个父节点是否处于半选：部分后代被选中。 */
  const getRowIndeterminate = useCallback(
    (row: T) => {
      if (!hasTree || checkStrictly || !rowKeyValue) return false;
      const descendants = getDescendants(row);
      if (!descendants.length) return false;
      let selectedCount = 0;
      let selectableCount = 0;
      descendants.forEach((child) => {
        if (isRowSelectable(child)) selectableCount++;
        if (isSelected(child)) selectedCount++;
      });
      return selectedCount > 0 && selectedCount < selectableCount;
    },
    [checkStrictly, getDescendants, hasTree, isRowSelectable, isSelected, rowKeyValue],
  );

  const emitSelectionChange = useCallback(
    (next: T[]) => {
      setSelection(next);
      props.onSelectionChange?.(next);
    },
    [props],
  );

  const toggleRowSelection = useCallback(
    (row: T, selected?: boolean, ignoreSelectable = false) => {
      const current = selectionRef.current;
      const already = containsRow(current, row);
      const next = selected === undefined ? !already : selected;
      if (next === already) return;

      let nextSelection = [...current];
      const removable = (target: T) => {
        nextSelection = nextSelection.filter(
          (item) => !containsRow([item], target),
        );
      };
      const appendable = (target: T) => {
        if (ignoreSelectable || isRowSelectable(target)) {
          if (!containsRow(nextSelection, target)) nextSelection.push(target);
        }
      };

      if (hasTree && !checkStrictly) {
        // 父子联动：先处理整棵子树，再由下往上回写祖先
        [row, ...getDescendants(row)].forEach((item) => {
          if (next) appendable(item);
          else removable(item);
        });

        let cursor: T | undefined = row;
        while (cursor) {
          const parentKey = parentMap.get(getKey(cursor));
          if (!parentKey) break;
          const parent = allRows.find((item) => getKey(item) === parentKey);
          if (!parent) break;
          const descendants = getDescendants(parent);
          const selectableDescendants = descendants.filter(isRowSelectable);
          const allSelected =
            selectableDescendants.length > 0 &&
            selectableDescendants.every((child) => containsRow(nextSelection, child));
          if (allSelected) appendable(parent);
          else removable(parent);
          cursor = parent;
        }
      } else if (next) {
        appendable(row);
      } else {
        removable(row);
      }

      emitSelectionChange(nextSelection);
      props.onSelect?.(nextSelection, row);
    },
    [
      allRows,
      checkStrictly,
      containsRow,
      emitSelectionChange,
      getDescendants,
      getKey,
      hasTree,
      isRowSelectable,
      parentMap,
      props,
    ],
  );

  const toggleAllSelection = useCallback(() => {
    const shouldSelect = !(isAllSelected || selectionRef.current.length > 0);
    const nextSelection = shouldSelect ? [...selectionRef.current] : [];

    if (shouldSelect) {
      allRows.forEach((row) => {
        if (isRowSelectable(row) && !containsRow(nextSelection, row)) {
          nextSelection.push(row);
        }
      });
      if (hasTree && !checkStrictly) {
        // 后代全选后，祖先也要标记选中
        for (let i = allRows.length - 1; i >= 0; i--) {
          const row = allRows[i];
          const descendants = getDescendants(row).filter(isRowSelectable);
          if (
            descendants.length > 0 &&
            descendants.every((child) => containsRow(nextSelection, child)) &&
            isRowSelectable(row)
          ) {
            if (!containsRow(nextSelection, row)) nextSelection.push(row);
          }
        }
      }
    }

    emitSelectionChange(nextSelection);
    props.onSelectAll?.(nextSelection);
  }, [
    allRows,
    checkStrictly,
    containsRow,
    emitSelectionChange,
    getDescendants,
    hasTree,
    isAllSelected,
    isRowSelectable,
    props,
  ]);

  const clearSelection = useCallback(() => {
    emitSelectionChange([]);
  }, [emitSelectionChange]);

  const getSelectionRows = useCallback(() => selectionRef.current, []);

  const setCurrentRow = useCallback(
    (row?: T | null) => {
      const next = row ?? null;
      const prev = currentRowRef.current;
      if (next === prev) return;
      setCurrentRowState(next);
      props.onCurrentChange?.(next, prev);
    },
    [props],
  );

  const applySort = useCallback(
    (column: TableColumnCtx<T> | null, prop: string | null, order: TableSortOrder | null) => {
      setSortingColumn(column);
      setSortProp(prop);
      setSortOrder(order);
    },
    [],
  );

  /** 对应官方 store.commit('sort', {...})。 */
  const commitSort = useCallback(
    (options: Sort): boolean => {
      const { prop, order, init, silent } = options;
      if (!prop) return false;
      const column = columns.find((item) => item.property === prop);
      // 列还没注册完时返回 false，调用方据此决定是否重试
      if (!column) return false;

      column.order = order;
      applySort(column, prop, order);

      if (!init && !silent) {
        props.onSortChange?.({ column, prop, order });
      }
      return true;
    },
    [applySort, columns, props],
  );

  /** 对应官方 sort(prop, order)，供 ref 调用。 */
  const sort = useCallback(
    (prop: string, order: TableSortOrder) => commitSort({ prop, order }),
    [commitSort],
  );

  const clearSort = useCallback(() => {
    applySort(null, null, null);
  }, [applySort]);

  /** 对应官方 store.commit('filterChange')。 */
  const commitFilter = useCallback(
    (column: TableColumnCtx<T>, values: string[], silent = false) => {
      const columnData = columns.find((item) => item.id === column.id) ?? column;
      columnData.filteredValue = values;
      setFilterState((prev) => ({ ...prev, [column.id]: values }));

      if (!silent) {
        const nextFilters: Record<string, string[]> = {};
        columns.forEach((item) => {
          const current = item.id === column.id ? values : filterState[item.id] ?? [];
          if (item.filters?.length) {
            nextFilters[item.columnKey || item.id] = current;
          }
        });
        props.onFilterChange?.(nextFilters);
      }
    },
    [columns, filterState, props],
  );

  /** 对应官方 clearFilter：columnKeys 匹配 columnKey。 */
  const clearFilter = useCallback(
    (columnKeys?: string | string[]) => {
      const keys =
        columnKeys === undefined
          ? undefined
          : Array.isArray(columnKeys)
            ? columnKeys
            : [columnKeys];

      const targets = columns.filter(
        (column) =>
          column.filters?.length &&
          (keys === undefined ||
            keys.includes(column.columnKey) ||
            keys.includes(column.id)),
      );
      if (!targets.length) return;

      targets.forEach((column) => {
        column.filteredValue = [];
      });
      setFilterState((prev) => {
        const next = { ...prev };
        targets.forEach((column) => {
          next[column.id] = [];
        });
        return next;
      });
    },
    [columns],
  );

  const keyOfRow = getKey;

  const toggleRowExpansion = useCallback(
    (row: T, expanded?: boolean) => {
      const key = keyOfRow(row);
      const currentlyExpanded = hasTree
        ? !!treeExpanded[key]
        : expandKeys.includes(key);
      const next = expanded === undefined ? !currentlyExpanded : expanded;

      if (hasTree) {
        const lazyChildren =
          !!props.lazy &&
          !lazyLoaded[key] &&
          !getChildren(row).length &&
          !!(row as Record<string, unknown>)[hasChildrenKey];

        if (next && lazyChildren) {
          if (!loadingRef.current.has(key)) {
            loadingRef.current.add(key);
            setLazyLoading((prev) => ({ ...prev, [key]: true }));
            setTreeToggled((prev) => ({ ...prev, [key]: true }));
            const treeNode: LazyTreeNode = {
              row: row as DefaultRow,
              key,
              level: rowLevelMap.get(key) ?? 1,
              expanded: true,
              loading: true,
              noLazyChildren: false,
            };
            props.load?.(row, treeNode, (children) => {
              setLazyMap((prev) => ({ ...prev, [key]: children }));
              setLazyLoaded((prev) => ({ ...prev, [key]: true }));
              setLazyLoading((prev) => ({ ...prev, [key]: false }));
              loadingRef.current.delete(key);
              props.onExpandChange?.(row, true);
            });
          }
          return;
        }

        setTreeToggled((prev) => {
          if (next) return { ...prev, [key]: true };
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        props.onExpandChange?.(row, next);
        return;
      }

      setExpandKeys((prev) => {
        if (next && !prev.includes(key)) return [...prev, key];
        if (!next) return prev.filter((item) => item !== key);
        return prev;
      });
      props.onExpandChange?.(row, next);
    },
    [
      expandKeys,
      getChildren,
      hasChildrenKey,
      hasTree,
      keyOfRow,
      lazyLoaded,
      props,
      rowLevelMap,
      treeExpanded,
    ],
  );

  const isRowExpanded = useCallback(
    (row: T) => {
      const key = keyOfRow(row);
      if (hasTree) return !!treeExpanded[key];
      return expandKeys.includes(key);
    },
    [expandKeys, hasTree, keyOfRow, treeExpanded],
  );

  const registerColumn = useCallback((column: TableColumnCtx<T>) => {
    setOriginColumns((prev) => {
      const index = prev.findIndex((item) => item.id === column.id);
      if (index === -1) return [...prev, column];
      const next = [...prev];
      next[index] = column;
      return next;
    });
  }, []);

  const unregisterColumn = useCallback((id: string) => {
    setOriginColumns((prev) => prev.filter((column) => column.id !== id));
  }, []);

  const states: TableStates<T> = {
    data: sortedData,
    columns,
    originColumnTree,
    fixedColumns,
    rightFixedColumns,
    fixedLeafColumnsLength: flattenColumns(fixedColumns).length,
    rightFixedLeafColumnsLength: flattenColumns(rightFixedColumns).length,
    selection,
    currentRow: currentRowState,
    sortingColumn,
    sortProp,
    sortOrder,
    isAllSelected,
    isIndeterminate,
    expandKeys,
    filteredData,
    visibleRows,
    hasTree,
    filterState: resolvedFilterState,
    treeExpanded,
    lazyLoading,
    indent,
  };

  return {
    states,
    isSelected,
    isAllSelected,
    isIndeterminate,
    getRowIndeterminate,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    getSelectionRows,
    setCurrentRow,
    sort,
    clearSort,
    commitSort,
    commitFilter,
    clearFilter,
    toggleRowExpansion,
    isRowExpanded,
    registerColumn,
    unregisterColumn,
  };
}

/**
 * 把扁平注册的列按 parentId 组装成树。
 *
 * 官方是直接递归遍历 template 里的 <el-table-column> 生成树；
 * React 里子列通过 children 渲染，注册时只知道父列 id，所以在这里重建嵌套关系。
 */
function buildColumnTree<T extends DefaultRow>(
  flat: TableColumnCtx<T>[],
): TableColumnCtx<T>[] {
  const sorted = [...flat].sort((a, b) => a.no - b.no);
  const nodes = new Map<string, TableColumnCtx<T>>();
  sorted.forEach((column) => {
    nodes.set(column.id, { ...column, children: undefined });
  });

  const roots: TableColumnCtx<T>[] = [];
  sorted.forEach((column) => {
    const node = nodes.get(column.id)!;
    const parent = column.parentId ? nodes.get(column.parentId) : undefined;
    if (parent) {
      parent.children = parent.children ? [...parent.children, node] : [node];
      parent.isColumnGroup = true;
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export type { TableFilter };
