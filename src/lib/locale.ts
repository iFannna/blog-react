import { isDocLocale, type DocLocale } from "./docs/types";

/** 语言偏好 cookie：顶栏切换语言时写入，入口识别优先读取 */
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

/** 无法从用户语言中识别时的回落语言 */
export const FALLBACK_LOCALE: DocLocale = "en-US";

/** 给站内相对路径加语言前缀：localePath("zh-CN", "/archive") → "/zh-CN/archive" */
export function localePath(locale: string, path: string): string {
  if (!path || path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * 识别用户语言：cookie（手动选择过）> Accept-Language > 回落 en-US。
 * 只在无语言前缀的入口使用，URL 里已有语言前缀时以 URL 为准。
 */
export function detectLocale(
  acceptLanguage: string | null,
  cookieValue?: string | null,
): DocLocale {
  if (cookieValue && isDocLocale(cookieValue)) return cookieValue;

  return matchAcceptLanguage(acceptLanguage) ?? FALLBACK_LOCALE;
}

/** 按 q 值从高到低取第一个可识别的语言标签：zh* → zh-CN，en* → en-US。 */
function matchAcceptLanguage(header: string | null): DocLocale | null {
  if (!header) return null;

  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    if (tag === "zh" || tag.startsWith("zh-")) return "zh-CN";
    if (tag === "en" || tag.startsWith("en-")) return "en-US";
  }

  return null;
}