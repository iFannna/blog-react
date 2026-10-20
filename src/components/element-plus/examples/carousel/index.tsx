"use client";

import type { CSSProperties, ReactNode } from "react";
import { ElCarousel, ElCarouselItem } from "@/components/element-plus/carousel";

/**
 * 示例里的幻灯片底色与文字色取自官方 demo 的 scoped 样式，
 * 属于演示内容而非组件样式，故按官方原值内联。
 */
const ITEM_BG_EVEN = "#99a9bf";
const ITEM_BG_ODD = "#d3dce6";

const demonstration: CSSProperties = {
  color: "var(--el-text-color-secondary)",
};

const centered: CSSProperties = {
  textAlign: "center",
};

/** 官方示例统一用奇偶项交替底色，第 1 项为浅蓝灰 */
function itemStyle(index: number): CSSProperties {
  return { backgroundColor: index % 2 === 0 ? ITEM_BG_EVEN : ITEM_BG_ODD };
}

/** 官方 h3 在各示例里都靠 text-2xl + justify-center 居中，这里统一成 flex 居中 */
function ItemTitle({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        margin: 0,
        fontSize: 24,
        color: "#475669",
        opacity: 0.75,
      }}
    >
      {children}
    </h3>
  );
}

const FOUR = [1, 2, 3, 4];

export function CarouselBasic() {
  return (
    <div>
      <div style={centered}>
        <span style={demonstration}>
          Switch when indicator is hovered (default)
        </span>
        <ElCarousel height="150px">
          {FOUR.map((item) => (
            <ElCarouselItem key={item} style={itemStyle(item)}>
              <ItemTitle>{item}</ItemTitle>
            </ElCarouselItem>
          ))}
        </ElCarousel>
      </div>

      <div style={{ ...centered, marginTop: 16 }}>
        <span style={demonstration}>Switch when indicator is clicked</span>
        <ElCarousel trigger="click" height="150px">
          {FOUR.map((item) => (
            <ElCarouselItem key={item} style={itemStyle(item)}>
              <ItemTitle>{item}</ItemTitle>
            </ElCarouselItem>
          ))}
        </ElCarousel>
      </div>
    </div>
  );
}

export function CarouselMotionBlur() {
  return (
    <div>
      <div style={centered}>
        <span style={demonstration}>Motion blur the switch (default)</span>
        <ElCarousel height="200px" motionBlur>
          {FOUR.map((item) => (
            <ElCarouselItem key={item} style={itemStyle(item)}>
              <ItemTitle>{item}</ItemTitle>
            </ElCarouselItem>
          ))}
        </ElCarousel>
      </div>

      <p style={{ ...demonstration, textAlign: "center" }}>Vertical effect</p>
      <ElCarousel
        height="200px"
        direction="vertical"
        motionBlur
        autoplay={false}
      >
        {FOUR.map((item) => (
          <ElCarouselItem key={item} style={itemStyle(item)}>
            <ItemTitle>{item}</ItemTitle>
          </ElCarouselItem>
        ))}
      </ElCarousel>
    </div>
  );
}

export function CarouselIndicator() {
  return (
    <ElCarousel indicatorPosition="outside">
      {FOUR.map((item) => (
        <ElCarouselItem key={item} style={itemStyle(item)}>
          <ItemTitle>{item}</ItemTitle>
        </ElCarouselItem>
      ))}
    </ElCarousel>
  );
}

export function CarouselArrows() {
  return (
    <ElCarousel interval={5000} arrow="always">
      {FOUR.map((item) => (
        <ElCarouselItem key={item} style={itemStyle(item)}>
          <ItemTitle>{item}</ItemTitle>
        </ElCarouselItem>
      ))}
    </ElCarousel>
  );
}

const AUTO_HEIGHT_ITEMS = [100, 200, 300];

export function CarouselAutoHeight() {
  return (
    <div style={{ height: 300, ...centered }}>
      <span style={demonstration}>
        each carousel-item has a different height
      </span>
      <ElCarousel height="auto" autoplay>
        {AUTO_HEIGHT_ITEMS.map((item, index) => (
          <ElCarouselItem
            key={item}
            style={{ ...itemStyle(index + 1), height: `${item}px` }}
          >
            <ItemTitle>{`height ${item}px`}</ItemTitle>
          </ElCarouselItem>
        ))}
      </ElCarousel>
    </div>
  );
}

const SIX = [1, 2, 3, 4, 5, 6];

export function CarouselCard() {
  return (
    <ElCarousel interval={4000} type="card" height="200px">
      {SIX.map((item) => (
        <ElCarouselItem key={item} style={itemStyle(item)}>
          <ItemTitle>{item}</ItemTitle>
        </ElCarouselItem>
      ))}
    </ElCarousel>
  );
}

export function CarouselVertical() {
  return (
    <div>
      <p style={{ ...demonstration, textAlign: "center", marginTop: 0 }}>
        normal vertical layout
      </p>
      <ElCarousel height="200px" direction="vertical" autoplay={false}>
        {FOUR.map((item) => (
          <ElCarouselItem key={item} style={itemStyle(item)}>
            <ItemTitle>{item}</ItemTitle>
          </ElCarouselItem>
        ))}
      </ElCarousel>

      <p style={{ ...demonstration, textAlign: "center" }}>
        card vertical layout
      </p>
      <ElCarousel
        height="400px"
        direction="vertical"
        type="card"
        autoplay={false}
      >
        {FOUR.map((item) => (
          <ElCarouselItem key={item} style={itemStyle(item)}>
            <ItemTitle>{item}</ItemTitle>
          </ElCarouselItem>
        ))}
      </ElCarousel>
    </div>
  );
}
