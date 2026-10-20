import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "mention/basic": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionBasic",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/props": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionProps",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/textarea": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionTextarea",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/label": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionLabel",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/loading": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionLoading",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/prefix": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionPrefix",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/whole": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionWhole",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
  "mention/form": {
    load: () => import("@/components/element-plus/examples/mention"),
    exportName: "MentionForm",
    sourceFile: "src/components/element-plus/examples/mention/index.tsx",
  },
};

export default manifest;
