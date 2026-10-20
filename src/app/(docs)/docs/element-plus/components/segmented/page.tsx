import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  SegmentedBasic,
  SegmentedCustomDirection,
  SegmentedDisabled,
  SegmentedAliases,
  SegmentedBlock,
  SegmentedCustomContent,
  SegmentedCustomStyle,
} from "@/components/element-plus/examples/segmented";

export const metadata: Metadata = { title: "Segmented 分段控制器" };

const SOURCES = {
  basic: `const [value, setValue] = useState("Mon");
const options = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

<ElSegmented value={value} onChange={setValue} options={options} size="large" />
<ElSegmented value={value} onChange={setValue} options={options} />
<ElSegmented value={value} onChange={setValue} options={options} size="small" />`,

  customDirection: `const [value, setValue] = useState("Apple");
const [direction, setDirection] = useState("horizontal");
const [size, setSize] = useState("default");

<ElSegmented value={size} onChange={setSize} options={["large", "default", "small"]} />
<ElSegmented
  value={direction}
  onChange={setDirection}
  options={[
    { label: "Horizontal", value: "horizontal" },
    { label: "Vertical", value: "vertical" },
  ]}
/>
<ElSegmented
  value={value}
  onChange={setValue}
  options={options}
  direction={direction}
  size={size}
>
  {(item) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
      <ElIcon size={20}>
        <FruitIcon name={item.icon} />
      </ElIcon>
      <div>{item.label}</div>
    </div>
  )}
</ElSegmented>`,

  disabled: `const [value, setValue] = useState("Mon");

<ElSegmented value={value} onChange={setValue} options={options} disabled />
<ElSegmented value={value} onChange={setValue} options={options} />`,

  aliases: `const [value, setValue] = useState("Mon");
const optionProps = { label: "myLabel", value: "myValue", disabled: "myDisabled" };

<ElSegmented value={value} onChange={setValue} options={options} optionProps={optionProps} />`,

  block: `const [value, setValue] = useState("Mon");
const options = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday long long long long long long long"];

<ElSegmented value={value} onChange={setValue} options={options} block />`,

  customContent: `const [value, setValue] = useState("Apple");
const options = [
  { label: "Apple", value: "Apple", icon: Apple },
  { label: "Cherry", value: "Cherry", icon: Cherry },
  { label: "Grape", value: "Grape", icon: Grape },
  { label: "Orange", value: "Orange", icon: Orange },
  { label: "Pear", value: "Pear", icon: Pear },
  { label: "Watermelon", value: "Watermelon", icon: Watermelon },
];

<ElSegmented value={value} onChange={setValue} options={options}>
  {(item) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem", padding: "0.8rem" }}>
      <ElIcon size={20}>
        <item.icon />
      </ElIcon>
      <div>{item.label}</div>
    </div>
  )}
</ElSegmented>`,

  customStyle: `const [value, setValue] = useState("Delicacy");
const options = ["Delicacy", "Desserts&Drinks", "Fresh foods", "Supermarket"];

<ElSegmented
  value={value}
  onChange={setValue}
  options={options}
  style={{
    // 官方在 scoped 样式里覆盖这几个变量
    "--el-segmented-item-selected-color": "var(--el-text-color-primary)",
    "--el-segmented-item-selected-bg-color": "#ffd100",
    "--el-border-radius-base": "16px",
  }}
/>`,
};

const API_MD = `
## Segmented API

### Segmented Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 v-model | ^[string] / ^[number] / ^[boolean] | — |
| options | 选项数据 | ^[array]\`SegmentedOption[]\` | [] |
| option-props | 选项字段别名，对应官方 props | ^[object]\`{ value?, label?, disabled? }\` | — |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | 'default' |
| block | 是否撑满父容器宽度 | ^[boolean] | false |
| disabled | 是否禁用整个组件 | ^[boolean] | false |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| name | 原生 \`name\` 属性 | ^[string] | — |
| id | 原生 \`id\` 属性 | ^[string] | — |
| aria-label | 原生 \`aria-label\` 属性 | ^[string] | — |
| direction | 排列方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | 'horizontal' |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### optionProps

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项对象里作为值的键名 | ^[string] | value |
| label | 选项对象里作为标签的键名 | ^[string] | label |
| disabled | 选项对象里作为禁用标记的键名 | ^[string] | disabled |

### Segmented Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化时触发，参数为当前选中值 | ^[Function]\`(value: SegmentedValue) => void\` |

### Segmented Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| children | 自定义选项内容，传入函数即生效 | ^[Function]\`(item: SegmentedOption, index: number) => ReactNode\` |

`;

export default function SegmentedPage() {
  return (
    <>
      <h1>Segmented 分段控制器</h1>
      <p>用于展示多个选项并允许用户选择其中单个选项。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        设置<code>v-model</code>为选项值。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <SegmentedBasic />
      </DemoBlock>

      <Heading level={2} id="配置方向">
        配置方向<span className="docs-version-tag">2.8.7</span>
      </Heading>
      <p>
        设置 <code>vertical</code> 来改变方向。
      </p>
      <DemoBlock source={SOURCES.customDirection}>
        <SegmentedCustomDirection />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 属性来禁用一些选项。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <SegmentedDisabled />
      </DemoBlock>

      <Heading level={2} id="自定义选项">
        自定义选项 <span className="docs-version-tag">2.9.8</span>
      </Heading>
      <p>
        当您的 <code>options</code> 格式不同于默认格式时，可通过 <code>props</code>{" "}
        属性自定义 <code>options</code>
      </p>
      <DemoBlock source={SOURCES.aliases}>
        <SegmentedAliases />
      </DemoBlock>

      <Heading level={2}>Block 分段选择器</Heading>
      <p>
        设置<code>block</code>为<code>true</code>以适应父元素的宽度。
      </p>
      <DemoBlock source={SOURCES.block}>
        <SegmentedBlock />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>设置 default slot 位来渲染自定义内容。</p>
      <DemoBlock source={SOURCES.customContent}>
        <SegmentedCustomContent />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <p>使用 CSS 变量设置自定义样式。</p>
      <DemoBlock source={SOURCES.customStyle}>
        <SegmentedCustomStyle />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
