import { notFound } from "next/navigation";
import ArchiveIndexView from "@/app/archive/ArchiveIndexView";
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

interface ArchivePageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string }>;
}

function parseSlug(slug: string[] | undefined): { year?: number; month?: number; day?: number; label: string; basePath: string } {
  if (!slug || slug.length === 0) {
    notFound();
  }

  // 超过 3 段的不是归档列表，交给文章详情页
  if (slug.length > 3) notFound();

  const year = parseInt(slug[0], 10);
  if (isNaN(year) || year < 1970 || year > 9999) notFound();

  if (slug.length === 1) {
    return { year, label: `${year}`, basePath: `/archive/${year}` };
  }

  const month = parseInt(slug[1], 10);
  if (isNaN(month) || month < 1 || month > 12) notFound();

  if (slug.length === 2) {
    return { year, month, label: `${year}/${String(month).padStart(2, "0")}`, basePath: `/archive/${year}/${String(month).padStart(2, "0")}` };
  }

  const day = parseInt(slug[2], 10);
  if (isNaN(day) || day < 1 || day > 31) notFound();

  return {
    year,
    month,
    day,
    label: `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
    basePath: `/archive/${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
  };
}

export default async function ArchivePage({ params, searchParams }: ArchivePageProps) {
  const { slug } = await params;

  // 空 slug → 归档索引聚合页（密度带 + 年份卡）
  if (!slug || slug.length === 0) {
    return <ArchiveIndexView />;
  }

  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  const { year, month, day, label, basePath } = parseSlug(slug);

  let categories: Category[] = [];
  let tags: Tag[] = [];
  try {
    [categories, tags] = await Promise.all([getCategories(), getTags()]);
  } catch (error) {
    console.error("Failed to fetch categories or tags:", error);
  }

  let articlesData = { list: [] as import("@/types/ui").Article[], total: 0 };
  try {
    articlesData = await getArticles({
      page: currentPage,
      size: PAGE_SIZE,
      year,
      month,
      day,
    });
  } catch (error) {
    console.error("Failed to fetch articles by date:", error);
  }

  const totalPages = Math.ceil(articlesData.total / PAGE_SIZE);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Archive", path: "" },
  ];
  if (month === undefined) {
    breadcrumbItems.push({ name: label, path: "" });
  } else {
    breadcrumbItems.push({ name: `${year}`, path: `/archive/${year}` });
    if (day === undefined) {
      breadcrumbItems.push({ name: String(month).padStart(2, "0"), path: "" });
    } else {
      breadcrumbItems.push({ name: String(month).padStart(2, "0"), path: `/archive/${year}/${String(month).padStart(2, "0")}` });
      breadcrumbItems.push({ name: String(day).padStart(2, "0"), path: "" });
    }
  }

  return (
    <SiteLayout
      showSidebar
      breadcrumbs={<Breadcrumbs items={breadcrumbItems} />}
      sidebar={<Sidebar categories={categories} tags={tags} featuredArticles={articlesData.list.slice(0, 4)} />}
      youMayLikeArticles={articlesData.list.slice(0, 4)}
      featuredArticles={articlesData.list.slice(0, 3)}
      editorPickArticles={articlesData.list.slice(3, 6)}
    >
      <h1 className="sr-only">Archive: {label}</h1>
      <ArticleFeed
        articles={articlesData.list}
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={basePath}
      />
    </SiteLayout>
  );
}
