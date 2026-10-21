import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
  "input-otp/basic": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpBasic",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/custom-length": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpCustomLength",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/types": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpTypes",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/sizes": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpSizes",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/disabled": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpDisabled",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/mask": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpMask",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/separator": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpSeparator",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
  "input-otp/validator": {
    load: () => import("@/components/docs/examples/input-otp"),
    exportName: "InputOtpValidator",
    sourceFile: "src/components/docs/examples/input-otp/index.tsx",
  },
};

export default manifest;
