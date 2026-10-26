import {
	cloneElement,
	Fragment,
	isValidElement,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
} from "react";
import parse, {
	attributesToProps,
	Element,
	type DOMNode,
	type HTMLReactParserOptions,
} from "html-react-parser";
import type { HighlighterCore } from "shiki/core";
import {
	ensureLanguages,
	highlightTokens,
	type HighlightToken,
} from "@/lib/highlight";
import {
	getBlockGapCssValue,
	renderLayout,
	type RenderableAttributes,
} from "@/lib/gutenberg/render/layout";
import { renderDuotone } from "@/lib/gutenberg/render/duotone";
import GutenbergInteractions from "./GutenbergInteractions";
import {
	renderAspectRatio,
	renderBackground,
	renderBlockVisibility,
	renderGalleryViewportStyles,
	renderStateStyles,
} from "@/lib/gutenberg/render/style";
import {
	renderButtonWidth,
	renderChildLayout,
	renderChildStateLayout,
	renderPosition,
	renderTabsState,
} from "@/lib/gutenberg/render/support";

const CODE_LANGUAGE = /data-code-language="([^"]+)"/g;

interface GutenbergContentProps {
	content: string;
}

interface ParsedBlock {
	name: string;
	attributes: Record<string, unknown>;
}

interface RenderCollector {
	css: string[];
	cssKeys: Set<string>;
	svgs: string[];
	duotoneIds: Set<string>;
}

function renderTokens(tokens: HighlightToken[][]) {
	return tokens.map((line, lineIndex) => (
		<Fragment key={lineIndex}>
			{line.map((token, tokenIndex) => (
				<span key={tokenIndex} style={token.style}>
					{token.content}
				</span>
			))}
			{lineIndex < tokens.length - 1 && "\n"}
		</Fragment>
	));
}

function nodeText(node: unknown): string {
	if (!node || typeof node !== "object") {
		return "";
	}
	const current = node as {
		type?: string;
		data?: unknown;
		children?: unknown[];
	};
	if (current.type === "text") {
		return typeof current.data === "string" ? current.data : "";
	}
	if (Array.isArray(current.children)) {
		return current.children.map(nodeText).join("");
	}
	return "";
}

function createReplace(highlighter: HighlighterCore) {
	return function replaceCode(domNode: DOMNode): ReactElement | void {
		if (!(domNode instanceof Element) || domNode.name !== "pre") {
			return;
		}
		const language = domNode.attribs["data-code-language"];
		if (!language) {
			return;
		}
		const codeNode = domNode.children.find(
			(child): child is Element =>
				child instanceof Element && child.name === "code",
		);
		if (!codeNode) {
			return;
		}
		const label = language.charAt(0).toUpperCase() + language.slice(1);

		return (
			<div className="typo-code-wrapper">
				<span className="typo-code-lang">{label}</span>
				<pre {...attributesToProps(domNode.attribs, domNode.name)}>
					<code {...attributesToProps(codeNode.attribs, codeNode.name)}>
						{renderTokens(
							highlightTokens(highlighter, nodeText(codeNode), language),
						)}
					</code>
				</pre>
			</div>
		);
	};
}

/**
 * 读取元素前一个区块注释里的名称与属性。布局、duotone、position 等
 * 属性由编辑器在运行时补进 DOM，不写入保存内容，需要在这里还原。
 */
function readBlock(domNode: Element): ParsedBlock | null {
	let previous = domNode.prev;
	while (previous && previous.type === "text" && !previous.data.trim()) {
		previous = previous.prev;
	}
	if (!previous || previous.type !== "comment") {
		return null;
	}
	const data = typeof previous.data === "string" ? previous.data : "";
	const match = /^\s*wp:([\w/-]+)(?:\s+(\{[\s\S]*\}))?\s*\/?\s*$/.exec(data);
	if (!match) {
		return null;
	}
	let attributes: Record<string, unknown> = {};
	if (match[2]) {
		try {
			const parsed = JSON.parse(match[2]);
			if (parsed && typeof parsed === "object") {
				attributes = parsed as Record<string, unknown>;
			}
		} catch {
			return null;
		}
	}
	// 核心区块注释省略 core/ 前缀，例如 wp:button、wp:image。
	const name = match[1].includes("/") ? match[1] : `core/${match[1]}`;
	return { name, attributes };
}

function mergeClassName(existing: unknown, additions: string[]): string {
	const names = new Set(
		String(existing ?? "")
			.split(/\s+/)
			.filter(Boolean),
	);
	for (const addition of additions) {
		for (const name of addition.split(/\s+/).filter(Boolean)) {
			names.add(name);
		}
	}
	return [...names].join(" ");
}

function mergeStyle(
	existing: CSSProperties | undefined,
	addition: CSSProperties | undefined,
): CSSProperties | undefined {
	if (!addition || Object.keys(addition).length === 0) {
		return existing;
	}
	return { ...(existing ?? {}), ...addition };
}

/** 把区块级样式应用到内部目标元素（button 链接、table、tab 按钮） */
function applyToChildren(
	node: ReactNode,
	tags: string[],
	className: string,
	style: CSSProperties,
): ReactNode {
	if (Array.isArray(node)) {
		return node.map((child) => applyToChildren(child, tags, className, style));
	}
	if (
		isValidElement(node) &&
		typeof node.type === "string" &&
		tags.includes(node.type)
	) {
		const props = node.props as {
			className?: string;
			style?: CSSProperties;
		};
		return cloneElement(node as ReactElement<Record<string, unknown>>, {
			className:
				mergeClassName(props.className, className ? [className] : []) ||
				undefined,
			style: mergeStyle(props.style, style),
		});
	}
	return node;
}

function blockSuffix(blockName: string): string {
	return blockName.startsWith("core/")
		? blockName.slice("core/".length)
		: blockName.replace(/\//g, "-");
}

function createTransform(collector: RenderCollector) {
	let instanceId = 0;

	const addCss = (css: string) => {
		if (!css || collector.cssKeys.has(css)) {
			return;
		}
		collector.cssKeys.add(css);
		collector.css.push(css);
	};

	return function applyBlockAttributes(
		reactNode: ReactNode,
		domNode: DOMNode,
	): ReactElement | string {
		// transform 的返回值会替换节点，未命中的节点必须原样返回
		if (typeof reactNode === "string") {
			return reactNode;
		}
		if (!(domNode instanceof Element) || !isValidElement(reactNode)) {
			return reactNode as ReactElement;
		}

		const block = readBlock(domNode);
		if (!block) {
			return reactNode as ReactElement;
		}
		const id = ++instanceId;

		const props = reactNode.props as {
			className?: string;
			style?: CSSProperties;
			children?: ReactNode;
		};
		const classNames: string[] = [];
		let style: CSSProperties | undefined = props.style;
		let styleChanged = false;
		let children = props.children;
		let childrenChanged = false;

		const attributes = block.attributes as RenderableAttributes;
		const extraProps: Record<string, string> = {};

		// 交互所需的运行期标记：accordion 自动收起、image 灯箱开关
		if (
			block.name === "core/accordion" &&
			typeof attributes.autoclose === "boolean"
		) {
			extraProps["data-autoclose"] = attributes.autoclose
				? "true"
				: "false";
		}
		const lightbox = attributes.lightbox;
		if (
			block.name === "core/image" &&
			lightbox &&
			typeof lightbox === "object" &&
			(lightbox as { enabled?: unknown }).enabled === true
		) {
			extraProps["data-gb-lightbox"] = "true";
		}

		// metadata.blockVisibility 为 false 时前端不输出该区块
		const visibility = renderBlockVisibility(
			block.name,
			attributes as { metadata?: unknown },
		);
		if (visibility?.hidden) {
			return "";
		}
		if (visibility?.className) {
			classNames.push(visibility.className);
			if (visibility.css) {
				addCss(visibility.css);
			}
		}

		const layout = renderLayout(block.name, attributes, id);
		if (layout) {
			classNames.push(layout.className);
			if (layout.css) {
				addCss(layout.css);
			}
		}

		const duotone = renderDuotone(
			block.name,
			attributes as Parameters<typeof renderDuotone>[1],
		);
		if (duotone) {
			classNames.push(duotone.className);
			if (!collector.duotoneIds.has(duotone.id)) {
				collector.duotoneIds.add(duotone.id);
				addCss(duotone.css);
				collector.svgs.push(duotone.svg);
			}
		}

		const position = renderPosition(attributes, id);
		if (position) {
			classNames.push(position.className);
			addCss(position.css);
		}

		// background 在保存时整体跳过；button/table/tab-list 作用在内部元素上
		const background = renderBackground(block.name, attributes);
		if (background) {
			if (background.target === "wrapper") {
				if (background.className) {
					classNames.push(background.className);
				}
				style = mergeStyle(style, background.style);
				styleChanged = true;
			} else {
				const tags =
					background.target === "table"
						? ["table"]
						: background.target === "tab-buttons"
							? ["button"]
							: ["a", "button"];
				children = applyToChildren(
					children,
					tags,
					background.className,
					background.style,
				);
				childrenChanged = true;
			}
		}

		const aspectRatio = renderAspectRatio(attributes);
		if (aspectRatio) {
			style = mergeStyle(style, aspectRatio);
			styleChanged = true;
		}

		const stateStyles = renderStateStyles(
			block.name,
			attributes,
			`wp-container-state-${blockSuffix(block.name)}-${id}`,
		);
		if (stateStyles) {
			classNames.push(stateStyles.className);
			addCss(stateStyles.css);
		}

		const childLayout = renderChildLayout(attributes);
		if (childLayout) {
			style = mergeStyle(style, childLayout);
			styleChanged = true;
		}

		const childStateLayout = renderChildStateLayout(
			attributes as { style?: Record<string, unknown> },
			`wp-container-child-state-${id}`,
		);
		if (childStateLayout) {
			classNames.push(childStateLayout.className);
			addCss(childStateLayout.css);
		}

		if (block.name === "core/button") {
			const width = renderButtonWidth(attributes);
			if (width) {
				classNames.push(width.className);
				style = mergeStyle(style, width.style);
				styleChanged = true;
			}
		}

		if (block.name === "core/gallery") {
			const gap = getBlockGapCssValue(attributes, "column");
			if (gap) {
				style = mergeStyle(style, {
					"--gb-gallery-gap": gap,
				} as CSSProperties);
				styleChanged = true;
			}

			const galleryViewport = renderGalleryViewportStyles(
				attributes,
				`wp-container-gallery-state-${id}`,
			);
			if (galleryViewport) {
				classNames.push(galleryViewport.className);
				addCss(galleryViewport.css);
			}
		}

		if (block.name === "core/tabs") {
			const tabsState = renderTabsState(
				attributes as { activeTabIndex?: unknown },
			);
			if (tabsState) {
				classNames.push(tabsState.className);
				addCss(tabsState.css);
			}
		}

		if (
			classNames.length === 0 &&
			!styleChanged &&
			!childrenChanged &&
			Object.keys(extraProps).length === 0
		) {
			return reactNode as ReactElement;
		}

		return cloneElement(reactNode as ReactElement<Record<string, unknown>>, {
			className: mergeClassName(props.className, classNames) || undefined,
			style,
			...(childrenChanged ? { children } : {}),
			...extraProps,
		});
	};
}

/**
 * Gutenberg 正文渲染：区块标记本身就是可渲染的 HTML，
 * 区块注释在解析时丢弃，动态区块保存为空自然不输出。
 * 带 data-code-language 的代码块在服务端用 Shiki 着色。
 */
export default async function GutenbergContent({
	content = "",
}: GutenbergContentProps) {
	const languages = [...content.matchAll(CODE_LANGUAGE)].map(
		(match) => match[1],
	);
	// 语言包加载失败只影响代码着色，不应让整篇文章报错
	const highlighter =
		languages.length > 0
			? await ensureLanguages(languages).catch(() => null)
			: null;

	const collector: RenderCollector = {
		css: [],
		cssKeys: new Set(),
		svgs: [],
		duotoneIds: new Set(),
	};

	let body: ReactNode;

	try {
		const options: HTMLReactParserOptions = {
			replace: highlighter ? createReplace(highlighter) : undefined,
			transform: createTransform(collector),
		};
		body = parse(content, options);
	} catch {
		body = <pre className="gutenberg-content__fallback">{content}</pre>;
	}

	const css = collector.css.join("\n");
	const svg = collector.svgs.join("");

	return (
		<>
			{/* 区块库样式是 public 下的静态资源，只能手动挂载 */}
			{/* eslint-disable-next-line @next/next/no-css-tags */}
			<link
				rel="stylesheet"
				href="/canvas/block-library.css"
				precedence="gutenberg-blocks"
			/>
			{css && <style dangerouslySetInnerHTML={{ __html: css }} />}
			{svg && (
				<div
					className="gutenberg-content__svg-defs"
					aria-hidden="true"
					dangerouslySetInnerHTML={{ __html: svg }}
				/>
			)}
			<GutenbergInteractions>{body}</GutenbergInteractions>
		</>
	);
}
