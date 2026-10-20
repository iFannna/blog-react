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

export function readDemoSource(entry: DemoEntry): string {
  const absolute = resolveProjectFile(entry.sourceFile);
  const cached = sourceCache.get(absolute);
  if (cached !== undefined && process.env.NODE_ENV === "production") return cached;

  if (!fs.existsSync(absolute)) {
    throw new Error(`演示源码不存在: ${entry.sourceFile}`);
  }

  const source = fs.readFileSync(absolute, "utf8");
  if (process.env.NODE_ENV === "production") sourceCache.set(absolute, source);
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
    source: readDemoSource(entry),
    lang: entry.lang ?? "tsx",
  };
}
