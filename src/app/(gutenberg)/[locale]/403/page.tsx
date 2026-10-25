import Link from "next/link";
import { notFound } from "next/navigation";
import { isDocLocale } from "@/lib/docs/types";

export default async function ForbiddenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isDocLocale(locale)) notFound();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        background: "#f6f7f7",
        color: "#1e1e1e",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "28px 32px",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "20px", margin: "0 0 12px" }}>无权访问</h1>
        <p style={{ margin: "0 0 20px", color: "#757575" }}>
          当前账号没有编辑器访问权限。
        </p>
        <Link
          href={`/${locale}`}
          style={{
            display: "inline-block",
            padding: "9px 18px",
            borderRadius: "6px",
            background: "#3858e9",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
