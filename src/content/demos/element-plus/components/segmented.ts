import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "segmented/basic": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedBasic",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
  "segmented/custom-direction": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedCustomDirection",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
  "segmented/disabled": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedDisabled",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
  "segmented/props": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedAliases",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
  "segmented/block": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedBlock",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
  "segmented/custom-content": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedCustomContent",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
  "segmented/custom-style": {
    load: () => import("@/components/docs/examples/segmented"),
    exportName: "SegmentedCustomStyle",
    sourceFile: "src/components/docs/examples/segmented/index.tsx",
  },
};

export default manifest;
