import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "check-tag/basic": {
    load: () => import("@/components/docs/examples/check-tag"),
    exportName: "CheckTagBasic",
    sourceFile: "src/components/docs/examples/check-tag/index.tsx",
  },
  "check-tag/types": {
    load: () => import("@/components/docs/examples/check-tag"),
    exportName: "CheckTagTypes",
    sourceFile: "src/components/docs/examples/check-tag/index.tsx",
  },
  "check-tag/disabled": {
    load: () => import("@/components/docs/examples/check-tag"),
    exportName: "CheckTagDisabled",
    sourceFile: "src/components/docs/examples/check-tag/index.tsx",
  },
};

export default manifest;
