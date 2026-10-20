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

      <DocsContent
        source={`:::tip

在版本 \`2.5.0\`之后， \`el-select\` 的默认宽度更改为 \`100%\` 当使用内联形式时，宽度将显示异常。为了保持显示正常, 您需要手动配置 \`el-select\` 的宽度 (如: [例子](https://github.com/element-plus/element-plus/issues/15834#issuecomment-1936919229)).

:::`}
      />

      <Heading level={2}>基础用法</Heading>
      <p>
        适用广泛的基础单选 <code>v-model</code> 的值为当前被选中的{" "}
        <code>el-option</code> 的 value 属性值
      </p>
      <DemoBlock source={SOURCES.basic}>
        <SelectBasic />
      </DemoBlock>

      <Heading level={2} id="Options 属性">
        Options 属性 <span className="docs-version-tag">2.10.5</span>
      </Heading>
      <p>
        <code>el-option</code> 基本用法。您可以通过 <code>props</code> 属性自定义{" "}
        <code>options</code> 的别名。
      </p>
      <DemoBlock source={SOURCES.options}>
        <SelectOptions />
      </DemoBlock>

      <Heading level={2}>有禁用选项</Heading>
      <p>
        在 <code>el-option</code> 中，设定 <code>disabled</code> 值为
        true，即可禁用该选项
      </p>
      <DemoBlock source={SOURCES.disabledOption}>
        <SelectDisabledOption />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>禁用整个选择器组件</p>
      <p>
        为 <code>el-select</code> 设置 <code>disabled</code>
        属性，则整个选择器不可用。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <SelectDisabled />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>您可以使用清除图标来清除选择。</p>
      <p>
        为 <code>el-select</code> 设置 <code>clearable</code> 属性，则可将选择器清空。
      </p>
      <DemoBlock source={SOURCES.clearable}>
        <SelectClearable />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        使用 <code>size</code> 属性改变选择器大小。除了默认大小外，还有另外两个选项：{" "}
        <code>large</code>, <code>small</code>。
      </p>
      <DemoBlock source={SOURCES.size}>
        <SelectSize />
      </DemoBlock>

      <Heading level={2}>基础多选</Heading>
      <p>多选选择器使用 tag 组件来展示已选中的选项。</p>
      <p>
        为 <code>el-select</code> 设置 <code>multiple</code> 属性即可启用多选，此时{" "}
        <code>v-model</code>{" "}
        的值为当前选中值所组成的数组。默认情况下选中值会以 Tag
        组件的形式展现，你也可以设置 <code>collapse-tags</code>{" "}
        属性将它们合并为一段文字。您可以使用 <code>collapse-tags-tooltip</code>{" "}
        属性来启用鼠标悬停折叠文字以显示具体所选值的行为。
      </p>
      <DemoBlock source={SOURCES.multiple}>
        <SelectMultiple />
      </DemoBlock>

      <Heading level={2}>自定义模板</Heading>
      <p>你可以自定义如何来渲染每一个选项。</p>
      <p>
        将自定义的 HTML 模板插入 <code>el-option</code> 的 slot 中即可。
      </p>
      <DemoBlock source={SOURCES.customTemplate}>
        <SelectCustomTemplate />
      </DemoBlock>

      <Heading level={2} id="自定义下拉菜单的头部">
        自定义下拉菜单的头部 <span className="docs-version-tag">2.4.3</span>
      </Heading>
      <p>您可以自定义下拉菜单的头部。</p>
      <p>Use slot to customize the content.</p>
      <DemoBlock source={SOURCES.customHeader}>
        <SelectCustomHeader />
      </DemoBlock>

      <Heading level={2} id="自定义下拉菜单的底部">
        自定义下拉菜单的底部 <span className="docs-version-tag">2.4.3</span>
      </Heading>
      <p>您可以自定义下拉菜单的底部。</p>
      <p>使用slot 自定义内容</p>
      <DemoBlock source={SOURCES.customFooter}>
        <SelectCustomFooter />
      </DemoBlock>

      <Heading level={2}>将选项进行分组</Heading>
      <p>你可以为选项进行分组来区分不同的选项</p>
      <p>
        使用 <code>el-option-group</code> 对备选项进行分组，它的{" "}
        <code>label</code> 属性为分组名
      </p>
      <DemoBlock source={SOURCES.grouping}>
        <SelectGrouping />
      </DemoBlock>

      <Heading level={2}>筛选选项</Heading>
      <p>可以利用筛选功能快速查找选项。</p>
      <p>
        为<code>el-select</code>添加<code>filterable</code>
        属性即可启用搜索功能。默认情况下，Select 会找出所有 <code>label</code>{" "}
        属性包含输入值的选项。如果希望使用其他的搜索逻辑，可以通过传入一个{" "}
        <code>filter-method</code> 来实现。 <code>filter-method</code> 为一个{" "}
        <code>Function</code>，它会在输入值发生变化时调用，参数为当前输入值。
      </p>
      <DemoBlock source={SOURCES.filterable}>
        <SelectFilterable />
      </DemoBlock>

      <Heading level={2}>远程搜索</Heading>
      <p>输入关键字以从远程服务器中查找数据。</p>
      <p>
        从服务器搜索数据，输入关键字进行查找。为了启用远程搜索，需要将
        <code>filterable</code>和<code>remote</code>设置为<code>true</code>
        ，同时传入一个<code>remote-method</code>。 <code>remote-method</code>为一个
        <code>Function</code>
        ，它会在输入值发生变化时调用，参数为当前输入值。需要注意的是，如果{" "}
        <code>el-option</code> 是通过 <code>v-for</code> 指令渲染出来的，此时需要为{" "}
        <code>el-option</code> 添加 <code>key</code>{" "}
        属性，且其值需具有唯一性，比如这个例子中的 <code>item.value</code>。
      </p>
      <DemoBlock source={SOURCES.remoteSearch}>
        <SelectRemoteSearch />
      </DemoBlock>

      <Heading level={2}>创建新的选项</Heading>
      <p>创建并选中未包含在初始选项中的条目。</p>
      <p>
        通过使用 <code>allow-create</code> 属性，用户可以通过输入框创建新项目。为了使{" "}
        <code>allow-create</code> 正常工作， <code>filterable</code> 的值必须为{" "}
        <code>true</code>。本例还使用了 <code>default-first-option</code>{" "}
        属性，在该属性为 <code>true</code>{" "}
        的情况下，按下回车就可以选中当前选项列表中的第一个选项，无需使用鼠标或键盘方向键进行定位。
      </p>
      <DemoBlock source={SOURCES.allowCreate}>
        <SelectAllowCreate />
      </DemoBlock>

      <Heading level={2}>使用值键 value-key 属性</Heading>
      <p>
        如果 Select 的绑定值为对象类型，请务必指定 <code>value-key</code>{" "}
        作为它的唯一性标识。
      </p>
      <p>
        通过使用 <code>value-key</code>{" "}
        属性，可以正确处理带有重复label的数据。这样虽然<code>label</code>{" "}
        是重复的，但任可通过 <code>id</code> 来确认唯一性。
      </p>
      <DemoBlock source={SOURCES.valueKey}>
        <SelectValueKey />
      </DemoBlock>

      <Heading level={2} id="自定义标签">
        自定义标签 <span className="docs-version-tag">2.5.0</span>
      </Heading>
      <p>您可以自定义标签。</p>
      <p>
        将自定义的标签插入 <code>el-select</code> 的 slot 中即可。{" "}
        <code>collapse-tags</code>, <code>collapse-tags-tooltip</code>,{" "}
        <code>max-collapse-tags</code> 在此模式下不生效.
      </p>
      <DemoBlock source={SOURCES.customTag}>
        <SelectCustomTag />
      </DemoBlock>

      <Heading level={2} id="自定义加载">
        自定义加载 <span className="docs-version-tag">2.5.2</span>
      </Heading>
      <p>修改加载区域内容</p>
      <DemoBlock source={SOURCES.customLoading}>
        <SelectCustomLoading />
      </DemoBlock>

      <Heading level={2} id="空值配置">
        空值配置 <span className="docs-version-tag">2.7.0</span>
      </Heading>
      <p>
        若想配置如空字符串为有效值而不是空值，可以配置 <code>empty-values</code> 为{" "}
        <code>[null, undefined]</code>.
      </p>
      <p>
        如果您想要将清空值更改为 <code>null</code>, 请设置{" "}
        <code>value-on-clear</code> 为 <code>null</code>
      </p>
      <DemoBlock source={SOURCES.emptyValues}>
        <SelectEmptyValues />
      </DemoBlock>

      <Heading level={2} id="自定义标签-1">
        自定义标签 <span className="docs-version-tag">2.7.4</span>
      </Heading>
      <p>您可以自定义标签</p>
      <DemoBlock source={SOURCES.customLabel}>
        <SelectCustomLabel />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
