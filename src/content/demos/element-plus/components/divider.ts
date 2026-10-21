import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "divider/basic-usage": {
    load: () => import("@/components/docs/examples/divider"),
    exportName: "DividerBasic",
    sourceFile: "src/components/docs/examples/divider/index.tsx",
  },
  "divider/custom-content": {
    load: () => import("@/components/docs/examples/divider"),
    exportName: "DividerText",
    sourceFile: "src/components/docs/examples/divider/index.tsx",
  },
  "divider/vertical-divider": {
    load: () => import("@/components/docs/examples/divider"),
    exportName: "DividerVertical",
    sourceFile: "src/components/docs/examples/divider/index.tsx",
  },
  "divider/line-dashed": {
    load: () => import("@/components/docs/examples/divider"),
    exportName: "DividerBorderStyle",
    sourceFile: "src/components/docs/examples/divider/index.tsx",
  },
};

export default manifest;
