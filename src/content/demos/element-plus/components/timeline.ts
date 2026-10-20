import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "timeline/basic": {
    load: () => import("@/components/element-plus/examples/timeline"),
    exportName: "TimelineBasic",
    sourceFile: "src/components/element-plus/examples/timeline/index.tsx",
  },
  "timeline/mode": {
    load: () => import("@/components/element-plus/examples/timeline"),
    exportName: "TimelineMode",
    sourceFile: "src/components/element-plus/examples/timeline/index.tsx",
  },
  "timeline/custom-node": {
    load: () => import("@/components/element-plus/examples/timeline"),
    exportName: "TimelineCustomNode",
    sourceFile: "src/components/element-plus/examples/timeline/index.tsx",
  },
  "timeline/custom-timestamp": {
    load: () => import("@/components/element-plus/examples/timeline"),
    exportName: "TimelineCustomTimestamp",
    sourceFile: "src/components/element-plus/examples/timeline/index.tsx",
  },
  "timeline/center": {
    load: () => import("@/components/element-plus/examples/timeline"),
    exportName: "TimelineCenter",
    sourceFile: "src/components/element-plus/examples/timeline/index.tsx",
  },
  "timeline/reverse": {
    load: () => import("@/components/element-plus/examples/timeline"),
    exportName: "TimelineReverse",
    sourceFile: "src/components/element-plus/examples/timeline/index.tsx",
  },
};

export default manifest;
