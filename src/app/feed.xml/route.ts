import {
  absolutizeUrls,
  absoluteUrl,
  htmlToPlainText,
  renderArticleHtml,
} from "@/lib/feed/body";
import {
  buildFeedXml,
  FEED_LIMIT,
  toFeedDate,
  type FeedItemInput,
} from "@/lib/feed/build";
import { resolveSiteOrigin } from "@/lib/feed/origin";
import { getArticleById, getArticles } from "@/services/article";
import { getSiteSetting } from "@/services/site";
import { localePath } from "@/lib/locale";
import { articleHref } from "@/utils/article";
import type { ArticleDetail } from "@/types/models";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CONTENT_TYPE = "application/rss+xml; charset=utf-8";
const FEED_LOCALE = "zh-CN";

let cached: { host: string; xml: string; expiresAt: number } | null = null;

function requestHost(headers: Headers): string {
  return headers.get("x-forwarded-host") ?? headers.get("host") ?? "";
}

function articleUrl(origin: string, article: ArticleDetail): string {
  return `${origin}${localePath(FEED_LOCALE, articleHref(article))}`;
}

async function buildItem(article: ArticleDetail, origin: string): Promise<FeedItemInput> {
  const html = absolutizeUrls(await renderArticleHtml(article), origin);

  return {
    title: article.title,
    url: articleUrl(origin, article),
    publishedAt: article.publishTime,
    author: article.authorName,
    categories: article.categories.map((item) => item.name),
    tags: article.tags.map((item) => item.name),
    summary: article.summary || htmlToPlainText(html),
    coverImage: absoluteUrl(origin, article.coverImage),
    html,
  };
}

async function generateFeed(headers: Headers): Promise<string> {
  const [setting, listed] = await Promise.all([
    getSiteSetting().catch(() => null),
    getArticles({ page: 1, size: FEED_LIMIT }),
  ]);

  const origin = resolveSiteOrigin(setting, headers);
  const candidates = listed.list
    .slice()
    .sort(
      (a, b) => toFeedDate(b.publishTime).getTime() - toFeedDate(a.publishTime).getTime(),
    )
    .slice(0, FEED_LIMIT);

  const articles = await Promise.all(
    candidates.map((item) => getArticleById(item.id, item.year, item.month, item.day)),
  );
  const items = await Promise.all(articles.map((item) => buildItem(item, origin)));

  return buildFeedXml({
    title: setting?.seo_title || setting?.site_name || "Blog",
    description: setting?.seo_description || setting?.site_desc || "Personal blog",
    siteUrl: `${origin}${localePath(FEED_LOCALE, "")}`,
    feedUrl: `${origin}/feed.xml`,
    updatedAt: items[0]?.publishedAt ?? new Date().toISOString(),
    items,
  });
}

function xmlResponse(xml: string): Response {
  return new Response(xml, { headers: { "Content-Type": CONTENT_TYPE } });
}

export async function GET(request: Request) {
  const host = requestHost(request.headers);
  const now = Date.now();

  // 缓存按请求域名区分，避免本地生成的绝对地址带到其他域名上
  if (cached && cached.host === host && cached.expiresAt > now) return xmlResponse(cached.xml);

  try {
    const xml = await generateFeed(request.headers);
    cached = { host, xml, expiresAt: Date.now() + CACHE_TTL_MS };

    return xmlResponse(xml);
  } catch (error) {
    cached = null;
    console.error("[feed] 生成失败", error);

    return new Response("Feed generation failed", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
