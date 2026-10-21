import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "container/layout-hm": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerHeaderMain",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/layout-hmf": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerBasic",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/layout-am": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerAsideMain",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/layout-ham": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerAside",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/layout-hamf": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerAsideWithFooter",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/layout-ahm": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerHeaderAside",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/layout-ahmf": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerNested",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
  "container/example": {
    load: () => import("@/components/docs/examples/container"),
    exportName: "ContainerExample",
    sourceFile: "src/components/docs/examples/container/index.tsx",
  },
};

export default manifest;
