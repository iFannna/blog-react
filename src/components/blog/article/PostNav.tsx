import Link from "next/link";
import type { PrevNext } from "@/types/models";
import { articleHref } from "@/utils/article";
import { localePath } from "@/lib/locale";

export default function PostNav({ locale, prevNext }: { locale: string; prevNext: PrevNext }) {
  const { prev, next } = prevNext;
  // 接口的 prev 是更新的一篇、next 是更早的一篇；展示时按时间顺序还原
  const previous = next;
  const nextPost = prev;
  if (!previous && !nextPost) return null;

  return (
    <nav className="post-nav" role="navigation" aria-label="文章导航">
      <h2 className="screen-reader-text">文章导航</h2>
      {previous && (
        <div className="nav-previous">
          <h6 className="nav-title">Previous Post</h6>
          <Link href={localePath(locale, articleHref(previous))} rel="prev">
            <div className="nav-content">
              {previous.coverImage && (
                <img
                  src={previous.coverImage}
                  alt={previous.title}
                  loading="lazy"
                />
              )}
              <span>{previous.title}</span>
            </div>
          </Link>
        </div>
      )}
      {nextPost && (
        <div className="nav-next">
          <h6 className="nav-title">Next Post</h6>
          <Link href={localePath(locale, articleHref(nextPost))} rel="next">
            <div className="nav-content">
              <span>{nextPost.title}</span>
              {nextPost.coverImage && (
                <img
                  src={nextPost.coverImage}
                  alt={nextPost.title}
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
