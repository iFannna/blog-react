import axios from "axios";
import { getAccessToken, refreshAccessToken, clearStoredAuth } from "@/services/storage";

/** 后端 code !== 0 时的业务错误 */
export class ApiError extends Error {
  constructor(message: string, public readonly code: number) {
    super(message);
    this.name = "ApiError";
  }
}

// server 端直连后端；client 端走 Next 反向代理（next.config rewrites: /api/* → 后端），避免浏览器 CORS
const API_BASE = typeof window === "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080")
  : "/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// 给需要鉴权的请求带上 access token（仅客户端；SSR 无 token，公开数据不带）
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// 并发 401 去重：同时多个请求 401 时只刷新一次 token，其余排队复用结果
let refreshPromise: Promise<string | null> | null = null;

function refreshTokenOnce(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;

    if (body.code !== undefined) {
      if (body.code !== 0) {
        throw new ApiError(body.message || "Request failed", body.code);
      }
      return body.data;
    }

    return body;
  },
  async (error) => {
    // 401 → 用 refresh_token 换新 access_token 后重试（仅一次，避免死循环）
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshTokenOnce();
      if (newToken) {
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient(originalRequest);
      }
      // 刷新失败：清登录态，跳转登录页
      if (typeof window !== "undefined") {
        clearStoredAuth();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    const message =
      error.code === "ECONNABORTED"
        ? "Request timed out"
        : error.response
          ? `Server error: ${error.response.status}`
          : "Network error";
    throw new ApiError(message, error.response?.status ?? -1);
  },
);

export default apiClient;
