import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tree-v2/basic": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2Basic",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/selectable": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2Selectable",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/disabled": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2Disabled",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/default-state": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2DefaultState",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/custom-node": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2CustomNode",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/custom-node-class": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2CustomNodeClass",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/custom-icon": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2CustomIcon",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
  "tree-v2/filter": {
    load: () => import("@/components/element-plus/examples/tree-v2"),
    exportName: "TreeV2Filter",
    sourceFile: "src/components/element-plus/examples/tree-v2/index.tsx",
  },
};

export default manifest;
