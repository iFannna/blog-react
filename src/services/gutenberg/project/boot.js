import { initializeCommandPalette } from "@/components/gutenberg/core-commands";
import { initializeEditor } from "@/components/gutenberg/edit-post";
import settings from "@/lib/gutenberg/fixtures/settings.js";
import {
  getSettings as getDateSettings,
  setSettings as setDateSettings,
} from "@/lib/gutenberg/date";
import { installMockApi } from "@/services/gutenberg/mock/api.js";
import { configureCanvasAssets } from "@/styles/gutenberg/canvas.js";
import { createGoProjectEditorSource } from "./api";
import { registerProjectEditor } from "./integration";
import { createNewEditorPost, toEditorPost } from "./map";
import { installProjectMediaBridge } from "./media-bridge";
import "@/styles/gutenberg/inline.js";
import "@/styles/gutenberg/compiled/index.js";
import "@/styles/gutenberg/index.css";

export class ProjectEditorError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ProjectEditorError";
    this.code = code;
  }
}

/** 启动接入项目后端的编辑器实例，articleId 为空时挂载尚未落库的临时文章 */
export async function bootProjectEditor(locale, articleId, options = {}) {
  if (locale === "zh-CN") {
    const { setupLocale } = await import("@/lib/gutenberg/locale/index.js");
    setupLocale(settings);
  } else {
    settings.locale = "en_US";
    settings.isRTL = false;
  }

  // 后端文章时间按站点本地时间返回，编辑器日期设置使用同一时区
  const dateSettings = getDateSettings();
  setDateSettings({
    ...dateSettings,
    timezone: {
      offset: 8,
      offsetFormatted: "8",
      string: "Asia/Shanghai",
      abbr: "CST",
    },
  });

  const source = createGoProjectEditorSource();
  let initialPost;
  if (articleId) {
    const article = await source.getArticle(articleId);
    if (article.content_format === "markdown") {
      throw new ProjectEditorError(
        "MARKDOWN_UNSUPPORTED",
        "该文章使用 Markdown 格式，暂不支持 Gutenberg 编辑",
      );
    }
    initialPost = toEditorPost(article, locale);
  } else {
    initialPost = createNewEditorPost();
  }

  installMockApi(settings.locale);
  installProjectMediaBridge();
  configureCanvasAssets(settings);

  const projectSettings = {
    ...settings,
    __previewOnly: false,
    autosaveInterval: 0,
    localAutosaveInterval: 0,
    __projectEditor: true,
  };

  registerProjectEditor(source, locale, {
    sessionLocale: options.sessionLocale ?? null,
  });
  initializeEditor(
    "editor",
    "post",
    initialPost.id,
    projectSettings,
    {},
    initialPost,
  );
  initializeCommandPalette();
}
