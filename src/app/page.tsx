"use client";

import { useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import { ArticleCard, QuoteCard } from "@/components/ui/ArticleCard";
import Pagination from "@/components/ui/Pagination";
import ExploreSection from "@/components/ui/ExploreSection";
import {
  mockArticles,
  mockExploreLinks,
} from "@/lib/mock-data";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockArticles.length / PAGE_SIZE);
  const hasArticles = mockArticles.length > 0;
  const isSparse =
    hasArticles && mockArticles.length < 3 && mockArticles.length <= PAGE_SIZE;

  return (
    <SiteLayout showSidebar sidebar={<Sidebar />}>
      <div className="space-y-6">
        {/* Article Feed */}
        {hasArticles && (
          <div className="space-y-6">
            {mockArticles.map((article) =>
              article.type === 2 ? (
                <QuoteCard key={article.id} article={article} />
              ) : (
                <ArticleCard key={article.id} article={article} />
              )
            )}
          </div>
        )}

        {/* Sparse feed explore */}
        {isSparse && (
          <ExploreSection links={mockExploreLinks} variant="sparse" />
        )}

        {/* Empty state */}
        {!hasArticles && (
          <ExploreSection links={mockExploreLinks} variant="empty" />
        )}

        {/* Pagination */}
        {mockArticles.length > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </SiteLayout>
  );
}
