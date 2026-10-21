import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "layout/basic-layout": {
    load: () => import("@/components/docs/examples/layout"),
    exportName: "RowBasic",
    sourceFile: "src/components/docs/examples/layout/index.tsx",
  },
  "layout/column-spacing": {
    load: () => import("@/components/docs/examples/layout"),
    exportName: "RowGutter",
    sourceFile: "src/components/docs/examples/layout/index.tsx",
  },
  "layout/column-offset": {
    load: () => import("@/components/docs/examples/layout"),
    exportName: "RowOffset",
    sourceFile: "src/components/docs/examples/layout/index.tsx",
  },
  "layout/alignment": {
    load: () => import("@/components/docs/examples/layout"),
    exportName: "RowJustify",
    sourceFile: "src/components/docs/examples/layout/index.tsx",
  },
  "layout/hybrid-layout": {
    load: () => import("@/components/docs/examples/layout"),
    exportName: "RowHybrid",
    sourceFile: "src/components/docs/examples/layout/index.tsx",
  },
  "layout/responsive-layout": {
    load: () => import("@/components/docs/examples/layout"),
    exportName: "RowResponsive",
    sourceFile: "src/components/docs/examples/layout/index.tsx",
  },
};

export default manifest;
