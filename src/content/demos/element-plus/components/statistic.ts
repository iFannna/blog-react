import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "statistic/basic": {
    load: () => import("@/components/element-plus/examples/statistic"),
    exportName: "StatisticBasic",
    sourceFile: "src/components/element-plus/examples/statistic/index.tsx",
  },
  "statistic/countdown": {
    load: () => import("@/components/element-plus/examples/statistic"),
    exportName: "StatisticCountdown",
    sourceFile: "src/components/element-plus/examples/statistic/index.tsx",
  },
  "statistic/card": {
    load: () => import("@/components/element-plus/examples/statistic"),
    exportName: "StatisticFormatter",
    sourceFile: "src/components/element-plus/examples/statistic/index.tsx",
  },
};

export default manifest;
