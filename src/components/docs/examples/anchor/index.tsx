"use client";

import { useState } from "react";
import { ElAnchor, ElAnchorLink } from "@/components/ui/anchor";
import { ElAffix } from "@/components/ui/affix";
import { ElRow, ElCol } from "@/components/ui/row";

/**
 * 官方示例的 href 由 locale 生成（如 #basic-usage），指向文档页自身章节。
 * 本页章节 id 与官方保持一致（见 page.tsx 里 Heading 的显式 id），
 * 因此这里的 href 与官方示例完全相同。
 */
export function AnchorBasic() {
  return (
    <ElAnchor offset={70}>
      <ElAnchorLink href="#basic-usage">基础用法</ElAnchorLink>
      <ElAnchorLink href="#horizontal-mode">水平模式</ElAnchorLink>
      <ElAnchorLink href="#scroll-container">滚动容器</ElAnchorLink>
      <ElAnchorLink
        href="#change"
        subLink={
          <>
            <ElAnchorLink href="#underline">下划线类型</ElAnchorLink>
            <ElAnchorLink href="#affix">固定模式</ElAnchorLink>
          </>
        }
      >
        锚点链接变化
      </ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorHorizontal() {
  return (
    <ElAnchor offset={70} direction="horizontal">
      <ElAnchorLink href="#basic-usage">基础用法</ElAnchorLink>
      <ElAnchorLink href="#horizontal-mode">水平模式</ElAnchorLink>
      <ElAnchorLink href="#scroll-container">滚动容器</ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorScroll() {
  // 滚动容器必须以元素形式传给 ElAnchor，故用 state 承接 ref 回调
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "70%",
          height: 30,
          background: "var(--el-text-color-primary)",
          color: "var(--el-bg-color)",
        }}
      >
        固定顶部区块
      </div>
      <ElRow>
        <ElCol span={18}>
          <div ref={setContainerEl} style={{ height: 300, overflowY: "auto" }}>
            <div
              id="part1"
              style={{
                height: 300,
                marginTop: 30,
                background: "var(--el-color-danger-light-9)",
              }}
            >
              part1
            </div>
            <div
              id="part2"
              style={{
                height: 300,
                marginTop: 30,
                background: "var(--el-color-success-light-9)",
              }}
            >
              part2
            </div>
            <div
              id="part3"
              style={{
                height: 300,
                marginTop: 30,
                background: "var(--el-color-primary-light-9)",
              }}
            >
              part3
            </div>
          </div>
        </ElCol>
        <ElCol span={6}>
          <ElAnchor
            container={containerEl}
            direction="vertical"
            type="default"
            offset={30}
            // 官方示例在此阻止默认跳转，本组件与官方一致不做 preventDefault
            onClick={(event) => event.preventDefault()}
          >
            <ElAnchorLink href="#part1" title="part1" />
            <ElAnchorLink href="#part2" title="part2" />
            <ElAnchorLink href="#part3" title="part3" />
          </ElAnchor>
        </ElCol>
      </ElRow>
    </div>
  );
}

export function AnchorChange() {
  return (
    <ElAnchor
      offset={70}
      onChange={(href) => {
        console.log("anchor change:", href);
      }}
    >
      <ElAnchorLink href="#basic-usage">基础用法</ElAnchorLink>
      <ElAnchorLink href="#horizontal-mode">水平模式</ElAnchorLink>
      <ElAnchorLink href="#scroll-container">滚动容器</ElAnchorLink>
      <ElAnchorLink
        href="#change"
        subLink={
          <>
            <ElAnchorLink href="#underline">下划线类型</ElAnchorLink>
            <ElAnchorLink href="#affix">固定模式</ElAnchorLink>
          </>
        }
      >
        锚点链接变化
      </ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorUnderline() {
  return (
    <ElAnchor type="underline" offset={70}>
      <ElAnchorLink href="#basic-usage">基础用法</ElAnchorLink>
      <ElAnchorLink href="#horizontal-mode">水平模式</ElAnchorLink>
      <ElAnchorLink href="#scroll-container">滚动容器</ElAnchorLink>
      <ElAnchorLink
        href="#change"
        subLink={
          <>
            <ElAnchorLink href="#underline">下划线类型</ElAnchorLink>
            <ElAnchorLink href="#affix">固定模式</ElAnchorLink>
          </>
        }
      >
        锚点链接变化
      </ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorAffix() {
  return (
    <ElAffix offset={60}>
      <ElAnchor offset={70} style={{ width: 300 }}>
        <ElAnchorLink href="#basic-usage">基础用法</ElAnchorLink>
        <ElAnchorLink href="#horizontal-mode">水平模式</ElAnchorLink>
        <ElAnchorLink href="#scroll-container">滚动容器</ElAnchorLink>
        <ElAnchorLink
          href="#change"
          subLink={
            <>
              <ElAnchorLink href="#underline">下划线类型</ElAnchorLink>
              <ElAnchorLink href="#affix">固定模式</ElAnchorLink>
            </>
          }
        >
          锚点链接变化
        </ElAnchorLink>
      </ElAnchor>
    </ElAffix>
  );
}
