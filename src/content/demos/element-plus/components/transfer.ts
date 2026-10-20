import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "transfer/basic": {
    load: () => import("@/components/element-plus/examples/transfer"),
    exportName: "TransferBasic",
    sourceFile: "src/components/element-plus/examples/transfer/index.tsx",
  },
  "transfer/filterable": {
    load: () => import("@/components/element-plus/examples/transfer"),
    exportName: "TransferFilterable",
    sourceFile: "src/components/element-plus/examples/transfer/index.tsx",
  },
  "transfer/customizable": {
    load: () => import("@/components/element-plus/examples/transfer"),
    exportName: "TransferCustomizable",
    sourceFile: "src/components/element-plus/examples/transfer/index.tsx",
  },
  "transfer/empty-content": {
    load: () => import("@/components/element-plus/examples/transfer"),
    exportName: "TransferEmptyContent",
    sourceFile: "src/components/element-plus/examples/transfer/index.tsx",
  },
  "transfer/prop-alias": {
    load: () => import("@/components/element-plus/examples/transfer"),
    exportName: "TransferPropAlias",
    sourceFile: "src/components/element-plus/examples/transfer/index.tsx",
  },
  "transfer/virtual-scroll": {
    load: () => import("@/components/element-plus/examples/transfer"),
    exportName: "TransferVirtualScroll",
    sourceFile: "src/components/element-plus/examples/transfer/index.tsx",
  },
};

export default manifest;
