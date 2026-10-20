import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tabs/basic": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsBasic",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/card-style": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsCard",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/border-card": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsBorderCard",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/custom-tab": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsCustomLabel",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/customized-add-button-icon": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsCustomAddIcon",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/customized-trigger": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsCustomizedTrigger",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/default-value": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsDefaultValue",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/dynamic-tabs": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsDynamic",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
  "tabs/tab-position": {
    load: () => import("@/components/element-plus/examples/tabs"),
    exportName: "TabsPosition",
    sourceFile: "src/components/element-plus/examples/tabs/index.tsx",
  },
};

export default manifest;
