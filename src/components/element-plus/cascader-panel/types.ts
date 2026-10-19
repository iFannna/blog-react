import type { CSSProperties, ReactNode } from "react";

import type Node from "./node";

export type CascaderNodeValue = string | number | Record<string, unknown>;
export type CascaderNodePathValue = CascaderNodeValue[];
export type CascaderValue =
  | CascaderNodeValue
  | CascaderNodePathValue
  | (CascaderNodeValue | CascaderNodePathValue)[];

export type ExpandTrigger = "click" | "hover";
export type IsDisabled = (data: CascaderOption, node: Node) => boolean;
export type IsLeaf = (data: CascaderOption, node: Node) => boolean;
export type Resolve = (dataList?: CascaderOption[]) => void;
export type LazyLoad = (
  node: Node,
  resolve: Resolve,
  reject: () => void,
) => void;

export interface RenderLabelProps {
  node: Node;
  data: CascaderOption;
}
export type RenderLabel = (props: RenderLabelProps) => ReactNode;

export interface CascaderOption extends Record<string, unknown> {
  label?: string;
  value?: CascaderNodeValue;
  children?: CascaderOption[];
  disabled?: boolean;
  leaf?: boolean;
}

export interface CascaderPropsConfig {
  expandTrigger?: ExpandTrigger;
  multiple?: boolean;
  checkStrictly?: boolean;
  emitPath?: boolean;
  lazy?: boolean;
  lazyLoad?: LazyLoad;
  value?: string;
  label?: string;
  children?: string;
  disabled?: string | IsDisabled;
  leaf?: string | IsLeaf;
  hoverThreshold?: number;
  checkOnClickNode?: boolean;
  checkOnClickLeaf?: boolean;
  showPrefix?: boolean;
}

export type CascaderConfig = Required<CascaderPropsConfig>;

export interface Tag {
  node?: Node;
  key: number;
  text: string;
  hitState?: boolean;
  closable: boolean;
}

/** 面板通过 Context 提供给菜单与节点。 */
export interface CascaderPanelContext {
  config: CascaderConfig;
  expandingNode: Node | undefined;
  checkedNodes: Node[];
  isHoverMenu: boolean;
  initialLoaded: boolean;
  renderLabel?: RenderLabel;
  virtualScroll: boolean;
  itemSize: number;
  height: number;
  lazyLoad: (node?: Node, cb?: Resolve) => void;
  expandNode: (node: Node, silent?: boolean) => void;
  handleCheckChange: (node: Node, checked: boolean, emitClose?: boolean) => void;
}

export interface CascaderMenuHandle {
  getActiveNodeIndex: () => number;
  getNodeIndexById: (nodeId: string | undefined) => number;
  scrollToItem: (index: number) => void;
  focusNodeAt: (index: number) => void;
  getElement: () => HTMLElement | null;
}

export interface CascaderPanelHandle {
  menus: Node[][];
  checkedNodes: Node[];
  getFlattedNodes: (leafOnly: boolean) => Node[];
  getCheckedNodes: (leafOnly: boolean) => Node[];
  clearCheckedNodes: () => void;
  calculateCheckedValue: () => void;
  handleCheckChange: (node: Node, checked: boolean, emitClose?: boolean) => void;
  scrollToExpandingNode: () => void;
  loadLazyRootNodes: () => void;
}

export interface CascaderMenuProps {
  nodes: Node[];
  index: number;
  virtualScroll: boolean;
  itemSize: number;
  height: number;
  empty?: ReactNode;
  onExpand?: (event: React.MouseEvent) => void;
  menuRef?: (handle: CascaderMenuHandle | null) => void;
}

export interface CascaderNodeStyle {
  style?: CSSProperties;
}
