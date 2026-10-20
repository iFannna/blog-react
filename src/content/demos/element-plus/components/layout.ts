import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "layout/basic-layout": {
    load: () => import("@/components/element-plus/examples/layout"),
    exportName: "RowBasic",
    sourceFile: "src/components/element-plus/examples/layout/index.tsx",
  },
  "layout/column-spacing": {
    load: () => import("@/components/element-plus/examples/layout"),
    exportName: "RowGutter",
    sourceFile: "src/components/element-plus/examples/layout/index.tsx",
  },
  "layout/column-offset": {
    load: () => import("@/components/element-plus/examples/layout"),
    exportName: "RowOffset",
    sourceFile: "src/components/element-plus/examples/layout/index.tsx",
  },
  "layout/alignment": {
    load: () => import("@/components/element-plus/examples/layout"),
    exportName: "RowJustify",
    sourceFile: "src/components/element-plus/examples/layout/index.tsx",
  },
  "layout/hybrid-layout": {
    load: () => import("@/components/element-plus/examples/layout"),
    exportName: "RowHybrid",
    sourceFile: "src/components/element-plus/examples/layout/index.tsx",
  },
  "layout/responsive-layout": {
    load: () => import("@/components/element-plus/examples/layout"),
    exportName: "RowResponsive",
    sourceFile: "src/components/element-plus/examples/layout/index.tsx",
  },
};

export default manifest;
