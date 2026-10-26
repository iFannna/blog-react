import { useEffect, useState } from "react";
import apiClient from "@/services/http";
import type { ProjectArticle } from "./types";

let projectContentActive = false;
let projectLocale = "zh-CN";

/** 安装项目内容源；安装后动态区块直接读取 Go 接口，不再走 /wp/v2 mock */
export function installProjectContentSource(locale: string) {
	projectContentActive = true;
	projectLocale = locale;
}

export function isProjectContentSource(): boolean {
	return projectContentActive;
}

export function getProjectLocale(): string {
	return projectLocale;
}

interface NavArticle {
	id: number;
	title: string;
	year: number;
	month: number;
	day: number;
	cover_image: string;
}

export interface ProjectAdjacentPost {
	id: number;
	title: string;
	link: string;
}

export interface ProjectAdjacentPosts {
	prev: ProjectAdjacentPost | null;
	next: ProjectAdjacentPost | null;
}

export interface ProjectSiteSettings {
	site_name: string;
	site_desc: string;
	site_url: string;
}

export interface ProjectAuthor {
	id: number;
	name: string;
	avatar: string;
	count: number;
}

export interface ProjectLatestComment {
	id: number;
	article_id: number;
	article_title: string;
	year: number;
	month: number;
	day: number;
	user_id: number;
	content: string;
	like_count: number;
	author_name: string;
	author_avatar: string;
	created_at: string;
}

export interface ProjectArchiveItem {
	year: number;
	month?: number;
	day?: number;
	count: number;
}

export interface ArchivesState {
	items: ProjectArchiveItem[] | null;
	loading: boolean;
	error?: string;
}

export type ArchiveGroupType = "yearly" | "monthly" | "daily";

export interface LatestPostView {
	id: number;
	title: { rendered: string };
	excerpt: { rendered: string; raw: string };
	content: { rendered: string };
	link: string;
	date: string;
	date_gmt: string;
	_embedded: {
		author?: Array<{
			id: number;
			name: string;
			avatar_urls: Record< string, string >;
		}>;
		"wp:featuredmedia"?: Array<{
			source_url: string;
			alt_text: string;
			media_details: { sizes: Record< string, unknown > };
		}>;
	};
}

export interface LatestPostsState {
	posts: LatestPostView[] | null;
	loading: boolean;
	error?: string;
}

export interface LatestPostsOptions {
	perPage: number;
	categoryIds: number[];
	authorId?: number;
	orderBy?: string;
	order?: string;
	fullPost?: boolean;
}

export interface LatestCommentsState {
	comments: ProjectLatestComment[] | null;
	loading: boolean;
	error?: string;
}

function pad(value: number) {
	return String(value).padStart(2, "0");
}

function normalizeDate(value: string | null | undefined) {
	if (!value) return "";
	return String(value)
		.trim()
		.replace(" ", "T")
		.replace(/\.\d+$/, "")
		.replace(/(Z|[+-]\d{2}:?\d{2})$/, "");
}

function toGMTDate(value: string) {
	if (!value) return "";
	const date = new Date(`${value}+08:00`);
	if (Number.isNaN(date.getTime())) return value;
	return date.toISOString().replace(/\.\d+Z$/, "");
}

function articleLink(article: ProjectArticle) {
	return `/${projectLocale}/archive/${article.year}/${pad(article.month)}/${pad(article.day)}/${article.id}`;
}

export function commentArticleLink(comment: ProjectLatestComment) {
	return `/${projectLocale}/archive/${comment.year}/${pad(comment.month)}/${pad(comment.day)}/${comment.article_id}`;
}

/** 归档条目对应的前台地址 */
export function archiveItemLink(item: ProjectArchiveItem) {
	const base = `/${projectLocale}/archive/${item.year}`;
	if (item.month && item.day) {
		return `${base}/${pad(item.month)}/${pad(item.day)}`;
	}
	if (item.month) {
		return `${base}/${pad(item.month)}`;
	}
	return base;
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

/** 全文预览：Markdown 正文按源码展示，Gutenberg 正文直接渲染 HTML */
function renderFullContent(content: string, format: string | undefined) {
	if (format === "markdown") {
		return `<pre>${escapeHtml(content)}</pre>`;
	}
	return content;
}

function toLatestPostView(
	article: ProjectArticle,
	fullContent?: string,
): LatestPostView {
	const postedAt = normalizeDate(article.publish_at || article.created_at);
	const authorName = article.author_name || "";
	const authorAvatar = article.author_avatar || "";
	const featuredImage = article.cover_image
		? [
				{
					source_url: article.cover_image,
					alt_text: "",
					media_details: { sizes: {} },
				},
			]
		: undefined;
	return {
		id: article.id,
		title: { rendered: article.title },
		excerpt: { rendered: article.summary || "", raw: "" },
		content: { rendered: fullContent ?? article.summary ?? "" },
		link: articleLink(article),
		date: postedAt,
		date_gmt: toGMTDate(postedAt),
		_embedded: {
			author: [
				{
					id: article.author_id,
					name: authorName,
					avatar_urls: {
						"24": authorAvatar,
						"48": authorAvatar,
						"96": authorAvatar,
					},
				},
			],
			...(featuredImage ? { "wp:featuredmedia": featuredImage } : {}),
		},
	};
}

/**
 * 最新文章的项目数据源。
 * 查询条件直接对应 Go 接口：order_by + order、category_ids、author_id。
 * 全文预览按需逐篇请求详情，列表接口不返回正文。
 */
export function useProjectLatestPosts(
	options: LatestPostsOptions,
): LatestPostsState {
	const active = isProjectContentSource();
	const perPage = Math.min(Math.max(Number(options.perPage) || 5, 1), 100);
	const categoryIds = options.categoryIds;
	const categoryKey = categoryIds.join(",");
	const authorId = options.authorId;
	const orderBy = options.orderBy ?? "date";
	const order = options.order ?? "desc";
	const fullPost = Boolean(options.fullPost);

	const key = `${perPage}|${categoryKey}|${authorId ?? ""}|${orderBy}|${order}|${
		fullPost ? 1 : 0
	}`;
	const [result, setResult] = useState<{
		key: string;
		posts: LatestPostView[];
		error?: string;
	} | null>(null);
	const loading = active && result?.key !== key;
	const posts = active && result?.key === key ? result.posts : null;
	const error =
		active && !loading && result?.key === key ? result.error : undefined;

	useEffect(() => {
		if (!active) {
			return;
		}

		let cancelled = false;
		const requestKey = key;
		const params: Record<string, unknown> = {
			page: 1,
			size: perPage,
			order_by: orderBy === "title" ? "title" : "publish_at",
			order: order === "asc" ? "asc" : "desc",
		};
		const ids = categoryKey
			? categoryKey
					.split(",")
					.map((value) => Number(value))
					.filter((value) => Number.isInteger(value) && value > 0)
			: [];
		if (ids.length) {
			params.category_ids = ids.join(",");
		}
		if (authorId) {
			params.author_id = authorId;
		}

		(async () => {
			try {
				const data = await apiClient.get<
					unknown,
					{ list: ProjectArticle[]; total: number }
				>("/article", { params });
				const list = data.list ?? [];
				const contentMap = new Map<number, string>();
				// 全文预览：列表不带正文，按每批 5 篇请求详情，避免一次性打满
				if (fullPost) {
					for (let index = 0; index < list.length; index += 5) {
						const slice = list.slice(index, index + 5);
						const details = await Promise.all(
							slice.map((article) =>
								apiClient
									.get<unknown, ProjectArticle>(
										`/article/${article.id}`,
									)
									.catch(() => null),
							),
						);
						details.forEach((detail, detailIndex) => {
							if (detail?.content) {
								contentMap.set(
									slice[detailIndex].id,
									renderFullContent(
										detail.content,
										detail.content_format,
									),
								);
							}
						});
						if (cancelled) return;
					}
				}
				if (cancelled) return;
				setResult({
					key: requestKey,
					posts: list.map((article) =>
						toLatestPostView(article, contentMap.get(article.id)),
					),
				});
			} catch (requestError: unknown) {
				if (cancelled) return;
				setResult({
					key: requestKey,
					posts: [],
					error:
						requestError instanceof Error
							? requestError.message
							: "加载文章失败",
				});
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [
		active,
		key,
		perPage,
		categoryKey,
		authorId,
		orderBy,
		order,
		fullPost,
	]);

	return {
		posts,
		loading,
		error,
	};
}

let siteSettingsPromise: Promise<ProjectSiteSettings> | null = null;

function loadSiteSettings() {
	if (!siteSettingsPromise) {
		siteSettingsPromise = apiClient
			.get<unknown, ProjectSiteSettings>("/site-setting")
			.catch((error) => {
				siteSettingsPromise = null;
				throw error;
			});
	}
	return siteSettingsPromise;
}

/** 项目站点设置；只在项目编辑器安装后生效 */
export function useProjectSiteSettings(): ProjectSiteSettings | null {
	const active = isProjectContentSource();
	const [settings, setSettings] = useState<ProjectSiteSettings | null>(null);

	useEffect(() => {
		if (!active) return;
		let cancelled = false;
		loadSiteSettings()
			.then((data) => {
				if (!cancelled) setSettings(data);
			})
			.catch(() => {
				// 站点设置加载失败时保持占位，不阻塞编辑器
			});
		return () => {
			cancelled = true;
		};
	}, [active]);

	return settings;
}

let authorsPromise: Promise<ProjectAuthor[]> | null = null;

function loadAuthors() {
	if (!authorsPromise) {
		authorsPromise = apiClient
			.get<unknown, ProjectAuthor[]>("/article/authors")
			.catch((error) => {
				authorsPromise = null;
				throw error;
			});
	}
	return authorsPromise;
}

/** 有已发布文章的作者；只在项目编辑器安装后生效 */
export function useProjectAuthors(): ProjectAuthor[] | null {
	const active = isProjectContentSource();
	const [authors, setAuthors] = useState<ProjectAuthor[] | null>(null);

	useEffect(() => {
		if (!active) return;
		let cancelled = false;
		loadAuthors()
			.then((data) => {
				if (!cancelled) setAuthors(data ?? []);
			})
			.catch(() => {
				if (!cancelled) setAuthors([]);
			});
		return () => {
			cancelled = true;
		};
	}, [active]);

	return active ? authors : null;
}

/** 全站最新评论；只在项目编辑器安装后生效 */
export function useProjectLatestComments(
	perPage: number,
): LatestCommentsState {
	const active = isProjectContentSource();
	const size = Math.min(Math.max(Number(perPage) || 5, 1), 100);
	const [result, setResult] = useState<{
		size: number;
		comments: ProjectLatestComment[];
		error?: string;
	} | null>(null);
	const loading = active && result?.size !== size;
	const comments = active && result?.size === size ? result.comments : null;
	const error =
		active && !loading && result?.size === size ? result.error : undefined;

	useEffect(() => {
		if (!active) return;
		let cancelled = false;
		apiClient
			.get<unknown, { list: ProjectLatestComment[]; total: number }>(
				"/comment/latest",
				{ params: { page: 1, size } },
			)
			.then((data) => {
				if (cancelled) return;
				setResult({ size, comments: data.list ?? [] });
			})
			.catch((requestError: unknown) => {
				if (cancelled) return;
				setResult({
					size,
					comments: [],
					error:
						requestError instanceof Error
							? requestError.message
							: "加载最新评论失败",
				});
			});
		return () => {
			cancelled = true;
		};
	}, [active, size]);

	return { comments, loading, error };
}

const archiveCache = new Map<string, Promise<ProjectArchiveItem[]>>();

function loadArchives(type: ArchiveGroupType) {
	let request = archiveCache.get(type);
	if (!request) {
		request = apiClient
			.get<unknown, ProjectArchiveItem[]>("/article/archives", {
				params: { type },
			})
			.catch((error) => {
				archiveCache.delete(type);
				throw error;
			});
		archiveCache.set(type, request);
	}
	return request;
}

/** 归档计数；只在项目编辑器安装后生效 */
export function useProjectArchives(type: ArchiveGroupType): ArchivesState {
	const active = isProjectContentSource();
	const [result, setResult] = useState<{
		type: ArchiveGroupType;
		items: ProjectArchiveItem[];
		error?: string;
	} | null>(null);
	const loading = active && result?.type !== type;
	const items = active && result?.type === type ? result.items : null;
	const error =
		active && !loading && result?.type === type ? result.error : undefined;

	useEffect(() => {
		if (!active) return;
		let cancelled = false;
		loadArchives(type)
			.then((data) => {
				if (!cancelled) setResult({ type, items: data ?? [] });
			})
			.catch((requestError: unknown) => {
				if (!cancelled) {
					setResult({
						type,
						items: [],
						error:
							requestError instanceof Error
								? requestError.message
								: "加载归档失败",
					});
				}
			});
		return () => {
			cancelled = true;
		};
	}, [active, type]);

	return { items, loading, error };
}

function toAdjacentPost(article: NavArticle | null | undefined): ProjectAdjacentPost | null {
	if (!article) return null;
	return {
		id: article.id,
		title: article.title,
		link: `/${projectLocale}/archive/${article.year}/${pad(article.month)}/${pad(article.day)}/${article.id}`,
	};
}

interface PrevNextResponse {
	prev: NavArticle | null;
	next: NavArticle | null;
}

/** 当前文章的上一篇/下一篇；只在项目编辑器安装后生效 */
export function useProjectAdjacentPosts(
	postId: number | null | undefined,
): ProjectAdjacentPosts | null {
	const active = isProjectContentSource();
	const [result, setResult] = useState<
		( ProjectAdjacentPosts & { postId: number } ) | null
	>(null);

	useEffect(() => {
		if (!active || !postId || postId <= 0) {
			return;
		}
		let cancelled = false;
		apiClient
			.get<unknown, PrevNextResponse>(`/article/${postId}/prev-next`)
			.then((data) => {
				if (cancelled) return;
				setResult({
					postId,
					prev: toAdjacentPost(data.prev),
					next: toAdjacentPost(data.next),
				});
			})
			.catch(() => {
				// 接口失败时保持占位，不阻塞编辑器
			});
		return () => {
			cancelled = true;
		};
	}, [active, postId]);

	if (!active || !postId || postId <= 0) return null;
	return result?.postId === postId
		? { prev: result.prev, next: result.next }
		: null;
}
