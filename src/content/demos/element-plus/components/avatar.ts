import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "avatar/basic": {
    load: () => import("@/components/docs/examples/avatar"),
    exportName: "AvatarBasic",
    sourceFile: "src/components/docs/examples/avatar/index.tsx",
  },
  "avatar/types": {
    load: () => import("@/components/docs/examples/avatar"),
    exportName: "AvatarTypes",
    sourceFile: "src/components/docs/examples/avatar/index.tsx",
  },
  "avatar/fallback": {
    load: () => import("@/components/docs/examples/avatar"),
    exportName: "AvatarFallback",
    sourceFile: "src/components/docs/examples/avatar/index.tsx",
  },
  "avatar/fit": {
    load: () => import("@/components/docs/examples/avatar"),
    exportName: "AvatarFit",
    sourceFile: "src/components/docs/examples/avatar/index.tsx",
  },
  "avatar/group": {
    load: () => import("@/components/docs/examples/avatar"),
    exportName: "AvatarGroupDemo",
    sourceFile: "src/components/docs/examples/avatar/index.tsx",
  },
};

export default manifest;
