import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "carousel/basic": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselBasic",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
  "carousel/motion-blur": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselMotionBlur",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
  "carousel/indicator": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselIndicator",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
  "carousel/arrows": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselArrows",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
  "carousel/auto-height": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselAutoHeight",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
  "carousel/card": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselCard",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
  "carousel/vertical": {
    load: () => import("@/components/docs/examples/carousel"),
    exportName: "CarouselVertical",
    sourceFile: "src/components/docs/examples/carousel/index.tsx",
  },
};

export default manifest;
