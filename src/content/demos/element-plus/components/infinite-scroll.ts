import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "infinite-scroll/basic": {
    load: () => import("@/components/element-plus/examples/infinite-scroll"),
    exportName: "InfiniteScrollBasic",
    sourceFile: "src/components/element-plus/examples/infinite-scroll/index.tsx",
  },
  "infinite-scroll/disable-loading": {
    load: () => import("@/components/element-plus/examples/infinite-scroll"),
    exportName: "InfiniteScrollDisableLoading",
    sourceFile: "src/components/element-plus/examples/infinite-scroll/index.tsx",
  },
};

export default manifest;
