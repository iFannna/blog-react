"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { doFilter } from "./use-filter";
import {
  collectChecked,
  collectHalfChecked,
  computeCheckedState,
  effectivelyChecked,
  toggleCheckedKeys,
  updateCheckedKeys,
  type CheckState,
} from "./use-check";

import type { VirtualListHandle } from "../virtual-list";
import type {
  CheckedInfo,
  ScrollStrategy,
  Tree,
  TreeData,
  TreeKey,
  TreeNode,
  TreeNodeData,
  TreeOptionProps,
  TreeV2Props,
} from "./types";

const EMPTY_DATA: TreeData = [];
const EMPTY_KEYS: TreeKey[] = [];

const DEFAULT_OPTION_PROPS: TreeOptionProps = {
  children: "children",
  label: "label",
  disabled: "disabled",
  value: "id",
  class: "",
};

interface KeyConfig {
  valueKey: string;
  childrenKey: string;
  disabledKey: string;
  labelKey: string;
}

/** 对应官方 createTree：一次性建立 key 索引与层级索引。 */
export function createTree(data: TreeData, config: KeyConfig): Tree {
  const treeNodeMap = new Map<TreeKey, TreeNode>();
  const levelTreeNodeMap = new Map<number, TreeNode[]>();
  let maxLevel = 1;

  const traverse = (
    nodes: TreeData,
    level = 1,
    parent?: TreeNode,
  ): TreeNode[] => {
    const siblings: TreeNode[] = [];

    for (const rawNode of nodes) {
      const key = (rawNode?.[config.valueKey] ?? "") as TreeKey;
      const node: TreeNode = { level, key, data: rawNode, parent };
      node.label = rawNode?.[config.labelKey] as string | undefined;
      const children = rawNode?.[config.childrenKey] as
        | TreeData
        | undefined;
      node.disabled = rawNode?.[config.disabledKey] as
        | boolean
        | undefined;
      node.isLeaf = !children || children.length === 0;

      if (children && children.length) {
        node.children = traverse(children, level + 1, node);
      }

      siblings.push(node);
      treeNodeMap.set(key, node);
      if (!levelTreeNodeMap.has(level)) levelTreeNodeMap.set(level, []);
      levelTreeNodeMap.get(level)?.push(node);
    }

    if (level > maxLevel) maxLevel = level;
    return siblings;
  };

  const treeNodes = traverse(data);
  return { treeNodeMap, levelTreeNodeMap, treeNodes, maxLevel };
}

/** 对应官方 setExpandedKeys：把 key 及其祖先全部标记为展开。 */
export function computeExpandedKeys(
  tree: Tree,
  keys: TreeKey[],
): Set<TreeKey> {
  const expandedKeys = new Set<TreeKey>();
  keys.forEach((key) => {
    let node = tree.treeNodeMap.get(key);
    while (node && !expandedKeys.has(node.key)) {
      expandedKeys.add(node.key);
      node = node.parent;
    }
  });
  return expandedKeys;
}

export function useTree(options: TreeV2Props) {
  const {
    showCheckbox = false,
    checkStrictly = false,
    expandOnClickNode = true,
    checkOnClickNode = false,
    checkOnClickLeaf = true,
    accordion = false,
    currentNodeKey,
    filterMethod,
    onNodeClick,
    onNodeDrop,
    onNodeExpand,
    onNodeCollapse,
    onCurrentChange,
    onCheck,
    onCheckChange,
  } = options;

  const data = options.data ?? EMPTY_DATA;
  const defaultCheckedKeys = options.defaultCheckedKeys ?? EMPTY_KEYS;
  const defaultExpandedKeys = options.defaultExpandedKeys ?? EMPTY_KEYS;

  const optionProps = options.props ?? DEFAULT_OPTION_PROPS;
  const valueKey = optionProps.value || "id";
  const childrenKey = optionProps.children || "children";
  const disabledKey = optionProps.disabled || "disabled";
  const labelKey = optionProps.label || "label";

  /**
   * 对应官方 setData：命令式替换数据。
   * override 只在 data 引用未变时生效，外部 data 一变化就自动失效，
   * 无需 effect 同步，避免 setState in effect。
   */
  const [dataOverride, setDataOverride] = useState<{
    base: TreeData;
    data: TreeData;
  } | null>(null);
  const sourceData =
    dataOverride && dataOverride.base === data ? dataOverride.data : data;

  const tree = useMemo(
    () =>
      createTree(sourceData, {
        valueKey,
        childrenKey,
        disabledKey,
        labelKey,
      }),
    [sourceData, valueKey, childrenKey, disabledKey, labelKey],
  );

  // 默认展开/勾选值随 data、默认 key 变化而重算；用 base 引用判定状态是否过期
  const defaultExpandedSet = useMemo(
    () => computeExpandedKeys(tree, defaultExpandedKeys),
    [tree, defaultExpandedKeys],
  );
  const [expandedStore, setExpandedStore] = useState<{
    base: Set<TreeKey>;
    keys: Set<TreeKey>;
  }>(() => ({ base: defaultExpandedSet, keys: defaultExpandedSet }));
  const expandedKeys =
    expandedStore.base === defaultExpandedSet
      ? expandedStore.keys
      : defaultExpandedSet;

  const defaultCheckState = useMemo(
    () =>
      computeCheckedState(
        tree,
        defaultCheckedKeys,
        showCheckbox,
        checkStrictly,
      ),
    [tree, defaultCheckedKeys, showCheckbox, checkStrictly],
  );
  const [checkStore, setCheckStore] = useState<{
    base: CheckState;
    value: CheckState;
  }>(() => ({ base: defaultCheckState, value: defaultCheckState }));
  const checkState =
    checkStore.base === defaultCheckState
      ? checkStore.value
      : defaultCheckState;

  const [currentStore, setCurrentStore] = useState<{
    base: TreeKey | undefined;
    key: TreeKey | undefined;
  }>(() => ({ base: currentNodeKey, key: currentNodeKey }));
  const currentKey =
    currentStore.base === currentNodeKey
      ? currentStore.key
      : currentNodeKey;

  const [hiddenKeys, setHiddenKeys] = useState<Set<TreeKey>>(
    () => new Set(),
  );
  const [hiddenExpandIconKeys, setHiddenExpandIconKeys] = useState<
    Set<TreeKey>
  >(() => new Set());

  const listRef = useRef<VirtualListHandle>(null);

  const updateExpandedKeys = useCallback(
    (next: Set<TreeKey>) => {
      setExpandedStore({ base: defaultExpandedSet, keys: next });
    },
    [defaultExpandedSet],
  );

  const updateCheckState = useCallback(
    (next: CheckState) => {
      setCheckStore({ base: defaultCheckState, value: next });
    },
    [defaultCheckState],
  );

  const flattenTree = useMemo(() => {
    const flattenNodes: TreeNode[] = [];
    const nodes = tree.treeNodes;
    const stack: TreeNode[] = [];

    for (let i = nodes.length - 1; i >= 0; --i) stack.push(nodes[i]);

    while (stack.length) {
      const node = stack.pop()!;
      if (hiddenKeys.has(node.key)) continue;

      flattenNodes.push(node);
      if (node.children && expandedKeys.has(node.key)) {
        for (let i = node.children.length - 1; i >= 0; --i) {
          stack.push(node.children[i]);
        }
      }
    }

    return flattenNodes;
  }, [tree, expandedKeys, hiddenKeys]);

  const isNotEmpty = flattenTree.length > 0;

  const isChecked = useCallback(
    (node: TreeNode) => checkState.checkedKeys.has(node.key),
    [checkState.checkedKeys],
  );

  const isIndeterminate = useCallback(
    (node: TreeNode) => checkState.indeterminateKeys.has(node.key),
    [checkState.indeterminateKeys],
  );

  const isDisabled = useCallback((node: TreeNode) => !!node.disabled, []);

  const isCurrent = useCallback(
    (node: TreeNode) =>
      currentKey !== undefined && currentKey === node.key,
    [currentKey],
  );

  const isForceHiddenExpandIcon = useCallback(
    (node: TreeNode) => hiddenExpandIconKeys.has(node.key),
    [hiddenExpandIconKeys],
  );

  const expandNode = useCallback(
    (node: TreeNode) => {
      const next = new Set(expandedKeys);

      if (accordion) {
        // 手风琴：先收起同层已展开的节点
        next.forEach((key) => {
          const treeNode = tree.treeNodeMap.get(key);
          if (treeNode && treeNode.level === node.level) {
            next.delete(key);
          }
        });
      }

      next.add(node.key);
      updateExpandedKeys(next);

      const target = tree.treeNodeMap.get(node.key) ?? node;
      onNodeExpand?.(target.data, target);
    },
    [expandedKeys, accordion, tree, onNodeExpand, updateExpandedKeys],
  );

  const collapseNode = useCallback(
    (node: TreeNode) => {
      const next = new Set(expandedKeys);
      next.delete(node.key);
      updateExpandedKeys(next);

      const target = tree.treeNodeMap.get(node.key) ?? node;
      onNodeCollapse?.(target.data, target);
    },
    [expandedKeys, tree, onNodeCollapse, updateExpandedKeys],
  );

  const toggleExpand = useCallback(
    (node: TreeNode) => {
      if (expandedKeys.has(node.key)) collapseNode(node);
      else expandNode(node);
    },
    [expandedKeys, collapseNode, expandNode],
  );

  const setCurrentKey = useCallback(
    (key: TreeKey | undefined) => {
      setCurrentStore({ base: currentNodeKey, key });
    },
    [currentNodeKey],
  );

  const handleCurrentChange = useCallback(
    (node: TreeNode) => {
      if (currentKey !== node.key) {
        setCurrentKey(node.key);
        onCurrentChange?.(node.data, node);
      }
    },
    [currentKey, onCurrentChange, setCurrentKey],
  );

  const buildCheckedInfo = useCallback(
    (
      nextChecked: Set<TreeKey>,
      nextIndeterminate: Set<TreeKey>,
    ): CheckedInfo => {
      if (!showCheckbox) {
        return {
          checkedKeys: [],
          checkedNodes: [],
          halfCheckedKeys: [],
          halfCheckedNodes: [],
        };
      }

      const checked = collectChecked(tree, nextChecked);
      const half = collectHalfChecked(tree, nextIndeterminate);
      return {
        checkedKeys: checked.checkedKeys,
        checkedNodes: checked.checkedNodes.map((node) => node.data),
        halfCheckedKeys: half.halfCheckedKeys,
        halfCheckedNodes: half.halfCheckedNodes.map((node) => node.data),
      };
    },
    [showCheckbox, tree],
  );

  const toggleCheckbox = useCallback(
    (
      node: TreeNode,
      checked: boolean,
      nodeClick = true,
      immediateUpdate = true,
      deep = false,
    ) => {
      let isCheckedValue = checked;

      // 点节点（而非复选框）勾选父节点时，按「是否还有未选子节点」决定勾/取消
      if (
        (!checkStrictly || deep) &&
        nodeClick &&
        node.children?.length
      ) {
        isCheckedValue = node.children.some(
          (child) => !effectivelyChecked(child, checkState.checkedKeys),
        );
      }

      let nextChecked = toggleCheckedKeys(
        checkState.checkedKeys,
        node,
        isCheckedValue,
        checkStrictly,
        deep,
      );
      let nextIndeterminate = checkState.indeterminateKeys;

      if (immediateUpdate && showCheckbox && !checkStrictly) {
        const result = updateCheckedKeys(tree, nextChecked, checkStrictly);
        nextChecked = result.checkedKeys;
        nextIndeterminate = result.indeterminateKeys;
      }

      updateCheckState({
        checkedKeys: nextChecked,
        indeterminateKeys: nextIndeterminate,
      });

      if (nodeClick) {
        const info = buildCheckedInfo(nextChecked, nextIndeterminate);
        onCheck?.(node.data, info);
        onCheckChange?.(node.data, !!isCheckedValue);
      }
    },
    [
      checkStrictly,
      checkState.checkedKeys,
      checkState.indeterminateKeys,
      showCheckbox,
      tree,
      buildCheckedInfo,
      updateCheckState,
      onCheck,
      onCheckChange,
    ],
  );

  const handleNodeClick = useCallback(
    (node: TreeNode, event: MouseEvent) => {
      handleCurrentChange(node);
      onNodeClick?.(node.data, node, event);

      if (expandOnClickNode) toggleExpand(node);

      if (
        showCheckbox &&
        (checkOnClickNode || (node.isLeaf && checkOnClickLeaf)) &&
        !node.disabled
      ) {
        toggleCheckbox(
          node,
          !checkState.checkedKeys.has(node.key),
          true,
        );
      }
    },
    [
      handleCurrentChange,
      onNodeClick,
      expandOnClickNode,
      toggleExpand,
      showCheckbox,
      checkOnClickNode,
      checkOnClickLeaf,
      checkState.checkedKeys,
      toggleCheckbox,
    ],
  );

  const handleNodeCheck = useCallback(
    (node: TreeNode, checked: boolean) => {
      toggleCheckbox(node, checked);
    },
    [toggleCheckbox],
  );

  const handleNodeDrop = useCallback(
    (node: TreeNode, event: DragEvent) => {
      onNodeDrop?.(node.data, node, event);
    },
    [onNodeDrop],
  );

  const filter = useCallback(
    (query: string) => {
      const result = doFilter(tree, query, filterMethod);
      if (!result) return;

      setHiddenKeys(result.hiddenKeys);
      setHiddenExpandIconKeys(result.hiddenExpandIconKeys);
      updateExpandedKeys(result.expandedKeys);
    },
    [tree, filterMethod, updateExpandedKeys],
  );

  const setExpandedKeys = useCallback(
    (keys: TreeKey[]) => {
      updateExpandedKeys(computeExpandedKeys(tree, keys));
    },
    [tree, updateExpandedKeys],
  );

  const setCheckedKeys = useCallback(
    (keys: TreeKey[]) => {
      updateCheckState(
        computeCheckedState(tree, keys, showCheckbox, checkStrictly),
      );
    },
    [tree, showCheckbox, checkStrictly, updateCheckState],
  );

  const setChecked = useCallback(
    (key: TreeKey, checked: boolean, deep?: boolean) => {
      if (!showCheckbox) return;
      const node = tree.treeNodeMap.get(key);
      if (node) toggleCheckbox(node, checked, false, true, deep);
    },
    [showCheckbox, tree, toggleCheckbox],
  );

  const getCheckedKeys = useCallback(
    (leafOnly = false) => {
      if (!showCheckbox) return [];
      return collectChecked(tree, checkState.checkedKeys, leafOnly)
        .checkedKeys;
    },
    [showCheckbox, tree, checkState.checkedKeys],
  );

  const getCheckedNodes = useCallback(
    (leafOnly = false) => {
      if (!showCheckbox) return [];
      return collectChecked(tree, checkState.checkedKeys, leafOnly)
        .checkedNodes.map((node) => node.data);
    },
    [showCheckbox, tree, checkState.checkedKeys],
  );

  const getHalfCheckedKeys = useCallback(() => {
    if (!showCheckbox) return [];
    return collectHalfChecked(tree, checkState.indeterminateKeys)
      .halfCheckedKeys;
  }, [showCheckbox, tree, checkState.indeterminateKeys]);

  const getHalfCheckedNodes = useCallback(() => {
    if (!showCheckbox) return [];
    return collectHalfChecked(tree, checkState.indeterminateKeys)
      .halfCheckedNodes.map((node) => node.data);
  }, [showCheckbox, tree, checkState.indeterminateKeys]);

  const getCurrentNode = useCallback((): TreeNodeData | undefined => {
    if (currentKey === undefined) return undefined;
    return tree.treeNodeMap.get(currentKey)?.data;
  }, [currentKey, tree]);

  const getCurrentKey = useCallback(() => currentKey, [currentKey]);

  const getNode = useCallback(
    (target: TreeKey | TreeNodeData) => {
      const key =
        typeof target === "object" && target !== null
          ? ((target as TreeNodeData)[valueKey] as TreeKey)
          : target;
      return tree.treeNodeMap.get(key);
    },
    [tree, valueKey],
  );

  const setData = useCallback(
    (nextData: TreeData) => {
      setDataOverride({ base: data, data: nextData });
    },
    [data],
  );

  const scrollTo = useCallback((offset: number) => {
    listRef.current?.scrollTo(offset);
  }, []);

  const scrollToNode = useCallback(
    (key: TreeKey, strategy: ScrollStrategy = "auto") => {
      const node = tree.treeNodeMap.get(key);
      if (!node) return;
      const index = flattenTree.indexOf(node);
      if (index >= 0) listRef.current?.scrollToItem(index, strategy);
    },
    [tree, flattenTree],
  );

  return {
    tree,
    flattenTree,
    expandedKeys,
    isNotEmpty,
    listRef,
    isChecked,
    isIndeterminate,
    isDisabled,
    isCurrent,
    isForceHiddenExpandIcon,
    toggleExpand,
    toggleCheckbox,
    expandNode,
    collapseNode,
    handleNodeClick,
    handleNodeCheck,
    handleNodeDrop,
    filter,
    setExpandedKeys,
    setCheckedKeys,
    setChecked,
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedKeys,
    getHalfCheckedNodes,
    getCurrentNode,
    getCurrentKey,
    setCurrentKey,
    getNode,
    setData,
    scrollTo,
    scrollToNode,
  };
}
