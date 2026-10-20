import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "autocomplete/autocomplete": {
    load: () => import("@/components/element-plus/examples/autocomplete"),
    exportName: "AutocompleteBasic",
    sourceFile: "src/components/element-plus/examples/autocomplete/index.tsx",
  },
  "autocomplete/autocomplete-template": {
    load: () => import("@/components/element-plus/examples/autocomplete"),
    exportName: "AutocompleteTemplate",
    sourceFile: "src/components/element-plus/examples/autocomplete/index.tsx",
  },
  "autocomplete/remote-search": {
    load: () => import("@/components/element-plus/examples/autocomplete"),
    exportName: "AutocompleteRemoteSearch",
    sourceFile: "src/components/element-plus/examples/autocomplete/index.tsx",
  },
  "autocomplete/custom-loading": {
    load: () => import("@/components/element-plus/examples/autocomplete"),
    exportName: "AutocompleteCustomLoading",
    sourceFile: "src/components/element-plus/examples/autocomplete/index.tsx",
  },
  "autocomplete/custom-header-footer": {
    load: () => import("@/components/element-plus/examples/autocomplete"),
    exportName: "AutocompleteCustomHeaderFooter",
    sourceFile: "src/components/element-plus/examples/autocomplete/index.tsx",
  },
};

export default manifest;
