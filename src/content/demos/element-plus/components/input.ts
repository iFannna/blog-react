import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "input/basic": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputBasic",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/disabled": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputDisabled",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/clearable": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputClearable",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/clear-icon": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputClearIcon",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/formatter": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputFormatter",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/password": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputPassword",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/with-icon": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputIcons",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/textarea": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputTextarea",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/auto-sizing-textarea": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputAutoSizingTextarea",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/mixed-input": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputMixedInput",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/various-size": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputSizes",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/length-limiting": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputWordLimit",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
  "input/count-graphemes": {
    load: () => import("@/components/element-plus/examples/input"),
    exportName: "InputCountGraphemes",
    sourceFile: "src/components/element-plus/examples/input/index.tsx",
  },
};

export default manifest;
