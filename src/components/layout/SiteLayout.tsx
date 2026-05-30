import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

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
        <div className="mx-auto max-w-[1420px] px-[5rem] py-[5rem]">
          {showSidebar ? (
            <div className="flex gap-[5rem]">
              <div className="min-w-0 flex-1">{children}</div>
              {sidebar}
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
