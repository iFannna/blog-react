import apiClient from "@/services/http";
import type { ArticleVO, PaginatedData } from "@/types/api";
import type { Article } from "@/types/models";
import { mapArticleVOToArticle } from "@/services/article";

interface SearchParams {
  q: string;
  page?: number;
  size?: number;
}

interface SearchArticleVO extends ArticleVO {
  highlight_title?: string;
  highlight_summary?: string;
}

interface SearchArticle extends Article {
  highlightTitle?: string;
  highlightSummary?: string;
}

/** 全文搜索文章，返回值包含 highlight 信息 */
export async function searchArticles(params: SearchParams) {
  const { q, page = 1, size = 10 } = params;
  const data = await apiClient.get<unknown, PaginatedData<SearchArticleVO>>("/search", {
    params: { q, page, size },
  });
  const list: SearchArticle[] = data.list.map((vo) => ({
    ...mapArticleVOToArticle(vo),
    highlightTitle: vo.highlight_title,
    highlightSummary: vo.highlight_summary,
  }));
  return { list, total: data.total };
}
