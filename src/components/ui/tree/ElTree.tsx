"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createElement } from "react";
import { useTranslator } from "../config-provider/context";
import { ElTreeNode } from "./ElTreeNode";
import { TreeContext, type ResolvedTreeProps, type TreeScope } from "./context";
import TreeStore from "./model/tree-store";
import Node from "./model/node";
import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from "./utils";
import type {
  FilterValue,
  NodeDropType,
  TreeInstance,
  TreeKey,
  TreeProps,
} from "./types";
import type TreeNode from "./model/node";

const DEFAULT_PROPS = {
  children: "children",
  label: "label",
  disabled: "disabled",
} as const;

/**
 * 默认空数组必须是模块级常量。
 * 若写成 `props.data ?? []`，每次渲染都是新引用，同步 data 的 effect 会
 * 在自身重渲后反复触发 setData -> notify -> 重渲，形成死循环。
 */
const EMPTY_DATA: Record<string, unknown>[] = [];

/** 对应官方 treeProps 的默认值。 */
function resolveProps(props: TreeProps): ResolvedTreeProps {
  return {
    ...props,
    data: props.data ?? EMPTY_DATA,
    props: props.props ?? DEFAULT_PROPS,
    indent: props.indent ?? 18,
    renderAfterExpand: props.renderAfterExpand ?? true,
    expandOnClickNode: props.expandOnClickNode ?? true,
    checkOnClickNode: props.checkOnClickNode ?? false,
    checkOnClickLeaf: props.checkOnClickLeaf ?? true,
    autoExpandParent: props.autoExpandParent ?? true,
    showCheckbox: props.showCheckbox ?? false,
    draggable: props.draggable ?? false,
  };
}

/**
 * 对应官方 ElTree。
 *
 * 结构对齐官方模板：
 *   .el-tree[role=tree] > .el-tree-node... + .el-tree__empty-block + .el-tree__drop-indicator
 *
 * 与官方最大的差异是状态驱动方式：官方 store 里的节点是 Vue reactive 对象，
 * 改动即触发重渲；React 没有等价物，改为节点订阅 store 的变更计数
 * （useSyncExternalStore），所有节点状态改动都经 store.notify() 广播。
 * 模型层（Node / TreeStore）的算法逐行对齐官方源码，只把自动响应换成手动广播。
 * 命令式方法经 ref 或 onReady 回调下发。
 */
export const ElTree = forwardRef<TreeInstance, TreeProps>(function ElTree(
  props,
  ref,
) {
  const t = useTranslator();
  const { className, style, emptySlot } = props;

  /**
   * 命令式句柄与 onReady 必须保持引用稳定，否则调用方 setState 保存句柄会
   * 触发「重渲 -> 新句柄 -> setState」的死循环。因此句柄只依赖 store，
   * 内部一律经 propsRef 读最新 props。
   */
  const propsRef = useRef(props);
  propsRef.current = props;

  /**
   * store 只在首次渲染时用初始 props 建，之后一律按「引用 + 最新的原始 props」
   * 取当前值。resolved 每次渲染都重算，但只有字段真的变了才重建 context。
   */
  const resolved = resolveProps(props);

  const rootRef = useRef<HTMLDivElement>(null);
  const dropIndicatorRef = useRef<HTMLDivElement>(null);
  // 对应官方 RootTreeType.currentNode，供 ElTreeSelect 之类消费
  const currentNodeRef = useRef<Node | null>(null);
  // node.id -> 节点根元素，拖拽落点判定需要真实 DOM 几何
  const nodeElMapRef = useRef(new Map<number, HTMLElement>());

  // 首次渲染建 store；后续 props 变化由下面的 effect 同步进去
  const storeRef = useRef<TreeStore | null>(null);
  if (storeRef.current === null) {
    const store = new TreeStore({
      key: resolved.nodeKey,
      data: resolved.data,
      lazy: resolved.lazy ?? false,
      props: resolved.props,
      load: resolved.load,
      currentNodeKey: resolved.currentNodeKey,
      checkStrictly: resolved.checkStrictly ?? false,
      checkDescendants: resolved.checkDescendants ?? false,
      defaultCheckedKeys: resolved.defaultCheckedKeys,
      defaultExpandedKeys: resolved.defaultExpandedKeys,
      autoExpandParent: resolved.autoExpandParent,
      defaultExpandAll: resolved.defaultExpandAll ?? false,
      filterNodeMethod: resolved.filterNodeMethod,
    });
    store.initialize();
    storeRef.current = store;
  }
  const store = storeRef.current;

  // 对应官方 watch(data, { deep: true })
  const dataSyncedRef = useRef(false);
  useEffect(() => {
    // 挂载时 store.initialize 已按初始 data 建好节点，跳过首次以免白跑一遍 updateChildren
    if (!dataSyncedRef.current) {
      dataSyncedRef.current = true;
      return;
    }
    store.setData(propsRef.current.data ?? EMPTY_DATA);
  }, [props.data, store]);

  // 对应官方 watch(checkStrictly)
  useEffect(() => {
    store.checkStrictly = props.checkStrictly ?? false;
    store.notify();
  }, [props.checkStrictly, store]);

  // 对应官方 watch(currentNodeKey)
  useEffect(() => {
    store.setCurrentNodeKey(props.currentNodeKey ?? null);
  }, [props.currentNodeKey, store]);

  // 对应官方 watch(defaultCheckedKeys)
  useEffect(() => {
    store.setDefaultCheckedKey(props.defaultCheckedKeys ?? []);
  }, [props.defaultCheckedKeys, store]);

  // 对应官方 watch(defaultExpandedKeys)
  useEffect(() => {
    store.setDefaultExpandedKeys(props.defaultExpandedKeys ?? []);
  }, [props.defaultExpandedKeys, store]);

  useSyncExternalStore(
    store.subscribe,
    () => store.version,
    () => store.version,
  );

  // 拖拽过程态，对应官方 dragState
  const [dragState, setDragState] = useState<{
    allowDrop: boolean;
    dropType: NodeDropType | null;
    draggingNode: Node | null;
    showDropIndicator: boolean;
    dropNode: Node | null;
  }>({
    allowDrop: true,
    dropType: null,
    draggingNode: null,
    showDropIndicator: false,
    dropNode: null,
  });
  const dragStateRef = useRef(dragState);
  dragStateRef.current = dragState;

  /** 供节点登记根元素，拖拽判定需要真实 DOM 几何。 */
  const registerNodeEl = useCallback((node: Node, el: HTMLElement | null) => {
    if (el) {
      nodeElMapRef.current.set(node.id, el);
    } else {
      nodeElMapRef.current.delete(node.id);
    }
  }, []);

  /** 对应官方 useNodeExpandEventBroadcast：accordion 下同层只留一个展开。 */
  const broadcastExpanded = useCallback(
    (target: Node | null) => {
      if (!propsRef.current.accordion) return;
      const parents = target ? [target.parent] : [store.root];
      parents.forEach((parent) => {
        parent?.childNodes.forEach((sibling) => {
          if (sibling !== target) sibling.collapse();
        });
      });
    },
    [store],
  );

  // 对应官方 useDragNodeHandler。事件处理器里统一经 propsRef 取回调，
  // 这样依赖数组只需 store，避免 context 因回调身份变化而整体重建。
  const dragEvents = useMemo<TreeScope["dragEvents"]>(
    () => ({
      dragStart: ({ event, node }) => {
        if (!event.dataTransfer) return;
        if (propsRef.current.allowDrag && !propsRef.current.allowDrag(node)) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.effectAllowed = "move";
        try {
          // 首个参数必须为 text/plain，否则 Firefox 下拖拽不生效
          event.dataTransfer.setData("text/plain", "");
        } catch {
          // 部分浏览器会拒绝写入，忽略即可
        }
        setDragState((prev) => ({ ...prev, draggingNode: node }));
        propsRef.current.onNodeDragStart?.(node, event);
      },
      dragOver: ({ event, node, el }) => {
        if (!event.dataTransfer) return;
        const prev = dragStateRef.current;
        const oldDropNode = prev.dropNode;
        if (oldDropNode && oldDropNode.id !== node.id) {
          nodeElMapRef.current
            .get(oldDropNode.id)
            ?.classList.remove("is-drop-inner");
        }
        const draggingNode = prev.draggingNode;
        if (!draggingNode) return;

        let dropPrev = true;
        let dropInner = true;
        let dropNext = true;
        let userAllowDropInner = true;
        const currentProps = propsRef.current;
        if (currentProps.allowDrop) {
          dropPrev = currentProps.allowDrop(draggingNode, node, "prev");
          userAllowDropInner = dropInner = currentProps.allowDrop(
            draggingNode,
            node,
            "inner",
          );
          dropNext = currentProps.allowDrop(draggingNode, node, "next");
        }
        event.dataTransfer.dropEffect =
          dropInner || dropPrev || dropNext ? "move" : "none";
        if ((dropPrev || dropInner || dropNext) && oldDropNode?.id !== node.id) {
          if (oldDropNode) {
            currentProps.onNodeDragLeave?.(draggingNode, oldDropNode, event);
          }
          currentProps.onNodeDragEnter?.(draggingNode, node, event);
        }

        if (node.nextSibling === draggingNode) {
          dropNext = false;
        }
        if (node.previousSibling === draggingNode) {
          dropPrev = false;
        }
        if (node.contains(draggingNode, false)) {
          dropInner = false;
        }
        if (draggingNode === node || draggingNode.contains(node)) {
          dropPrev = false;
          dropInner = false;
          dropNext = false;
        }

        const contentEl = el.querySelector<HTMLElement>(
          ".el-tree-node__content",
        );
        const iconEl = el.querySelector<HTMLElement>(
          ".el-tree-node__expand-icon",
        );
        const root = rootRef.current;
        let dropType: NodeDropType = "none";
        if (contentEl && iconEl && root) {
          const targetPosition = contentEl.getBoundingClientRect();
          const treePosition = root.getBoundingClientRect();
          const treeScrollTop = root.scrollTop;
          const prevPercent = dropPrev
            ? dropInner
              ? 0.25
              : dropNext
                ? 0.45
                : 1
            : Number.NEGATIVE_INFINITY;
          const nextPercent = dropNext
            ? dropInner
              ? 0.75
              : dropPrev
                ? 0.55
                : 0
            : Number.POSITIVE_INFINITY;

          let indicatorTop = -9999;
          const distance = event.clientY - targetPosition.top;
          if (distance < targetPosition.height * prevPercent) {
            dropType = "before";
          } else if (distance > targetPosition.height * nextPercent) {
            dropType = "after";
          } else if (dropInner) {
            dropType = "inner";
          }

          const iconPosition = iconEl.getBoundingClientRect();
          const dropIndicator = dropIndicatorRef.current;
          if (dropIndicator) {
            if (dropType === "before") {
              indicatorTop = iconPosition.top - treePosition.top + treeScrollTop;
            } else if (dropType === "after") {
              indicatorTop =
                iconPosition.bottom - treePosition.top + treeScrollTop;
            }
            dropIndicator.style.top = `${indicatorTop}px`;
            dropIndicator.style.left = `${iconPosition.right - treePosition.left}px`;
          }
        }

        if (dropType === "inner") {
          el.classList.add("is-drop-inner");
        } else {
          el.classList.remove("is-drop-inner");
        }

        setDragState({
          draggingNode,
          dropNode: dropPrev || dropInner || dropNext ? node : null,
          showDropIndicator: dropType === "before" || dropType === "after",
          allowDrop:
            dropType === "before" || dropType === "after" || userAllowDropInner,
          dropType,
        });
        currentProps.onNodeDragOver?.(draggingNode, node, event);
      },
      dragEnd: (event) => {
        const { draggingNode, dropType, dropNode } = dragStateRef.current;
        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }

        if (draggingNode?.data && dropNode) {
          const draggingNodeCopy = { data: draggingNode.data };
          if (dropType !== "none") {
            draggingNode.remove();
          }
          if (dropType === "before") {
            dropNode.parent?.insertBefore(draggingNodeCopy, dropNode);
          } else if (dropType === "after") {
            dropNode.parent?.insertAfter(draggingNodeCopy, dropNode);
          } else if (dropType === "inner") {
            dropNode.insertChild(draggingNodeCopy);
          }
          if (dropType !== "none") {
            store.registerNode(draggingNode);
            if (store.key) {
              // 拖拽后恢复勾选态
              draggingNode.eachNode((item) => {
                store.nodesMap[item.data[store.key] as string]?.setChecked(
                  item.checked,
                  !store.checkStrictly,
                );
              });
            }
          }

          store.notify();
          propsRef.current.onNodeDragEnd?.(
            draggingNode,
            dropNode,
            dropType ?? "none",
            event,
          );
          if (dropType && dropType !== "none") {
            propsRef.current.onNodeDrop?.(
              draggingNode,
              dropNode,
              dropType,
              event,
            );
          }
        }
        if (draggingNode && !dropNode) {
          propsRef.current.onNodeDragEnd?.(
            draggingNode,
            null,
            dropType ?? "none",
            event,
          );
        }

        // 拖拽结束时清掉过程中加在节点上的类名
        nodeElMapRef.current.forEach((el) =>
          el.classList.remove("is-drop-inner"),
        );
        setDragState({
          showDropIndicator: false,
          draggingNode: null,
          dropNode: null,
          allowDrop: true,
          dropType: null,
        });
      },
    }),
    [store],
  );

  // 对应官方 useKeydown：上下移动焦点、左右展开收起、回车勾选
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(".is-focusable[role=treeitem]"),
      );

    const canNodeFocus = (items: HTMLElement[], index: number) => {
      const key = items[index]?.dataset.key;
      const target = store.getNode(key as TreeKey);
      return Boolean(
        target &&
          target.canFocus &&
          target.visible &&
          (target.parent?.expanded || target.parent?.level === 0),
      );
    };

    const initTabIndex = () => {
      root
        .querySelectorAll<HTMLElement>("input[type=checkbox]")
        .forEach((checkbox) => checkbox.setAttribute("tabindex", "-1"));
      const checkedItems = root.querySelectorAll<HTMLElement>(
        ".is-checked[role=treeitem]",
      );
      if (checkedItems.length) {
        checkedItems[0].setAttribute("tabindex", "0");
        return;
      }
      focusables()[0]?.setAttribute("tabindex", "0");
    };
    initTabIndex();

    const handleKeydown = (event: KeyboardEvent) => {
      const currentItem = event.target as HTMLElement;
      if (!currentItem.className.includes("el-tree-node")) return;
      const code = event.code;
      const treeItems = focusables();
      const currentIndex = treeItems.indexOf(currentItem);
      let nextIndex: number | undefined;

      if (code === "ArrowUp" || code === "ArrowDown") {
        event.preventDefault();
        if (code === "ArrowUp") {
          nextIndex =
            currentIndex === -1
              ? 0
              : currentIndex !== 0
                ? currentIndex - 1
                : treeItems.length - 1;
          const startIndex = nextIndex;
          while (true) {
            if (canNodeFocus(treeItems, nextIndex)) break;
            nextIndex--;
            if (nextIndex === startIndex) {
              nextIndex = -1;
              break;
            }
            if (nextIndex < 0) nextIndex = treeItems.length - 1;
          }
        } else {
          nextIndex =
            currentIndex === -1
              ? 0
              : currentIndex < treeItems.length - 1
                ? currentIndex + 1
                : 0;
          const startIndex = nextIndex;
          while (true) {
            if (canNodeFocus(treeItems, nextIndex)) break;
            nextIndex++;
            if (nextIndex === startIndex) {
              nextIndex = -1;
              break;
            }
            if (nextIndex >= treeItems.length) nextIndex = 0;
          }
        }
        if (nextIndex !== -1 && treeItems[nextIndex]) {
          treeItems[nextIndex].focus();
        }
      }
      if (code === "ArrowLeft" || code === "ArrowRight") {
        event.preventDefault();
        currentItem.click();
      }
      const hasInput = currentItem.querySelector<HTMLInputElement>(
        "[type='checkbox']",
      );
      if (
        (code === "Enter" || code === "NumpadEnter" || code === "Space") &&
        hasInput
      ) {
        event.preventDefault();
        hasInput.click();
      }
    };

    root.addEventListener("keydown", handleKeydown);
    return () => root.removeEventListener("keydown", handleKeydown);
  }, [store]);

  /**
   * scope 的依赖只放真正影响节点输出的原始 prop。
   * 所有回调（含 dragEvents、broadcastExpanded）内部都经 propsRef 读最新值，
   * 因此这里不必因回调身份变化而重建 context，杜绝整树无谓重渲。
   */
  const scope = useMemo<TreeScope>(
    () => ({
      props: resolved,
      store,
      currentNodeRef,
      hasContextmenuHandler: Boolean(props.onNodeContextmenu),
      broadcastExpanded,
      dragEvents,
      registerNodeEl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.props,
      props.indent,
      props.showCheckbox,
      props.draggable,
      props.nodeKey,
      props.accordion,
      props.checkStrictly,
      props.renderContent,
      props.children,
      props.emptyText,
      props.onNodeClick,
      props.onNodeContextmenu,
      props.onNodeExpand,
      props.onNodeCollapse,
      props.onCurrentChange,
      props.onCheck,
      props.onCheckChange,
      props.expandOnClickNode,
      props.checkOnClickNode,
      props.checkOnClickLeaf,
      props.renderAfterExpand,
      props.icon,
      dragEvents,
      broadcastExpanded,
      registerNodeEl,
      store,
    ],
  );

  // 对应官方 setup 里 return 出去的实例方法
  const instance = useMemo<TreeInstance>(
    () => ({
      filter: (value: FilterValue) => {
        if (!propsRef.current.filterNodeMethod) {
          throw new Error("[Tree] filterNodeMethod is required when filter");
        }
        store.filter(value);
      },
      getNodeKey: (node: TreeNode) =>
        propsRef.current.nodeKey
          ? getNodeKeyUtil(propsRef.current.nodeKey, node.data)
          : node.id,
      getNodePath: (data) => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in getNodePath");
        }
        const node = store.getNode(data);
        if (!node) return [];
        const path = [node.data];
        let parent = node.parent;
        while (parent && parent !== store.root) {
          path.push(parent.data);
          parent = parent.parent;
        }
        return path.reverse();
      },
      getCheckedNodes: (leafOnly, includeHalfChecked) =>
        store.getCheckedNodes(leafOnly, includeHalfChecked),
      getCheckedKeys: (leafOnly) => store.getCheckedKeys(leafOnly),
      getCurrentNode: () => {
        const current = store.getCurrentNode();
        return current ? current.data : null;
      },
      getCurrentKey: () => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in getCurrentKey");
        }
        const current = store.getCurrentNode();
        return current
          ? (current.data[propsRef.current.nodeKey as string] as TreeKey)
          : null;
      },
      setCheckedNodes: (nodes, leafOnly) => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in setCheckedNodes");
        }
        store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys: (keys, leafOnly) => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in setCheckedKeys");
        }
        store.setCheckedKeys(keys, leafOnly);
      },
      setChecked: (data, checked, deep = false) =>
        store.setChecked(data, checked, deep),
      getHalfCheckedNodes: () => store.getHalfCheckedNodes(),
      getHalfCheckedKeys: () => store.getHalfCheckedKeys(),
      setCurrentNode: (node, shouldAutoExpandParent = true) => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in setCurrentNode");
        }
        handleCurrentChange(
          store,
          (data, current) => propsRef.current.onCurrentChange?.(data, current),
          () => {
            broadcastExpanded(node);
            store.setUserCurrentNode(node, shouldAutoExpandParent);
          },
        );
      },
      setCurrentKey: (key = null, shouldAutoExpandParent = true) => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in setCurrentKey");
        }
        handleCurrentChange(
          store,
          (data, current) => propsRef.current.onCurrentChange?.(data, current),
          () => {
            broadcastExpanded(null);
            store.setCurrentNodeKey(key, shouldAutoExpandParent);
          },
        );
      },
      getNode: (data) => store.getNode(data),
      remove: (data) => store.remove(data),
      append: (data, parentNode) => store.append(data, parentNode),
      insertBefore: (data, refNode) => store.insertBefore(data, refNode),
      insertAfter: (data, refNode) => store.insertAfter(data, refNode),
      updateKeyChildren: (key, data) => {
        if (!propsRef.current.nodeKey) {
          throw new Error("[Tree] nodeKey is required in updateKeyChildren");
        }
        store.updateChildren(key, data);
      },
    }),
    [store, broadcastExpanded],
  );

  useImperativeHandle(ref, () => instance, [instance]);

  // onReady 是给不想挂 ref 的调用方准备的同一份句柄
  const onReadyRef = useRef(props.onReady);
  onReadyRef.current = props.onReady;
  useEffect(() => {
    onReadyRef.current?.(instance);
  }, [instance]);

  // 官方另有 !isSelectTree 的判断，那是给 ElTreeSelect 用的；此处独立使用恒为真
  const isEmpty =
    !store.root.childNodes ||
    store.root.childNodes.length === 0 ||
    store.root.childNodes.every((child) => !child.visible);

  const treeClasses = [
    "el-tree",
    dragState.draggingNode && "is-dragging",
    !dragState.allowDrop && "is-drop-not-allow",
    dragState.dropType === "inner" && "is-drop-inner",
    props.highlightCurrent && "el-tree--highlight-current",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(
    "div",
    { ref: rootRef, className: treeClasses, style, role: "tree" },
    <TreeContext.Provider value={scope}>
      {store.root.childNodes.map((child) => (
        <ElTreeNode
          key={
            props.nodeKey
              ? String(getNodeKeyUtil(props.nodeKey, child.data))
              : child.id
          }
          node={child}
        />
      ))}
      {isEmpty && (
        <div className="el-tree__empty-block">
          {emptySlot ?? (
            <span className="el-tree__empty-text">
              {props.emptyText ?? t("el.tree.emptyText")}
            </span>
          )}
        </div>
      )}
      <div
        ref={dropIndicatorRef}
        className="el-tree__drop-indicator"
        style={{ display: dragState.showDropIndicator ? "block" : "none" }}
      />
    </TreeContext.Provider>,
  );
});
