import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "menu/basic": {
    load: () => import("@/components/docs/examples/menu"),
    exportName: "MenuBasic",
    sourceFile: "src/components/docs/examples/menu/index.tsx",
  },
  "menu/collapse": {
    load: () => import("@/components/docs/examples/menu"),
    exportName: "MenuCollapse",
    sourceFile: "src/components/docs/examples/menu/index.tsx",
  },
  "menu/left-and-right": {
    load: () => import("@/components/docs/examples/menu"),
    exportName: "MenuLeftAndRight",
    sourceFile: "src/components/docs/examples/menu/index.tsx",
  },
  "menu/popper-offset": {
    load: () => import("@/components/docs/examples/menu"),
    exportName: "MenuPopperOffset",
    sourceFile: "src/components/docs/examples/menu/index.tsx",
  },
  "menu/vertical": {
    load: () => import("@/components/docs/examples/menu"),
    exportName: "MenuVertical",
    sourceFile: "src/components/docs/examples/menu/index.tsx",
  },
};

export default manifest;
