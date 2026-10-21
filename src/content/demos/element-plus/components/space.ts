import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "space/basic": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceBasic",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/vertical-layout": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceVertical",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/control-size": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceControlSize",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/customized-size": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceCustomizedSize",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/alignment": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceAlignment",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/auto-wrapping": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceWrap",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/fill": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceFill",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/fill-ratio": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceFillRatio",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/literal-type-spacer": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceLiteralSpacer",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
  "space/vnode-type-spacer": {
    load: () => import("@/components/docs/examples/space"),
    exportName: "SpaceVnodeSpacer",
    sourceFile: "src/components/docs/examples/space/index.tsx",
  },
};

export default manifest;
