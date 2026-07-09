import { cache } from "react";
import apiClient from "./client";
import type { SiteSettingVO } from "@/types/api";

/** 获取站点设置（开发者信息、联系方式、备案、SEO），React.cache 在单次请求内去重 */
export const getSiteSetting = cache(async (): Promise<SiteSettingVO> => {
  return apiClient.get<unknown, SiteSettingVO>("/site-setting");
});

/** 获取启用状态的留言数量 */
export const getGuestbookCount = cache(async (): Promise<number> => {
  const data = await apiClient.get<unknown, { count: number }>("/guestbook/count");
  return data.count;
});

/** 获取启用状态的友情链接数量 */
export const getFriendLinkCount = cache(async (): Promise<number> => {
  const data = await apiClient.get<unknown, { count: number }>("/friendlink/count");
  return data.count;
});
