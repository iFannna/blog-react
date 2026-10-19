import type { Tree, TreeKey, TreeNode } from "./types";

export interface CheckState {
  checkedKeys: Set<TreeKey>;
  indeterminateKeys: Set<TreeKey>;
}

/** 对应官方 isEffectivelyChecked 的判定：禁用叶子视为已选，非叶子看子节点。 */
export function effectivelyChecked(
  node: TreeNode,
  checkedKeys: Set<TreeKey>,
): boolean {
  if (node.isLeaf) return !!node.disabled || checkedKeys.has(node.key);
  return !!node.children?.every((child) =>
    effectivelyChecked(child, checkedKeys),
  );
}

/**
 * 对应官方 toggleCheckbox 里的 toggle：向下级联写入勾选态。
 * 返回新的 Set，不改动入参。
 */
export function toggleCheckedKeys(
  checkedKeys: Set<TreeKey>,
  node: TreeNode,
  checked: boolean,
  checkStrictly: boolean,
  deep = false,
): Set<TreeKey> {
  const next = new Set(checkedKeys);
  const toggle = (target: TreeNode) => {
    if (checked) next.add(target.key);
    else next.delete(target.key);
    if ((!checkStrictly || deep) && target.children) {
      target.children.forEach((child) => {
        if (!child.disabled || child.children) toggle(child);
      });
    }
  };
  toggle(node);
  return next;
}

/**
 * 对应官方 updateCheckedKeys：自底向上汇总父节点的全选/半选状态。
 * 官方靠遍历顺序复用 node.isEffectivelyChecked，这里用 Map 传递等价信息。
 */
export function updateCheckedKeys(
  tree: Tree,
  checkedKeys: Set<TreeKey>,
  checkStrictly: boolean,
): CheckState {
  // 非联动模式官方直接 return，半选集合保持原样（实际始终为空）
  if (checkStrictly) {
    return { checkedKeys, indeterminateKeys: new Set() };
  }

  const nextChecked = new Set(checkedKeys);
  const indeterminateKeys = new Set<TreeKey>();
  const effectiveMap = new Map<TreeKey, boolean>();
  const { levelTreeNodeMap, maxLevel } = tree;

  for (let level = maxLevel; level >= 1; --level) {
    const nodes = levelTreeNodeMap.get(level);
    if (!nodes) continue;

    nodes.forEach((node) => {
      const children = node.children;
      let isEffectivelyChecked =
        !node.isLeaf || !!node.disabled || nextChecked.has(node.key);

      if (children) {
        let allChecked = true;
        let hasChecked = false;

        for (const childNode of children) {
          const key = childNode.key;
          if (!effectiveMap.get(key)) isEffectivelyChecked = false;

          if (nextChecked.has(key)) {
            hasChecked = true;
          } else if (indeterminateKeys.has(key)) {
            allChecked = false;
            hasChecked = true;
            break;
          } else {
            allChecked = false;
          }
        }

        if (allChecked) {
          nextChecked.add(node.key);
        } else if (hasChecked) {
          indeterminateKeys.add(node.key);
          nextChecked.delete(node.key);
        } else {
          nextChecked.delete(node.key);
          indeterminateKeys.delete(node.key);
        }
      }

      effectiveMap.set(node.key, isEffectivelyChecked);
    });
  }

  return { checkedKeys: nextChecked, indeterminateKeys };
}

/** 对应官方 _setCheckedKeys：从空集合开始逐 key 向下勾选，再汇总父节点。 */
export function computeCheckedState(
  tree: Tree | undefined,
  keys: TreeKey[] | undefined,
  showCheckbox: boolean,
  checkStrictly: boolean,
): CheckState {
  if (!tree || !showCheckbox) {
    return { checkedKeys: new Set(), indeterminateKeys: new Set() };
  }

  let checkedKeys = new Set<TreeKey>();
  for (const key of keys ?? []) {
    const node = tree.treeNodeMap.get(key);
    if (node && !checkedKeys.has(node.key)) {
      checkedKeys = toggleCheckedKeys(
        checkedKeys,
        node,
        true,
        checkStrictly,
      );
    }
  }

  return updateCheckedKeys(tree, checkedKeys, checkStrictly);
}

/** 对应官方 getChecked：按 key 顺序取已选节点的数据。 */
export function collectChecked(
  tree: Tree,
  checkedKeys: Set<TreeKey>,
  leafOnly = false,
) {
  const keys: TreeKey[] = [];
  const nodes: Tree["treeNodes"] = [];

  checkedKeys.forEach((key) => {
    const node = tree.treeNodeMap.get(key);
    if (node && (!leafOnly || node.isLeaf)) {
      keys.push(key);
      nodes.push(node);
    }
  });

  return { checkedKeys: keys, checkedNodes: nodes };
}

/** 对应官方 getHalfChecked。 */
export function collectHalfChecked(
  tree: Tree,
  indeterminateKeys: Set<TreeKey>,
) {
  const halfCheckedKeys: TreeKey[] = [];
  const halfCheckedNodes: Tree["treeNodes"] = [];

  indeterminateKeys.forEach((key) => {
    const node = tree.treeNodeMap.get(key);
    if (node) {
      halfCheckedKeys.push(key);
      halfCheckedNodes.push(node);
    }
  });

  return { halfCheckedKeys, halfCheckedNodes };
}
