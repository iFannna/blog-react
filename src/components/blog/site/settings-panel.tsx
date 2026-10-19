"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { message } from "@/components/element-plus/message";

/* 左侧导航：分「账户」「内容」两组，纯文字无图标；item 可带 children 形成多级菜单 */
type NavItem = { key: string; label: string; children?: { key: string; label: string }[] };
const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "账户",
    items: [
      { key: "profile", label: "个人资料" },
      { key: "security", label: "账号安全" },
    ],
  },
  {
    label: "内容",
    items: [
      { key: "articles", label: "文章管理" },
      { key: "comments", label: "评论管理" },
    ],
  },
];

/* 顶部统计卡片 mock 数据 */
const STATS = [
  { label: "文章", value: "24", delta: "+3 本周" },
  { label: "评论", value: "128", delta: "+12 本周" },
  { label: "浏览", value: "8.6k", delta: "+1.2k 本周" },
  { label: "订阅", value: "342", delta: "+8 本周" },
];

/* 文章列表 mock 数据 */
const ARTICLES = [
  { title: "用 Go 构建高并发 API 网关", category: "后端", status: "published", date: "2026-07-15" },
  { title: "React Server Components 实践笔记", category: "前端", status: "published", date: "2026-07-02" },
  { title: "CSS 容器查询完全指南", category: "前端", status: "draft", date: "2026-06-28" },
  { title: "PostgreSQL 索引优化思路", category: "数据库", status: "published", date: "2026-06-20" },
  { title: "Docker 多阶段构建精简镜像", category: "运维", status: "draft", date: "2026-06-10" },
];

/* 评论列表 mock 数据 */
const COMMENTS = [
  { author: "张三", content: "写得很清晰，受教了。", article: "用 Go 构建高并发 API 网关", date: "2026-07-16" },
  { author: "Lily", content: "求源码学习一下。", article: "React Server Components 实践笔记", date: "2026-07-05" },
  { author: "匿名用户", content: "索引那段能否再展开讲讲？", article: "PostgreSQL 索引优化思路", date: "2026-06-22" },
];

// 主页 header 同款 logo（OSS 固定地址）
const LOGO_URL = "https://java-ai-sau.oss-cn-beijing.aliyuncs.com/Blog.png";

export default function SettingsClient({ siteName, avatar }: { siteName: string; avatar: string }) {
  const [active, setActive] = useState("profile");
  const { user } = useAuth();

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    message.success("资料已保存");
  };

  const handlePasswordSave = (e: FormEvent) => {
    e.preventDefault();
    message.success("密码已更新");
  };

  return (
    <div className="settings-shell">
      <header className="settings-header">
        <div className="settings-brand">
          {/* 复用主页 header 的 logo，点击回到前台首页 */}
          <Link href="/" className="settings-brand-logo" aria-label={siteName}>
            <img src={LOGO_URL} alt={siteName} width={330} height={72} />
          </Link>
        </div>
        <div className="settings-header-actions">
          {/* 切换语言：复用主页 header widget 样式 */}
          <div className="header-widget header-widget-all">
            <div className="widget-wrapper">
              <button type="button" className="widget-icon" aria-label="切换语言">
                <svg className="icon" viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10zM10 2v2h6v2h-1.968a18.2 18.2 0 0 1-3.62 6.301A15 15 0 0 0 12.935 12.008l-.75 1.878A17 17 0 0 1 9 13.725a16.7 16.7 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18 18 0 0 1 4.767 8h2.24A16 16 0 0 0 9 10.877a16.2 16.2 0 0 0 2.91-4.876L2 6V4h6V2zm7.5 10.885L16.253 16h2.492z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* 当前账号头像：点击进入个人资料 */}
          <div className="header-widget header-widget-all">
            <div className="widget-wrapper">
              <button
                type="button"
                className="settings-avatar"
                aria-label={user?.username ?? "账号"}
                onClick={() => setActive("profile")}
              >
                {avatar ? (
                  <img src={avatar} alt={user?.username ?? "头像"} />
                ) : (
                  <span>{(user?.username ?? "A").charAt(0).toUpperCase()}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="settings-body">
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="settings-nav-group">
                <span className="settings-nav-group-label">{group.label}</span>
                {group.items.map((item) => (
                  <div key={item.key}>
                    <button
                      type="button"
                      className={`settings-nav-item${active === item.key ? " is-active" : ""}`}
                      onClick={() => setActive(item.key)}
                    >
                      {item.label}
                    </button>
                    {item.children && item.children.length > 0 && (
                      <div className="settings-nav-sub">
                        {item.children.map((child) => (
                          <button
                            key={child.key}
                            type="button"
                            className={`settings-nav-item${active === child.key ? " is-active" : ""}`}
                            onClick={() => setActive(child.key)}
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="settings-main">
          {active === "profile" && (
            <>
              <div className="settings-main-head">
                <h1 className="settings-main-title">个人资料</h1>
                <p className="settings-main-desc">管理你的公开展示信息与账号资料</p>
              </div>
              <div className="settings-stats">
                {STATS.map((s) => (
                  <div key={s.label} className="settings-stat">
                    <p className="settings-stat-label">{s.label}</p>
                    <p className="settings-stat-value">{s.value}</p>
                    <span className="settings-stat-delta">{s.delta}</span>
                  </div>
                ))}
              </div>
              <div className="settings-card">
                <div className="settings-card-head">
                  <h2 className="settings-card-title">基础资料</h2>
                  <p className="settings-card-desc">这些信息会展示在你的作者主页</p>
                </div>
                <form className="auth-form settings-form" onSubmit={handleProfileSave}>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-nickname">
                      昵称
                    </label>
                    <input
                      id="settings-nickname"
                      className="auth-input"
                      type="text"
                      defaultValue={user?.username ?? ""}
                      placeholder="请输入昵称"
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-email">
                      邮箱
                    </label>
                    <input
                      id="settings-email"
                      className="auth-input"
                      type="email"
                      defaultValue="admin@example.com"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-bio">
                      个人简介
                    </label>
                    <textarea
                      id="settings-bio"
                      className="auth-input settings-textarea"
                      defaultValue="分享技术与生活，记录成长。"
                      placeholder="一句话介绍自己"
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-site">
                      个人网站
                    </label>
                    <input
                      id="settings-site"
                      className="auth-input"
                      type="url"
                      defaultValue="https://example.com"
                      placeholder="https://"
                    />
                  </div>
                  <button type="submit" className="auth-submit">
                    保存资料
                  </button>
                </form>
              </div>
            </>
          )}

          {active === "security" && (
            <>
              <div className="settings-main-head">
                <h1 className="settings-main-title">账号安全</h1>
                <p className="settings-main-desc">定期修改密码以保障账号安全</p>
              </div>
              <div className="settings-card">
                <div className="settings-card-head">
                  <h2 className="settings-card-title">修改密码</h2>
                  <p className="settings-card-desc">新密码需至少 8 位，包含字母与数字</p>
                </div>
                <form className="auth-form settings-form" onSubmit={handlePasswordSave}>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-cur-pwd">
                      当前密码
                    </label>
                    <input id="settings-cur-pwd" className="auth-input" type="password" placeholder="请输入当前密码" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-new-pwd">
                      新密码
                    </label>
                    <input id="settings-new-pwd" className="auth-input" type="password" placeholder="请输入新密码" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="settings-confirm-pwd">
                      确认新密码
                    </label>
                    <input
                      id="settings-confirm-pwd"
                      className="auth-input"
                      type="password"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                  <button type="submit" className="auth-submit">
                    更新密码
                  </button>
                </form>
              </div>
            </>
          )}

          {active === "articles" && (
            <>
              <div className="settings-main-head">
                <h1 className="settings-main-title">文章管理</h1>
                <p className="settings-main-desc">查看与管理已发布及草稿文章</p>
              </div>
              <table className="settings-table">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>发布时间</th>
                  </tr>
                </thead>
                <tbody>
                  {ARTICLES.map((a) => (
                    <tr key={a.title}>
                      <td className="settings-table-title">{a.title}</td>
                      <td>{a.category}</td>
                      <td className={a.status === "published" ? "settings-status-published" : "settings-status-draft"}>
                        {a.status === "published" ? "已发布" : "草稿"}
                      </td>
                      <td>{a.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {active === "comments" && (
            <>
              <div className="settings-main-head">
                <h1 className="settings-main-title">评论管理</h1>
                <p className="settings-main-desc">查看与审核读者评论</p>
              </div>
              <table className="settings-table">
                <thead>
                  <tr>
                    <th>评论者</th>
                    <th>内容</th>
                    <th>所属文章</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMENTS.map((c) => (
                    <tr key={`${c.author}-${c.date}`}>
                      <td className="settings-table-title">{c.author}</td>
                      <td>{c.content}</td>
                      <td>{c.article}</td>
                      <td>{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
