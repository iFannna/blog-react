import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "dropdown/basic-usage": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownBasicUsage",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/placements": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownPlacements",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/triggering-element": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownTriggeringElement",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/how-to-trigger": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownHowToTrigger",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/menu-hiding-behavior": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownMenuHidingBehavior",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/command-event": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownCommandEvent",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/dropdown-methods": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownMethods",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/sizes": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownSizes",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
  "dropdown/virtual-trigger": {
    load: () => import("@/components/docs/examples/dropdown"),
    exportName: "DropdownVirtualTrigger",
    sourceFile: "src/components/docs/examples/dropdown/index.tsx",
  },
};

export default manifest;
