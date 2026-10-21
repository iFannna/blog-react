import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_COOKIE_NAME, detectLocale } from "@/lib/locale";

// 静态预渲染会把 redirect() 变成客户端跳转，这里保留服务端 307
export const dynamic = "force-dynamic";

/** 站点根入口：按用户语言跳到 /{locale}。 */
export default async function SiteIndexPage() {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  const locale = detectLocale(
    headerList.get("accept-language"),
    cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  );

  redirect(`/${locale}`);
}