import apiClient from "./client";
import type { ApiCategory } from "@/types/api";
import type { Category } from "@/types/ui";

/** 获取所有分类 */
export async function getCategories() {
  const data = await apiClient.get<unknown, ApiCategory[]>("/category");
  return data.map((c) => ({ id: c.id, name: c.name }));
}
