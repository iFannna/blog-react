import type { Metadata } from "next";
import Link from "next/link";
import styles from "./index.module.css";

export const STATUS_DEFINITIONS = {
  "403": { message: "抱歉，您没有访问权限" },
  "404": { message: "抱歉，您访问的页面不存在" },
  "500": { message: "抱歉，服务器出错了" },
} as const;

export type StatusCode = keyof typeof STATUS_DEFINITIONS;

/** 把 URL 中的单段路径解析为状态码，未命中状态表时按 404 处理。 */
export function resolveStatusCode(pathSegments: string[]): StatusCode {
  const [code] = pathSegments;
  if (
    pathSegments.length === 1 &&
    Object.prototype.hasOwnProperty.call(STATUS_DEFINITIONS, code)
  ) {
    return code as StatusCode;
  }
  return "404";
}

/** 状态页的标签页标题：状态码 + 提示，不受所在路由组标题影响。 */
export function getStatusTitle(code: StatusCode): string {
  return `${code} - ${STATUS_DEFINITIONS[code].message}`;
}

export function createStatusMetadata(code: StatusCode): Metadata {
  return { title: { absolute: getStatusTitle(code) } };
}

interface StatusPageProps {
  code: StatusCode;
  homeHref: string;
}

/** 全站共用的整页状态（403 / 404 / 500），沿用博客 404 的视觉。 */
export default function StatusPage({ code, homeHref }: StatusPageProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>{code}</h1>
      <p className={styles.text}>{STATUS_DEFINITIONS[code].message}</p>
      <Link href={homeHref} className={styles.link}>
        返回首页
      </Link>
    </div>
  );
}
