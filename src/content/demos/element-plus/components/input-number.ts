import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "input-number/basic": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberBasic",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/disabled": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberDisabled",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/steps": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberSteps",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/step-strictly": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberStepStrictly",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/precision": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberPrecision",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/size": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberSize",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/controlled": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberControlled",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/custom": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberCustom",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/with-prefix-suffix": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberWithPrefixSuffix",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
  "input-number/formatter": {
    load: () => import("@/components/docs/examples/input-number"),
    exportName: "InputNumberFormatter",
    sourceFile: "src/components/docs/examples/input-number/index.tsx",
  },
};

export default manifest;
