import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "affix/basic": {
    load: () => import("@/components/docs/examples/affix"),
    exportName: "AffixBasic",
    sourceFile: "src/components/docs/examples/affix/index.tsx",
  },
  "affix/target": {
    load: () => import("@/components/docs/examples/affix"),
    exportName: "AffixTarget",
    sourceFile: "src/components/docs/examples/affix/index.tsx",
  },
  "affix/fixed": {
    load: () => import("@/components/docs/examples/affix"),
    exportName: "AffixFixed",
    sourceFile: "src/components/docs/examples/affix/index.tsx",
  },
};

export default manifest;
