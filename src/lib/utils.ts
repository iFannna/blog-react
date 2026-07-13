/** Sanitize a URL for safe use inside CSS url() */
export function sanitizeCssUrl(url: string): string {
  return url.replace(/['";()\\]/g, "");
}

/** 文章详情路径：/archive/{year}/{month}/{day}/{id}，日期由后端 VO 透传，前端不自己算 */
export function articleHref(a: { year: number; month: number; day: number; id: number }): string {
  const mm = String(a.month).padStart(2, "0");
  const dd = String(a.day).padStart(2, "0");
  return `/archive/${a.year}/${mm}/${dd}/${a.id}`;
}
