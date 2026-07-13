import type { ReactNode } from "react";
import type { Article } from "@/types/ui";
import Header from "./Header";
import Footer from "./Footer";
import WavesBackground from "@/components/ui/WavesBackground";
import ScrollTopButton from "@/components/ui/ScrollTopButton";
import YouMayLike from "@/components/ui/YouMayLike";
import { getSiteSetting, getGuestbookCount, getFriendLinkCount } from "@/lib/api/site";

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
  { href: "/typography", label: "排版" },
  { href: "/login", label: "登录" },
  { href: "/register", label: "注册" },
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
  const [guestbookCount, friendLinkCount] = await Promise.all([
    getGuestbookCount().catch(() => 0),
    getFriendLinkCount().catch(() => 0),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        navItems={NAV_ITEMS}
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
