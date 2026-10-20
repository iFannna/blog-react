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
`;

export default function TabsPage() {
  return (
    <>
      <h1>Tabs 标签页</h1>
      <p>分隔内容上有关联但属于不同类别的数据集合。</p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的、简洁的标签页。</p>
      <p>
        Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过{" "}
        <code>value</code> 属性来指定当前选中的标签页。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TabsBasic />
      </DemoBlock>

      <Heading level={2}>卡片风格的标签</Heading>
      <p>你可以设置具有卡片风格的标签。</p>
      <p>
        只需要设置 <code>type</code> 属性为 <code>card</code>{" "}
        就可以使选项卡改变为标签风格。
      </p>
      <DemoBlock source={SOURCES.card}>
        <TabsCard />
      </DemoBlock>

      <Heading level={2}>带有边框的卡片风格</Heading>
      <p>你还可以设置标签页为带有边框的卡片</p>
      <p>
        将 <code>type</code> 设置为 <code>border-card</code>。
      </p>
      <DemoBlock source={SOURCES.borderCard}>
        <TabsBorderCard />
      </DemoBlock>

      <Heading level={2}>标签位置的设置</Heading>
      <p>
        可以通过 <code>tab-position</code> 设置标签的位置
      </p>
      <p>
        标签一共有四个方向的设置{" "}
        <code>tabPosition=&quot;left|right|top|bottom&quot;</code>
      </p>
      <DemoBlock source={SOURCES.position}>
        <TabsPosition />
      </DemoBlock>

      <Heading level={2}>自定义标签页的内容</Heading>
      <p>可以通过具名插槽来实现自定义标签页的内容</p>
      <DemoBlock source={SOURCES.customLabel}>
        <TabsCustomLabel />
      </DemoBlock>

      <Heading level={2}>动态增减标签页</Heading>
      <p>增减标签页按钮只能在选项卡样式的标签页下使用</p>
      <DemoBlock source={SOURCES.dynamic}>
        <TabsDynamic />
      </DemoBlock>

      <Heading level={2} id="添加按钮自定义图标">
        添加按钮自定义图标<span className="docs-version-tag">2.4.0</span>
      </Heading>
      <DemoBlock source={SOURCES.customAddIcon}>
        <TabsCustomAddIcon />
      </DemoBlock>

      <Heading level={2}>增加标签页触发器自定义</Heading>
      <DemoBlock source={SOURCES.customizedTrigger}>
        <TabsCustomizedTrigger />
      </DemoBlock>

      <Heading level={2} id="默认值">
        默认值<span className="docs-version-tag">2.11.9</span>
      </Heading>
      <DemoBlock source={SOURCES.defaultValue}>
        <TabsDefaultValue />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
