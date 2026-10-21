import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "slider/basic-usage": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderBasic",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/discrete-values": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderDiscreteValues",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/slider-with-input-box": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderWithInput",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/sizes": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderSizes",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/placement": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderPlacement",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/range-selection": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderRange",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/vertical-mode": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderVertical",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/show-marks": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderShowMarks",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
  "slider/restrict-value": {
    load: () => import("@/components/docs/examples/slider"),
    exportName: "SliderRestrictValue",
    sourceFile: "src/components/docs/examples/slider/index.tsx",
  },
};

export default manifest;
