import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "collapse/basic": {
    load: () => import("@/components/docs/examples/collapse"),
    exportName: "CollapseBasic",
    sourceFile: "src/components/docs/examples/collapse/index.tsx",
  },
  "collapse/accordion": {
    load: () => import("@/components/docs/examples/collapse"),
    exportName: "CollapseAccordion",
    sourceFile: "src/components/docs/examples/collapse/index.tsx",
  },
  "collapse/custom-icon-position": {
    load: () => import("@/components/docs/examples/collapse"),
    exportName: "CollapseIconPosition",
    sourceFile: "src/components/docs/examples/collapse/index.tsx",
  },
  "collapse/custom-icon": {
    load: () => import("@/components/docs/examples/collapse"),
    exportName: "CollapseCustomIcon",
    sourceFile: "src/components/docs/examples/collapse/index.tsx",
  },
  "collapse/customization": {
    load: () => import("@/components/docs/examples/collapse"),
    exportName: "CollapseCustomTitle",
    sourceFile: "src/components/docs/examples/collapse/index.tsx",
  },
  "collapse/prevent-collapsing": {
    load: () => import("@/components/docs/examples/collapse"),
    exportName: "CollapsePreventCollapsing",
    sourceFile: "src/components/docs/examples/collapse/index.tsx",
  },
};

export default manifest;
