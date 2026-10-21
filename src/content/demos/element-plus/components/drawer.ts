import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "drawer/basic-usage": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerBasicUsage",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
  "drawer/no-title": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerNoTitle",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
  "drawer/customization-content": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerCustomizationContent",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
  "drawer/customization-header": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerCustomizationHeader",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
  "drawer/resizable": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerResizable",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
  "drawer/nested-drawer": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerNestedDrawer",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
  "drawer/modal": {
    load: () => import("@/components/docs/examples/drawer"),
    exportName: "DrawerModal",
    sourceFile: "src/components/docs/examples/drawer/index.tsx",
  },
};

export default manifest;
