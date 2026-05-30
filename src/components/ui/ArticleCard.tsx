import Link from "next/link";
import type { Article } from "@/lib/mock-data";

interface ArticleCardProps {
  article: Article;
}

/* 4-color cycle for category pills */
const CAT_COLORS = [
  "bg-[#6178df]",
  "bg-[#48aab1]",
  "bg-[#a95edf]",
  "bg-primary",
];

export function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.publishTime);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <article className="mb-[5rem] flex flex-col items-stretch sm:flex-row sm:items-center">
      {/* Cover Image — 42% width, left side */}
      <div className="post-thumb entry-media mr-[3rem] w-full flex-shrink-0 overflow-hidden sm:w-[42%]">
        <Link href={article.url} className="relative block aspect-[4/3] w-full overflow-hidden">
          <div className="flex h-full w-full flex-col items-center justify-center gap-[1.4rem] bg-[#f3eee8] text-[#a08a78]">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
            </svg>
            <span className="text-[1.4rem] font-semibold tracking-wide">暂无封面</span>
          </div>
        </Link>
      </div>

      {/* Content — flex-1 */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* Categories — colored pills */}
        <div className="post-category mb-[0.8rem] flex flex-wrap text-[1.6rem] font-medium">
          {article.categories.length > 0 ? (
            article.categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/category/${cat.name}`}
                className={`ml-[0.4rem] inline-flex rounded-normal px-[1rem] py-[0.6rem] leading-none text-white first:ml-0 ${CAT_COLORS[i % CAT_COLORS.length]}`}
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <span className="inline-flex rounded-normal bg-primary px-[1rem] py-[0.6rem] text-white">
              未分类
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="entry-title text-[2rem] font-bold leading-tight text-text">
          <Link href={article.url} className="text-text transition-[var(--transition-primary)] hover:text-primary">
            {article.title}
          </Link>
        </h4>

        {/* Meta */}
        <div className="entry-meta mt-[2.4rem] flex items-center text-[1.4rem] text-text-muted">
          <span className="inline-flex items-center gap-[0.7rem] pl-0">
            <span className="inline-flex items-center gap-[0.5rem]">
              <span className="inline-block h-[3rem] w-[3rem] flex-shrink-0 overflow-hidden rounded-full bg-bg-muted">
                {article.authorAvatar ? (
                  <img src={article.authorAvatar} alt={article.authorName} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[1.2rem] text-text-light">
                    {article.authorName.charAt(0)}
                  </span>
                )}
              </span>
              <span>
                By <strong className="font-medium">{article.authorName}</strong>
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-[0.7rem] pl-[1.1rem]">
            {/* Divider */}
            <span className="mr-[-0.4rem] h-[1.6rem] w-[0.1rem] bg-black/25" />
            <svg width="18" height="18" viewBox="0 0 29.36 29.36" fill="currentColor" className="text-text-light" aria-hidden="true">
              <path d="M14.68 0a14.68 14.68 0 1014.68 14.68A14.64 14.64 0 0014.68 0zm0 26.69a12 12 0 1112-12 12 12 0 01-12 12zm5.87-10.54L16 13.88V6.67a1.25 1.25 0 00-1.33-1.33 1.26 1.26 0 00-1.34 1.33v8a1.28 1.28 0 00.81 1.2l5.33 2.67c.14.13.27.13.54.13a1.28 1.28 0 001.2-.8 1.41 1.41 0 00-.67-1.73z" />
            </svg>
            <Link href={`/archive/${year}`} className="text-text-muted transition-[var(--transition-fast)] hover:text-primary">
              {month}
            </Link>
            {" "}
            <Link href={`/archive/${year}/${date.getMonth() + 1}/${day}`} className="text-text-muted transition-[var(--transition-fast)] hover:text-primary">
              {day}
            </Link>
            ,{" "}
            <Link href={`/archive/${year}`} className="text-text-muted transition-[var(--transition-fast)] hover:text-primary">
              {year}
            </Link>
          </span>
        </div>

        {/* Summary — 2 line clamp */}
        {article.summary && (
          <p className="entry-summary mt-[1.6rem] line-clamp-2 text-[1.6rem] leading-relaxed text-text-muted">
            {article.summary}
          </p>
        )}

        {/* Read More button */}
        <div className="entry-footer mt-[1.6rem]">
          <Link
            href={article.url}
            className="inline-flex items-center justify-center rounded-btn bg-primary px-[2.4rem] py-[0.8rem] text-[1.4rem] font-semibold leading-[1.8] text-white shadow-btn transition-[var(--transition-primary)] hover:-translate-y-px hover:shadow-btn-hover"
          >
            阅读更多
          </Link>
        </div>
      </div>
    </article>
  );
}

interface QuoteCardProps {
  article: Article;
}

export function QuoteCard({ article }: QuoteCardProps) {
  return (
    <article className="mb-[5rem] relative overflow-hidden rounded-normal">
      {/* Background */}
      <div
        className="quote-post-bg absolute inset-0 bg-cover bg-center"
        style={
          article.coverImage
            ? { backgroundImage: `url('${article.coverImage}')` }
            : { backgroundColor: "var(--color-bg-muted)" }
        }
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />

      {/* Content */}
      <Link href={article.url} className="quote-inner relative block p-[3.2rem] text-white no-underline">
        <svg
          width="40"
          height="40"
          viewBox="0 0 123.961 123.961"
          fill="currentColor"
          className="mb-[1.6rem] opacity-50"
          aria-hidden="true"
        >
          <path d="M49.8 29.032c3.1-1.3 4.4-5 3-8l-4.9-10.3c-1.4-2.899-4.8-4.2-7.8-2.899-8.5 3.6-15.8 8.3-21.6 14C11.4 28.532 6.6 36.232 4 44.732c-2.6 8.601-4 20.3-4 35.2v30.7c0 3.3 2.7 6 6 6h39.3c3.3 0 6-2.7 6-6v-39.3c0-3.301-2.7-6-6-6H26.5c.2-10.101 2.6-18.2 7-24.301 3.6-4.898 9-8.898 16.3-11.999zM120.4 29.032c3.1-1.3 4.399-5 3-8l-4.9-10.199c-1.4-2.9-4.8-4.2-7.8-2.9-8.4 3.6-15.601 8.3-21.5 13.9-7.101 6.8-12 14.5-14.601 23-2.6 8.399-3.899 20.1-3.899 35.1v30.7c0 3.3 2.7 6 6 6H116c3.3 0 6-2.7 6-6v-39.3c0-3.301-2.7-6-6-6H97.1c.2-10.101 2.601-18.2 7-24.301 3.6-4.899 9-8.899 16.3-12z" />
        </svg>
        <p className="text-[2rem] leading-relaxed font-medium">
          {article.summary || article.title}
        </p>
        <span className="mt-[1.2rem] block text-[1.6rem] opacity-80">— {article.authorName}</span>
      </Link>
    </article>
  );
}
