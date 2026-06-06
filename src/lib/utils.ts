export function formatDate(iso: string) {
  const d = new Date(iso);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return {
    month: months[d.getMonth()],
    monthNumber: d.getMonth() + 1,
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

/** Sanitize a URL for safe use inside CSS url() */
export function sanitizeCssUrl(url: string): string {
  return url.replace(/['";()\\]/g, "");
}

/** 数据库存储的文章 url 不含 /archive 前缀，前端跳转需要补上 */
export function articleHref(url: string): string {
  return `/archive${url}`;
}
