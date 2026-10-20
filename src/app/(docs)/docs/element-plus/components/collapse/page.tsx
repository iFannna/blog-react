import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  CollapseAccordion,
  CollapseBasic,
  CollapseCustomIcon,
  CollapseCustomTitle,
  CollapseIconPosition,
  CollapsePreventCollapsing,
} from "@/components/element-plus/examples/collapse";

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

`;

export default function CollapsePage() {
  return (
    <>
      <h1>Collapse 折叠面板</h1>
      <p>通过折叠面板收纳内容区域</p>

      <Heading level={2}>基础用法</Heading>
      <p>可同时展开多个面板，面板之间不影响</p>
      <DemoBlock source={SOURCES.basic}>
        <CollapseBasic />
      </DemoBlock>

      <Heading level={2}>手风琴效果</Heading>
      <p>每次只能展开一个面板</p>
      <p>
        通过 <code>accordion</code> 属性来设置是否以手风琴模式显示。
      </p>
      <DemoBlock source={SOURCES.accordion}>
        <CollapseAccordion />
      </DemoBlock>

      <Heading level={2}>自定义面板标题</Heading>
      <p>
        除了可以通过 <code>title</code> 属性以外，还可以通过具名{" "}
        <code>slot</code> 来实现自定义面板的标题内容，以实现增加图标等效果。
      </p>
      <DocsContent
        source={`:::tip

从版本 ^(2.9.10)开始， \`title\` 插槽提供一个 \`isActive\` 属性，显示当前折叠项是否活跃。

:::`}
      />
      <DemoBlock source={SOURCES.customization}>
        <CollapseCustomTitle />
      </DemoBlock>

      <Heading level={2} id="自定义图标">
        自定义图标 <span className="docs-version-tag">2.8.3</span>
      </Heading>
      <p>
        除了使用 <code>icon</code>{" "}
        属性外，您还可以自定义面板项目图标，从而添加自定义内容。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <CollapseCustomIcon />
      </DemoBlock>

      <Heading level={2} id="自定义图标位置">
        自定义图标位置 <span className="docs-version-tag">2.9.10</span>
      </Heading>
      <p>
        使用 <code>expand-icon-position</code> 属性，您可以自定义图标位置。
      </p>
      <DemoBlock source={SOURCES.iconPosition}>
        <CollapseIconPosition />
      </DemoBlock>

      <Heading level={2} id="阻止折叠">
        阻止折叠 <span className="docs-version-tag">2.9.11</span>
      </Heading>
      <p>
        设置 <code>beforeChange</code> 属性，若返回 false 或者返回{" "}
        <code>Promise</code> 且被 <code>reject</code> ，则停止切换。
      </p>
      <DemoBlock source={SOURCES.preventCollapsing}>
        <CollapsePreventCollapsing />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
