import { notFound, redirect } from "next/navigation";
import { getFirstDocPath } from "@/lib/docs/content";
import { getDocSection } from "@/lib/docs/sections";
import { isDocLocale } from "@/lib/docs/types";

// 静态预渲染会把 redirect() 变成客户端跳转，这里保留服务端 307
export const dynamic = "force-dynamic";

export default async function DocsSectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;

  if (!isDocLocale(locale) || !getDocSection(section)) notFound();

  const first = getFirstDocPath(locale, section);
  if (!first) notFound();

  redirect(first);
}
