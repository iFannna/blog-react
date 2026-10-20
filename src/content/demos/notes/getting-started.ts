import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "hello/basic": {
    load: () => import("@/components/docs/notes/hello-demo"),
    sourceFile: "src/components/docs/notes/hello-demo.tsx",
  },
};

export default manifest;
