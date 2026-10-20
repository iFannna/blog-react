"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { animateScrollTo } from "./scroll";
import { useDocsMessages } from "./DocsI18nProvider";

interface TocItem {
  id: string;
  text: string;
  /** 标题层级，2 为 h2，3 为 h3 */
  level: 2 | 3;
}

const EMPTY_TOC: TocItem[] = [];
let tocSnapshot: TocItem[] = EMPTY_TOC;
let tocSnapshotKey = "";

/** 从正文提取目录。返回缓存快照，保证 useSyncExternalStore 的引用稳定。 */
function getTocSnapshot(): TocItem[] {
  if (typeof document === "undefined") return EMPTY_TOC;

  const headings = Array.from(
    document.querySelectorAll<HTMLHeadingElement>(
      ".docs-content h2, .docs-content h3",
    ),
  );

  // 同一页可能出现同名标题（例如正文的 h2 与 API 表的 h3），
  // 直接拿文本当 id 会撞车，目录的 key 也会重复，这里补递增后缀。
  const usedIds = new Set<string>();

  const items = headings.map((heading) => {
    const text = heading.textContent?.trim() ?? "";
    let id = heading.id || text;

    if (usedIds.has(id)) {
      let suffix = 1;
      while (usedIds.has(`${id}-${suffix}`)) suffix += 1;
      id = `${id}-${suffix}`;
    }

    usedIds.add(id);
    heading.id = id;

    // Heading 组件渲染的永久链接也要指向去重后的 id
    heading
      .querySelector<HTMLAnchorElement>(".docs-anchor")
      ?.setAttribute("href", `#${id}`);

    return {
      id,
      text,
      level: heading.tagName === "H2" ? (2 as const) : (3 as const),
    };
  });

  const key = items.map((item) => `${item.level}:${item.id}`).join("\n");
  if (key !== tocSnapshotKey) {
    tocSnapshotKey = key;
    tocSnapshot = items;
  }

  return tocSnapshot;
}

/**
 * 与官方文档站传入 el-anchor 的参数一致
 * （docs/.vitepress/vitepress/components/doc-content/vp-table-of-content.vue）：
 *   <el-anchor :offset="70" :bound="120">
 * offset 决定跳转后标题停在视口 70px 处（顶栏 55px + 15px 间隙），
 * bound 是高亮判定的边界值，duration 用官方默认的 300ms。
 */
const ANCHOR_OFFSET = 70;
const ANCHOR_BOUND = 120;
const SCROLL_DURATION = 300;
/**
 * 官方 selectScrollTop 默认 false，文档站也未开启：
 * 滚动到最顶部时不选中任何项，marker 因此隐藏。
 */
const SELECT_SCROLL_TOP = false;

/**
 * 目录挂在布局里，路由切换时组件不会重新挂载，
 * 因此要监听正文 DOM：新页面的标题替换进来后重新读取快照。
 * 未变化的快照引用不变，useSyncExternalStore 会直接跳过多余渲染。
 */
function subscribeToc(onChange: () => void) {
  const container = document.querySelector(".docs-content");
  if (!container) return () => {};

  const observer = new MutationObserver(() => onChange());
  observer.observe(container, { childList: true, subtree: true });

  return () => observer.disconnect();
}

/**
 * 对应官方 docs 的右侧目录（.toc-content / el-anchor）。
 *
 * 官方由 VitePress 在构建期从 markdown 提取标题，生成两级结构：
 * h2 缩进 14px，h3 再嵌一层；
 * 左侧是一条 4px 宽的滑块（.el-anchor__marker）跟随当前项移动。
 *
 * 这里改为挂载后扫描 .docs-content 里的 h2/h3，补上锚点 id。
 */
export default function DocsAside() {
  const t = useDocsMessages();
  const items = useSyncExternalStore(
    subscribeToc,
    getTocSnapshot,
    () => EMPTY_TOC,
  );
  const [activeId, setActiveId] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  // 对应官方 el-anchor 的 isScrolling：动画期间不更新高亮，否则滑块会乱跳
  const isScrollingRef = useRef(false);
  const cancelScrollRef = useRef<(() => void) | null>(null);

  /**
   * 跟随滚动高亮，逐行对应官方 el-anchor 的 getCurrentHref。
   *
   * 官方不是简单比对「标题顶部是否越过某条线」，而是：
   *   1. 给每个标题算出触发点 trigger = 标题距容器顶距离 - offset - bound
   *   2. 按 trigger 升序排列（DOM 顺序未必等于位置顺序）
   *   3. 找到 scrollTop 落在 [item.trigger, next.trigger) 区间的那一项
   *   offset=70 使跳转后标题停在视口 70px，bound=120 让高亮提前切换，
   *   两者相减即「标题滚到视口 190px 处」时切换高亮。
   */
  useEffect(() => {
    // 切换页面时中止上一次未完成的目录跳转动画，避免把新页面滚走
    cancelScrollRef.current?.();
    cancelScrollRef.current = null;
    isScrollingRef.current = false;

    if (items.length === 0) return;

    const headings = items
      .map((item) => ({ id: item.id, el: document.getElementById(item.id) }))
      .filter((entry): entry is { id: string; el: HTMLElement } => entry.el !== null);

    const pick = () => {
      // 官方在滚动动画期间跳过高亮更新，避免滑块中途乱跳
      if (isScrollingRef.current) return;

      const scrollTop = window.pageYOffset;

      // 算触发点并按位置升序
      const list = headings
        .map(({ id, el }) => ({
          id,
          // 距页面顶的绝对距离（视口内位置 + 已滚动距离）
          trigger:
            el.getBoundingClientRect().top + scrollTop - ANCHOR_OFFSET - ANCHOR_BOUND,
        }))
        .sort((a, b) => a.trigger - b.trigger);

      // 对应官方：滚到最顶部时不选中任何项（marker 隐藏）
      if (list.length > 0 && scrollTop === 0 && !SELECT_SCROLL_TOP) {
        setActiveId("");
        return;
      }

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const next = list[i + 1];

        if (item.trigger <= scrollTop && (!next || next.trigger > scrollTop)) {
          setActiveId(item.id);
          return;
        }
      }

      // 尚未到达任何触发点：官方保持上一状态；首次进入时给第一项
      setActiveId((prev) => prev || list[0]?.id || "");
    };

    pick();

    // 对应官方的 throttleByRaf
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        pick();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  /**
   * 点击目录项：用 JS 做平滑滚动，而不是浏览器原生跳转。
   *
   * 官方 el-anchor 正是这么做的（animateScrollTo + easeInOutCubic），
   * 因为 CSS 的 scroll-behavior: smooth 无法精确控制偏移量与时长。
   */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      // 接管跳转，阻止原生锚点行为
      event.preventDefault();

      // 连续点击时取消上一次动画
      if (cancelScrollRef.current) cancelScrollRef.current();

      const from = window.pageYOffset;
      const distance = target.getBoundingClientRect().top + from;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const to = Math.min(distance - ANCHOR_OFFSET, max);

      isScrollingRef.current = true;
      setActiveId(id);

      cancelScrollRef.current = animateScrollTo(
        from,
        Math.max(0, to),
        SCROLL_DURATION,
        () => {
          // 动画结束后稍等一拍再放开高亮更新，
          // 避免滚动事件的最后一帧把高亮改回去
          window.setTimeout(() => {
            isScrollingRef.current = false;
          }, 20);
        },
      );

      // 地址栏同步 hash，但不触发浏览器跳转
      window.history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  /**
   * marker 滑到当前项的位置，对应官方 el-anchor 的行为：
   * 用 inline style 写 top（不是 transform），由 CSS 的
   * transition: top 0.25s ease-in-out 负责动画；未定位到任何标题时 opacity 为 0。
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const marker = list.parentElement?.querySelector<HTMLElement>(".docs-toc__marker");
    if (!marker) return;

    if (!activeId) {
      marker.style.opacity = "0";
      return;
    }

    const link = list.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );
    if (!link) return;

    // 官方 marker 高 14px，垂直居中于 30px 高的链接：偏移 (30 - 14) / 2 = 8px
    marker.style.top = `${link.offsetTop + 8}px`;
    marker.style.opacity = "1";
  }, [activeId]);

  // 卸载时清掉未完成的滚动动画
  useEffect(() => {
    return () => {
      cancelScrollRef.current?.();
    };
  }, []);

  if (items.length === 0) return <aside className="docs-aside" />;

  return (
    <aside className="docs-aside">
      <nav className="docs-toc">
        <h3 className="docs-toc__heading">{t.tocTitle}</h3>
        <div className="docs-toc__anchor">
          <div className="docs-toc__marker" />
          <div className="docs-toc__list" ref={listRef}>
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-toc-id={item.id}
                onClick={(event) => handleClick(event, item.id)}
                className={[
                  "docs-toc__link",
                  `docs-toc__link--h${item.level}`,
                  activeId === item.id && "is-active",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
