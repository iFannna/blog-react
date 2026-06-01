import { ArticleCard, QuoteCard } from "@/components/ui/ArticleCard";
import Pagination from "@/components/ui/Pagination";
import ExploreSection from "@/components/ui/ExploreSection";
import { mockExploreLinks } from "@/lib/mock-data";
import type { Article } from "@/types/ui";

interface ArticleFeedProps {
  articles: Article[];
  totalPages: number;
  currentPage: number;
}

export default function ArticleFeed({ articles, totalPages, currentPage }: ArticleFeedProps) {
  const hasArticles = articles.length > 0;
  const isSparse = hasArticles && articles.length < 3;

  return (
    <div className="space-y-6">
      {hasArticles && (
        <div className="space-y-6">
          {articles.map((article) =>
            article.type === 2 ? (
              <QuoteCard key={article.id} article={article} />
            ) : (
              <ArticleCard key={article.id} article={article} />
            )
          )}
        </div>
      )}

      {isSparse && <ExploreSection links={mockExploreLinks} variant="sparse" />}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
