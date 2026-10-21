import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "radio/basic-usage": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioBasic",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
  "radio/disabled": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioDisabled",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
  "radio/options": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioOptions",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
  "radio/radio-button": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioButton",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
  "radio/with-borders": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioBorder",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
  "radio/sizes": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioSizes",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
  "radio/radio-group": {
    load: () => import("@/components/docs/examples/radio"),
    exportName: "RadioBasic",
    sourceFile: "src/components/docs/examples/radio/index.tsx",
  },
};

export default manifest;
