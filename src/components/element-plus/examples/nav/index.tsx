"use client";

import { useState } from "react";
import { ElBreadcrumb, ElBreadcrumbItem } from "@/components/element-plus/breadcrumb";
import { ElCollapse, ElCollapseItem } from "@/components/element-plus/collapse";
import { ElSteps, ElStep } from "@/components/element-plus/steps";
import { ElTabs, ElTabPane } from "@/components/element-plus/tabs";
import { ArrowRight } from "@/components/element-plus/icons";
import type { CollapseActiveName } from "@/components/element-plus/collapse";

const stack = { display: "flex", flexDirection: "column", gap: "1rem" } as const;

export function BreadcrumbBasic() {
  return (
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem>首页</ElBreadcrumbItem>
      <ElBreadcrumbItem>活动管理</ElBreadcrumbItem>
      <ElBreadcrumbItem>活动列表</ElBreadcrumbItem>
      <ElBreadcrumbItem>活动详情</ElBreadcrumbItem>
    </ElBreadcrumb>
  );
}

export function BreadcrumbIcon() {
  return (
    <ElBreadcrumb separatorIcon={<ArrowRight />}>
      <ElBreadcrumbItem to="/">首页</ElBreadcrumbItem>
      <ElBreadcrumbItem to="/list">活动管理</ElBreadcrumbItem>
      <ElBreadcrumbItem>活动详情</ElBreadcrumbItem>
    </ElBreadcrumb>
  );
}

export function CollapseBasic() {
  const [value, setValue] = useState<CollapseActiveName | CollapseActiveName[]>(["1"]);
  return (
    <ElCollapse value={value} onChange={setValue}>
      <ElCollapseItem name="1" title="一致性 Consistency">
        <p>与现实生活一致：与现实生活的流程、逻辑完全一致。</p>
        <p>反馈及时：通过界面样式和交互让用户即刻感知操作结果。</p>
      </ElCollapseItem>
      <ElCollapseItem name="2" title="反馈 Feedback">
        <p>控制反馈：通过界面样式和交互让用户即刻感知操作结果。</p>
      </ElCollapseItem>
      <ElCollapseItem name="3" title="效率 Efficiency" disabled>
        <p>禁用项内容。</p>
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapseAccordion() {
  const [value, setValue] = useState<CollapseActiveName | CollapseActiveName[]>("1");
  return (
    <ElCollapse accordion value={value} onChange={setValue}>
      <ElCollapseItem name="1" title="面板一">
        <p>手风琴模式下同时只能展开一个面板。</p>
      </ElCollapseItem>
      <ElCollapseItem name="2" title="面板二">
        <p>展开本面板时其它面板会收起。</p>
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapseIconPosition() {
  return (
    <ElCollapse expandIconPosition="left">
      <ElCollapseItem name="1" title="图标在左">
        <p>展开图标显示在标题左侧。</p>
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function StepsBasic() {
  const [active, setActive] = useState(1);
  return (
    <div style={stack}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={() => setActive((a) => Math.max(0, a - 1))}>
          上一步
        </button>
        <button type="button" onClick={() => setActive((a) => Math.min(3, a + 1))}>
          下一步
        </button>
      </div>
      <ElSteps active={active}>
        <ElStep title="步骤一" description="这是第一步的描述" />
        <ElStep title="步骤二" description="这是第二步的描述" />
        <ElStep title="步骤三" description="这是第三步的描述" />
        <ElStep title="步骤四" description="这是第四步的描述" />
      </ElSteps>
    </div>
  );
}

export function StepsStatus() {
  return (
    <div style={stack}>
      <ElSteps active={1} finishStatus="success">
        <ElStep title="完成（success）" />
        <ElStep title="进行中" />
        <ElStep title="等待" />
      </ElSteps>
      <ElSteps active={1} processStatus="error">
        <ElStep title="完成" />
        <ElStep title="出错（error）" description="当前步骤失败" />
        <ElStep title="等待" />
      </ElSteps>
    </div>
  );
}

export function StepsVertical() {
  return (
    <ElSteps active={1} direction="vertical">
      <ElStep title="步骤一" description="纵向排列" />
      <ElStep title="步骤二" description="纵向排列" />
      <ElStep title="步骤三" description="纵向排列" />
    </ElSteps>
  );
}

export function StepsSimple() {
  return (
    <ElSteps active={1} simple>
      <ElStep title="简洁一" />
      <ElStep title="简洁二" />
      <ElStep title="简洁三" />
    </ElSteps>
  );
}

export function TabsBasic() {
  const [value, setValue] = useState<string | number>("first");
  return (
    <ElTabs value={value} onChange={setValue}>
      <ElTabPane name="first" label="用户管理">
        <p>用户管理的内容</p>
      </ElTabPane>
      <ElTabPane name="second" label="配置管理">
        <p>配置管理的内容</p>
      </ElTabPane>
      <ElTabPane name="third" label="角色管理" disabled>
        <p>角色管理的内容</p>
      </ElTabPane>
    </ElTabs>
  );
}

export function TabsCard() {
  const [value, setValue] = useState<string | number>("first");
  return (
    <div style={stack}>
      <ElTabs value={value} onChange={setValue} type="card">
        <ElTabPane name="first" label="卡片一">
          <p>内容</p>
        </ElTabPane>
        <ElTabPane name="second" label="卡片二">
          <p>内容</p>
        </ElTabPane>
      </ElTabs>
      <ElTabs value={value} onChange={setValue} type="border-card">
        <ElTabPane name="first" label="边框一">
          <p>内容</p>
        </ElTabPane>
        <ElTabPane name="second" label="边框二">
          <p>内容</p>
        </ElTabPane>
      </ElTabs>
    </div>
  );
}

export function TabsPosition() {
  const [value, setValue] = useState<string | number>("first");
  return (
    <ElTabs value={value} onChange={setValue} tabPosition="left">
      <ElTabPane name="first" label="左侧一">
        <p>内容</p>
      </ElTabPane>
      <ElTabPane name="second" label="左侧二">
        <p>内容</p>
      </ElTabPane>
    </ElTabs>
  );
}
