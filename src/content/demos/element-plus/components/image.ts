import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "image/basic-usage": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImageBasic",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/placeholder": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImagePlaceholder",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/load-failed": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImageLoadFailed",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/lazy-load": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImageLazyLoad",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/image-preview": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImagePreview",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/manually-preview": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImageManuallyPreview",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/custom-toolbar": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImageCustomToolbar",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
  "image/custom-progress": {
    load: () => import("@/components/element-plus/examples/image"),
    exportName: "ImageCustomProgress",
    sourceFile: "src/components/element-plus/examples/image/index.tsx",
  },
};

export default manifest;
