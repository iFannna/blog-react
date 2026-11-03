import apiClient from "@/services/http";

export interface RssItem {
  title: string;
  link: string;
  author: string;
  publishedAt: string;
  excerpt: string;
}

export interface RssFeed {
  title: string;
  link: string;
  items: RssItem[];
}

interface RssFeedResponse {
  title?: string;
  link?: string;
  items?: Array<{
    title?: string;
    link?: string;
    author?: string;
    published_at?: string;
    excerpt?: string;
  }>;
}

/** 获取外部订阅源，服务端与编辑器共用；失败交给调用方处理 */
export async function fetchRssFeed(
  url: string,
  items: number,
  signal?: AbortSignal,
): Promise<RssFeed> {
  const data = await apiClient.get<unknown, RssFeedResponse>("/rss", {
    params: { url, items },
    signal,
  });
  return {
    title: data.title ?? "",
    link: data.link ?? "",
    items: (data.items ?? []).map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      author: item.author ?? "",
      publishedAt: item.published_at ?? "",
      excerpt: item.excerpt ?? "",
    })),
  };
}
