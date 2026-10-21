import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "scrollbar/basic-usage": {
    load: () => import("@/components/docs/examples/scrollbar"),
    exportName: "ScrollbarBasic",
    sourceFile: "src/components/docs/examples/scrollbar/index.tsx",
  },
  "scrollbar/horizontal-scroll": {
    load: () => import("@/components/docs/examples/scrollbar"),
    exportName: "ScrollbarHorizontal",
    sourceFile: "src/components/docs/examples/scrollbar/index.tsx",
  },
  "scrollbar/max-height": {
    load: () => import("@/components/docs/examples/scrollbar"),
    exportName: "ScrollbarMaxHeight",
    sourceFile: "src/components/docs/examples/scrollbar/index.tsx",
  },
  "scrollbar/manual-scroll": {
    load: () => import("@/components/docs/examples/scrollbar"),
    exportName: "ScrollbarManual",
    sourceFile: "src/components/docs/examples/scrollbar/index.tsx",
  },
  "scrollbar/infinite-scroll": {
    load: () => import("@/components/docs/examples/scrollbar"),
    exportName: "ScrollbarInfinite",
    sourceFile: "src/components/docs/examples/scrollbar/index.tsx",
  },
};

export default manifest;
