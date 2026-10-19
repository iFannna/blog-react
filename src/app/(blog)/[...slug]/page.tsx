import Link from "next/link";

export default function CatchAllNotFound() {
  return (
    <div className="not-found-page">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-text">抱歉，您访问的页面不存在</p>
      <Link href="/" className="not-found-link">
        返回首页
      </Link>
    </div>
  );
}
