"use client";

import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent as ReactChangeEvent,
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface LightboxImage {
	src: string;
	alt: string;
	caption?: string;
}

const ACTIVE_TAB = /^is-active-tab-(\d+)$/;

function getTabButtons(container: Element): HTMLButtonElement[] {
	const list = container.querySelector(":scope > .wp-block-tab-list");
	return list
		? Array.from(list.querySelectorAll<HTMLButtonElement>(":scope > button"))
		: [];
}

function getTabPanels(container: Element): HTMLElement[] {
	const panels = container.querySelector(":scope > .wp-block-tab-panels");
	return panels
		? Array.from(
				panels.querySelectorAll<HTMLElement>(
					":scope > .wp-block-tab-panel",
				),
			)
		: [];
}

function activateTab(
	container: Element,
	index: number,
	rootIndex: number,
	focus = false,
) {
	const buttons = getTabButtons(container);
	const panels = getTabPanels(container);
	if (buttons.length === 0) {
		return;
	}
	const active = Math.min(Math.max(index, 0), buttons.length - 1);

	for (const className of Array.from(container.classList)) {
		if (ACTIVE_TAB.test(className)) {
			container.classList.remove(className);
		}
	}
	container.classList.add(`is-active-tab-${active + 1}`);

	buttons.forEach((button, buttonIndex) => {
		const isActive = buttonIndex === active;
		button.setAttribute("aria-selected", String(isActive));
		button.tabIndex = isActive ? 0 : -1;
		if (!button.id) {
			button.id = `gb-tab-${rootIndex}-${buttonIndex}`;
		}
	});

	panels.forEach((panel, panelIndex) => {
		if (!panel.id) {
			panel.id = `gb-tab-panel-${rootIndex}-${panelIndex}`;
		}
		if (!panel.getAttribute("aria-labelledby") && buttons[panelIndex]?.id) {
			panel.setAttribute("aria-labelledby", buttons[panelIndex].id);
		}
		panel.setAttribute("aria-hidden", String(panelIndex !== active));
	});

	if (focus) {
		buttons[active].focus();
	}
}

function getAccordionToggle(item: Element): HTMLButtonElement | null {
	return item.querySelector<HTMLButtonElement>(
		".wp-block-accordion-heading__toggle",
	);
}

function setAccordionOpen(item: Element, open: boolean) {
	item.classList.toggle("is-open", open);
	const toggle = getAccordionToggle(item);
	const panel = item.querySelector(":scope > .wp-block-accordion-panel");
	toggle?.setAttribute("aria-expanded", String(open));
	panel?.setAttribute("aria-hidden", String(!open));
}

export default function GutenbergInteractions({
	children,
}: {
	children: ReactNode;
}) {
	const rootRef = useRef<HTMLDivElement>(null);
	const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);

	// 初始化 Tabs 与 Accordion 的初始可见状态和 ARIA 关系
	useEffect(() => {
		const root = rootRef.current;
		if (!root) {
			return;
		}

		root.querySelectorAll<HTMLElement>(".wp-block-tabs").forEach(
			(container, rootIndex) => {
				const buttons = getTabButtons(container);
				if (buttons.length === 0) {
					return;
				}
				container.dataset.gbTabsIndex = String(rootIndex);
				let active = 0;
				for (const className of Array.from(container.classList)) {
					const match = ACTIVE_TAB.exec(className);
					if (match) {
						active = Number(match[1]) - 1;
					}
				}
				if (!Number.isFinite(active) || active < 0 || active >= buttons.length) {
					active = 0;
				}

				const list = container.querySelector(":scope > .wp-block-tab-list");
				if (list && !list.getAttribute("role")) {
					list.setAttribute("role", "tablist");
				}
				buttons.forEach((button, index) => {
					button.type = "button";
					if (!button.getAttribute("role")) {
						button.setAttribute("role", "tab");
					}
					if (!button.id) {
						button.id = `gb-tab-${rootIndex}-${index}`;
					}
				});
				getTabPanels(container).forEach((panel, index) => {
					if (!panel.getAttribute("role")) {
						panel.setAttribute("role", "tabpanel");
					}
					if (!panel.id) {
						panel.id = `gb-tab-panel-${rootIndex}-${index}`;
					}
					if (buttons[index]?.id) {
						buttons[index].setAttribute(
							"aria-controls",
							panel.id,
						);
					}
				});
				activateTab(container, active, rootIndex);
			},
		);

		root.querySelectorAll<HTMLElement>(".wp-block-accordion-item").forEach(
			(item, index) => {
				const toggle = getAccordionToggle(item);
				const panel =
					item.querySelector<HTMLElement>(
						":scope > .wp-block-accordion-panel",
					);
				if (!toggle) {
					return;
				}
				toggle.type = "button";
				if (!toggle.id) {
					toggle.id = `gb-accordion-toggle-${index}`;
				}
				if (panel) {
					if (!panel.id) {
						panel.id = `gb-accordion-panel-${index}`;
					}
					toggle.setAttribute("aria-controls", panel.id);
					panel.setAttribute("aria-labelledby", toggle.id);
				}
				setAccordionOpen(item, item.classList.contains("is-open"));
			},
		);

		root.querySelectorAll<HTMLImageElement>(
			"[data-gb-lightbox] img",
		).forEach((image) => {
			if (!image.hasAttribute("tabindex")) {
				image.tabIndex = 0;
			}
			if (!image.getAttribute("role")) {
				image.setAttribute("role", "button");
			}
			if (!image.getAttribute("aria-label")) {
				image.setAttribute(
					"aria-label",
					image.alt ? `预览图片：${image.alt}` : "预览图片",
				);
			}
		});
	}, []);

	// Lightbox 打开期间锁定滚动、处理 Esc 并把焦点还给触发图片
	useEffect(() => {
		if (!lightbox) {
			return;
		}
		const trigger = triggerRef.current;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				setLightbox(null);
			}
		};
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
			trigger?.focus?.();
		};
	}, [lightbox]);

	const openLightbox = (image: HTMLImageElement) => {
		triggerRef.current = image;
		const figure = image.closest("figure");
		const caption = figure?.querySelector("figcaption")?.textContent?.trim();
		setLightbox({
			src: image.currentSrc || image.src,
			alt: image.alt,
			caption: caption || undefined,
		});
	};

	const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;

		const tabButton = target.closest<HTMLButtonElement>(
			".wp-block-tab-list > button",
		);
		if (tabButton) {
			const container = tabButton.closest<HTMLElement>(".wp-block-tabs");
			if (container) {
				event.preventDefault();
				const buttons = getTabButtons(container);
				activateTab(
					container,
					buttons.indexOf(tabButton),
					Number(container.dataset.gbTabsIndex ?? 0),
				);
			}
			return;
		}

		const accordionToggle = target.closest<HTMLButtonElement>(
			".wp-block-accordion-heading__toggle",
		);
		if (accordionToggle) {
			event.preventDefault();
			const item = accordionToggle.closest<HTMLElement>(
				".wp-block-accordion-item",
			);
			if (item) {
				const willOpen = !item.classList.contains("is-open");
				setAccordionOpen(item, willOpen);
				const accordion = item.closest<HTMLElement>(".wp-block-accordion");
				if (willOpen && accordion?.dataset.autoclose === "true") {
					accordion
						.querySelectorAll<HTMLElement>(
							":scope > .wp-block-accordion-item.is-open",
						)
						.forEach((sibling) => {
							if (sibling !== item) {
								setAccordionOpen(sibling, false);
							}
						});
				}
			}
			return;
		}

		const image = target.closest<HTMLImageElement>("img");
		if (
			image &&
			image.closest("[data-gb-lightbox]") &&
			rootRef.current?.contains(image)
		) {
			event.preventDefault();
			openLightbox(image);
		}
	};

	// 归档、分类下拉在选中后跳转到对应归档/术语页
	const handleChange = (event: ReactChangeEvent<HTMLDivElement>) => {
		const select = (event.target as HTMLElement).closest<HTMLSelectElement>(
			".wp-block-archives-dropdown select, .wp-block-categories-dropdown select",
		);
		if (select?.value) {
			window.location.assign(select.value);
		}
	};

	const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
		const target = event.target as HTMLElement;

		const lightboxImage = target.closest<HTMLImageElement>(
			"[data-gb-lightbox] img",
		);
		if (
			lightboxImage &&
			(event.key === "Enter" || event.key === " ")
		) {
			event.preventDefault();
			openLightbox(lightboxImage);
			return;
		}

		const tabButton = target.closest<HTMLButtonElement>(
			".wp-block-tab-list > button",
		);
		if (!tabButton) {
			return;
		}
		const container = tabButton.closest<HTMLElement>(".wp-block-tabs");
		if (!container) {
			return;
		}
		const buttons = getTabButtons(container);
		const index = buttons.indexOf(tabButton);
		let nextIndex: number | null = null;

		switch (event.key) {
			case "ArrowRight":
				nextIndex = (index + 1) % buttons.length;
				break;
			case "ArrowLeft":
				nextIndex = (index - 1 + buttons.length) % buttons.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = buttons.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		activateTab(
			container,
			nextIndex,
			Number(container.dataset.gbTabsIndex ?? 0),
			true,
		);
	};

	return (
		<div
			ref={rootRef}
			className="gutenberg-content"
			onClick={handleClick}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		>
			{children}
			{lightbox &&
				createPortal(
					<div
						className="gb-lightbox"
						role="dialog"
						aria-modal="true"
						aria-label="图片预览"
						onMouseDown={(event) => {
							if (event.target === event.currentTarget) {
								setLightbox(null);
							}
						}}
						onKeyDown={(event) => {
							// 灯箱内只有关闭按钮可聚焦，Tab 保持在对话框内
							if (event.key === "Tab") {
								event.preventDefault();
								closeButtonRef.current?.focus();
							}
						}}
					>
						<button
							ref={closeButtonRef}
							type="button"
							className="gb-lightbox__close"
							aria-label="关闭图片预览"
							onClick={() => setLightbox(null)}
						>
							×
						</button>
						<figure className="gb-lightbox__figure">
							<img
								className="gb-lightbox__image"
								src={lightbox.src}
								alt={lightbox.alt}
							/>
							{lightbox.caption && (
								<figcaption className="gb-lightbox__caption">
									{lightbox.caption}
								</figcaption>
							)}
						</figure>
					</div>,
					document.body,
				)}
		</div>
	);
}
