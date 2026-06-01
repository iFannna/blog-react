import apiClient from "./client";
import type { ApiTag } from "@/types/api";
import type { Tag } from "@/types/ui";

/** 获取所有标签 */
export async function getTags() {
  const data = await apiClient.get<unknown, ApiTag[]>("/tag");
  return data.map((t) => ({ id: t.id, name: t.name }));
}
