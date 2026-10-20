import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "datetime-picker/date-and-time": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerBasic",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
  "datetime-picker/date-and-time-formats": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerFormats",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
  "datetime-picker/date-and-time-formats-panel": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerPanelFormats",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
  "datetime-picker/date-and-time-range": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerRange",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
  "datetime-picker/single-panel": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerSinglePanel",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
  "datetime-picker/default-time": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerDefaultTime",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
  "datetime-picker/custom-icon": {
    load: () => import("@/components/element-plus/examples/datetime-picker"),
    exportName: "DateTimePickerCustomIcon",
    sourceFile: "src/components/element-plus/examples/datetime-picker/index.tsx",
  },
};

export default manifest;
