import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "checkbox/basic": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxBasic",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/disabled": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxDisabled",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/grouping": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxGroupDemo",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/intermediate": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxIndeterminate",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/limitation": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxMinMax",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/options": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxOptions",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/button-style": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxButton",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
  "checkbox/with-border": {
    load: () => import("@/components/element-plus/examples/checkbox"),
    exportName: "CheckboxBorder",
    sourceFile: "src/components/element-plus/examples/checkbox/index.tsx",
  },
};

export default manifest;
