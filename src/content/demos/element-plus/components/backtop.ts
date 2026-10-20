import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "backtop/basic": {
    load: () => import("@/components/element-plus/examples/backtop"),
    exportName: "BacktopBasic",
    sourceFile: "src/components/element-plus/examples/backtop/index.tsx",
  },
  "backtop/custom": {
    load: () => import("@/components/element-plus/examples/backtop"),
    exportName: "BacktopCustom",
    sourceFile: "src/components/element-plus/examples/backtop/index.tsx",
  },
};

export default manifest;
