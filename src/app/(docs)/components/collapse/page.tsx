import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  CollapseAccordion,
  CollapseBasic,
  CollapseCustomIcon,
  CollapseCustomTitle,
  CollapseIconPosition,
  CollapsePreventCollapsing,
} from "@/components/docs/examples/collapse";

export const metadata: Metadata = { title: "Collapse 折叠面板" };

const SOURCES = {
  basic: `const [activeNames, setActiveNames] = useState(["1"]);

<ElCollapse value={activeNames} onChange={setActiveNames}>
  <ElCollapseItem title="Consistency" name="1">
    <div>与现实生活一致……</div>
    <div>在界面中一致……</div>
  </ElCollapseItem>
  <ElCollapseItem title="Feedback" name="2">
    <div>操作反馈……</div>
  </ElCollapseItem>
  <ElCollapseItem title="Efficiency" name="3">...</ElCollapseItem>
  <ElCollapseItem title="Controllability" name="4">...</ElCollapseItem>
</ElCollapse>`,

  accordion: `const [activeName, setActiveName] = useState("1");

<ElCollapse accordion value={activeName} onChange={setActiveName}>
  <ElCollapseItem title="Consistency" name="1">...</ElCollapseItem>
  <ElCollapseItem title="Feedback" name="2">...</ElCollapseItem>
  <ElCollapseItem title="Efficiency" name="3">...</ElCollapseItem>
  <ElCollapseItem title="Controllability" name="4">...</ElCollapseItem>
</ElCollapse>`,

  iconPosition: `const [position, setPosition] = useState<"left" | "right">("left");

<div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
  <span style={{ marginRight: 16 }}>expand icon position:</span>
  <ElSwitch
    value={position}
    activeValue="right"
    inactiveValue="left"
    activeText="right"
    inactiveText="left"
    onChange={(value) => setPosition(value as "left" | "right")}
  />
</div>

<ElCollapse expandIconPosition={position}>
  <ElCollapseItem title="Consistency" name="1">...</ElCollapseItem>
  <ElCollapseItem title="Feedback" name="2">...</ElCollapseItem>
  <ElCollapseItem title="Efficiency" name="3">...</ElCollapseItem>
</ElCollapse>`,

  customIcon: `<ElCollapse value={activeNames} onChange={setActiveNames}>
  <ElCollapseItem title="Consistency" name="1" icon={<CaretRight />}>
    ...
  </ElCollapseItem>
  <ElCollapseItem
    title="Feedback"
    name="2"
    icon={({ isActive }) => (
      <span style={{ margin: "0 8px 0 auto", color: "var(--el-color-primary)" }}>
        {isActive ? "Expanded" : "Collapsed"}
      </span>
    )}
  >
    ...
  </ElCollapseItem>
</ElCollapse>`,

  customization: `<ElCollapse accordion>
  <ElCollapseItem
    name="1"
    title={({ isActive }) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: isActive ? "var(--el-color-primary)" : undefined,
        }}
      >
        Consistency
        <ElIcon><InfoFilled /></ElIcon>
      </div>
    )}
  >
    ...
  </ElCollapseItem>
  <ElCollapseItem title="Feedback" name="2">...</ElCollapseItem>
</ElCollapse>`,

  preventCollapsing: `const [before, setBefore] = useState(true);
const [loading, setLoading] = useState(false);

const beforeCollapse = () => {
  setLoading(true);
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      setLoading(false);
      resolve(before);
    }, 1000);
  });
};

<ElSwitch checked={before} disabled={loading} onCheckedChange={setBefore} />

<ElCollapse
  value={activeNames}
  onChange={setActiveNames}
  beforeCollapse={beforeCollapse}
>
  ...
</ElCollapse>`,
};

const API_MD = `
## Collapse API

### Collapse Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前展开的面板。手风琴模式为单值，否则为数组 | ^[array] / ^[string] / ^[number] | [] |
| accordion | 是否手风琴模式 | ^[boolean] | false |
| expandIconPosition | 展开图标位置 | ^[enum]\`'left' \\| 'right'\` | right |
| beforeCollapse | 切换前钩子，返回 false 或 reject 的 Promise 阻止切换 | ^[Function]\`(name) => boolean \\| Promise<boolean>\` | — |
| className | 根节点类名 | ^[string] | — |

### Collapse Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 展开面板变化，等价官方 \`change\` | ^[Function]\`(value) => void\`，手风琴为单值，否则为数组 |

### Collapse Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 折叠面板子项 | children |

### CollapseItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板标识，省略时用自动生成的 id | ^[string] / ^[number] | — |
| title | 标题；传函数可获取 \`{ isActive }\` | ^[ReactNode] / ^[Function] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| icon | 自定义图标；传节点包在官方 arrow 容器内，传函数完全接管渲染 | ^[ReactNode] / ^[Function]\`({ isActive }) => ReactNode\` | ArrowRight |
| className | 自定义类名 | ^[string] | — |

### CollapseItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板内容 | children |
| title | 自定义标题，参数 \`{ isActive }\` | \`title\` 函数属性 |
| icon | 自定义图标，参数 \`{ isActive }\` | \`icon\` 函数属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`value\` + \`onChange\` | React 惯用写法 |
| \`<template #title="{ isActive }">\` | \`title\` 函数属性 | 参数结构一致 |
| \`<template #icon="{ isActive }">\` | \`icon\` 函数属性 | 函数返回值直接渲染，不再包 arrow 容器 |
| \`expose: activeNames / setActiveNames\` | 暂未提供 | 受控 value 已可完全控制展开项 |
| 根元素透传 class | 显式 \`className\` | React 侧不展开任意 HTML 属性 |

**实现说明**：

- 手风琴模式收起当前面板时值变为 \`''\`（与官方 setActiveNames 行为一致）
- 头部为 \`role="button"\`，带 \`aria-expanded\` / \`aria-controls\` / \`aria-labelledby\`，支持 Space / Enter 切换
- 内容区与官方 \`v-show\` 一致：收起时仅 \`display: none\`，面板内部状态得以保留
- \`beforeCollapse\` 返回 Promise 时等待结果，reject 视为阻止切换
- 官方用 \`el-collapse-transition\` 做高度动画，React 侧当前为直接显隐（未复刻过渡动画，类名与结构一致）
`;

export default function CollapsePage() {
  return (
    <>
      <h1>Collapse 折叠面板</h1>
      <p>通过折叠面板收纳内容区域。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        可同时展开多个面板，<code>value</code> 为数组。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CollapseBasic />
      </DemoBlock>

      <Heading level={2}>手风琴效果</Heading>
      <p>
        每次只能展开一个面板，通过 <code>accordion</code> 开启。
      </p>
      <DemoBlock source={SOURCES.accordion}>
        <CollapseAccordion />
      </DemoBlock>

      <Heading level={2}>自定义图标位置</Heading>
      <p>
        通过 <code>expandIconPosition</code> 设置展开图标的位置。
      </p>
      <DemoBlock source={SOURCES.iconPosition}>
        <CollapseIconPosition />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>
        通过 <code>icon</code> 传入节点或函数；函数参数包含当前 <code>isActive</code> 状态。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <CollapseCustomIcon />
      </DemoBlock>

      <Heading level={2}>自定义标题</Heading>
      <p>
        <code>title</code> 支持函数形式，可根据 <code>isActive</code> 渲染不同内容。
      </p>
      <DemoBlock source={SOURCES.customization}>
        <CollapseCustomTitle />
      </DemoBlock>

      <Heading level={2}>阻止折叠</Heading>
      <p>
        <code>beforeCollapse</code> 返回 Promise 时，等待结果再决定是否切换。
      </p>
      <DemoBlock source={SOURCES.preventCollapsing}>
        <CollapsePreventCollapsing />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
