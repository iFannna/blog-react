import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "pagination/basic-usage": {
    load: () => import("@/components/docs/examples/pagination"),
    exportName: "PaginationBasic",
    sourceFile: "src/components/docs/examples/pagination/index.tsx",
  },
  "pagination/number-of-pagers": {
    load: () => import("@/components/docs/examples/pagination"),
    exportName: "PaginationPagerCount",
    sourceFile: "src/components/docs/examples/pagination/index.tsx",
  },
  "pagination/background-color": {
    load: () => import("@/components/docs/examples/pagination"),
    exportName: "PaginationBackground",
    sourceFile: "src/components/docs/examples/pagination/index.tsx",
  },
  "pagination/small-pagination": {
    load: () => import("@/components/docs/examples/pagination"),
    exportName: "PaginationSmall",
    sourceFile: "src/components/docs/examples/pagination/index.tsx",
  },
  "pagination/auto-hide-pagination": {
    load: () => import("@/components/docs/examples/pagination"),
    exportName: "PaginationHideOnSinglePage",
    sourceFile: "src/components/docs/examples/pagination/index.tsx",
  },
  "pagination/more-elements": {
    load: () => import("@/components/docs/examples/pagination"),
    exportName: "PaginationMore",
    sourceFile: "src/components/docs/examples/pagination/index.tsx",
  },
};

export default manifest;
