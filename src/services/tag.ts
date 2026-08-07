import apiClient from "@/services/http";
import type { ApiTag } from "@/types/api";
import type { Tag } from "@/types/models";

function mapTag(item: ApiTag): Tag {
  return { id: item.id, name: item.name };
}

/** 获取全部标签 */
export async function getTags(): Promise<Tag[]> {
  const data = await apiClient.get<unknown, ApiTag[]>("/tag");
  return data.map(mapTag);
}
