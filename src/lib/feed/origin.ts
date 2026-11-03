import "server-only";
import type { SiteSettingVO } from "@/types/api";

/** 站点设置里的地址可能缺协议或带尾斜杠，统一成可拼接的 origin */
function normalizeOrigin(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return "";

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** 反代后的请求头里才是读者看到的域名，不能用 Next 自身的 host */
export function requestOrigin(headers: Headers): string {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!host) return "";

  const proto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ?? "http";
  return `${proto}://${host}`;
}

export function siteOrigin(setting: SiteSettingVO | null): string {
  return normalizeOrigin(setting?.site_url ?? "");
}

export function resolveSiteOrigin(
  setting: SiteSettingVO | null,
  headers: Headers,
): string {
  return siteOrigin(setting) || requestOrigin(headers);
}
