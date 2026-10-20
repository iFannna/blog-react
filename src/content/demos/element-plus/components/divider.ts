import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "divider/basic-usage": {
    load: () => import("@/components/element-plus/examples/divider"),
    exportName: "DividerBasic",
    sourceFile: "src/components/element-plus/examples/divider/index.tsx",
  },
  "divider/custom-content": {
    load: () => import("@/components/element-plus/examples/divider"),
    exportName: "DividerText",
    sourceFile: "src/components/element-plus/examples/divider/index.tsx",
  },
  "divider/vertical-divider": {
    load: () => import("@/components/element-plus/examples/divider"),
    exportName: "DividerVertical",
    sourceFile: "src/components/element-plus/examples/divider/index.tsx",
  },
  "divider/line-dashed": {
    load: () => import("@/components/element-plus/examples/divider"),
    exportName: "DividerBorderStyle",
    sourceFile: "src/components/element-plus/examples/divider/index.tsx",
  },
};

export default manifest;
