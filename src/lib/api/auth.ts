import apiClient from "./client";

// 登录结果：access_token 由前端存 localStorage 携带；refresh_token 后端已写入 httpOnly cookie，前端不直接读取
export interface LoginResult {
  user_id: number;
  username: string;
  access_token: string;
  refresh_token: string;
}

// 用户登录
export function login(username: string, password: string): Promise<LoginResult> {
  return apiClient.post<unknown, LoginResult>("/login", { username, password });
}

// 用户注册（后端返回 data: null）
export async function register(req: {
  username: string;
  password: string;
  nickname: string;
}): Promise<void> {
  await apiClient.post<unknown, unknown>("/register", req);
}
