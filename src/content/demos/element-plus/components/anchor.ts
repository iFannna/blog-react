import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "anchor/basic": {
    load: () => import("@/components/element-plus/examples/anchor"),
    exportName: "AnchorBasic",
    sourceFile: "src/components/element-plus/examples/anchor/index.tsx",
  },
  "anchor/horizontal": {
    load: () => import("@/components/element-plus/examples/anchor"),
    exportName: "AnchorHorizontal",
    sourceFile: "src/components/element-plus/examples/anchor/index.tsx",
  },
  "anchor/scroll": {
    load: () => import("@/components/element-plus/examples/anchor"),
    exportName: "AnchorScroll",
    sourceFile: "src/components/element-plus/examples/anchor/index.tsx",
  },
  "anchor/change": {
    load: () => import("@/components/element-plus/examples/anchor"),
    exportName: "AnchorChange",
    sourceFile: "src/components/element-plus/examples/anchor/index.tsx",
  },
  "anchor/underline": {
    load: () => import("@/components/element-plus/examples/anchor"),
    exportName: "AnchorUnderline",
    sourceFile: "src/components/element-plus/examples/anchor/index.tsx",
  },
  "anchor/affix": {
    load: () => import("@/components/element-plus/examples/anchor"),
    exportName: "AnchorAffix",
    sourceFile: "src/components/element-plus/examples/anchor/index.tsx",
  },
};

export default manifest;
