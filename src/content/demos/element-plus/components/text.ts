import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "text/basic": {
    load: () => import("@/components/docs/examples/text"),
    exportName: "TextBasic",
    sourceFile: "src/components/docs/examples/text/index.tsx",
  },
  "text/sizes": {
    load: () => import("@/components/docs/examples/text"),
    exportName: "TextSizes",
    sourceFile: "src/components/docs/examples/text/index.tsx",
  },
  "text/truncated": {
    load: () => import("@/components/docs/examples/text"),
    exportName: "TextTruncated",
    sourceFile: "src/components/docs/examples/text/index.tsx",
  },
  "text/mixed": {
    load: () => import("@/components/docs/examples/text"),
    exportName: "TextMixed",
    sourceFile: "src/components/docs/examples/text/index.tsx",
  },
  "text/override": {
    load: () => import("@/components/docs/examples/text"),
    exportName: "TextOverride",
    sourceFile: "src/components/docs/examples/text/index.tsx",
  },
};

export default manifest;
