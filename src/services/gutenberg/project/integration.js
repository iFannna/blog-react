import { addFilter } from "@/hooks/gutenberg/hooks";
import { select } from "@/stores/gutenberg/data";
import { store as editorStore } from "@/components/gutenberg/editor";
import { goProjectMediaSource } from "./api";
import { toEditorPost } from "./map";
import { clearSessionArticle, writeSessionArticle } from "./session";

let activeSource = null;
let activeLocale = "zh-CN";
let activeSessionLocale = null;
let registered = false;

/** 读取编辑器记录或编辑值里的原始文本 */
function readString(value, fallback) {
  if (typeof value === "string") return value;
  if (value && typeof value.raw === "string") return value.raw;
  return fallback;
}

async function resolveCoverImage(mediaId) {
  if (!mediaId) return "";
  const media = await goProjectMediaSource.get(mediaId);
  return media.url;
}

async function saveThroughProject(edits, post) {
  const source = activeSource;
  const project = post._project;
  if (!source || !project) {
    throw new Error("编辑器数据源尚未初始化");
  }

  // 当前编辑器模式决定文章的内容格式，切换模式后保存即改变文章格式
  const contentFormat =
    select(editorStore).getEditorMode() === "markdown"
      ? "markdown"
      : "gutenberg";

  const title = readString(edits.title, readString(post.title, ""));
  const summary = readString(edits.excerpt, readString(post.excerpt, ""));
  const content = readString(edits.content, readString(post.content, ""));
  const categoryIds = Array.isArray(edits.categories)
    ? edits.categories
    : (post.categories ?? []);
  const tagIds = Array.isArray(edits.tags) ? edits.tags : (post.tags ?? []);
  const requestedStatus =
    typeof edits.status === "string" ? edits.status : post.status;
  // 回收站文章直接保存视为恢复草稿
  const targetStatus = requestedStatus === "trash" ? "draft" : requestedStatus;
  const currentStatus = project.statusCode;
  const realId = post.id > 0 ? post.id : 0;

  const baseMediaId = post.featured_media ?? 0;
  const featuredMediaId =
    typeof edits.featured_media === "number"
      ? edits.featured_media
      : baseMediaId;
  let coverImage = project.coverImage ?? "";
  if (featuredMediaId !== baseMediaId) {
    coverImage = await resolveCoverImage(featuredMediaId);
  } else if (featuredMediaId > 0 && !coverImage) {
    coverImage = await resolveCoverImage(featuredMediaId);
  }

  const contentChanged =
    title !== readString(post.title, "") ||
    summary !== readString(post.excerpt, "") ||
    content !== readString(post.content, "") ||
    JSON.stringify(categoryIds) !== JSON.stringify(post.categories ?? []) ||
    JSON.stringify(tagIds) !== JSON.stringify(post.tags ?? []) ||
    featuredMediaId !== baseMediaId;

  // 首次保存才落库，发布时直接以已发布状态创建
  if (!realId) {
    const id = await source.createArticle({
      title,
      summary,
      content,
      contentFormat,
      coverImage,
      featuredMediaId: featuredMediaId || null,
      categoryIds,
      tagIds,
      status: targetStatus === "publish" ? 1 : 0,
    });
    if (activeSessionLocale) {
      writeSessionArticle(activeSessionLocale, id);
    }
    const fresh = await source.getArticle(id);
    return toEditorPost(fresh, activeLocale);
  }

  if (targetStatus === "publish" && currentStatus !== 1) {
    await source.publishArticle(realId, {
      title,
      summary,
      content,
      contentFormat,
      coverImage,
      featuredMediaId: featuredMediaId || null,
      categoryIds,
      tagIds,
    });
  } else if (
    targetStatus === "draft" &&
    !contentChanged &&
    (currentStatus === 1 || currentStatus === 2)
  ) {
    // 仅撤回发布或从回收站恢复，不产生版本
    await source.unpublishArticle(realId);
  } else {
    await source.saveArticle({
      id: realId,
      title,
      summary,
      content,
      contentFormat,
      coverImage,
      featuredMediaId: featuredMediaId || null,
      categoryIds,
      tagIds,
    });
    if (targetStatus === "draft" && currentStatus === 1) {
      await source.unpublishArticle(realId);
    }
  }

  const fresh = await source.getArticle(realId);
  return toEditorPost(fresh, activeLocale);
}

/** 注册项目后端的保存与回收站传输，替代 WP REST 请求 */
export function registerProjectEditor(source, locale, options = {}) {
  activeSource = source;
  activeLocale = locale;
  activeSessionLocale = options.sessionLocale ?? null;
  if (registered) return;
  registered = true;

  addFilter(
    "editor.postSaveTransport",
    "blog/project-editor",
    (transport, edits, post, options) => {
      if (!activeSource || !post?._project) return transport;
      if (options?.isAutosave || options?.isPreview) return transport;
      return saveThroughProject;
    },
  );

  addFilter(
    "editor.postTrashTransport",
    "blog/project-editor",
    (transport, post) => {
      if (!activeSource || !post?._project) return transport;
      return async (currentPost, options = {}) => {
        const realId = currentPost.id > 0 ? currentPost.id : 0;
        if (!realId) return null;
        if (options.force) {
          await activeSource.deleteArticle(realId);
          if (activeSessionLocale) {
            clearSessionArticle(activeSessionLocale);
          }
          window.location.assign(`/${activeLocale}/gutenberg`);
          return null;
        }
        await activeSource.trashArticle(realId);
        const fresh = await activeSource.getArticle(realId);
        return toEditorPost(fresh, activeLocale);
      };
    },
  );
}
