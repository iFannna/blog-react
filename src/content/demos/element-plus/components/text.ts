import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "text/basic": {
    load: () => import("@/components/element-plus/examples/text"),
    exportName: "TextBasic",
    sourceFile: "src/components/element-plus/examples/text/index.tsx",
  },
  "text/sizes": {
    load: () => import("@/components/element-plus/examples/text"),
    exportName: "TextSizes",
    sourceFile: "src/components/element-plus/examples/text/index.tsx",
  },
  "text/truncated": {
    load: () => import("@/components/element-plus/examples/text"),
    exportName: "TextTruncated",
    sourceFile: "src/components/element-plus/examples/text/index.tsx",
  },
  "text/mixed": {
    load: () => import("@/components/element-plus/examples/text"),
    exportName: "TextMixed",
    sourceFile: "src/components/element-plus/examples/text/index.tsx",
  },
  "text/override": {
    load: () => import("@/components/element-plus/examples/text"),
    exportName: "TextOverride",
    sourceFile: "src/components/element-plus/examples/text/index.tsx",
  },
};

export default manifest;
