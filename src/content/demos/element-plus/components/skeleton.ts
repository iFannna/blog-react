import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "skeleton/basic-usage": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonBasic",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/configurable-rows": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonRows",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/animation": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonAnimation",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/customized-template": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonTemplate",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/loading-state": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonLoading",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/rendering-with-data": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonData",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/avoiding-rendering-bouncing": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonAvoidBouncing",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/initial-rendering-loading": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonInitialLoading",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
  "skeleton/leading-trailing-without-bouncing": {
    load: () => import("@/components/element-plus/examples/skeleton"),
    exportName: "SkeletonLeadingTrailing",
    sourceFile: "src/components/element-plus/examples/skeleton/index.tsx",
  },
};

export default manifest;
