import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import ArticleFeed from "@/components/ui/ArticleFeed";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getArticles } from "@/lib/api/article";
import { getCategories } from "@/lib/api/category";
import { getTags } from "@/lib/api/tag";
import type { Category, Tag } from "@/types/ui";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

interface TagPageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { name } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  let categories: Category[] = [];
  let tags: Tag[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch (error) {
    console.error("Failed to fetch categories or tags:", error);
  }

  const tag = tags.find((t) => t.name === decodeURIComponent(name));
  if (!tag) {
    notFound();
  }

  let articlesData = { list: [] as import("@/types/ui").Article[], total: 0 };
  try {
    articlesData = await getArticles({ page: currentPage, size: PAGE_SIZE, tagId: tag.id });
  } catch (error) {
    console.error("Failed to fetch articles by tag:", error);
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);

  return (
    <SiteLayout
      showSidebar
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Tag", path: "" },
          { name: tag.name, path: "" },
        ]} />
      }
      sidebar={<Sidebar categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">标签: {tag.name}</h1>
      <ArticleFeed
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={`/tag/${name}`}
      />
    </SiteLayout>
  );
}
