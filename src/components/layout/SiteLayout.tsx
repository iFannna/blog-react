import type { ReactNode } from "react";
import type { Article } from "@/types/ui";
import Header from "./Header";
import Footer from "./Footer";
import WavesBackground from "@/components/ui/WavesBackground";
import ScrollTopButton from "@/components/ui/ScrollTopButton";
import YouMayLike from "@/components/ui/YouMayLike";
import { getSiteSetting, getGuestbookCount, getFriendLinkCount } from "@/lib/api/site";
import { getCategories } from "@/lib/api/category";
import { getTags } from "@/lib/api/tag";

interface SiteLayoutProps {
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
  // 「其他」下拉:归档(分类/标签/作者)、排版、登录、注册;分类/标签为动态数据
  const developerName = setting?.developer_name || "Admin";
  const navItems = [
    ...NAV_ITEMS,
    {
      label: "其他",
      children: [
        {
          label: "归档",
          children: [
            {
              label: "分类",
              children: categories.map((c) => ({ href: `/category/${c.name}`, label: c.name })),
            },
            {
              label: "标签",
              children: tags.map((t) => ({ href: `/tag/${t.name}`, label: t.name })),
            },
            { href: `/author/${developerName}`, label: "作者" },
          ],
        },
        { href: "/typography", label: "排版" },
        { href: "/login", label: "登录" },
        { href: "/register", label: "注册" },
      ],
    },
  ];
  // 移动端:平铺菜单,不做多级
  const mobileNavItems = [
    ...NAV_ITEMS,
    { href: "/typography", label: "排版" },
    { href: "/login", label: "登录" },
    { href: "/register", label: "注册" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        navItems={navItems}
        mobileNavItems={mobileNavItems}
        github={setting?.developer_github ?? ""}
        gitee={setting?.developer_gitee ?? ""}
      />
      {breadcrumbs}
      <main className="flex-1">
        <div className="mx-auto max-w-[1420px] px-[5rem] pb-[5rem]">
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
