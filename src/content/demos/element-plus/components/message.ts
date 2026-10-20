import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "message/basic": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessageBasic",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
  "message/different-types": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessageDifferentTypes",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
  "message/plain": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessagePlain",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
  "message/closable": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessageClosable",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
  "message/raw-html": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessageRawHtml",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
  "message/grouping": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessageGrouping",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
  "message/placement": {
    load: () => import("@/components/element-plus/examples/message"),
    exportName: "MessagePlacement",
    sourceFile: "src/components/element-plus/examples/message/index.tsx",
  },
};

export default manifest;
