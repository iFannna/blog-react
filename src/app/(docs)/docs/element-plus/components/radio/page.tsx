import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  RadioBasic,
  RadioBorder,
  RadioButton,
  RadioDisabled,
  RadioOptions,
  RadioSizes,
} from "@/components/element-plus/examples/radio";

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
`;

export default function RadioPage() {
  return (
    <>
      <h1>Radio 单选框</h1>
      <p>在一组备选项中进行单选</p>

      <DocsContent
        source={`:::warning

\`label\` 作为 \`value\` 来使用已经被 **废弃**, 建议\`label\` 只用来表示展示的文字，这个被废弃的用法**将会在** ^(3.0.0) 版本被移除，请考虑使用新 API 替换.

:::`}
      />
      <DocsContent
        source={`:::tip

新的 API \`value\` 已在 ^(2.6.0) 版本添加，文档中的示例都将使用 \`value\`。如果您使用的版本 **低于** ^(2.6.0)，请参考：

:::`}
      />

      <Heading level={2}>基础用法</Heading>
      <p>
        单选框不应该有太多的可选项，如果你有很多的可选项你应该使用选择框而不是单选框。
      </p>
      <p>
        要使用 Radio 组件，只需要设置<code>v-model</code>
        绑定变量，选中意味着变量的值为相应 Radio <code>value</code>属性的值，{" "}
        <code>value</code>可以是<code>String</code>、<code>Number</code> 或{" "}
        <code>Boolean</code>。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <RadioBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        <code>disabled</code> 属性可以用来控制单选框的禁用状态。
      </p>
      <p>
        你只需要为单选框设置 <code>disabled</code> 属性就能控制其禁用状态。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <RadioDisabled />
      </DemoBlock>

      <Heading level={2}>单选框组</Heading>
      <p>适用于在多个互斥的选项中选择的场景</p>
      <p>
        结合<code>el-radio-group</code>元素和子元素<code>el-radio</code>
        可以实现单选组，为 <code>el-radio-group</code> 绑定 <code>v-model</code>
        ，再为 每一个 <code>el-radio</code> 设置好 <code>label</code>{" "}
        属性即可，另外，还可以通过 <code>change</code>{" "}
        事件来响应变化，它会传入一个参数 <code>value</code> 来表示改变之后的值。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <RadioBasic />
      </DemoBlock>

      <Heading level={2}>带有边框</Heading>
      <p>
        设置 <code>border</code> 属性为 true 可以渲染为带有边框的单选框。
      </p>
      <DemoBlock source={SOURCES.border}>
        <RadioBorder />
      </DemoBlock>

      <Heading level={2} id="Options 属性">
        Options 属性 <span className="docs-version-tag">2.11.2</span>
      </Heading>
      <p>
        基础用法 <code>el-radio-group</code> 的快捷示例。您可以通过{" "}
        <code>props</code> 属性自定义 <code>options</code> 的别名。
      </p>
      <DemoBlock source={SOURCES.options}>
        <RadioOptions />
      </DemoBlock>

      <Heading level={2}>单选按钮</Heading>
      <p>带有按钮组视觉效果的单选框</p>
      <p>
        只需要把 <code>el-radio</code> 元素换成 <code>el-radio-button</code>{" "}
        元素即可， :::demo 您可以使用 <code>填充</code> 和 <code>文本颜色</code>{" "}
        设置按钮的样式。
      </p>
      <DemoBlock source={SOURCES.button}>
        <RadioButton />
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
