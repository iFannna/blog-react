import { redirect } from "next/navigation";

// 静态预渲染会把 redirect() 变成客户端跳转，这里保留服务端 307
export const dynamic = "force-dynamic";

/** 无语言前缀的文档入口：文档以中文为主，固定进 /zh-CN/docs；/en-US 仅可直达访问。 */
export default function DocsIndexPage() {
  redirect("/zh-CN/docs");
}
