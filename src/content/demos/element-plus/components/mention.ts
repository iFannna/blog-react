import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "mention/basic": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionBasic",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/props": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionProps",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/textarea": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionTextarea",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/label": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionLabel",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/loading": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionLoading",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/prefix": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionPrefix",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/whole": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionWhole",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
  "mention/form": {
    load: () => import("@/components/docs/examples/mention"),
    exportName: "MentionForm",
    sourceFile: "src/components/docs/examples/mention/index.tsx",
  },
};

export default manifest;
