import Link from "next/link";
import type { Article, Category, Tag } from "@/types/ui";
import { developerProfile } from "@/lib/mock-data";
import { getSiteSetting } from "@/lib/api/site";
import { articleHref } from "@/lib/utils";
import { ArchiveDateLinks } from "@/components/ui/ArchiveDateLinks";
import SearchForm from "@/components/ui/SearchForm";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  featuredArticles: Article[];
}

// 角色固定文案，不从后端读取
const DEVELOPER_ROLE = "开发者 & 编辑";

export default async function Sidebar({ categories, tags, featuredArticles }: SidebarProps) {
  // 开发者信息从站点设置读取，React.cache 在单次请求内与 SiteLayout/generateMetadata 去重
  const setting = await getSiteSetting().catch(() => null);
  const developer = {
    name: setting?.developer_name ?? "",
    intro: setting?.developer_intro ?? "",
    avatar: setting?.developer_avatar ?? "",
  };
  const featured = featuredArticles[0];
  const smallArticles = featuredArticles.slice(1);

  return (
    <aside id="secondary" className="sidebar-layout-secondary">
      <div className="sidebar-inner">
        <div className="sidebar-widget">
          <div className="sidebar-developer-row">
            <div className="sidebar-developer-avatar">
              {developer.avatar ? (
                <img src={developer.avatar} alt={developer.name} width={80} height={80} loading="lazy" decoding="async" className="rounded-full" />
              ) : (
                <div className="sidebar-developer-avatar-placeholder">
                  {developer.name.charAt(0)}
                </div>
              )}
            </div>
            <p className="sidebar-developer-info">
              <strong>{developer.name}</strong>
              <br />
              {DEVELOPER_ROLE}
            </p>
          </div>
          <p className="sidebar-developer-bio">{developer.intro}</p>
          <div className="sidebar-tech-list">
            {developerProfile.techStack.map((tech) => (
              <span key={tech.name} className="sidebar-icon-container" title={tech.name}>
                <img src={tech.icon} alt={tech.name} />
              </span>
            ))}
          </div>
        </div>

        {featured && (
          <div className="sidebar-widget">
            <div className="sidebar-widget-title">热点</div>
            <div className="sidebar-featured-cover">
              {featured.coverImage ? (
                <Link href={articleHref(featured.url)} className="relative">
                  <img src={featured.coverImage} alt={featured.title} loading="lazy" decoding="async" className="object-cover" />
                </Link>
              ) : (
                <Link href={articleHref(featured.url)}>
                  <span className="sidebar-featured-placeholder cover-placeholder" aria-label="暂无封面">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
            <Link href={articleHref(featured.url)} className="sidebar-featured-post-title">
              {featured.title}
            </Link>
            <div className="sidebar-featured-post-author">by {featured.authorName}</div>
            <div className="sidebar-featured-post-date">
              <ArchiveDateLinks publishTime={featured.publishTime} />
            </div>
            <div className="sidebar-small-articles">
              {smallArticles.map((article) => (
                <div key={article.id} className="small-article-item">
                  <div className="small-article-thumb">
                    {article.coverImage ? (
                      <Link href={articleHref(article.url)} className="relative">
                        <img src={article.coverImage} alt={article.title} loading="lazy" decoding="async" className="object-cover" />
                      </Link>
                    ) : (
                      <Link href={articleHref(article.url)}>
                        <span className="small-article-placeholder cover-placeholder" aria-label="暂无封面">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                          </svg>
                        </span>
                      </Link>
                    )}
                  </div>
                  <div>
                    <Link href={articleHref(article.url)} className="small-article-title">
                      {article.title}
                    </Link>
                    <div className="small-article-author">by {article.authorName}</div>
                    <div className="small-article-date">
                      <ArchiveDateLinks publishTime={article.publishTime} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-widget search-widget">
          <div className="sidebar-widget-title">搜索</div>
          <SearchForm className="search-inside-wrapper" />
        </div>

        {categories.length > 0 && (
          <div className="sidebar-widget">
            <div className="sidebar-widget-title">分类</div>
            <ul className="sidebar-category-list">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.name}`} className="sidebar-category-link">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tags.length > 0 && (
          <div className="sidebar-widget">
            <div className="sidebar-widget-title">标签</div>
            <div className="tag-cloud">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.name}`} className="sidebar-tag-link">
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-widget">
          <div className="sidebar-widget-title">操作</div>
          <ul className="sidebar-meta-list">
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
