import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "link/basic": {
    load: () => import("@/components/docs/examples/link"),
    exportName: "LinkBasic",
    sourceFile: "src/components/docs/examples/link/index.tsx",
  },
  "link/disabled": {
    load: () => import("@/components/docs/examples/link"),
    exportName: "LinkDisabled",
    sourceFile: "src/components/docs/examples/link/index.tsx",
  },
  "link/underline": {
    load: () => import("@/components/docs/examples/link"),
    exportName: "LinkUnderline",
    sourceFile: "src/components/docs/examples/link/index.tsx",
  },
  "link/with-icon": {
    load: () => import("@/components/docs/examples/link"),
    exportName: "LinkIcon",
    sourceFile: "src/components/docs/examples/link/index.tsx",
  },
};

export default manifest;
