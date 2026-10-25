export type ContentFormat = "markdown" | "gutenberg";

export interface ArticleTerm {
  id: number;
  name: string;
}

export interface ProjectArticle {
  id: number;
  type: number;
  title: string;
  summary: string;
  content: string;
  content_format: ContentFormat;
  cover_image: string;
  featured_media_id: number | null;
  status: 0 | 1 | 2 | 3;
  visibility: 1 | 2;
  publish_at: string | null;
  comment_status: number;
  author_id: number;
  year: number;
  month: number;
  day: number;
  created_at: string;
  categories: ArticleTerm[];
  tags: ArticleTerm[];
}

export interface CreateArticleInput {
  title: string;
  summary: string;
  content: string;
  contentFormat: ContentFormat;
  coverImage: string;
  featuredMediaId: number | null;
  categoryIds: number[];
  tagIds: number[];
  status: 0 | 1 | 3;
  visibility: 1 | 2;
  publishAt?: string | null;
}

export interface SaveArticleInput {
  id: number;
  title: string;
  summary: string;
  content: string;
  contentFormat: ContentFormat;
  coverImage: string;
  featuredMediaId: number | null;
  categoryIds: number[];
  tagIds: number[];
  visibility: 1 | 2;
  publishAt?: string | null;
}

export interface PublishArticleInput {
  title: string;
  summary: string;
  content: string;
  contentFormat: ContentFormat;
  coverImage: string;
  featuredMediaId: number | null;
  categoryIds: number[];
  tagIds: number[];
  status: 1 | 3;
  visibility: 1 | 2;
  publishAt?: string | null;
}

export interface ArticleVersion {
  id: number;
  version_no: number;
  version_type: "draft" | "publish" | "restore";
  status: number;
  title: string;
  author_id: number;
  created_at: string;
}

export interface ProjectEditorSource {
  getArticle(id: number): Promise<ProjectArticle>;
  createArticle(input: CreateArticleInput): Promise<number>;
  saveArticle(input: SaveArticleInput): Promise<void>;
  publishArticle(id: number, input: PublishArticleInput): Promise<void>;
  unpublishArticle(id: number): Promise<void>;
  trashArticle(id: number): Promise<void>;
  deleteArticle(id: number): Promise<void>;
  listVersions(id: number, page?: number, size?: number): Promise<{ list: ArticleVersion[]; total: number }>;
  restoreVersion(id: number, versionId: number): Promise<void>;
}

export interface ProjectMedia {
  id: number;
  title: string;
  alt_text: string;
  caption: string;
  description: string;
  file_name: string;
  slug: string;
  media_type: string;
  mime_type: string;
  file_size: number;
  width: number;
  height: number;
  url: string;
  storage: string;
  post_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateMediaInput {
  title: string;
  altText: string;
  caption: string;
  description: string;
}

export interface ProjectMediaSource {
  list(page: number, size: number, keyword: string): Promise<{ list: ProjectMedia[]; total: number }>;
  get(id: number): Promise<ProjectMedia>;
  upload(file: File): Promise<ProjectMedia>;
  update(id: number, input: UpdateMediaInput): Promise<ProjectMedia>;
  delete(id: number): Promise<void>;
}
