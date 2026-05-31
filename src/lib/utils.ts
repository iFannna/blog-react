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
