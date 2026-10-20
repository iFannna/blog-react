import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const demosRoot = path.join(root, "src", "content", "demos");
const outputFile = path.join(demosRoot, "registry.generated.ts");
const checkOnly = process.argv.includes("--check");

function collectManifests(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name.endsWith(".generated.ts")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectManifests(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildRegistry() {
  const entries = collectManifests(demosRoot)
    .map((filePath) => {
      const relative = path.relative(demosRoot, filePath).replace(/\\/g, "/");
      return {
        key: relative.replace(/\.(ts|tsx)$/, ""),
        specifier: `./${relative.replace(/\.(ts|tsx)$/, "")}`,
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  const lines = [
    "// 由 scripts/gen-demo-registry.mjs 生成，请勿手动修改。",
    'import type { DemoManifest } from "@/lib/docs/types";',
    "",
    "export const demoManifestLoaders: Record<",
    "  string,",
    "  () => Promise<{ default: DemoManifest }>",
    "> = {",
    ...entries.map(
      (entry) => `  ${JSON.stringify(entry.key)}: () => import(${JSON.stringify(entry.specifier)}),`,
    ),
    "};",
    "",
  ];

  return lines.join("\n");
}

const content = buildRegistry();
const existing = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, "utf8") : "";

if (checkOnly) {
  if (existing !== content) {
    console.error("demo registry 与 manifest 不一致，请运行 npm run gen:demos");
    process.exit(1);
  }
  process.exit(0);
}

if (existing !== content) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, content);
}
