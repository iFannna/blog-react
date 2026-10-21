import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "infinite-scroll/basic": {
    load: () => import("@/components/docs/examples/infinite-scroll"),
    exportName: "InfiniteScrollBasic",
    sourceFile: "src/components/docs/examples/infinite-scroll/index.tsx",
  },
  "infinite-scroll/disable-loading": {
    load: () => import("@/components/docs/examples/infinite-scroll"),
    exportName: "InfiniteScrollDisableLoading",
    sourceFile: "src/components/docs/examples/infinite-scroll/index.tsx",
  },
};

export default manifest;
