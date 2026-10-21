import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "breadcrumb/basic": {
    load: () => import("@/components/docs/examples/breadcrumb"),
    exportName: "BreadcrumbBasic",
    sourceFile: "src/components/docs/examples/breadcrumb/index.tsx",
  },
  "breadcrumb/icon": {
    load: () => import("@/components/docs/examples/breadcrumb"),
    exportName: "BreadcrumbIcon",
    sourceFile: "src/components/docs/examples/breadcrumb/index.tsx",
  },
};

export default manifest;
