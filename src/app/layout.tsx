import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Blog",
    template: "%s | Blog",
  },
  description: "Personal blog",
  metadataBase: new URL("https://java-ai-sau.oss-cn-beijing.aliyuncs.com"),
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
    icon: "/favicon.ico",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("darkmode");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
