"use client";

import { useState } from "react";
import { ElAnchor, ElAnchorLink } from "@/components/element-plus/anchor";
import { ElAffix } from "@/components/element-plus/affix";
import { ElRow, ElCol } from "@/components/element-plus/row";
import styles from "./anchor.module.css";

export function AnchorBasic() {
  return (
    <ElAnchor className={styles.anchor} offset={70}>
      <ElAnchorLink href="#基础用法">基础用法</ElAnchorLink>
      <ElAnchorLink href="#水平模式">水平模式</ElAnchorLink>
      <ElAnchorLink href="#滚动容器">滚动容器</ElAnchorLink>
      <ElAnchorLink
        href="#anchor-api"
        subLink={
          <>
            <ElAnchorLink href="#anchor-attributes">Anchor Attributes</ElAnchorLink>
            <ElAnchorLink href="#anchor-events">Anchor Events</ElAnchorLink>
          </>
        }
      >
        Anchor API
      </ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorHorizontal() {
  return (
    <ElAnchor className={styles.anchor} offset={70} direction="horizontal">
      <ElAnchorLink href="#基础用法">基础用法</ElAnchorLink>
      <ElAnchorLink href="#水平模式">水平模式</ElAnchorLink>
      <ElAnchorLink href="#滚动容器">滚动容器</ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorScroll() {
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <ElRow className={styles.scrollRow}>
        <ElCol span={18}>
          <div
            style={{
              height: 30,
              width: "70%",
              background: "#000",
              position: "absolute",
              top: 0,
              left: 0,
              color: "#fff",
            }}
          >
            Fixed Top Block
          </div>
          <div ref={setContainerEl} style={{ height: 300, overflowY: "auto" }}>
            <div
              id="part1"
              style={{
                height: 300,
                background: "rgba(255, 0, 0, 0.02)",
                marginTop: 30,
              }}
            >
              part1
            </div>
            <div
              id="part2"
              style={{
                height: 300,
                background: "rgba(0, 255, 0, 0.02)",
                marginTop: 30,
              }}
            >
              part2
            </div>
            <div
              id="part3"
              style={{
                height: 300,
                background: "rgba(0, 0, 255, 0.02)",
                marginTop: 30,
              }}
            >
              part3
            </div>
          </div>
        </ElCol>
        <ElCol span={6}>
          <div className="vp-raw">
            <ElAnchor
              className={styles.anchor}
              container={containerEl}
              direction="vertical"
              type="default"
              offset={30}
              onClick={(event) => event.preventDefault()}
            >
              <ElAnchorLink href="#part1" title="part1" />
              <ElAnchorLink href="#part2" title="part2" />
              <ElAnchorLink href="#part3" title="part3" />
            </ElAnchor>
          </div>
        </ElCol>
      </ElRow>
    </div>
  );
}

export function AnchorChange() {
  return (
    <ElAnchor
      className={styles.anchor}
      offset={70}
      onChange={(href) => {
        console.log("anchor change:", href);
      }}
    >
      <ElAnchorLink href="#基础用法">基础用法</ElAnchorLink>
      <ElAnchorLink href="#水平模式">水平模式</ElAnchorLink>
      <ElAnchorLink href="#滚动容器">滚动容器</ElAnchorLink>
      <ElAnchorLink
        href="#anchor-api"
        subLink={
          <>
            <ElAnchorLink href="#anchor-attributes">Anchor Attributes</ElAnchorLink>
            <ElAnchorLink href="#anchor-events">Anchor Events</ElAnchorLink>
          </>
        }
      >
        Anchor API
      </ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorUnderline() {
  return (
    <ElAnchor className={styles.anchor} type="underline" offset={70}>
      <ElAnchorLink href="#基础用法">基础用法</ElAnchorLink>
      <ElAnchorLink href="#水平模式">水平模式</ElAnchorLink>
      <ElAnchorLink href="#滚动容器">滚动容器</ElAnchorLink>
      <ElAnchorLink
        href="#anchor-api"
        subLink={
          <>
            <ElAnchorLink href="#anchor-attributes">Anchor Attributes</ElAnchorLink>
            <ElAnchorLink href="#anchor-events">Anchor Events</ElAnchorLink>
          </>
        }
      >
        Anchor API
      </ElAnchorLink>
    </ElAnchor>
  );
}

export function AnchorAffix() {
  return (
    <ElAffix offset={60}>
      <ElAnchor
        className={styles.anchor}
        offset={70}
        style={{ width: 300 }}
      >
        <ElAnchorLink href="#基础用法">基础用法</ElAnchorLink>
        <ElAnchorLink href="#水平模式">水平模式</ElAnchorLink>
        <ElAnchorLink href="#滚动容器">滚动容器</ElAnchorLink>
        <ElAnchorLink
          href="#anchor-api"
          subLink={
            <>
              <ElAnchorLink href="#anchor-attributes">Anchor Attributes</ElAnchorLink>
              <ElAnchorLink href="#anchor-events">Anchor Events</ElAnchorLink>
            </>
          }
        >
          Anchor API
        </ElAnchorLink>
      </ElAnchor>
    </ElAffix>
  );
}
