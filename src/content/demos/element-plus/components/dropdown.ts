import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "dropdown/basic-usage": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownBasicUsage",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/placements": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownPlacements",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/triggering-element": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownTriggeringElement",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/how-to-trigger": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownHowToTrigger",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/menu-hiding-behavior": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownMenuHidingBehavior",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/command-event": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownCommandEvent",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/dropdown-methods": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownMethods",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/sizes": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownSizes",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
  "dropdown/virtual-trigger": {
    load: () => import("@/components/element-plus/examples/dropdown"),
    exportName: "DropdownVirtualTrigger",
    sourceFile: "src/components/element-plus/examples/dropdown/index.tsx",
  },
};

export default manifest;
