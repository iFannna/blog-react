import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "progress/linear-progress-bar": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressBasic",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/internal-percentage": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressTextInside",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/custom-color": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressColor",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/circular-progress-bar": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressCircle",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/dashboard-progress-bar": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressDashboard",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/customized-content": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressCustomText",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/indeterminate-progress": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressIndeterminate",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
  "progress/striped-progress": {
    load: () => import("@/components/docs/examples/progress"),
    exportName: "ProgressStriped",
    sourceFile: "src/components/docs/examples/progress/index.tsx",
  },
};

export default manifest;
