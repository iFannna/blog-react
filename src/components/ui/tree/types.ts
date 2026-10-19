import type { CSSProperties, ReactNode } from "react";
import type TreeNodeClass from "./model/node";
import type TreeStore from "./model/tree-store";

/** 对应官方 TreeOptionProps 里的节点对象类型（与类同名，避免遮蔽）。 */
type TreeNode = TreeNodeClass;

/** 节点数据，对应官方 TreeNodeData。 */
export type TreeNodeData = Record<string, unknown>;

/** 节点标识，对应官方 TreeKey。 */
export type TreeKey = string | number;

/** 树数据，对应官方 TreeData。 */
export type TreeData = TreeNodeData[];

/** 过滤值，对应官方 FilterValue。 */
export type FilterValue = unknown;

/** 拖拽落点类型，对应官方 AllowDropType。 */
export type AllowDropType = "inner" | "prev" | "next";

/** 节点落点类型，对应官方 NodeDropType。 */
export type NodeDropType = "before" | "after" | "inner" | "none";

/** 自定义节点类名，对应官方 props.class 的返回值。 */
export type NodeClassValue = string | Record<string, boolean>;

/**
 * 对应官方 TreeOptionProps。
 *
 * 官方 children 只支持字符串，label / disabled / isLeaf / class 支持字符串或函数；
 * React 下函数式写法还多接收一个 node 参数，与官方签名一致。
 */
export interface TreeOptionProps {
  /** 子树字段名 */
  children?: string;
  /** 标签取值：字段名或取值函数 */
  label?: string | ((data: TreeNodeData, node: TreeNode) => string);
  /** 禁用取值：字段名或取值函数 */
  disabled?: string | ((data: TreeNodeData, node: TreeNode) => boolean);
  /** 叶子判定：字段名或取值函数，仅 lazy 下生效 */
  isLeaf?: string | ((data: TreeNodeData, node: TreeNode) => boolean);
  /** 自定义节点类名 */
  class?: (data: TreeNodeData, node: TreeNode) => NodeClassValue;
}

/** 对应官方 LoadFunction。 */
export type LoadFunction = (
  node: TreeNode,
  resolve: (data: TreeData) => void,
  reject: () => void,
) => void;

/** 对应官方 FilterNodeMethodFunction。 */
export type FilterNodeMethodFunction = (
  value: FilterValue,
  data: TreeNodeData,
  node: TreeNode,
) => boolean;

/** 对应官方 RenderContentContext。 */
export interface RenderContentContext {
  node: TreeNode;
  data: TreeNodeData;
  store: TreeStore;
}

/** 对应官方 render-content：React 下直接返回节点内容，无需 h 函数。 */
export type RenderContentFunction = (context: RenderContentContext) => ReactNode;

/** 对应官方 allow-drag。 */
export type AllowDragFunction = (node: TreeNode) => boolean;

/** 对应官方 allow-drop。 */
export type AllowDropFunction = (
  draggingNode: TreeNode,
  dropNode: TreeNode,
  type: AllowDropType,
) => boolean;

/** 对应官方 CheckedInfo。 */
export interface CheckedInfo {
  checkedKeys: TreeKey[];
  checkedNodes: TreeNodeData[];
  halfCheckedKeys: TreeKey[];
  halfCheckedNodes: TreeNodeData[];
}

/** 对应官方 treeEmits 里的 node-click 参数。 */
export type NodeClickHandler = (
  data: TreeNodeData,
  node: TreeNode,
  event: React.MouseEvent,
) => void;

/** 对应官方 treeEmits 里的 node-contextmenu 参数。 */
export type NodeContextmenuHandler = (
  event: React.MouseEvent,
  data: TreeNodeData,
  node: TreeNode,
) => void;

/** 对应官方 treeEmits 里的 check-change 参数。 */
export type CheckChangeHandler = (
  data: TreeNodeData,
  checked: boolean,
  indeterminate: boolean,
) => void;

/** 对应官方 treeEmits 里的 check 参数。 */
export type CheckHandler = (data: TreeNodeData, info: CheckedInfo) => void;

/** 对应官方 treeEmits 里的 current-change 参数。 */
export type CurrentChangeHandler = (
  data: TreeNodeData | null,
  node: TreeNode | null,
) => void;

/** 对应官方 node-expand / node-collapse 参数。 */
export type NodeExpandHandler = (data: TreeNodeData, node: TreeNode) => void;

/** 对应官方 node-drag-start 参数。 */
export type NodeDragStartHandler = (node: TreeNode, event: DragEvent) => void;

/** 对应官方 node-drag-enter / node-drag-leave / node-drag-over 参数。 */
export type NodeDragMoveHandler = (
  draggingNode: TreeNode,
  dropNode: TreeNode,
  event: DragEvent,
) => void;

/** 对应官方 node-drag-end 参数。 */
export type NodeDragEndHandler = (
  draggingNode: TreeNode,
  dropNode: TreeNode | null,
  dropType: NodeDropType,
  event: DragEvent,
) => void;

/** 对应官方 node-drop 参数。 */
export type NodeDropHandler = (
  draggingNode: TreeNode,
  dropNode: TreeNode,
  dropType: Exclude<NodeDropType, "none">,
  event: DragEvent,
) => void;

export interface TreeProps {
  /** 树数据，对应官方 data */
  data?: TreeData;
  /** 空数据时的文本，对应官方 empty-text */
  emptyText?: string;
  /** 节点唯一标识字段名，对应官方 node-key */
  nodeKey?: string;
  /** 节点字段配置，对应官方 props */
  props?: TreeOptionProps;
  /** 是否首次展开后才渲染子节点，对应官方 render-after-expand */
  renderAfterExpand?: boolean;
  /** 懒加载数据的方法，对应官方 load */
  load?: LoadFunction;
  /** 自定义节点内容，对应官方 render-content */
  renderContent?: RenderContentFunction;
  /** 是否高亮当前节点，对应官方 highlight-current */
  highlightCurrent?: boolean;
  /** 是否默认展开所有节点，对应官方 default-expand-all */
  defaultExpandAll?: boolean;
  /** 点击节点是否展开/收起，对应官方 expand-on-click-node */
  expandOnClickNode?: boolean;
  /** 点击节点是否勾选，对应官方 check-on-click-node */
  checkOnClickNode?: boolean;
  /** 点击叶子节点是否勾选，对应官方 check-on-click-leaf */
  checkOnClickLeaf?: boolean;
  /** 子节点展开时是否展开父节点，对应官方 auto-expand-parent */
  autoExpandParent?: boolean;
  /** 初始展开的节点 key 数组，对应官方 default-expanded-keys */
  defaultExpandedKeys?: TreeKey[];
  /** 是否显示复选框，对应官方 show-checkbox */
  showCheckbox?: boolean;
  /** 勾选是否不联动父子，对应官方 check-strictly */
  checkStrictly?: boolean;
  /** 是否在勾选时下传子节点，对应官方 check-descendants */
  checkDescendants?: boolean;
  /** 初始勾选的节点 key 数组，对应官方 default-checked-keys */
  defaultCheckedKeys?: TreeKey[];
  /** 初始选中的节点 key，对应官方 current-node-key */
  currentNodeKey?: TreeKey;
  /** 过滤方法，对应官方 filter-node-method */
  filterNodeMethod?: FilterNodeMethodFunction;
  /** 同层是否只展开一个节点，对应官方 accordion */
  accordion?: boolean;
  /** 相邻层级缩进像素，对应官方 indent */
  indent?: number;
  /** 自定义展开图标，对应官方 icon */
  icon?: ReactNode;
  /** 是否懒加载，对应官方 lazy */
  lazy?: boolean;
  /** 是否可拖拽，对应官方 draggable */
  draggable?: boolean;
  /** 拖拽前判定，对应官方 allow-drag */
  allowDrag?: AllowDragFunction;
  /** 落点判定，对应官方 allow-drop */
  allowDrop?: AllowDropFunction;
  /**
   * 唯一非官方的 prop：命令式方法需要命令式触达模型。
   * 官方用模板 ref 拿到实例方法，React 下把 store 与句柄经此回调交给调用方。
   */
  onReady?: (instance: TreeInstance) => void;
  className?: string;
  style?: CSSProperties;
  /** 对应官方 default 作用域插槽，参数为节点对象与节点数据 */
  children?: (context: RenderContentContext) => ReactNode;
  /** 对应官方 empty 插槽 */
  emptySlot?: ReactNode;
  /** 对应官方 node-click */
  onNodeClick?: NodeClickHandler;
  /** 对应官方 node-contextmenu */
  onNodeContextmenu?: NodeContextmenuHandler;
  /** 对应官方 check-change */
  onCheckChange?: CheckChangeHandler;
  /** 对应官方 check */
  onCheck?: CheckHandler;
  /** 对应官方 current-change */
  onCurrentChange?: CurrentChangeHandler;
  /** 对应官方 node-expand */
  onNodeExpand?: NodeExpandHandler;
  /** 对应官方 node-collapse */
  onNodeCollapse?: NodeExpandHandler;
  /** 对应官方 node-drag-start */
  onNodeDragStart?: NodeDragStartHandler;
  /** 对应官方 node-drag-enter */
  onNodeDragEnter?: NodeDragMoveHandler;
  /** 对应官方 node-drag-leave */
  onNodeDragLeave?: NodeDragMoveHandler;
  /** 对应官方 node-drag-over */
  onNodeDragOver?: NodeDragMoveHandler;
  /** 对应官方 node-drag-end */
  onNodeDragEnd?: NodeDragEndHandler;
  /** 对应官方 node-drop */
  onNodeDrop?: NodeDropHandler;
}

/**
 * 对应官方 TreeInstance 暴露的方法。
 *
 * 官方经模板 ref 调用，React 下由 onReady 回调下发。
 * 句柄是薄壳，真正的状态与算法都在 TreeStore 里，两种消费方式共用同一份 store。
 */
export interface TreeInstance {
  filter: (value: FilterValue) => void;
  getNodeKey: (node: TreeNode) => string | number;
  getNodePath: (data: TreeKey | TreeNodeData) => TreeNodeData[];
  getCheckedNodes: (
    leafOnly?: boolean,
    includeHalfChecked?: boolean,
  ) => TreeNodeData[];
  getCheckedKeys: (leafOnly?: boolean) => TreeKey[];
  getCurrentNode: () => TreeNodeData | null;
  getCurrentKey: () => TreeKey | null;
  setCheckedNodes: (
    nodes: Array<TreeNode | TreeNodeData>,
    leafOnly?: boolean,
  ) => void;
  setCheckedKeys: (keys: TreeKey[], leafOnly?: boolean) => void;
  setChecked: (
    data: TreeKey | TreeNodeData,
    checked: boolean,
    deep?: boolean,
  ) => void;
  getHalfCheckedNodes: () => TreeNodeData[];
  getHalfCheckedKeys: () => TreeKey[];
  setCurrentNode: (node: TreeNode, shouldAutoExpandParent?: boolean) => void;
  setCurrentKey: (
    key?: TreeKey | null,
    shouldAutoExpandParent?: boolean,
  ) => void;
  getNode: (data: TreeKey | TreeNodeData) => TreeNode | null;
  remove: (data: TreeNodeData | TreeNode) => void;
  append: (
    data: TreeNodeData,
    parentNode: TreeNodeData | TreeKey | TreeNode,
  ) => void;
  insertBefore: (
    data: TreeNodeData,
    refNode: TreeKey | TreeNodeData | TreeNode,
  ) => void;
  insertAfter: (
    data: TreeNodeData,
    refNode: TreeKey | TreeNodeData | TreeNode,
  ) => void;
  updateKeyChildren: (key: TreeKey, data: TreeData) => void;
}

/** ElTree 的 ref 类型，与 onReady 下发的句柄同构。 */
export type TreeRef = TreeInstance;
