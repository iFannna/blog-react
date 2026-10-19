"use client";

import type { ReactNode } from "react";

import { ElText } from "../text";

import type { TreeNode, TreeNodeRenderParams } from "./types";

export interface ElTreeNodeContentProps {
  node: TreeNode;
  renderContent?: (params: TreeNodeRenderParams) => ReactNode;
}

/** 对应官方 tree-node-content：有 default 插槽走插槽，否则渲染截断文本。 */
export function ElTreeNodeContent({
  node,
  renderContent,
}: ElTreeNodeContentProps) {
  if (renderContent) {
    return <>{renderContent({ node, data: node.data })}</>;
  }

  return (
    <ElText tag="span" truncated className="el-tree-node__label">
      {node.label}
    </ElText>
  );
}
