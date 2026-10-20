import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "radio/basic-usage": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioBasic",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
  "radio/disabled": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioDisabled",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
  "radio/options": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioOptions",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
  "radio/radio-button": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioButton",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
  "radio/with-borders": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioBorder",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
  "radio/sizes": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioSizes",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
  "radio/radio-group": {
    load: () => import("@/components/element-plus/examples/radio"),
    exportName: "RadioBasic",
    sourceFile: "src/components/element-plus/examples/radio/index.tsx",
  },
};

export default manifest;
