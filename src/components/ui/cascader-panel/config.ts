import type { CascaderConfig, CascaderPropsConfig } from "./types";

export const CASCADER_PANEL_ITEM_SIZE = 34;
export const CASCADER_PANEL_HEIGHT = 204;

export const DefaultProps: CascaderConfig = {
  expandTrigger: "click",
  multiple: false,
  checkStrictly: false,
  emitPath: true,
  lazy: false,
  lazyLoad: () => {},
  value: "value",
  label: "label",
  children: "children",
  leaf: "leaf",
  disabled: "disabled",
  hoverThreshold: 500,
  checkOnClickNode: false,
  checkOnClickLeaf: true,
  showPrefix: true,
};

export function resolveConfig(props?: CascaderPropsConfig): CascaderConfig {
  return { ...DefaultProps, ...props };
}
