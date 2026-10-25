const KEY_PREFIX = "gutenberg:session-article";

let editorMountedInDocument = false;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function key(locale: string) {
  return `${KEY_PREFIX}:${locale}`;
}

/** 读取当前标签页保存的文章 ID */
export function readSessionArticle(locale: string): number | null {
  const store = storage();
  if (!store) return null;
  const raw = store.getItem(key(locale));
  const id = raw ? Number(raw) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** 记录当前标签页正在编辑的文章 ID */
export function writeSessionArticle(locale: string, id: number) {
  storage()?.setItem(key(locale), String(id));
}

/** 清除当前标签页的文章记录 */
export function clearSessionArticle(locale: string) {
  storage()?.removeItem(key(locale));
}

/**
 * 判断本次进入 `/gutenberg` 是否应恢复会话文章。
 * 只有文档刷新时恢复；站内跳转、新标签页、直接输入地址都视为重新进入。
 */
export function shouldRestoreSessionDraft(): boolean {
  if (editorMountedInDocument) return false;
  editorMountedInDocument = true;
  if (typeof performance === "undefined") return false;
  const entry = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return entry?.type === "reload";
}
