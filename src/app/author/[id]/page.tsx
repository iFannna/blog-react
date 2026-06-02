import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import ArticleFeed from "@/components/ui/ArticleFeed";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getArticles } from "@/lib/api/article";
import { getCategories } from "@/lib/api/category";
import { getTags } from "@/lib/api/tag";
import type { Category, Tag, Article } from "@/types/ui";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

interface AuthorPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;
  const authorId = Number(id);

  if (isNaN(authorId)) {
    notFound();
  }

  let categories: Category[] = [];
  let tags: Tag[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch (error) {
    console.error("Failed to fetch categories or tags:", error);
  }

  let articlesData = { list: [] as Article[], total: 0 };
  try {
    articlesData = await getArticles({ page: currentPage, size: PAGE_SIZE, authorId });
  } catch (error) {
    console.error("Failed to fetch articles by author:", error);
  }

  if (articlesData.total === 0 && currentPage === 1) {
    notFound();
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);
  const authorName = articlesData.list[0]?.authorName || "";

  return (
    <SiteLayout
      showSidebar
      breadcrumbs={
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Author", path: "" },
          { name: authorName, path: "" },
        ]} />
      }
      sidebar={<Sidebar categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">作者: {authorName}</h1>
      <ArticleFeed
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={`/author/${id}`}
      />
    </SiteLayout>
  );
}
