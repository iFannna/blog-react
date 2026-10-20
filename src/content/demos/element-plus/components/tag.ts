import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tag/basic": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagBasic",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
  "tag/removable": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagClosable",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
  "tag/editable": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagClosableDynamic",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
  "tag/sizes": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagSizes",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
  "tag/theme": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagEffect",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
  "tag/rounded": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagRound",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
  "tag/checkable": {
    load: () => import("@/components/element-plus/examples/tag"),
    exportName: "TagCheckable",
    sourceFile: "src/components/element-plus/examples/tag/index.tsx",
  },
};

export default manifest;
