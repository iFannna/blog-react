import apiClient from "./client";
import type { ArticleVO, PaginatedData } from "@/types/api";
import type { Article } from "@/types/ui";

function mapArticleVOToArticle(vo: ArticleVO): Article {
  return {
    id: vo.id,
    type: 1,
    title: vo.title,
    summary: vo.summary,
    coverImage: vo.cover_image,
    authorName: vo.author_name,
    authorAvatar: vo.author_avatar,
    categories: vo.categories.map((c) => ({ id: c.id, name: c.name })),
    tags: vo.tags.map((t) => ({ id: t.id, name: t.name })),
    viewCount: vo.view_count,
    likeCount: vo.like_count,
    commentCount: vo.comment_count,
    publishTime: vo.publish_at || vo.created_at,
    url: vo.url,
  };
}

/** 获取已发布文章的分页列表 */
export async function getArticles(page = 1, size = 10) {
  const data = await apiClient.get<unknown, PaginatedData<ArticleVO>>("/article", {
    params: { page, size },
  });
  return { list: data.list.map(mapArticleVOToArticle), total: data.total };
}
