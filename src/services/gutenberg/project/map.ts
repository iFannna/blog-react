import type { ContentFormat, ProjectArticle } from "./types";

export interface EditorPostProjectMeta {
  contentFormat: ContentFormat;
  statusCode: 0 | 1 | 2 | 3;
  visibility: 1 | 2;
  coverImage: string;
  articleType: number;
  commentStatus: number;
  commentCount: number;
  authorName: string;
  authorAvatar: string;
  trashed: boolean;
  realId: number | null;
}

export interface EditorPost {
  id: number;
  type: "post";
  status: "draft" | "publish" | "private" | "future" | "auto-draft" | "trash";
  title: { raw: string; rendered: string };
  content: {
    raw: string;
    rendered: string;
    protected: boolean;
    block_version: number;
  };
  excerpt: { raw: string; rendered: string; protected: boolean };
  format: "standard";
  comment_status: "open" | "closed";
  comment_count: number;
  ping_status: "closed";
  categories: number[];
  tags: number[];
  featured_media: number;
  author: number;
  date: string;
  modified: string;
  link: string;
  permalink_template: string;
  slug: string;
  meta: Record<string, never>;
  _links: Record<string, Array<{ href: string }>>;
  _project: EditorPostProjectMeta;
  [key: string]: unknown;
}

function articlePath(locale: string, article: ProjectArticle) {
  const month = String(article.month).padStart(2, "0");
  const day = String(article.day).padStart(2, "0");
  return `/${locale}/archive/${article.year}/${month}/${day}/${article.id}`;
}

function articleLink(locale: string, article: ProjectArticle) {
  if (article.status !== 1 || article.visibility !== 1) return "";
  return articlePath(locale, article);
}

function formatLocalDateTime(value: Date) {
  const pad = (part: number) => String(part).padStart(2, "0");
  return [
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`,
    `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`,
  ].join("T");
}

/** 将 Go 文章映射成编辑器内部使用的 post 记录 */
export function toEditorPost(
  article: ProjectArticle,
  locale: string,
): EditorPost {
  const links: Record<string, Array<{ href: string }>> = {
    "wp:action-publish": [{ href: "" }],
    "wp:action-assign-categories": [{ href: "" }],
    "wp:action-create-categories": [{ href: "" }],
    "wp:action-assign-tags": [{ href: "" }],
    "wp:action-create-tags": [{ href: "" }],
  };
  if (article.status !== 2) {
    links["wp:action-trash"] = [{ href: "" }];
  }
  return {
    id: article.id,
    type: "post",
    status:
      article.status === 1
        ? article.visibility === 2
          ? "private"
          : "publish"
        : article.status === 2
          ? "trash"
          : article.status === 3
            ? "future"
            : "draft",
    title: { raw: article.title, rendered: article.title },
    content: {
      raw: article.content,
      rendered: article.content,
      protected: false,
      block_version: 1,
    },
    excerpt: {
      raw: article.summary,
      rendered: article.summary,
      protected: false,
    },
    format: "standard",
    comment_status: article.comment_status === 1 ? "open" : "closed",
    comment_count: article.comment_count ?? 0,
    ping_status: "closed",
    categories: article.categories.map((item) => item.id),
    tags: article.tags.map((item) => item.id),
    featured_media: article.featured_media_id ?? 0,
    author: article.author_id,
    date: article.publish_at || article.created_at,
    modified: article.created_at,
    link: articleLink(locale, article),
    permalink_template: articlePath(locale, article),
    slug: "",
    meta: {},
    _links: links,
    _project: {
      contentFormat: article.content_format,
      statusCode: article.status,
      visibility: article.visibility === 2 ? 2 : 1,
      coverImage: article.cover_image,
      articleType: article.type,
      commentStatus: article.comment_status,
      commentCount: article.comment_count ?? 0,
      authorName: article.author_name ?? "",
      authorAvatar: article.author_avatar ?? "",
      trashed: article.status === 2,
      realId: article.id,
    },
  };
}

/**
 * 创建尚未保存到数据库的编辑器文章。
 * 编辑器用 `!!postId` 判断是否就绪，因此临时文章使用负数 ID 而不是 0。
 */
export function createNewEditorPost(): EditorPost {
  const now = formatLocalDateTime(new Date());
  return {
    id: -1,
    type: "post",
    status: "auto-draft",
    title: { raw: "", rendered: "" },
    content: { raw: "", rendered: "", protected: false, block_version: 1 },
    excerpt: { raw: "", rendered: "", protected: false },
    format: "standard",
    comment_status: "open",
    comment_count: 0,
    ping_status: "closed",
    categories: [],
    tags: [],
    featured_media: 0,
    author: 0,
    date: now,
    modified: now,
    link: "",
    permalink_template: "",
    slug: "",
    meta: {},
    _links: {
      "wp:action-publish": [{ href: "" }],
      "wp:action-assign-categories": [{ href: "" }],
      "wp:action-create-categories": [{ href: "" }],
      "wp:action-assign-tags": [{ href: "" }],
      "wp:action-create-tags": [{ href: "" }],
    },
    _project: {
      contentFormat: "gutenberg",
      statusCode: 0,
      visibility: 1,
      coverImage: "",
      articleType: 1,
      commentStatus: 1,
      commentCount: 0,
      authorName: "",
      authorAvatar: "",
      trashed: false,
      realId: null,
    },
  };
}
