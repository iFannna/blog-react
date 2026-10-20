import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "space/basic": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceBasic",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/vertical-layout": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceVertical",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/control-size": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceControlSize",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/customized-size": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceCustomizedSize",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/alignment": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceAlignment",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/auto-wrapping": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceWrap",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/fill": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceFill",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/fill-ratio": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceFillRatio",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/literal-type-spacer": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceLiteralSpacer",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
  "space/vnode-type-spacer": {
    load: () => import("@/components/element-plus/examples/space"),
    exportName: "SpaceVnodeSpacer",
    sourceFile: "src/components/element-plus/examples/space/index.tsx",
  },
};

export default manifest;
