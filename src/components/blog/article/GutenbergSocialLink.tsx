"use client";

import variations from "@/components/gutenberg/block-library/social-link/variations";
import { ChainIcon } from "@/components/gutenberg/block-library/social-link/icons";

interface GutenbergSocialLinkProps {
  service: string;
  url: string;
  label: string;
  rel?: string;
}

/**
 * 社交图标依赖编辑器里的 SVG 组件，只能在客户端模块里使用；
 * 由正文渲染器传入纯字符串属性，服务端首帧仍会输出完整 <li>。
 */
export default function GutenbergSocialLink({
  service,
  url,
  label,
  rel,
}: GutenbergSocialLinkProps) {
  const variation = variations.find((item) => item.name === service);
  const Icon = variation?.icon ?? ChainIcon;
  const text = label || variation?.title || service;

  return (
    <li className={`wp-social-link wp-social-link-${service || "chain"}`}>
      <a
        className="wp-block-social-link-anchor"
        href={url || "#"}
        rel={rel || undefined}
      >
        <Icon />
        <span className="wp-block-social-link-label screen-reader-text">
          {text}
        </span>
      </a>
    </li>
  );
}
