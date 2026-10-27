"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// DarkModeToggle uses useTheme
import { useTheme } from "@/hooks/theme";
import { useAuth } from "@/hooks/auth";
import { useLocale } from "@/hooks/locale";
import { useDropdownMenu, MenuList, type MenuItem } from "@/components/blog/common/Dropdown";
import { setSidebarLayout } from "@/lib/sidebar-layout";

interface HeaderProps {
  navItems: MenuItem[];
  github?: string;
  gitee?: string;
  logo?: string;
}

const DEFAULT_SITE_LOGO =
  "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/Blog.png";

export default function Header({ navItems, github, gitee, logo }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { prefix } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 面板可见性与逻辑开关分离：BlogMate 关闭时面板先保持 250ms 再消失
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [openMobileKeys, setOpenMobileKeys] = useState<Set<string>>(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMobileMenu = useCallback(() => {
    clearCloseTimer();
    setIsMobileMenuVisible(true);
    setIsMobileMenuOpen(true);
  }, [clearCloseTimer]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsMobileMenuVisible(false);
      // 面板真正消失后再清子菜单，避免 250ms 滞留期内看到折叠动画
      setOpenMobileKeys(new Set());
    }, 250);
  }, [clearCloseTimer]);

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) closeMobileMenu();
    else openMobileMenu();
  }, [isMobileMenuOpen, closeMobileMenu, openMobileMenu]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  // 桌面多级菜单显隐(点外部收起)
  const { openKeys, toggle, clear } = useDropdownMenu(".primary-nav");
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = useCallback(() => {
    signOut();
    clear();
    closeMobileMenu();
  }, [signOut, clear, closeMobileMenu]);

  // 「排版」改为布局开关子菜单（右/左/无侧边栏）。子项需 client onClick，
  // 故在 Client 端为 SiteLayout 传入的占位「排版」节点注入 children。
  // 排版嵌套在「其他」下，需递归处理
  const navItemsWithLayout = useMemo<MenuItem[]>(() => {
    const inject = (items: MenuItem[]): MenuItem[] =>
      items.map((item) => {
        if (item.label === "排版") {
          return {
            ...item,
            children: [
              { label: "侧边栏居右", onClick: () => { setSidebarLayout("right"); clear(); } },
              { label: "侧边栏居左", onClick: () => { setSidebarLayout("left"); clear(); } },
              { label: "无侧边栏", onClick: () => { setSidebarLayout("none"); clear(); } },
            ],
          };
        }
        if (isAuthenticated) {
          if (item.label === "登录") return { href: `${prefix}/settings`, label: "设置" };
          if (item.label === "注册") return { label: "退出", onClick: handleSignOut };
        }
        return item.children ? { ...item, children: inject(item.children) } : item;
      });
    return inject(navItems);
  }, [navItems, clear, isAuthenticated, handleSignOut, prefix]);

  const toggleMobileSub = useCallback((key: string) => {
    setOpenMobileKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // 收起父级时一并收起各级子菜单，和 BlogMate 一致
        for (const openKey of prev) {
          if (openKey === key || openKey.startsWith(`${key}/`)) next.delete(openKey);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);


  useEffect(() => {
    const timer = window.setTimeout(() => {
      closeMobileMenu();
      clear();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, closeMobileMenu, clear]);

  // 跨过 1024 断点时复位两侧菜单，避免残留展开态
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    let wasMobile = mq.matches;
    const handleResize = () => {
      const isMobile = mq.matches;
      if (isMobile === wasMobile) return;
      wasMobile = isMobile;
      if (isMobile) {
        clear();
      } else {
        clearCloseTimer();
        setIsMobileMenuOpen(false);
        setIsMobileMenuVisible(false);
        setOpenMobileKeys(new Set());
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clear, clearCloseTimer]);

  useEffect(() => {
    const root = document.documentElement;
    if (isMobileMenuVisible) {
      root.classList.add("is-mobile-menu-active");
    } else {
      root.classList.remove("is-mobile-menu-active");
    }
    return () => {
      root.classList.remove("is-mobile-menu-active");
    };
  }, [isMobileMenuVisible]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-nav") && !target.closest(".mobile-navigation")) {
        closeMobileMenu();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // 搜索框相关逻辑
  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // 搜索框打开时自动聚焦输入框
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // 点击外部关闭搜索框
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container")) {
        closeSearch();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSearchOpen, closeSearch]);

  // ESC 键关闭搜索框
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  return (
    <header id="masthead" className="site-header">
      <div id="header-inner">
        <div className="header-container">
          <div className="logo header-element">
            <Link href={prefix || "/"} rel="home" className="logo-inner">
              <img
                src={logo || DEFAULT_SITE_LOGO}
                alt="Blog"
                width={330}
                height={72}
              />
            </Link>
          </div>

          <span className="mobile-nav header-element">
            <button
              type="button"
              className={`hamburger is-spin${isMobileMenuOpen ? " is-active" : ""}`}
              aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={isMobileMenuOpen}
              onClick={(e) => {
                e.stopPropagation();
                toggleMobileMenu();
              }}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </span>

          <nav
            className="mobile-navigation"
            aria-label="移动端导航"
          >
            <ul className="menu">
              <MobileMenuList
                items={navItemsWithLayout}
                trail="m"
                pathname={pathname}
                openKeys={openMobileKeys}
                onToggle={toggleMobileSub}
                onNavigate={(item) => {
                  item.onClick?.();
                  closeMobileMenu();
                }}
              />
            </ul>
          </nav>

          <nav className="primary-nav">
            <ul className="menu">
              <MenuList
                items={navItemsWithLayout}
                openKeys={openKeys}
                toggle={toggle}
                pathname={pathname}
              />
            </ul>
          </nav>

          <div className="header-widgets">
            <div className={`header-widget header-widget-all${isSearchOpen ? " search-visible" : ""}`}>
              <div className="widget-wrapper">
                <button
                  type="button"
                  className="widget-icon"
                  aria-label="搜索"
                  aria-expanded={isSearchOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSearch();
                  }}
                >
                      <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M28.962 26.499l-4.938-4.938c1.602-2.002 2.669-4.671 2.669-7.474 0-6.673-5.339-12.012-12.012-12.012S2.669 7.414 2.669 14.087a11.962 11.962 0 0012.012 12.012c2.803 0 5.472-1.068 7.474-2.669l4.938 4.938a1.745 1.745 0 002.469 0 1.745 1.745 0 00-.6-2.869zm-14.281-3.469c-4.938 0-8.943-4.005-8.943-8.943s4.005-8.943 8.943-8.943 8.943 4.005 8.943 8.943-4.005 8.943-8.943 8.943z" />
                      </svg>
                    </button>
              </div>
              {/* 搜索弹出框 */}
              <div className="search-container dropdown-item">
                <form
                  role="search"
                  aria-label="Site Search"
                  className="search-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const q = formData.get("s") as string;
                    if (q?.trim()) {
                      closeSearch();
                      router.push(`${prefix}/search?q=${encodeURIComponent(q.trim())}`);
                    }
                  }}
                >
                  <label className="form-label">
                    <span className="screen-reader-text">Search for:</span>
                    <input
                      ref={searchInputRef}
                      type="search"
                      className="input-search"
                      placeholder="Search"
                      autoComplete="off"
                      name="s"
                    />
                  </label>
                  <button type="submit" className="animate-arrow right-arrow" aria-hidden="true" role="button" tabIndex={0}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 18">
                      <path className="arrow-handle" d="M2.511 9.007l7.185-7.221c.407-.409.407-1.071 0-1.48s-1.068-.409-1.476 0L.306 8.259a1.049 1.049 0 000 1.481l7.914 7.952c.407.408 1.068.408 1.476 0s.407-1.07 0-1.479L2.511 9.007z" />
                      <path className="arrow-bar" fillRule="evenodd" clipRule="evenodd" d="M1 8h28.001a1.001 1.001 0 010 2H1a1 1 0 110-2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="search-clear"
                    aria-label="清空搜索"
                    onClick={(e) => {
                      e.preventDefault();
                      if (searchInputRef.current) {
                        searchInputRef.current.value = "";
                        searchInputRef.current.focus();
                      }
                    }}
                  >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M6.852 7.649L.399 1.195 1.445.149l6.454 6.453L14.352.149l1.047 1.046-6.454 6.454 6.454 6.453-1.047 1.047-6.453-6.454-6.454 6.454-1.046-1.047z" fill="currentColor" fillRule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className="header-widget header-widget-all">
              <div className="widget-wrapper">
                <button type="button" className="widget-icon" aria-label="切换语言">
                      <svg className="icon" viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true">
                        <path fill="currentColor" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10zM10 2v2h6v2h-1.968a18.2 18.2 0 0 1-3.62 6.301A15 15 0 0 0 12.935 12.008l-.75 1.878A17 17 0 0 1 9 13.725a16.7 16.7 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18 18 0 0 1 4.767 8h2.24A16 16 0 0 0 9 10.877a16.2 16.2 0 0 0 2.91-4.876L2 6V4h6V2zm7.5 10.885L16.253 16h2.492z" />
                      </svg>
                    </button>
              </div>
            </div>

            <div className="header-widget header-widget-all">
              <div className="widget-wrapper">
                <DarkModeToggle />
              </div>
            </div>

            <div className="header-widget header-widget-socials header-widget-hide-mobile">
              <div className="widget-wrapper">
                <nav className="social-nav minimal-fill is-large" aria-label="社交链接">
                  <ul>
                    <li>
                      <a href={github || "#"} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                        <span className="github-social-icon" />
                      </a>
                    </li>
                    <li>
                      <a href={gitee || "#"} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Gitee">
                        <span className="gitee-social-icon" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="darkmode-toggle"
      aria-label={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
      aria-pressed={isDarkMode}
      onClick={(e) => toggleTheme(e)}
    >
      <span className="darkmode-face" aria-hidden="true" />
    </button>
  );
}

interface MobileMenuListProps {
  items: MenuItem[];
  trail: string;
  pathname: string;
  openKeys: Set<string>;
  onToggle: (key: string) => void;
  onNavigate: (item: MenuItem) => void;
}

/** 移动抽屉的多级列表：父项就地折叠，子项缩进一级 */
function MobileMenuList({ items, trail, pathname, openKeys, onToggle, onNavigate }: MobileMenuListProps) {
  return (
    <>
      {items.map((item) => {
        const key = `${trail}/${item.label}`;
        const children = item.children ?? [];
        if (children.length > 0) {
          const open = openKeys.has(key);
          return (
            <li key={key} className={`menu-item-has-children${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="menu-row menu-parent"
                aria-expanded={open}
                onClick={() => onToggle(key)}
              >
                <span className="menu-label">{item.label}</span>
                <span className="submenu-toggle" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true">
                    <path d="M24.958 10.483a1.29 1.29 0 00-1.868 0l-7.074 7.074-7.074-7.074c-.534-.534-1.335-.534-1.868 0s-.534 1.335 0 1.868l8.008 8.008c.267.267.667.4.934.4s.667-.133.934-.4l8.008-8.008a1.29 1.29 0 000-1.868z" />
                  </svg>
                </span>
              </button>
              <div className="submenu-collapse">
                <ul className="sub-menu">
                  <MobileMenuList
                    items={children}
                    trail={key}
                    pathname={pathname}
                    openKeys={openKeys}
                    onToggle={onToggle}
                    onNavigate={onNavigate}
                  />
                </ul>
              </div>
            </li>
          );
        }
        const isActive = !!item.href && pathname === item.href;
        return (
          <li key={key}>
            <Link
              href={item.href || "#"}
              className={isActive ? "menu-row active" : "menu-row"}
              onClick={() => onNavigate(item)}
            >
              <span className="menu-label">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
}