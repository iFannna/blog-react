import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "rate/basic-usage": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateBasic",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
  "rate/sizes": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateSizes",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
  "rate/allow-half": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateAllowHalf",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
  "rate/text": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateText",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
  "rate/clearable": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateClearable",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
  "rate/more-icons": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateMoreIcons",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
  "rate/readonly": {
    load: () => import("@/components/docs/examples/rate"),
    exportName: "RateReadonly",
    sourceFile: "src/components/docs/examples/rate/index.tsx",
  },
};

export default manifest;
