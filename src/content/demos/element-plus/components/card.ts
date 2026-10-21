import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "card/basic": {
    load: () => import("@/components/docs/examples/card"),
    exportName: "CardBasic",
    sourceFile: "src/components/docs/examples/card/index.tsx",
  },
  "card/simple": {
    load: () => import("@/components/docs/examples/card"),
    exportName: "CardSimple",
    sourceFile: "src/components/docs/examples/card/index.tsx",
  },
  "card/with-images": {
    load: () => import("@/components/docs/examples/card"),
    exportName: "CardWithImages",
    sourceFile: "src/components/docs/examples/card/index.tsx",
  },
  "card/shadow": {
    load: () => import("@/components/docs/examples/card"),
    exportName: "CardShadow",
    sourceFile: "src/components/docs/examples/card/index.tsx",
  },
};

export default manifest;
