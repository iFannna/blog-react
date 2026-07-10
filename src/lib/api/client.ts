import axios from "axios";

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
  (error) => {
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
