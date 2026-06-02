import apiClient from "./client";
import type { ArticleVO, PaginatedData } from "@/types/api";
import type { Article } from "@/types/ui";

function mapSearchHitToArticle(vo: ArticleVO): Article {
  return {
    id: vo.id,
    type: vo.type as 1 | 2,
    title: vo.title,
    summary: vo.summary,
    coverImage: vo.cover_image,
    authorName: vo.author_name,
    authorAvatar: vo.author_avatar,
    categories: (vo.categories || []).map((c) => ({ id: c.id, name: c.name })),
    tags: (vo.tags || []).map((t) => ({ id: t.id, name: t.name })),
    viewCount: vo.view_count,
    likeCount: vo.like_count,
    commentCount: vo.comment_count,
    publishTime: vo.created_at,
    url: vo.url,
  };
}

interface SearchParams {
  q: string;
  page?: number;
  size?: number;
}

/** 全文搜索文章，返回值与 getArticles 一致 */
export async function searchArticles(params: SearchParams) {
  const { q, page = 1, size = 10 } = params;
  const data = await apiClient.get<unknown, PaginatedData<ArticleVO>>("/search", {
    params: { q, page, size },
  });
  return { list: data.list.map(mapSearchHitToArticle), total: data.total };
}
