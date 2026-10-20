import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TabsBasic,
  TabsBorderCard,
  TabsCard,
  TabsCustomAddIcon,
  TabsCustomLabel,
  TabsCustomizedTrigger,
  TabsDefaultValue,
  TabsDynamic,
  TabsPosition,
} from "@/components/element-plus/examples/tabs";

export const metadata: Metadata = { title: "Tabs 标签页" };

const SOURCES = {
  basic: `const [active, setActive] = useState("first");

<ElTabs value={active} onChange={setActive}>
  <ElTabPane name="first" label="User">User</ElTabPane>
  <ElTabPane name="second" label="Config">Config</ElTabPane>
  <ElTabPane name="third" label="Role">Role</ElTabPane>
  <ElTabPane name="fourth" label="Task">Task</ElTabPane>
</ElTabs>`,

  card: `<ElTabs value={active} onChange={setActive} type="card">
  <ElTabPane name="first" label="User">User</ElTabPane>
  <ElTabPane name="second" label="Config">Config</ElTabPane>
  <ElTabPane name="third" label="Role">Role</ElTabPane>
  <ElTabPane name="fourth" label="Task">Task</ElTabPane>
</ElTabs>`,

  borderCard: `<ElTabs type="border-card">
  <ElTabPane label="User">User</ElTabPane>
  <ElTabPane label="Config">Config</ElTabPane>
  <ElTabPane label="Role">Role</ElTabPane>
  <ElTabPane label="Task">Task</ElTabPane>
</ElTabs>`,

  customLabel: `<ElTabs type="border-card">
  <ElTabPane
    label={
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <ElIcon><Calendar /></ElIcon>
        <span>Route</span>
      </span>
    }
  >
    Route
  </ElTabPane>
  <ElTabPane label="Config">Config</ElTabPane>
  {/* ... */}
</ElTabs>`,

  customAddIcon: `const [active, setActive] = useState("2");
const [tabs, setTabs] = useState([
  { title: "Tab 1", name: "1", content: "Tab 1 content" },
  { title: "Tab 2", name: "2", content: "Tab 2 content" },
]);

<ElTabs
  value={active}
  onChange={setActive}
  type="card"
  editable
  onEdit={handleEdit}
  addIcon={<ElIcon><Select /></ElIcon>}
>
  {tabs.map((tab) => (
    <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
      {tab.content}
    </ElTabPane>
  ))}
</ElTabs>`,

  customizedTrigger: `const addTab = () => {
  const nextName = String(++nextIndex.current);
  setTabs([...tabs, { title: "New Tab", name: nextName, content: "..." }]);
  setActive(nextName);
};

<ElButton size="small" onClick={addTab}>add tab</ElButton>

<ElTabs
  value={active}
  onChange={setActive}
  type="card"
  closable
  onTabRemove={removeTab}
>
  {tabs.map((tab) => (
    <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
      {tab.content}
    </ElTabPane>
  ))}
</ElTabs>`,

  defaultValue: `<ElTabs defaultValue="third" onChange={setActive}>
  <ElTabPane name="first" label="User">User</ElTabPane>
  <ElTabPane name="second" label="Config">Config</ElTabPane>
  <ElTabPane name="third" label="Role">Role</ElTabPane>
  <ElTabPane name="fourth" label="Task">Task</ElTabPane>
</ElTabs>`,

  dynamic: `const [active, setActive] = useState("2");
const [tabs, setTabs] = useState([
  { title: "Tab 1", name: "1", content: "Tab 1 content" },
  { title: "Tab 2", name: "2", content: "Tab 2 content" },
]);

const handleEdit = (targetName, action) => {
  if (action === "add") {
    const nextName = String(++nextIndex.current);
    setTabs([...tabs, { title: "New Tab", name: nextName, content: "..." }]);
    setActive(nextName);
  } else {
    const nextTab = /* 相邻 tab */;
    if (active === targetName) setActive(nextTab.name);
    setTabs(tabs.filter((tab) => tab.name !== targetName));
  }
};

<ElTabs
  value={active}
  onChange={setActive}
  type="card"
  editable
  onEdit={handleEdit}
>
  {tabs.map((tab) => (
    <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
      {tab.content}
    </ElTabPane>
  ))}
</ElTabs>`,

  position: `const [position, setPosition] = useState<TabPosition>("left");

<ElRadioGroup
  type="button"
  value={position}
  onChange={(value) => setPosition(value as TabPosition)}
>
  <ElRadio value="top">top</ElRadio>
  <ElRadio value="right">right</ElRadio>
  <ElRadio value="bottom">bottom</ElRadio>
  <ElRadio value="left">left</ElRadio>
</ElRadioGroup>

<ElTabs tabPosition={position} style={{ height: 200 }}>
  <ElTabPane label="User">User</ElTabPane>
  <ElTabPane label="Config">Config</ElTabPane>
  <ElTabPane label="Role">Role</ElTabPane>
  <ElTabPane label="Task">Task</ElTabPane>
</ElTabs>`,
};

const API_MD = `
## Tabs API

### Tabs Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中面板的 name，受控 | ^[string] / ^[number] | — |
| defaultValue | 非受控时的初始选中 name | ^[string] / ^[number] | 第一个面板 |
| type | 风格类型 | ^[enum]\`'' \\| 'card' \\| 'border-card'\` | — |
| tabPosition | 选项卡位置 | ^[enum]\`'top' \\| 'right' \\| 'bottom' \\| 'left'\` | top |
| closable | 标签是否可关闭 | ^[boolean] | false |
| addable | 是否显示加号 | ^[boolean] | false |
| editable | 是否可增删 | ^[boolean] | false |
| addIcon | 自定义新增按钮图标，等价官方 \`add-icon\` 插槽 | ^[ReactNode] | Plus 图标 |
| stretch | 标签宽度是否自撑开 | ^[boolean] | false |
| beforeLeave | 切换前钩子，返回 false 阻止 | ^[Function]\`(newName, oldName) => boolean \\| Promise<boolean>\` | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Tabs Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中面板变化（受控值更新） | ^[Function]\`(name) => void\` |
| onTabClick | 点击标签（含已选中） | ^[Function]\`(name) => void\` |
| onTabRemove | 点击关闭按钮或按 Delete / Backspace | ^[Function]\`(name) => void\` |
| onTabAdd | 点击新增按钮 | ^[Function]\`() => void\` |
| onEdit | 增删统一回调，等价官方 \`edit\` | ^[Function]\`(name \\| undefined, 'remove' \\| 'add') => void\` |

### Tabs Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板集合 | children |
| add-icon | 自定义新增按钮图标 | \`addIcon\` 属性 |

### TabPane Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板标识，省略时用下标字符串 | ^[string] / ^[number] | — |
| label | 标签标题，可传节点 | ^[ReactNode] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| closable | 是否可关闭，优先于 Tabs 的 closable | ^[boolean] | — |
| lazy | 是否懒渲染（首次激活后保留） | ^[boolean] | false |

### TabPane Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板内容 | children |
| label | 自定义标签内容 | \`label\` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`value\` + \`onChange\` | 受控写法；不传 value 时可用 \`defaultValue\` |
| \`@tab-change\` | \`onChange\` | React 侧合并为值变化回调 |
| \`@edit\` | \`onEdit\` | 参数与触发时机一致 |
| \`<slot name="add-icon">\` | \`addIcon\` 属性 | 传节点 |
| \`<template #label>\` | \`label\` 属性 | 传节点 |
| \`expose: currentName / tabNavRef\` | 暂未提供 | 可通过受控 value 获取当前项 |

**实现说明**：

- 激活条定位与官方 \`getBarStyle\` 一致：量激活项 \`offsetLeft\` 与扣除左右 padding 后的宽度，用 \`transform: translateX\` 定位；card / border-card 不渲染激活条
- 键盘交互与官方一致：方向键循环切换可用 tab（左/上向前、右/下向后），聚焦后立即选中；Delete / Backspace 关闭当前可关闭 tab；新增按钮支持 Enter 触发
- ARIA：\`role="tablist" / "tab" / "tabpanel"\`，并由 \`useId\` 生成稳定的 \`aria-controls\`、\`aria-labelledby\` 关联；\`aria-orientation\` 随 \`tabPosition\` 变化
- \`lazy\` 面板首次激活后保持挂载（仅 \`display: none\`），等价于官方面板的 keep-alive 行为
- 官方面板切换的 fade 过渡与超出宽度时的 nav 滚动按钮尚未实现，结构与类名保持一致
- 未受控时若移除当前面板，需由使用方像官方 demo 一样在 \`onEdit\` / \`onTabRemove\` 中切换 \`value\`
`;

export default function TabsPage() {
  return (
    <>
      <h1>Tabs 标签页</h1>
      <p>分隔内容上有关联的部分。</p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的、简洁的标签页，点击标签切换内容。</p>
      <DemoBlock source={SOURCES.basic}>
        <TabsBasic />
      </DemoBlock>

      <Heading level={2}>卡片风格</Heading>
      <p>
        设置 <code>type=&quot;card&quot;</code> 显示卡片风格的标签页。
      </p>
      <DemoBlock source={SOURCES.card}>
        <TabsCard />
      </DemoBlock>

      <Heading level={2}>带边框卡片</Heading>
      <p>
        设置 <code>type=&quot;border-card&quot;</code> 显示带边框的卡片标签页。
      </p>
      <DemoBlock source={SOURCES.borderCard}>
        <TabsBorderCard />
      </DemoBlock>

      <Heading level={2}>标签位置</Heading>
      <p>
        通过 <code>tabPosition</code> 设置标签位置，支持 top / right / bottom / left。
      </p>
      <DemoBlock source={SOURCES.position}>
        <TabsPosition />
      </DemoBlock>

      <Heading level={2}>自定义标签</Heading>
      <p>
        通过 <code>label</code> 传入自定义节点，可以在标签中加入图标等内容。
      </p>
      <DemoBlock source={SOURCES.customLabel}>
        <TabsCustomLabel />
      </DemoBlock>

      <Heading level={2}>动态增减标签</Heading>
      <p>
        <code>editable</code> 同时启用新增与关闭；<code>onEdit</code> 统一接收增删事件。
      </p>
      <DemoBlock source={SOURCES.dynamic}>
        <TabsDynamic />
      </DemoBlock>

      <Heading level={2}>自定义新增按钮图标</Heading>
      <p>
        通过 <code>addIcon</code> 替换默认的加号图标，等价于官方 <code>add-icon</code> 插槽。
      </p>
      <DemoBlock source={SOURCES.customAddIcon}>
        <TabsCustomAddIcon />
      </DemoBlock>

      <Heading level={2}>自定义触发按钮</Heading>
      <p>
        使用 <code>closable</code> 显示关闭按钮，并在外部按钮中触发新增。
      </p>
      <DemoBlock source={SOURCES.customizedTrigger}>
        <TabsCustomizedTrigger />
      </DemoBlock>

      <Heading level={2}>默认值</Heading>
      <p>
        未传 <code>value</code> 时，可通过 <code>defaultValue</code> 指定初始选中的面板。
      </p>
      <DemoBlock source={SOURCES.defaultValue}>
        <TabsDefaultValue />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
