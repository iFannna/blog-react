/** Go 后端统一响应包装 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 分页响应 data 结构 */
export interface PaginatedData<T> {
  list: T[];
  total: number;
}

/** 后端 ArticleVO — snake_case 字段与 Go 结构体一致 */
export interface ArticleVO {
  id: number;
  title: string;
  url: string;
  summary: string;
  content: string;
  cover_image: string | null;
  status: number;
  view_count: number;
  like_count: number;
  star_count: number;
  comment_count: number;
  share_count: number;
  author_id: number;
  author_name: string;
  author_avatar: string;
  created_at: string;
  publish_at: string;
  categories: ApiCategory[];
  tags: ApiTag[];
}

export interface ApiCategory {
  id: number;
  name: string;
  sort: number;
  created_at: string;
  updated_at: string;
}

export interface ApiTag {
  id: number;
  name: string;
  sort: number;
  created_at: string;
  updated_at: string;
}
