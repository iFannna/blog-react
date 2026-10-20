import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "date-picker/enter-date": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerEnterDate",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/other-measurements": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerOtherMeasurements",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/date-range": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerDateRange",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/month-range": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerMonthRange",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/year-range": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerYearRange",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/quarter-range": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerQuarterRange",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/single-panel": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerSinglePanel",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/default-value": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerDefaultValue",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/date-formats": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerFormats",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/default-time": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerDefaultTime",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/custom-prefix-icon": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerCustomPrefix",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/custom-content": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerCustomContent",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
  "date-picker/custom-icon": {
    load: () => import("@/components/element-plus/examples/date-picker"),
    exportName: "DatePickerCustomIcon",
    sourceFile: "src/components/element-plus/examples/date-picker/index.tsx",
  },
};

export default manifest;
