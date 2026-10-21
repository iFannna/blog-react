import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "transfer/basic": {
    load: () => import("@/components/docs/examples/transfer"),
    exportName: "TransferBasic",
    sourceFile: "src/components/docs/examples/transfer/index.tsx",
  },
  "transfer/filterable": {
    load: () => import("@/components/docs/examples/transfer"),
    exportName: "TransferFilterable",
    sourceFile: "src/components/docs/examples/transfer/index.tsx",
  },
  "transfer/customizable": {
    load: () => import("@/components/docs/examples/transfer"),
    exportName: "TransferCustomizable",
    sourceFile: "src/components/docs/examples/transfer/index.tsx",
  },
  "transfer/empty-content": {
    load: () => import("@/components/docs/examples/transfer"),
    exportName: "TransferEmptyContent",
    sourceFile: "src/components/docs/examples/transfer/index.tsx",
  },
  "transfer/prop-alias": {
    load: () => import("@/components/docs/examples/transfer"),
    exportName: "TransferPropAlias",
    sourceFile: "src/components/docs/examples/transfer/index.tsx",
  },
  "transfer/virtual-scroll": {
    load: () => import("@/components/docs/examples/transfer"),
    exportName: "TransferVirtualScroll",
    sourceFile: "src/components/docs/examples/transfer/index.tsx",
  },
};

export default manifest;
