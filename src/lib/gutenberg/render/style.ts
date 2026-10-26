import type { CSSProperties } from "react";
import {
	compileCSS,
	getCSSRules,
	type Style,
} from "@/lib/gutenberg/style-engine";

/**
 * WordPress 在 render_block 阶段才补上的样式类属性：
 * background、dimensions.aspectRatio、block visibility 与样式状态。
 * 保存后的 HTML 里没有这些声明，只存在于区块注释的属性中。
 */

export type StyleTarget = "wrapper" | "button-link" | "table" | "tab-buttons";

export interface BackgroundRender {
	target: StyleTarget;
	className: string;
	style: CSSProperties;
}

export interface VisibilityRender {
	hidden?: boolean;
	className?: string;
	css?: string;
}

export interface StateRender {
	className: string;
	css: string;
}

const VIEWPORT_MEDIA: Record<string, string> = {
	"@mobile": "@media (width <= 480px)",
	"@tablet": "@media (480px < width <= 782px)",
};

const VIEWPORT_DESKTOP_MEDIA = "@media (width > 782px)";

/** 与主题 settings.visibility 一致；声明为 false 的区块不参与视口隐藏 */
const VISIBILITY_DISABLED = new Set([
	"core/accordion-heading",
	"core/accordion-panel",
	"core/block",
	"core/html",
	"core/missing",
	"core/more",
	"core/nextpage",
	"core/pattern",
	"core/shortcode",
	"core/tab-list",
]);

/** block.json selectors.root 的静态子元素映射 */
const ROOT_TARGET: Record<string, string> = {
	"core/button": " .wp-block-button__link",
	"core/image": " img",
	"core/table": " table",
	"core/tab-list": " button",
	"core/video": " video",
};

/** 与 WP_Theme_JSON::VALID_BLOCK_PSEUDO_SELECTORS 一致 */
const PSEUDO_STATES: Record<string, string[]> = {
	"core/button": [":hover", ":focus", ":focus-visible", ":active"],
};

const BACKGROUND_TARGET: Record<string, StyleTarget> = {
	"core/button": "button-link",
	"core/table": "table",
	"core/tab-list": "tab-buttons",
};

function toStyleKey(key: string): string {
	if (key.startsWith("--")) {
		return key;
	}
	if (key.startsWith("-")) {
		const camel = key
			.slice(1)
			.split("-")
			.map((part, index) =>
				index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
			)
			.join("");
		// React 需要 WebkitBackgroundClip 这类首字母大写的形式
		return camel.charAt(0).toUpperCase() + camel.slice(1);
	}
	return key;
}

function rulesToStyle(rules: ReturnType<typeof getCSSRules>): CSSProperties {
	const style: Record<string, string> = {};
	for (const rule of rules) {
		style[toStyleKey(rule.key)] = String(rule.value);
	}
	return style as CSSProperties;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** background 支持在保存时被整体跳过，需要在渲染时补回默认值 */
export function renderBackground(
	blockName: string,
	attributes: { style?: unknown },
): BackgroundRender | null {
	const style = attributes.style;
	if (!isRecord(style) || !isRecord(style.background)) {
		return null;
	}

	const background: Record<string, unknown> = { ...style.background };
	const image = background.backgroundImage;
	const gradient = background.gradient;

	if (!image && !gradient) {
		return null;
	}

	if (image) {
		if (!background.backgroundSize) {
			background.backgroundSize = "cover";
		}
		if (
			background.backgroundSize === "contain" &&
			!background.backgroundPosition
		) {
			background.backgroundPosition = "50% 50%";
		}
	}

	const rules = getCSSRules({ background } as Style);
	if (rules.length === 0) {
		return null;
	}

	const clip = background.backgroundClip;
	const hasBackground = Boolean(image) || Boolean(gradient);

	return {
		target: BACKGROUND_TARGET[blockName] ?? "wrapper",
		className: hasBackground && clip !== "text" ? "has-background" : "",
		style: rulesToStyle(rules),
	};
}

/** cover 的 dimensions.aspectRatio 同样只在渲染期输出 */
export function renderAspectRatio(
	attributes: { style?: unknown },
): CSSProperties | null {
	const style = attributes.style;
	if (!isRecord(style) || !isRecord(style.dimensions)) {
		return null;
	}
	const ratio = style.dimensions.aspectRatio;
	if (typeof ratio !== "string" && typeof ratio !== "number") {
		return null;
	}
	const value = String(ratio).trim();
	if (!value || value === "auto" || /[;{}<>]/.test(value)) {
		return null;
	}

	return {
		aspectRatio: value,
		// 显式比例优先于保存的高度设置，等价于服务端的 unset
		minHeight: "unset",
		height: "unset",
	};
}

export function renderBlockVisibility(
	blockName: string,
	attributes: { metadata?: unknown },
): VisibilityRender | null {
	const metadata = attributes.metadata;
	if (!isRecord(metadata)) {
		return null;
	}
	const visibility = metadata.blockVisibility;

	if (visibility === false) {
		return { hidden: true };
	}
	if (!isRecord(visibility) || VISIBILITY_DISABLED.has(blockName)) {
		return null;
	}
	const viewport = visibility.viewport;
	if (!isRecord(viewport)) {
		return null;
	}

	const hiddenOn: string[] = [];
	for (const [size, visible] of Object.entries(viewport)) {
		if (
			visible === false &&
			(size === "mobile" || size === "tablet" || size === "desktop")
		) {
			hiddenOn.push(size);
		}
	}
	if (hiddenOn.length === 0) {
		return null;
	}
	hiddenOn.sort();

	const className = hiddenOn
		.map((size) => `wp-block-hidden-${size}`)
		.join(" ");
	const css = hiddenOn
		.map((size) => {
			const media =
				size === "desktop"
					? VIEWPORT_DESKTOP_MEDIA
					: VIEWPORT_MEDIA[`@${size}`];
			return `${media} { .wp-block-hidden-${size} { display: none !important; } }`;
		})
		.join("\n");

	return { className, css };
}

function cleanStateStyle(style: unknown): Record<string, unknown> | null {
	if (!isRecord(style)) {
		return null;
	}
	const cleaned: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(style)) {
		if (key === "elements" || key.startsWith("@") || key.startsWith(":")) {
			continue;
		}
		cleaned[key] = value;
	}
	return Object.keys(cleaned).length > 0 ? cleaned : null;
}

/** 状态声明需要压过保存内容里的内联样式与预设工具类 */
function makeImportant(css: string | undefined): string {
	return css ? css.replace(/;/g, " !important;") : "";
}

/**
 * 把 style['@mobile']、style[':hover'] 等状态样式还原成实例级 CSS。
 * 目前只处理根级声明与 button 的伪类，theme.json 的 elements 级联留给全局样式。
 */
export function renderStateStyles(
	blockName: string,
	attributes: { style?: unknown },
	scopeClass: string,
): StateRender | null {
	const style = attributes.style;
	if (!isRecord(style)) {
		return null;
	}

	const scope = `.gutenberg-content .${scopeClass}${ROOT_TARGET[blockName] ?? ""}`;
	const pseudoStates = PSEUDO_STATES[blockName] ?? [];
	const rules: string[] = [];

	for (const pseudo of pseudoStates) {
		const stateStyle = cleanStateStyle(style[pseudo]);
		if (!stateStyle) {
			continue;
		}
		const css = compileCSS(stateStyle as Style, {
			selector: `${scope}${pseudo}`,
		});
		const important = makeImportant(css);
		if (important) {
			rules.push(important);
		}
	}

	for (const state of Object.keys(VIEWPORT_MEDIA)) {
		const viewportStyle = style[state];
		if (!isRecord(viewportStyle)) {
			continue;
		}
		const media = VIEWPORT_MEDIA[state];
		const inner: string[] = [];

		const rootStyle = cleanStateStyle(viewportStyle);
		if (rootStyle) {
			const css = makeImportant(
				compileCSS(rootStyle as Style, { selector: scope }),
			);
			if (css) {
				inner.push(css);
			}
		}

		for (const pseudo of pseudoStates) {
			const pseudoStyle = cleanStateStyle(viewportStyle[pseudo]);
			if (!pseudoStyle) {
				continue;
			}
			const css = makeImportant(
				compileCSS(pseudoStyle as Style, {
					selector: `${scope}${pseudo}`,
				}),
			);
			if (css) {
				inner.push(css);
			}
		}

		if (inner.length > 0) {
			rules.push(`${media} { ${inner.join(" ")} }`);
		}
	}

	if (rules.length === 0) {
		return null;
	}
	return { className: scopeClass, css: rules.join("\n") };
}

const GALLERY_ASPECT_RATIO = /^(auto|\d+(\.\d+)?(\s*\/\s*\d+(\.\d+)?)?)$/;

/**
 * Gallery 的 columns / imageCrop / aspectRatio 视口覆盖是区块特有属性，
 * 不走通用 style engine，按 render 回调的规则生成媒体查询。
 */
export function renderGalleryViewportStyles(
	attributes: { style?: unknown },
	scopeClass: string,
): StateRender | null {
	const style = attributes.style;
	if (!isRecord(style)) {
		return null;
	}

	const rules: string[] = [];
	const containerSelector = `.gutenberg-content .${scopeClass}.has-nested-images`;
	const imageSelector = `${containerSelector} > figure.wp-block-image img`;

	for (const state of Object.keys(VIEWPORT_MEDIA)) {
		const viewport = style[state];
		if (!isRecord(viewport)) {
			continue;
		}
		const media = VIEWPORT_MEDIA[state];
		const inner: string[] = [];

		const columns = viewport.columns;
		if (
			typeof columns === "number" &&
			Number.isInteger(columns) &&
			columns >= 1 &&
			columns <= 8
		) {
			inner.push(
				`${containerSelector} { --gb-gallery-columns: ${columns} !important; }`,
			);
		}

		const imageCrop = viewport.imageCrop;
		if (typeof imageCrop === "boolean") {
			inner.push(
				`${imageSelector} { height: ${imageCrop ? "100%" : "auto"} !important; object-fit: ${imageCrop ? "cover" : "unset"} !important; }`,
			);
		}

		const aspectRatio = viewport.aspectRatio;
		if (
			typeof aspectRatio === "string" &&
			GALLERY_ASPECT_RATIO.test(aspectRatio.trim())
		) {
			const value = aspectRatio.trim();
			inner.push(
				`${imageSelector} { aspect-ratio: ${value} !important; object-fit: ${value === "auto" ? "unset" : "cover"} !important; }`,
			);
		}

		if (inner.length > 0) {
			rules.push(`${media} { ${inner.join(" ")} }`);
		}
	}

	if (rules.length === 0) {
		return null;
	}
	return { className: scopeClass, css: rules.join("\n") };
}
