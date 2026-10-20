import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "descriptions/basic-usage": {
    load: () => import("@/components/element-plus/examples/descriptions"),
    exportName: "DescriptionsBasic",
    sourceFile: "src/components/element-plus/examples/descriptions/index.tsx",
  },
  "descriptions/sizes": {
    load: () => import("@/components/element-plus/examples/descriptions"),
    exportName: "DescriptionsSizes",
    sourceFile: "src/components/element-plus/examples/descriptions/index.tsx",
  },
  "descriptions/vertical-list": {
    load: () => import("@/components/element-plus/examples/descriptions"),
    exportName: "DescriptionsVertical",
    sourceFile: "src/components/element-plus/examples/descriptions/index.tsx",
  },
  "descriptions/rowspan": {
    load: () => import("@/components/element-plus/examples/descriptions"),
    exportName: "DescriptionsRowspan",
    sourceFile: "src/components/element-plus/examples/descriptions/index.tsx",
  },
  "descriptions/customized-style": {
    load: () => import("@/components/element-plus/examples/descriptions"),
    exportName: "DescriptionsCustomStyle",
    sourceFile: "src/components/element-plus/examples/descriptions/index.tsx",
  },
};

export default manifest;
