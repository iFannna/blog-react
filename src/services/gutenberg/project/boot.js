import { initializeCommandPalette } from "@/components/gutenberg/core-commands";
import { initializeEditor } from "@/components/gutenberg/edit-post";
import { setupLocale } from "@/lib/gutenberg/locale/index.js";
import settings from "@/lib/gutenberg/fixtures/settings.js";
import { dispatch } from "@/stores/gutenberg/data";
import { store as preferencesStore } from "@/stores/gutenberg/preferences";
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
import { installProjectTermAdapter } from "./terms";
import "@/styles/gutenberg/inline.js";
import "@/styles/gutenberg/compiled/index.js";
import "@/styles/gutenberg/index.css";

/** 启动接入项目后端的编辑器实例，articleId 为空时挂载尚未落库的临时文章 */
export async function bootProjectEditor(locale, articleId, options = {}) {
  if (locale === "zh-CN") {
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
    initialPost = toEditorPost(article, locale);
  } else {
    initialPost = createNewEditorPost();
  }

  installMockApi(settings.locale);
  installProjectMediaBridge();
  installProjectTermAdapter();
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
  // 初始化会把模式重置为 visual，但首帧渲染在异步预载之后，
  // 这里同步覆盖，Markdown 文章才能直接以 Markdown 编辑器打开。
  dispatch(preferencesStore).set(
    "core",
    "editorMode",
    initialPost._project.contentFormat === "markdown" ? "markdown" : "visual",
  );
  initializeCommandPalette();
}
