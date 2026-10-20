import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "popconfirm/placement": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "PopconfirmPlacement",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "popconfirm/basic-usage": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "PopconfirmBasicUsage",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "popconfirm/customize": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "PopconfirmCustomize",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "popconfirm/trigger-event": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "PopconfirmTriggerEvent",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
};

export default manifest;
