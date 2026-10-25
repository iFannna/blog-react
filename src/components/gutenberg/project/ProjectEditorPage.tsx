"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import StatusPage, {
  getStatusTitle,
  type StatusCode,
} from "@/components/common/status-page";
import { getStoredAuth } from "@/services/storage";
import { getAuthInfo } from "@/services/gutenberg/project/auth";
import {
  clearSessionArticle,
  readSessionArticle,
  shouldRestoreSessionDraft,
} from "@/services/gutenberg/project/session";

type Phase = "checking" | "ready" | "error";

type PreparedResult =
  | { kind: "ready"; articleId: number | null }
  | { kind: "login"; redirect: string }
  | { kind: "forbidden" }
  | { kind: "error"; code: StatusCode };

interface ProjectEditorPageProps {
  locale: string;
  mode: "new" | "edit";
  articleId?: number | null;
}

/** 校验登录态与页面权限，并挂载接入后端的编辑器 */
export default function ProjectEditorPage({
  locale,
  mode,
  articleId,
}: ProjectEditorPageProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [resolvedArticleId, setResolvedArticleId] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<StatusCode | null>(null);
  const prepareRef = useRef<Promise<PreparedResult> | null>(null);
  const bootedRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!prepareRef.current) {
      prepareRef.current = (async (): Promise<PreparedResult> => {
        if (!getStoredAuth()) {
          return {
            kind: "login",
            redirect: encodeURIComponent(
              window.location.pathname + window.location.search,
            ),
          };
        }

        const info = await getAuthInfo();
        if (!info.permission_codes?.includes("page:gutenberg")) {
          return { kind: "forbidden" };
        }

        // 只有刷新文档才恢复当前标签页的草稿；站内跳转或直接输入地址都重新开始
        const restore = shouldRestoreSessionDraft();
        if (mode === "new") {
          const storedId = restore ? readSessionArticle(locale) : null;
          if (!restore) clearSessionArticle(locale);
          return { kind: "ready", articleId: storedId };
        }

        if (!articleId || articleId <= 0) {
          return { kind: "error", code: "404" };
        }
        return { kind: "ready", articleId };
      })();
    }

    prepareRef.current
      .then((result) => {
        if (cancelled) return;
        switch (result.kind) {
          case "login":
            router.replace(`/${locale}/login?redirect=${result.redirect}`);
            break;
          case "forbidden":
            router.replace(`/${locale}/403`);
            break;
          case "ready":
            setResolvedArticleId(result.articleId);
            setPhase("ready");
            break;
          case "error":
            setStatusCode(result.code);
            setPhase("error");
            break;
        }
      })
      .catch(() => {
        if (cancelled) return;
        setStatusCode("500");
        setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, [locale, mode, articleId, router]);

  useEffect(() => {
    if (phase !== "ready") return;
    const key = `${locale}:${mode}:${resolvedArticleId ?? "new"}`;
    if (bootedRef.current === key) return;
    bootedRef.current = key;

    // 使用 React 媒体弹窗，避免依赖未随包提供的 wp.media 脚本
    window.__experimentalDataViewsMediaModal = true;
    void (async () => {
      // 语言包必须先于编辑器模块求值，模块级 __() 常量才会是中文
      if (locale === "zh-CN") {
        await import("@/lib/gutenberg/locale/preload-zh.js");
      }
      const { bootProjectEditor } = await import(
        "@/services/gutenberg/project/boot"
      );
      await bootProjectEditor(locale, resolvedArticleId, {
        sessionLocale: mode === "new" ? locale : null,
      });
    })().catch(() => {
      bootedRef.current = null;
      setStatusCode("500");
      setPhase("error");
    });
  }, [phase, locale, mode, resolvedArticleId]);

  // 错误态不是独立路由，需要同步标签页标题。
  useEffect(() => {
    if (phase !== "error") return;
    document.title = getStatusTitle(statusCode ?? "500");
  }, [phase, statusCode]);

  if (phase === "error") {
    return <StatusPage code={statusCode ?? "500"} homeHref={`/${locale}`} />;
  }

  if (phase !== "ready") {
    return null;
  }

  return <div id="editor" />;
}
