import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "alert/basic": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertBasic",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
  "alert/theme": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertTheme",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
  "alert/close-button": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertCustomClose",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
  "alert/description": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertDescription",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
  "alert/icon": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertIcon",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
  "alert/center": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertCenter",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
  "alert/icon-description": {
    load: () => import("@/components/element-plus/examples/alert"),
    exportName: "AlertClosable",
    sourceFile: "src/components/element-plus/examples/alert/index.tsx",
  },
};

export default manifest;
