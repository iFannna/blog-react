import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "splitter/basic": {
    load: () => import("@/components/element-plus/examples/splitter"),
    exportName: "SplitterBasic",
    sourceFile: "src/components/element-plus/examples/splitter/index.tsx",
  },
  "splitter/vertical": {
    load: () => import("@/components/element-plus/examples/splitter"),
    exportName: "SplitterVertical",
    sourceFile: "src/components/element-plus/examples/splitter/index.tsx",
  },
  "splitter/collapsible": {
    load: () => import("@/components/element-plus/examples/splitter"),
    exportName: "SplitterCollapsible",
    sourceFile: "src/components/element-plus/examples/splitter/index.tsx",
  },
  "splitter/disableDrag": {
    load: () => import("@/components/element-plus/examples/splitter"),
    exportName: "SplitterDisableDrag",
    sourceFile: "src/components/element-plus/examples/splitter/index.tsx",
  },
  "splitter/size": {
    load: () => import("@/components/element-plus/examples/splitter"),
    exportName: "SplitterSize",
    sourceFile: "src/components/element-plus/examples/splitter/index.tsx",
  },
  "splitter/lazy": {
    load: () => import("@/components/element-plus/examples/splitter"),
    exportName: "SplitterLazy",
    sourceFile: "src/components/element-plus/examples/splitter/index.tsx",
  },
};

export default manifest;
