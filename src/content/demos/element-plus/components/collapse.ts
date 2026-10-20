import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "collapse/basic": {
    load: () => import("@/components/element-plus/examples/collapse"),
    exportName: "CollapseBasic",
    sourceFile: "src/components/element-plus/examples/collapse/index.tsx",
  },
  "collapse/accordion": {
    load: () => import("@/components/element-plus/examples/collapse"),
    exportName: "CollapseAccordion",
    sourceFile: "src/components/element-plus/examples/collapse/index.tsx",
  },
  "collapse/custom-icon-position": {
    load: () => import("@/components/element-plus/examples/collapse"),
    exportName: "CollapseIconPosition",
    sourceFile: "src/components/element-plus/examples/collapse/index.tsx",
  },
  "collapse/custom-icon": {
    load: () => import("@/components/element-plus/examples/collapse"),
    exportName: "CollapseCustomIcon",
    sourceFile: "src/components/element-plus/examples/collapse/index.tsx",
  },
  "collapse/customization": {
    load: () => import("@/components/element-plus/examples/collapse"),
    exportName: "CollapseCustomTitle",
    sourceFile: "src/components/element-plus/examples/collapse/index.tsx",
  },
  "collapse/prevent-collapsing": {
    load: () => import("@/components/element-plus/examples/collapse"),
    exportName: "CollapsePreventCollapsing",
    sourceFile: "src/components/element-plus/examples/collapse/index.tsx",
  },
};

export default manifest;
