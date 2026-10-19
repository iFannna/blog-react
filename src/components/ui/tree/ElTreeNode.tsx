"use client";

import { useEffect, useRef, useState } from "react";
import { ElIcon } from "../icon/ElIcon";
import { CaretRight, Loading } from "../icons";
import { ElCheckbox } from "../checkbox";
import { CollapseTransition } from "./collapse-transition";
import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from "./utils";
import { useTreeScope } from "./context";
import Node from "./model/node";
import type { NodeClassValue, TreeKey } from "./types";

export interface ElTreeNodeProps {
  node: Node;
}

/**
 * 对应官方 ElTreeNode。
 *
 * 官方靠 Vue reactive 让 node 上的状态变化自动重渲当前节点组件，
 * React 没有等价物，这里由 ElTree 在 store 变更时整树重渲。
 * 节点树通常有限，换来实现上的直接与正确性，不做细粒度订阅。
 */
function ElTreeNodeInner({ node }: ElTreeNodeProps) {
  const { props, store, dragEvents, registerNodeEl, currentNodeRef } =
    useTreeScope();
  const elRef = useRef<HTMLDivElement>(null);
  /**
   * 对应官方 childNodeRendered：首次展开后一直保留子节点 DOM，只靠 max-height
   * 切换显隐，收起时才播得动折叠动画。这里用「渲染期派生状态」的写法
   * （React 允许在渲染中直接 setState 自身），避免在 render 里读 ref。
   * 必须写在提前 return 之前以保持 Hooks 顺序稳定。
   */
  const [childNodeRendered, setChildNodeRendered] = useState(node.expanded);
  if (node.expanded && !childNodeRendered) {
    setChildNodeRendered(true);
  }

  // 拖拽落点判定需要拿节点根元素的 DOM 几何，挂载时登记、卸载时注销
  useEffect(() => {
    registerNodeEl(node, elRef.current);
    return () => registerNodeEl(node, null);
  }, [node, registerNodeEl]);

  if (node.visible === false) return null;

  const expanded = node.expanded;
  const nodeKey = props.nodeKey
    ? getNodeKeyUtil(props.nodeKey, node.data)
    : node.id;

  // 对应官方 getNodeClass：props.class 返回字符串或对象
  const nodeClass = (() => {
    const nodeClassFunc = props.props.class;
    if (!nodeClassFunc) return "";
    const value: NodeClassValue = nodeClassFunc(node.data, node);
    if (typeof value === "string") return value;
    return Object.keys(value)
      .filter((key) => value[key])
      .join(" ");
  })();

  const contentStyle = { paddingLeft: `${(node.level - 1) * props.indent}px` };

  const handleExpandIconClick = () => {
    if (node.isLeaf) return;
    if (expanded) {
      props.onNodeCollapse?.(node.data, node);
      node.collapse();
      return;
    }
    node.expand(() => {
      // 对应官方 useNodeExpandEventBroadcast：accordion 下同层只留一个展开
      if (props.accordion && node.parent) {
        node.parent.childNodes.forEach((sibling) => {
          if (sibling !== node) sibling.collapse();
        });
      }
      props.onNodeExpand?.(node.data, node);
    });
  };

  const handleCheckChange = (value: boolean) => {
    const checkStrictly = props.checkStrictly;
    const childNodes = node.childNodes;
    let nextValue = value;
    if (!checkStrictly && childNodes.length) {
      nextValue = childNodes.some((child) => !child.isEffectivelyChecked);
    }
    node.setChecked(nextValue, !checkStrictly);
    // 官方在 nextTick 后派发 check，此时父子联动已算完
    queueMicrotask(() => {
      props.onCheck?.(node.data, {
        checkedNodes: store.getCheckedNodes(),
        checkedKeys: store.getCheckedKeys(),
        halfCheckedNodes: store.getHalfCheckedNodes(),
        halfCheckedKeys: store.getHalfCheckedKeys(),
      });
      props.onCheckChange?.(node.data, node.checked, node.indeterminate);
    });
  };

  const handleClick = (event: React.MouseEvent) => {
    handleCurrentChange(
      store,
      (data, current) => props.onCurrentChange?.(data, current),
      () => {
        if (props.nodeKey) {
          const curNodeKey = getNodeKeyUtil(props.nodeKey, node.data);
          store.setCurrentNodeKey(curNodeKey as TreeKey);
        } else {
          store.setCurrentNode(node);
        }
      },
    );
    currentNodeRef.current = node;

    if (props.expandOnClickNode) {
      handleExpandIconClick();
    }

    if (
      (props.checkOnClickNode ||
        (node.isLeaf && props.checkOnClickLeaf && props.showCheckbox)) &&
      !node.disabled
    ) {
      handleCheckChange(!node.checked);
    }
    props.onNodeClick?.(node.data, node, event);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    if (props.onNodeContextmenu) {
      event.stopPropagation();
      event.preventDefault();
    }
    props.onNodeContextmenu?.(event, node.data, node);
  };

  const handleDragStart = (event: React.DragEvent) => {
    event.stopPropagation();
    if (!props.draggable) return;
    dragEvents.dragStart({ event: event.nativeEvent, node });
  };

  const handleDragOver = (event: React.DragEvent) => {
    // 官方在 dragover 上 preventDefault 才能成为有效落点，故不按 draggable 提前返回
    event.preventDefault();
    event.stopPropagation();
    if (!props.draggable) return;
    dragEvents.dragOver({
      event: event.nativeEvent,
      node,
      el: event.currentTarget as HTMLElement,
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnd = (event: React.DragEvent) => {
    event.stopPropagation();
    if (!props.draggable) return;
    dragEvents.dragEnd(event.nativeEvent);
  };

  const content = props.renderContent
    ? props.renderContent({ node, data: node.data, store })
    : props.children
      ? props.children({ node, data: node.data, store })
      : <span className="el-tree-node__label">{node.label}</span>;

  const rootClasses = [
    "el-tree-node",
    expanded && "is-expanded",
    node.isCurrent && "is-current",
    !node.visible && "is-hidden",
    !node.disabled && "is-focusable",
    !node.disabled && node.checked && "is-checked",
    nodeClass,
  ]
    .filter(Boolean)
    .join(" ");

  const expandIconClasses = [
    "el-tree-node__expand-icon",
    node.isLeaf && "is-leaf",
    !node.isLeaf && expanded && "expanded",
  ]
    .filter(Boolean)
    .join(" ");

  // 对应官方 childNodeRendered：首次展开后一直保留子节点 DOM，
  // 对应官方 v-if="!renderAfterExpand || childNodeRendered"
  const renderChildren = !props.renderAfterExpand || childNodeRendered;

  return (
    <div
      ref={elRef}
      className={rootClasses}
      role="treeitem"
      tabIndex={-1}
      aria-selected={node.isCurrent}
      aria-expanded={expanded}
      aria-disabled={node.disabled}
      aria-checked={node.checked}
      data-key={nodeKey}
      draggable={props.draggable || undefined}
      onClick={(event) => {
        event.stopPropagation();
        // 官方在复选框上 @click.stop，点复选框不应连带触发节点的选中/展开/勾选
        const target = event.target as HTMLElement;
        if (target.closest?.(".el-checkbox")) return;
        handleClick(event);
      }}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
    >
      <div className="el-tree-node__content" style={contentStyle}>
        <ElIcon
          className={expandIconClasses}
          onClick={(event) => {
            event.stopPropagation();
            handleExpandIconClick();
          }}
        >
          {props.icon ?? <CaretRight />}
        </ElIcon>

        {props.showCheckbox && (
          <ElCheckbox
            checked={node.checked}
            indeterminate={node.indeterminate}
            disabled={!!node.disabled}
            onCheckedChange={handleCheckChange}
          />
        )}

        {node.loading && (
          <ElIcon className="el-tree-node__loading-icon is-loading">
            <Loading />
          </ElIcon>
        )}

        {content}
      </div>

      {renderChildren && (
        <CollapseTransition
          vShow={expanded}
          className="el-tree-node__children"
          role="group"
        >
          {node.childNodes.map((child) => (
            <ElTreeNode
              key={
                props.nodeKey
                  ? String(getNodeKeyUtil(props.nodeKey, child.data))
                  : child.id
              }
              node={child}
            />
          ))}
        </CollapseTransition>
      )}
    </div>
  );
}

/** 节点递归渲染。不做 memo：节点状态是可变对象，props 引用不变但内容会变。 */
export const ElTreeNode = ElTreeNodeInner;
