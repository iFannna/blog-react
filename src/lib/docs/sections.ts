import type {
  DocLocale,
  DocsHeaderConfig,
  DocsSectionConfig,
} from "./types";

/** 已接入通用 Markdown 管线的 section；Element Plus 旧页面按批次迁入 */
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

export const LOCALE_LABELS: Record<DocLocale, string> = {
  "zh-CN": "中文",
  "en-US": "English",
};

/** 通用文档站的顶栏；Element Plus 旧页面仍使用下面的专用配置 */
export function getDocsHeaderConfig(locale: DocLocale): DocsHeaderConfig {
  const zh = locale === "zh-CN";

  return {
    logo: {
      kind: "text",
      text: "Blog Docs",
      href: `/docs/${locale}`,
    },
    links: [
      { text: zh ? "博客" : "Blog", href: "/" },
      {
        text: zh ? "文档" : "Docs",
        href: `/docs/${locale}`,
        activePrefix: `/docs/${locale}`,
      },
      {
        text: "Element Plus",
        href: "/docs/element-plus/components/overview",
        activePrefix: "/docs/element-plus",
      },
      {
        text: zh ? "官方文档" : "Official Docs",
        href: "https://element-plus.org/zh-CN/component/overview",
        external: true,
      },
    ],
  };
}

/**
 * 迁入通用管线的 Element Plus 页面使用带语言切换的顶栏；
 * 旧版中文页面仍使用下方写死中文的 ELEMENT_PLUS_HEADER。
 */
export function getElementPlusHeaderConfig(locale: DocLocale): DocsHeaderConfig {
  const zh = locale === "zh-CN";
  const base = `/docs/${locale}/element-plus`;

  return {
    logo: {
      kind: "image",
      src: "/images/element-plus-logo.svg",
      alt: "Element Plus Logo",
      href: base,
    },
    badge: { text: "2.14.6", title: "latest version" },
    links: [
      {
        text: zh ? "指南" : "Guide",
        href: "/docs/element-plus/components/overview",
        activePrefix: "/docs/element-plus/guide",
      },
      {
        text: zh ? "组件" : "Components",
        href: base,
        activePrefix: base,
      },
      {
        text: zh ? "资源" : "Resources",
        href: "/docs/element-plus/components/overview",
        activePrefix: "/docs/element-plus/resource",
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

/** 与官方文档站顶栏保持一致：logo、版本号、指南/组件/资源入口 */
export const ELEMENT_PLUS_HEADER: DocsHeaderConfig = {
  logo: {
    kind: "image",
    src: "/images/element-plus-logo.svg",
    alt: "Element Plus Logo",
    href: "/docs/element-plus/components/overview",
  },
  badge: { text: "2.14.6", title: "latest version" },
  links: [
    {
      text: "指南",
      href: "/docs/element-plus/components/overview",
      activePrefix: "/docs/element-plus/guide",
    },
    {
      text: "组件",
      href: "/docs/element-plus/components/overview",
      activePrefix: "/docs/element-plus/components",
    },
    {
      text: "资源",
      href: "/docs/element-plus/components/overview",
      activePrefix: "/docs/element-plus/resource",
    },
    {
      text: "官方文档",
      href: "https://element-plus.org/zh-CN/component/overview",
      external: true,
    },
  ],
};
