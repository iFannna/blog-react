import Link from "next/link";
import type { Article } from "@/types/ui";
import { sanitizeCssUrl } from "@/lib/utils";
import { ArchiveDateLinks } from "./ArchiveDateLinks";

interface ArticleCardProps {
  article: Article;
  highlightTitle?: string;
  highlightSummary?: string;
}

const CAT_COLORS = [
  "article-cat-1",
  "article-cat-2",
  "article-cat-3",
  "article-cat-4",
];

export function ArticleCard({ article, highlightTitle, highlightSummary }: ArticleCardProps) {

  return (
    <article className="article-card">
      <div className="article-thumb">
        <Link href={article.url} className="article-thumb-link">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} loading="lazy" decoding="async" className="object-cover" />
          ) : (
            <span className="article-thumb-placeholder cover-placeholder" aria-label="暂无封面">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
              </svg>
            </span>
          )}
        </Link>
      </div>

      <div className="article-content">
        <div className="article-categories">
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
            <span className={`article-cat-pill ${CAT_COLORS[0]}`}>
              未分类
            </span>
          )}
        </div>

        <h4 className="article-title">
          <Link href={article.url}>
            {highlightTitle ? <span dangerouslySetInnerHTML={{ __html: highlightTitle }} /> : article.title}
          </Link>
        </h4>

        <div className="article-meta">
          <span className="article-meta-author">
            <span className="article-avatar">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={article.authorName} width={40} height={40} loading="lazy" decoding="async" className="rounded-full" />
              ) : (
                <span className="article-avatar-placeholder">
                  {article.authorName.charAt(0)}
                </span>
              )}
            </span>
            <span>
              By <a href={`/?author=${article.authorName}`} className="article-author-link">{article.authorName}</a>
            </span>
          </span>
          <span className="article-meta-date">
            <span className="article-meta-divider" />
            <svg className="article-meta-icon" viewBox="0 0 29.36 29.36" aria-hidden="true">
              <path d="M14.68 0a14.68 14.68 0 1014.68 14.68A14.64 14.64 0 0014.68 0zm0 26.69a12 12 0 1112-12 12 12 0 01-12 12zm5.87-10.54L16 13.88V6.67a1.25 1.25 0 00-1.33-1.33 1.26 1.26 0 00-1.34 1.33v8a1.28 1.28 0 00.81 1.2l5.33 2.67c.14.13.27.13.54.13a1.28 1.28 0 001.2-.8 1.41 1.41 0 00-.67-1.73z" />
            </svg>
            <ArchiveDateLinks publishTime={article.publishTime} />
          </span>
        </div>

        {article.summary && (
          <p className="article-summary">
            {highlightSummary ? <span dangerouslySetInnerHTML={{ __html: highlightSummary }} /> : article.summary}
          </p>
        )}

        <div className="article-footer">
          <Link href={article.url} className="article-read-more">
            阅读更多
          </Link>
        </div>
      </div>
    </article>
  );
}

interface QuoteCardProps {
  article: Article;
  highlightTitle?: string;
}

export function QuoteCard({ article, highlightTitle }: QuoteCardProps) {
  return (
    <article className="article-card-quote">
      <div
        className="quote-post-bg"
        style={
          article.coverImage
            ? { backgroundImage: `url('${sanitizeCssUrl(article.coverImage)}')` }
            : undefined
        }
      />
      <div className="quote-post-bg-overlay" />

      <Link href={article.url} className="quote-inner">
        <svg
          width="40"
          height="40"
          viewBox="0 0 123.961 123.961"
          fill="currentColor"
          className="quote-icon"
          aria-hidden="true"
        >
          <path d="M49.8 29.032c3.1-1.3 4.4-5 3-8l-4.9-10.3c-1.4-2.899-4.8-4.2-7.8-2.899-8.5 3.6-15.8 8.3-21.6 14C11.4 28.532 6.6 36.232 4 44.732c-2.6 8.601-4 20.3-4 35.2v30.7c0 3.3 2.7 6 6 6h39.3c3.3 0 6-2.7 6-6v-39.3c0-3.301-2.7-6-6-6H26.5c.2-10.101 2.6-18.2 7-24.301 3.6-4.898 9-8.898 16.3-11.999zM120.4 29.032c3.1-1.3 4.399-5 3-8l-4.9-10.199c-1.4-2.9-4.8-4.2-7.8-2.9-8.4 3.6-15.601 8.3-21.5 13.9-7.101 6.8-12 14.5-14.601 23-2.6 8.399-3.899 20.1-3.899 35.1v30.7c0 3.3 2.7 6 6 6H116c3.3 0 6-2.7 6-6v-39.3c0-3.301-2.7-6-6-6H97.1c.2-10.101 2.601-18.2 7-24.301 3.6-4.899 9-8.899 16.3-12z" />
        </svg>
        <p className="quote-text">
          {highlightTitle ? <span dangerouslySetInnerHTML={{ __html: highlightTitle }} /> : article.title}
        </p>
        <span className="quote-author">
          —— {article.authorName}
        </span>
      </Link>
    </article>
  );
}
