import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tour/basic": {
    load: () => import("@/components/docs/examples/tour"),
    exportName: "TourBasic",
    sourceFile: "src/components/docs/examples/tour/index.tsx",
  },
  "tour/non-modal": {
    load: () => import("@/components/docs/examples/tour"),
    exportName: "TourNonModal",
    sourceFile: "src/components/docs/examples/tour/index.tsx",
  },
  "tour/placement": {
    load: () => import("@/components/docs/examples/tour"),
    exportName: "TourPlacement",
    sourceFile: "src/components/docs/examples/tour/index.tsx",
  },
  "tour/mask": {
    load: () => import("@/components/docs/examples/tour"),
    exportName: "TourMask",
    sourceFile: "src/components/docs/examples/tour/index.tsx",
  },
  "tour/indicator": {
    load: () => import("@/components/docs/examples/tour"),
    exportName: "TourIndicator",
    sourceFile: "src/components/docs/examples/tour/index.tsx",
  },
  "tour/target": {
    load: () => import("@/components/docs/examples/tour"),
    exportName: "TourTarget",
    sourceFile: "src/components/docs/examples/tour/index.tsx",
  },
};

export default manifest;
