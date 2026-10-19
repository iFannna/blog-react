"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { useAnchorContext } from "./ElAnchor";

export interface AnchorLinkProps {
  /** 锚点链接的文字内容 */
  title?: string;
  /** 锚点的地址 */
  href?: string;
  /**
   * 子链接，对应官方 sub-link 插槽。
   * 注意：官方水平模式下不渲染 sub-link，这里保持一致。
   */
  subLink?: ReactNode;
  /** 自定义链接内容，对应官方 default 插槽，优先于 title */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElAnchorLink。
 *
 * 挂载 / 卸载 / href 变化时把自身 DOM 注册进父级 ElAnchor 的 links 表，
 * 父组件据此计算高亮与 marker 位置，因此这里每次都要同步最新的 href。
 */
export const ElAnchorLink = forwardRef<HTMLDivElement, AnchorLinkProps>(
  function ElAnchorLink(
    { title, href, subLink, children, className, style },
    ref,
  ) {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const { direction, currentAnchor, addLink, removeLink, handleClick } =
      useAnchorContext();

    useEffect(() => {
      const el = linkRef.current;
      if (!href || !el) return;

      addLink({ href, el });
      return () => {
        removeLink(href);
      };
    }, [href, addLink, removeLink]);

    const linkClassName = [
      "el-anchor__link",
      currentAnchor === href && "is-active",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className="el-anchor__item" style={style}>
        <a
          ref={linkRef}
          className={linkClassName}
          href={href}
          onClick={(event: ReactMouseEvent<HTMLAnchorElement>) =>
            handleClick(event, href)
          }
        >
          {children ?? title}
        </a>
        {/* 官方仅在垂直方向渲染 sub-link，水平模式子链接无处安放 */}
        {subLink && direction === "vertical" && (
          <div className="el-anchor__list">{subLink}</div>
        )}
      </div>
    );
  },
);
