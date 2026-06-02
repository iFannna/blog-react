import { ArticleCard, QuoteCard } from "@/components/ui/ArticleCard";
import Pagination from "@/components/ui/Pagination";
import type { Article } from "@/types/ui";

interface ArticleFeedProps {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  basePath?: string;
}

export default function ArticleFeed({ articles, totalPages, currentPage, basePath }: ArticleFeedProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {articles.map((article) =>
          article.type === 2 ? (
            <QuoteCard key={article.id} article={article} />
          ) : (
            <ArticleCard key={article.id} article={article} />
          )
        )}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      )}
    </div>
  );
}
