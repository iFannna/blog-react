import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tooltip/basic": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipBasic",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/theme": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipTheme",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/rich-content": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipRichContent",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/advanced-usage": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipAdvancedUsage",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/html-content": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipHtmlContent",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/virtual-trigger": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipVirtualTrigger",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/singleton": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipSingleton",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/controlled": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipControlled",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/animations": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipAnimations",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
  "tooltip/append-to": {
    load: () => import("@/components/docs/examples/overlay"),
    exportName: "TooltipAppendTo",
    sourceFile: "src/components/docs/examples/overlay/index.tsx",
  },
};

export default manifest;
