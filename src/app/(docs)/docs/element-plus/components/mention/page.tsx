import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  MentionBasic,
  MentionForm,
  MentionLabel,
  MentionLoading,
  MentionPrefix,
  MentionProps,
  MentionTextarea,
  MentionWhole,
} from "@/components/element-plus/examples/mention";

export const metadata: Metadata = { title: "Mention 提及" };

const SOURCES = {
  basic: `const [value, setValue] = useState("@");

<ElMention
  value={value}
  onChange={setValue}
  options={[
    { label: "Fuphoenixes", value: "Fuphoenixes" },
    { label: "kooriookami", value: "kooriookami" },
    { label: "Jeremy", value: "Jeremy" },
    { label: "btea", value: "btea" },
  ]}
  style={{ width: 320 }}
  placeholder="Please input"
/>`,

  props: `const options = [
  { name: "Fuphoenixes", id: "Fuphoenixes", unable: true },
  { name: "kooriookami", id: "kooriookami" },
  { name: "Jeremy", id: "Jeremy", unable: true },
  { name: "btea", id: "btea" },
];

<ElMention
  value={value}
  onChange={setValue}
  options={options}
  props={{ label: "name", value: "id", disabled: "unable" }}
  style={{ width: 320 }}
  placeholder="Please input"
/>`,

  textarea: `<ElMention
  value={value}
  onChange={setValue}
  type="textarea"
  options={options}
  style={{ width: 320 }}
  placeholder="Please input"
/>`,

  label: `<ElMention
  value={value}
  onChange={setValue}
  options={options}
  style={{ width: 320 }}
  placeholder="Please input"
  labelSlot={({ item }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ElAvatar size={24} src={item.avatar} />
      <span style={{ marginLeft: 6 }}>{item.value}</span>
    </div>
  )}
/>`,

  loading: `const [loading, setLoading] = useState(false);
const [options, setOptions] = useState([]);

const handleSearch = (pattern: string) => {
  setLoading(true);
  setTimeout(() => {
    setOptions(
      ["Fuphoenixes", "kooriookami", "Jeremy", "btea"].map((item) => ({
        label: pattern + item,
        value: pattern + item,
      })),
    );
    setLoading(false);
  }, 1500);
};

<ElMention
  value={value}
  onChange={setValue}
  options={options}
  loading={loading}
  onSearch={handleSearch}
  style={{ width: 320 }}
  placeholder="Please input"
/>`,

  prefix: `const handleSearch = (pattern: string, prefix: string) => {
  const data = { "@": ["Fuphoenixes", "Jeremy"], "#": ["1.0", "2.0"] };
  setOptions((data[prefix] || []).map((value) => ({ value })));
};

<ElMention
  value={value}
  onChange={setValue}
  options={options}
  prefix={["@", "#"]}
  onSearch={handleSearch}
  style={{ width: 320 }}
  placeholder="input @ to mention people, # to mention tag"
/>`,

  whole: `const checkIsWhole = (pattern: string, prefix: string) =>
  ({ "@": ["Fuphoenixes", "btea"], "#": ["1.0", "2.0"] }[prefix] || []).includes(
    pattern,
  );

<ElMention
  value={value1}
  onChange={setValue1}
  whole
  options={options1}
  style={{ width: 320 }}
  placeholder="Please input"
/>
<ElDivider />
<ElMention
  value={value2}
  onChange={setValue2}
  options={options2}
  prefix={["@", "#"]}
  whole
  checkIsWhole={checkIsWhole}
  onSearch={handleSearch}
  style={{ width: 320 }}
  placeholder="input @ to mention people, # to mention tag"
/>`,

  form: `const formRef = useRef<FormExpose>(null);
const [form, setForm] = useState({ name: "", desc: "" });

const submit = async () => {
  const ok = await formRef.current!.validate();
  console.log(ok ? "submit!" : "not valid");
};

<ElForm
  ref={formRef}
  model={form}
  rules={rules}
  onModelChange={(next) => setForm(next as typeof form)}
>
  <ElFormItem label="name" prop="name">
    <ElMention
      value={form.name}
      onChange={(v) => setForm({ ...form, name: v })}
      options={options}
    />
  </ElFormItem>
  <ElFormItem label="desc" prop="desc">
    <ElMention
      value={form.desc}
      onChange={(v) => setForm({ ...form, desc: v })}
      type="textarea"
      options={options}
    />
  </ElFormItem>
  <ElFormItem>
    <ElButton type="primary" onClick={submit}>
      Submit
    </ElButton>
    <ElButton onClick={() => formRef.current?.resetFields()}>Reset</ElButton>
  </ElFormItem>
</ElForm>`,
};

const API_MD = `
## Mention API

### Mention Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 输入值 | ^[string] | — |
| options | 提及选项列表 | ^[array]\`MentionOption[]\` | [] |
| props | 选项字段别名配置 | ^[object]\`MentionOptionProps\` | \`{ value: 'value', label: 'label', disabled: 'disabled' }\` |
| prefix | 触发提及的前缀字符，长度必须为 1，可传数组 | ^[string] / ^[array]\`string[]\` | '@' |
| split | 分隔提及的字符，长度必须为 1 | ^[string] | ' ' |
| filter-option | 自定义过滤逻辑，传 false 关闭过滤 | ^[false] / ^[Function]\`(pattern, option) => boolean\` | 内置包含匹配 |
| placement | 弹出位置 | ^[enum]\`'bottom' \\| 'top'\` | 'bottom' |
| show-arrow | 弹层是否带箭头 | ^[boolean] | false |
| offset | 弹层偏移 | ^[number] | 0 |
| whole | 退格时是否把整个提及词作为一个整体删除 | ^[boolean] | false |
| check-is-whole | 自定义「整词」判定 | ^[Function]\`(pattern, prefix) => boolean\` | — |
| loading | 下拉是否处于加载中 | ^[boolean] | false |
| popper-class | 弹层自定义类名 | ^[string] | — |
| popper-style | 弹层自定义样式 | ^[object] | — |
| popper-options | 透传给 popper.js 的配置 | ^[object] | — |
| [input props](./input) | ElInput 的属性全部支持（size / placeholder / clearable / maxlength / type 等） | — | — |

### Mention Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 输入值变化 | ^[Function]\`(value: string) => void\` |
| onSearch | 命中前缀时触发 | ^[Function]\`(pattern: string, prefix: string) => void\` |
| onSelect | 选中选项时触发 | ^[Function]\`(option: MentionOption, prefix: string) => void\` |
| onWholeRemove | 整体删除提及词时触发 | ^[Function]\`(pattern: string, prefix: string) => void\` |
| [input events](./input) | ElInput 的事件全部支持 | — |

### Mention Slots

React 里插槽以 render 函数形式的 props 提供。

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| labelSlot | 自定义选项内容 | ^[Function]\`({ item, index }) => ReactNode\` |
| loadingSlot | 自定义加载内容 | ^[ReactNode] |
| headerSlot | 下拉顶部内容 | ^[ReactNode] |
| footerSlot | 下拉底部内容 | ^[ReactNode] |
| input slots | 通过 prefix / suffix / prepend / append / prefixIcon / suffixIcon 传入 | — |

### Mention Exposes（ref）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| input | 原生 input 元素，对应官方的 el-input 实例入口 | ^[object]\`HTMLInputElement \\| null\` |
| textarea | 原生 textarea 元素（type 为 textarea 时） | ^[object]\`HTMLTextAreaElement \\| null\` |
| dropdownVisible | 下拉是否可见 | ^[boolean]（只读） |

### MentionOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项值 | ^[string] | — |
| label | 选项显示文本，省略时显示 value | ^[string] | — |
| disabled | 是否禁用该项 | ^[boolean] | false |
| [key: string] | 其它任意字段，供 labelSlot 使用 | ^[any] | — |

`;

export default function MentionPage() {
  return (
    <>
      <h1>Mention 提及</h1>
      <p>用于在输入中提及某人或某事。</p>

      <Heading level={2}>基础用法</Heading>
      <p>最简单的用法。</p>
      <DemoBlock source={SOURCES.basic}>
        <MentionBasic />
      </DemoBlock>

      <Heading level={2} id="Props">
        Props <span className="docs-version-tag">2.11.3</span>
      </Heading>
      <p>
        你可以通过 <code>props</code> 属性自定义 <code>options</code> 的别名。
      </p>
      <DemoBlock source={SOURCES.props}>
        <MentionProps />
      </DemoBlock>

      <Heading level={2}>Textarea</Heading>
      <p>
        输入类型可以设置为 <code>textarea</code> 。
      </p>
      <DemoBlock source={SOURCES.textarea}>
        <MentionTextarea />
      </DemoBlock>

      <Heading level={2}>自定义标签</Heading>
      <p>使用 &quot;label&quot; 自定义标签。</p>
      <DemoBlock source={SOURCES.label}>
        <MentionLabel />
      </DemoBlock>

      <Heading level={2}>加载远程选项</Heading>
      <p>异步加载选项。</p>
      <DemoBlock source={SOURCES.loading}>
        <MentionLoading />
      </DemoBlock>

      <Heading level={2}>自定义触发字段</Heading>
      <p>
        通过 <code>prefix</code> 属性 自定义触发字段。默认为 <code>@</code>,{" "}
        <code>Array&lt;string&gt;</code> 。
      </p>
      <DemoBlock source={SOURCES.prefix}>
        <MentionPrefix />
      </DemoBlock>

      <Heading level={2}>整体删除</Heading>
      <p>
        将<code>whole</code>属性设置为 <code>true</code>
        ，当您按下退格键时，此处的 mention 区域将作为一个整体被删除。设置
        &quot;check-is-whole&quot; 属性来自定义检查逻辑。
      </p>
      <DemoBlock source={SOURCES.whole}>
        <MentionWhole />
      </DemoBlock>

      <Heading level={2}>在表单里使用</Heading>
      <p>
        与 <code>el-form</code> 一起使用
      </p>
      <DocsContent
        source={`:::tip

由于这个组件是基于[\`el-input\`](./input#attributes)派生的，他们的原始属性未被更改，故不在此重复。请跳转查看原组件的相应文档。

:::`}
      />
      <DemoBlock source={SOURCES.form}>
        <MentionForm />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
