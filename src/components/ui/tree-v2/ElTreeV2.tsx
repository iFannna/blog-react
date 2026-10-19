"use client";

import { useImperativeHandle, type Ref } from "react";

import { useTranslator } from "../config-provider/context";
import { ElFixedSizeList } from "../virtual-list";

import { ElTreeNode } from "./TreeNode";
import { useTree } from "./use-tree";

import type { TreeNode, TreeV2Expose, TreeV2Props } from "./types";

/**
 * 对应官方 tree.vue：扁平化后的节点交给 FixedSizeList 虚拟滚动，
 * 所有节点状态由 use-tree 统一驱动。
 */
export function ElTreeV2({
  ref,
  ...props
}: TreeV2Props & { ref?: Ref<TreeV2Expose> }) {
  const {
    height = 200,
    indent = 16,
    itemSize = 26,
    perfMode = true,
    scrollbarAlwaysOn = false,
    highlightCurrent = false,
    emptyText,
    icon,
    props: optionProps,
    className,
    style,
    children,
    empty,
    onNodeContextmenu,
  } = props;

  const t = useTranslator();
  const {
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
  } = useTree(props);

  useImperativeHandle(ref, () => ({
    toggleCheckbox,
    getCurrentNode,
    getCurrentKey,
    setCurrentKey: (key) => setCurrentKey(key),
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedKeys,
    getHalfCheckedNodes,
    setChecked,
    setCheckedKeys,
    filter,
    setData,
    getNode,
    expandNode,
    collapseNode,
    setExpandedKeys,
    scrollToNode,
    scrollTo,
  }));

  const handleContextMenu = (
    node: TreeNode,
    event: Event,
  ) => {
    onNodeContextmenu?.(event, node.data, node);
  };

  return (
    <div
      className={[
        "el-tree",
        highlightCurrent && "el-tree--highlight-current",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      role="tree"
    >
      {isNotEmpty ? (
        <ElFixedSizeList
          ref={listRef}
          className="el-tree-virtual-list"
          data={flattenTree}
          total={flattenTree.length}
          height={height}
          itemSize={itemSize}
          perfMode={perfMode}
          scrollbarAlwaysOn={scrollbarAlwaysOn}
        >
          {({ data, index, style: itemStyle }) => {
            const node = data[index];
            return (
              <ElTreeNode
                key={node.key}
                style={itemStyle}
                node={node}
                expanded={expandedKeys.has(node.key)}
                showCheckbox={props.showCheckbox}
                checked={isChecked(node)}
                indeterminate={isIndeterminate(node)}
                itemSize={itemSize}
                disabled={isDisabled(node)}
                current={isCurrent(node)}
                hiddenExpandIcon={isForceHiddenExpandIcon(node)}
                indent={indent}
                icon={icon}
                nodeClass={optionProps?.class}
                renderContent={children}
                onClick={handleNodeClick}
                onToggle={toggleExpand}
                onCheck={handleNodeCheck}
                onDrop={handleNodeDrop}
                onContextMenu={
                  onNodeContextmenu ? handleContextMenu : undefined
                }
              />
            );
          }}
        </ElFixedSizeList>
      ) : (
        <div className="el-tree__empty-block">
          {empty ?? (
            <span className="el-tree__empty-text">
              {emptyText ?? t("el.tree.emptyText")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
