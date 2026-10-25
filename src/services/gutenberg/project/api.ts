import apiClient from "@/services/http";
import type {
  ArticleVersion,
  CreateArticleInput,
  ProjectArticle,
  ProjectEditorSource,
  ProjectMedia,
  ProjectMediaSource,
  PublishArticleInput,
  SaveArticleInput,
  UpdateMediaInput,
} from "./types";

interface IDResult {
  id: number;
}

function toCreatePayload(input: CreateArticleInput) {
  return {
    title: input.title,
    summary: input.summary,
    content: input.content,
    content_format: input.contentFormat,
    cover_image: input.coverImage,
    featured_media_id: input.featuredMediaId ?? 0,
    category_ids: input.categoryIds,
    tag_ids: input.tagIds,
    status: input.status,
  };
}

function toSavePayload(input: SaveArticleInput) {
  return {
    id: input.id,
    title: input.title,
    summary: input.summary,
    content: input.content,
    content_format: input.contentFormat,
    cover_image: input.coverImage,
    featured_media_id: input.featuredMediaId ?? 0,
    category_ids: input.categoryIds,
    tag_ids: input.tagIds,
  };
}

function toPublishPayload(input: PublishArticleInput) {
  return {
    title: input.title,
    summary: input.summary,
    content: input.content,
    content_format: input.contentFormat,
    cover_image: input.coverImage,
    featured_media_id: input.featuredMediaId ?? 0,
    category_ids: input.categoryIds,
    tag_ids: input.tagIds,
  };
}

function toMediaPayload(input: UpdateMediaInput) {
  return {
    title: input.title,
    alt_text: input.altText,
    caption: input.caption,
    description: input.description,
  };
}

export function createGoProjectEditorSource(): ProjectEditorSource {
  return {
    getArticle(id) {
      return apiClient.get<unknown, ProjectArticle>(`/admin/article/${id}`);
    },
    async createArticle(input) {
      const data = await apiClient.post<unknown, IDResult>(
        "/admin/article",
        toCreatePayload(input),
      );
      return data.id;
    },
    async saveArticle(input) {
      await apiClient.put("/admin/article", toSavePayload(input));
    },
    async publishArticle(id, input) {
      await apiClient.post(`/admin/article/${id}/publish`, toPublishPayload(input));
    },
    async unpublishArticle(id) {
      await apiClient.post(`/admin/article/${id}/unpublish`);
    },
    async trashArticle(id) {
      await apiClient.post(`/admin/article/${id}/trash`);
    },
    async deleteArticle(id) {
      await apiClient.delete(`/admin/article/${id}`);
    },
    async listVersions(id, page = 1, size = 20) {
      return apiClient.get<unknown, { list: ArticleVersion[]; total: number }>(
        `/admin/article/${id}/versions`,
        { params: { page, size } },
      );
    },
    async restoreVersion(id, versionId) {
      await apiClient.post(`/admin/article/${id}/versions/${versionId}/restore`);
    },
  };
}

export function createGoProjectMediaSource(): ProjectMediaSource {
  return {
    list(page, size, keyword) {
      return apiClient.get<unknown, { list: ProjectMedia[]; total: number }>(
        "/admin/media",
        { params: { page, size, keyword } },
      );
    },
    get(id) {
      return apiClient.get<unknown, ProjectMedia>(`/admin/media/${id}`);
    },
    async upload(file) {
      const form = new FormData();
      form.append("file", file);
      return apiClient.post<unknown, ProjectMedia>("/admin/media", form, {
        timeout: 60_000,
      });
    },
    update(id, input) {
      return apiClient.put<unknown, ProjectMedia>(
        `/admin/media/${id}`,
        toMediaPayload(input),
      );
    },
    async delete(id) {
      await apiClient.delete(`/admin/media/${id}`);
    },
  };
}

export const goProjectEditorSource = createGoProjectEditorSource();
export const goProjectMediaSource = createGoProjectMediaSource();
