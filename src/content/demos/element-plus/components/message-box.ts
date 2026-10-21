import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "message-box/alert": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxAlert",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/confirm": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxConfirm",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/prompt": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxPrompt",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/use-vnode": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxUseVnode",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/use-vnode-with-action-handlers": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxUseVnodeWithActionHandlers",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/customization": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxCustomization",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/use-html": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxUseHtml",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/distinguishable-close-cancel": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxDistinguishableCloseCancel",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/centered-content": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxCenteredContent",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/customized-icon": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxCustomizedIcon",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
  "message-box/draggable": {
    load: () => import("@/components/docs/examples/feedback"),
    exportName: "MessageBoxDraggable",
    sourceFile: "src/components/docs/examples/feedback/index.tsx",
  },
};

export default manifest;
