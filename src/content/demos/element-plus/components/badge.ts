import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "badge/basic": {
    load: () => import("@/components/element-plus/examples/badge"),
    exportName: "BadgeBasic",
    sourceFile: "src/components/element-plus/examples/badge/index.tsx",
  },
  "badge/max": {
    load: () => import("@/components/element-plus/examples/badge"),
    exportName: "BadgeMax",
    sourceFile: "src/components/element-plus/examples/badge/index.tsx",
  },
  "badge/customize": {
    load: () => import("@/components/element-plus/examples/badge"),
    exportName: "BadgeCustomize",
    sourceFile: "src/components/element-plus/examples/badge/index.tsx",
  },
  "badge/dot": {
    load: () => import("@/components/element-plus/examples/badge"),
    exportName: "BadgeDot",
    sourceFile: "src/components/element-plus/examples/badge/index.tsx",
  },
  "badge/offset": {
    load: () => import("@/components/element-plus/examples/badge"),
    exportName: "BadgeOffset",
    sourceFile: "src/components/element-plus/examples/badge/index.tsx",
  },
};

export default manifest;
