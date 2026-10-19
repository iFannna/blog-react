"use client";

import { useState, type CSSProperties } from "react";
import { ElTree } from "@/components/ui/tree";
import type {
  AllowDropType,
  RenderContentContext,
  TreeInstance,
  TreeNodeData,
} from "@/components/ui/tree";
import { ElButton } from "@/components/ui/button";
import { ElInput } from "@/components/ui/input";

/** 各示例共用的「限宽 600px」，对应官方示例里的 style="max-width: 600px"。 */
const treeWidth: CSSProperties = { maxWidth: "600px" };

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
  marginTop: "0.8rem",
};

const stack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

interface BasicTree {
  label: string;
  children?: BasicTree[];
  [key: string]: unknown;
}

const basicData: BasicTree[] = [
  {
    label: "Level one 1",
    children: [
      {
        label: "Level two 1-1",
        children: [{ label: "Level three 1-1-1" }],
      },
    ],
  },
  {
    label: "Level one 2",
    children: [
      {
        label: "Level two 2-1",
        children: [{ label: "Level three 2-1-1" }],
      },
      {
        label: "Level two 2-2",
        children: [{ label: "Level three 2-2-1" }],
      },
    ],
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [{ label: "Level three 3-1-1" }],
      },
      {
        label: "Level two 3-2",
        children: [{ label: "Level three 3-2-1" }],
      },
    ],
  },
];

const defaultProps = { children: "children", label: "label" };

/** 官方 basic：基础树形结构。 */
export function TreeBasic() {
  return (
    <ElTree
      style={treeWidth}
      data={basicData}
      props={defaultProps}
      onNodeClick={(data) => {
        console.log(data);
      }}
    />
  );
}

/** 官方 accordion：同层只允许展开一个节点。 */
export function TreeAccordion() {
  return (
    <ElTree
      style={treeWidth}
      data={basicData}
      props={defaultProps}
      accordion
      onNodeClick={(data) => {
        console.log(data);
      }}
    />
  );
}

interface LazyTree {
  name: string;
  leaf?: boolean;
  [key: string]: unknown;
}

let zoneCount = 1;

/** 官方 selectable：懒加载 + 复选框，节点数据点击时才拉取。 */
export function TreeSelectable() {
  const props = { label: "name", children: "zones" };

  return (
    <ElTree
      style={treeWidth}
      props={props}
      lazy
      showCheckbox
      onCheckChange={(data, checked, indeterminate) => {
        console.log(data, checked, indeterminate);
      }}
      // 官方示例的 load 每次点击都会拉数据，这里用随机叶子模拟同样的行为
      load={(node, resolve) => {
        if (node.level === 0) {
          return resolve([{ name: "Root1" }, { name: "Root2" }]);
        }
        if (node.level > 3) return resolve([]);

        const hasChild = Math.random() > 0.5;

        setTimeout(() => {
          let data: LazyTree[] = [];
          if (hasChild) {
            data = [{ name: `zone${zoneCount++}` }, { name: `zone${zoneCount++}` }];
          }
          resolve(data);
        }, 500);
      }}
    />
  );
}

/** 官方 custom-leaf：用 isLeaf 提前声明哪些节点是叶子，避免渲染多余的展开箭头。 */
export function TreeCustomLeaf() {
  const props = { label: "name", children: "zones", isLeaf: "leaf" };

  return (
    <ElTree
      style={treeWidth}
      props={props}
      lazy
      showCheckbox
      load={(node, resolve) => {
        if (node.level === 0) {
          return resolve([{ name: "region" }]);
        }
        if (node.level > 1) return resolve([]);

        setTimeout(() => {
          resolve([
            { name: "leaf", leaf: true },
            { name: "zone" },
          ]);
        }, 500);
      }}
    />
  );
}

let loadTime = 0;

/** 官方 multiple-times-load：懒加载失败时调用 reject，保持节点状态以便重试。 */
export function TreeMultipleTimesLoad() {
  const props = { label: "name", children: "zones", isLeaf: "leaf" };

  return (
    <ElTree
      style={treeWidth}
      props={props}
      lazy
      load={(node, resolve, reject) => {
        if (node.level === 0) {
          return resolve([{ name: "region" }]);
        }
        loadTime += 1;
        if (node.level >= 1) {
          setTimeout(() => {
            if (loadTime > 3) {
              return resolve([
                { name: "zone1", leaf: true },
                { name: "zone2", leaf: true },
                { name: "zone3", leaf: true },
              ]);
            }
            return reject();
          }, 3000);
        }
        return undefined;
      }}
    />
  );
}

const disabledData: TreeNodeData[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 3,
        label: "Level two 2-1",
        children: [
          { id: 4, label: "Level three 3-1-1" },
          { id: 5, label: "Level three 3-1-2", disabled: true },
        ],
      },
      {
        id: 2,
        label: "Level two 2-2",
        disabled: true,
        children: [
          { id: 6, label: "Level three 3-2-1" },
          { id: 7, label: "Level three 3-2-2", disabled: true },
        ],
      },
    ],
  },
];

/** 官方 disabled：节点自身可禁用复选框，需在 props 里声明 disabled 字段名。 */
export function TreeDisabled() {
  return (
    <ElTree
      style={treeWidth}
      data={disabledData}
      props={{ children: "children", label: "label", disabled: "disabled" }}
      showCheckbox
    />
  );
}

const stateData: TreeNodeData[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          { id: 9, label: "Level three 1-1-1" },
          { id: 10, label: "Level three 1-1-2" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      { id: 5, label: "Level two 2-1" },
      { id: 6, label: "Level two 2-2" },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      { id: 7, label: "Level two 3-1" },
      { id: 8, label: "Level two 3-2" },
    ],
  },
];

/** 官方 default-state：default-expanded-keys / default-checked-keys 需要 node-key。 */
export function TreeDefaultState() {
  return (
    <ElTree
      style={treeWidth}
      data={stateData}
      showCheckbox
      nodeKey="id"
      defaultExpandedKeys={[2, 3]}
      defaultCheckedKeys={[5]}
      props={defaultProps}
    />
  );
}

/** 官方 checking-tree：通过实例方法读写勾选态。 */
export function TreeChecking() {
  const [tree, setTree] = useState<TreeInstance | null>(null);

  return (
    <>
      <ElTree
        onReady={setTree}
        style={treeWidth}
        data={stateData}
        showCheckbox
        defaultExpandAll
        nodeKey="id"
        highlightCurrent
        props={defaultProps}
      />

      <div style={row}>
        <ElButton onClick={() => console.log(tree?.getCheckedNodes(false, false))}>
          get by node
        </ElButton>
        <ElButton onClick={() => console.log(tree?.getCheckedKeys(false))}>
          get by key
        </ElButton>
        <ElButton
          onClick={() =>
            tree?.setCheckedNodes(
              [
                { id: 5, label: "Level two 2-1" },
                { id: 9, label: "Level three 1-1-1" },
              ],
              false,
            )
          }
        >
          set by node
        </ElButton>
        <ElButton onClick={() => tree?.setCheckedKeys([3], false)}>
          set by key
        </ElButton>
        <ElButton onClick={() => tree?.setCheckedKeys([], false)}>reset</ElButton>
      </div>
    </>
  );
}

let customId = 1000;

const customData: TreeNodeData[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          { id: 9, label: "Level three 1-1-1" },
          { id: 10, label: "Level three 1-1-2" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      { id: 5, label: "Level two 2-1" },
      { id: 6, label: "Level two 2-2" },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      { id: 7, label: "Level two 3-1" },
      { id: 8, label: "Level two 3-2" },
    ],
  },
];

const customNodeStyle: CSSProperties = {
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "1.4rem",
  paddingRight: "0.8rem",
};

/** 官方 customized-node：render-content 与作用域插槽两种自定义节点内容的方式。 */
export function TreeCustomizedNode() {
  const [renderTree, setRenderTree] = useState<TreeInstance | null>(null);
  const [slotTree, setSlotTree] = useState<TreeInstance | null>(null);

  const append = (data: TreeNodeData) => {
    const newChild = { id: customId++, label: "testtest", children: [] };
    renderTree?.append(newChild, data);
    slotTree?.append(newChild, data);
  };

  const remove = (data: TreeNodeData) => {
    renderTree?.remove(data);
    slotTree?.remove(data);
  };

  const renderContent = (context: RenderContentContext) => {
    const { node, data } = context;
    return (
      <div style={customNodeStyle}>
        <span>{node.label}</span>
        <div>
          <ElButton type="primary" link onClick={() => append(data)}>
            Append
          </ElButton>
          <ElButton
            type="danger"
            link
            style={{ marginLeft: "4px" }}
            onClick={() => remove(data)}
          >
            Delete
          </ElButton>
        </div>
      </div>
    );
  };

  return (
    <div style={stack}>
      <p>Using render-content</p>
      <ElTree
        onReady={setRenderTree}
        style={treeWidth}
        data={customData}
        showCheckbox
        nodeKey="id"
        defaultExpandAll
        expandOnClickNode={false}
        renderContent={renderContent}
      />
      <p>Using scoped slot</p>
      <ElTree
        onReady={setSlotTree}
        style={treeWidth}
        data={customData}
        showCheckbox
        nodeKey="id"
        defaultExpandAll
        expandOnClickNode={false}
      >
        {({ node, data }) => (
          <div style={customNodeStyle}>
            <span>{node.label}</span>
            <div>
              <ElButton type="primary" link onClick={() => append(data)}>
                Append
              </ElButton>
              <ElButton
                type="danger"
                link
                style={{ marginLeft: "4px" }}
                onClick={() => remove(data)}
              >
                Delete
              </ElButton>
            </div>
          </div>
        )}
      </ElTree>
    </div>
  );
}

const penultimateData: TreeNodeData[] = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        isPenultimate: true,
        children: [
          { id: 9, label: "Level three 1-1-1" },
          { id: 10, label: "Level three 1-1-2" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    isPenultimate: true,
    children: [
      { id: 5, label: "Level two 2-1" },
      { id: 6, label: "Level two 2-2" },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    isPenultimate: true,
    children: [
      { id: 7, label: "Level two 3-1" },
      { id: 8, label: "Level two 3-2" },
    ],
  },
];

/** 官方 custom-node-class：用 props.class 给节点打自定义类名。 */
export function TreeCustomNodeClass() {
  return (
    <ElTree
      style={treeWidth}
      data={penultimateData}
      showCheckbox
      nodeKey="id"
      defaultExpandAll
      expandOnClickNode={false}
      props={{
        class: (data) =>
          (data as { isPenultimate?: boolean }).isPenultimate
            ? "is-penultimate"
            : "",
      }}
    />
  );
}

/** 官方 filtering：调用实例的 filter 方法过滤节点，需要 filter-node-method。 */
export function TreeFiltering() {
  const [tree, setTree] = useState<TreeInstance | null>(null);
  const [filterText, setFilterText] = useState("");

  return (
    <div style={stack}>
      <ElInput
        value={filterText}
        onChange={(value) => {
          setFilterText(value);
          tree?.filter(value);
        }}
        style={{ width: "240px" }}
        placeholder="Filter keyword"
      />
      <ElTree
        onReady={setTree}
        style={treeWidth}
        data={stateData}
        props={defaultProps}
        defaultExpandAll
        filterNodeMethod={(value, data) => {
          if (!value) return true;
          return String(data.label).includes(String(value));
        }}
      />
    </div>
  );
}

const dragData: TreeNodeData[] = [
  {
    label: "Level one 1",
    children: [
      {
        label: "Level two 1-1",
        children: [{ label: "Level three 1-1-1" }],
      },
    ],
  },
  {
    label: "Level one 2",
    children: [
      {
        label: "Level two 2-1",
        children: [{ label: "Level three 2-1-1" }],
      },
      {
        label: "Level two 2-2",
        children: [{ label: "Level three 2-2-1" }],
      },
    ],
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [{ label: "Level three 3-1-1" }],
      },
      {
        label: "Level two 3-2",
        children: [{ label: "Level three 3-2-1" }],
      },
    ],
  },
];

/** 官方 draggable：拖拽节点改变父子与顺序，allow-drag / allow-drop 控制可拖可落。 */
export function TreeDraggable() {
  return (
    <ElTree
      style={treeWidth}
      data={dragData}
      draggable
      defaultExpandAll
      nodeKey="label"
      onNodeDragStart={(node) => console.log("drag start", node)}
      onNodeDragEnter={(_dragging, dropNode) =>
        console.log("tree drag enter:", dropNode.label)
      }
      onNodeDragLeave={(_dragging, dropNode) =>
        console.log("tree drag leave:", dropNode.label)
      }
      onNodeDragOver={(_dragging, dropNode) =>
        console.log("tree drag over:", dropNode.label)
      }
      onNodeDragEnd={(draggingNode, dropNode, dropType) =>
        console.log("tree drag end:", dropNode && dropNode.label, dropType)
      }
      onNodeDrop={(_dragging, dropNode, dropType) =>
        console.log("tree drop:", dropNode.label, dropType)
      }
      allowDrop={(_dragging, dropNode, type: AllowDropType) => {
        if (dropNode.data.label === "Level two 3-1") {
          return type !== "inner";
        }
        return true;
      }}
      allowDrag={(draggingNode) =>
        !String(draggingNode.data.label).includes("Level three 3-1-1")
      }
    />
  );
}
