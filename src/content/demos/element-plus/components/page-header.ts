import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "page-header/complete": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderComplete",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
  "page-header/basic": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderBasic",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
  "page-header/custom-icon": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderCustomIcon",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
  "page-header/no-icon": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderNoIcon",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
  "page-header/breadcrumb": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderBreadcrumb",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
  "page-header/additional-sections": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderAdditionalSections",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
  "page-header/main-content": {
    load: () => import("@/components/element-plus/examples/page-header"),
    exportName: "PageHeaderMainContent",
    sourceFile: "src/components/element-plus/examples/page-header/index.tsx",
  },
};

export default manifest;
