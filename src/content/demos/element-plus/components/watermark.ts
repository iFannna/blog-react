import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "watermark/basic": {
    load: () => import("@/components/element-plus/examples/watermark"),
    exportName: "WatermarkBasic",
    sourceFile: "src/components/element-plus/examples/watermark/index.tsx",
  },
  "watermark/multi-line": {
    load: () => import("@/components/element-plus/examples/watermark"),
    exportName: "WatermarkMultiLine",
    sourceFile: "src/components/element-plus/examples/watermark/index.tsx",
  },
  "watermark/image": {
    load: () => import("@/components/element-plus/examples/watermark"),
    exportName: "WatermarkImage",
    sourceFile: "src/components/element-plus/examples/watermark/index.tsx",
  },
  "watermark/custom": {
    load: () => import("@/components/element-plus/examples/watermark"),
    exportName: "WatermarkCustom",
    sourceFile: "src/components/element-plus/examples/watermark/index.tsx",
  },
};

export default manifest;
