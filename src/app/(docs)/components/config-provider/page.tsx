import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  ConfigProviderButton,
  ConfigProviderCard,
  ConfigProviderDialog,
  ConfigProviderEmptyValues,
  ConfigProviderLink,
  ConfigProviderLocale,
  ConfigProviderMessage,
  ConfigProviderTable,
} from "@/components/docs/examples/config-provider";

export const metadata: Metadata = { title: "Config Provider 全局配置" };

const SOURCES = {
  locale: `const [lang, setLang] = useState<"zh-cn" | "en">("zh-cn");
const locale = lang === "zh-cn" ? zhCn : en;

<ElButton onClick={() => setLang((v) => (v === "zh-cn" ? "en" : "zh-cn"))}>
  切换语言
</ElButton>

<ElConfigProvider locale={locale}>
  <ElTable data={[]}>
    <ElTableColumn prop="name" label="Name" />
  </ElTable>
  <ElPagination total={100} />
</ElConfigProvider>`,

  button: `const [config, setConfig] = useState<ButtonConfigContext>({
  autoInsertSpace: true,
  type: "default",
  plain: true,
  round: true,
  text: false,
  dashed: false,
});

<ElConfigProvider button={config}>
  <ElButton>中文</ElButton>
</ElConfigProvider>`,

  link: `const [config, setConfig] = useState<LinkConfigContext>({
  type: "success",
  underline: "always",
});

<ElConfigProvider link={config}>
  <ElLink>Link desu!</ElLink>
</ElConfigProvider>`,

  card: `const [shadow, setShadow] = useState<"always" | "hover" | "never">("always");
const config = useMemo(() => ({ shadow }), [shadow]);

<ElConfigProvider card={config}>
  <ElCard>Card desu!</ElCard>
</ElConfigProvider>`,

  dialog: `const [config, setConfig] = useState<DialogConfigContext>({
  alignCenter: false,
  draggable: false,
  overflow: false,
});

<ElConfigProvider dialog={config}>
  <ElDialog visible={visible} onVisibleChange={setVisible} title="Dialog Title">
    Dialog Content
  </ElDialog>
</ElConfigProvider>`,

  message: `const config = { max: 3, plain: true, placement: "bottom" };

<ElConfigProvider message={config}>
  <ElButton onClick={() => message("This is a message from bottom.")}>OPEN</ElButton>
</ElConfigProvider>`,

  emptyValues: `const [value, setValue] = useState<string | null | undefined>("");

{/* 空值集合用 [undefined, null]（空字符串是有意义的值），清空后写回 null */}
<ElConfigProvider valueOnClear={null} emptyValues={[undefined, null]}>
  <ElSelect
    value={value ?? undefined}
    onChange={setValue}
    clearable
    placeholder="Select"
    options={options}
    style={{ width: "240px" }}
  />
</ElConfigProvider>`,

  table: `const [config, setConfig] = useState<TableConfigContext>({
  showOverflowTooltip: true,
  tooltipEffect: "dark",
});

<ElConfigProvider table={config}>
  <ElTable data={tableData} style={{ width: "100%" }}>
    <ElTableColumn type="selection" width="55" />
    <ElTableColumn prop="date" label="Date" width="120" />
    <ElTableColumn prop="address" label="Address (inherited)" width="300" />
    <ElTableColumn prop="address" label="Address (explicit false)" showOverflowTooltip={false} />
  </ElTable>
</ElConfigProvider>`,
};

const API_MD = `
## Config Provider API

### Config Provider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | 语言包对象 | ^[object]\`Language\` | en |
| size | 全局组件尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| zIndex | 全局初始 zIndex | ^[number] | — |
| namespace | 全局类名前缀 | ^[string] | el |
| button | 按钮相关配置 | ^[object]\`ButtonConfigContext\` | — |
| link | 链接相关配置 | ^[object]\`LinkConfigContext\` | — |
| card | 卡片相关配置 | ^[object]\`CardConfigContext\` | — |
| dialog | 对话框相关配置 | ^[object]\`DialogConfigContext\` | — |
| message | 消息相关配置 | ^[object]\`MessageConfigContext\` | — |
| table | 表格相关配置 | ^[object]\`TableConfigContext\` | — |
| experimental-features | 实验特性开关 | ^[object] | — |
| empty-values | 全局空值集合 | ^[array] | — |
| value-on-clear | 全局清空返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] / ^[null] | — |
| a11y | 无障碍特性开关 | ^[boolean] | true |
| keyboard-navigation | 键盘导航开关 | ^[boolean] | true |

### Button Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info' \\| 'text' \\| 'default'\` | — |
| autoInsertSpace | 两个汉字间自动插入空格 | ^[boolean] | false |
| plain | 朴素按钮 | ^[boolean] | false |
| text | 文字按钮 | ^[boolean] | false |
| round | 圆角按钮 | ^[boolean] | false |
| dashed | 虚线按钮 | ^[boolean] | false |

### Link Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 链接类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info' \\| 'default'\` | default |
| underline | 下划线时机 | ^[enum]\`'always' \\| 'hover' \\| 'never'\` | hover |

### Card Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| shadow | 阴影显示时机 | ^[enum]\`'always' \\| 'never' \\| 'hover'\` | — |

### Dialog Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align-center | 水平垂直居中 | ^[boolean] | false |
| draggable | 可拖拽 | ^[boolean] | false |
| overflow | 拖拽时可溢出视口 | ^[boolean] | false |
| transition | 过渡名字符串 | ^[string] | — |

### Message Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max | 同位置最多显示的条数 | ^[number] | — |
| grouping | 合并相同内容的消息 | ^[boolean] | — |
| duration | 显示时长（毫秒），0 表示不自动关闭 | ^[number] | — |
| show-close | 是否显示关闭按钮 | ^[boolean] | — |
| offset | 距视口边缘距离（px） | ^[number] | — |
| plain | 朴素样式 | ^[boolean] | — |
| placement | 显示位置 | ^[enum]\`'top' \\| 'top-left' \\| 'top-right' \\| 'bottom' \\| 'bottom-left' \\| 'bottom-right'\` | — |

### Table Attribute

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show-overflow-tooltip | 全局为所有列开启溢出省略 | ^[boolean] | — |
| tooltip-effect | 溢出提示的主题 | ^[enum]\`'dark' \\| 'light'\` | dark |

### Config Provider Slots

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| default | 自定义默认内容 | config: 当前生效的全局配置 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`provide/inject\` 跨组件注入 | React Context（6 个独立 Context） | 语义一致：Provider 内所有组件都能读到 |
| 插槽回传 \`config\` | \`children\` 支持函数形态 \`(config) => ReactNode\` | 用法等价 |
| \`locale\` 传 \`element-plus/es/locale/lang/zh-cn\` | \`import { zhCn } from "@\/components\/ui\/config-provider\/locales"\` | 内置 en / zh-cn 两个语言包 |
| 命令式组件读模块级 \`globalConfig\` | \`getGlobalConfig()\` 模块级快照 | ElMessage / MessageBox 等照常读到全局配置 |
| \`dialog.transition\` 支持对象（JS 过渡钩子） | 仅支持字符串 | React 无 Vue 过渡系统，无法执行 \`onBeforeEnter\` 等钩子 |

**实现说明**：

- \`size\` 已接入 \`useFormSize\`（输入类组件 / 按钮 / 表格 / 单选 / 复选等全部生效）
- \`zIndex\` 已接入 \`useZIndex\`（Dialog / Drawer / 各类浮层以此为初始层级）
- \`locale\` 已接入分页、表格空数据、Empty、Select 占位与空数据、MessageBox 文案
- \`emptyValues\` / \`valueOnClear\` 已接入 Select 的清空逻辑
- \`button\` / \`link\` / \`card\` / \`dialog\` / \`message\` / \`table\` 六组配置均已接入对应组件
- \`namespace\` 提供 \`useNamespace(block)\`，与官方 \`_bem\` / \`cssVar\` 逐字一致；由于本项目样式表是
  官方 theme-chalk 的产物（类名硬编码 \`el-\`），改 \`namespace\` 只能改变组件输出的类名，
  不会生成对应的新样式，实际使用请保持默认值

**未实现的官方能力**：

- \`namespace\` 对 CSS 变量前缀的联动：官方样式由 SCSS 按 \`$namespace\` 编译，本项目用编译好的
  固定前缀样式表，故改前缀后无配套样式
- 实验特性（\`experimental-features\`）：官方当前也是空对象，未定义任何特性，仅保留该配置项
- \`a11y\` / \`keyboard-navigation\`：官方当前源码中也没有任何组件读取这两个值（仅 ConfigProvider
  自身声明），本项目同样仅保留配置项
- \`dialog.transition\` 的对象形态（配合 Vue 过渡钩子）
- \`table.tooltipOptions\` / \`table.tooltipFormatter\`：官方这两个配置最终交给 ElTooltip 渲染
  溢出提示，本项目表格的溢出省略只加了 \`is-truncated\` 样式与 \`el-tooltip\` 类名，尚未接入 Tooltip
`;

export default function ConfigProviderPage() {
  return (
    <>
      <h1>Config Provider 全局配置</h1>
      <p>
        Config Provider 用于提供全局配置，让整个应用各处都能访问到这些配置。
        在 React 版里由 React Context 实现，组件内部通过
        <code>useGlobalConfig</code> 读取。
      </p>

      <Heading level={2}>国际化</Heading>
      <p>
        通过 <code>locale</code> 提供语言包，即可获得语言切换能力。
      </p>
      <DemoBlock source={SOURCES.locale}>
        <ConfigProviderLocale />
      </DemoBlock>

      <Heading level={2}>按钮配置</Heading>
      <p>
        <code>button</code> 下的字段会成为按钮的全局默认值，组件自身传入时优先。
      </p>
      <DemoBlock source={SOURCES.button}>
        <ConfigProviderButton />
      </DemoBlock>

      <Heading level={2}>链接配置</Heading>
      <p>
        <code>link</code> 控制链接的默认类型与下划线时机。
      </p>
      <DemoBlock source={SOURCES.link}>
        <ConfigProviderLink />
      </DemoBlock>

      <Heading level={2}>卡片配置</Heading>
      <p>
        <code>card.shadow</code> 控制卡片阴影的展示时机。
      </p>
      <DemoBlock source={SOURCES.card}>
        <ConfigProviderCard />
      </DemoBlock>

      <Heading level={2}>对话框配置</Heading>
      <p>
        <code>dialog</code> 控制对话框的居中、拖拽与溢出行为。
      </p>
      <DemoBlock source={SOURCES.dialog}>
        <ConfigProviderDialog />
      </DemoBlock>

      <Heading level={2}>消息配置</Heading>
      <p>
        <code>message</code> 作用于命令式的 <code>message()</code>，
        例如限制同位置最多显示的条数、统一位置与样式。
      </p>
      <DemoBlock source={SOURCES.message}>
        <ConfigProviderMessage />
      </DemoBlock>

      <Heading level={2}>空值配置</Heading>
      <p>
        通过 <code>emptyValues</code> 自定义哪些值算「空」，通过{" "}
        <code>valueOnClear</code> 指定清空后的返回值。默认空值为{" "}
        <code>[&quot;&quot;, undefined, null]</code>；若认为空字符串有意义，可写{" "}
        <code>[undefined, null]</code>。清空返回值默认是 <code>undefined</code>，
        想得到 <code>undefined</code> 时请传 <code>() =&gt; undefined</code>。
      </p>
      <DemoBlock source={SOURCES.emptyValues}>
        <ConfigProviderEmptyValues />
      </DemoBlock>

      <Heading level={2}>表格配置</Heading>
      <p>
        <code>table.showOverflowTooltip</code> 会作用到所有列，
        单列显式传 <code>false</code> 可覆盖。
      </p>
      <DemoBlock source={SOURCES.table}>
        <ConfigProviderTable />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
