import apiClient from "@/services/http";
import type {
  ApiCategory,
  ApiPrevNext,
  ApiTag,
  ArticleVO,
  CommentVO,
  PaginatedData,
  ReplyVO,
} from "@/types/api";
import type {
  Article,
  ArticleDetail,
  Category,
  PrevNext,
  Tag,
} from "@/types/models";

export interface GetArticlesParams {
  page?: number;
  size?: number;
  categoryId?: number;
  tagId?: number;
  authorName?: string;
  year?: number;
  month?: number;
  day?: number;
}

interface GetCommentsParams {
  articleId: number;
  page?: number;
  size?: number;
}

export function mapArticleVOToArticle(vo: ArticleVO): Article {
  return {
    id: vo.id,
    type: vo.type as 1 | 2,
    title: vo.title,
    summary: vo.summary,
    coverImage: vo.cover_image,
    authorName: vo.author_name,
    authorAvatar: vo.author_avatar,
    authorId: vo.author_id,
    categories: (vo.categories || []).map((item) => ({ id: item.id, name: item.name })),
    tags: (vo.tags || []).map((item) => ({ id: item.id, name: item.name })),
    viewCount: vo.view_count,
    likeCount: vo.like_count,
    commentCount: vo.comment_count,
    publishTime: vo.created_at,
    year: vo.year,
    month: vo.month,
    day: vo.day,
  };
}

function mapArticleVOToDetail(vo: ArticleVO): ArticleDetail {
  return {
    ...mapArticleVOToArticle(vo),
    content: vo.content,
    starCount: vo.star_count,
    shareCount: vo.share_count,
    commentCount: vo.comment_count,
    commentStatus: vo.comment_status,
  };
}

function mapApiPrevNext(data: ApiPrevNext): PrevNext {
  return {
    prev: data.prev
      ? {
          id: data.prev.id,
          title: data.prev.title,
          year: data.prev.year,
          month: data.prev.month,
          day: data.prev.day,
          coverImage: data.prev.cover_image,
        }
      : null,
    next: data.next
      ? {
          id: data.next.id,
          title: data.next.title,
          year: data.next.year,
          month: data.next.month,
          day: data.next.day,
          coverImage: data.next.cover_image,
        }
      : null,
  };
}

/** 获取已发布文章的分页列表，支持按分类、标签、作者和时间筛选 */
export async function getArticles(params: GetArticlesParams = {}) {
  const { page = 1, size = 10, categoryId, tagId, authorName, year, month, day } = params;
  const data = await apiClient.get<unknown, PaginatedData<ArticleVO>>("/article", {
    params: {
      page,
      size,
      category_id: categoryId,
      tag_id: tagId,
      author_name: authorName,
      year,
      month,
      day,
    },
  });
  return { list: data.list.map(mapArticleVOToArticle), total: data.total };
}

/** 根据 ID 和发布日期获取文章详情 */
export async function getArticleById(id: number, year: number, month: number, day: number) {
  const data = await apiClient.get<unknown, ArticleVO>(`/article/${id}`, {
    params: { year, month, day },
  });
  return mapArticleVOToDetail(data);
}

/** 根据文章 ID 获取上一篇和下一篇文章 */
export async function getArticlePrevNext(id: number): Promise<PrevNext> {
  const data = await apiClient.get<unknown, ApiPrevNext>(`/article/${id}/prev-next`);
  return mapApiPrevNext(data);
}

/** 获取文章的评论分页列表 */
export async function getComments(params: GetCommentsParams) {
  const { articleId, page = 1, size = 10 } = params;
  const data = await apiClient.get<unknown, PaginatedData<CommentVO>>("/comment", {
    params: { article_id: articleId, page, size },
  });
  return { list: data.list, total: data.total };
}

/** 获取评论的回复分页列表 */
export async function getCommentReplies(commentId: number, page = 1, size = 100) {
  const data = await apiClient.get<unknown, PaginatedData<ReplyVO>>("/comment/reply", {
    params: { comment_id: commentId, page, size },
  });
  return { list: data.list, total: data.total };
}

export type { Category, Tag };
export type { ApiCategory, ApiTag };
