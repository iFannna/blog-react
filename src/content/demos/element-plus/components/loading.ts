import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "loading/basic": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "LoadingBasic",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "loading/customization": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "LoadingCustomization",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
  "loading/fullscreen": {
    load: () => import("@/components/docs/examples/notification"),
    exportName: "LoadingFullscreen",
    sourceFile: "src/components/docs/examples/notification/index.tsx",
  },
};

export default manifest;
