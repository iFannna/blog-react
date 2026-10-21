import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "steps/basic": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsBasic",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
  "steps/centered": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsCentered",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
  "steps/simple": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsSimple",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
  "steps/vertical": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsVertical",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
  "steps/with-description": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsWithDescription",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
  "steps/with-icon": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsWithIcon",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
  "steps/with-status": {
    load: () => import("@/components/docs/examples/steps"),
    exportName: "StepsWithStatus",
    sourceFile: "src/components/docs/examples/steps/index.tsx",
  },
};

export default manifest;
