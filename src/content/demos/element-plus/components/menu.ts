import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "menu/basic": {
    load: () => import("@/components/element-plus/examples/menu"),
    exportName: "MenuBasic",
    sourceFile: "src/components/element-plus/examples/menu/index.tsx",
  },
  "menu/collapse": {
    load: () => import("@/components/element-plus/examples/menu"),
    exportName: "MenuCollapse",
    sourceFile: "src/components/element-plus/examples/menu/index.tsx",
  },
  "menu/left-and-right": {
    load: () => import("@/components/element-plus/examples/menu"),
    exportName: "MenuLeftAndRight",
    sourceFile: "src/components/element-plus/examples/menu/index.tsx",
  },
  "menu/popper-offset": {
    load: () => import("@/components/element-plus/examples/menu"),
    exportName: "MenuPopperOffset",
    sourceFile: "src/components/element-plus/examples/menu/index.tsx",
  },
  "menu/vertical": {
    load: () => import("@/components/element-plus/examples/menu"),
    exportName: "MenuVertical",
    sourceFile: "src/components/element-plus/examples/menu/index.tsx",
  },
};

export default manifest;
