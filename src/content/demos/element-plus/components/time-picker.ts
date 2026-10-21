import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "time-picker/basic": {
    load: () => import("@/components/docs/examples/time-picker"),
    exportName: "TimePickerBasic",
    sourceFile: "src/components/docs/examples/time-picker/index.tsx",
  },
  "time-picker/basic-range": {
    load: () => import("@/components/docs/examples/time-picker"),
    exportName: "TimePickerBasicRange",
    sourceFile: "src/components/docs/examples/time-picker/index.tsx",
  },
  "time-picker/range": {
    load: () => import("@/components/docs/examples/time-picker"),
    exportName: "TimePickerRange",
    sourceFile: "src/components/docs/examples/time-picker/index.tsx",
  },
};

export default manifest;
