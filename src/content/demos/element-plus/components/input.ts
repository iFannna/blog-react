import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "input/basic": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputBasic",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/disabled": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputDisabled",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/clearable": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputClearable",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/clear-icon": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputClearIcon",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/formatter": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputFormatter",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/password": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputPassword",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/with-icon": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputIcons",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/textarea": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputTextarea",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/auto-sizing-textarea": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputAutoSizingTextarea",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/mixed-input": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputMixedInput",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/various-size": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputSizes",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/length-limiting": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputWordLimit",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
  "input/count-graphemes": {
    load: () => import("@/components/docs/examples/input"),
    exportName: "InputCountGraphemes",
    sourceFile: "src/components/docs/examples/input/index.tsx",
  },
};

export default manifest;
