/** UI 层文章模型 — camelCase，组件实际使用的字段 */
export interface Article {
  id: number;
  type: 1 | 2;
  title: string;
  summary: string;
  coverImage: string | null;
  authorName: string;
  authorAvatar: string;
  authorId: number;
  categories: ArticleCategory[];
  tags: ArticleTag[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishTime: string;
  url: string;
}

export interface ArticleCategory {
  id: number;
  name: string;
}

export interface ArticleTag {
  id: number;
  name: string;
}

/** UI 层分类 */
export interface Category {
  id: number;
  name: string;
}

/** UI 层标签 */
export interface Tag {
  id: number;
  name: string;
}
