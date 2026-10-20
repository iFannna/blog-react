import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "carousel/basic": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselBasic",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
  "carousel/motion-blur": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselMotionBlur",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
  "carousel/indicator": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselIndicator",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
  "carousel/arrows": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselArrows",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
  "carousel/auto-height": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselAutoHeight",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
  "carousel/card": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselCard",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
  "carousel/vertical": {
    load: () => import("@/components/element-plus/examples/carousel"),
    exportName: "CarouselVertical",
    sourceFile: "src/components/element-plus/examples/carousel/index.tsx",
  },
};

export default manifest;
