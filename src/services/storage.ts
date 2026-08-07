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

// 用 httpOnly cookie 中的 refresh_token 向 /api/refresh-token 换取新的 access_token。
// 并发安全由调用方（axios 拦截器）的 Promise 锁保证。
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/refresh-token", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const body = await res.json();
    // 后端统一响应 { code, data }，也可能直接返回数据
    const token = body.data?.access_token || body.access_token;
    if (!token) return null;
    updateStoredToken(token);
    return token;
  } catch {
    return null;
  }
}

// 更新已存储的 access_token，保持 userId/username 不变，自动识别 localStorage 或 sessionStorage
function updateStoredToken(accessToken: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    parsed.accessToken = accessToken;
    const target = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    target.setItem(TOKEN_KEY, JSON.stringify(parsed));
  } catch {
    // storage 数据异常，忽略
  }
}
