import type { DemoManifest } from "@/lib/docs/types";

const dir = "src/components/docs/examples/color";

const manifest: DemoManifest = {
  "color/main": {
    load: () => import("@/components/docs/examples/color"),
    exportName: "ColorMain",
    sourceFile: `${dir}/index.tsx`,
    plain: true,
  },
  "color/secondary": {
    load: () => import("@/components/docs/examples/color"),
    exportName: "ColorSecondary",
    sourceFile: `${dir}/index.tsx`,
    plain: true,
  },
  "color/neutral": {
    load: () => import("@/components/docs/examples/color"),
    exportName: "ColorNeutral",
    sourceFile: `${dir}/index.tsx`,
    plain: true,
  },
};

export default manifest;
