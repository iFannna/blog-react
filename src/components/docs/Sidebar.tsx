"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DocsNavGroup } from "@/lib/docs/types";

interface SidebarProps {
  groups: DocsNavGroup[];
}

/** 官方 bar 的上下各留 2px，滑块高度按这个内高计算 */
const SCROLLBAR_GAP = 4;
/** 官方 el-scrollbar 的 minSize */
const MIN_THUMB_SIZE = 20;

/**
 * 官方左侧栏用的是 el-scrollbar：原生滚动条隐藏，自绘 6px 滑块。
 * 滑块默认透明，鼠标进入侧边栏或滚动时淡入，离开后淡出。
 *
 * 这里按官方 bar.vue / thumb.vue 的公式计算滑块高度与位移，
 * 尺寸和位置才能与官方逐像素一致，而不是简单地按比例估算。
 */
export default function Sidebar({ groups }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStateRef = useRef<{
    startY: number;
    startScrollTop: number;
    thumbHeight: number;
    trackHeight: number;
  } | null>(null);
  const [barVisible, setBarVisible] = useState(false);

  const updateThumb = useCallback(() => {
    const wrap = wrapRef.current;
    const thumb = thumbRef.current;
    if (!wrap || !thumb) return;

    const offsetHeight = wrap.offsetHeight - SCROLLBAR_GAP;
    const scrollHeight = wrap.scrollHeight;

    if (scrollHeight <= wrap.clientHeight || offsetHeight <= 0) {
      scrollableRef.current = false;
      thumb.style.height = "0px";
      setBarVisible(false);
      return;
    }

    // 与官方 bar.vue 的 update() 相同：先按面积比算滑块高度，再放大到可视区
    const originalHeight = (offsetHeight * offsetHeight) / scrollHeight;
    const thumbHeight = Math.max(originalHeight, MIN_THUMB_SIZE);
    const ratio =
      originalHeight /
      (offsetHeight - originalHeight) /
      (thumbHeight / (offsetHeight - thumbHeight));
    const move = ((wrap.scrollTop * 100) / offsetHeight) * ratio;

    scrollableRef.current = true;
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${move}%)`;
  }, []);

  useEffect(() => {
    updateThumb();

    const wrap = wrapRef.current;
    const view = viewRef.current;
    if (!wrap) return;

    const observer = new ResizeObserver(updateThumb);
    observer.observe(wrap);
    if (view) observer.observe(view);
    window.addEventListener("resize", updateThumb);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateThumb);
    };
  }, [updateThumb, groups]);

  // 拖拽期间用 document 监听，鼠标移出侧边栏也能继续拖
  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const state = dragStateRef.current;
      const wrap = wrapRef.current;
      if (!state || !wrap) return;

      const thumbRange = state.trackHeight - state.thumbHeight;
      const scrollRange = wrap.scrollHeight - wrap.clientHeight;
      if (thumbRange <= 0 || scrollRange <= 0) return;

      wrap.scrollTop =
        state.startScrollTop +
        ((event.clientY - state.startY) / thumbRange) * scrollRange;
    };

    const handleUp = () => {
      if (!draggingRef.current) return;

      draggingRef.current = false;
      dragStateRef.current = null;
      if (!sidebarRef.current?.matches(":hover")) setBarVisible(false);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const handleScroll = () => {
    updateThumb();
    if (scrollableRef.current) setBarVisible(true);
  };

  const handleMouseMove = () => {
    if (!draggingRef.current && scrollableRef.current) setBarVisible(true);
  };

  const handleMouseLeave = () => {
    if (!draggingRef.current) setBarVisible(false);
  };

  const handleThumbMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const thumb = thumbRef.current;
    if (!wrap || !thumb || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    draggingRef.current = true;
    dragStateRef.current = {
      startY: event.clientY,
      startScrollTop: wrap.scrollTop,
      thumbHeight: thumb.offsetHeight,
      trackHeight: wrap.offsetHeight - SCROLLBAR_GAP,
    };
  };

  const handleTrackMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const thumb = thumbRef.current;
    if (!wrap || !thumb || event.target !== event.currentTarget) return;

    const trackHeight = event.currentTarget.offsetHeight;
    const thumbHeight = thumb.offsetHeight;
    const range = trackHeight - thumbHeight;
    if (range <= 0) return;

    const clickY = event.clientY - event.currentTarget.getBoundingClientRect().top;
    const ratio = Math.min(1, Math.max(0, (clickY - thumbHeight / 2) / range));
    wrap.scrollTop = ratio * (wrap.scrollHeight - wrap.clientHeight);
  };

  return (
    <aside
      ref={sidebarRef}
      className="docs-sidebar"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="docs-sidebar__wrap" ref={wrapRef} onScroll={handleScroll}>
        <div className="docs-sidebar__view" ref={viewRef}>
          {groups.map((group) => (
            <section className="docs-sidebar-group" key={group.title}>
              <p className="docs-sidebar-group__title">{group.title}</p>
              {group.items.map((item) => {
                const { href, title } = item;
                const isActive = pathname === href;

                const classes = [
                  "docs-sidebar-link",
                  isActive && "is-active",
                  !item.done && "is-todo",
                ]
                  .filter(Boolean)
                  .join(" ");

                // 未实现的组件不可点击，避免跳进空页面
                if (!item.done) {
                  return (
                    <span className={classes} key={href}>
                      {title}
                    </span>
                  );
                }

                return (
                  <Link className={classes} href={href} key={href}>
                    {title}
                  </Link>
                );
              })}
            </section>
          ))}
        </div>
      </div>

      <div
        className={
          barVisible
            ? "docs-sidebar__bar is-visible"
            : "docs-sidebar__bar"
        }
        aria-hidden="true"
        onMouseDown={handleTrackMouseDown}
      >
        <div
          className="docs-sidebar__thumb"
          ref={thumbRef}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </aside>
  );
}
