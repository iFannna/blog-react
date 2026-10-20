/** 输出旧页面示例与官方 demo 路径的对照，供人工校对迁移映射。 */

import fs from "node:fs";
import path from "node:path";
import {
  officialDemoPaths,
  parsePage,
} from "./migrate-ep-docs.mjs";

const root = process.cwd();
const legacyDir = path.join(root, "src/app/(docs)/docs/element-plus/components");

const slugs = fs
  .readdirSync(legacyDir)
  .filter((slug) => fs.existsSync(path.join(legacyDir, slug, "page.tsx")))
  .sort();

const unparsed = [];
const lines = [];

for (const slug of slugs) {
  let parsed;
  try {
    parsed = parsePage(slug);
  } catch (error) {
    unparsed.push(`${slug}: ${error.message}`);
    continue;
  }

  const official = officialDemoPaths(slug);
  lines.push(`\n## ${slug} (${parsed.demoUsage.length} local / ${official.length} official)`);

  parsed.demoUsage.forEach((usage, index) => {
    const officialPath = official[index] ?? "?";
    lines.push(
      `  ${index + 1}. ${usage.sourceKey || "-"} | ${usage.component ?? "-"} | ${usage.heading ?? "-"} | ${officialPath}`,
    );
  });
}

fs.writeFileSync(
  path.join(root, "scripts", "ep-demo-report.txt"),
  lines.join("\n"),
);

console.log(lines.join("\n"));
if (unparsed.length > 0) {
  console.log("\n无法解析:");
  for (const item of unparsed) console.log(`  ${item}`);
}
