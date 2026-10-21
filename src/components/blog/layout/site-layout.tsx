import type { ReactNode } from "react";
import type { Article } from "@/types/models";
import Header from "./header";
import Footer from "./footer";
import WavesBackground from "@/components/blog/common/background";
import ScrollTopButton from "@/components/blog/common/backtop";
import YouMayLike from "@/components/blog/article/related-articles";
import { getSiteSetting, getGuestbookCount, getFriendLinkCount } from "@/services/site";
import { getCategories } from "@/services/category";
import { getTags } from "@/services/tag";
import { localePath } from "@/lib/locale";

interface SiteLayoutProps {
  locale: string;
  children: ReactNode;
  showSidebar?: boolean;
  sidebar?: ReactNode;
  youMayLikeArticles?: Article[];
  featuredArticles?: Article[];
  editorPickArticles?: Article[];
  breadcrumbs?: ReactNode;
}

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/archive", label: "归档" },
  { href: "/about", label: "关于" },
  { href: "/contact", label: "联系" },
  { href: "/guestbook", label: "留言" },
  { href: "/friendlink", label: "友链" },
];

export default async function SiteLayout({
  locale,
  children,
  showSidebar = false,
  sidebar,
  youMayLikeArticles = [],
  featuredArticles = [],
  editorPickArticles = [],
  breadcrumbs,
}: SiteLayoutProps) {
  // 站点设置与计数：后端不可用时用空值兜底，避免整站布局崩溃
  const setting = await getSiteSetting().catch(() => null);
  const [guestbookCount, friendLinkCount, categories, tags] = await Promise.all([
    getGuestbookCount().catch(() => 0),
    getFriendLinkCount().catch(() => 0),
    getCategories().catch(() => []),
    getTags().catch(() => []),
  ]);
  // 「其他」下拉:归档(分类/标签/作者)、排版、文档、登录、注册;分类/标签为动态数据
  const developerName = setting?.developer_name || "Admin";
  const topNavItems = NAV_ITEMS.map((item) => ({
    ...item,
    href: localePath(locale, item.href),
  }));
  const navItems = [
    ...topNavItems,
    {
      label: "其他",
      children: [
        {
          label: "归档",
          children: [
            {
              label: "分类",
              children: categories.map((c) => ({ href: localePath(locale, `/category/${c.name}`), label: c.name })),
            },
            {
              label: "标签",
              children: tags.map((t) => ({ href: localePath(locale, `/tag/${t.name}`), label: t.name })),
            },
            { href: localePath(locale, `/author/${developerName}`), label: "作者" },
          ],
        },
        { label: "排版" },
        {
          label: "文档",
          children: [
            {
              href: localePath(locale, "/docs/notes"),
              label: "Notes",
            },
            {
              href: localePath(locale, "/docs/element-plus/components/overview"),
              label: "Element Plus",
            },
          ],
        },
        { href: localePath(locale, "/login"), label: "登录" },
        { href: localePath(locale, "/register"), label: "注册" },
      ],
    },
  ];
  // 移动端:平铺菜单,不做多级
  const mobileNavItems = [
    ...topNavItems,
    { href: localePath(locale, "/typography"), label: "排版" },
    { href: localePath(locale, "/login"), label: "登录" },
    { href: localePath(locale, "/register"), label: "注册" },
  ];

  return (
    <div className="site-root">
      <Header
        navItems={navItems}
        mobileNavItems={mobileNavItems}
        github={setting?.developer_github ?? ""}
        gitee={setting?.developer_gitee ?? ""}
      />
      {breadcrumbs}
      <main className="site-main">
        <div className="site-main-container">
          {showSidebar ? (
            <div className="sidebar-layout">
              <div className="sidebar-layout-primary">{children}</div>
              {sidebar}
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      {youMayLikeArticles.length > 0 && (
        <YouMayLike articles={youMayLikeArticles} />
      )}
      <Footer
        locale={locale}
        featuredArticles={featuredArticles}
        editorPickArticles={editorPickArticles}
        siteName={setting?.site_name ?? ""}
        email={setting?.developer_email ?? ""}
        phone={setting?.developer_phone ?? ""}
        icp={setting?.icp ?? ""}
        police={setting?.police ?? ""}
        guestbookCount={guestbookCount}
        friendLinkCount={friendLinkCount}
      />
      <ScrollTopButton />
      <WavesBackground />
    </div>
  );
}
