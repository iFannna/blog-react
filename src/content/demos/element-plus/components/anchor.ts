import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "anchor/basic": {
    load: () => import("@/components/docs/examples/anchor"),
    exportName: "AnchorBasic",
    sourceFile: "src/components/docs/examples/anchor/index.tsx",
  },
  "anchor/horizontal": {
    load: () => import("@/components/docs/examples/anchor"),
    exportName: "AnchorHorizontal",
    sourceFile: "src/components/docs/examples/anchor/index.tsx",
  },
  "anchor/scroll": {
    load: () => import("@/components/docs/examples/anchor"),
    exportName: "AnchorScroll",
    sourceFile: "src/components/docs/examples/anchor/index.tsx",
  },
  "anchor/change": {
    load: () => import("@/components/docs/examples/anchor"),
    exportName: "AnchorChange",
    sourceFile: "src/components/docs/examples/anchor/index.tsx",
  },
  "anchor/underline": {
    load: () => import("@/components/docs/examples/anchor"),
    exportName: "AnchorUnderline",
    sourceFile: "src/components/docs/examples/anchor/index.tsx",
  },
  "anchor/affix": {
    load: () => import("@/components/docs/examples/anchor"),
    exportName: "AnchorAffix",
    sourceFile: "src/components/docs/examples/anchor/index.tsx",
  },
};

export default manifest;
