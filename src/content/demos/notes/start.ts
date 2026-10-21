import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "hello/basic": {
    load: () => import("@/components/docs/demos/HelloDemo"),
    sourceFile: "src/components/docs/demos/HelloDemo.tsx",
  },
};

export default manifest;
