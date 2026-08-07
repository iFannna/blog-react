import apiClient from "@/services/http";
import type { ApiTag } from "@/types/api";
import type { Category as CategoryModel } from "@/types/models";

function mapCategory(item: ApiTag): CategoryModel {
  return { id: item.id, name: item.name };
}

/** 获取全部分类 */
export async function getCategories(): Promise<CategoryModel[]> {
  const data = await apiClient.get<unknown, ApiTag[]>("/category");
  return data.map(mapCategory);
}
