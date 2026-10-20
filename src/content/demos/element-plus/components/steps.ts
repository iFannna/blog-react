import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "steps/basic": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsBasic",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
  "steps/centered": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsCentered",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
  "steps/simple": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsSimple",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
  "steps/vertical": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsVertical",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
  "steps/with-description": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsWithDescription",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
  "steps/with-icon": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsWithIcon",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
  "steps/with-status": {
    load: () => import("@/components/element-plus/examples/steps"),
    exportName: "StepsWithStatus",
    sourceFile: "src/components/element-plus/examples/steps/index.tsx",
  },
};

export default manifest;
