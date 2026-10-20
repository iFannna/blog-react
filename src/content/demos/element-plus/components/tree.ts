import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tree/basic": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeBasic",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/selectable": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeSelectable",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/custom-leaf": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeCustomLeaf",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/multiple-times-load": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeMultipleTimesLoad",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/disabled": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeDisabled",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/default-state": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeDefaultState",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/checking-tree": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeChecking",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/customized-node": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeCustomizedNode",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/custom-node-class": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeCustomNodeClass",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/filtering": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeFiltering",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/accordion": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeAccordion",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
  "tree/draggable": {
    load: () => import("@/components/element-plus/examples/tree"),
    exportName: "TreeDraggable",
    sourceFile: "src/components/element-plus/examples/tree/index.tsx",
  },
};

export default manifest;
