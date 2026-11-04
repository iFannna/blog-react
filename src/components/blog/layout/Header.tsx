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
  "https://lisris.oss-cn-beijing.aliyuncs.com/media/image/2026/10/6a403db0727fe005d8837f3f10a40b16.png";

const GITHUB_ICON_PATH =
  "M0,0 L34,0 L59,3 L83,8 L113,18 L137,29 L154,39 L170,50 L181,59 L195,71 L205,81 L212,89 L224,104 L234,119 L244,136 L254,157 L263,182 L269,206 L272,225 L273,235 L273,278 L270,301 L265,323 L259,342 L251,362 L243,378 L235,392 L224,408 L211,424 L197,439 L183,452 L166,465 L154,473 L133,485 L113,494 L95,500 L86,499 L81,495 L79,490 L79,415 L77,398 L72,383 L65,373 L63,369 L73,367 L97,362 L115,356 L131,348 L143,339 L155,327 L164,313 L170,299 L174,286 L177,270 L178,260 L178,232 L174,212 L167,195 L157,180 L153,175 L157,154 L157,137 L154,120 L150,108 L148,107 L134,108 L113,115 L94,125 L82,133 L73,132 L53,128 L36,126 L-4,126 L-27,129 L-45,133 L-50,132 L-69,121 L-83,114 L-98,109 L-109,107 L-118,107 L-120,116 L-123,129 L-124,137 L-124,153 L-121,169 L-120,175 L-129,187 L-135,197 L-142,216 L-145,234 L-145,256 L-142,280 L-138,295 L-133,308 L-124,324 L-112,337 L-104,344 L-87,354 L-72,360 L-53,365 L-30,369 L-32,373 L-39,383 L-44,398 L-45,404 L-55,408 L-70,411 L-82,411 L-94,408 L-105,402 L-112,396 L-121,384 L-127,375 L-135,367 L-147,360 L-161,357 L-170,358 L-169,364 L-161,371 L-153,377 L-146,384 L-137,398 L-128,418 L-119,429 L-108,437 L-96,442 L-81,445 L-64,445 L-46,443 L-46,490 L-49,496 L-55,500 L-65,500 L-90,490 L-115,477 L-130,467 L-142,458 L-153,449 L-160,442 L-168,435 L-175,427 L-182,419 L-192,406 L-203,389 L-213,371 L-222,351 L-230,327 L-235,306 L-239,279 L-239,236 L-236,212 L-230,186 L-222,162 L-211,138 L-202,122 L-194,110 L-185,98 L-176,87 L-162,72 L-149,60 L-132,47 L-115,36 L-97,26 L-79,18 L-60,11 L-37,5 L-12,1 Z";

const GITEE_ICON_PATH =
  "M0,0 L42,0 L65,3 L88,8 L118,18 L147,32 L166,44 L182,56 L196,68 L212,84 L221,95 L231,108 L242,125 L256,152 L264,173 L270,193 L275,217 L277,235 L277,277 L274,301 L268,327 L259,353 L247,378 L239,392 L228,408 L215,424 L204,436 L193,447 L182,456 L169,466 L150,478 L127,490 L107,498 L84,505 L59,510 L42,512 L-1,512 L-30,508 L-54,502 L-79,493 L-102,482 L-120,471 L-138,458 L-153,445 L-172,426 L-181,415 L-194,397 L-207,375 L-216,356 L-225,331 L-231,307 L-235,278 L-235,235 L-232,212 L-227,189 L-218,162 L-210,144 L-199,123 L-191,111 L-182,99 L-174,89 L-162,76 L-151,65 L-140,56 L-127,46 L-110,35 L-92,25 L-68,15 L-50,9 L-24,3 Z M-33,114 L-47,116 L-63,121 L-78,129 L-87,136 L-97,145 L-108,160 L-115,175 L-119,188 L-121,202 L-121,388 L-118,394 L-114,397 L-111,398 L83,398 L97,396 L112,391 L125,384 L135,376 L144,367 L154,352 L160,337 L162,328 L163,319 L163,238 L160,232 L154,228 L2,228 L-3,231 L-6,234 L-7,237 L-7,275 L-4,280 L-1,283 L2,284 L97,285 L103,287 L105,292 L106,295 L106,308 L102,321 L96,329 L88,336 L78,340 L72,341 L-55,341 L-61,338 L-64,332 L-64,205 L-61,193 L-55,184 L-54,181 L-50,179 L-42,174 L-31,171 L154,170 L159,167 L163,161 L163,124 L159,117 L153,114 Z";

function GitHubGlyph() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <path d={GITHUB_ICON_PATH} fill="#000000" transform="translate(239,6)" />
    </svg>
  );
}

function GiteeGlyph() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <path d={GITEE_ICON_PATH} fill="#D81E06" transform="translate(235,0)" />
    </svg>
  );
}

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
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                      <path d="M6.852 7.649L.399 1.195 1.445.149l6.454 6.453L14.352.149l1.047 1.046-6.454 6.454 6.454 6.453-1.047 1.047-6.453-6.454-6.454 6.454-1.046-1.047z" fill="currentColor" fillRule="evenodd" />
                    </svg>
                  </button>
                </form>
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
                        <span className="github-social-icon">
                          <GitHubGlyph />
                          <GitHubGlyph />
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href={gitee || "#"} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Gitee">
                        <span className="gitee-social-icon">
                          <GiteeGlyph />
                          <GiteeGlyph />
                        </span>
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
        if (!item.href) {
          // 只有动作的项写成链接会把 # 落进地址栏，和桌面版一样用按钮
          return (
            <li key={key}>
              <button type="button" className="menu-row" onClick={() => onNavigate(item)}>
                <span className="menu-label">{item.label}</span>
              </button>
            </li>
          );
        }
        const isActive = pathname === item.href;
        return (
          <li key={key}>
            <Link
              href={item.href}
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