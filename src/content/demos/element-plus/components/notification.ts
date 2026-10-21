import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "notification/basic": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationBasic",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/different-types": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationDifferentTypes",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/positioning": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationPositioning",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/offsetting": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationOffsetting",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/raw-html": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationRawHtml",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/use-vnode": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationUseVnode",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/progress-bar": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationProgressBar",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "notification/no-close": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "NotificationNoClose",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
};

export default manifest;
