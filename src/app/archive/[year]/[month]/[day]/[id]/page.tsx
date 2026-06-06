import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout from "@/components/layout/SiteLayout";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { ArchiveDateLinks } from "@/components/ui/ArchiveDateLinks";
import { getArticleByUrl } from "@/lib/api/article";

export const dynamic = "force-dynamic";

const CAT_COLORS = [
  "article-cat-1",
  "article-cat-2",
  "article-cat-3",
  "article-cat-4",
];

interface ArticlePageProps {
  params: Promise<{ year: string; month: string; day: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { year, month, day, id } = await params;

  try {
    const article = await getArticleByUrl(`/${year}/${month}/${day}/${id}`);
    return {
      title: article.title,
      description: article.summary || undefined,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { year, month, day, id } = await params;
  const url = `/${year}/${month}/${day}/${id}`;

  let article;
  try {
    article = await getArticleByUrl(url);
  } catch {
    notFound();
  }

  return (
    <SiteLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Archive", path: "/archive" },
            { name: year, path: `/archive/${year}` },
            { name: month, path: `/archive/${year}/${month}` },
            { name: day, path: `/archive/${year}/${month}/${day}` },
            { name: article.title, path: `/archive${article.url}` },
          ]}
        />
      }
    >
      <div id="primary" className="content-area">
        <article className="page-entry">
          {/* 文章头部信息 */}
          <div className="post-category">
            {article.categories.length > 0 ? (
              article.categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.name}`}
                  className={`article-cat-pill ${CAT_COLORS[i % CAT_COLORS.length]}`}
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <span className={`article-cat-pill ${CAT_COLORS[0]}`}>未分类</span>
            )}
          </div>

          <header className="entry-header">
            <h1 className="entry-title">{article.title}</h1>
          </header>

          <div className="article-meta">
            <span className="post-author">
              <span className="article-avatar">
                {article.authorAvatar ? (
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName}
                    width={30}
                    height={30}
                    loading="lazy"
                    decoding="async"
                    className="rounded-full"
                  />
                ) : (
                  <span className="article-avatar-placeholder">
                    {article.authorName.charAt(0)}
                  </span>
                )}
              </span>
              <span>
                By <Link href={`/author/${article.authorName}`} className="article-author-link">{article.authorName}</Link>
              </span>
            </span>
            <span className="posted-on">
              <span className="article-meta-divider" />
              <svg className="article-meta-icon" viewBox="0 0 29.36 29.36" aria-hidden="true">
                <path d="M14.68 0a14.68 14.68 0 1014.68 14.68A14.64 14.64 0 0014.68 0zm0 26.69a12 12 0 1112-12 12 12 0 01-12 12zm5.87-10.54L16 13.88V6.67a1.25 1.25 0 00-1.33-1.33 1.26 1.26 0 00-1.34 1.33v8a1.28 1.28 0 00.81 1.2l5.33 2.67c.14.13.27.13.54.13a1.28 1.28 0 001.2-.8 1.41 1.41 0 00-.67-1.73z" />
              </svg>
              <ArchiveDateLinks publishTime={article.publishTime} />
            </span>
            <span className="post-comment-link">
              <span className="article-meta-divider" />
              <svg className="article-meta-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <path d="M25.358 2.075H6.673c-2.269 0-4.004 1.735-4.004 4.004v21.354c0 .534.267 1.068.801 1.201.133.133.4.133.534.133.4 0 .667-.133.934-.4l4.938-4.938h15.482c2.269 0 4.004-1.735 4.004-4.004V6.079c0-2.269-1.735-4.004-4.004-4.004zm1.335 17.35c0 .801-.534 1.335-1.335 1.335H9.342c-.4 0-.667.133-.934.4l-3.07 3.07V6.079c0-.801.534-1.335 1.335-1.335h18.685c.801 0 1.335.534 1.335 1.335v13.346z" />
              </svg>
              {article.commentCount > 0 ? `${article.commentCount} 条评论` : "暂无评论"}
            </span>
          </div>

          {article.summary && (
            <p className="post-summary">{article.summary}</p>
          )}

          {article.coverImage && (
            <figure className="post-cover">
              <img src={article.coverImage} alt={article.title} loading="lazy" decoding="async" />
            </figure>
          )}

          {/* 文章正文 */}
          <div className="entry-content page-entry-content">
            <MarkdownContent content={article.content} />
          </div>

          {/* 文章底部：标签 + 更新时间 */}
          <footer className="entry-footer">
            {article.tags.length > 0 && (
              <div className="post-tags">
                <div className="post-tags-links">
                  {article.tags.map((tag) => (
                    <Link key={tag.id} href={`/tag/${tag.name}`}>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <span className="last-updated">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M4.004 23.429h5.339c.4 0 .667-.133.934-.4L24.958 8.348a1.29 1.29 0 000-1.868l-5.339-5.339a1.29 1.29 0 00-1.868 0L3.07 15.822c-.267.267-.4.534-.4.934v5.339c0 .801.534 1.335 1.335 1.335zm1.335-6.139L18.685 3.944l3.47 3.47L8.809 20.76h-3.47v-3.47zm22.688 10.143H4.004c-.801 0-1.335.534-1.335 1.335s.534 1.335 1.335 1.335h24.023c.801 0 1.335-.534 1.335-1.335s-.534-1.335-1.335-1.335z" />
              </svg>
              <ArchiveDateLinks publishTime={article.publishTime} prefix={"Last updated on "} />
            </span>
          </footer>

          {/* 作者信息卡片 */}
          <section className="post-author-box">
            <div className="post-author-box-avatar">
              {article.authorAvatar ? (
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  width={75}
                  height={75}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="post-author-box-avatar-placeholder">
                  {article.authorName.charAt(0)}
                </span>
              )}
            </div>
            <div className="post-author-box-meta">
              <div className="post-author-box-name">
                <Link href={`/author/${article.authorName}`} className="post-author-box-name-link">
                  {article.authorName}
                </Link>
              </div>
              <div className="post-author-box-content" />
              <div className="post-author-box-more">
                <Link href={`/author/${article.authorName}`} className="post-author-box-link" role="button">
                  <span>View All Posts</span>
                </Link>
              </div>
            </div>
          </section>
        </article>
      </div>
    </SiteLayout>
  );
}
