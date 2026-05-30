import Link from "next/link";
import {
  mockArticles,
  mockCategories,
  mockTags,
} from "@/lib/mock-data";

export default function Sidebar() {
  const popularArticles = mockArticles.slice(0, 4);

  return (
    <aside className="flex w-[280px] flex-shrink-0">
      <div className="space-y-[2rem]">
        {/* Developer Profile */}
        <div className="rounded-normal border border-border-faint bg-bg p-[2rem]">
          <div className="flex flex-col items-center text-center">
            <div className="mb-[1.2rem] h-[7rem] w-[7rem] overflow-hidden rounded-full bg-bg-muted">
              <div className="flex h-full w-full items-center justify-center text-[2.4rem] text-text-light">
                S
              </div>
            </div>
            <p className="text-[1.6rem] text-text">
              <strong className="font-semibold">SAu</strong>
              <br />
              <span className="text-text-muted">全栈开发</span>
            </p>
            <p className="mt-[0.8rem] text-[1.4rem] leading-relaxed text-text-light">
              热爱编程，专注于现代 Web 技术开发。
            </p>
            <div className="mt-[1.2rem] flex flex-wrap justify-center gap-[0.4rem]">
              {["Node", "React", "Java", "MySQL", "Redis", "Git", "Nginx"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="icon-container inline-block rounded-md bg-bg-muted px-[0.8rem] py-[0.4rem] text-[1.2rem] text-text-muted transition-transform hover:scale-110"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Hot Articles */}
        <div className="rounded-normal border border-border-faint bg-bg p-[2rem]">
          <h4 className="widget-title mb-[1.6rem] text-[1.4rem] font-bold text-text">
            热门文章
          </h4>
          <ul>
            {popularArticles.map((article, index) => (
              <li key={article.id}>
                {index > 0 && <div className="my-[1.5rem] border-b border-border-faint" />}
                <Link
                  href={article.url}
                  className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-[2rem] text-[1.4rem] transition-[var(--transition-primary)] hover:text-primary"
                >
                  {/* Thumbnail */}
                  <div className="flex h-[7.5rem] w-[7.5rem] items-center justify-center overflow-hidden rounded-lg bg-[#f3eee8] text-[#a08a78]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium leading-snug text-text">
                      {article.title}
                    </p>
                    <p className="mt-[0.4rem] text-[1.2rem] text-text-light">
                      By {article.authorName}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Search */}
        <div className="rounded-normal border border-border-faint bg-bg p-[2rem]">
          <form className="flex gap-[0.8rem]">
            <input
              type="search"
              placeholder="搜索..."
              className="flex-1 rounded-normal border border-border bg-bg-muted px-[1.2rem] py-[0.8rem] text-[1.4rem] text-text placeholder:text-text-placeholder transition-[var(--transition-primary)] focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-normal bg-primary px-[1rem] py-[0.8rem] text-white shadow-btn transition-[var(--transition-primary)] hover:-translate-y-px"
              aria-label="搜索"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="rounded-normal border border-border-faint bg-bg p-[2rem]">
          <h4 className="widget-title mb-[1rem] text-[1.4rem] font-bold text-text">
            分类
          </h4>
          <ul className="space-y-[0.8rem]">
            {mockCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.name}`}
                  className="flex justify-between text-[1.4rem] text-text-muted transition-[var(--transition-primary)] hover:text-primary"
                >
                  <span>{cat.name}</span>
                  <span className="text-text-light">({cat.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="rounded-normal border border-border-faint bg-bg p-[2rem]">
          <h4 className="widget-title mb-[1rem] text-[1.4rem] font-bold text-text">
            标签
          </h4>
          <div className="flex flex-wrap gap-[0.6rem]">
            {mockTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.name}`}
                className="rounded-full bg-bg-muted px-[1rem] py-[0.4rem] text-[1.2rem] text-text-muted transition-[var(--transition-primary)] hover:bg-primary hover:text-white"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
