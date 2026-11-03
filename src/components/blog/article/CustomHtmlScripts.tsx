"use client";

import { useEffect, useRef, type ReactNode } from "react";

export interface CustomHtmlScript {
	code: string;
	src: string;
	type: string;
	async: boolean;
	defer: boolean;
}

interface CustomHtmlScriptsProps {
	scripts: CustomHtmlScript[];
	children: ReactNode;
}

/**
 * 自定义 HTML 的脚本在挂载后按顺序执行。
 * 服务端会剥离 script 标签，避免首次加载和客户端各执行一次。
 */
export default function CustomHtmlScripts({
	scripts,
	children,
}: CustomHtmlScriptsProps) {
	const lastScriptsRef = useRef<CustomHtmlScript[] | null>(null);

	useEffect(() => {
		if (scripts.length === 0 || lastScriptsRef.current === scripts) {
			return;
		}
		lastScriptsRef.current = scripts;
		let cancelled = false;
		const nodes: HTMLScriptElement[] = [];

		const run = async () => {
			for (const script of scripts) {
				if (cancelled) {
					return;
				}
				const element = document.createElement("script");
				if (script.type) {
					element.type = script.type;
				}
				if (script.async) {
					element.async = true;
				}
				if (script.defer) {
					element.defer = true;
				}
				const external = Boolean(script.src);
				const loaded = external
					? new Promise<void>((resolve) => {
							const timer = window.setTimeout(resolve, 10_000);
							element.addEventListener(
								"load",
								() => {
									window.clearTimeout(timer);
									resolve();
								},
								{ once: true },
							);
							element.addEventListener(
								"error",
								() => {
									window.clearTimeout(timer);
									resolve();
								},
								{ once: true },
							);
						})
					: Promise.resolve();
				if (external) {
					element.src = script.src;
				} else {
					element.text = script.code;
				}
				document.body.appendChild(element);
				nodes.push(element);
				await loaded;
			}
		};

		void run();

		return () => {
			cancelled = true;
			for (const node of nodes) {
				node.remove();
			}
		};
	}, [scripts]);

	return <>{children}</>;
}
