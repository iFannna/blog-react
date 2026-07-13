import apiClient from "./client";
import type { ArticleVO, PaginatedData, ApiPrevNext } from "@/types/api";
import type { Article, ArticleDetail, PrevNext } from "@/types/ui";

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
    year: vo.year,
    month: vo.month,
    day: vo.day,
  };
}

interface GetArticlesParams {
  page?: number;
  size?: number;
  categoryId?: number;
  tagId?: number;
  authorName?: string;
  year?: number;
  month?: number;
  day?: number;
}

/** 获取已发布文章的分页列表，支持按分类/标签/作者/时间筛选 */
export async function getArticles(params: GetArticlesParams = {}) {
  const { page = 1, size = 10, categoryId, tagId, authorName, year, month, day } = params;
  const data = await apiClient.get<unknown, PaginatedData<ArticleVO>>("/article", {
    params: { page, size, category_id: categoryId, tag_id: tagId, author_name: authorName, year, month, day },
  });
  return { list: data.list.map(mapArticleVOToArticle), total: data.total };
}

function mapArticleDetailVO(vo: ArticleVO): ArticleDetail {
  return {
    ...mapArticleVOToArticle(vo),
    content: vo.content,
    starCount: vo.star_count,
    shareCount: vo.share_count,
    commentCount: vo.comment_count,
    commentStatus: vo.comment_status,
  };
}

/** 根据 ID + 发布日期获取文章详情（含正文），日期用于校验 created_at 契合 */
export async function getArticleById(id: number, year: number, month: number, day: number) {
  const data = await apiClient.get<unknown, ArticleVO>(`/article/${id}`, {
    params: { year, month, day },
  });
  return mapArticleDetailVO(data);
}

/** 根据文章 ID 获取上下篇文章导航 */
export async function getArticlePrevNext(id: number): Promise<PrevNext> {
  const data = await apiClient.get<unknown, ApiPrevNext>(`/article/${id}/prev-next`);
  return {
    prev: data.prev ? { id: data.prev.id, title: data.prev.title, year: data.prev.year, month: data.prev.month, day: data.prev.day, coverImage: data.prev.cover_image } : null,
    next: data.next ? { id: data.next.id, title: data.next.title, year: data.next.year, month: data.next.month, day: data.next.day, coverImage: data.next.cover_image } : null,
  };
}
