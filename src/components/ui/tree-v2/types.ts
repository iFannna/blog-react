import type { ComponentType, CSSProperties, ReactNode } from "react";

export type TreeNodeData = Record<string, unknown>;

export type TreeData = TreeNodeData[];

export type TreeKey = string | number;

export interface TreeOptionProps {
  children?: string;
  label?: string;
  value?: string;
  disabled?: string;
  class?:
    | ((data: TreeNodeData, node: TreeNode) => string | Record<string, boolean>)
    | string;
}

export interface TreeNode {
  key: TreeKey;
  level: number;
  parent?: TreeNode;
  children?: TreeNode[];
  data: TreeNodeData;
  disabled?: boolean;
  label?: string;
  isLeaf?: boolean;
  expanded?: boolean;
  isEffectivelyChecked?: boolean;
}

export interface Tree {
  treeNodeMap: Map<TreeKey, TreeNode>;
  levelTreeNodeMap: Map<number, TreeNode[]>;
  treeNodes: TreeNode[];
  maxLevel: number;
}

export type FilterMethod = (
  query: string,
  data: TreeNodeData,
  node: TreeNode,
) => boolean;

export interface CheckedInfo {
  checkedKeys: TreeKey[];
  checkedNodes: TreeData;
  halfCheckedKeys: TreeKey[];
  halfCheckedNodes: TreeData;
}

export type ScrollStrategy = "auto" | "smart" | "center" | "start" | "end";

export type TreeIcon = ReactNode | ComponentType;

export interface TreeNodeRenderParams {
  node: TreeNode;
  data: TreeNodeData;
}

export interface TreeV2Props {
  data?: TreeData;
  emptyText?: string;
  height?: number;
  props?: TreeOptionProps;
  highlightCurrent?: boolean;
  showCheckbox?: boolean;
  defaultCheckedKeys?: TreeKey[];
  checkStrictly?: boolean;
  defaultExpandedKeys?: TreeKey[];
  indent?: number;
  itemSize?: number;
  icon?: TreeIcon;
  expandOnClickNode?: boolean;
  checkOnClickNode?: boolean;
  checkOnClickLeaf?: boolean;
  currentNodeKey?: TreeKey;
  accordion?: boolean;
  filterMethod?: FilterMethod;
  perfMode?: boolean;
  scrollbarAlwaysOn?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 对应官方 default 作用域插槽 `{ node, data }` */
  children?: (params: TreeNodeRenderParams) => ReactNode;
  /** 对应官方 empty 插槽 */
  empty?: ReactNode;
  onNodeClick?: (data: TreeNodeData, node: TreeNode, event: MouseEvent) => void;
  onNodeDrop?: (data: TreeNodeData, node: TreeNode, event: DragEvent) => void;
  onNodeExpand?: (data: TreeNodeData, node: TreeNode) => void;
  onNodeCollapse?: (data: TreeNodeData, node: TreeNode) => void;
  onCurrentChange?: (data: TreeNodeData, node: TreeNode) => void;
  onCheck?: (data: TreeNodeData, info: CheckedInfo) => void;
  onCheckChange?: (data: TreeNodeData, checked: boolean) => void;
  onNodeContextmenu?: (
    event: Event,
    data: TreeNodeData,
    node: TreeNode,
  ) => void;
}

export interface TreeV2Expose {
  toggleCheckbox: (
    node: TreeNode,
    checked: boolean,
    nodeClick?: boolean,
    immediateUpdate?: boolean,
    deep?: boolean,
  ) => void;
  getCurrentNode: () => TreeNodeData | undefined;
  getCurrentKey: () => TreeKey | undefined;
  setCurrentKey: (key: TreeKey) => void;
  getCheckedKeys: (leafOnly?: boolean) => TreeKey[];
  getCheckedNodes: (leafOnly?: boolean) => TreeNodeData[];
  getHalfCheckedKeys: () => TreeKey[];
  getHalfCheckedNodes: () => TreeNodeData[];
  setChecked: (key: TreeKey, checked: boolean, deep?: boolean) => void;
  setCheckedKeys: (keys: TreeKey[]) => void;
  filter: (query: string) => void;
  setData: (data: TreeData) => void;
  getNode: (data: TreeKey | TreeNodeData) => TreeNode | undefined;
  expandNode: (node: TreeNode) => void;
  collapseNode: (node: TreeNode) => void;
  setExpandedKeys: (keys: TreeKey[]) => void;
  scrollToNode: (key: TreeKey, strategy?: ScrollStrategy) => void;
  scrollTo: (offset: number) => void;
}
