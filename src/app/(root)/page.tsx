import { redirect } from "next/navigation";

// 静态预渲染会把 redirect() 变成客户端跳转，这里保留服务端 307
export const dynamic = "force-dynamic";

/** 站点根入口：博客只有中文内容，固定进 /zh-CN；/en-US 仅可直达访问。 */
export default function SiteIndexPage() {
  redirect("/zh-CN");
}
