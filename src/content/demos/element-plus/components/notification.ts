import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "notification/basic": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationBasic",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/different-types": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationDifferentTypes",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/positioning": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationPositioning",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/offsetting": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationOffsetting",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/raw-html": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationRawHtml",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/use-vnode": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationUseVnode",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/progress-bar": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationProgressBar",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "notification/no-close": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "NotificationNoClose",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
};

export default manifest;
