import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isDocLocale } from "@/lib/docs/types";

/** 博客语言段校验：无效语言（如 /fr/archive）统一 404。 */
export default async function BlogLocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isDocLocale(locale)) notFound();

  return children;
}