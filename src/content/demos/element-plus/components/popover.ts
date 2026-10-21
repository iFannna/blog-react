import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "popover/placement": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopoverPlacement",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popover/basic-usage": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopoverBasicUsage",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popover/virtual-triggering": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopoverVirtualTriggering",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popover/nested-information": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopoverNestedInformation",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popover/nested-operation": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopoverNestedOperation",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "popover/directive-usage": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "PopoverDirectiveUsage",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
};

export default manifest;
