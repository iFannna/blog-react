import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "border/border": {
    load: () => import("@/components/docs/examples/border"),
    exportName: "BorderBasic",
    sourceFile: "src/components/docs/examples/border/index.tsx",
  },
  "border/radius": {
    load: () => import("@/components/docs/examples/border"),
    exportName: "BorderRadius",
    sourceFile: "src/components/docs/examples/border/index.tsx",
  },
  "border/shadow": {
    load: () => import("@/components/docs/examples/border"),
    exportName: "BorderShadow",
    sourceFile: "src/components/docs/examples/border/index.tsx",
  },
};

export default manifest;
