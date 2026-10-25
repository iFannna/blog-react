"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  | { kind: "error"; message: string };

interface ProjectEditorPageProps {
  locale: string;
  mode: "new" | "edit";
  articleId?: number | null;
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px",
  background: "#f6f7f7",
  color: "#1e1e1e",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "440px",
  padding: "28px 32px",
  borderRadius: "12px",
  background: "#fff",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
  textAlign: "center",
};

/** 校验登录态与页面权限，并挂载接入后端的编辑器 */
export default function ProjectEditorPage({
  locale,
  mode,
  articleId,
}: ProjectEditorPageProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [resolvedArticleId, setResolvedArticleId] = useState<number | null>(null);
  const [error, setError] = useState("");
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
          return {
            kind: "error",
            message: "文章 ID 无效，请返回新建文章",
          };
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
            setError(result.message);
            setPhase("error");
            break;
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "无法进入编辑器，请稍后重试";
        setError(message);
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
    void import("@/services/gutenberg/project/boot")
      .then(({ bootProjectEditor }) =>
        bootProjectEditor(locale, resolvedArticleId, {
          sessionLocale: mode === "new" ? locale : null,
        }),
      )
      .catch((err: unknown) => {
        bootedRef.current = null;
        const message =
          err instanceof Error ? err.message : "编辑器启动失败，请稍后重试";
        setError(message);
        setPhase("error");
      });
  }, [phase, locale, mode, resolvedArticleId]);

  if (phase === "error") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ fontSize: "20px", margin: "0 0 12px" }}>
            无法打开编辑器
          </h1>
          <p style={{ margin: "0 0 20px", color: "#757575" }}>{error}</p>
          <a
            href={`/${locale}/gutenberg`}
            style={{
              display: "inline-block",
              padding: "9px 18px",
              borderRadius: "6px",
              background: "#3858e9",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            返回新建文章
          </a>
        </div>
      </div>
    );
  }

  if (phase !== "ready") {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#757575" }}>
            正在校验访问权限…
          </p>
        </div>
      </div>
    );
  }

  return <div id="editor" />;
}
