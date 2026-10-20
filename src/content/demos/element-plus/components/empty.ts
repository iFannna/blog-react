import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "empty/basic-usage": {
    load: () => import("@/components/element-plus/examples/empty-result"),
    exportName: "EmptyBasic",
    sourceFile: "src/components/element-plus/examples/empty-result/index.tsx",
  },
  "empty/image-size": {
    load: () => import("@/components/element-plus/examples/empty-result"),
    exportName: "EmptySize",
    sourceFile: "src/components/element-plus/examples/empty-result/index.tsx",
  },
  "empty/bottom-content": {
    load: () => import("@/components/element-plus/examples/empty-result"),
    exportName: "EmptyBottom",
    sourceFile: "src/components/element-plus/examples/empty-result/index.tsx",
  },
  "empty/custom-image": {
    load: () => import("@/components/element-plus/examples/empty-result"),
    exportName: "EmptyCustomImage",
    sourceFile: "src/components/element-plus/examples/empty-result/index.tsx",
  },
};

export default manifest;
