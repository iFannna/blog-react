import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "card/basic": {
    load: () => import("@/components/element-plus/examples/card"),
    exportName: "CardBasic",
    sourceFile: "src/components/element-plus/examples/card/index.tsx",
  },
  "card/simple": {
    load: () => import("@/components/element-plus/examples/card"),
    exportName: "CardSimple",
    sourceFile: "src/components/element-plus/examples/card/index.tsx",
  },
  "card/with-images": {
    load: () => import("@/components/element-plus/examples/card"),
    exportName: "CardWithImages",
    sourceFile: "src/components/element-plus/examples/card/index.tsx",
  },
  "card/shadow": {
    load: () => import("@/components/element-plus/examples/card"),
    exportName: "CardShadow",
    sourceFile: "src/components/element-plus/examples/card/index.tsx",
  },
};

export default manifest;
