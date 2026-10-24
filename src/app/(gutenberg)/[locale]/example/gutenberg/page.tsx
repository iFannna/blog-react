import { notFound } from "next/navigation";
import { GutenbergApp } from "@/components/gutenberg/GutenbergApp";
import { isDocLocale } from "@/lib/docs/types";

export default async function GutenbergPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isDocLocale(locale)) notFound();

  return <GutenbergApp locale={locale} />;
}
