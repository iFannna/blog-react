import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { getArticleByUrl } from "@/lib/api/article";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ year: string; month: string; day: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { year, month, day, id } = await params;

  try {
    const article = await getArticleByUrl(`/${year}/${month}/${day}/${id}`);
    return {
      title: article.title,
      description: article.summary || undefined,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { year, month, day, id } = await params;
  const url = `/${year}/${month}/${day}/${id}`;

  let article;
  try {
    article = await getArticleByUrl(url);
  } catch {
    notFound();
  }

  return (
    <SiteLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Archive", path: "/archive" },
            { name: year, path: `/archive/${year}` },
            { name: month, path: `/archive/${year}/${month}` },
            { name: day, path: `/archive/${year}/${month}/${day}` },
            { name: article.title, path: `/archive${article.url}` },
          ]}
        />
      }
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
