"use client";

import { ElCard } from "@/components/element-plus/card";

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))",
  gap: "1.6rem",
} as const;

export function CardBasic() {
  return (
    <div style={grid}>
      <ElCard header="卡片标题">
        <p style={{ margin: 0 }}>卡片内容</p>
      </ElCard>
    </div>
  );
}

export function CardShadow() {
  return (
    <div style={grid}>
      <ElCard header="always" shadow="always">
        <p style={{ margin: 0 }}>总是显示阴影</p>
      </ElCard>
      <ElCard header="hover" shadow="hover">
        <p style={{ margin: 0 }}>鼠标悬停时显示阴影</p>
      </ElCard>
      <ElCard header="never" shadow="never">
        <p style={{ margin: 0 }}>从不显示阴影</p>
      </ElCard>
    </div>
  );
}

export function CardSlots() {
  return (
    <div style={grid}>
      <ElCard
        header={<span style={{ fontWeight: 700 }}>自定义头部</span>}
        footer={<span style={{ color: "#909399" }}>自定义页脚</span>}
      >
        <p style={{ margin: 0 }}>头部与页脚都传入节点</p>
      </ElCard>
      <ElCard>
        <p style={{ margin: 0 }}>只有内容区，无头部页脚</p>
      </ElCard>
    </div>
  );
}

export function CardBodyStyle() {
  return (
    <div style={grid}>
      <ElCard header="自定义内容区样式" bodyStyle={{ padding: "3rem", textAlign: "center" }}>
        <p style={{ margin: 0 }}>bodyStyle 加大内边距</p>
      </ElCard>
      <ElCard header="自定义类名" bodyClass="docs-card-demo-body">
        <p style={{ margin: 0 }}>bodyClass 追加类名</p>
      </ElCard>
    </div>
  );
}