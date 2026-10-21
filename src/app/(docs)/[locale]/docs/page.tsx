import { notFound, redirect } from "next/navigation";
import { getFirstDocPath } from "@/lib/docs/content";
import { DOC_SECTIONS } from "@/lib/docs/sections";
import { isDocLocale } from "@/lib/docs/types";

// 静态预渲染会把 redirect() 变成客户端跳转，这里保留服务端 307
export const dynamic = "force-dynamic";

export default async function DocsLocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isDocLocale(locale)) notFound();

  for (const section of DOC_SECTIONS) {
    const first = getFirstDocPath(locale, section.id);
    if (first) redirect(first);
  }

  notFound();
}
