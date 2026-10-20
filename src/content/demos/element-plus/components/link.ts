import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "link/basic": {
    load: () => import("@/components/element-plus/examples/link"),
    exportName: "LinkBasic",
    sourceFile: "src/components/element-plus/examples/link/index.tsx",
  },
  "link/disabled": {
    load: () => import("@/components/element-plus/examples/link"),
    exportName: "LinkDisabled",
    sourceFile: "src/components/element-plus/examples/link/index.tsx",
  },
  "link/underline": {
    load: () => import("@/components/element-plus/examples/link"),
    exportName: "LinkUnderline",
    sourceFile: "src/components/element-plus/examples/link/index.tsx",
  },
  "link/with-icon": {
    load: () => import("@/components/element-plus/examples/link"),
    exportName: "LinkIcon",
    sourceFile: "src/components/element-plus/examples/link/index.tsx",
  },
};

export default manifest;
