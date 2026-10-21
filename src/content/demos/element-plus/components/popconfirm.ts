import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "popconfirm/placement": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopconfirmPlacement",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popconfirm/basic-usage": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopconfirmBasicUsage",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popconfirm/customize": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopconfirmCustomize",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popconfirm/trigger-event": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopconfirmTriggerEvent",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
};

export default manifest;
