"use client";

import { createContext, useContext } from "react";
import type Node from "./model/node";
import type TreeStore from "./model/tree-store";
import type { NodeDropType, TreeData, TreeOptionProps, TreeProps } from "./types";

/** ElTree 下发给 ElTreeNode 的已解析 props：可选值都被填上默认。 */
export interface ResolvedTreeProps extends TreeProps {
  data: TreeData;
  props: TreeOptionProps;
  indent: number;
  renderAfterExpand: boolean;
  expandOnClickNode: boolean;
  checkOnClickNode: boolean;
  checkOnClickLeaf: boolean;
  autoExpandParent: boolean;
  showCheckbox: boolean;
  draggable: boolean;
}

/** 拖拽过程态，对应官方 useDragNodeHandler 里的 dragState。 */
export interface TreeDragState {
  allowDrop: boolean;
  dropType: NodeDropType | null;
  draggingNode: Node | null;
  showDropIndicator: boolean;
  dropNode: Node | null;
}

/** 对应官方通过 provide 注入的 dragEvents。 */
export interface TreeDragEvents {
  dragStart: (options: { event: DragEvent; node: Node }) => void;
  dragOver: (options: {
    event: DragEvent;
    node: Node;
    el: HTMLElement;
  }) => void;
  dragEnd: (event: DragEvent) => void;
}

/** 对应官方 ROOT_TREE_INJECTION_KEY 注入的内容。 */
export interface TreeScope {
  props: ResolvedTreeProps;
  store: TreeStore;
  /** 对应官方 RootTreeType.currentNode，供 ElTreeSelect 之类消费 */
  currentNodeRef: { current: Node | null };
  /** 是否存在 node-contextmenu 监听，决定是否拦截默认右键菜单 */
  hasContextmenuHandler: boolean;
  /** 对应官方 useNodeExpandEventBroadcast 的 broadcastExpanded */
  broadcastExpanded: (node: Node | null) => void;
  dragEvents: TreeDragEvents;
  /** 节点登记自身根元素，拖拽判定需要真实 DOM 几何 */
  registerNodeEl: (node: Node, el: HTMLElement | null) => void;
}

export const TreeContext = createContext<TreeScope | null>(null);

export function useTreeScope(): TreeScope {
  const scope = useContext(TreeContext);
  if (!scope) {
    throw new Error("[Tree] Can not find node's tree.");
  }
  return scope;
}
