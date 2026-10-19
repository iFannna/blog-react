import type {
  CascaderConfig,
  CascaderNodePathValue,
  CascaderNodeValue,
  CascaderOption,
} from "./types";

type ChildrenData = CascaderOption[] | undefined;

let uid = 0;

const calculatePathNodes = (node: Node) => {
  const nodes = [node];
  let { parent } = node;

  while (parent) {
    nodes.unshift(parent);
    parent = parent.parent;
  }

  return nodes;
};

/** 对应官方 cascader-panel 的 Node 类。 */
export default class Node {
  readonly uid: number = uid++;
  readonly level: number;
  readonly value: CascaderNodeValue;
  readonly label: string;
  readonly pathNodes: Node[];
  readonly pathValues: CascaderNodePathValue;
  readonly pathLabels: string[];

  childrenData: ChildrenData;
  children: Node[];
  text: string;
  loaded: boolean;
  checked = false;
  indeterminate = false;
  loading = false;

  constructor(
    readonly data: CascaderOption,
    readonly config: CascaderConfig,
    readonly parent?: Node,
    readonly root = false,
  ) {
    const { value: valueKey, label: labelKey, children: childrenKey } = config;

    const childrenData = data[childrenKey] as ChildrenData;
    const pathNodes = calculatePathNodes(this);

    this.level = root ? 0 : parent ? parent.level + 1 : 1;
    this.value = data[valueKey] as CascaderNodeValue;
    this.label = data[labelKey] as string;
    this.pathNodes = pathNodes;
    this.pathValues = pathNodes.map((node) => node.value);
    this.pathLabels = pathNodes.map((node) => node.label);
    this.childrenData = childrenData;
    this.children = (childrenData || []).map(
      (child) => new Node(child, config, this),
    );
    this.loaded =
      !config.lazy || this.isLeaf || !isEmptyChildren(childrenData);
    this.text = "";
  }

  get isDisabled(): boolean {
    const { data, parent, config } = this;
    const { disabled, checkStrictly } = config;
    const isDisabled =
      typeof disabled === "function" ? disabled(data, this) : !!data[disabled];
    return isDisabled || (!checkStrictly && !!parent?.isDisabled);
  }

  get isLeaf(): boolean {
    const { data, config, childrenData, loaded } = this;
    const { lazy, leaf } = config;
    const isLeaf =
      typeof leaf === "function" ? leaf(data, this) : data[leaf];

    return isLeaf === undefined || isLeaf === null
      ? lazy && !loaded
        ? false
        : !(Array.isArray(childrenData) && childrenData.length)
      : !!isLeaf;
  }

  get valueByOption() {
    return this.config.emitPath ? this.pathValues : this.value;
  }

  appendChild(childData: CascaderOption) {
    const { childrenData, children } = this;
    const node = new Node(childData, this.config, this);

    if (Array.isArray(childrenData)) {
      childrenData.push(childData);
    } else {
      this.childrenData = [childData];
    }

    children.push(node);

    return node;
  }

  calcText(allLevels: boolean, separator: string) {
    const text = allLevels ? this.pathLabels.join(separator) : this.label;
    this.text = text;
    return text;
  }

  broadcast(checked: boolean) {
    this.children.forEach((child) => {
      if (child) {
        child.broadcast(checked);
        child.onParentCheck?.(checked);
      }
    });
  }

  emit() {
    const { parent } = this;
    if (parent) {
      parent.onChildCheck?.();
      parent.emit();
    }
  }

  onParentCheck(checked: boolean) {
    if (!this.isDisabled) {
      this.setCheckState(checked);
    }
  }

  onChildCheck() {
    const { children } = this;
    const validChildren = children.filter((child) => !child.isDisabled);
    const checked = validChildren.length
      ? validChildren.every((child) => child.checked)
      : false;

    this.setCheckState(checked);
  }

  setCheckState(checked: boolean) {
    const totalNum = this.children.length;
    const checkedNum = this.children.reduce((c, p) => {
      const num = p.checked ? 1 : p.indeterminate ? 0.5 : 0;
      return c + num;
    }, 0);

    this.checked =
      this.loaded &&
      this.children
        .filter((child) => !child.isDisabled)
        .every((child) => child.loaded && child.checked) &&
      checked;
    this.indeterminate =
      this.loaded && checkedNum !== totalNum && checkedNum > 0;
  }

  doCheck(checked: boolean) {
    if (this.checked === checked) return;

    const { checkStrictly, multiple } = this.config;

    if (checkStrictly || !multiple) {
      this.checked = checked;
    } else {
      this.broadcast(checked);
      this.setCheckState(checked);
      this.emit();
    }
  }
}

/** 对应官方 isEmpty：null / undefined / 空数组 / 空对象视为空。 */
function isEmptyChildren(value: unknown) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return value === "";
}
