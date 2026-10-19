import type { FilterMethod, Tree, TreeKey, TreeNode } from "./types";

export interface FilterResult {
  expandedKeys: Set<TreeKey>;
  hiddenKeys: Set<TreeKey>;
  hiddenExpandIconKeys: Set<TreeKey>;
}

/**
 * 对应官方 useFilter.doFilter：命中节点及其祖先路径保留并展开，
 * 未命中的叶子隐藏；子节点全隐藏的非叶子隐藏展开图标。
 */
export function doFilter(
  tree: Tree | undefined,
  query: string,
  filterMethod: FilterMethod | undefined,
): FilterResult | undefined {
  if (!tree || !filterMethod) return undefined;

  const expandedKeys = new Set<TreeKey>();
  const hiddenKeys = new Set<TreeKey>();
  const hiddenExpandIconKeys = new Set<TreeKey>();
  const family: TreeNode[] = [];

  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      family.push(node);

      if (filterMethod(query, node.data, node)) {
        family.forEach((member) => expandedKeys.add(member.key));
      } else if (node.isLeaf) {
        hiddenKeys.add(node.key);
      }

      const children = node.children;
      if (children) traverse(children);

      if (!node.isLeaf) {
        if (!expandedKeys.has(node.key)) {
          hiddenKeys.add(node.key);
        } else if (children) {
          let allHidden = true;
          for (const childNode of children) {
            if (!hiddenKeys.has(childNode.key)) {
              allHidden = false;
              break;
            }
          }
          if (allHidden) hiddenExpandIconKeys.add(node.key);
        }
      }

      family.pop();
    });
  };

  traverse(tree.treeNodes);
  return { expandedKeys, hiddenKeys, hiddenExpandIconKeys };
}
