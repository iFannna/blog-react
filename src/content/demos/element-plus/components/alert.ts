import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "alert/basic": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertBasic",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
  "alert/theme": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertTheme",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
  "alert/close-button": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertCustomClose",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
  "alert/description": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertDescription",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
  "alert/icon": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertIcon",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
  "alert/center": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertCenter",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
  "alert/icon-description": {
    load: () => import("@/components/docs/examples/alert"),
    exportName: "AlertIconDescription",
    sourceFile: "src/components/docs/examples/alert/index.tsx",
  },
};

export default manifest;
