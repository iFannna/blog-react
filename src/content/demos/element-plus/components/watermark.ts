import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "watermark/basic": {
    load: () => import("@/components/docs/examples/watermark"),
    exportName: "WatermarkBasic",
    sourceFile: "src/components/docs/examples/watermark/index.tsx",
  },
  "watermark/multi-line": {
    load: () => import("@/components/docs/examples/watermark"),
    exportName: "WatermarkMultiLine",
    sourceFile: "src/components/docs/examples/watermark/index.tsx",
  },
  "watermark/image": {
    load: () => import("@/components/docs/examples/watermark"),
    exportName: "WatermarkImage",
    sourceFile: "src/components/docs/examples/watermark/index.tsx",
  },
  "watermark/custom": {
    load: () => import("@/components/docs/examples/watermark"),
    exportName: "WatermarkCustom",
    sourceFile: "src/components/docs/examples/watermark/index.tsx",
  },
};

export default manifest;
