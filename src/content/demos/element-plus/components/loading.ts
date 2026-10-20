import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "loading/basic": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "LoadingBasic",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "loading/customization": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "LoadingCustomization",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
  "loading/fullscreen": {
    load: () => import("@/components/element-plus/examples/notification"),
    exportName: "LoadingFullscreen",
    sourceFile: "src/components/element-plus/examples/notification/index.tsx",
  },
};

export default manifest;
