import { notFound } from "next/navigation";
import ProjectEditorPage from "@/components/gutenberg/project/ProjectEditorPage";
import { isDocLocale } from "@/lib/docs/types";

export default async function GutenbergArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  if (!isDocLocale(locale)) notFound();

  const articleId = id ? Number(id) : null;
  const validId =
    articleId !== null && Number.isInteger(articleId) && articleId > 0
      ? articleId
      : null;

  return (
    <ProjectEditorPage locale={locale} mode="edit" articleId={validId} />
  );
}
