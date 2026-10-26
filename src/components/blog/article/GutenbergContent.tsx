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
import {
	renderButtonWidth,
	renderChildLayout,
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

function createTransform(collector: RenderCollector) {
	let instanceId = 0;

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
		};
		const classNames: string[] = [];
		let style: CSSProperties | undefined = props.style;
		let styleChanged = false;

		const attributes = block.attributes as RenderableAttributes;
		const layout = renderLayout(block.name, attributes, id);
		if (layout) {
			classNames.push(layout.className);
			if (layout.css) {
				collector.css.push(layout.css);
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
				collector.css.push(duotone.css);
				collector.svgs.push(duotone.svg);
			}
		}

		const position = renderPosition(attributes, id);
		if (position) {
			classNames.push(position.className);
			collector.css.push(position.css);
		}

		const childLayout = renderChildLayout(attributes);
		if (childLayout) {
			style = mergeStyle(style, childLayout);
			styleChanged = true;
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
		}

		if (block.name === "core/tabs") {
			const tabsState = renderTabsState(
				attributes as { activeTabIndex?: unknown },
			);
			if (tabsState) {
				classNames.push(tabsState.className);
				collector.css.push(tabsState.css);
			}
		}

		if (classNames.length === 0 && !styleChanged) {
			return reactNode as ReactElement;
		}

		return cloneElement(reactNode as ReactElement<Record<string, unknown>>, {
			className: mergeClassName(props.className, classNames) || undefined,
			style,
		});
	};
}

/**
 * Gutenberg 正文渲染：区块标记本身就是可渲染的 HTML，
 * 区块注释在解析时丢弃，动态区块保存为空自然不输出。
 * 带 data-code-language 的代码块在服务端用 Shiki 着色。
 */
export default async function GutenbergContent({
	content,
}: GutenbergContentProps) {
	const languages = [...content.matchAll(CODE_LANGUAGE)].map(
		(match) => match[1],
	);
	const highlighter =
		languages.length > 0 ? await ensureLanguages(languages) : null;

	const collector: RenderCollector = {
		css: [],
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
			<div className="gutenberg-content">{body}</div>
		</>
	);
}
