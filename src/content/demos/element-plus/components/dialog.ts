import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "dialog/basic-usage": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogBasicUsage",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/customization-content": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogCustomizationContent",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/customization-header": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogCustomizationHeader",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/nested-dialog": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogNestedDialog",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/centered-content": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogCenteredContent",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/align-center": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogAlignCenter",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/destroy-on-close": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogDestroyOnClose",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/draggable-dialog": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogDraggableDialog",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/fullscreen": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogFullscreen",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/modal": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogModal",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/custom-animation": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogCustomAnimation",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
  "dialog/events": {
    load: () => import("@/components/element-plus/examples/dialog"),
    exportName: "DialogEvents",
    sourceFile: "src/components/element-plus/examples/dialog/index.tsx",
  },
};

export default manifest;
