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

interface AuthorPageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { name } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;
  const authorName = decodeURIComponent(name);

  let categories: Category[] = [];
  let tags: Tag[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch (error) {
    console.error("Failed to fetch categories or tags:", error);
  }

  let articlesData = { list: [] as import("@/types/ui").Article[], total: 0 };
  try {
    articlesData = await getArticles({ page: currentPage, size: PAGE_SIZE, authorName });
  } catch (error) {
    console.error("Failed to fetch articles by author:", error);
  }

  if (articlesData.total === 0 && currentPage === 1) {
    notFound();
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);

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
      <section className="author-box">
        <div className="author-box-avatar">
          <img
            alt={authorName}
            src={articlesData.list[0]?.authorAvatar || ""}
            className="avatar avatar-75 photo"
            height={75}
            width={75}
            decoding="async"
          />
        </div>
        <div className="author-box-meta">
          <div className="h4 author-box-title">About {authorName}</div>
          <div className="author-box-content"></div>
        </div>
      </section>
      <ArticleFeed
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={`/author/${name}`}
      />
    </SiteLayout>
  );
}
