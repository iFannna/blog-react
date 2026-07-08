import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Blog",
    template: "%s | Blog",
  },
  description: "Personal blog",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "Blog",
    description: "Personal blog",
    siteName: "Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Personal blog",
  },
  icons: {
    icon: "/icon.svg",
  },
};

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
