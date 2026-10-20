import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "config-provider/usage": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderLocale",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/button": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderButton",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/link": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderLink",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/card": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderCard",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/dialog": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderDialog",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/message": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderMessage",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/empty-values": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderEmptyValues",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
  "config-provider/table": {
    load: () => import("@/components/element-plus/examples/config-provider"),
    exportName: "ConfigProviderTable",
    sourceFile: "src/components/element-plus/examples/config-provider/index.tsx",
  },
};

export default manifest;
