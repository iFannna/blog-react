// 由 scripts/gen-demo-registry.mjs 生成，请勿手动修改。
import type { DemoManifest } from "@/lib/docs/types";

export const demoManifestLoaders: Record<
  string,
  () => Promise<{ default: DemoManifest }>
> = {
  "notes/getting-started": () => import("./notes/getting-started"),
};
