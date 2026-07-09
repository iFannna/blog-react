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
  type: number;
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
  comment_status: number;
  author_id: number;
  author_name: string;
  author_avatar: string;
  created_at: string;
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

export interface ApiNavArticle {
  id: number;
  title: string;
  url: string;
  cover_image: string;
}

export interface ApiPrevNext {
  prev: ApiNavArticle | null;
  next: ApiNavArticle | null;
}

/** 后端 SiteSettingVO — 对应 site_setting 表，snake_case 与 Go 结构体一致 */
export interface SiteSettingVO {
  id: number;
  site_name: string;
  site_desc: string;
  site_url: string;
  favicon: string;
  developer_avatar: string;
  developer_name: string;
  developer_intro: string;
  developer_email: string;
  developer_phone: string;
  developer_gitee: string;
  developer_github: string;
  developer_stack: string;
  icp: string;
  police: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  created_at: string;
  updated_at: string;
}
