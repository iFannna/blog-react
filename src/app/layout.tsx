import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Personal blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("darkmode");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){}})()`}
        </Script>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
