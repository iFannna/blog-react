import "server-only";

export const FEED_LIMIT = 20;

export interface FeedItemInput {
  title: string;
  url: string;
  publishedAt: string;
  author: string;
  categories: string[];
  tags: string[];
  summary: string;
  coverImage: string;
  html: string;
}

export interface FeedInput {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  updatedAt: string;
  items: FeedItemInput[];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** CDATA 里出现结束标记时必须拆开，否则文档结构被截断 */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** 后端返回不带时区的北京时间，补时区避免服务进程时区影响输出 */
export function toFeedDate(value: string): Date {
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(iso)) return new Date(iso);

  return new Date(`${iso}+08:00`);
}

function coverType(url: string): string {
  const ext = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(url)?.[1]?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

function renderItem(item: FeedItemInput): string {
  const lines = [
    "    <item>",
    `        <title>${escapeXml(item.title)}</title>`,
    `        <link>${escapeXml(item.url)}</link>`,
    `        <guid isPermaLink="false">${escapeXml(item.url)}</guid>`,
    `        <pubDate>${toFeedDate(item.publishedAt).toUTCString()}</pubDate>`,
  ];

  if (item.author) {
    lines.push(`        <dc:creator>${escapeXml(item.author)}</dc:creator>`);
  }

  for (const name of item.categories) {
    lines.push(`        <category>${cdata(name)}</category>`);
  }

  for (const name of item.tags) {
    lines.push(`        <category domain="tag">${cdata(name)}</category>`);
  }

  if (item.coverImage) {
    lines.push(
      `        <media:content url="${escapeXml(item.coverImage)}" medium="image" type="${coverType(item.coverImage)}"/>`,
    );
  }

  lines.push(
    `        <description>${cdata(item.summary)}</description>`,
    `        <content:encoded>${cdata(item.html)}</content:encoded>`,
    "    </item>",
  );

  return lines.join("\n");
}

export function buildFeedXml(input: FeedInput): string {
  const items = input.items.slice(0, FEED_LIMIT);

  const head = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '    xmlns:atom="http://www.w3.org/2005/Atom"',
    '    xmlns:dc="http://purl.org/dc/elements/1.1/"',
    '    xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '    xmlns:media="http://search.yahoo.com/mrss/">',
    "  <channel>",
    `    <title>${escapeXml(input.title)}</title>`,
    `    <link>${escapeXml(input.siteUrl)}</link>`,
    `    <description>${escapeXml(input.description)}</description>`,
    "    <language>zh-CN</language>",
    `    <lastBuildDate>${toFeedDate(input.updatedAt).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(input.feedUrl)}" rel="self" type="application/rss+xml"/>`,
  ];

  const body = items.map(renderItem);
  const tail = ["  </channel>", "</rss>"];

  return [...head, ...body, ...tail].join("\n");
}
