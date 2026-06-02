import apiClient from "./client";
import type { ArticleVO, PaginatedData } from "@/types/api";
import type { Article } from "@/types/ui";

function mapArticleVOToArticle(vo: ArticleVO): Article {
  return {
    id: vo.id,
    type: vo.type as 1 | 2,
    title: vo.title,
    summary: vo.summary,
    coverImage: vo.cover_image,
    authorName: vo.author_name,
    authorAvatar: vo.author_avatar,
    authorId: vo.author_id,
    categories: vo.categories.map((c) => ({ id: c.id, name: c.name })),
    tags: vo.tags.map((t) => ({ id: t.id, name: t.name })),
    viewCount: vo.view_count,
    likeCount: vo.like_count,
    commentCount: vo.comment_count,
    publishTime: vo.created_at,
    url: vo.url,
  };
}

interface GetArticlesParams {
  page?: number;
  size?: number;
  categoryId?: number;
  tagId?: number;
  authorId?: number;
  year?: number;
  month?: number;
  day?: number;
}

/** 获取已发布文章的分页列表，支持按分类/标签/作者/时间筛选 */
export async function getArticles(params: GetArticlesParams = {}) {
  const { page = 1, size = 10, categoryId, tagId, authorId, year, month, day } = params;
  const data = await apiClient.get<unknown, PaginatedData<ArticleVO>>("/article", {
    params: { page, size, category_id: categoryId, tag_id: tagId, author_id: authorId, year, month, day },
  });
  return { list: data.list.map(mapArticleVOToArticle), total: data.total };
}
