import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "time-picker/basic": {
    load: () => import("@/components/element-plus/examples/time-picker"),
    exportName: "TimePickerBasic",
    sourceFile: "src/components/element-plus/examples/time-picker/index.tsx",
  },
  "time-picker/basic-range": {
    load: () => import("@/components/element-plus/examples/time-picker"),
    exportName: "TimePickerBasicRange",
    sourceFile: "src/components/element-plus/examples/time-picker/index.tsx",
  },
  "time-picker/range": {
    load: () => import("@/components/element-plus/examples/time-picker"),
    exportName: "TimePickerRange",
    sourceFile: "src/components/element-plus/examples/time-picker/index.tsx",
  },
};

export default manifest;
