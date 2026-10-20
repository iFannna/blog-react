import { redirect } from "next/navigation";
import { DEFAULT_DOC_LOCALE } from "@/lib/docs/types";

// 静态预渲染会把 redirect() 变成客户端跳转，这里保留服务端 307
export const dynamic = "force-dynamic";

export default function LegacyComponentsOverviewPage() {
  redirect(`/docs/${DEFAULT_DOC_LOCALE}/element-plus/components/overview`);
}
