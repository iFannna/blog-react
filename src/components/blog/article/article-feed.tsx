import { ArticleCard, QuoteCard } from "@/components/blog/article/article-card";
import Pagination from "@/components/blog/common/pagination";
import type { Article } from "@/types/models";

interface ArticleFeedProps {
  locale: string;
  articles: Article[];
  totalPages: number;
  currentPage: number;
  basePath?: string;
  highlightFields?: Record<number, { title?: string; summary?: string }>;
}

export default function ArticleFeed({ locale, articles, totalPages, currentPage, basePath, highlightFields }: ArticleFeedProps) {
  return (
    <div className="article-feed">
      <div className="article-feed">
        {articles.map((article) =>
          article.type === 2 ? (
            <QuoteCard key={article.id} locale={locale} article={article} highlightTitle={highlightFields?.[article.id]?.title} />
          ) : (
            <ArticleCard
              key={article.id}
              locale={locale}
              article={article}
              highlightTitle={highlightFields?.[article.id]?.title}
              highlightSummary={highlightFields?.[article.id]?.summary}
            />
          )
        )}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath ?? `/${locale}`} />
      )}
    </div>
  );
}
