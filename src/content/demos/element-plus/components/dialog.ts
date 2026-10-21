import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "dialog/basic-usage": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogBasicUsage",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/customization-content": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogCustomizationContent",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/customization-header": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogCustomizationHeader",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/nested-dialog": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogNestedDialog",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/centered-content": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogCenteredContent",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/align-center": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogAlignCenter",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/destroy-on-close": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogDestroyOnClose",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/draggable-dialog": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogDraggableDialog",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/fullscreen": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogFullscreen",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/modal": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogModal",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/custom-animation": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogCustomAnimation",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
  "dialog/events": {
    load: () => import("@/components/docs/examples/dialog"),
    exportName: "DialogEvents",
    sourceFile: "src/components/docs/examples/dialog/index.tsx",
  },
};

export default manifest;
