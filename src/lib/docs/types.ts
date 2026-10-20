export const DOC_LOCALES = ["zh-CN", "en-US"] as const;

export type DocLocale = (typeof DOC_LOCALES)[number];

export const DEFAULT_DOC_LOCALE: DocLocale = "zh-CN";

export function isDocLocale(value: string): value is DocLocale {
  return (DOC_LOCALES as readonly string[]).includes(value);
}

export interface DocsNavItem {
  title: string;
  href: string;
  done?: boolean;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export interface DocsHeaderLink {
  text: string;
  href: string;
  activePrefix?: string;
  external?: boolean;
}

export interface DocsHeaderLogo {
  kind: "image" | "text";
  href: string;
  src?: string;
  alt?: string;
  text?: string;
}

export interface DocsHeaderConfig {
  logo: DocsHeaderLogo;
  badge?: { text: string; title?: string };
  links: DocsHeaderLink[];
}

export interface DocsSectionConfig {
  id: string;
  titles: Record<DocLocale, string>;
  descriptions?: Record<DocLocale, string>;
  order: number;
}

export interface DocFrontmatter {
  title: string;
  description?: string;
  group?: string;
  order?: number;
  draft?: boolean;
}

export interface DocSourceMeta extends DocFrontmatter {
  section: string;
  locale: DocLocale;
  /** URL 片段，例如 ["components", "button"] */
  slug: string[];
  /** 拼接后的相对路径，例如 "components/button" */
  slugPath: string;
  filePath: string;
}

export interface ResolvedDocPage {
  meta: DocSourceMeta;
  actualLocale: DocLocale;
  fallback: boolean;
}

export type DemoLang = "vue" | "tsx" | "bash" | "text";

export interface DemoEntry {
  load: () => Promise<Record<string, unknown>>;
  /** 默认导出可省略 */
  exportName?: string;
  /** 相对项目根目录，用于读取源码 */
  sourceFile: string;
  lang?: DemoLang;
  /** 纯展示：不渲染 DemoBlock 外框、操作栏和源码面板 */
  plain?: boolean;
}

export type DemoManifest = Record<string, DemoEntry>;
