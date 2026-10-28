/** 给站内相对路径加语言前缀：localePath("zh-CN", "/archive") → "/zh-CN/archive" */
export function localePath(locale: string, path: string): string {
  if (!path || path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
