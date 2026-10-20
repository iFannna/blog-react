"use client";

import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";

import { isEqual } from "../utils";
import { CascaderMenu } from "./CascaderMenu";
import { CascaderPanelContextKey } from "./context";
import { resolveConfig } from "./config";
import { PanelController } from "./panel-controller";
import { checkNode, getMenuIndex } from "./utils";

import type Node from "./node";
import type {
  CascaderConfig,
  CascaderMenuHandle,
  CascaderOption,
  CascaderPanelContext,
  CascaderPanelHandle,
  CascaderPropsConfig,
  CascaderValue,
  RenderLabel,
} from "./types";

const EMPTY_OPTIONS: CascaderOption[] = [];
const EMPTY_CONFIG: CascaderPropsConfig = {};

export interface ElCascaderPanelProps {
  /** 选中值，对应官方 model-value */
  value?: CascaderValue | null;
  options?: CascaderOption[];
  /** 节点字段与交互配置，对应官方 props */
  props?: CascaderPropsConfig;
  border?: boolean;
  renderLabel?: RenderLabel;
  empty?: ReactNode;
  virtualScroll?: boolean;
  itemSize?: number;
  height?: number;
  style?: CSSProperties;
  onChange?: (value: CascaderValue | null) => void;
  onClose?: () => void;
  onExpandChange?: (value: CascaderValue) => void;
  /** 勾选状态快照，供 Cascader 计算标签与展示文本 */
  onCheckedNodesChange?: (checkedNodes: Node[], allCheckedNodes: Node[]) => void;
  ref?: Ref<CascaderPanelHandle>;
}

/**
 * 按值比较配置字段。内联对象只要字段值不变就不重建 store，
 * 函数字段按引用比较——demo 中它们通常定义在组件外，引用稳定。
 */
const sameConfig = (left: CascaderPropsConfig, right: CascaderPropsConfig) => {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    if (
      left[key as keyof CascaderPropsConfig] !==
      right[key as keyof CascaderPropsConfig]
    ) {
      return false;
    }
  }
  return true;
};

/** 浅比较数组元素引用，避免父组件每次渲染的等价 options 触发 store 重建。 */
const sameArrayRefs = <T,>(left: T[], right: T[]) => {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  return left.every((item, index) => item === right[index]);
};

/**
 * 对应官方 ElCascaderPanel。
 *
 * 面板状态放在 PanelController 中，组件通过 useSyncExternalStore 订阅版本号；
 * 菜单、节点与键盘交互的 DOM 结构逐条对齐官方模板。
 */
export function ElCascaderPanel({
  value = null,
  options = EMPTY_OPTIONS,
  props: propsConfig = EMPTY_CONFIG,
  border = true,
  renderLabel,
  empty,
  virtualScroll = false,
  itemSize = 34,
  height = 204,
  style,
  onChange,
  onClose,
  onExpandChange,
  onCheckedNodesChange,
  ref,
}: ElCascaderPanelProps) {
  // options 用元素引用比较，避免父组件传入等价新数组时重建 store
  const [stableOptions, setStableOptions] = useState(options);
  if (!sameArrayRefs(stableOptions, options)) setStableOptions(options);

  const [configSource, setConfigSource] = useState(propsConfig);
  if (!sameConfig(configSource, propsConfig)) {
    setConfigSource(propsConfig);
  }

  const config = useMemo<CascaderConfig>(
    () => resolveConfig(configSource),
    [configSource],
  );

  const menuHandlesRef = useRef<(CascaderMenuHandle | null)[]>([]);

  // options / config 变化时重建 controller（等价官方 watch 中的 initStore），
  // value 只作为重建时的初始值，不参与比较，避免勾选时整棵 store 重建
  const [controller, setController] = useState(
    () => new PanelController(stableOptions, config, value),
  );
  if (controller.options !== stableOptions || controller.config !== config) {
    setController(new PanelController(stableOptions, config, value));
  }

  // 订阅 controller 的变更计数，节点状态的原地修改由 notify 广播
  useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );

  // 外部 value 变化时同步勾选与菜单状态
  useEffect(() => {
    if (!controller.initialLoaded) return;
    if (isEqual(value, controller.checkedValue)) return;
    controller.handleModelValueChange(value);
  }, [value, controller]);

  // 挂载后加载懒加载的根节点（SSR 阶段不发起请求）
  useEffect(() => {
    controller.loadLazyRootNodes();
  }, [controller]);

  // 勾选状态是 controller 内的可变数据，向使用方同步一份快照
  useEffect(() => {
    onCheckedNodesChange?.(
      controller.checkedNodes,
      controller.getCheckedNodes(false),
    );
  }, [controller, controller.version, onCheckedNodesChange]);

  const scrollToExpandingNode = () => {
    scrollMenusToExpanding(menuHandlesRef.current, virtualScroll);
  };

  // 对应官方 store 的 onAfterSync：每次菜单同步后滚动到展开节点
  useEffect(() => {
    const timer = window.setTimeout(() => {
      scrollMenusToExpanding(menuHandlesRef.current, virtualScroll);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [controller, controller.syncVersion, virtualScroll]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const code = event.key;

    switch (code) {
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        const distance = code === "ArrowUp" ? -1 : 1;

        if (virtualScroll) {
          const menuIndex = getMenuIndex(target);
          const menu = menuHandlesRef.current[menuIndex];
          if (menu) {
            const currentIndex = menu.getNodeIndexById(target.id);
            if (currentIndex >= 0) {
              const nodesInMenu = controller.menus[menuIndex] ?? [];
              const nodesCount = nodesInMenu.length;
              let targetIndex = currentIndex + distance;
              while (targetIndex >= 0 && targetIndex < nodesCount) {
                if (!nodesInMenu[targetIndex].isDisabled) {
                  menu.focusNodeAt(targetIndex);
                  return;
                }
                targetIndex += distance;
              }
            }
          }
        }

        focusSibling(
          target,
          distance,
          '.el-cascader-node[tabindex="-1"]',
        );
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const preMenu = menuHandlesRef.current[getMenuIndex(target) - 1];
        const expandedNode = preMenu
          ?.getElement()
          ?.querySelector<HTMLElement>(
            '.el-cascader-node[aria-expanded="true"]',
          );
        expandedNode?.focus();
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const nextMenu = menuHandlesRef.current[getMenuIndex(target) + 1];
        const firstNode = nextMenu
          ?.getElement()
          ?.querySelector<HTMLElement>('.el-cascader-node[tabindex="-1"]');
        firstNode?.focus();
        break;
      }
      case "Enter":
      case "NumpadEnter":
        checkNode(target);
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    menus: controller.menus,
    checkedNodes: controller.checkedNodes,
    getFlattedNodes: (leafOnly: boolean) =>
      controller.getFlattedNodes(leafOnly),
    getCheckedNodes: (leafOnly: boolean) => controller.getCheckedNodes(leafOnly),
    clearCheckedNodes: () => {
      controller.clearCheckedNodes({ onChange, onExpandChange });
    },
    calculateCheckedValue: () => {
      controller.calculateCheckedValue({ onChange });
    },
    handleCheckChange: (node: Node, checked: boolean, emitClose?: boolean) => {
      controller.handleCheckChange(node, checked, emitClose, {
        onChange,
        onClose,
      });
    },
    scrollToExpandingNode,
    loadLazyRootNodes: () => controller.loadLazyRootNodes(),
  }));

  const contextValue: CascaderPanelContext = {
    config: controller.config,
    expandingNode: controller.expandingNode,
    checkedNodes: controller.checkedNodes,
    isHoverMenu: controller.config.expandTrigger === "hover",
    initialLoaded: controller.initialLoaded,
    renderLabel,
    virtualScroll,
    itemSize,
    height,
    lazyLoad: (node, cb) => {
      if (node) controller.lazyLoad(node, cb);
      else controller.loadLazyRootNodes();
    },
    expandNode: (node, silent) =>
      controller.expandNode(node, silent, { onExpandChange }),
    handleCheckChange: (node, checked, emitClose) => {
      controller.handleCheckChange(node, checked, emitClose, {
        onChange,
        onClose,
      });
    },
  };

  return (
    <CascaderPanelContextKey.Provider value={contextValue}>
      <div
        className={["el-cascader-panel", border && "is-bordered"]
          .filter(Boolean)
          .join(" ")}
        style={style}
        onKeyDown={handleKeyDown}
      >
        {controller.menus.map((menu, index) => (
          <CascaderMenu
            key={index}
            index={index}
            nodes={[...menu]}
            virtualScroll={virtualScroll}
            itemSize={itemSize}
            height={height}
            empty={empty}
            ref={(handle) => {
              menuHandlesRef.current[index] = handle;
            }}
          />
        ))}
      </div>
    </CascaderPanelContextKey.Provider>
  );
}

function scrollMenusToExpanding(
  menus: (CascaderMenuHandle | null)[],
  virtualScroll: boolean,
) {
  if (typeof window === "undefined") return;

  menus.forEach((menu) => {
    if (!menu) return;
    const el = menu.getElement();
    if (!el) return;

    if (virtualScroll) {
      const activeIndex = menu.getActiveNodeIndex();
      if (activeIndex >= 0) menu.scrollToItem(activeIndex);
      return;
    }

    let activeNode = el.querySelector<HTMLElement>(
      ".el-cascader-node.in-active-path",
    );
    if (!activeNode) {
      const activeElements =
        el.querySelectorAll<HTMLElement>(".el-cascader-node.is-active");
      activeNode = activeElements[activeElements.length - 1] ?? null;
    }
    if (activeNode) el.scrollTop = activeNode.offsetTop;
  });
}

function focusSibling(
  target: HTMLElement,
  distance: number,
  selector: string,
) {
  const parent = target.parentNode as HTMLElement | null;
  if (!parent) return;

  const siblings = Array.from(
    parent.querySelectorAll<HTMLElement>(selector),
  ).filter((item) => item.parentNode === parent);
  const index = siblings.indexOf(target);
  siblings[index + distance]?.focus();
}
