"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

interface HeaderProps {
  navItems: NavItem[];
}

export default function Header({ navItems }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header id="masthead" className="site-header">
      <div id="header-inner">
        <div className="header-container">
          {/* Logo — layout-2: margin-right 3.2rem */}
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

          {/* Mobile Nav */}
          <span className="mobile-nav header-element">
            <button
              type="button"
              className="hamburger"
              aria-label="打开菜单"
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </span>

          {/* Desktop Nav — layout-2: flex: 1 */}
          <nav className="primary-nav hidden md:block">
            <ul className="menu">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-link ${isActive ? "active" : ""}`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Widgets — layout-2: margin-left auto, justify-end */}
          <div className="header-widgets hidden md:flex">
            {/* Search */}
            <div className="header-widget">
              <div className="widget-wrapper">
                <button type="button" className="widget-icon" aria-label="搜索">
                      <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32" aria-hidden="true">
                        <path d="M28.962 26.499l-4.938-4.938c1.602-2.002 2.669-4.671 2.669-7.474 0-6.673-5.339-12.012-12.012-12.012S2.669 7.414 2.669 14.087a11.962 11.962 0 0012.012 12.012c2.803 0 5.472-1.068 7.474-2.669l4.938 4.938a1.745 1.745 0 002.469 0 1.745 1.745 0 00-.6-2.869zm-14.281-3.469c-4.938 0-8.943-4.005-8.943-8.943s4.005-8.943 8.943-8.943 8.943 4.005 8.943 8.943-4.005 8.943-8.943 8.943z" />
                      </svg>
                    </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="header-widget">
              <div className="widget-wrapper">
                <button type="button" className="widget-icon" aria-label="切换语言">
                      <svg className="icon" viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true">
                        <path fill="currentColor" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10zM10 2v2h6v2h-1.968a18.2 18.2 0 0 1-3.62 6.301A15 15 0 0 0 12.935 12.008l-.75 1.878A17 17 0 0 1 9 13.725a16.7 16.7 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18 18 0 0 1 4.767 8h2.24A16 16 0 0 0 9 10.877a16.2 16.2 0 0 0 2.91-4.876L2 6V4h6V2zm7.5 10.885L16.253 16h2.492z" />
                      </svg>
                    </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="header-widget">
              <div className="widget-wrapper">
                <DarkModeToggle />
              </div>
            </div>

            {/* Social Links */}
            <div className="header-widget">
              <div className="widget-wrapper">
                <nav className="social-nav minimal-fill social-nav--large" aria-label="社交链接">
                  <ul className="flex items-center">
                    {/* GitHub */}
                    <li>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                        <span>
                          <img src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/github.png" width="32" height="32" className="icon github-social-icon" alt="" />
                          <img src="https://java-ai-sau.oss-cn-beijing.aliyuncs.com/github.png" width="32" height="32" className="icon bottom-icon github-social-icon" alt="" />
                        </span>
                      </a>
                    </li>
                    {/* Gitee */}
                    <li>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Gitee">
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

            {/* Subscribe Button */}
            <div className="header-widget header-widget__button">
              <div className="widget-wrapper">
                <Link href="/subscribe" className="subscribe-btn">
                  <span>订阅</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Dark Mode Toggle (CSS crescent/sun via box-shadow) ── */

function DarkModeToggle() {
  return (
    <label className="darkmode-toggle">
      <input type="checkbox" className="sr-only" />
      <span className="darkmode-face" />
    </label>
  );
}
