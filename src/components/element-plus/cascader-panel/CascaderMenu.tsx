"use client";

import {
  useId,
  useImperativeHandle,
  useRef,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from "react";

import { ElIcon } from "../icon/ElIcon";
import { ElScrollbar } from "../scrollbar";
import { ElFixedSizeList } from "../virtual-list";
import { Loading } from "../generated/icons";
import { useTranslator } from "../config-provider/context";
import { clamp } from "../utils";
import { CascaderNode } from "./CascaderNode";
import { useCascaderPanelContext } from "./context";

import type { ScrollbarExpose } from "../scrollbar";
import type { VirtualListHandle } from "../virtual-list";
import type { CascaderMenuHandle } from "./types";

export interface CascaderMenuProps {
  nodes: import("./node").default[];
  index: number;
  virtualScroll?: boolean;
  itemSize: number;
  height: number;
  empty?: ReactNode;
  ref?: Ref<CascaderMenuHandle>;
}

/** 对应官方 cascader-panel/src/menu.vue。 */
export function CascaderMenu({
  nodes,
  index,
  virtualScroll = false,
  itemSize,
  height,
  empty,
  ref,
}: CascaderMenuProps) {
  const panel = useCascaderPanelContext();
  const t = useTranslator();
  const rawId = useId().replace(/[^\w-]/g, "");
  const menuId = `el-cascader-menu-${rawId}-${index}`;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollbarRef = useRef<ScrollbarExpose | null>(null);
  const virtualListRef = useRef<VirtualListHandle | null>(null);
  const hoverZoneRef = useRef<SVGSVGElement | null>(null);
  const activeNodeRef = useRef<HTMLElement | null>(null);
  const hoverTimerRef = useRef<number | undefined>(undefined);

  const isEmpty = !nodes.length;
  const isLoading = !panel.initialLoaded;

  const getElement = (): HTMLElement | null => {
    if (virtualScroll) return rootRef.current;
    return scrollbarRef.current?.wrapRef.current ?? null;
  };

  const getActiveNodeIndex = () => {
    let activeNodeId: number | undefined;

    if (panel.expandingNode) {
      const { level, pathNodes } = panel.expandingNode;
      if (index < level) {
        activeNodeId = pathNodes[index]?.uid;
      } else if (index === level && panel.checkedNodes.length > 0) {
        activeNodeId = panel.checkedNodes[0]?.pathNodes[index]?.uid;
      }
    } else if (
      panel.checkedNodes.length > 0 &&
      index < panel.checkedNodes[0].pathNodes.length
    ) {
      activeNodeId = panel.checkedNodes[0].pathNodes[index]?.uid;
    }

    return activeNodeId !== undefined
      ? nodes.findIndex((node) => node.uid === activeNodeId)
      : -1;
  };

  const getNodeIndexById = (nodeId: string | undefined) => {
    if (!nodeId) return -1;
    return nodes.findIndex((node) => `${menuId}-${node.uid}` === nodeId);
  };

  const scrollToItem = (targetIndex: number) => {
    const next = clamp(targetIndex, 0, nodes.length - 1);
    virtualListRef.current?.scrollToItem(next);
  };

  const focusNodeAt = (target: number) => {
    if (!nodes.length) return;
    const next = clamp(target, 0, nodes.length - 1);
    scrollToItem(next);
    window.setTimeout(() => {
      const node = getElement()?.querySelector<HTMLElement>(
        `#${menuId}-${nodes[next].uid}`,
      );
      node?.focus();
    }, 0);
  };

  useImperativeHandle(ref, () => ({
    getActiveNodeIndex,
    getNodeIndexById,
    scrollToItem,
    focusNodeAt,
    getElement,
  }));

  const clearHoverTimer = () => {
    if (!hoverTimerRef.current) return;
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = undefined;
  };

  const clearHoverZone = () => {
    if (!hoverZoneRef.current) return;
    hoverZoneRef.current.innerHTML = "";
    clearHoverTimer();
  };

  const handleExpand = (event: SyntheticEvent) => {
    activeNodeRef.current = event.target as HTMLElement;
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const hoverZone = hoverZoneRef.current;
    const activeNode = activeNodeRef.current;
    const el = getElement();
    if (!panel.isHoverMenu || !activeNode || !hoverZone || !el) return;

    if (activeNode.contains(event.target as HTMLElement)) {
      clearHoverTimer();

      const { left } = el.getBoundingClientRect();
      const { offsetWidth, offsetHeight } = el;
      const startX = event.clientX - left;
      const top = activeNode.offsetTop;
      const bottom = top + activeNode.offsetHeight;

      const scrollTop = virtualScroll
        ? virtualListRef.current?.states?.scrollOffset || 0
        : scrollbarRef.current?.wrapRef.current?.scrollTop || 0;

      hoverZone.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${top} L${offsetWidth} ${scrollTop} V${top} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${bottom} L${offsetWidth} ${offsetHeight + scrollTop} V${bottom} Z" />
        `;
    } else if (!hoverTimerRef.current) {
      hoverTimerRef.current = window.setTimeout(
        clearHoverZone,
        panel.config.hoverThreshold,
      );
    }
  };

  if (virtualScroll) {
    return (
      <div
        ref={rootRef}
        className="el-cascader-menu"
        onMouseMove={handleMouseMove}
        onMouseLeave={clearHoverZone}
      >
        <ElFixedSizeList
          ref={virtualListRef}
          height={height}
          itemSize={itemSize}
          data={nodes}
          total={nodes.length}
          className="el-cascader-menu__list"
          innerElement="ul"
          innerProps={{
            role: "menu",
            className: ["el-cascader-menu__list", isEmpty && "is-empty"]
              .filter(Boolean)
              .join(" "),
          }}
        >
          {({ index: nodeIndex, style }) => (
            <CascaderNode
              key={nodes[nodeIndex].uid}
              node={nodes[nodeIndex]}
              menuId={menuId}
              style={style}
              onExpand={handleExpand}
            />
          )}
        </ElFixedSizeList>
        {isLoading ? (
          <div className="el-cascader-menu__empty-text">
            <ElIcon size={14} className="is-loading">
              <Loading />
            </ElIcon>
            {t("el.cascader.loading")}
          </div>
        ) : isEmpty ? (
          <div className="el-cascader-menu__empty-text">
            {empty ?? t("el.cascader.noData")}
          </div>
        ) : panel.isHoverMenu ? (
          <svg ref={hoverZoneRef} className="el-cascader-menu__hover-zone" />
        ) : null}
      </div>
    );
  }

  return (
    <ElScrollbar
      ref={scrollbarRef}
      tag="ul"
      role="menu"
      className="el-cascader-menu"
      wrapClass="el-cascader-menu__wrap"
      viewClass={["el-cascader-menu__list", isEmpty && "is-empty"]
        .filter(Boolean)
        .join(" ")}
      onMouseMove={(event) =>
        handleMouseMove(event as unknown as MouseEvent<HTMLElement>)
      }
      onMouseLeave={clearHoverZone}
    >
      {nodes.map((node) => (
        <CascaderNode
          key={node.uid}
          node={node}
          menuId={menuId}
          onExpand={handleExpand}
        />
      ))}
      {isLoading ? (
        <div className="el-cascader-menu__empty-text">
          <ElIcon size={14} className="is-loading">
            <Loading />
          </ElIcon>
          {t("el.cascader.loading")}
        </div>
      ) : isEmpty ? (
        <div className="el-cascader-menu__empty-text">
          {empty ?? t("el.cascader.noData")}
        </div>
      ) : panel.isHoverMenu ? (
        <svg ref={hoverZoneRef} className="el-cascader-menu__hover-zone" />
      ) : null}
    </ElScrollbar>
  );
}
