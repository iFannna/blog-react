import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "scrollbar/basic-usage": {
    load: () => import("@/components/element-plus/examples/scrollbar"),
    exportName: "ScrollbarBasic",
    sourceFile: "src/components/element-plus/examples/scrollbar/index.tsx",
  },
  "scrollbar/horizontal-scroll": {
    load: () => import("@/components/element-plus/examples/scrollbar"),
    exportName: "ScrollbarHorizontal",
    sourceFile: "src/components/element-plus/examples/scrollbar/index.tsx",
  },
  "scrollbar/max-height": {
    load: () => import("@/components/element-plus/examples/scrollbar"),
    exportName: "ScrollbarMaxHeight",
    sourceFile: "src/components/element-plus/examples/scrollbar/index.tsx",
  },
  "scrollbar/manual-scroll": {
    load: () => import("@/components/element-plus/examples/scrollbar"),
    exportName: "ScrollbarManual",
    sourceFile: "src/components/element-plus/examples/scrollbar/index.tsx",
  },
  "scrollbar/infinite-scroll": {
    load: () => import("@/components/element-plus/examples/scrollbar"),
    exportName: "ScrollbarInfinite",
    sourceFile: "src/components/element-plus/examples/scrollbar/index.tsx",
  },
};

export default manifest;
