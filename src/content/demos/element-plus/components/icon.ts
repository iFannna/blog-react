import type { DemoManifest } from "@/lib/docs/types";

const dir = "src/components/element-plus/examples/icon";

const manifest: DemoManifest = {
  "icon/simple": {
    load: () => import("@/components/element-plus/examples/icon"),
    exportName: "IconSimple",
    sourceFile: `${dir}/index.tsx`,
  },
  "icon/combined": {
    load: () => import("@/components/element-plus/examples/icon"),
    exportName: "IconCombined",
    sourceFile: `${dir}/index.tsx`,
  },
  "icon/direct": {
    load: () => import("@/components/element-plus/examples/icon"),
    exportName: "IconDirect",
    sourceFile: `${dir}/index.tsx`,
  },
  "icon/collection": {
    load: () => import("@/components/element-plus/examples/icon"),
    exportName: "IconCollection",
    sourceFile: `${dir}/index.tsx`,
  },
};

export default manifest;
