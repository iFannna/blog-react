"use client";

import { useParams } from "next/navigation";

/** 客户端组件里取当前 URL 的语言段（如 "zh-CN"）与其前缀（如 "/zh-CN"） */
export function useLocale(): { locale: string; prefix: string } {
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "";
  return { locale, prefix: locale ? `/${locale}` : "" };
}