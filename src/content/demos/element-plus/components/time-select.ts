import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "time-select/basic": {
    load: () => import("@/components/element-plus/examples/time-select"),
    exportName: "TimeSelectBasic",
    sourceFile: "src/components/element-plus/examples/time-select/index.tsx",
  },
  "time-select/time-formats": {
    load: () => import("@/components/element-plus/examples/time-select"),
    exportName: "TimeSelectFormats",
    sourceFile: "src/components/element-plus/examples/time-select/index.tsx",
  },
  "time-select/time-range": {
    load: () => import("@/components/element-plus/examples/time-select"),
    exportName: "TimeSelectRange",
    sourceFile: "src/components/element-plus/examples/time-select/index.tsx",
  },
};

export default manifest;
