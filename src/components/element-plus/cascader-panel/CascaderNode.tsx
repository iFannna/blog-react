"use client";

import type { CSSProperties, SyntheticEvent } from "react";

import { ElCheckbox } from "../checkbox";
import { ElRadio } from "../radio";
import { ElIcon } from "../icon/ElIcon";
import { ArrowRight, Check, Loading } from "../generated/icons";
import { useCascaderPanelContext } from "./context";

import type Node from "./node";

export interface CascaderNodeProps {
  node: Node;
  menuId: string;
  style?: CSSProperties;
  onExpand?: (event: SyntheticEvent) => void;
}

/** 对应官方 cascader-panel/src/node.vue。 */
export function CascaderNode({
  node,
  menuId,
  style,
  onExpand,
}: CascaderNodeProps) {
  const panel = useCascaderPanelContext();
  const { config } = panel;

  const isHoverMenu = panel.isHoverMenu;
  const multiple = config.multiple;
  const checkStrictly = config.checkStrictly;
  const showPrefix = config.showPrefix;
  const checkedNodeId = panel.checkedNodes[0]?.uid;
  const isDisabled = node.isDisabled;
  const isLeaf = node.isLeaf;
  const expandable = (checkStrictly && !isLeaf) || !isDisabled;

  const isInPath = (target: Node | undefined) =>
    target?.pathNodes[node.level - 1]?.uid === node.uid;

  const inExpandingPath = isInPath(panel.expandingNode);
  // only useful in check-strictly mode
  const inCheckedPath =
    checkStrictly && panel.checkedNodes.some((item) => isInPath(item));

  const doExpand = () => {
    if (inExpandingPath) return;
    panel.expandNode(node);
  };

  const doCheck = (checked: boolean) => {
    if (checked === node.checked) return;
    panel.handleCheckChange(node, checked);
  };

  const doLoad = () => {
    panel.lazyLoad(node, () => {
      if (!isLeaf) doExpand();
    });
  };

  const handleExpand = () => {
    // do not exclude leaf node because the menus expanded might have to reset
    if (!expandable || node.loading) return;
    if (node.loaded) doExpand();
    else doLoad();
  };

  const handleHoverExpand = (event: SyntheticEvent) => {
    if (!isHoverMenu) return;
    handleExpand();
    if (!isLeaf) onExpand?.(event);
  };

  const handleCheck = (checked: boolean) => {
    if (!node.loaded) {
      doLoad();
    } else {
      doCheck(checked);
      if (!checkStrictly) doExpand();
    }
  };

  const handleSelectCheck = (checked: boolean) => {
    if (checkStrictly) {
      doCheck(checked);
      if (node.loaded) {
        doExpand();
      }
    } else {
      handleCheck(checked);
    }
  };

  const handleClick = () => {
    if (isLeaf && !isDisabled && !checkStrictly && !multiple) {
      handleCheck(true);
    } else if (
      ((config.checkOnClickNode && (multiple || checkStrictly)) ||
        (isLeaf && config.checkOnClickLeaf)) &&
      !isDisabled
    ) {
      handleSelectCheck(!node.checked);
    } else if (!isHoverMenu) {
      handleExpand();
    }
  };

  const classes = [
    "el-cascader-node",
    checkStrictly && "is-selectable",
    node.checked && "is-active",
    !expandable && "is-disabled",
    inExpandingPath && "in-active-path",
    inCheckedPath && "in-checked-path",
  ]
    .filter(Boolean)
    .join(" ");

  const label = panel.renderLabel
    ? panel.renderLabel({ node, data: node.data })
    : node.label;

  return (
    <li
      id={`${menuId}-${node.uid}`}
      role="menuitem"
      aria-haspopup={!isLeaf}
      aria-owns={isLeaf ? undefined : menuId}
      aria-expanded={inExpandingPath}
      tabIndex={expandable ? -1 : undefined}
      className={classes}
      style={style}
      onMouseEnter={handleHoverExpand}
      onFocus={handleHoverExpand}
      onClick={handleClick}
    >
      {multiple && showPrefix && (
        <ElCheckbox
          checked={node.checked}
          indeterminate={node.indeterminate}
          disabled={isDisabled}
          onCheckedChange={handleSelectCheck}
        />
      )}
      {!multiple && checkStrictly && showPrefix && (
        <ElRadio
          checked={checkedNodeId === node.uid}
          disabled={isDisabled}
          onCheckedChange={() => handleSelectCheck(true)}
        />
      )}
      {!multiple && !checkStrictly && isLeaf && node.checked && (
        <ElIcon className="el-cascader-node__prefix">
          <Check />
        </ElIcon>
      )}

      <span className="el-cascader-node__label">{label}</span>

      {!isLeaf && (
        <>
          {node.loading ? (
            <ElIcon
              className={["is-loading", "el-cascader-node__postfix"]
                .filter(Boolean)
                .join(" ")}
            >
              <Loading />
            </ElIcon>
          ) : (
            <ElIcon className={["arrow-right", "el-cascader-node__postfix"].join(" ")}>
              <ArrowRight />
            </ElIcon>
          )}
        </>
      )}
    </li>
  );
}
