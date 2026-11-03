import "server-only";

import { cache } from "react";
import apiClient from "@/services/http";
import { getArticleById } from "@/services/article";
import type { ArticleVO } from "@/types/api";
import type { ArticleDetail } from "@/types/models";

/** 前台动态区块使用的术语记录 */
export interface RenderTerm {
  id: number;
  name: string;
  count: number;
}

/** 前台动态区块使用的归档记录 */
export interface RenderArchiveItem {
  year: number;
  month?: number;
  day?: number;
  count: number;
}

/** 前台最新文章区块使用的文章记录 */
export interface RenderLatestPost {
  id: number;
  title: string;
  summary: string;
  coverImage: string;
  year: number;
  month: number;
  day: number;
  publishAt: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  authorDescription: string;
  commentCount: number;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  content?: string;
  contentFormat?: string;
}

/** 前台最新评论区块使用的评论记录 */
export interface RenderLatestComment {
  id: number;
  articleId: number;
  articleTitle: string;
  year: number;
  month: number;
  day: number;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

/** 前台作者列表记录 */
export interface RenderAuthor {
  id: number;
  name: string;
  avatar: string;
  count: number;
}

export interface RenderLatestPostsOptions {
  perPage: number;
  categoryIds: number[];
  authorId?: number;
  orderBy?: string;
  order?: string;
  fullPost?: boolean;
}

export interface RenderQueryPostsOptions {
  page: number;
  perPage: number;
  offset: number;
  orderBy: string;
  order: string;
  categoryIds: number[];
  excludeCategoryIds: number[];
  tagIds: number[];
  excludeTagIds: number[];
  authorIds: number[];
  excludeIds: number[];
  search: string;
  fullPost: boolean;
}

export interface RenderQueryPostsResult {
  posts: RenderLatestPost[];
  total: number;
}

function normalizeTerms(items: RenderTerm[] | null | undefined): RenderTerm[] {
  return (items ?? []).map((item) => ({
    id: Number(item.id),
    name: String(item.name ?? ""),
    count: Number(item.count ?? 0),
  }));
}

/** 分类列表，包含已发布公开文章数 */
export const getRenderCategories = cache(async (): Promise<RenderTerm[]> => {
  const data = await apiClient.get<unknown, RenderTerm[]>("/category");
  return normalizeTerms(data);
});

/** 标签列表，包含已发布公开文章数 */
export const getRenderTags = cache(async (): Promise<RenderTerm[]> => {
  const data = await apiClient.get<unknown, RenderTerm[]>("/tag");
  return normalizeTerms(data);
});

/** 归档计数，按年/月/日聚合 */
export const getRenderArchives = cache(
  async (type: "yearly" | "monthly" | "daily"): Promise<RenderArchiveItem[]> => {
    const data = await apiClient.get<unknown, RenderArchiveItem[]>(
      "/article/archives",
      { params: { type } },
    );
    return (data ?? []).map((item) => ({
      year: Number(item.year),
      month: item.month ? Number(item.month) : undefined,
      day: item.day ? Number(item.day) : undefined,
      count: Number(item.count ?? 0),
    }));
  },
);

/** 有已发布公开文章的作者 */
export const getRenderAuthors = cache(async (): Promise<RenderAuthor[]> => {
  const data = await apiClient.get<unknown, RenderAuthor[]>("/article/authors");
  return (data ?? []).map((item) => ({
    id: Number(item.id),
    name: String(item.name ?? ""),
    avatar: String(item.avatar ?? ""),
    count: Number(item.count ?? 0),
  }));
});

/** 全站最新评论 */
export const getRenderLatestComments = cache(
  async (size: number): Promise<RenderLatestComment[]> => {
    const limit = Math.min(Math.max(size, 1), 100);
    const data = await apiClient.get<
      unknown,
      { list: Array<Record<string, unknown>>; total: number }
    >("/comment/latest", { params: { page: 1, size: limit } });
    return (data.list ?? []).map((item) => ({
      id: Number(item.id),
      articleId: Number(item.article_id),
      articleTitle: String(item.article_title ?? ""),
      year: Number(item.year ?? 0),
      month: Number(item.month ?? 0),
      day: Number(item.day ?? 0),
      content: String(item.content ?? ""),
      authorName: String(item.author_name ?? ""),
      authorAvatar: String(item.author_avatar ?? ""),
      createdAt: String(item.created_at ?? ""),
    }));
  },
);

/** 单篇文章详情，正文用于最新文章区块的全文预览 */
export const getRenderArticleDetail = cache(
  async (id: number, year: number, month: number, day: number): Promise<ArticleDetail | null> => {
    try {
      return await getArticleById(id, year, month, day);
    } catch {
      return null;
    }
  },
);

interface FetchPostsOptions extends RenderQueryPostsOptions {
  authorId?: number;
}

const renderPostsCache = cache(
  async (key: string): Promise<RenderQueryPostsResult> => {
    const options = JSON.parse(key) as FetchPostsOptions;
    const size = Math.min(Math.max(Number(options.perPage) || 5, 1), 100);
    const page = Math.max(Number(options.page) || 1, 1);
    const offset = Math.max(Number(options.offset) || 0, 0);
    const params: Record<string, unknown> = {
      page,
      size,
      order_by: options.orderBy === "title" ? "title" : "publish_at",
      order: options.order === "asc" ? "asc" : "desc",
    };
    if (offset > 0) {
      params.offset = offset;
    }
    if (options.categoryIds.length > 0) {
      params.category_ids = options.categoryIds.join(",");
    }
    if (options.excludeCategoryIds.length > 0) {
      params.exclude_category_ids = options.excludeCategoryIds.join(",");
    }
    if (options.tagIds.length > 0) {
      params.tag_ids = options.tagIds.join(",");
    }
    if (options.excludeTagIds.length > 0) {
      params.exclude_tag_ids = options.excludeTagIds.join(",");
    }
    if (options.authorIds.length > 0) {
      params.author_ids = options.authorIds.join(",");
    } else if (options.authorId) {
      params.author_id = options.authorId;
    }
    if (options.excludeIds.length > 0) {
      params.exclude_ids = options.excludeIds.join(",");
    }
    if (options.search) {
      params.keyword = options.search;
    }

    const data = await apiClient.get<
      unknown,
      { list: ArticleVO[]; total: number }
    >("/article", { params });
    const list = data.list ?? [];

    const details = new Map<number, ArticleDetail>();
    if (options.fullPost) {
      // 列表接口不带正文，按每批 5 篇读取详情，避免一次打满后端
      for (let index = 0; index < list.length; index += 5) {
        const slice = list.slice(index, index + 5);
        const results = await Promise.all(
          slice.map((article) =>
            getRenderArticleDetail(
              article.id,
              article.year,
              article.month,
              article.day,
            ),
          ),
        );
        results.forEach((detail) => {
          if (detail) {
            details.set(detail.id, detail);
          }
        });
      }
    }

    const posts = list.map((article) => {
      const detail = details.get(article.id);
      return {
        id: article.id,
        title: article.title,
        summary: article.summary ?? "",
        coverImage: article.cover_image ?? "",
        year: article.year,
        month: article.month,
        day: article.day,
        publishAt: article.publish_at || article.created_at,
        authorId: article.author_id,
        authorName: detail?.authorName ?? article.author_name ?? "",
        authorAvatar: detail?.authorAvatar ?? article.author_avatar ?? "",
        authorDescription: detail?.authorDescription ?? "",
        commentCount: detail?.commentCount ?? article.comment_count ?? 0,
        categories:
          detail?.categories ?? article.categories?.map((item) => ({ id: item.id, name: item.name })) ?? [],
        tags:
          detail?.tags ?? article.tags?.map((item) => ({ id: item.id, name: item.name })) ?? [],
        content: detail?.content,
        contentFormat: detail?.contentFormat,
      };
    });

    return { posts, total: Number(data.total ?? 0) };
  },
);

/** 最新文章，按区块查询条件缓存；同一请求内相同条件只请求一次 */
export async function getRenderLatestPosts(
  options: RenderLatestPostsOptions,
): Promise<RenderLatestPost[]> {
  const result = await renderPostsCache(
    JSON.stringify({
      page: 1,
      perPage: options.perPage,
      offset: 0,
      orderBy: options.orderBy ?? "publish_at",
      order: options.order ?? "desc",
      categoryIds: options.categoryIds,
      excludeCategoryIds: [],
      tagIds: [],
      excludeTagIds: [],
      authorIds: [],
      authorId: options.authorId,
      excludeIds: [],
      search: "",
      fullPost: Boolean(options.fullPost),
    } satisfies FetchPostsOptions),
  );
  return result.posts;
}

/** 查询循环取数，返回当前页文章与命中总数 */
export function getRenderQueryPosts(
  options: RenderQueryPostsOptions,
): Promise<RenderQueryPostsResult> {
  return renderPostsCache(JSON.stringify(options));
}
