import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "message-box/alert": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxAlert",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/confirm": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxConfirm",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/prompt": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxPrompt",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/use-vnode": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxUseVnode",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/use-vnode-with-action-handlers": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxUseVnodeWithActionHandlers",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/customization": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxCustomization",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/use-html": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxUseHtml",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/distinguishable-close-cancel": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxDistinguishableCloseCancel",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/centered-content": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxCenteredContent",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/customized-icon": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxCustomizedIcon",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
  "message-box/draggable": {
    load: () => import("@/components/element-plus/examples/feedback"),
    exportName: "MessageBoxDraggable",
    sourceFile: "src/components/element-plus/examples/feedback/index.tsx",
  },
};

export default manifest;
