"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// DarkModeToggle uses useTheme
import { useTheme } from "@/lib/useTheme";
import { useDropdownMenu, MenuList, type MenuItem } from "@/components/ui/DropdownMenu";

interface HeaderProps {
  navItems: MenuItem[];
  mobileNavItems: MenuItem[];
  github?: string;
  gitee?: string;
}

export default function Header({ navItems, mobileNavItems, github, gitee }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // 桌面多级菜单显隐(点外部收起)
  const { openKeys, toggle, clear } = useDropdownMenu(".primary-nav");

  useEffect(() => {
    closeMobileMenu();
    clear();
  }, [pathname, closeMobileMenu, clear]);

  // 切到桌面端时关闭移动菜单,清掉 state 与全屏遮罩
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isMobileMenuOpen) {
      root.classList.add("is-mobile-menu-active");
    } else {
      root.classList.remove("is-mobile-menu-active");
    }
    return () => {
      root.classList.remove("is-mobile-menu-active");
    };
  }, [isMobileMenuOpen]);

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
            <Link href="/" rel="home" className="logo-inner block leading-none">
              <img
                src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/Blog.png"
                alt="Blog"
                width={330}
                height={72}
              />
            </Link>
          </div>

          <span className="mobile-nav header-element">
            <button
              type="button"
              className={`hamburger hamburger--spin${isMobileMenuOpen ? " is-active" : ""}`}
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
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href || "#"}
                      className={isActive ? "active" : ""}
                      onClick={closeMobileMenu}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav className="primary-nav">
            <ul className="menu">
              <MenuList
                items={navItems}
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
                      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
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

            <div className="header-widget header-widget__socials header-widget-hide-mobile">
              <div className="widget-wrapper">
                <nav className="social-nav minimal-fill social-nav--large" aria-label="社交链接">
                  <ul className="flex items-center">
                    <li>
                      <a href={github || "#"} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                        <span>
                          <img src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/github.png" width="32" height="32" className="icon github-social-icon" alt="" />
                          <img src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/github.png" width="32" height="32" className="icon bottom-icon github-social-icon" alt="" />
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href={gitee || "#"} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Gitee">
                        <span>
                          <img src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/gitee.png" width="32" height="32" className="icon" alt="" />
                          <img src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/gitee.png" width="32" height="32" className="icon bottom-icon" alt="" />
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
      aria-pressed={isDarkMode ? "true" : "false"}
      onClick={(e) => toggleTheme(e)}
    >
      <span className="darkmode-face" aria-hidden="true" />
    </button>
  );
}

