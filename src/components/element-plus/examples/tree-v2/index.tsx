"use client";

import { useRef, useState, type CSSProperties } from "react";

import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Document, Folder, FolderOpened } from "@/components/element-plus/generated/icons";
import { ElInput } from "@/components/element-plus/input";
import { ElTreeV2 } from "@/components/element-plus/tree-v2";
import type {
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
  TreeV2Expose,
} from "@/components/element-plus/tree-v2";

import treeV2Styles from "./tree-v2.module.css";

const treeWidth: CSSProperties = { maxWidth: "600px" };

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

interface DemoTree {
  id: string;
  label: string;
  children?: DemoTree[];
  disabled?: boolean;
  isPenultimate?: boolean;
  [key: string]: unknown;
}

const defaultProps: TreeOptionProps = {
  value: "id",
  label: "label",
  children: "children",
};

function createSeedRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function createData(
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = "node",
  random: () => number,
): DemoTree[] {
  let id = 0;

  return Array.from({ length: minNodesNumber }).map(() => {
    const childrenNumber =
      deep === maxDeep ? 0 : Math.round(random() * maxChildren);
    const nodeKey = `${key}-${++id}`;

    return {
      id: nodeKey,
      label: nodeKey,
      children: childrenNumber
        ? createData(
            maxDeep,
            maxChildren,
            childrenNumber,
            deep + 1,
            nodeKey,
            random,
          )
        : undefined,
    };
  });
}

const basicData = createData(
  4,
  30,
  40,
  1,
  "node",
  createSeedRandom(20240601),
);

const selectableData = createData(
  4,
  30,
  40,
  1,
  "node",
  createSeedRandom(20240602),
);

const disabledData = createData(
  4,
  30,
  40,
  1,
  "node",
  createSeedRandom(20240603),
).map(function markDisabled(node): DemoTree {
  return {
    ...node,
    disabled: node.id.includes("2"),
    children: node.children?.map(markDisabled),
  };
});

const disabledProps: TreeOptionProps = {
  ...defaultProps,
  disabled: "disabled",
};

const defaultStateData = createData(
  4,
  30,
  40,
  1,
  "node",
  createSeedRandom(20240604),
);

const defaultCheckedKeys: TreeKey[] = [];
const defaultExpandedKeys: TreeKey[] = [];
for (const datum of defaultStateData) {
  const children = datum.children;
  if (children) {
    defaultExpandedKeys.push(datum.id);
    defaultCheckedKeys.push(children[0].id);
    break;
  }
}

const customNodeData = createData(
  4,
  30,
  40,
  1,
  "node",
  createSeedRandom(20240605),
);

const customIconData = createData(
  4,
  30,
  40,
  1,
  "node",
  createSeedRandom(20240606),
);

const filterData = createData(
  4,
  30,
  5,
  1,
  "node",
  createSeedRandom(20240607),
);

const penultimateData: DemoTree[] = [
  {
    id: "1",
    label: "Level one 1",
    children: [
      {
        id: "4",
        label: "Level two 1-1",
        isPenultimate: true,
        children: [
          { id: "9", label: "Level three 1-1-1" },
          { id: "10", label: "Level three 1-1-2" },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Level one 2",
    isPenultimate: true,
    children: [
      { id: "5", label: "Level two 2-1" },
      { id: "6", label: "Level two 2-2" },
    ],
  },
  {
    id: "3",
    label: "Level one 3",
    isPenultimate: true,
    children: [
      { id: "7", label: "Level two 3-1" },
      { id: "8", label: "Level two 3-2" },
    ],
  },
];

const customNodeClass = (data: TreeNodeData) =>
  data.isPenultimate ? "is-penultimate" : "";

export function TreeV2Basic() {
  return (
    <ElTreeV2
      style={treeWidth}
      data={basicData}
      props={defaultProps}
      height={200}
    />
  );
}

export function TreeV2Selectable() {
  return (
    <ElTreeV2
      style={treeWidth}
      data={selectableData}
      props={defaultProps}
      showCheckbox
      height={200}
    />
  );
}

export function TreeV2Disabled() {
  return (
    <ElTreeV2
      style={treeWidth}
      data={disabledData}
      props={disabledProps}
      showCheckbox
      height={200}
    />
  );
}

export function TreeV2DefaultState() {
  return (
    <ElTreeV2
      style={treeWidth}
      data={defaultStateData}
      props={defaultProps}
      showCheckbox
      defaultCheckedKeys={defaultCheckedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      height={200}
    />
  );
}

export function TreeV2CustomNode() {
  return (
    <ElTreeV2
      style={treeWidth}
      data={customNodeData}
      props={defaultProps}
      height={200}
    >
      {({ node }) => (
        <>
          <ElIcon className="el-icon--left">
            {node.isLeaf ? (
              <Document />
            ) : node.expanded ? (
              <FolderOpened />
            ) : (
              <Folder />
            )}
          </ElIcon>
          <span
            className={["prefix", node.isLeaf && "is-leaf"]
              .filter(Boolean)
              .join(" ")}
            style={{
              color: node.isLeaf
                ? "var(--el-color-success)"
                : "var(--el-color-primary)",
              marginRight: 10,
            }}
          >
            [ElementPlus]
          </span>
          <span>{node.label}</span>
        </>
      )}
    </ElTreeV2>
  );
}

export function TreeV2CustomNodeClass() {
  return (
    <ElTreeV2
      className={treeV2Styles.nodeClassScope}
      style={treeWidth}
      data={penultimateData}
      showCheckbox
      expandOnClickNode={false}
      props={{ class: customNodeClass }}
    />
  );
}

export function TreeV2CustomIcon() {
  return (
    <ElTreeV2
      style={treeWidth}
      data={customIconData}
      props={defaultProps}
      height={200}
    >
      {({ node }) => (
        <>
          <ElIcon
            className={["node-icon", node.isLeaf && "is-leaf"]
              .filter(Boolean)
              .join(" ")}
            style={{
              marginRight: 5,
              color: "var(--el-color-warning)",
            }}
          >
            {node.isLeaf ? (
              <Document />
            ) : node.expanded ? (
              <FolderOpened />
            ) : (
              <Folder />
            )}
          </ElIcon>
          <span>{node.label}</span>
        </>
      )}
    </ElTreeV2>
  );
}

export function TreeV2Filter() {
  const treeRef = useRef<TreeV2Expose>(null);
  const [query, setQuery] = useState("");

  return (
    <>
      <ElInput
        value={query}
        style={{ width: "240px", display: "inline-flex" }}
        placeholder="Please enter keyword"
        onChange={(value) => {
          setQuery(value);
          treeRef.current?.filter(value);
        }}
      />
      <ElTreeV2
        ref={treeRef}
        style={treeWidth}
        data={filterData}
        props={defaultProps}
        filterMethod={(value, data) =>
          String(data.label ?? "").includes(value)
        }
        height={200}
      />
    </>
  );
}

export const TREE_V2_DEMOS = [
  TreeV2Basic,
  TreeV2Selectable,
  TreeV2Disabled,
  TreeV2DefaultState,
  TreeV2CustomNode,
  TreeV2CustomNodeClass,
  TreeV2CustomIcon,
  TreeV2Filter,
];
