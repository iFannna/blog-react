import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { demoManifestLoaders } from "@/content/demos/registry.generated";
import type { DemoEntry, DemoLang, DemoManifest } from "./types";

export interface LoadedDemo {
  Component: ComponentType;
  source: string;
  lang: DemoLang;
  plain: boolean;
}

const manifestCache = new Map<string, Promise<DemoManifest | undefined>>();
const sourceCache = new Map<string, string>();

function manifestKey(section: string, slug: string[]): string {
  return `${section}/${slug.join("/")}`;
}

const SOURCE_ROOT = path.join(process.cwd(), "src");

function resolveProjectFile(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");

  // sourceFile 统一写 "src/..."；限定在 src 下，避免 Turbopack 把整个项目计入产物
  if (!normalized.startsWith("src/")) {
    throw new Error(`演示源码必须位于 src 下: ${relativePath}`);
  }

  const absolute = path.resolve(SOURCE_ROOT, normalized.slice("src/".length));
  const relative = path.relative(SOURCE_ROOT, absolute);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`演示源码必须位于项目内: ${relativePath}`);
  }

  return absolute;
}

/**
 * 一文件多示例时只展示对应导出，避免源码面板铺满整个 index；
 * 默认导出的独立示例文件仍展示完整文件。
 */
function extractExportSource(source: string, exportName: string): string {
  const match = new RegExp(
    `export\\s+(?:async\\s+)?(?:function|const|let|var)\\s+${exportName}\\b`,
  ).exec(source);
  if (!match) return source;

  const start = match.index;
  const bodyStart = source.indexOf("{", start);
  if (bodyStart === -1) return source;

  let depth = 0;
  let state: "code" | "single" | "double" | "template" | "line" | "block" =
    "code";

  for (let i = bodyStart; i < source.length; i++) {
    const char = source[i];
    const next = source[i + 1];

    if (state === "line") {
      if (char === "\n") state = "code";
      continue;
    }

    if (state === "block") {
      if (char === "*" && next === "/") {
        state = "code";
        i++;
      }
      continue;
    }

    if (state === "single" || state === "double" || state === "template") {
      if (char === "\\") {
        i++;
      } else if (
        (state === "single" && char === "'") ||
        (state === "double" && char === '"') ||
        (state === "template" && char === "`")
      ) {
        state = "code";
      }
      continue;
    }

    if (char === "/" && next === "/") {
      state = "line";
      i++;
      continue;
    }

    if (char === "/" && next === "*") {
      state = "block";
      i++;
      continue;
    }

    if (char === "'") {
      state = "single";
      continue;
    }

    if (char === '"') {
      state = "double";
      continue;
    }

    if (char === "`") {
      state = "template";
      continue;
    }

    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  return source;
}

export function readDemoSource(entry: DemoEntry): string {
  const absolute = resolveProjectFile(entry.sourceFile);
  const cacheKey = `${absolute}#${entry.exportName ?? "default"}`;
  const cached = sourceCache.get(cacheKey);
  if (cached !== undefined && process.env.NODE_ENV === "production") return cached;

  if (!fs.existsSync(absolute)) {
    throw new Error(`演示源码不存在: ${entry.sourceFile}`);
  }

  const raw = fs.readFileSync(absolute, "utf8");
  const source =
    entry.exportName && entry.exportName !== "default"
      ? extractExportSource(raw, entry.exportName)
      : raw;

  if (process.env.NODE_ENV === "production") sourceCache.set(cacheKey, source);
  return source;
}

export async function loadDemoManifest(
  section: string,
  slug: string[],
): Promise<DemoManifest | undefined> {
  const key = manifestKey(section, slug);
  const loader = demoManifestLoaders[key];

  if (!loader) return undefined;

  if (process.env.NODE_ENV !== "production") {
    const loadedModule = await loader();
    return loadedModule.default;
  }

  const cached = manifestCache.get(key);
  if (cached) return cached;

  const promise = loader().then((loadedModule) => loadedModule.default);
  manifestCache.set(key, promise);
  return promise;
}

export async function loadDemo(
  section: string,
  slug: string[],
  demoPath: string,
): Promise<LoadedDemo | undefined> {
  const manifest = await loadDemoManifest(section, slug);
  const entry = manifest?.[demoPath];

  if (!entry) return undefined;

  const loadedModule = await entry.load();
  const exportName = entry.exportName ?? "default";
  const Component = (
    exportName === "default"
      ? loadedModule.default
      : loadedModule[exportName]
  ) as ComponentType | undefined;

  if (!Component) {
    throw new Error(`演示导出不存在: ${entry.sourceFile}#${exportName}（${demoPath}）`);
  }

  return {
    Component,
    source: entry.plain ? "" : readDemoSource(entry),
    lang: entry.lang ?? "tsx",
    plain: entry.plain ?? false,
  };
}
