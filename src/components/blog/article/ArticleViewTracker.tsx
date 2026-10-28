"use client";

import { useEffect } from "react";
import { recordArticleView } from "@/services/article";

interface ArticleViewTrackerProps {
  articleId: number;
}

export default function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    const key = `viewed:article:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // 隐私模式下 sessionStorage 不可用时仍然上报，服务端会去重
    }
    void recordArticleView(articleId).catch(() => {});
  }, [articleId]);

  return null;
}
