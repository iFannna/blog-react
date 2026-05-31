import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WavesBackground from "@/components/ui/WavesBackground";
import ScrollTopButton from "@/components/ui/ScrollTopButton";
import YouMayLike from "@/components/ui/YouMayLike";
import { mockYouMayLikeArticles } from "@/lib/mock-data";

interface SiteLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  sidebar?: ReactNode;
}

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/contact", label: "联系" },
  { href: "/archive", label: "归档" },
  { href: "/guestbook", label: "留言" },
  { href: "/friend-link", label: "友链" },
  { href: "/login", label: "登录" },
  { href: "/register", label: "注册" },
];

export default function SiteLayout({
  children,
  showSidebar = false,
  sidebar,
}: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header navItems={NAV_ITEMS} />
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
      <YouMayLike articles={mockYouMayLikeArticles} />
      <Footer />
      <ScrollTopButton />
      <WavesBackground />
    </div>
  );
}
