import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const docsRoot = path.join(root, "src", "content", "docs");
const demosRoot = path.join(root, "src", "content", "demos");

const errors = [];
const warnings = [];

function walk(dir, ext) {
  if (!fs.existsSync(dir)) return [];

  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name.endsWith(".generated.ts")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractDemoPaths(markdown) {
  const paths = [];
  let insideDemo = false;
  let buffer = [];

  for (const line of markdown.split("\n")) {
    if (!insideDemo) {
      if (/^:::demo\s*(.*)$/.test(line)) {
        insideDemo = true;
        buffer = [];
      }
      continue;
    }

    if (line.trim() === ":::") {
      const demoPath = buffer.find((item) => item.trim() !== "")?.trim();
      if (demoPath) paths.push(demoPath);
      insideDemo = false;
    } else {
      buffer.push(line);
    }
  }

  return paths;
}

async function loadManifest(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filePath,
  }).outputText;

  const encoded = Buffer.from(output).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}

try {
  execFileSync(process.execPath, ["scripts/gen-demo-registry.mjs", "--check"], {
    cwd: root,
    stdio: "inherit",
  });
} catch {
  errors.push("registry.generated.ts 已过期");
}

const docsByKey = new Map();

for (const filePath of walk(docsRoot, ".md")) {
  const relative = path.relative(docsRoot, filePath).replace(/\\/g, "/");
  const [locale, section, ...rest] = relative.split("/");
  if (!locale || !section || rest.length === 0) continue;

  const slugPath = rest.join("/").replace(/\.md$/, "");
  const key = `${section}/${slugPath}`;
  const demoPaths = extractDemoPaths(fs.readFileSync(filePath, "utf8"));

  if (demoPaths.length === 0) continue;

  const existing = docsByKey.get(key) ?? { demoPaths: new Set(), files: [] };
  for (const demoPath of demoPaths) existing.demoPaths.add(demoPath);
  existing.files.push(relative);
  docsByKey.set(key, existing);
}

const manifests = new Map();

for (const filePath of walk(demosRoot, ".ts")) {
  const relative = path.relative(demosRoot, filePath).replace(/\\/g, "/");
  const key = relative.replace(/\.ts$/, "");
  let loadedModule;

  try {
    loadedModule = await loadManifest(filePath);
  } catch (error) {
    errors.push(`无法加载 manifest ${relative}: ${error.message}`);
    continue;
  }

  manifests.set(key, loadedModule.default ?? {});
}

for (const [key, { demoPaths, files }] of docsByKey) {
  const manifest = manifests.get(key);

  if (!manifest) {
    errors.push(`${key} 缺少 demo manifest（${files.join(", ")}）`);
    continue;
  }

  for (const demoPath of demoPaths) {
    const entry = manifest[demoPath];

    if (!entry) {
      errors.push(`${key} 缺少示例 ${demoPath}`);
      continue;
    }

    if (!fs.existsSync(path.join(root, entry.sourceFile))) {
      errors.push(`${key}#${demoPath} 的 sourceFile 不存在: ${entry.sourceFile}`);
    }
  }
}

for (const key of manifests.keys()) {
  if (!docsByKey.has(key)) warnings.push(`manifest ${key} 没有对应的文档页`);
}

for (const warning of warnings) console.warn(`warning: ${warning}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`demo manifests ok (${docsByKey.size} pages)`);
