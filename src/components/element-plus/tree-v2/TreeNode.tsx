"use client";

import {
  createElement,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ElCheckbox } from "../checkbox";
import { ElIcon } from "../icon/ElIcon";
import { CaretRight } from "../generated/icons";

import { ElTreeNodeContent } from "./TreeNodeContent";

import type {
  TreeIcon,
  TreeNode as TreeNodeShape,
  TreeNodeRenderParams,
  TreeOptionProps,
} from "./types";

export interface ElTreeNodeProps {
  node: TreeNodeShape;
  expanded?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  showCheckbox?: boolean;
  disabled?: boolean;
  current?: boolean;
  hiddenExpandIcon?: boolean;
  itemSize?: number;
  indent?: number;
  icon?: TreeIcon;
  nodeClass?: TreeOptionProps["class"];
  style?: CSSProperties;
  renderContent?: (params: TreeNodeRenderParams) => ReactNode;
  onClick?: (node: TreeNodeShape, event: MouseEvent) => void;
  onToggle?: (node: TreeNodeShape) => void;
  onCheck?: (node: TreeNodeShape, checked: boolean) => void;
  onDrop?: (node: TreeNodeShape, event: DragEvent) => void;
  onContextMenu?: (node: TreeNodeShape, event: Event) => void;
}

function getNodeClass(
  node: TreeNodeShape,
  nodeClass: TreeOptionProps["class"],
): string[] {
  if (!nodeClass) return [];

  const value =
    typeof nodeClass === "function"
      ? nodeClass(node.data, node)
      : nodeClass;

  if (typeof value === "string") return value ? [value] : [];
  if (value && typeof value === "object") {
    return Object.keys(value).filter(
      (key) => (value as Record<string, boolean>)[key],
    );
  }
  return [];
}

/** 对应官方 tree-node.vue。 */
export function ElTreeNode({
  node,
  expanded = false,
  checked = false,
  indeterminate = false,
  showCheckbox = false,
  disabled = false,
  current = false,
  hiddenExpandIcon = false,
  itemSize = 26,
  indent = 16,
  icon,
  nodeClass,
  style,
  renderContent,
  onClick,
  onToggle,
  onCheck,
  onDrop,
  onContextMenu,
}: ElTreeNodeProps) {
  const customClasses = getNodeClass(node, nodeClass);

  const classes = [
    "el-tree-node",
    expanded && "is-expanded",
    current && "is-current",
    !disabled && "is-focusable",
    !disabled && checked && "is-checked",
    ...customClasses,
  ]
    .filter(Boolean)
    .join(" ");

  const expandIconClasses = [
    "el-tree-node__expand-icon",
    node.isLeaf && "is-leaf",
    hiddenExpandIcon && "is-hidden",
    !node.isLeaf && expanded && "expanded",
  ]
    .filter(Boolean)
    .join(" ");

  const renderedIcon =
    typeof icon === "function"
      ? createElement(icon as ComponentType)
      : (icon ?? <CaretRight />);

  return (
    <div
      className={classes}
      style={style}
      role="treeitem"
      tabIndex={-1}
      aria-expanded={expanded}
      aria-disabled={disabled}
      aria-checked={checked}
      aria-selected={current}
      data-key={node.key}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(node, event.nativeEvent);
      }}
      onContextMenu={(event) => {
        if (onContextMenu) {
          event.stopPropagation();
          event.preventDefault();
          onContextMenu(node, event.nativeEvent);
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.stopPropagation();
        onDrop?.(node, event.nativeEvent);
      }}
    >
      <div
        className="el-tree-node__content"
        style={{
          paddingLeft: `${(node.level - 1) * indent}px`,
          height: `${itemSize}px`,
        }}
        // 官方在 checkbox 根节点上 @click.stop；ElCheckbox 只把 onClick 透传给
        // input，label 的冒泡仍会触发节点的展开/选中，因此在内容层拦截一次。
        onClick={(event) => {
          if ((event.target as HTMLElement).closest(".el-checkbox")) {
            event.stopPropagation();
          }
        }}
      >
        <ElIcon
          className={expandIconClasses}
          onClick={(event) => {
            event.stopPropagation();
            onToggle?.(node);
          }}
        >
          {renderedIcon}
        </ElIcon>
        {showCheckbox && (
          <ElCheckbox
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            onCheckedChange={(value) => onCheck?.(node, value)}
          />
        )}
        <ElTreeNodeContent
          node={{ ...node, expanded }}
          renderContent={renderContent}
        />
      </div>
    </div>
  );
}
