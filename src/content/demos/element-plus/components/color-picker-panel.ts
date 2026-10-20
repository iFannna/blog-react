import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "color-picker-panel/basic": {
    load: () => import("@/components/element-plus/examples/color-picker-panel"),
    exportName: "ColorPickerPanelBasic",
    sourceFile: "src/components/element-plus/examples/color-picker-panel/index.tsx",
  },
  "color-picker-panel/alpha": {
    load: () => import("@/components/element-plus/examples/color-picker-panel"),
    exportName: "ColorPickerPanelAlpha",
    sourceFile: "src/components/element-plus/examples/color-picker-panel/index.tsx",
  },
  "color-picker-panel/predefined-color": {
    load: () => import("@/components/element-plus/examples/color-picker-panel"),
    exportName: "ColorPickerPanelPredefinedColor",
    sourceFile: "src/components/element-plus/examples/color-picker-panel/index.tsx",
  },
  "color-picker-panel/border": {
    load: () => import("@/components/element-plus/examples/color-picker-panel"),
    exportName: "ColorPickerPanelBorder",
    sourceFile: "src/components/element-plus/examples/color-picker-panel/index.tsx",
  },
  "color-picker-panel/disabled": {
    load: () => import("@/components/element-plus/examples/color-picker-panel"),
    exportName: "ColorPickerPanelDisabled",
    sourceFile: "src/components/element-plus/examples/color-picker-panel/index.tsx",
  },
};

export default manifest;
