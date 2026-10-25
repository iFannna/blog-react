import type { Metadata } from "next";
import StatusPage, {
  createStatusMetadata,
  resolveStatusCode,
} from "@/components/common/status-page";

type RouteParams = Promise<{ locale: string; slug: string[] }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  return createStatusMetadata(resolveStatusCode(slug));
}

/** 所有未匹配的路径统一落到这里：命中状态表显示对应状态页，否则 404。 */
export default async function CatchAllStatusPage({
  params,
}: {
  params: RouteParams;
}) {
  const { locale, slug } = await params;

  return (
    <StatusPage code={resolveStatusCode(slug)} homeHref={`/${locale}`} />
  );
}
