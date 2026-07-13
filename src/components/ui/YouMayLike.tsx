"use client";

import Link from "next/link";
import type { Article } from "@/types/ui";
import { articleHref } from "@/lib/utils";
import { ArchiveDateLinks } from "./ArchiveDateLinks";

/* 4-color cycle for category pills */
const CAT_COLORS = [
  "article-cat-1",
  "article-cat-2",
  "article-cat-3",
  "article-cat-4",
];

interface YouMayLikeProps {
  articles: Article[];
}

export default function YouMayLike({ articles }: YouMayLikeProps) {
  if (articles.length === 0) return null;

  return (
    <div id="you-may-like">
      <div className="pyml-slider-container">
        <div className="pyml-slider-items">
          <h4 className="pyml-title">
            <span>你可能会喜欢</span>
          </h4>
          <div className="pyml-grid">
          {articles.map((article) => {
            return (
              <div key={article.id} className="pyml-slide-item">
                <div className="pyml-slider-backgrounds">
                  <Link href={articleHref(article)}>
                    <div className="pyml-slide-bg">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="object-cover"
                        />
                      ) : (
                        <span className="pyml-placeholder cover-placeholder" aria-label="暂无封面">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v10A2.25 2.25 0 0 1 19 19.25H5A2.25 2.25 0 0 1 2.75 17V7A2.25 2.25 0 0 1 5 4.75Zm0 1.5A.75.75 0 0 0 4.25 7v10c0 .41.34.75.75.75h14a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75H5Zm2.5 2a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm10.25 8.93V17H6.19l3.04-3.28a.75.75 0 0 1 1.08-.03l1.58 1.58 2.78-3.31a.75.75 0 0 1 1.11-.04l1.97 2.13v2.13Z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </Link>
                  {article.categories.length > 0 && (
                    <div className="pyml-category">
                      <span>
                        {article.categories.map((cat, i) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.name}`}
                            className={`article-cat-pill ${CAT_COLORS[i % CAT_COLORS.length]}`}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="slide-inner">
                  <h6>
                    <Link href={articleHref(article)}>{article.title}</Link>
                  </h6>
                  <div className="entry-meta">
                    <div className="entry-meta-elements">
                      <span>
                        <span className="posted-by">
                          {article.authorAvatar && (
                            <span className="author-avatar">
                              <img
                                src={article.authorAvatar}
                                alt={article.authorName}
                                width={30}
                                height={30}
                                loading="lazy"
                                decoding="async"
                                className="rounded-full"
                              />
                            </span>
                          )}
                          <span>
                            By{" "}
                            <a href={`/?author=${article.authorName}`} className="article-author-link">{article.authorName}</a>
                          </span>
                        </span>
                      </span>
                      <span>
                        <ArchiveDateLinks year={article.year} month={article.month} day={article.day} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
