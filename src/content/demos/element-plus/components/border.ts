import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "border/border": {
    load: () => import("@/components/element-plus/examples/border"),
    exportName: "BorderBasic",
    sourceFile: "src/components/element-plus/examples/border/index.tsx",
  },
  "border/radius": {
    load: () => import("@/components/element-plus/examples/border"),
    exportName: "BorderRadius",
    sourceFile: "src/components/element-plus/examples/border/index.tsx",
  },
  "border/shadow": {
    load: () => import("@/components/element-plus/examples/border"),
    exportName: "BorderShadow",
    sourceFile: "src/components/element-plus/examples/border/index.tsx",
  },
};

export default manifest;
