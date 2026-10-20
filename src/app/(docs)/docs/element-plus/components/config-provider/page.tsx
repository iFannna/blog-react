import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ConfigProviderButton,
  ConfigProviderCard,
  ConfigProviderDialog,
  ConfigProviderEmptyValues,
  ConfigProviderLink,
  ConfigProviderLocale,
  ConfigProviderMessage,
  ConfigProviderTable,
} from "@/components/element-plus/examples/config-provider";

export const metadata: Metadata = { title: "Config Provider 全局配置" };

const SOURCES = {
  locale: `const [lang, setLang] = useState<"zh-cn" | "en">("zh-cn");
const locale = lang === "zh-cn" ? zhCn : en;

<ElButton
  style={{ marginBottom: "8px" }}
  onClick={() => setLang((v) => (v === "zh-cn" ? "en" : "zh-cn"))}
>
  Switch Language
</ElButton>
<br />

<ElConfigProvider locale={locale}>
  <ElTable data={[]} style={{ marginBottom: "4px" }} />
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
const [enableTransition, setEnableTransition] = useState(false);
const [isObjectTransition, setIsObjectTransition] = useState(false);

<ElConfigProvider dialog={dialogConfig}>
  <ElDialog
    visible={visible}
    onVisibleChange={setVisible}
    title="Dialog Title"
    destroyOnClose
  >
    Dialog Content
  </ElDialog>
</ElConfigProvider>`,

  message: `const config = { max: 3, plain: true, placement: "bottom" };

<ElConfigProvider message={config}>
  <ElButton onClick={() => message("This is a message from bottom.")}>OPEN</ElButton>
</ElConfigProvider>`,

  emptyValues: `const [value1, setValue1] = useState<string | null | undefined>("");
const [value2, setValue2] = useState<string | null | undefined>("");

{/* 空值集合用 [undefined, null]（空字符串是有意义的值），清空后写回 null */}
<ElConfigProvider valueOnClear={null} emptyValues={[undefined, null]}>
  <ElSelect
    value={value1 ?? undefined}
    onChange={setValue1}
    clearable
    placeholder="Select"
    options={options}
    style={{ width: "240px" }}
  />
  <ElSelectV2
    value={value2 ?? undefined}
    onChange={setValue2}
    valueOnClear={() => undefined}
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

`;

export default function ConfigProviderPage() {
  return (
    <>
      <h1>Config Provider 全局配置</h1>
      <p>
        Config Provider 被用来提供全局的配置选项，让你的配置能够在全局都能够被访问到。
      </p>

      <Heading level={2} id="i18n-配置">
        i18n 配置
      </Heading>
      <p>通过 Config Provider 来配置多语言，让你的应用可以随时切换语言。</p>
      <p>使用两个属性来提供 i18n 相关配置</p>
      <DemoBlock source={SOURCES.locale}>
        <ConfigProviderLocale />
      </DemoBlock>

      <Heading level={2}>对按钮进行配置</Heading>
      <DemoBlock source={SOURCES.button}>
        <ConfigProviderButton />
      </DemoBlock>

      <Heading level={2} id="对链接进行配置">
        对链接进行配置 <span className="docs-version-tag">2.9.11</span>
      </Heading>
      <DemoBlock source={SOURCES.link}>
        <ConfigProviderLink />
      </DemoBlock>

      <Heading level={2} id="对-card-进行配置">
        对 Card 进行配置 <span className="docs-version-tag">2.10.5</span>
      </Heading>
      <DemoBlock source={SOURCES.card}>
        <ConfigProviderCard />
      </DemoBlock>

      <Heading level={2} id="对-dialog-进行配置">
        对 Dialog 进行配置 <span className="docs-version-tag">2.10.7</span>
      </Heading>
      <DemoBlock source={SOURCES.dialog}>
        <ConfigProviderDialog />
      </DemoBlock>

      <Heading level={2}>对消息进行配置</Heading>
      <DemoBlock source={SOURCES.message}>
        <ConfigProviderMessage />
      </DemoBlock>

      <Heading level={2} id="空值配置">
        空值配置 <span className="docs-version-tag">2.7.0</span>
      </Heading>
      <p>
        设置 <code>empty-values</code> 来配置组件的默认空值。默认值是{" "}
        <code>[&apos;&apos;, null, undefined]</code>。如果认为空字符串不是一个空值，可以设置成{" "}
        <code>[undefined, null]</code>。
      </p>
      <p>
        设置 <code>value-on-clear</code> 以设置清空选项的值。组件默认值是{" "}
        <code>undefined</code>。在日期组件中是 <code>null</code>。如果想设置成{" "}
        <code>undefined</code>，请使用 <code>() =&gt; undefined</code>。
      </p>
      <DemoBlock source={SOURCES.emptyValues}>
        <ConfigProviderEmptyValues />
      </DemoBlock>

      <Heading level={2} id="表格配置">
        表格配置 <span className="docs-version-tag">2.13.3</span>
      </Heading>
      <DemoBlock source={SOURCES.table}>
        <ConfigProviderTable />
      </DemoBlock>

      <Heading level={2}>实验性功能</Heading>
      <p>
        在本节中，您可以学习如何使用 Config Provider 来提供实验性功能。现在，我们还没有添加任何实验性功能，
        但在未来的规划中，我们将添加一些实验性功能。您可以使用此配置来管理这些功能。
      </p>

      <DocsContent source={API_MD} />
    </>
  );
}
