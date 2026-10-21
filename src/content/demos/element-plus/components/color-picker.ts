import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "color-picker/basic": {
    load: () => import("@/components/docs/examples/color-picker"),
    exportName: "ColorPickerBasic",
    sourceFile: "src/components/docs/examples/color-picker/index.tsx",
  },
  "color-picker/alpha": {
    load: () => import("@/components/docs/examples/color-picker"),
    exportName: "ColorPickerAlpha",
    sourceFile: "src/components/docs/examples/color-picker/index.tsx",
  },
  "color-picker/predefined-color": {
    load: () => import("@/components/docs/examples/color-picker"),
    exportName: "ColorPickerPredefinedColor",
    sourceFile: "src/components/docs/examples/color-picker/index.tsx",
  },
  "color-picker/sizes": {
    load: () => import("@/components/docs/examples/color-picker"),
    exportName: "ColorPickerSizes",
    sourceFile: "src/components/docs/examples/color-picker/index.tsx",
  },
};

export default manifest;
