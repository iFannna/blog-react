import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  CheckboxBasic,
  CheckboxBorder,
  CheckboxButton,
  CheckboxDisabled,
  CheckboxGroupDemo,
  CheckboxIndeterminate,
  CheckboxMinMax,
  CheckboxOptions,
} from "@/components/docs/examples/checkbox";

export const metadata: Metadata = {
  title: "Checkbox 多选框",
};

const SOURCES = {
  basic: `const [checked, setChecked] = useState(false);

<ElCheckbox checked={checked} onCheckedChange={setChecked}>
  选项
</ElCheckbox>`,

  disabled: `<ElCheckbox>未选中</ElCheckbox>
<ElCheckbox checked disabled>选中且禁用</ElCheckbox>
<ElCheckbox disabled>禁用</ElCheckbox>`,

  group: `const [checked, setChecked] = useState<CheckboxValueType[]>(["上海"]);

<ElCheckboxGroup value={checked} onChange={setChecked}>
  {["上海", "北京", "广州", "深圳"].map((city) => (
    <ElCheckbox key={city} value={city} label={city} />
  ))}
</ElCheckboxGroup>`,

  indeterminate: `const [checked, setChecked] = useState<CheckboxValueType[]>(["上海", "北京"]);

const isAll = checked.length === ALL.length;
const isIndeterminate = checked.length > 0 && !isAll;

<ElCheckbox
  checked={isAll}
  indeterminate={isIndeterminate}
  onCheckedChange={(value) => setChecked(value ? [...ALL] : [])}
>
  全选
</ElCheckbox>

<ElCheckboxGroup value={checked} onChange={setChecked}>
  {ALL.map((city) => (
    <ElCheckbox key={city} value={city} label={city} />
  ))}
</ElCheckboxGroup>`,

  minMax: `const [checked, setChecked] = useState<CheckboxValueType[]>(["上海", "北京"]);

<ElCheckboxGroup value={checked} onChange={setChecked} min={1} max={2}>
  {CITIES.map((city) => (
    <ElCheckbox key={city} value={city} label={city} />
  ))}
</ElCheckboxGroup>`,

  button: `<ElCheckboxGroup value={checked} onChange={setChecked} type="button">
  {CITIES.map((city) => (
    <ElCheckbox key={city} value={city} label={city} />
  ))}
</ElCheckboxGroup>

<ElCheckboxGroup value={["上海"]} onChange={() => {}} type="button" fill="#626aef" textColor="#fff">
  <ElCheckbox value="上海" label="上海" />
  <ElCheckbox value="北京" label="北京" />
</ElCheckboxGroup>`,

  border: `<ElCheckbox border>选项一</ElCheckbox>
<ElCheckbox border checked>选项二</ElCheckbox>
<ElCheckbox border disabled>选项三</ElCheckbox>`,

  options: `const OPTION_PROPS = { label: "name", value: "id", disabled: "unable" };

<ElCheckboxGroup
  value={checked}
  onChange={setChecked}
  options={OPTIONS}
  optionProps={OPTION_PROPS}
/>`,
};

const API_MD = `
## Checkbox API

### Checkbox Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 独立使用时是否选中 | ^[boolean] | false |
| value | 组内使用时标识本选项的值 | ^[string] / ^[number] / ^[boolean] | — |
| label | 显示文案，也可直接用 children | ^[string] / ^[ReactNode] | — |
| indeterminate | 半选状态，仅控制样式 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| border | 是否显示边框 | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| button | button 形态，组内由 group 的 type 决定 | ^[boolean] | — |
| name | 原生 name 属性 | ^[string] | — |
| id | 原生 id 属性 | ^[string] | — |
| tabIndex | 原生 tabindex 属性 | ^[number] | — |

### Checkbox Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 独立使用时选中态变化 | ^[Function]\`(checked: boolean) => void\` |

### Checkbox Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义选中项文案 | \`children\` / \`label\` |

### CheckboxGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 容器 id | ^[string] | — |
| aria-label | 无障碍标签 | ^[string] | checkbox-group |
| value | 选中值集合 | ^[array]\`CheckboxValueType[]\` | [] |
| disabled | 是否禁用组内所有选项 | ^[boolean] | false |
| min | 最少选中数量 | ^[number] | — |
| max | 最多选中数量 | ^[number] | — |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| fill | button 形态选中态的背景色 | ^[string] | — |
| text-color | button 形态选中态的字体色 | ^[string] | — |
| tag | 容器标签名 | ^[string] | div |
| type | 渲染形态 | ^[enum]\`'checkbox' \\| 'button'\` | checkbox |
| options | 数据化渲染选项 | ^[array] | — |
| option-props | 选项字段别名 | ^[object]\`{ value?, label?, disabled? }\` | — |

### CheckboxGroup Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中集合变化 | ^[Function]\`(value: CheckboxValueType[]) => void\` |

### CheckboxGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义选项内容；不传时按 options 渲染 | Checkbox |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 独立 \`v-model\` | \`checked\` + \`onCheckedChange\` | 布尔形态 |
| 组内 \`v-model\` | group 的 \`value\` + \`onChange\` | 数组形态 |
| \`@change\` | \`onCheckedChange\` / group 的 \`onChange\` | — |
| group 的 \`props\`（选项字段别名） | group 的 \`optionProps\` | 避免与 React 组件 props 混淆 |
| \`true-value\` / \`false-value\` | 未实现 | 见下方说明 |
| \`label\` 兼作 value | 需显式传 \`value\` | 官方 2.x 的兼容行为将在 3.0 移除 |

**未实现的官方能力**（均有官方 deprecation 标记，属 3.0 将移除的行为）：

- \`true-value\` / \`false-value\`（及其废弃别名 \`true-label\` / \`false-label\`）：官方 3.0 会移除，React 侧不再复刻。
- 组内 \`label\` 兼作 \`value\`：官方同样标记为 3.0 移除，请显式传 \`value\`。

\`validate-event\` 已接入 ElFormItem：独立 Checkbox 在 \`checked\` 变化后、CheckboxGroup 在选中集合变化后触发 \`change\` 校验。
`;

export default function CheckboxPage() {
  return (
    <>
      <h1>Checkbox 多选框</h1>
      <p>在一组备选项中进行多选。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        单独使用可以表示两种状态之间的切换，独立使用时用 <code>checked</code> 与
        <code>onCheckedChange</code>。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CheckboxBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 属性即可禁用。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <CheckboxDisabled />
      </DemoBlock>

      <Heading level={2}>多选框组</Heading>
      <p>
        适用于多个勾选框绑定到同一个数组的情景，通过 <code>ElCheckboxGroup</code> 的
        <code>value</code> 与 <code>onChange</code> 管理选中集合；每个
        <code>ElCheckbox</code> 用 <code>value</code> 标识自己。
      </p>
      <DemoBlock source={SOURCES.group}>
        <CheckboxGroupDemo />
      </DemoBlock>

      <Heading level={2}>indeterminate 状态</Heading>
      <p>
        <code>indeterminate</code> 属性用以表示 checkbox 的不确定状态，
        一般用于实现全选的效果。
      </p>
      <DemoBlock source={SOURCES.indeterminate}>
        <CheckboxIndeterminate />
      </DemoBlock>

      <Heading level={2}>可选数量限制</Heading>
      <p>
        使用 <code>min</code> 和 <code>max</code> 属性限制选中的数量，
        达到上限后未选中项自动禁用，达到下限后已选中项不可取消。
      </p>
      <DemoBlock source={SOURCES.minMax}>
        <CheckboxMinMax />
      </DemoBlock>

      <Heading level={2}>数据化选项</Heading>
      <p>
        通过 <code>options</code> 直接渲染选项数组，并用 <code>optionProps</code>
        指定 <code>value</code>、<code>label</code>、<code>disabled</code> 的字段别名。
      </p>
      <DemoBlock source={SOURCES.options}>
        <CheckboxOptions />
      </DemoBlock>

      <Heading level={2}>按钮样式</Heading>
      <p>
        设置 <code>type=&quot;button&quot;</code> 可渲染为按钮形态，
        <code>fill</code> 与 <code>textColor</code> 控制选中态配色。
      </p>
      <DemoBlock source={SOURCES.button}>
        <CheckboxButton />
      </DemoBlock>

      <Heading level={2}>带边框</Heading>
      <p>
        设置 <code>border</code> 属性可以渲染为带有边框的多选框。
      </p>
      <DemoBlock source={SOURCES.border}>
        <CheckboxBorder />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
