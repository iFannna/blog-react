import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "input-tag/basic": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagBasic",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/trigger": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagTrigger",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/max": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagMax",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/collapse": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagCollapse",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/disabled": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagDisabled",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/clearable": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagClearable",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/clear-icon": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagClearIcon",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/draggable": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagDraggable",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/delimiter": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagDelimiter",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/size": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagSize",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/tag": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagCustomTag",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
  "input-tag/prefix-suffix": {
    load: () => import("@/components/element-plus/examples/input-tag"),
    exportName: "InputTagPrefixSuffix",
    sourceFile: "src/components/element-plus/examples/input-tag/index.tsx",
  },
};

export default manifest;
