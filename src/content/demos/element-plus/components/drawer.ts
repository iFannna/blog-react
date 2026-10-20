import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "drawer/basic-usage": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerBasicUsage",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
  "drawer/no-title": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerNoTitle",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
  "drawer/customization-content": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerCustomizationContent",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
  "drawer/customization-header": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerCustomizationHeader",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
  "drawer/resizable": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerResizable",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
  "drawer/nested-drawer": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerNestedDrawer",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
  "drawer/modal": {
    load: () => import("@/components/element-plus/examples/drawer"),
    exportName: "DrawerModal",
    sourceFile: "src/components/element-plus/examples/drawer/index.tsx",
  },
};

export default manifest;
