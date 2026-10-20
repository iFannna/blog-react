import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "switch/basic": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchBasic",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/custom-action-icon": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchCustomActionIcon",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/custom-action-slot": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchCustomActionSlot",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/custom-icons": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchIcons",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/disabled": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchDisabled",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/extended-value-types": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchCustomValue",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/loading": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchLoading",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/prevent-switching": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchBeforeChange",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/sizes": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchSizes",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
  "switch/text-description": {
    load: () => import("@/components/element-plus/examples/switch"),
    exportName: "SwitchText",
    sourceFile: "src/components/element-plus/examples/switch/index.tsx",
  },
};

export default manifest;
