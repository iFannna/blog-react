import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "breadcrumb/basic": {
    load: () => import("@/components/element-plus/examples/nav"),
    exportName: "BreadcrumbBasic",
    sourceFile: "src/components/element-plus/examples/nav/index.tsx",
  },
  "breadcrumb/icon": {
    load: () => import("@/components/element-plus/examples/nav"),
    exportName: "BreadcrumbIcon",
    sourceFile: "src/components/element-plus/examples/nav/index.tsx",
  },
};

export default manifest;
