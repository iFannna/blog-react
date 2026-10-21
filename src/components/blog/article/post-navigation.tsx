import Link from "next/link";
import type { PrevNext } from "@/types/models";
import { articleHref } from "@/utils/article";
import { localePath } from "@/lib/locale";

export default function PostNav({ locale, prevNext }: { locale: string; prevNext: PrevNext }) {
  const { prev, next } = prevNext;
  if (!prev && !next) return null;

  return (
    <nav className="post-nav" role="navigation" aria-label="文章导航">
      <h2 className="screen-reader-text">文章导航</h2>
      {prev && (
        <div className="nav-previous">
          <h6 className="nav-title">Previous Post</h6>
          <Link href={localePath(locale, articleHref(prev))} rel="prev">
            <div className="nav-content">
              {prev.coverImage && (
                <img
                  src={prev.coverImage}
                  alt={prev.title}
                  loading="lazy"
                />
              )}
              <span>{prev.title}</span>
            </div>
          </Link>
        </div>
      )}
      {next && (
        <div className="nav-next">
          <h6 className="nav-title">Next Post</h6>
          <Link href={localePath(locale, articleHref(next))} rel="next">
            <div className="nav-content">
              <span>{next.title}</span>
              {next.coverImage && (
                <img
                  src={next.coverImage}
                  alt={next.title}
                  loading="lazy"
                />
              )}
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
