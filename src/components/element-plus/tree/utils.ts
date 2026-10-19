import type Node from "./model/node";
import type { TreeKey, TreeNodeData } from "./types";

/** 对应官方 NODE_KEY，用于在数据对象上回写节点 id。 */
export const NODE_KEY = "$treeNodeId";

/**
 * 对应官方 markNodeData。
 *
 * 官方把节点 id 以不可枚举属性写回数据对象，getNodeKey 未配置 node-key 时靠它取键。
 * 直接赋值会让这个内部标记出现在遍历与 JSON 序列化里，故同样用 defineProperty。
 */
export const markNodeData = (node: { id: number }, data: TreeNodeData | null) => {
  if (!data || data[NODE_KEY]) return;
  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: true,
    writable: false,
  });
};

/** 对应官方 getNodeKey。 */
export const getNodeKey = (
  key: string | number | undefined,
  data: TreeNodeData,
): TreeKey => data?.[key || NODE_KEY] as TreeKey;

/** 对应官方 handleCurrentChange。 */
export const handleCurrentChange = (
  store: { currentNode: Node | null },
  emit: (data: TreeNodeData | null, node: Node | null) => void,
  setCurrent: () => void,
) => {
  const preCurrentNode = store.currentNode;
  setCurrent();
  const currentNode = store.currentNode;
  if (preCurrentNode === currentNode) return;

  emit(currentNode ? currentNode.data : null, currentNode);
};

export type { TreeKey };
