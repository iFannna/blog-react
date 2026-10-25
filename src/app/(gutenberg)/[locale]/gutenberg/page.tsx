import { notFound } from "next/navigation";
import ProjectEditorPage from "@/components/gutenberg/project/ProjectEditorPage";
import { isDocLocale } from "@/lib/docs/types";

export default async function GutenbergNewArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isDocLocale(locale)) notFound();

  return <ProjectEditorPage locale={locale} mode="new" />;
}
