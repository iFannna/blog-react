import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "backtop/basic": {
    load: () => import("@/components/docs/examples/backtop"),
    exportName: "BacktopBasic",
    sourceFile: "src/components/docs/examples/backtop/index.tsx",
  },
  "backtop/custom": {
    load: () => import("@/components/docs/examples/backtop"),
    exportName: "BacktopCustom",
    sourceFile: "src/components/docs/examples/backtop/index.tsx",
  },
};

export default manifest;
