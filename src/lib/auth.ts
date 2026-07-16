// 访客登录态的本地存储（access token + 身份）。
// remember 勾选存 localStorage（跨标签持久），否则 sessionStorage（关标签即失效）。
// 纯客户端：SSR 无 localStorage，getAccessToken 在服务端返回 null，保证公开数据的服务端请求不带 token。

const TOKEN_KEY = "auth";

export interface StoredAuth {
  accessToken: string;
  userId: number;
  username: string;
}

function read(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed.accessToken ? parsed : null;
  } catch {
    return null;
  }
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  return read();
}

export function getAccessToken(): string | null {
  return getStoredAuth()?.accessToken ?? null;
}

export function setStoredAuth(auth: StoredAuth, remember: boolean): void {
  if (typeof window === "undefined") return;
  // 先清两处再写目标，避免残留导致 remember 行为错乱
  clearStoredAuth();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}
