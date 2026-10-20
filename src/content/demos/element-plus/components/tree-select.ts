import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tree-select/basic": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectBasic",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/check-strictly": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectCheckStrictly",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/multiple": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectMultiple",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/disabled": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectDisabled",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/filterable": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectFilterable",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/slots": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectSlots",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/lazy": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectLazy",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
  "tree-select/node-key": {
    load: () => import("@/components/element-plus/examples/tree-select"),
    exportName: "TreeSelectNodeKey",
    sourceFile: "src/components/element-plus/examples/tree-select/index.tsx",
  },
};

export default manifest;
