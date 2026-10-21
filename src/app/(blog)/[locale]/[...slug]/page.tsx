import Link from "next/link";

export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="not-found-page">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-text">抱歉，您访问的页面不存在</p>
      <Link href={`/${locale}`} className="not-found-link">
        返回首页
      </Link>
    </div>
  );
}
