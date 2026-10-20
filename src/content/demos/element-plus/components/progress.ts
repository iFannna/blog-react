import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "progress/linear-progress-bar": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressBasic",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/internal-percentage": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressTextInside",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/custom-color": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressColor",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/circular-progress-bar": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressCircle",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/dashboard-progress-bar": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressDashboard",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/customized-content": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressCustomText",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/indeterminate-progress": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressIndeterminate",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
  "progress/striped-progress": {
    load: () => import("@/components/element-plus/examples/progress"),
    exportName: "ProgressStriped",
    sourceFile: "src/components/element-plus/examples/progress/index.tsx",
  },
};

export default manifest;
