import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "check-tag/basic": {
    load: () => import("@/components/element-plus/examples/check-tag"),
    exportName: "CheckTagBasic",
    sourceFile: "src/components/element-plus/examples/check-tag/index.tsx",
  },
  "check-tag/types": {
    load: () => import("@/components/element-plus/examples/check-tag"),
    exportName: "CheckTagTypes",
    sourceFile: "src/components/element-plus/examples/check-tag/index.tsx",
  },
  "check-tag/disabled": {
    load: () => import("@/components/element-plus/examples/check-tag"),
    exportName: "CheckTagDisabled",
    sourceFile: "src/components/element-plus/examples/check-tag/index.tsx",
  },
};

export default manifest;
