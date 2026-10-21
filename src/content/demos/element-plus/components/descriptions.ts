import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "descriptions/basic-usage": {
    load: () => import("@/components/docs/examples/descriptions"),
    exportName: "DescriptionsBasic",
    sourceFile: "src/components/docs/examples/descriptions/index.tsx",
  },
  "descriptions/sizes": {
    load: () => import("@/components/docs/examples/descriptions"),
    exportName: "DescriptionsSizes",
    sourceFile: "src/components/docs/examples/descriptions/index.tsx",
  },
  "descriptions/vertical-list": {
    load: () => import("@/components/docs/examples/descriptions"),
    exportName: "DescriptionsVertical",
    sourceFile: "src/components/docs/examples/descriptions/index.tsx",
  },
  "descriptions/rowspan": {
    load: () => import("@/components/docs/examples/descriptions"),
    exportName: "DescriptionsRowspan",
    sourceFile: "src/components/docs/examples/descriptions/index.tsx",
  },
  "descriptions/customized-style": {
    load: () => import("@/components/docs/examples/descriptions"),
    exportName: "DescriptionsCustomStyle",
    sourceFile: "src/components/docs/examples/descriptions/index.tsx",
  },
};

export default manifest;
