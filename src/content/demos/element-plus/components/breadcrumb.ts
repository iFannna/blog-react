import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "breadcrumb/basic": {
    load: () => import("@/components/element-plus/examples/breadcrumb"),
    exportName: "BreadcrumbBasic",
    sourceFile: "src/components/element-plus/examples/breadcrumb/index.tsx",
  },
  "breadcrumb/icon": {
    load: () => import("@/components/element-plus/examples/breadcrumb"),
    exportName: "BreadcrumbIcon",
    sourceFile: "src/components/element-plus/examples/breadcrumb/index.tsx",
  },
};

export default manifest;
