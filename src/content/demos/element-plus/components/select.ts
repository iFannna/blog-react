import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "select/basic-usage": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectBasic",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/options": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectOptions",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/disabled-option": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectDisabledOption",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/disabled": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectDisabled",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/clearable": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectClearable",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/size": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectSize",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/multiple": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectMultiple",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/custom-template": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectCustomTemplate",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/custom-header": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectCustomHeader",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/custom-footer": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectCustomFooter",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/grouping": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectGrouping",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/filterable": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectFilterable",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/remote-search": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectRemoteSearch",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/allow-create": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectAllowCreate",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/value-key": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectValueKey",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/custom-tag": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectCustomTag",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/custom-loading": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectCustomLoading",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/empty-values": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectEmptyValues",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
  "select/custom-label": {
    load: () => import("@/components/docs/examples/select"),
    exportName: "SelectCustomLabel",
    sourceFile: "src/components/docs/examples/select/index.tsx",
  },
};

export default manifest;
