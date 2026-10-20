import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "typography/font": {
    load: () => import("@/components/element-plus/examples/typography/font"),
    sourceFile: "src/components/element-plus/examples/typography/font.tsx",
  },
  "typography/convention": {
    load: () => import("@/components/element-plus/examples/typography/convention"),
    sourceFile: "src/components/element-plus/examples/typography/convention.tsx",
  },
  "typography/line-height": {
    load: () => import("@/components/element-plus/examples/typography/line-height"),
    sourceFile: "src/components/element-plus/examples/typography/line-height.tsx",
  },
};

export default manifest;
