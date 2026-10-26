import { initializeCommandPalette } from "@/components/gutenberg/core-commands";
import { initializeEditor } from "@/components/gutenberg/edit-post";
import { store as editorStore } from "@/components/gutenberg/editor";
import { setupLocale } from "@/lib/gutenberg/locale/index.js";
import settings from "@/lib/gutenberg/fixtures/settings.js";
import { dispatch } from "@/stores/gutenberg/data";
import { store as coreStore } from "@/stores/gutenberg/core-data";
import { store as preferencesStore } from "@/stores/gutenberg/preferences";
import {
  getSettings as getDateSettings,
  setSettings as setDateSettings,
} from "@/lib/gutenberg/date";
import { installMockApi } from "@/services/gutenberg/mock/api.js";
import { configureCanvasAssets } from "@/styles/gutenberg/canvas.js";
import { createGoProjectEditorSource } from "./api";
import {
  installProjectContentSource,
  loadProjectSiteSettings,
} from "./content";
import { registerProjectEditor } from "./integration";
import { createNewEditorPost, toEditorPost } from "./map";
import { installProjectMediaBridge } from "./media-bridge";
import { createPreferencesPersistenceLayer, loadPreferences } from "./preferences";
import { installProjectTermAdapter } from "./terms";
import "@/styles/gutenberg/inline.js";
import "@/styles/gutenberg/compiled/index.js";
import "@/styles/gutenberg/index.css";

// root/site 实体配置与 core-data 的 loadSiteEntity 一致，只是改为本地注册，
// 避免项目模式为了拿 schema 再发 OPTIONS /wp/v2/settings。
const projectSiteEntity = {
  label: "Site",
  name: "site",
  kind: "root",
  key: false,
  baseURL: "/wp/v2/settings",
  supportsPagination: false,
  meta: {
    labels: {
      title: "Title",
      description: "Tagline",
      url: "Site URL",
    },
  },
};

let siteEntityInstalled = false;

/**
 * 把 Go 站点设置写入 core-data 的 root/site，并标记相关解析已完成，
 * 首帧渲染即可读到，且不会再触发 /wp/v2/settings 请求。
 * 请求失败时只标记解析完成，让读取方按“站点设置不可用”回退。
 */
function installProjectSiteSettings(siteSettings) {
  const core = dispatch(coreStore);

  if (!siteEntityInstalled) {
    siteEntityInstalled = true;
    core.addEntities([projectSiteEntity]);
    core.finishResolution("getEntitiesConfig", ["root"]);
  }

  if (siteSettings) {
    core.receiveEntityRecords("root", "site", {
      title: siteSettings.site_name ?? "",
      description: siteSettings.site_desc ?? "",
      url: siteSettings.site_url ?? "",
      // 没有对应的 Go 字段，沿用编辑器原有的每页条数默认值
      posts_per_page: 10,
    });
    core.finishResolution("getEntityRecord", ["root", "site"]);
    core.finishResolution("getEditedEntityRecord", ["root", "site"]);
  }

  // 站点设置的写入走 Go 接口，这里只开放读取
  core.receiveUserPermissions({
    "read/root/site": Boolean(siteSettings),
    "update/root/site": false,
  });
  core.finishResolution("canUser", [{ kind: "root", name: "site" }]);
}

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
  // 偏好、站点设置与文章并行加载；失败时回退默认值且本次会话不写回
  const preferencesPromise = loadPreferences();
  const siteSettingsPromise = loadProjectSiteSettings().catch(() => null);
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
  installProjectContentSource(locale);
  configureCanvasAssets(settings);

  // 必须在 initializeEditor 之前写入，预载阶段才会直接命中注入的记录
  installProjectSiteSettings(await siteSettingsPromise);

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
  // 必须在首次渲染前挂载，避免先闪默认布局
  await dispatch(preferencesStore).setPersistenceLayer(
    createPreferencesPersistenceLayer(preferencesPromise),
  );
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
  // 仅新建文章且画布为空时默认展开插入器；编辑已有文章保持关闭
  const openInserter =
    options.openInserterWhenEmpty &&
    initialPost._project.contentFormat !== "markdown" &&
    window.matchMedia("(min-width: 782px)").matches &&
    (initialPost.content?.raw ?? "").trim() === "";
  dispatch(editorStore).setIsInserterOpened(openInserter);
  initializeCommandPalette();
}
