import type { DemoManifest } from "@/lib/docs/types";

const dir = "src/components/element-plus/examples/color";

const manifest: DemoManifest = {
  "color/main": {
    load: () => import("@/components/element-plus/examples/color"),
    exportName: "ColorMain",
    sourceFile: `${dir}/index.tsx`,
  },
  "color/secondary": {
    load: () => import("@/components/element-plus/examples/color"),
    exportName: "ColorSecondary",
    sourceFile: `${dir}/index.tsx`,
  },
  "color/neutral": {
    load: () => import("@/components/element-plus/examples/color"),
    exportName: "ColorNeutral",
    sourceFile: `${dir}/index.tsx`,
  },
};

export default manifest;
