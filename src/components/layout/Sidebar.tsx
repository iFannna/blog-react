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

  function formatDate(iso: string) {
    const d = new Date(iso);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return {
      month: months[d.getMonth()],
      monthNumber: d.getMonth() + 1,
      day: d.getDate(),
      year: d.getFullYear(),
    };
  }

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
            <p className="sidebar-developer-info">
              <strong>{developerProfile.name}</strong>
              <br />
              {developerProfile.role}
            </p>
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
          <div className="sidebar-widget-title">热点</div>
          {/* 特色大封面 */}
          <div className="sidebar-featured-cover">
            {featured.coverImage ? (
              <Link href={featured.url}>
                <img src={featured.coverImage} alt={featured.title} />
              </Link>
            ) : (
              <Link href={featured.url}>
                <div className="flex h-full w-full flex-col items-center justify-center gap-[1.4rem] bg-[#f3eee8] text-[#a08a78]">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                  </svg>
                  <span className="text-[1.4rem] font-semibold tracking-wide">暂无封面</span>
                </div>
              </Link>
            )}
          </div>
          <Link href={featured.url} className="sidebar-featured-post-title">
            {featured.title}
          </Link>
          <div className="sidebar-featured-post-author">by {featured.authorName}</div>
          <div className="sidebar-featured-post-date">
            {(() => { const d = formatDate(featured.publishTime); return (
              <>
                <Link className="archive-date-link" href={`/archive/${d.year}/${d.monthNumber}`}>{d.month}</Link>
                <span className="archive-date-separator" aria-hidden="true">{" "}</span>
                <Link className="archive-date-link" href={`/archive/${d.year}/${d.monthNumber}/${d.day}`}>{d.day}</Link>
                <span className="archive-date-separator" aria-hidden="true">{", "}</span>
                <Link className="archive-date-link" href={`/archive/${d.year}`}>{d.year}</Link>
              </>
            ); })()}
          </div>
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
                      <div className="flex h-full w-full flex-col items-center justify-center bg-[#f3eee8] text-[#a08a78]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                  <div className="small-article-author">by {article.authorName}</div>
                  <div className="small-article-date">
                    {(() => { const d = formatDate(article.publishTime); return (
                      <>
                        <Link className="archive-date-link" href={`/archive/${d.year}/${d.monthNumber}`}>{d.month}</Link>
                        <span className="archive-date-separator" aria-hidden="true">{" "}</span>
                        <Link className="archive-date-link" href={`/archive/${d.year}/${d.monthNumber}/${d.day}`}>{d.day}</Link>
                        <span className="archive-date-separator" aria-hidden="true">{", "}</span>
                        <Link className="archive-date-link" href={`/archive/${d.year}`}>{d.year}</Link>
                      </>
                    ); })()}
                  </div>
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
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 5c-3.3 0-6 2.7-6 6 0 1.4.5 2.7 1.3 3.7l-3.8 3.8 1.1 1.1 3.8-3.8c1 .8 2.3 1.3 3.7 1.3 3.3 0 6-2.7 6-6S16.3 5 13 5zm0 10.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Widget 4: 分类列表 */}
        <div className="sidebar-widget">
          <div className="sidebar-widget-title">分类</div>
          <ul className="sidebar-category-list">
            {mockCategories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.name}`} className="sidebar-category-link">
                  {cat.name}
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
