import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "select/basic-usage": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectBasic",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/options": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectOptions",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/disabled-option": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectDisabledOption",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/disabled": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectDisabled",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/clearable": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectClearable",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/size": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectSize",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/multiple": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectMultiple",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/custom-template": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectCustomTemplate",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/custom-header": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectCustomHeader",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/custom-footer": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectCustomFooter",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/grouping": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectGrouping",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/filterable": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectFilterable",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/remote-search": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectRemoteSearch",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/allow-create": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectAllowCreate",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/value-key": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectValueKey",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/custom-tag": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectCustomTag",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/custom-loading": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectCustomLoading",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/empty-values": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectEmptyValues",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
  "select/custom-label": {
    load: () => import("@/components/element-plus/examples/select"),
    exportName: "SelectCustomLabel",
    sourceFile: "src/components/element-plus/examples/select/index.tsx",
  },
};

export default manifest;
