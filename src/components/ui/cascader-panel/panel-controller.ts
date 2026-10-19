import { cloneDeep, flattenDeep, isEqual } from "../utils";
import Node from "./node";
import Store from "./store";
import { castArray, sortByOriginalOrder, unique } from "./utils";

import type {
  CascaderConfig,
  CascaderNodePathValue,
  CascaderNodeValue,
  CascaderOption,
  CascaderValue,
  Resolve,
} from "./types";

export interface PanelCallbacks {
  onChange?: (value: CascaderValue | null) => void;
  onClose?: () => void;
  onExpandChange?: (value: CascaderNodePathValue) => void;
  /** store 内部完成菜单同步后，由上层滚动到展开节点 */
  onAfterSync?: () => void;
}

/**
 * 对应官方 ElCascaderPanel 的 setup 状态与 watch 逻辑。
 *
 * Vue 的 reactive 节点状态在 React 中没有等价物，这里把 store、菜单、
 * 展开与勾选状态集中到一个可订阅的对象里，组件经 useSyncExternalStore
 * 订阅 version。算法逐条对齐官方源码。
 */
export class PanelController {
  config: CascaderConfig;
  store: Store;
  menus: Node[][];
  expandingNode: Node | undefined;
  checkedNodes: Node[] = [];
  checkedValue: CascaderValue | null | undefined;
  initialLoaded = true;
  initialLoadedOnce = false;
  manualChecked = false;
  version = 0;
  /** 菜单同步次数，供组件在同步后滚动到展开节点 */
  syncVersion = 0;

  readonly options: CascaderOption[];
  private modelValue: CascaderValue | null | undefined;
  private listeners = new Set<() => void>();

  constructor(
    options: CascaderOption[],
    config: CascaderConfig,
    modelValue: CascaderValue | null | undefined,
  ) {
    this.options = options;
    this.config = config;
    this.modelValue = cloneDeep(modelValue ?? null);
    this.store = new Store(options, config);
    this.menus = [this.store.getNodes()];

    if (config.lazy && isEmptyOptions(options)) {
      // 服务端不发起懒加载，挂载后由 loadLazyRootNodes 触发
      this.initialLoaded = false;
    } else {
      this.syncCheckedValue(this.modelValue, false, true);
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.version;

  notify() {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }

  getFlattedNodes(leafOnly: boolean) {
    return this.store.getFlattedNodes(leafOnly);
  }

  getCheckedNodes(leafOnly: boolean) {
    return this.getFlattedNodes(leafOnly).filter(({ checked }) => checked);
  }

  getRootNodes() {
    return this.store.getNodes();
  }

  loadLazyRootNodes() {
    if (this.initialLoadedOnce || !this.initialLoaded) return;
    if (!(this.config.lazy && isEmptyOptions(this.options))) return;

    this.lazyLoad(undefined, (list) => {
      if (list) {
        this.store = new Store(list, this.config);
        this.menus = [this.store.getNodes()];
      }
      this.initialLoaded = true;
      this.syncCheckedValue(this.modelValue, false, true);
      this.notify();
    });
  }

  /**
   * 对应官方 lazyLoad：node 为空时建一个 level 0 的根节点，用于加载根选项。
   * 放在 controller 内是为了让异步回调沿用同一个 store 与状态。
   */
  lazyLoad(node?: Node, cb?: Resolve) {
    const cfg = this.config;
    const target = node ?? new Node({}, cfg, undefined, true);
    target.loading = true;
    this.notify();

    const resolve = (dataList?: CascaderOption[]) => {
      const parent = target.root ? null : target;
      target.loading = false;
      target.loaded = true;
      target.childrenData = target.childrenData || [];
      if (dataList) {
        this.store.appendNodes(dataList, parent ?? undefined);
        cb?.(dataList);
      }
      if (target.level === 0) {
        this.initialLoadedOnce = true;
      }
      this.notify();
    };

    const reject = () => {
      target.loading = false;
      target.loaded = false;
      if (target.level === 0) {
        this.initialLoaded = true;
      }
      this.notify();
    };

    cfg.lazyLoad(target, resolve, reject);
  }

  expandNode(node: Node, silent = false, emit?: PanelCallbacks) {
    const { level } = node;
    const newMenus = this.menus.slice(0, level);
    let newExpandingNode: Node;

    if (node.isLeaf) {
      newExpandingNode = node.pathNodes[level - 2];
    } else {
      newExpandingNode = node;
      newMenus.push(node.children);
    }

    if (this.expandingNode?.uid !== newExpandingNode?.uid) {
      this.expandingNode = node;
      this.menus = newMenus;
      if (!silent) {
        emit?.onExpandChange?.(node?.pathValues || []);
      }
      this.notify();
    }
  }

  handleCheckChange(
    node: Node,
    checked: boolean,
    emitClose = true,
    emit?: PanelCallbacks,
  ) {
    const { checkStrictly, multiple } = this.config;
    const oldNode = this.checkedNodes[0];
    this.manualChecked = true;

    if (!multiple) oldNode?.doCheck(false);
    node.doCheck(checked);
    this.calculateCheckedValue(emit);

    if (emitClose && !multiple && !checkStrictly) {
      emit?.onClose?.();
    }
    if (!emitClose && !multiple) {
      this.expandParentNode(node, emit);
    }

    this.notify();
  }

  private expandParentNode(node: Node | undefined, emit?: PanelCallbacks) {
    if (!node) return;
    node = node.parent!;
    this.expandParentNode(node, emit);
    if (node) this.expandNode(node, false, emit);
  }

  calculateCheckedValue(emit?: PanelCallbacks) {
    const { checkStrictly, multiple } = this.config;
    const oldNodes = this.checkedNodes;
    const newNodes = this.getCheckedNodes(!checkStrictly);
    // ensure the original order
    const nodes = sortByOriginalOrder(oldNodes, newNodes);
    const values = nodes.map((node) => node.valueByOption);
    this.checkedNodes = nodes;
    this.checkedValue = multiple ? values : (values[0] ?? null);

    if (!isEqual(this.checkedValue, this.modelValue)) {
      emit?.onChange?.(this.checkedValue ?? null);
    }
  }

  syncCheckedValue(
    modelValue: CascaderValue | null | undefined,
    loaded = false,
    forced = false,
  ) {
    const { lazy, multiple, checkStrictly } = this.config;
    const leafOnly = !checkStrictly;

    if (
      !this.initialLoaded ||
      this.manualChecked ||
      (!forced && isEqual(modelValue, this.checkedValue))
    ) {
      return;
    }

    if (lazy && !loaded) {
      const raw = Array.isArray(modelValue)
        ? flattenDeep(modelValue)
        : [modelValue];
      const values = unique(raw as CascaderNodeValue[]);
      const nodes = values
        .map((val) => this.store.getNodeByValue(val))
        .filter(
          (node): node is Node => !!node && !node.loaded && !node.loading,
        );

      if (nodes.length) {
        nodes.forEach((node) => {
          this.lazyLoad(node, () =>
            this.syncCheckedValue(modelValue, false, forced),
          );
        });
      } else {
        this.syncCheckedValue(modelValue, true, forced);
      }
    } else {
      const values = multiple ? castArray(modelValue) : [modelValue];
      const nodes = unique(
        values.map((val) =>
          this.store.getNodeByValue(
            val as CascaderNodeValue,
            leafOnly,
          ),
        ),
      ).filter((node): node is Node => !!node);
      this.syncMenuState(nodes, forced);
      this.checkedValue = cloneDeep(modelValue ?? undefined) as
        | CascaderValue
        | undefined;
    }
  }

  private syncMenuState(newCheckedNodes: Node[], reserveExpandingState = true) {
    const { checkStrictly } = this.config;
    const oldNodes = this.checkedNodes;
    const newNodes = newCheckedNodes.filter(
      (node) => !!node && (checkStrictly || node.isLeaf),
    );
    const oldExpandingNode = this.store.getSameNode(this.expandingNode);
    const newExpandingNode =
      (reserveExpandingState && oldExpandingNode) || newNodes[0];

    if (newExpandingNode) {
      newExpandingNode.pathNodes.forEach((node) => this.expandNode(node, true));
    } else {
      this.expandingNode = undefined;
    }

    oldNodes.forEach((node) => node.doCheck(false));
    newNodes.forEach((node) => node.doCheck(true));
    this.checkedNodes = newNodes;
    this.syncVersion += 1;
    this.notify();
  }

  clearCheckedNodes(emit?: PanelCallbacks) {
    this.checkedNodes.forEach((node) => node.doCheck(false));
    this.calculateCheckedValue(emit);
    this.menus = this.menus.slice(0, 1);
    this.expandingNode = undefined;
    emit?.onExpandChange?.([]);
    this.notify();
  }

  /** 对应官方 watch(modelValue)：外部值变化时重置手动勾选标记并同步。 */
  handleModelValueChange(modelValue: CascaderValue | null | undefined) {
    this.manualChecked = false;
    this.modelValue = cloneDeep(modelValue ?? null);
    this.syncCheckedValue(this.modelValue);
    this.notify();
  }

}

function isEmptyOptions(options: CascaderOption[] | undefined) {
  return !options || options.length === 0;
}
