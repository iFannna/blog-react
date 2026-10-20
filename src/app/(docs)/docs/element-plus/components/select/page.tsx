import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  SelectAllowCreate,
  SelectBasic,
  SelectClearable,
  SelectCustomFooter,
  SelectCustomHeader,
  SelectCustomLabel,
  SelectCustomLoading,
  SelectCustomTag,
  SelectCustomTemplate,
  SelectDisabled,
  SelectDisabledOption,
  SelectEmptyValues,
  SelectFilterable,
  SelectGrouping,
  SelectMultiple,
  SelectOptions,
  SelectRemoteSearch,
  SelectSize,
  SelectValueKey,
} from "@/components/element-plus/examples/select";

export const metadata: Metadata = { title: "Select 选择器" };

const SOURCES = {
  basic: `const [value, setValue] = useState("");

<ElSelect
  value={value}
  onChange={setValue}
  options={options}
  placeholder="Select"
  style={{ width: 240 }}
/>`,

  options: `const options = [
  { id: "Option1", label: "Option1" },
  { id: "Option2", label: "Option2", disabled: true },
  { id: "Option3", label: "Option3" },
];

<ElSelect
  value={value}
  onChange={setValue}
  options={options}
  props={{ value: "id", label: "label", options: "options", disabled: "disabled" }}
  placeholder="Select"
/>`,

  disabledOption: `<ElSelect
  value={value}
  onChange={setValue}
  options={[
    { value: "Option1", label: "Option1" },
    { value: "Option2", label: "Option2", disabled: true },
    { value: "Option3", label: "Option3" },
  ]}
/>`,

  disabled: `<ElSelect value={value} onChange={setValue} disabled options={options} />`,

  clearable: `<ElSelect value={value} onChange={setValue} options={options} clearable />`,

  size: `{["large", "default", "small"].map((size) => (
  <ElSelect
    key={size}
    value={value}
    onChange={setValue}
    options={options}
    size={size}
    placeholder="Select"
    style={{ width: 240 }}
  />
))}`,

  multiple: `<ElSelect value={value} onChange={setValue} multiple options={options} />
<ElSelect value={value} onChange={setValue} multiple collapseTags options={options} />
<ElSelect
  value={value}
  onChange={setValue}
  multiple
  collapseTags
  collapseTagsTooltip
  options={options}
/>
<ElSelect
  value={value}
  onChange={setValue}
  multiple
  collapseTags
  collapseTagsTooltip
  maxCollapseTags={3}
  options={options}
/>`,

  customTemplate: `<ElSelect value={value} onChange={setValue} options={cities}>
  {({ item }) => (
    <>
      <span style={{ float: "left" }}>{String(item.label)}</span>
      <span style={{ float: "right", color: "var(--el-text-color-secondary)", fontSize: 13 }}>
        {String(item.value)}
      </span>
    </>
  )}
</ElSelect>`,

  customHeader: `const [value, setValue] = useState<string[]>([]);
const checkAll = value.length === cities.length;

<ElSelect
  value={value}
  onChange={(next) => setValue(next as string[])}
  multiple
  clearable
  collapseTags
  maxCollapseTags={1}
  options={cities}
  header={
    <ElCheckbox
      checked={checkAll}
      indeterminate={value.length > 0 && value.length < cities.length}
      onCheckedChange={(checked) =>
        setValue(checked ? cities.map((item) => String(item.value)) : [])
      }
    >
      All
    </ElCheckbox>
  }
/>`,

  customFooter: `<ElSelect
  value={value}
  onChange={setValue}
  options={cities}
  footer={
    isAdding ? (
      <div>
        <ElInput
          value={optionName}
          onChange={setOptionName}
          placeholder="input option name"
          size="small"
        />
        <ElButton type="primary" size="small" onClick={onConfirm}>confirm</ElButton>
        <ElButton size="small" onClick={clear}>cancel</ElButton>
      </div>
    ) : (
      <ElButton text bg size="small" onClick={() => setIsAdding(true)}>
        Add an option
      </ElButton>
    )
  }
/>`,

  grouping: `const options = [
  {
    label: "Popular cities",
    options: [
      { value: "Shanghai", label: "Shanghai" },
      { value: "Beijing", label: "Beijing" },
    ],
  },
  {
    label: "City name",
    options: [
      { value: "Chengdu", label: "Chengdu" },
      { value: "Shenzhen", label: "Shenzhen" },
    ],
  },
];

<ElSelect value={value} onChange={setValue} options={options} placeholder="Select" />`,

  filterable: `<ElSelect value={value} onChange={setValue} filterable options={options} placeholder="Select" />`,

  remoteSearch: `const [loading, setLoading] = useState(false);
const [options, setOptions] = useState([]);

const remoteMethod = (query: string) => {
  if (!query) return setOptions([]);
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    setOptions(list.filter((item) => item.label.includes(query)));
  }, 200);
};

<ElSelect
  value={value}
  onChange={setValue}
  multiple
  filterable
  remote
  reserveKeyword
  remoteMethod={remoteMethod}
  loading={loading}
  options={options}
/>`,

  allowCreate: `<ElSelect
  value={value}
  onChange={setValue}
  multiple
  filterable
  allowCreate
  defaultFirstOption
  reserveKeyword={false}
  options={[
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
  ]}
/>`,

  valueKey: `const options = [
  { id: 1, label: "Option A", desc: "Option A - 230506" },
  { id: 2, label: "Option B", desc: "Option B - 230506" },
  { id: 3, label: "Option C", desc: "Option C - 230506" },
];

<ElSelect value={value} onChange={setValue} valueKey="id" options={options} />
<p>selected option's description: {value ? value.desc : "no select"}</p>`,

  customTag: `<ElSelect
  value={value}
  onChange={setValue}
  multiple
  options={colors}
  tag={({ data }) => (
    <>
      {data.map((option) => (
        <ElTag key={String(option.value)} color={String(option.value)} />
      ))}
    </>
  )}
>
  {({ item }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ElTag color={String(item.value)} size="small" style={{ marginRight: 8 }} />
      <span style={{ color: String(item.value) }}>{String(item.label)}</span>
    </div>
  )}
</ElSelect>`,

  customLoading: `<ElSelect
  value={value}
  onChange={setValue}
  multiple
  filterable
  remote
  reserveKeyword
  remoteMethod={remoteMethod}
  loading={loading}
  options={options}
  loadingSlot={
    <ElIcon className="is-loading">
      <Loading />
    </ElIcon>
  }
/>`,

  emptyValues: `<ElSelect
  value={value}
  onChange={setValue}
  emptyValues={[null, undefined]}
  valueOnClear={null}
  onClear={() => message.info("The clear value is: null")}
  clearable
  options={[{ value: "", label: "All" }, ...options]}
/>`,

  customLabel: `<ElSelect
  value={value}
  onChange={setValue}
  options={options}
  clearable
  label={({ label, value }) => (
    <>
      <span>{String(label)}: </span>
      <span style={{ fontWeight: "bold" }}>{String(value)}</span>
    </>
  )}
/>`,
};

const API_MD = `
## Select API

### Select Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中项的值，多选时为数组 | ^[string] / ^[number] / ^[boolean] / ^[object] / ^[array] | — |
| options | 选项数据，分组项通过 \`options\` 子数组嵌套 | ^[array]\`SelectOptionType[]\` | [] |
| props | 选项字段别名 | ^[object]\`SelectOptionProps\` | — |
| value-key | 选中值对象作为唯一标识的字段名 | ^[string] | value |
| multiple | 是否多选 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| clearable | 是否可清空 | ^[boolean] | false |
| clear-icon | 自定义清空图标 | ^[ReactNode] | — |
| filterable | 是否可搜索 | ^[boolean] | false |
| filter-method | 自定义过滤方法 | ^[Function]\`(query: string) => void\` | — |
| remote | 是否远程搜索，需同时开启 filterable | ^[boolean] | false |
| remote-method | 远程搜索方法 | ^[Function]\`(query: string) => void\` | — |
| remote-show-suffix | 远程搜索时是否显示后缀图标 | ^[boolean] | false |
| debounce | 远程搜索防抖时长（毫秒） | ^[number] | 300 |
| loading | 是否正在加载数据 | ^[boolean] | false |
| loading-text | 加载中文案 | ^[string] | 加载中 |
| reserve-keyword | 多选且可搜索时是否保留关键词 | ^[boolean] | true |
| default-first-option | 回车时是否选中第一个匹配项 | ^[boolean] | false |
| allow-create | 是否允许创建新选项，需开启 filterable | ^[boolean] | false |
| automatic-dropdown | 非搜索模式下聚焦是否自动展开 | ^[boolean] | false |
| multiple-limit | 多选数量上限，0 表示不限 | ^[number] | 0 |
| collapse-tags | 多选时是否折叠标签 | ^[boolean] | false |
| collapse-tags-tooltip | 折叠标签是否在悬停时展示全部 | ^[boolean] | false |
| max-collapse-tags | 折叠时最多展示的标签数 | ^[number] | 1 |
| tag-type | 标签类型 | ^[enum]\`'success' \\| 'info' \\| 'warning' \\| 'danger' \\| 'primary'\` | info |
| tag-effect | 标签主题 | ^[enum]\`'light' \\| 'dark' \\| 'plain'\` | light |
| placeholder | 占位文本 | ^[string] | 请选择 |
| no-data-text | 无选项时的文案 | ^[string] | 无数据 |
| no-match-text | 搜索无匹配项时的文案 | ^[string] | 无匹配数据 |
| popper-class / popper-style | 下拉浮层的类名与样式 | ^[string] / ^[object] | — |
| teleported | 下拉是否传送到 body | ^[boolean] | true |
| persistent | 下拉关闭后是否保留 DOM | ^[boolean] | true |
| effect | 浮层主题 | ^[enum]\`'dark' \\| 'light'\` | light |
| placement | 下拉位置 | ^[string] | bottom-start |
| fallback-placements | 下拉翻转兜底位置 | ^[array] | — |
| show-arrow | 是否显示下拉箭头 | ^[boolean] | true |
| offset | 下拉与输入框的间距 | ^[number] | 12 |
| fit-input-width | 下拉宽度是否与输入框一致，或传固定数值 | ^[boolean] / ^[number] | true |
| suffix-icon | 自定义后缀图标 | ^[ReactNode] | — |
| empty-values | 空值集合 | ^[array] | — |
| value-on-clear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] / ^[null] | — |
| scrollbar-always-on | 是否总是显示滚动条 | ^[boolean] | false |
| validate-event | 值变化时是否触发表单校验 | ^[boolean] | true |
| name | 原生 input name | ^[string] | — |
| id | 原生 input id | ^[string] | — |
| autocomplete | 原生 autocomplete | ^[string] | off |
| tabindex | 原生 input tabindex | ^[string] / ^[number] | 0 |
| aria-label | 无障碍标签 | ^[string] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Select Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化 | ^[Function]\`(value: SelectValue) => void\` |
| onVisibleChange | 下拉可见性变化 | ^[Function]\`(visible: boolean) => void\` |
| onRemoveTag | 多选移除标签 | ^[Function]\`(value: unknown) => void\` |
| onClear | 点击清空 | ^[Function]\`() => void\` |
| onFocus | 获得焦点 | ^[Function]\`(event: FocusEvent) => void\` |
| onBlur | 失去焦点 | ^[Function]\`(event: FocusEvent) => void\` |
| onEndReached | 滚动到边界 | ^[Function]\`(direction: 'top' \\| 'bottom' \\| 'left' \\| 'right') => void\` |

### Select Slots（React render props）

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| children | 自定义选项内容 | ^[Function]\`({ item, index, disabled }) => ReactNode\` |
| label | 自定义选中值与标签文案 | ^[Function]\`({ index, label, value }) => ReactNode\` |
| tag | 自定义多选标签 | ^[Function]\`({ data, selectDisabled, deleteTag }) => ReactNode\` |
| header | 下拉头部 | ^[ReactNode] |
| footer | 下拉底部 | ^[ReactNode] |
| loadingSlot | 自定义加载内容 | ^[ReactNode] |
| empty | 自定义空数据内容 | ^[ReactNode] |
| prefix | 输入框前缀 | ^[ReactNode] |

### Select Exposes

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| focus | 使选择器获得焦点 | — |
| blur | 使选择器失去焦点 | — |
| scrollTo | 滚动到指定选项 | ^[Function]\`(index: number) => void\` |
| selectedLabel | 当前选中项文案，多选返回数组 | — |

### SelectOptionType

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项值，字段名可通过 props.value 改写 | ^[string] / ^[number] / ^[boolean] / ^[object] | — |
| label | 选项显示文本，字段名可通过 props.label 改写 | ^[ReactNode] | — |
| disabled | 是否禁用该项，字段名可通过 props.disabled 改写 | ^[boolean] | false |
| options | 分组选项的子选项，字段名可通过 props.options 改写 | ^[array] | — |
| type | 在内置类型中固定为 \`Group\` 时渲染为分组标题 | ^[string] | — |
| created | 由 allow-create 生成的临时选项 | ^[boolean] | false |
`;

export default function SelectPage() {
  return (
    <>
      <h1>Select 选择器</h1>
      <p>当选项过多时，使用下拉菜单展示并选择内容。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        <code>value</code> 是当前选中项的值，通过 <code>options</code> 提供选项数据。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <SelectBasic />
      </DemoBlock>

      <Heading level={2}>选项属性</Heading>
      <p>
        通过 <code>props</code> 自定义选项对象中 value、label、disabled 的字段名。
      </p>
      <DemoBlock source={SOURCES.options}>
        <SelectOptions />
      </DemoBlock>

      <Heading level={2}>有禁用选项</Heading>
      <p>
        在选项中设置 <code>disabled</code> 为 <code>true</code> 可禁用该选项。
      </p>
      <DemoBlock source={SOURCES.disabledOption}>
        <SelectDisabledOption />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        为 <code>ElSelect</code> 设置 <code>disabled</code> 可禁用整个组件。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <SelectDisabled />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>
        设置 <code>clearable</code> 后会出现清空图标。
      </p>
      <DemoBlock source={SOURCES.clearable}>
        <SelectClearable />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        通过 <code>size</code> 改变尺寸，除默认外还有 <code>large</code>、
        <code>small</code>。
      </p>
      <DemoBlock source={SOURCES.size}>
        <SelectSize />
      </DemoBlock>

      <Heading level={2}>基础多选</Heading>
      <p>
        设置 <code>multiple</code> 开启多选；<code>collapseTags</code> 折叠标签，
        <code>collapseTagsTooltip</code> 在悬停时展示全部，
        <code>maxCollapseTags</code> 控制折叠前展示的数量。
      </p>
      <DemoBlock source={SOURCES.multiple}>
        <SelectMultiple />
      </DemoBlock>

      <Heading level={2}>自定义模板</Heading>
      <p>通过 <code>children</code> 渲染函数自定义选项内容。</p>
      <DemoBlock source={SOURCES.customTemplate}>
        <SelectCustomTemplate />
      </DemoBlock>

      <Heading level={2}>下拉头部</Heading>
      <p>通过 <code>header</code> 自定义下拉头部，例如全选。</p>
      <DemoBlock source={SOURCES.customHeader}>
        <SelectCustomHeader />
      </DemoBlock>

      <Heading level={2}>下拉底部</Heading>
      <p>
        通过 <code>footer</code> 自定义下拉底部，可实现动态添加选项。
      </p>
      <DemoBlock source={SOURCES.customFooter}>
        <SelectCustomFooter />
      </DemoBlock>

      <Heading level={2}>分组</Heading>
      <p>
        选项数据的 <code>options</code> 字段用于嵌套子选项，形成分组。
      </p>
      <DemoBlock source={SOURCES.grouping}>
        <SelectGrouping />
      </DemoBlock>

      <Heading level={2}>选项过滤</Heading>
      <p>
        设置 <code>filterable</code> 开启搜索，默认按 label 过滤，也可通过
        <code>filterMethod</code> 自定义。
      </p>
      <DemoBlock source={SOURCES.filterable}>
        <SelectFilterable />
      </DemoBlock>

      <Heading level={2}>远程搜索</Heading>
      <p>
        设置 <code>remote</code> 与 <code>remoteMethod</code> 从服务端加载选项，
        <code>remoteShowSuffix</code> 控制搜索时是否显示后缀图标。
      </p>
      <DemoBlock source={SOURCES.remoteSearch}>
        <SelectRemoteSearch />
      </DemoBlock>

      <Heading level={2}>创建条目</Heading>
      <p>
        设置 <code>allowCreate</code> 允许创建不在选项列表中的条目。
      </p>
      <DemoBlock source={SOURCES.allowCreate}>
        <SelectAllowCreate />
      </DemoBlock>

      <Heading level={2}>使用 value-key</Heading>
      <p>
        当选中值是对象时，通过 <code>valueKey</code> 指定唯一标识字段。
      </p>
      <DemoBlock source={SOURCES.valueKey}>
        <SelectValueKey />
      </DemoBlock>

      <Heading level={2}>自定义标签</Heading>
      <p>通过 <code>tag</code> 渲染函数自定义多选标签。</p>
      <DemoBlock source={SOURCES.customTag}>
        <SelectCustomTag />
      </DemoBlock>

      <Heading level={2}>自定义加载</Heading>
      <p>
        通过 <code>loadingSlot</code> 自定义远程搜索的加载状态内容。
      </p>
      <DemoBlock source={SOURCES.customLoading}>
        <SelectCustomLoading />
      </DemoBlock>

      <Heading level={2}>空值</Heading>
      <p>
        通过 <code>emptyValues</code> 定义空值集合，<code>valueOnClear</code>
        定义清空后的返回值。
      </p>
      <DemoBlock source={SOURCES.emptyValues}>
        <SelectEmptyValues />
      </DemoBlock>

      <Heading level={2}>自定义标签文案</Heading>
      <p>通过 <code>label</code> 渲染函数自定义选中值与标签的显示内容。</p>
      <DemoBlock source={SOURCES.customLabel}>
        <SelectCustomLabel />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
