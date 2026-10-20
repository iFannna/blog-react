import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "result/basic-usage": {
    load: () => import("@/components/element-plus/examples/empty-result"),
    exportName: "ResultBasic",
    sourceFile: "src/components/element-plus/examples/empty-result/index.tsx",
  },
  "result/customized-content": {
    load: () => import("@/components/element-plus/examples/empty-result"),
    exportName: "ResultCustomIcon",
    sourceFile: "src/components/element-plus/examples/empty-result/index.tsx",
  },
};

export default manifest;
