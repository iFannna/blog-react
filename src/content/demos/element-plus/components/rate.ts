import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "rate/basic-usage": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateBasic",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
  "rate/sizes": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateSizes",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
  "rate/allow-half": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateAllowHalf",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
  "rate/text": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateText",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
  "rate/clearable": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateClearable",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
  "rate/more-icons": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateMoreIcons",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
  "rate/readonly": {
    load: () => import("@/components/element-plus/examples/rate"),
    exportName: "RateReadonly",
    sourceFile: "src/components/element-plus/examples/rate/index.tsx",
  },
};

export default manifest;
