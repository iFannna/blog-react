import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tag/basic": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagBasic",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
  "tag/removable": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagClosable",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
  "tag/editable": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagClosableDynamic",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
  "tag/sizes": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagSizes",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
  "tag/theme": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagEffect",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
  "tag/rounded": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagRound",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
  "tag/checkable": {
    load: () => import("@/components/docs/examples/tag"),
    exportName: "TagCheckable",
    sourceFile: "src/components/docs/examples/tag/index.tsx",
  },
};

export default manifest;
