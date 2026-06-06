import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/layout/Sidebar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { getArticleByUrl, getArticles } from "@/lib/api/article";
import { getCategories } from "@/lib/api/category";
import { getTags } from "@/lib/api/tag";

export const dynamic = "force-dynamic";

// 文章 URL 格式：/{YYYY}/{MM}/{DD}/{timestamp}，恰好 4 段
function parseArticleSlug(slug: string[]): string | null {
  if (slug.length !== 4) return null;
  const [year, month, day, timestamp] = slug;
  if (!/^\d{4}$/.test(year)) return null;
  if (!/^\d{2}$/.test(month)) return null;
  if (!/^\d{2}$/.test(day)) return null;
  if (!/^\d+$/.test(timestamp)) return null;
  return `/${year}/${month}/${day}/${timestamp}`;
}

interface ArticlePageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const url = parseArticleSlug(slug);
  if (!url) return {};

  try {
    const article = await getArticleByUrl(url);
    return {
      title: article.title,
      description: article.summary || undefined,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const url = parseArticleSlug(slug);
  if (!url) notFound();

  // 获取文章详情
  let article;
  try {
    article = await getArticleByUrl(url);
  } catch {
    notFound();
  }

  // 并行获取侧边栏数据
  let categories: import("@/types/ui").Category[] = [];
  let tags: import("@/types/ui").Tag[] = [];
  let relatedData = { list: [] as import("@/types/ui").Article[], total: 0 };

  try {
    [categories, tags, relatedData] = await Promise.all([
      getCategories(),
      getTags(),
      getArticles({ size: 6 }),
    ]);
  } catch {
    // 侧边栏数据加载失败不影响文章展示
  }

  return (
    <SiteLayout
      showSidebar
      breadcrumbs={
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: article.title, path: article.url },
          ]}
        />
      }
      sidebar={
        <Sidebar
          categories={categories}
          tags={tags}
          featuredArticles={relatedData.list.slice(0, 4)}
        />
      }
      youMayLikeArticles={relatedData.list.slice(0, 4)}
      featuredArticles={relatedData.list.slice(0, 3)}
      editorPickArticles={relatedData.list.slice(3, 6)}
    >
      <div id="primary" className="content-area">
        <article className="page-entry">
          <div className="entry-content page-entry-content">
            <MarkdownContent content={article.content} />
          </div>
        </article>
      </div>
    </SiteLayout>
  );
}
