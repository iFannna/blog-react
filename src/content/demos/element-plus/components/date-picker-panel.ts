import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "date-picker-panel/basic": {
    load: () => import("@/components/element-plus/examples/date-picker-panel"),
    exportName: "DatePickerPanelBasic",
    sourceFile: "src/components/element-plus/examples/date-picker-panel/index.tsx",
  },
  "date-picker-panel/border": {
    load: () => import("@/components/element-plus/examples/date-picker-panel"),
    exportName: "DatePickerPanelBorder",
    sourceFile: "src/components/element-plus/examples/date-picker-panel/index.tsx",
  },
  "date-picker-panel/disabled": {
    load: () => import("@/components/element-plus/examples/date-picker-panel"),
    exportName: "DatePickerPanelDisabled",
    sourceFile: "src/components/element-plus/examples/date-picker-panel/index.tsx",
  },
  "date-picker-panel/all-types": {
    load: () => import("@/components/element-plus/examples/date-picker-panel"),
    exportName: "DatePickerPanelAllTypes",
    sourceFile: "src/components/element-plus/examples/date-picker-panel/index.tsx",
  },
};

export default manifest;
