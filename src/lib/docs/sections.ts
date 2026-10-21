import type {
  DocLocale,
  DocsHeaderConfig,
  DocsSectionConfig,
} from "./types";

/** 已接入通用 Markdown 管线的 section */
export const DOC_SECTIONS: DocsSectionConfig[] = [
  {
    id: "notes",
    titles: { "zh-CN": "技术笔记", "en-US": "Notes" },
    descriptions: {
      "zh-CN": "架构、工程实践与学习记录。",
      "en-US": "Architecture, engineering practices and study notes.",
    },
    order: 10,
  },
  {
    id: "element-plus",
    titles: { "zh-CN": "Element Plus", "en-US": "Element Plus" },
    descriptions: {
      "zh-CN": "Element Plus 组件文档。",
      "en-US": "Element Plus component documentation.",
    },
    order: 20,
  },
];

export function getDocSection(id: string): DocsSectionConfig | undefined {
  return DOC_SECTIONS.find((section) => section.id === id);
}

export function getSectionTitle(section: DocsSectionConfig, locale: DocLocale) {
  return section.titles[locale];
}

/** 通用文档站的顶栏 */
export function getDocsHeaderConfig(locale: DocLocale): DocsHeaderConfig {
  const zh = locale === "zh-CN";

  return {
    logo: {
      kind: "text",
      text: "Blog Docs",
      href: `/${locale}/docs`,
    },
    links: [
      { text: zh ? "博客" : "Blog", href: `/${locale}` },
      {
        text: zh ? "文档" : "Docs",
        href: `/${locale}/docs`,
        activePrefix: `/${locale}/docs`,
      },
      {
        text: "Element Plus",
        href: `/${locale}/docs/element-plus/components/overview`,
        activePrefix: `/${locale}/docs/element-plus`,
      },
      {
        text: zh ? "官方文档" : "Official Docs",
        href: "https://element-plus.org/zh-CN/component/overview",
        external: true,
      },
    ],
  };
}

/** Element Plus 页面使用带语言切换的顶栏 */
export function getElementPlusHeaderConfig(locale: DocLocale): DocsHeaderConfig {
  const zh = locale === "zh-CN";
  const base = `/${locale}/docs/element-plus`;
  const overview = `${base}/components/overview`;

  return {
    logo: {
      kind: "image",
      src: "/images/element-plus-logo.svg",
      alt: "Element Plus Logo",
      href: overview,
    },
    badge: { text: "2.14.6", title: "latest version" },
    links: [
      {
        text: zh ? "组件" : "Components",
        href: overview,
        activePrefix: `${base}/components`,
      },
      {
        text: zh ? "官方文档" : "Official Docs",
        href: zh
          ? "https://element-plus.org/zh-CN/component/overview"
          : "https://element-plus.org/en-US/component/overview",
        external: true,
      },
    ],
  };
}
