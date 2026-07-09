import type { Metadata } from "next";
import { getSiteSetting } from "@/lib/api/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSiteSetting().catch(() => null);
  const title = setting?.seo_title || setting?.site_name || "Blog";
  const description = setting?.seo_description || setting?.site_desc || "Personal blog";
  const keywords = setting?.seo_keywords
    ? setting.seo_keywords.split(/[,，]/).map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: setting?.favicon || "/icon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 防止暗色主题闪白：在渲染前同步读取 localStorage 设置 data-theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("darkmode");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){}})()`,
          }}
        />
        {/* 刷新时恢复滚动位置 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k="scroll_pos";var s=sessionStorage.getItem(k);if(s){history.scrollRestoration="manual";document.documentElement.style.visibility="hidden";document.addEventListener("DOMContentLoaded",function(){window.scrollTo(0,parseInt(s,10));document.documentElement.style.visibility=""})}window.addEventListener("beforeunload",function(){sessionStorage.setItem(k,String(window.scrollY))})})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
