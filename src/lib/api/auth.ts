import apiClient from "./client";

// 登录结果：access_token 由前端存 localStorage 携带；refresh_token 后端已写入 httpOnly cookie，前端不直接读取
export interface LoginResult {
  user_id: number;
  username: string;
  access_token: string;
  refresh_token: string;
}

// 用户登录。captcha_verify_param 为前端人机验证凭证（后端未配置验证码时忽略）
export function login(username: string, password: string, captchaVerifyParam: string): Promise<LoginResult> {
  return apiClient.post<unknown, LoginResult>("/login", {
    username,
    password,
    captcha_verify_param: captchaVerifyParam,
  });
}

// 用户注册（后端返回 data: null）
export async function register(req: {
  username: string;
  password: string;
  email: string;
  verify_code: string;
}): Promise<void> {
  await apiClient.post<unknown, unknown>("/register", req);
}

// 发送邮箱验证码。captcha_verify_param 为前端人机验证凭证
export async function sendVerifyCode(email: string, captchaVerifyParam: string): Promise<void> {
  await apiClient.post<unknown, unknown>("/send-verify-code", {
    email,
    captcha_verify_param: captchaVerifyParam,
  });
}

// 登出：后端黑名单 access token + 删 refresh。需要 Bearer token，由请求拦截器带上。
export async function logout(): Promise<void> {
  await apiClient.get("/logout");
}
