import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "table/basic": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableBasic",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/striped": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableStriped",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/with-border": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableBorder",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/with-status": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableWithStatus",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/show-overflow-tooltip": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableOverflowTooltip",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/fixed-header": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableFixedHeader",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/fixed-column": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableFixedColumn",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/fixed-column-and-header": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableFixedColumnAndHeader",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/fixed-header-with-fluid-header": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableFixedHeaderFluid",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/grouping-header": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableGroupHeader",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/fixed-column-and-group-header": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableFixedGroupHeader",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/single-select": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableSingleSelect",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/multi-select": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableMultiSelect",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/sort": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableSort",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/filter": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableFilter",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/custom-column": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableCustomColumn",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/custom-header": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableCustomHeader",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/expandable-row": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableExpandable",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/tree-and-lazy": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableTreeAndLazy",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/check-strictly": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableCheckStrictly",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/summary": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableSummary",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/rowspan-and-colspan": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableSpan",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/custom-index": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableCustomIndex",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/table-layout": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableLayout",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
  "table/tooltip-formatter": {
    load: () => import("@/components/docs/examples/table"),
    exportName: "TableTooltipFormatter",
    sourceFile: "src/components/docs/examples/table/index.tsx",
  },
};

export default manifest;
