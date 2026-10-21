import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tabs/basic": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsBasic",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/card-style": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsCard",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/border-card": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsBorderCard",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/custom-tab": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsCustomLabel",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/customized-add-button-icon": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsCustomAddIcon",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/customized-trigger": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsCustomizedTrigger",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/default-value": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsDefaultValue",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/dynamic-tabs": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsDynamic",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
  "tabs/tab-position": {
    load: () => import("@/components/docs/examples/tabs"),
    exportName: "TabsPosition",
    sourceFile: "src/components/docs/examples/tabs/index.tsx",
  },
};

export default manifest;
