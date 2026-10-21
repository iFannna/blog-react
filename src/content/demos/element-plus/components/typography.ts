import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "typography/font": {
    load: () => import("@/components/docs/examples/typography/font"),
    sourceFile: "src/components/docs/examples/typography/font.tsx",
  },
  "typography/convention": {
    load: () => import("@/components/docs/examples/typography/convention"),
    sourceFile: "src/components/docs/examples/typography/convention.tsx",
  },
  "typography/line-height": {
    load: () => import("@/components/docs/examples/typography/line-height"),
    sourceFile: "src/components/docs/examples/typography/line-height.tsx",
  },
};

export default manifest;
