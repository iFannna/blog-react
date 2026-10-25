import apiClient from "@/services/http";

export interface AuthInfo {
  role_codes: string[];
  permission_codes: string[];
}

/** 查询当前用户角色码与权限码 */
export function getAuthInfo() {
  return apiClient.get<unknown, AuthInfo>("/user/auth-info");
}
