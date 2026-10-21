import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "statistic/basic": {
    load: () => import("@/components/docs/examples/statistic"),
    exportName: "StatisticBasic",
    sourceFile: "src/components/docs/examples/statistic/index.tsx",
  },
  "statistic/countdown": {
    load: () => import("@/components/docs/examples/statistic"),
    exportName: "StatisticCountdown",
    sourceFile: "src/components/docs/examples/statistic/index.tsx",
  },
  "statistic/card": {
    load: () => import("@/components/docs/examples/statistic"),
    exportName: "StatisticCard",
    sourceFile: "src/components/docs/examples/statistic/index.tsx",
  },
};

export default manifest;
