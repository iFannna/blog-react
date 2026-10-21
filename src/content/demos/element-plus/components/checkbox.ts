import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "checkbox/basic": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxBasic",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/disabled": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxDisabled",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/grouping": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxGroupDemo",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/intermediate": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxIndeterminate",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/limitation": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxMinMax",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/options": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxOptions",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/button-style": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxButton",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
  "checkbox/with-border": {
    load: () => import("@/components/docs/examples/checkbox"),
    exportName: "CheckboxBorder",
    sourceFile: "src/components/docs/examples/checkbox/index.tsx",
  },
};

export default manifest;
