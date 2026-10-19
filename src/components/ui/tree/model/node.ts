import { NODE_KEY, markNodeData } from "../utils";
import type TreeStore from "./tree-store";
import type {
  TreeData,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
} from "../types";

/** 对应官方 isNil。 */
const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

/** 对应官方 prop 取值工具：函数、字段名、缺省三种形态。 */
const getPropertyFromData = (node: Node, prop: string): unknown => {
  const props = node.store.props;
  const data = node.data || {};
  const config = (props as unknown as Record<string, unknown>)[prop];

  if (typeof config === "function") {
    return (config as (data: TreeNodeData, node: Node) => unknown)(data, node);
  }
  if (typeof config === "string") {
    return data[config];
  }
  if (config === undefined) {
    const dataProp = data[prop];
    return dataProp === undefined ? "" : dataProp;
  }
  return undefined;
};

/** 对应官方 getChildState。 */
export const getChildState = (node: Node[]) => {
  let all = true;
  let none = true;
  let allWithoutDisable = true;
  let isEffectivelyChecked = true;
  for (let i = 0, j = node.length; i < j; i++) {
    const n = node[i];
    if (n.checked !== true || n.indeterminate) {
      all = false;
      if (!n.disabled) {
        allWithoutDisable = false;
      }
    }
    if (n.checked !== false || n.indeterminate) {
      none = false;
    }
    if (!n.isEffectivelyChecked) {
      isEffectivelyChecked = false;
    }
  }

  return {
    all,
    none,
    allWithoutDisable,
    half: !all && !none,
    isEffectivelyChecked,
  };
};

/** 对应官方 reInitChecked：由子节点反推父节点勾选态。 */
const reInitChecked = (node: Node): void => {
  if (node.childNodes.length === 0 || node.loading) {
    node.isEffectivelyChecked = node.disabled || node.checked;
    return;
  }

  const { all, none, half, isEffectivelyChecked } = getChildState(
    node.childNodes,
  );
  node.isEffectivelyChecked = isEffectivelyChecked;
  if (all) {
    node.checked = true;
    node.indeterminate = false;
  } else if (half) {
    node.checked = false;
    node.indeterminate = true;
  } else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }

  const parent = node.parent;
  if (!parent || parent.level === 0) return;

  if (!node.store.checkStrictly) {
    reInitChecked(parent);
  }
};

const setCanFocus = (childNodes: Node[], focus: boolean): void => {
  childNodes.forEach((item) => {
    item.canFocus = focus;
    setCanFocus(item.childNodes, focus);
  });
};

let nodeIdSeed = 0;

interface NodeOptions {
  data?: TreeNodeData;
  store: TreeStore;
  parent?: Node;
  checked?: boolean;
}

/**
 * 对应官方 Node。
 *
 * 官方靠 Vue 的 reactive 让广度可变的状态自动驱动视图；React 没有等价物，
 * 这里改为在所有会改状态的方法末尾调用 store.notify()，由 ElTree 订阅重渲染。
 * 因此「改了状态就要 notify」是本文件与 tree-store.ts 的硬约束。
 */
export default class Node {
  id: number;
  text: string | null;
  checked: boolean;
  indeterminate: boolean;
  data: TreeNodeData;
  expanded: boolean;
  parent: Node | null;
  visible: boolean;
  isCurrent: boolean;
  store: TreeStore;
  isLeafByUser: boolean | undefined = undefined;
  isLeaf: boolean | undefined = undefined;
  canFocus: boolean;
  level: number;
  loaded: boolean;
  childNodes: Node[];
  loading: boolean;
  isEffectivelyChecked = false;

  constructor(options: NodeOptions) {
    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = options.checked ?? false;
    this.indeterminate = false;
    this.data = options.data ?? {};
    this.expanded = false;
    this.parent = options.parent ?? null;
    this.visible = true;
    this.isCurrent = false;
    this.canFocus = false;
    this.store = options.store;

    this.level = 0;
    this.loaded = false;
    this.childNodes = [];
    this.loading = false;

    if (this.parent) {
      this.level = this.parent.level + 1;
    }
  }

  initialize() {
    const store = this.store;
    if (!store) {
      throw new Error("[Node]store is required!");
    }
    store.registerNode(this);

    const props = store.props;
    if (props && props.isLeaf !== undefined) {
      const isLeaf = getPropertyFromData(this, "isLeaf");
      if (typeof isLeaf === "boolean") {
        this.isLeafByUser = isLeaf;
      }
    }

    if (store.lazy !== true && this.data) {
      this.setData(this.data);

      if (store.defaultExpandAll) {
        this.expanded = true;
        this.canFocus = true;
      }
    } else if (
      this.level > 0 &&
      store.lazy &&
      store.defaultExpandAll &&
      !this.isLeafByUser
    ) {
      this.expand();
    }
    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }
    if (!this.data) return;

    const defaultExpandedKeys = store.defaultExpandedKeys;
    const key = store.key;

    if (
      key &&
      !isNil(this.key) &&
      defaultExpandedKeys &&
      defaultExpandedKeys.includes(this.key)
    ) {
      this.expand(null, store.autoExpandParent);
    }

    if (
      key &&
      store.currentNodeKey !== undefined &&
      this.key === store.currentNodeKey
    ) {
      if (store.currentNode) store.currentNode.isCurrent = false;
      store.currentNode = this;
      store.currentNode.isCurrent = true;
    }

    if (store.lazy) {
      store._initDefaultCheckedNode(this);
    }

    this.updateLeafState();
    if (this.level === 1 || this.parent?.expanded === true) this.canFocus = true;
  }

  setData(data: TreeNodeData): void {
    if (!Array.isArray(data)) {
      markNodeData(this, data);
    }

    this.data = data;
    this.childNodes = [];

    let children: TreeNodeData[];
    if (this.level === 0 && Array.isArray(this.data)) {
      children = this.data as unknown as TreeNodeData[];
    } else {
      children = (getPropertyFromData(this, "children") as TreeNodeData[]) || [];
    }

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] });
    }
  }

  get label(): string {
    return getPropertyFromData(this, "label") as string;
  }

  get key(): TreeKey | null | undefined {
    const nodeKey = this.store.key;
    if (this.data) return this.data[nodeKey] as TreeKey;
    return null;
  }

  get disabled(): boolean {
    return getPropertyFromData(this, "disabled") as boolean;
  }

  get nextSibling(): Node | null {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return parent.childNodes[index + 1] ?? null;
      }
    }
    return null;
  }

  get previousSibling(): Node | null {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return index > 0 ? parent.childNodes[index - 1] : null;
      }
    }
    return null;
  }

  contains(target: Node, deep = true): boolean {
    return (this.childNodes || []).some(
      (child) => child === target || (deep && child.contains(target)),
    );
  }

  remove(): void {
    const parent = this.parent;
    if (parent) {
      parent.removeChild(this);
    }
  }

  insertChild(
    childInput?: { data: TreeNodeData } | Node,
    index?: number,
    batch?: boolean,
  ): void {
    if (!childInput) throw new Error("InsertChild error: child is required.");

    let child: Node;
    if (!(childInput instanceof Node)) {
      if (!batch) {
        const children = this.getChildren(true) as TreeNodeData[] | null;
        if (!children?.includes(childInput.data)) {
          if (index === undefined || index < 0) {
            children?.push(childInput.data);
          } else {
            children?.splice(index, 0, childInput.data);
          }
        }
      }
      child = new Node({
        data: childInput.data,
        parent: this,
        store: this.store,
      });
      child.initialize();
    } else {
      child = childInput;
    }

    child.level = this.level + 1;

    if (index === undefined || index < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(index, 0, child);
    }

    this.updateLeafState();
  }

  insertBefore(child: { data: TreeNodeData } | Node, ref: Node): void {
    let index: number | undefined;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }

  insertAfter(child: { data: TreeNodeData } | Node, ref: Node): void {
    let index: number | undefined;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  }

  removeChild(child: Node): void {
    const children = (this.getChildren() || []) as TreeNodeData[];
    const dataIndex = children.indexOf(child.data);
    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }

    const index = this.childNodes.indexOf(child);

    if (index > -1) {
      if (this.store) this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }

    this.updateLeafState();
  }

  removeChildByData(data: TreeNodeData | null): void {
    const targetNode = this.childNodes.find((child) => child.data === data);

    if (targetNode) {
      this.removeChild(targetNode);
    }
  }

  expand(callback?: (() => void) | null, expandParent?: boolean): void {
    const done = () => {
      if (expandParent) {
        let parent = this.parent;
        while (parent && parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      this.expanded = true;
      if (callback) callback();
      setCanFocus(this.childNodes, true);
    };

    if (this.shouldLoadData()) {
      this.loadData((data) => {
        if (Array.isArray(data)) {
          if (!this.store.checkStrictly) {
            if (this.checked) {
              this.setChecked(true, true);
            } else {
              reInitChecked(this);
            }
          }
          done();
        }
      });
    } else {
      done();
    }
    this.store.notify();
  }

  doCreateChildren(
    array: TreeNodeData[],
    defaultProps: { checked?: boolean } = {},
  ): void {
    array.forEach((item) => {
      this.insertChild(
        Object.assign({ data: item }, defaultProps),
        undefined,
        true,
      );
    });
  }

  collapse(): void {
    this.expanded = false;
    setCanFocus(this.childNodes, false);
    this.store.notify();
  }

  shouldLoadData() {
    return Boolean(this.store.lazy === true && this.store.load && !this.loaded);
  }

  updateLeafState(): void {
    if (
      this.store.lazy === true &&
      this.loaded !== true &&
      this.isLeafByUser !== undefined
    ) {
      this.isLeaf = this.isLeafByUser;
      this.isEffectivelyChecked = this.isLeaf && this.disabled;
      return;
    }
    const childNodes = this.childNodes;
    if (
      !this.store.lazy ||
      (this.store.lazy === true && this.loaded === true)
    ) {
      this.isLeaf = !childNodes || childNodes.length === 0;
      this.isEffectivelyChecked = this.isLeaf && this.disabled;
      return;
    }
    this.isLeaf = false;
  }

  setChecked(
    value?: boolean | string,
    deep?: boolean,
    recursion?: boolean,
    passValue?: boolean,
  ) {
    this.indeterminate = value === "half";
    this.checked = value === true;
    this.isEffectivelyChecked =
      !this.childNodes.length && (this.disabled || this.checked);

    if (this.store.checkStrictly && !deep) {
      this.store.notify();
      return;
    }

    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      const handleDescendants = (): void => {
        if (deep) {
          const childNodes = this.childNodes;
          for (let i = 0, j = childNodes.length; i < j; i++) {
            const child = childNodes[i];
            passValue = passValue || value !== false;
            const isCheck =
              child.disabled && child.isLeaf ? child.checked : passValue;
            child.setChecked(isCheck, deep, true, passValue);
          }
          const { half, all, isEffectivelyChecked } =
            getChildState(childNodes);
          if (!all) {
            this.checked = all;
            this.indeterminate = half;
          }
          this.isEffectivelyChecked = !this.childNodes.length
            ? this.disabled || this.checked
            : isEffectivelyChecked;
        }
      };

      if (this.shouldLoadData()) {
        // 懒加载场景下先取回子节点再联动勾选
        this.loadData(
          () => {
            handleDescendants();
            reInitChecked(this);
          },
          {
            checked: value !== false,
          },
        );
        return;
      } else {
        handleDescendants();
      }
    }

    const parent = this.parent;
    if (!parent || parent.level === 0) {
      this.store.notify();
      return;
    }

    if (!recursion && !this.store.checkStrictly) {
      reInitChecked(parent);
    }
    this.store.notify();
  }

  getChildren(forceInit = false): TreeNodeData | TreeNodeData[] | null {
    if (this.level === 0) return this.data as unknown as TreeNodeData[];
    const data = this.data;
    if (!data) return null;

    const props = this.store.props;
    let children = "children";
    if (props) {
      children = props.children || "children";
    }

    if (data[children] === undefined) {
      data[children] = null;
    }

    if (forceInit && !data[children]) {
      data[children] = [];
    }

    return data[children] as TreeNodeData[] | null;
  }

  updateChildren(): void {
    const newData = (this.getChildren() || []) as TreeNodeData[];
    const oldData = this.childNodes.map((node) => node.data);

    const newDataMap: Record<string, { index: number; data: TreeNodeData }> = {};
    const newNodes: { index: number; data: TreeNodeData }[] = [];

    newData.forEach((item, index) => {
      const key = item[NODE_KEY] as string;
      const isNodeExists =
        !!key && oldData.some((data) => data?.[NODE_KEY] === key);
      if (isNodeExists) {
        newDataMap[key] = { index, data: item };
      } else {
        newNodes.push({ index, data: item });
      }
    });

    if (!this.store.lazy) {
      oldData.forEach((item) => {
        if (!newDataMap[item?.[NODE_KEY] as string]) this.removeChildByData(item);
      });
    }

    newNodes.forEach(({ index, data }) => {
      this.insertChild({ data }, index);
    });

    this.updateLeafState();
    this.store.notify();
  }

  loadData(
    callback?: (data?: TreeNodeData[]) => void,
    defaultProps: { checked?: boolean } = {},
  ) {
    if (
      this.store.lazy === true &&
      this.store.load &&
      !this.loaded &&
      (!this.loading || Object.keys(defaultProps).length)
    ) {
      this.loading = true;
      this.store.notify();

      const resolve = (children: TreeNodeData[]) => {
        this.childNodes = [];

        this.doCreateChildren(children, defaultProps);
        this.loaded = true;
        this.loading = false;

        this.updateLeafState();
        if (callback) {
          callback.call(this, children);
        }
        this.store.notify();
      };
      const reject = () => {
        this.loading = false;
        this.store.notify();
      };

      this.store.load(this, resolve, reject);
    } else {
      if (callback) {
        callback.call(this);
      }
    }
  }

  eachNode(callback: (node: Node) => void) {
    const arr: Node[] = [this];
    while (arr.length) {
      const node = arr.shift()!;
      arr.unshift(...node.childNodes);
      callback(node);
    }
  }

  reInitChecked() {
    if (this.store.checkStrictly) return;
    reInitChecked(this);
  }
}

export type { NodeOptions, TreeOptionProps, TreeKey, TreeData };
