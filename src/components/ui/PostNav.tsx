import Link from "next/link";
import type { PrevNext } from "@/types/ui";
import { articleHref } from "@/lib/utils";

export default function PostNav({ prevNext }: { prevNext: PrevNext }) {
  const { prev, next } = prevNext;
  if (!prev && !next) return null;

  return (
    <nav className="post-nav" role="navigation" aria-label="文章导航">
      <h2 className="screen-reader-text">文章导航</h2>
      {prev && (
        <div className="nav-previous">
          <h6 className="nav-title">Previous Post</h6>
          <Link href={articleHref(prev)} rel="prev">
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
          <Link href={articleHref(next)} rel="next">
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
