import Link from "next/link";
import {
  mockArticles,
  mockCategories,
  mockTags,
  developerProfile,
} from "@/lib/mock-data";

export default function Sidebar() {
  const popularArticles = mockArticles.slice(0, 4);
  const featured = popularArticles[0];
  const smallArticles = popularArticles.slice(1);

  return (
    <aside id="secondary" className="sidebar-layout-secondary">
      <div className="sidebar-inner">
        {/* Widget 1: 开发者资料卡 (无浮动标题) */}
        <div className="sidebar-widget">
          <div className="sidebar-developer-row">
            <div className="sidebar-developer-avatar">
              {developerProfile.avatar ? (
                <img src={developerProfile.avatar} alt={developerProfile.name} />
              ) : (
                <div className="sidebar-developer-avatar-placeholder">
                  {developerProfile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="sidebar-developer-name">{developerProfile.name}</p>
              <p className="sidebar-developer-role">{developerProfile.role}</p>
            </div>
          </div>
          <p className="sidebar-developer-bio">{developerProfile.bio}</p>
          <div className="sidebar-tech-list">
            {developerProfile.techStack.map((tech) => (
              <span key={tech.name} className="sidebar-icon-container" title={tech.name}>
                <img src={tech.icon} alt={tech.name} />
              </span>
            ))}
          </div>
        </div>

        {/* Widget 2: 热门文章 */}
        <div className="sidebar-widget">
          <div className="sidebar-widget-title">热门文章</div>
          {/* 特色大封面 */}
          <div className="sidebar-featured-cover">
            {featured.coverImage ? (
              <Link href={featured.url}>
                <img src={featured.coverImage} alt={featured.title} />
              </Link>
            ) : (
              <Link href={featured.url}>
                <div className="sidebar-featured-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                  </svg>
                </div>
              </Link>
            )}
          </div>
          <Link href={featured.url} className="sidebar-featured-post-title">
            {featured.title}
          </Link>
          <div className="sidebar-featured-post-meta">By {featured.authorName}</div>
          {/* 小缩略图列表 */}
          <div className="sidebar-small-articles">
            {smallArticles.map((article) => (
              <div key={article.id} className="small-article-item">
                <div className="small-article-thumb">
                  {article.coverImage ? (
                    <Link href={article.url}>
                      <img src={article.coverImage} alt={article.title} />
                    </Link>
                  ) : (
                    <Link href={article.url}>
                      <div className="thumb-placeholder">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                        </svg>
                      </div>
                    </Link>
                  )}
                </div>
                <div>
                  <Link href={article.url} className="small-article-title">
                    {article.title}
                  </Link>
                  <p className="small-article-meta">By {article.authorName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: 搜索框 */}
        <div className="sidebar-widget search-widget">
          <div className="sidebar-widget-title">搜索</div>
          <form className="search-inside-wrapper">
            <input type="search" placeholder="搜索..." className="search-input" />
            <button type="submit" className="sidebar-search-btn" aria-label="搜索">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M28.962 26.499l-4.938-4.938c1.602-2.002 2.669-4.671 2.669-7.474 0-6.673-5.339-12.012-12.012S2.669 7.414 2.669 14.087a11.962 11.962 0 0012.012 12.012c2.803 0 5.472-1.068 7.474-2.669l4.938 4.938a1.745 1.745 0 002.469 0 1.745 1.745 0 00-.6-2.869zm-14.281-3.469c-4.938 0-8.943-4.005-8.943-8.943s4.005-8.943 8.943-8.943 8.943 4.005 8.943-8.943 8.943z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Widget 4: 分类列表 */}
        <div className="sidebar-widget">
          <div className="sidebar-widget-title">分类</div>
          <ul>
            {mockCategories.map((cat) => (
              <li key={cat.id} className="sidebar-category-item">
                <Link href={`/category/${cat.name}`} className="sidebar-category-link">
                  {cat.name}
                  <span className="sidebar-category-count">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Widget 5: 标签云 */}
        <div className="sidebar-widget">
          <div className="sidebar-widget-title">标签</div>
          <div className="tag-cloud">
            {mockTags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.name}`} className="sidebar-tag-link">
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Widget 6: 操作/链接 */}
        <div className="sidebar-widget">
          <div className="sidebar-widget-title">操作</div>
          <ul>
            <li>
              <Link href="/settings" className="sidebar-meta-link">设置</Link>
            </li>
            <li>
              <Link href="/login" className="sidebar-meta-link">登录</Link>
            </li>
            <li>
              <Link href="/register" className="sidebar-meta-link">注册</Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
