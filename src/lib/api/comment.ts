import apiClient from "./client";
import type { CommentVO, ReplyVO, PaginatedData } from "@/types/api";

interface GetCommentsParams {
  articleId: number;
  page?: number;
  size?: number;
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
