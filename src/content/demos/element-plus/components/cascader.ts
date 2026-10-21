import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "cascader/basic": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderBasic",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/option-disabling": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderOptionDisabling",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/clearable": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderClearable",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/clear-icon": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderClearIcon",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/last-level": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderLastLevel",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/multiple-selection": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderMultipleSelection",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/any-level": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderAnyLevel",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/dynamic-loading": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderDynamicLoading",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/filterable": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderFilterable",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/custom-content": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderCustomContent",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/custom-suggestion-item": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderCustomSuggestionItem",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/panel": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderPanelDemo",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/custom-tag": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderCustomTag",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/show-checked-strategy": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderShowCheckedStrategy",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/check-on-click-node": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderCheckOnClickNode",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/custom-header-footer": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderCustomHeaderFooter",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/virtual-scroll": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderVirtualScroll",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
  "cascader/fit-input-width": {
    load: () => import("@/components/docs/examples/cascader"),
    exportName: "CascaderFitInputWidth",
    sourceFile: "src/components/docs/examples/cascader/index.tsx",
  },
};

export default manifest;
