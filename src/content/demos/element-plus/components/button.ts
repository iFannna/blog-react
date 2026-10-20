import type { DemoManifest } from "@/lib/docs/types";

const dir = "src/components/element-plus/examples/button";

const manifest: DemoManifest = {
  "button/basic": {
    load: () => import("@/components/element-plus/examples/button/basic"),
    sourceFile: `${dir}/basic.tsx`,
  },
  "button/disabled": {
    load: () => import("@/components/element-plus/examples/button/disabled"),
    sourceFile: `${dir}/disabled.tsx`,
  },
  "button/link": {
    load: () => import("@/components/element-plus/examples/button/link"),
    sourceFile: `${dir}/link.tsx`,
  },
  "button/text": {
    load: () => import("@/components/element-plus/examples/button/text"),
    sourceFile: `${dir}/text.tsx`,
  },
  "button/icon": {
    load: () => import("@/components/element-plus/examples/button/icon"),
    sourceFile: `${dir}/icon.tsx`,
  },
  "button/group": {
    load: () => import("@/components/element-plus/examples/button/group"),
    sourceFile: `${dir}/group.tsx`,
  },
  "button/loading": {
    load: () => import("@/components/element-plus/examples/button/loading"),
    sourceFile: `${dir}/loading.tsx`,
  },
  "button/size": {
    load: () => import("@/components/element-plus/examples/button/size"),
    sourceFile: `${dir}/size.tsx`,
  },
  "button/tag": {
    load: () => import("@/components/element-plus/examples/button/tag"),
    sourceFile: `${dir}/tag.tsx`,
  },
  "button/custom": {
    load: () => import("@/components/element-plus/examples/button/custom"),
    sourceFile: `${dir}/custom.tsx`,
  },
};

export default manifest;
