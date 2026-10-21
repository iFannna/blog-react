import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "form/basic-form": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormBasic",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/inline-form": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormInline",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/alignment": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormAlignment",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/validation": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormValidation",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/custom-validation": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormCustomValidation",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/form-items": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormFormItems",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/number-validate": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormNumberValidate",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/size-control": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormSizeControl",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
  "form/accessibility": {
    load: () => import("@/components/docs/examples/form"),
    exportName: "FormAccessibility",
    sourceFile: "src/components/docs/examples/form/index.tsx",
  },
};

export default manifest;
