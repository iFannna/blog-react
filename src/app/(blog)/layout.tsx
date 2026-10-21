import type { Metadata } from "next";
import { getSiteSetting } from "@/services/site";
import { ElMessageContainer } from "@/components/element-plus/message";
import { ElMessageBoxContainer } from "@/components/element-plus/message-box";
import { ElNotificationContainer } from "@/components/element-plus/notification";
import { ElLoadingContainer } from "@/components/element-plus/loading";
import { ElConfigProvider } from "@/components/element-plus/config-provider";
import { zhCn } from "@/components/element-plus/config-provider/locales";
import { AuthProvider } from "@/hooks/auth";
import "@/styles/element-plus/index.css";
import "@/styles/blog/index.css";

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

/**
 * 博客的根布局，承载 /{locale} 下的博客路由（(blog) 组）。
 *
 * 根布局放在 [locale] 之上：语言参数变化（客户端切换）时根布局不参与重渲染，
 * <head> 里的防闪脚本不会被 React 在客户端重建（否则会触发 script 相关告警）。
 * 语言校验下沉到 [locale]/layout.tsx。
 *
 * 文档站走 (docs) 组自己的根布局，不加载这里的 blog/index.css，
 * 从而与博客全局样式彻底隔离。
 */
export default function BlogRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 防止暗色主题闪白：在渲染前同步读取 localStorage 设置 data-theme 与 html.dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("darkmode");var d=t==="dark";var r=document.documentElement;r.setAttribute("data-theme",d?"dark":"light");if(d)r.classList.add("dark")}catch(e){}})()`,
          }}
        />
        {/* 桌面端侧边栏布局防闪 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("sidebar-layout");if(l){document.documentElement.setAttribute("data-sidebar-layout",l)}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {/*
            博客侧同样下发中文语言包：MessageBox / Message 等命令式组件
            读的是模块级全局配置，没有 Provider 会回落到官方默认英文。
          */}
          <ElConfigProvider locale={zhCn}>
            {children}
            <ElMessageContainer />
            <ElMessageBoxContainer />
            <ElNotificationContainer />
            <ElLoadingContainer />
          </ElConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
