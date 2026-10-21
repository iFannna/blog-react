import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "result/basic-usage": {
    load: () => import("@/components/docs/examples/empty-result"),
    exportName: "ResultBasic",
    sourceFile: "src/components/docs/examples/empty-result/index.tsx",
  },
  "result/customized-content": {
    load: () => import("@/components/docs/examples/empty-result"),
    exportName: "ResultCustomIcon",
    sourceFile: "src/components/docs/examples/empty-result/index.tsx",
  },
};

export default manifest;
