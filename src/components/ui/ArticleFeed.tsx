"use client";

import { useState } from "react";
import { ArticleCard, QuoteCard } from "@/components/ui/ArticleCard";
import Pagination from "@/components/ui/Pagination";
import ExploreSection from "@/components/ui/ExploreSection";
import { mockArticles, mockExploreLinks } from "@/lib/mock-data";

const PAGE_SIZE = 10;

export default function ArticleFeed() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockArticles.length / PAGE_SIZE);
  const hasArticles = mockArticles.length > 0;
  const isSparse = hasArticles && mockArticles.length < 3;

  const pagedArticles = mockArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      {hasArticles && (
        <div className="space-y-6">
          {pagedArticles.map((article) =>
            article.type === 2 ? (
              <QuoteCard key={article.id} article={article} />
            ) : (
              <ArticleCard key={article.id} article={article} />
            )
          )}
        </div>
      )}

      {isSparse && (
        <ExploreSection links={mockExploreLinks} variant="sparse" />
      )}

      {!hasArticles && (
        <ExploreSection links={mockExploreLinks} variant="empty" />
      )}

      {mockArticles.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
