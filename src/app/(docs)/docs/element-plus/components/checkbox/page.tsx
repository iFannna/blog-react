import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  CheckboxBasic,
  CheckboxBorder,
  CheckboxButton,
  CheckboxDisabled,
  CheckboxGroupDemo,
  CheckboxIndeterminate,
  CheckboxMinMax,
  CheckboxOptions,
} from "@/components/element-plus/examples/checkbox";

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
`;

export default function CheckboxPage() {
  return (
    <>
      <h1>Checkbox 多选框</h1>
      <p>在一组备选项中进行多选。</p>

      <DocsContent
        source={`:::warning

\`label\` 作为 \`value\` 来使用已经被 **废弃**, 建议\`label\` 只用来表示展示的文字，这个被废弃的用法**将会在** ^(3.0.0) 版本被移除，请考虑使用新 API 替换.

:::`}
      />
      <DocsContent
        source={`:::tip

新的 API \`value\` 已在 ^(2.6.0) 版本添加，文档中的示例都将使用 \`value\`。如果您使用的版本 **低于** ^(2.6.0) 并且使用 \`checkbox-group\`，请参考：

:::`}
      />

      <Heading level={2}>基础用法</Heading>
      <p>
        单独使用可以表示两种状态之间的切换，写在标签中的内容为 checkbox
        按钮后的介绍。
      </p>
      <p>
        <code>checkbox-group</code>元素能把多个 checkbox 管理为一组，只需要在 Group
        中使用 <code>v-model</code> 绑定 <code>Array</code> 类型的变量即可。
        只有一个选项时的默认值类型为 <code>Boolean</code>，当选中时值为
        <code>true</code>。 <code>el-checkbox</code>
        标签中的内容将成为复选框按钮之后的描述。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CheckboxBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>多选框不可用状态。</p>
      <p>
        设置 <code>disabled</code> 属性即可。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <CheckboxDisabled />
      </DemoBlock>

      <Heading level={2}>多选框组</Heading>
      <p>
        适用于多个勾选框绑定到同一个数组的情景，通过是否勾选来表示这一组选项中选中的项。
      </p>
      <p>
        在 <code>el-checkbox</code> 元素中定义 <code>v-model</code>
        绑定变量，单一的 <code>checkbox</code> 中，默认绑定变量的值会是{" "}
        <code>Boolean</code>，选中为 <code>true</code>。在{" "}
        <code>el-checkbox</code> 组件中，<code>value</code> 是选择框的值。
        如果该组件下没有被传入内容，那么 <code>label</code> 将会作为 checkbox
        按钮后的介绍。 <code>value</code> 也与数组中的元素值相对应。
        如果指定的值存在于数组中，就处于选择状态，反之亦然。
      </p>
      <DemoBlock source={SOURCES.group}>
        <CheckboxGroupDemo />
      </DemoBlock>

      <Heading level={2} id="Options 属性">
        Options 属性 <span className="docs-version-tag">2.11.2</span>
      </Heading>
      <p>
        基础用法 <code>el-checkbox-group</code> 的快捷示例。您可以通过{" "}
        <code>props</code> 属性自定义 <code>options</code> 的别名。
      </p>
      <DemoBlock source={SOURCES.options}>
        <CheckboxOptions />
      </DemoBlock>

      <Heading level={2}>中间状态</Heading>
      <p>
        <code>indeterminate</code> 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
      </p>
      <DemoBlock source={SOURCES.indeterminate}>
        <CheckboxIndeterminate />
      </DemoBlock>

      <Heading level={2}>可选项目数量的限制</Heading>
      <p>
        使用 <code>min</code> 和 <code>max</code> 属性能够限制可以被勾选的项目的数量。
      </p>
      <DemoBlock source={SOURCES.minMax}>
        <CheckboxMinMax />
      </DemoBlock>

      <Heading level={2}>按钮样式</Heading>
      <p>按钮样式的多选组合。</p>
      <p>
        只需要把 <code>el-checkbox</code> 元素替换为{" "}
        <code>el-checkbox-button</code> 元素即可。此外，Element Plus 还提供了
        <code>size</code>属性。
      </p>
      <DemoBlock source={SOURCES.button}>
        <CheckboxButton />
      </DemoBlock>

      <Heading level={2}>带有边框</Heading>
      <p>
        设置<code>border</code>属性可以渲染为带有边框的多选框。
      </p>
      <DemoBlock source={SOURCES.border}>
        <CheckboxBorder />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
