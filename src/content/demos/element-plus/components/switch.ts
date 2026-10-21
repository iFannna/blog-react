import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "switch/basic": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchBasic",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/custom-action-icon": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchCustomActionIcon",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/custom-action-slot": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchCustomActionSlot",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/custom-icons": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchIcons",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/disabled": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchDisabled",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/extended-value-types": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchCustomValue",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/loading": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchLoading",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/prevent-switching": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchBeforeChange",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/sizes": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchSizes",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
  "switch/text-description": {
    load: () => import("@/components/docs/examples/switch"),
    exportName: "SwitchText",
    sourceFile: "src/components/docs/examples/switch/index.tsx",
  },
};

export default manifest;
