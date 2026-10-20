import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "tooltip/basic": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipBasic",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/theme": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipTheme",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/rich-content": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipRichContent",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/advanced-usage": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipAdvancedUsage",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/html-content": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipHtmlContent",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/virtual-trigger": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipVirtualTrigger",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/singleton": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipSingleton",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/controlled": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipControlled",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/animations": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipAnimations",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
  "tooltip/append-to": {
    load: () => import("@/components/element-plus/examples/overlay"),
    exportName: "TooltipAppendTo",
    sourceFile: "src/components/element-plus/examples/overlay/index.tsx",
  },
};

export default manifest;
