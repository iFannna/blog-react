import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  RadioBasic,
  RadioBorder,
  RadioButton,
  RadioDisabled,
  RadioOptions,
  RadioSizes,
} from "@/components/docs/examples/radio";

export const metadata: Metadata = {
  title: "Radio 单选框",
};

const SOURCES = {
  basic: `const [value, setValue] = useState<RadioValue>("1");

<ElRadioGroup value={value} onChange={setValue}>
  <ElRadio value="1" label="选项一" />
  <ElRadio value="2" label="选项二" />
</ElRadioGroup>`,

  disabled: `<ElRadioGroup value={value} onChange={setValue}>
  <ElRadio value="1" label="选项一" />
  <ElRadio value="2" label="选项二" disabled />
</ElRadioGroup>

<ElRadioGroup value="1" onChange={() => {}} disabled>
  <ElRadio value="1" label="全部禁用一" />
  <ElRadio value="2" label="全部禁用二" />
</ElRadioGroup>`,

  button: `<ElRadioGroup value={value} onChange={setValue} type="button">
  <ElRadio value="1" label="上海" />
  <ElRadio value="2" label="北京" />
  <ElRadio value="3" label="广州" />
</ElRadioGroup>

<ElRadioGroup value="1" onChange={() => {}} type="button" fill="#626aef" textColor="#fff">
  <ElRadio value="1" label="自定义填充色" />
  <ElRadio value="2" label="未选中" />
</ElRadioGroup>`,

  border: `<ElRadioGroup value={value} onChange={setValue}>
  <ElRadio value="1" label="选项一" border />
  <ElRadio value="2" label="选项二" border />
</ElRadioGroup>`,

  options: `const OPTION_PROPS = { value: "id", label: "name", disabled: "unable" };

<ElRadioGroup
  value={value}
  onChange={setValue}
  options={OPTIONS}
  optionProps={OPTION_PROPS}
/>`,

  sizes: `<ElRadioGroup value={value} onChange={setValue} size="large">
  <ElRadio value="1" label="large" />
  <ElRadio value="2" label="选项二" />
</ElRadioGroup>

<ElRadioGroup value={value} onChange={setValue}>
  <ElRadio value="1" label="default" />
  <ElRadio value="2" label="选项二" />
</ElRadioGroup>

<ElRadioGroup value={value} onChange={setValue} size="small">
  <ElRadio value="1" label="small" />
  <ElRadio value="2" label="选项二" />
</ElRadioGroup>`,
};

const API_MD = `
## Radio API

### Radio Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 本选项的值，与 group 的 value 相等时选中 | ^[string] / ^[number] / ^[boolean] | — |
| checked | 脱离 group 独立使用时的选中态 | ^[boolean] | false |
| label | 显示文案，也可直接用 children | ^[string] / ^[ReactNode] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| border | 是否显示边框 | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| name | 原生 name 属性 | ^[string] | — |
| button | button 形态，组内由 group 的 type 决定 | ^[boolean] | — |

### Radio Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 独立使用时选中态变化 | ^[Function]\`(checked: boolean) => void\` |

### Radio Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义单选框文案 | \`children\` / \`label\` |

### RadioGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 容器 id | ^[string] | — |
| aria-label | 无障碍标签 | ^[string] | radio-group |
| value | 当前选中值 | ^[string] / ^[number] / ^[boolean] | — |
| disabled | 是否禁用组内所有单选框 | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| name | 原生 name 属性 | ^[string] | — |
| fill | button 形态选中态的背景色 | ^[string] | — |
| text-color | button 形态选中态的字体色 | ^[string] | — |
| type | 渲染形态 | ^[enum]\`'radio' \\| 'button'\` | radio |
| options | 数据化渲染选项 | ^[array] | — |
| option-props | 选项字段别名 | ^[object]\`{ value?, label?, disabled? }\` | — |

### RadioGroup Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化 | ^[Function]\`(value: RadioValue) => void\` |

### RadioGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义选项内容；不传时按 options 渲染 | Radio |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\`（组内） | group 的 \`value\` + \`onChange\` | 单值不是布尔，故不用 checked |
| \`v-model\`（独立） | \`checked\` + \`onCheckedChange\` | 独立使用时为布尔选中态 |
| \`@change\` | \`onChange\` / \`onCheckedChange\` | — |
| \`label\` 兼作 value | 需显式传 \`value\` | 官方标记为 3.0 移除 |
| group 的 \`props\`（选项字段别名） | group 的 \`optionProps\` | 避免与 React 组件 props 混淆 |

**未实现的官方能力**：

- 组内 \`label\` 兼作 \`value\`（官方 3.0 将移除）。

\`validate-event\` 已接入 ElFormItem：RadioGroup 的值变化后触发 \`change\` 校验（与官方一致，独立 Radio 不触发）。
`;

export default function RadioPage() {
  return (
    <>
      <h1>Radio 单选框</h1>
      <p>在一组备选项中进行单选。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        单选框不应该有太多的可选项，如果需要有很多的选项，建议使用 Select 组件。
        使用 <code>ElRadioGroup</code> 的 <code>value</code> 与 <code>onChange</code>
        管理选中值，<code>ElRadio</code> 用 <code>value</code> 标识自己。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <RadioBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 属性即可禁用，可以在单个 Radio 上设置，
        也可以用 <code>ElRadioGroup</code> 的 <code>disabled</code> 禁用整组。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <RadioDisabled />
      </DemoBlock>

      <Heading level={2}>数据化选项</Heading>
      <p>
        通过 <code>options</code> 直接渲染选项数组，并用 <code>optionProps</code>
        指定 <code>value</code>、<code>label</code>、<code>disabled</code> 的字段别名。
      </p>
      <DemoBlock source={SOURCES.options}>
        <RadioOptions />
      </DemoBlock>

      <Heading level={2}>按钮样式</Heading>
      <p>
        设置 <code>type=&quot;button&quot;</code> 可渲染为按钮形态，
        <code>fill</code> 与 <code>textColor</code> 控制选中态配色。
      </p>
      <DemoBlock source={SOURCES.button}>
        <RadioButton />
      </DemoBlock>

      <Heading level={2}>带边框</Heading>
      <p>
        设置 <code>border</code> 属性可以渲染为带有边框的单选框。
      </p>
      <DemoBlock source={SOURCES.border}>
        <RadioBorder />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        通过 <code>size</code> 属性控制尺寸。
      </p>
      <DemoBlock source={SOURCES.sizes}>
        <RadioSizes />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
