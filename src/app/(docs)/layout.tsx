import type { ReactNode } from "react";
import { ElMessageContainer } from "@/components/element-plus/message";
import { ElMessageBoxContainer } from "@/components/element-plus/message-box";
import { ElNotificationContainer } from "@/components/element-plus/notification";
import { ElLoadingContainer } from "@/components/element-plus/loading";
import { ElConfigProvider } from "@/components/element-plus/config-provider";
import { zhCn } from "@/components/element-plus/config-provider/locales";
import "@/styles/element-plus/index.css";
import "@/styles/docs/index.css";

/**
 * 文档站的独立根布局。
 *
 * 与博客共用同一个 Next app，但两条路由各自带根布局，互不引入对方的全局样式：
 * 这里只加载 Element Plus 的 theme-chalk 产物与 docs/index.css，
 * 因此博客 blog/index.css 的元素 reset、body 字体字号、1rem=16px 基准都不会命中文档页。
 *
 * 根部套一层 ConfigProvider 下发中文语言包，否则分页 / 表格空数据 / MessageBox
 * 等内置文案会回落到官方默认的英文。
 */
export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 防暗色闪白：与 EP 一致用 html.dark 切换，docs/index.css 的暗色变量挂在它下面 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem("darkmode")==="dark";var r=document.documentElement;r.setAttribute("data-theme",d?"dark":"light");if(d)r.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ElConfigProvider locale={zhCn}>
          {children}
          <ElMessageContainer />
          <ElMessageBoxContainer />
          <ElNotificationContainer />
          <ElLoadingContainer />
        </ElConfigProvider>
      </body>
    </html>
  );
}
