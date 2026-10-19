import Node from "./node";
import { getNodeKey } from "../utils";
import type {
  FilterNodeMethodFunction,
  FilterValue,
  LoadFunction,
  TreeData,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
} from "../types";

/** 对应官方 TreeStoreOptions。 */
export interface TreeStoreOptions {
  key?: TreeKey;
  data: TreeData;
  lazy: boolean;
  props: TreeOptionProps;
  load?: LoadFunction;
  currentNodeKey?: TreeKey;
  checkStrictly: boolean;
  checkDescendants: boolean;
  defaultCheckedKeys?: TreeKey[];
  defaultExpandedKeys?: TreeKey[];
  autoExpandParent: boolean;
  defaultExpandAll: boolean;
  filterNodeMethod?: FilterNodeMethodFunction;
}

/** 对应官方 isNil。 */
const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

/**
 * 对应官方 TreeStore。
 *
 * 与官方的差异：官方节点是 Vue reactive 对象，改动即触发视图更新；
 * 这里由 store 承担发布职责——ElTree 订阅 notify，任何节点状态变化都经它广播。
 * 因此所有会改节点状态的方法都必须调用 this.notify()。
 */
export default class TreeStore {
  currentNode: Node | null = null;
  currentNodeKey: TreeKey | null = null;
  nodesMap: Record<string, Node> = {};
  root!: Node;
  data!: TreeData;
  lazy = false;
  load?: LoadFunction;
  filterNodeMethod?: FilterNodeMethodFunction;
  key!: TreeKey;
  defaultCheckedKeys?: TreeKey[];
  checkStrictly = false;
  defaultExpandedKeys?: TreeKey[];
  autoExpandParent = false;
  defaultExpandAll = false;
  checkDescendants = false;
  props: TreeOptionProps;

  /** 变更计数，作为 useSyncExternalStore 的快照。 */
  version = 0;

  private listeners = new Set<() => void>();

  constructor(options: TreeStoreOptions) {
    this.props = options.props;
    Object.assign(this, options);
    this.nodesMap = {};
  }

  /** 订阅变更，返回取消订阅函数，供 useSyncExternalStore 使用。 */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** 广播变更，对应 Vue reactive 的自动更新。 */
  notify = (): void => {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  };

  initialize() {
    this.root = new Node({
      data: this.data as unknown as TreeNodeData,
      store: this,
    });
    this.root.initialize();

    // 服务端渲染时才初始化 store，此时不发起懒加载：
    // load 通常依赖浏览器 API，且 SSR 结果不会被客户端复用
    if (this.lazy && this.load && typeof window !== "undefined") {
      const loadFn = this.load;
      loadFn(
        this.root,
        (data) => {
          this.root.doCreateChildren(data);
          this._initDefaultCheckedNodes();
          this.notify();
        },
        () => {},
      );
    } else {
      this._initDefaultCheckedNodes();
    }
  }

  filter(value: FilterValue): void {
    const filterNodeMethod = this.filterNodeMethod;
    const lazy = this.lazy;
    // 官方此处用 await nextTick 让出主线程；React 下每层之间 await 一个微任务等价
    const traverse = async (node: TreeStore | Node) => {
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      for (const child of childNodes) {
        child.visible = !!filterNodeMethod?.call(child, value, child.data, child);
        await Promise.resolve();
        await traverse(child);
      }

      if (!(node as Node).visible && childNodes.length) {
        const allHidden = !childNodes.some((child) => child.visible);

        if ((node as TreeStore).root) {
          (node as TreeStore).root.visible = allHidden === false;
        } else {
          (node as Node).visible = allHidden === false;
        }
      }
      if (!value) return;

      if ((node as Node).visible && !(node as Node).isLeaf) {
        if (!lazy || (node as Node).loaded) {
          (node as Node).expand();
        }
      }
      this.notify();
    };

    void traverse(this);
  }

  setData(newVal: TreeData): void {
    const instanceChanged = (newVal as unknown) !== (this.root.data as unknown);
    if (instanceChanged) {
      this.nodesMap = {};
      this.root.setData(newVal as unknown as TreeNodeData);
      this._initDefaultCheckedNodes();
      this.setCurrentNodeKey(this.currentNodeKey);
    } else {
      this.root.updateChildren();
    }
    this.notify();
  }

  getNode(data: TreeKey | TreeNodeData | Node): Node | null {
    if (data instanceof Node) return data;
    const key = (
      typeof data === "object" && data !== null ? getNodeKey(this.key, data) : data
    ) as TreeKey;
    return this.nodesMap[key] || null;
  }

  insertBefore(data: TreeNodeData, refData: TreeKey | TreeNodeData | Node): void {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertBefore({ data }, refNode);
    this.notify();
  }

  insertAfter(data: TreeNodeData, refData: TreeKey | TreeNodeData | Node): void {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertAfter({ data }, refNode);
    this.notify();
  }

  remove(data: TreeNodeData | Node): void {
    const node = this.getNode(data);

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.parent.removeChild(node);
    }
    this.notify();
  }

  append(data: TreeNodeData, parentData: TreeNodeData | TreeKey | Node): void {
    const parentNode =
      parentData !== undefined ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
    }
    this.notify();
  }

  _initDefaultCheckedNodes(): void {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];
    const nodesMap = this.nodesMap;

    defaultCheckedKeys.forEach((checkedKey) => {
      const node = nodesMap[checkedKey];

      if (node) {
        node.setChecked(true, !this.checkStrictly);
      }
    });
  }

  _initDefaultCheckedNode(node: Node): void {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];

    if (!isNil(node.key) && defaultCheckedKeys.includes(node.key)) {
      node.setChecked(true, !this.checkStrictly);
    }
  }

  setDefaultCheckedKey(newVal: TreeKey[]): void {
    if (newVal !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = newVal;
      this._initDefaultCheckedNodes();
      this.notify();
    }
  }

  registerNode(node: Node): void {
    const key = this.key;
    if (!node || !node.data) return;

    if (!key) {
      this.nodesMap[node.id] = node;
    } else {
      const nodeKey = node.key;
      if (!isNil(nodeKey)) this.nodesMap[nodeKey] = node;
    }
  }

  deregisterNode(node: Node): void {
    const key = this.key;
    if (!key || !node || !node.data) return;

    node.childNodes.forEach((child) => {
      this.deregisterNode(child);
    });

    delete this.nodesMap[node.key as TreeKey];
  }

  getCheckedNodes(leafOnly = false, includeHalfChecked = false): TreeNodeData[] {
    const checkedNodes: TreeNodeData[] = [];
    const traverse = (node: TreeStore | Node) => {
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      childNodes.forEach((child) => {
        if (
          (child.checked || (includeHalfChecked && child.indeterminate)) &&
          (!leafOnly || (leafOnly && child.isLeaf))
        ) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  }

  getCheckedKeys(leafOnly = false): TreeKey[] {
    return this.getCheckedNodes(leafOnly).map(
      (data) => (data || {})[this.key as string] as TreeKey,
    );
  }

  getHalfCheckedNodes(): TreeNodeData[] {
    const nodes: TreeNodeData[] = [];
    const traverse = (node: TreeStore | Node) => {
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      childNodes.forEach((child) => {
        if (child.indeterminate) {
          nodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return nodes;
  }

  getHalfCheckedKeys(): TreeKey[] {
    return this.getHalfCheckedNodes().map(
      (data) => (data || {})[this.key as string] as TreeKey,
    );
  }

  _getAllNodes(): Node[] {
    const allNodes: Node[] = [];
    const nodesMap = this.nodesMap;
    for (const nodeKey in nodesMap) {
      if (Object.prototype.hasOwnProperty.call(nodesMap, nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }

    return allNodes;
  }

  updateChildren(key: TreeKey, data: TreeData): void {
    const node = this.nodesMap[key];
    if (!node) return;
    const childNodes = node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i];
      this.remove(child.data);
    }
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i];
      this.append(child, node.data);
    }
    this.notify();
  }

  _setCheckedKeys(
    key: TreeKey,
    leafOnly = false,
    checkedKeys: Record<string, boolean>,
  ) {
    const allNodes = this._getAllNodes().sort((a, b) => a.level - b.level);
    const cache: Record<string, boolean> = Object.create(null);
    const keys = Object.keys(checkedKeys);
    allNodes.forEach((node) => node.setChecked(false, false));
    const cacheCheckedChild = (node: Node) => {
      node.childNodes.forEach((child) => {
        cache[child.data[key] as string] = true;
        if (child.childNodes?.length) {
          cacheCheckedChild(child);
        }
      });
    };
    for (let i = 0, j = allNodes.length; i < j; i++) {
      const node = allNodes[i];
      const nodeKey: string = String(node.data[key]);
      const checked = keys.includes(nodeKey);
      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }
        continue;
      }

      if (node.childNodes.length) {
        cacheCheckedChild(node);
      }

      if (node.isLeaf || this.checkStrictly) {
        node.setChecked(true, false);
        continue;
      }
      node.setChecked(true, true);

      if (leafOnly) {
        node.setChecked(false, false, true);
        const traverse = (n: Node): void => {
          const childNodes = n.childNodes;
          childNodes.forEach((child) => {
            if (!child.isLeaf) {
              child.setChecked(false, false, true);
            }
            traverse(child);
          });
          n.reInitChecked();
        };
        traverse(node);
      }
    }
    this.notify();
  }

  setCheckedNodes(array: Array<Node | TreeNodeData>, leafOnly = false): void {
    const key = this.key;
    const checkedKeys: Record<string, boolean> = {};
    array.forEach((item) => {
      // 官方既接受节点对象也接受数据对象，两者都用同名的 key 字段取标识
      const record = (item instanceof Node ? item.data : item) as TreeNodeData;
      checkedKeys[record[key as string] as unknown as string] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setCheckedKeys(keys: TreeKey[], leafOnly = false): void {
    this.defaultCheckedKeys = keys;
    const key = this.key;
    const checkedKeys: Record<string, boolean> = {};
    keys.forEach((k) => {
      checkedKeys[k] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setDefaultExpandedKeys(keys: TreeKey[]) {
    keys = keys || [];
    this.defaultExpandedKeys = keys;
    keys.forEach((key) => {
      const node = this.getNode(key);
      if (node) node.expand(null, this.autoExpandParent);
    });
    this.notify();
  }

  setChecked(data: TreeKey | TreeNodeData, checked: boolean, deep: boolean): void {
    const node = this.getNode(data);

    if (node) {
      node.setChecked(!!checked, deep);
    }
    this.notify();
  }

  getCurrentNode(): Node | null {
    return this.currentNode;
  }

  setCurrentNode(currentNode: Node): void {
    const prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
    this.notify();
  }

  setUserCurrentNode(node: Node, shouldAutoExpandParent = true): void {
    const key = (node as unknown as Record<string, TreeKey>)[this.key as string];
    const currNode = this.nodesMap[key];
    this.setCurrentNode(currNode);
    if (
      shouldAutoExpandParent &&
      this.currentNode &&
      this.currentNode.level > 1
    ) {
      this.currentNode.parent?.expand(null, true);
    }
  }

  setCurrentNodeKey(key: TreeKey | null, shouldAutoExpandParent = true): void {
    this.currentNodeKey = key;
    if (key === undefined || key === null) {
      if (this.currentNode) this.currentNode.isCurrent = false;
      this.currentNode = null;
      this.notify();
      return;
    }
    const node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
      if (
        shouldAutoExpandParent &&
        this.currentNode &&
        this.currentNode.level > 1
      ) {
        this.currentNode.parent?.expand(null, true);
      }
    }
    this.notify();
  }
}
