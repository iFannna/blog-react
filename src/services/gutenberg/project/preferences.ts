import apiClient from "@/services/http";
import { getAccessToken } from "@/services/storage";
import type { WPPreferencesPersistenceLayer } from "@/stores/gutenberg/preferences/store/types";

export type Preferences = Record<string, Record<string, unknown>>;

// 只持久化偏好弹窗中暴露的键；面板开合、固定侧栏等会话状态不落库
const PREFERENCE_KEYS: Record<string, readonly string[]> = {
  core: [
    "showListViewByDefault",
    "showBlockBreadcrumbs",
    "allowRightClickOverrides",
    "enableChoosePatternModal",
    "fixedToolbar",
    "distractionFree",
    "focusMode",
    "keepCaretInsideBlock",
    "showIconLabels",
    "mostUsedBlocks",
    "hiddenBlockTypes",
    "inactivePanels",
    "isPublishSidebarEnabled",
  ],
  "core/edit-post": ["themeStyles"],
  "core/media": ["optimizeOnUpload", "requireApproval"],
};

const SAVE_DELAY = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 仅保留白名单内的偏好，忽略未知结构与已废弃键 */
export function sanitizePreferences(value: unknown): Preferences {
  if (!isRecord(value)) {
    return {};
  }
  const result: Preferences = {};
  for (const [scope, keys] of Object.entries(PREFERENCE_KEYS)) {
    const source = value[scope];
    if (!isRecord(source)) {
      continue;
    }
    const scopeValues: Record<string, unknown> = {};
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        scopeValues[key] = source[key];
      }
    }
    if (Object.keys(scopeValues).length > 0) {
      result[scope] = scopeValues;
    }
  }
  return result;
}

/** 读取当前账号的编辑器偏好 */
export async function fetchPreferences(): Promise<Preferences> {
  const data = await apiClient.get<unknown, { preferences?: unknown }>(
    "/user/preferences",
  );
  if (!isRecord(data?.preferences)) {
    throw new Error("Invalid preferences payload");
  }
  return sanitizePreferences(data.preferences);
}

export type PreferencesLoadResult = {
  ok: boolean;
  preferences: Preferences;
};

/** 一次性读取；失败时标记为不可写，避免用空数据覆盖服务器快照 */
export function loadPreferences(): Promise<PreferencesLoadResult> {
  return fetchPreferences().then(
    (preferences) => ({ ok: true, preferences }),
    () => ({ ok: false, preferences: {} }),
  );
}

async function savePreferences(preferences: Preferences): Promise<void> {
  await apiClient.put<unknown, unknown>("/user/preferences", {
    preferences: sanitizePreferences(preferences),
  });
}

// 页面卸载时 axios 请求会被中断，用 keepalive fetch 补最后一次写入
async function savePreferencesOnLeave(preferences: Preferences): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    return;
  }
  const response = await fetch("/api/user/preferences", {
    method: "PUT",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      preferences: sanitizePreferences(preferences),
    }),
  });
  if (!response.ok) {
    throw new Error(`Save preferences failed: ${response.status}`);
  }
}

let pending: Preferences | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let saveChain: Promise<void> = Promise.resolve();
let listenersInstalled = false;
let canPersist = false;

function enqueueSave(preferences: Preferences) {
  saveChain = saveChain
    .catch(() => {})
    .then(() => savePreferences(preferences))
    .catch((error) => {
      console.warn("[gutenberg] 编辑器偏好保存失败", error);
    });
}

function flushPreferences(keepalive: boolean) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!pending) {
    return;
  }
  const snapshot = pending;
  pending = null;
  if (keepalive) {
    void savePreferencesOnLeave(snapshot).catch((error) => {
      console.warn("[gutenberg] 编辑器偏好保存失败", error);
    });
    return;
  }
  enqueueSave(snapshot);
}

function scheduleSave(preferences: Preferences) {
  if (!canPersist) {
    return;
  }
  pending = sanitizePreferences(preferences);
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    timer = null;
    flushPreferences(false);
  }, SAVE_DELAY);
}

function installFlushListeners() {
  if (listenersInstalled || typeof window === "undefined") {
    return;
  }
  listenersInstalled = true;
  window.addEventListener("pagehide", () => flushPreferences(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPreferences(true);
    }
  });
}

/** 偏好 store 的持久化层；prefetched 与文章请求并行发起 */
export function createPreferencesPersistenceLayer(
  prefetched: Promise<PreferencesLoadResult>,
): WPPreferencesPersistenceLayer<Preferences> {
  installFlushListeners();
  return {
    get: async () => {
      const result = await prefetched;
      canPersist = result.ok;
      if (!result.ok) {
        console.warn("[gutenberg] 读取编辑器偏好失败，本次会话不保存偏好");
      }
      return result.preferences;
    },
    // editorMode 等运行时状态不在白名单内，切换时完全不触发持久层
    shouldPersist: (scope, name) =>
      PREFERENCE_KEYS[scope]?.includes(name) ?? false,
    set: (preferences) => scheduleSave(preferences),
  };
}
