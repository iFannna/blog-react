import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "calendar/basic": {
    load: () => import("@/components/element-plus/examples/calendar"),
    exportName: "CalendarBasic",
    sourceFile: "src/components/element-plus/examples/calendar/index.tsx",
  },
  "calendar/controller-type": {
    load: () => import("@/components/element-plus/examples/calendar"),
    exportName: "CalendarController",
    sourceFile: "src/components/element-plus/examples/calendar/index.tsx",
  },
  "calendar/customize": {
    load: () => import("@/components/element-plus/examples/calendar"),
    exportName: "CalendarCustomize",
    sourceFile: "src/components/element-plus/examples/calendar/index.tsx",
  },
  "calendar/range": {
    load: () => import("@/components/element-plus/examples/calendar"),
    exportName: "CalendarRange",
    sourceFile: "src/components/element-plus/examples/calendar/index.tsx",
  },
  "calendar/header": {
    load: () => import("@/components/element-plus/examples/calendar"),
    exportName: "CalendarHeader",
    sourceFile: "src/components/element-plus/examples/calendar/index.tsx",
  },
};

export default manifest;
