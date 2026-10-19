import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  SelectV2AllowCreate,
  SelectV2BasicUsage,
  SelectV2Clearable,
  SelectV2CustomFooter,
  SelectV2CustomHeader,
  SelectV2CustomLabel,
  SelectV2CustomLoading,
  SelectV2CustomTag,
  SelectV2CustomWidth,
  SelectV2CustomizedOption,
  SelectV2Disabled,
  SelectV2EmptyValues,
  SelectV2Filterable,
  SelectV2Grouping,
  SelectV2HideExtraTags,
  SelectV2Multiple,
  SelectV2PropsDemo,
  SelectV2RemoteSearch,
  SelectV2Size,
  SelectV2UseValueKey,
} from "@/components/docs/examples/select-v2";

export const metadata: Metadata = {
  title: "Select V2 虚拟化选择器",
};

const SOURCES = {
  basic: `const [value, setValue] = useState<string>();

<ElSelectV2
  value={value}
  options={baseOptions}
  placeholder="Please select"
  style={{ width: 240 }}
  onChange={(next) => setValue(next as string)}
/>`,

  multiple: `<ElSelectV2
  value={value}
  options={baseOptions}
  placeholder="Please select"
  style={{ width: 240 }}
  multiple
  onChange={(next) => setValue(next as string[])}
/>`,

  size: `<ElSelectV2 size="large" ... />
<ElSelectV2 ... />
<ElSelectV2 size="small" ... />`,

  hideExtraTags: `{/* collapse-tags */}
<ElSelectV2 multiple collapseTags ... />

{/* collapse-tags-tooltip */}
<ElSelectV2 multiple collapseTags collapseTagsTooltip ... />

{/* max-collapse-tags */}
<ElSelectV2 multiple collapseTags collapseTagsTooltip maxCollapseTags={3} ... />`,

  filterable: `<ElSelectV2
  value={value}
  options={baseOptions}
  placeholder="Please select"
  style={{ width: 240 }}
  multiple
  filterable
  onChange={(next) => setValue(next as string[])}
/>`,

  disabled: `<ElSelectV2 multiple filterable options={options} ... />
<ElSelectV2 multiple filterable disabled options={options} ... />`,

  grouping: `const options = Array.from({ length: 10 }).map((_, idx) => {
  const label = idx + 1;
  return {
    value: \`Group \${label}\`,
    label: \`Group \${label}\`,
    options: Array.from({ length: 10 }).map((__, childIdx) => ({
      value: \`Option \${childIdx + 1 + 10 * label}\`,
      label: \`\${initials[childIdx % 10]}\${childIdx + 1 + 10 * label}\`,
    })),
  };
});

<ElSelectV2 multiple filterable options={options} ... />`,

  clearable: `<ElSelectV2 multiple clearable ... />
<ElSelectV2 clearable ... />`,

  customizedOption: `<ElSelectV2 multiple filterable options={baseOptions} ...>
  {({ item }) => (
    <>
      <span style={{ marginRight: 8 }}>{item.label}</span>
      <span style={{ color: "var(--el-text-color-secondary)", fontSize: 13 }}>
        {item.value}
      </span>
    </>
  )}
</ElSelectV2>`,

  header: `<ElSelectV2
  multiple
  collapseTags
  header={
    <ElCheckbox
      checked={checkAll}
      indeterminate={indeterminate}
      onCheckedChange={handleCheckAll}
    >
      All
    </ElCheckbox>
  }
  ...
/>`,

  footer: `<ElSelectV2
  ref={selectRef}
  footer={
    !isAdding ? (
      <ElButton text bg size="small" onClick={() => setIsAdding(true)}>
        Add an option
      </ElButton>
    ) : (
      <div>
        <ElInput value={optionName} onChange={setOptionName} />
        <ElButton type="primary" size="small" onClick={onConfirm}>
          confirm
        </ElButton>
        <ElButton size="small" onClick={clear}>cancel</ElButton>
      </div>
    )
  }
  ...
/>`,

  allowCreate: `<ElSelectV2
  allowCreate
  defaultFirstOption
  filterable
  multiple
  clearable
  ...
/>
<ElSelectV2 allowCreate defaultFirstOption filterable clearable ... />
<ElSelectV2 allowCreate defaultFirstOption filterable multiple reserveKeyword={false} ... />`,

  remoteSearch: `const remoteMethod = (query: string) => {
  if (query !== "") {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOptions(states.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ));
    }, 200);
  } else {
    setOptions([]);
  }
};

<ElSelectV2 remote filterable remoteMethod={remoteMethod} loading={loading} ... />
<ElSelectV2 remote filterable remoteShowSuffix remoteMethod={remoteMethod} ... />`,

  valueKey: `const [value, setValue] = useState({
  name: "Option 1",
  test: "test 0",
});

<ElSelectV2
  value={value}
  valueKey="name"
  options={options}
  onChange={(next) => setValue(next as Record<string, unknown>)}
/>`,

  props: `<ElSelectV2
  props={{ label: "name", value: "id" }}
  options={options}
  filterable
  multiple
  ...
/>`,

  customTag: `<ElSelectV2
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
      <ElTag color={String(item.value)} size="small" />
      <span style={{ color: String(item.value) }}>{item.label}</span>
    </div>
  )}
</ElSelectV2>`,

  customLoading: `<ElSelectV2
  remote
  filterable
  loading={loading}
  loadingSlot={<ElIcon className="is-loading"><Loading /></ElIcon>}
  ...
/>`,

  emptyValues: `<ElSelectV2
  value={value}
  options={options}
  emptyValues={[null, undefined]}
  valueOnClear={null}
  clearable
  onClear={() => message.info(\`The clear value is: \${value}\`)}
/>`,

  customLabel: `const label = ({ label, value }) => (
  <>
    <span>{label}: </span>
    <span style={{ fontWeight: "bold" }}>{value}</span>
  </>
);

<ElSelectV2 label={label} clearable ... />
<ElSelectV2 label={label} clearable multiple ... />`,

  customWidth: `<ElSelectV2 fitInputWidth={false} ... />
<ElSelectV2 fitInputWidth ... />
<ElSelectV2 fitInputWidth={440} ... />`,
};

const API_MD = `
## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value / v-model | ^[string] / ^[number] / ^[boolean] / ^[object] / ^[array] | — |
| options | 选项数据，\`value\` / \`label\` 字段可通过 \`props\` 自定义 | ^[array] | — |
| props | 选项字段别名配置，见下表 | ^[object] | — |
| multiple | 是否多选 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| valueKey | 对象值作为唯一标识的字段名 | ^[string] | value |
| size | 组件尺寸 | ^[enum]\`'' \\| 'large' \\| 'default' \\| 'small'\` | '' |
| clearable | 是否可清空 | ^[boolean] | false |
| clearIcon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| collapseTags | 多选时是否将标签折叠为文本 | ^[boolean] | false |
| multipleLimit | 多选可选数量上限，0 表示不限 | ^[number] | 0 |
| id | 原生 input 的 id | ^[string] | — |
| name | 原生 input 的 name | ^[string] | — |
| effect | 浮层主题 | ^[enum]\`'dark' \\| 'light'\` / ^[string] | light |
| autocomplete | 原生 input 的 autocomplete | ^[string] | off |
| placeholder | 占位文本 | ^[string] | Please select |
| filterable | 是否可过滤 | ^[boolean] | false |
| allowCreate | 是否允许创建新选项，需 \`filterable\` 为 true | ^[boolean] | false |
| filterMethod | 自定义过滤方法，参数为当前输入值 | ^[Function]\`(query: string) => void\` | — |
| loading | 是否正在从服务端加载数据 | ^[boolean] | false |
| loadingText | 加载中文案 | ^[string] | — |
| reserveKeyword | 选中过滤项后是否保留关键词 | ^[boolean] | true |
| defaultFirstOption | 回车时选中第一个匹配项，配合 \`filterable\` / \`remote\` | ^[boolean] | false |
| noMatchText | 无匹配项文案，也可用 \`empty\` 插槽 | ^[string] | — |
| noDataText | 无选项文案，也可用 \`empty\` 插槽 | ^[string] | No Data |
| popperClass | 下拉与标签浮层的自定义类名 | ^[string] / ^[object] | '' |
| popperStyle | 下拉与标签浮层的自定义样式 | ^[string] / ^[object]\`CSSProperties\` | — |
| teleported | 下拉是否 teleport | ^[boolean] | true |
| appendTo | 下拉挂载目标 | ^[CSSSelector] / ^[HTMLElement] | — |
| persistent | 不活跃时是否保留下拉 DOM | ^[boolean] | true |
| automaticDropdown | 非过滤模式下聚焦是否自动展开 | ^[boolean] | false |
| fitInputWidth | 下拉宽度是否与输入框一致；传数字时固定为该宽度 | ^[boolean] / ^[number] | true |
| suffixIcon | 自定义后缀图标 | ^[ReactNode] | ArrowDown |
| height | 下拉面板高度 | ^[number] | 274 |
| itemHeight | 每项高度 | ^[number] | 34 |
| estimatedOptionHeight | 动态行高估算值；传入后启用动态尺寸列表 | ^[number] | — |
| scrollbarAlwaysOn | 是否总是显示滚动条 | ^[boolean] | false |
| remote | 是否从服务端搜索数据 | ^[boolean] | false |
| debounce | 远程搜索防抖时长（毫秒） | ^[number] | 300 |
| remoteMethod | 输入值变化时调用，参数为当前输入值 | ^[Function]\`(query: string) => void\` | — |
| remoteShowSuffix | 远程搜索时是否显示后缀图标 | ^[boolean] | false |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| offset | 下拉与输入框的间距 | ^[number] | 12 |
| showArrow | 下拉是否显示箭头 | ^[boolean] | true |
| placement | 下拉位置 | ^[enum]\`'top' \\| 'top-start' \\| ... \\| 'right-end'\` | bottom-start |
| fallbackPlacements | 下拉翻转兜底位置 | ^[array]\`Placement[]\` | ['bottom-start', 'top-start', 'right', 'left'] |
| collapseTagsTooltip | 悬停折叠文本时是否展示全部标签 | ^[boolean] | false |
| tagTooltip | 折叠标签浮层配置 | ^[object]\`SelectV2TagTooltipProps\` | {} |
| maxCollapseTags | 折叠时最多展示的标签数 | ^[number] | 1 |
| tagType | 标签类型 | ^[enum]\`'' \\| 'success' \\| 'info' \\| 'warning' \\| 'danger'\` | info |
| tagEffect | 标签主题 | ^[enum]\`'' \\| 'light' \\| 'dark' \\| 'plain'\` | light |
| ariaLabel | 原生 input 的 aria-label | ^[string] | — |
| emptyValues | 空值集合 | ^[array] | — |
| valueOnClear | 清空时返回的值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| tabindex | 输入框的 tabindex | ^[string] / ^[number] | — |

### props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项对象中作为值的字段名 | ^[string] | value |
| label | 选项对象中作为文案的字段名 | ^[string] | label |
| options | 选项对象中作为子选项的字段名 | ^[string] | options |
| disabled | 选项对象中作为禁用态的字段名 | ^[string] | disabled |

### tag-tooltip

\`tagTooltip\` 中显式设置的字段优先，未设置的字段继承 Select 的 \`effect\`、\`popperClass\`、\`popperStyle\`、\`teleported\`、\`appendTo\` 等配置，最后回退到 Tooltip 的默认值。

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| appendTo | 浮层内容挂载目标 | ^[CSSSelector] / ^[HTMLElement] | — |
| placement | 浮层位置 | ^[enum]\`Placement\` | bottom |
| fallbackPlacements | 浮层翻转兜底位置 | ^[array]\`Placement[]\` | ['bottom', 'top', 'right', 'left'] |
| effect | 浮层主题 | ^[enum]\`'dark' \\| 'light'\` / ^[string] | — |
| popperClass | 浮层自定义类名 | ^[string] | — |
| popperStyle | 浮层自定义样式 | ^[string] / ^[object]\`CSSProperties\` | — |
| teleported | 浮层是否 teleport | ^[boolean] | — |
| showAfter | 显示延时（毫秒） | ^[number] | — |
| hideAfter | 隐藏延时（毫秒） | ^[number] | — |
| autoClose | 自动关闭延时（毫秒） | ^[number] | — |
| offset | 浮层与触发元素的间距 | ^[number] | — |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 选中值变化时触发 | ^[Function]\`(val: SelectV2Value) => void\` |
| onVisibleChange | 下拉显示/隐藏时触发 | ^[Function]\`(visible: boolean) => void\` |
| onRemoveTag | 多选移除标签时触发，参数为被移除的值 | ^[Function]\`(tagValue: unknown) => void\` |
| onClear | 点击清空图标时触发 | ^[Function]\`() => void\` |
| onBlur | 输入框失焦时触发 | ^[Function]\`(event: FocusEvent) => void\` |
| onFocus | 输入框聚焦时触发 | ^[Function]\`(event: FocusEvent) => void\` |
| onEndReached | 下拉滚动到边界时触发 | ^[Function]\`(direction: 'top' \\| 'bottom' \\| 'left' \\| 'right') => void\` |

### Slots（React props）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 选项渲染器，参数为 \`{ item, index, disabled }\` | ^[Function]\`(params) => ReactNode\` |
| header | 下拉顶部内容 | ^[ReactNode] |
| footer | 下拉底部内容 | ^[ReactNode] |
| empty | 选项为空时的内容 | ^[ReactNode] |
| loadingSlot | 加载中内容（对应官方 loading 插槽） | ^[ReactNode] |
| prefix | 输入框前缀内容 | ^[ReactNode] |
| tag | 自定义标签，参数为 \`{ data, selectDisabled, deleteTag }\` | ^[Function]\`(params) => ReactNode\` |
| label | 自定义选中值文案，参数为 \`{ index, label, value }\` | ^[Function]\`(params) => ReactNode\` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]\`() => void\` |
| blur | 输入框失焦并收起下拉 | ^[Function]\`() => void\` |
| scrollTo | 滚动到指定索引的选项 | ^[Function]\`(index: number) => void\` |
| selectedLabel | 当前选中项文案，多选返回数组 | ^[string] / ^[array]\`string[]\` |

## Type Declarations

\`\`\`ts
type SelectV2Value =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null
  | undefined

interface SelectV2OptionProps {
  label?: string
  value?: string
  disabled?: string
  options?: string
}

interface SelectV2TagTooltipProps {
  appendTo?: string | HTMLElement
  placement?: Placement
  fallbackPlacements?: Placement[]
  effect?: 'dark' | 'light' | string
  popperClass?: string
  popperStyle?: CSSProperties
  teleported?: boolean
  showAfter?: number
  hideAfter?: number
  autoClose?: number
  offset?: number
}

interface SelectV2OptionRenderParams {
  item: SelectV2OptionType
  index: number
  disabled: boolean
}

interface SelectV2LabelRenderParams {
  index: number
  label: unknown
  value: unknown
}

interface SelectV2TagRenderParams {
  data: SelectV2Option[]
  selectDisabled: boolean
  deleteTag: (event: MouseEvent, option: SelectV2Option) => void
}
\`\`\`

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\` | \`value\` + \`onChange\` | 受控用法，多选时值必须是数组 |
| \`@change\` / \`@visible-change\` | \`onChange\` / \`onVisibleChange\` | 事件改为 on 前缀 |
| 默认插槽 | \`children\` 渲染函数 | 参数为 \`{ item, index, disabled }\` |
| \`header\` / \`footer\` / \`empty\` / \`loading\` / \`prefix\` 插槽 | \`header\` / \`footer\` / \`empty\` / \`loadingSlot\` / \`prefix\` props | ReactNode |
| \`tag\` / \`label\` 作用域插槽 | \`tag\` / \`label\` 渲染函数 | 参数与官方一致 |
| \`suffix-icon\` / \`clear-icon\` 组件类型 | \`ReactNode\` | 例如 \`suffixIcon={<Search />}\` |
| \`ref\` + defineExpose | \`ref\` + \`SelectV2Expose\` | 方法名保持一致 |
| \`popper-append-to-body\` | 不支持 | 使用 \`teleported\` + \`appendTo\` |
| \`popper-options\` | 不支持 | Popper 配置未透传 |
`;

export default function SelectV2Page() {
  return (
    <>
      <h1>Select V2 虚拟化选择器</h1>
      <p>
        <code>Select V2</code> 使用虚拟列表渲染选项，适用于十万级数据量的下拉选择。
        组件对外的 props、事件与插槽与官方保持一致。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>使用虚拟列表渲染一千条选项。</p>
      <DemoBlock source={SOURCES.basic}>
        <SelectV2BasicUsage />
      </DemoBlock>

      <Heading level={2}>多选</Heading>
      <p>设置 <code>multiple</code> 开启多选。</p>
      <DemoBlock source={SOURCES.multiple}>
        <SelectV2Multiple />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>通过 <code>size</code> 切换大、默认、小三种尺寸。</p>
      <DemoBlock source={SOURCES.size}>
        <SelectV2Size />
      </DemoBlock>

      <Heading level={2}>隐藏多余标签</Heading>
      <p>
        多选选中项过多时，可通过 <code>collapseTags</code> 折叠标签；
        配合 <code>collapseTagsTooltip</code> 悬停查看全部，
        <code>maxCollapseTags</code> 控制折叠前展示的数量。
      </p>
      <DemoBlock source={SOURCES.hideExtraTags}>
        <SelectV2HideExtraTags />
      </DemoBlock>

      <Heading level={2}>可过滤多选</Heading>
      <p>设置 <code>filterable</code> 后可以输入关键词过滤选项。</p>
      <DemoBlock source={SOURCES.filterable}>
        <SelectV2Filterable />
      </DemoBlock>

      <Heading level={2}>禁用选择器与选项</Heading>
      <p>设置 <code>disabled</code> 禁用选择器，或在选项上设置 <code>disabled</code>。</p>
      <DemoBlock source={SOURCES.disabled}>
        <SelectV2Disabled />
      </DemoBlock>

      <Heading level={2}>选项分组</Heading>
      <p>
        在选项对象上提供 <code>options</code> 字段即可渲染分组，
        组内选项会展平到同一个虚拟列表中。
      </p>
      <DemoBlock source={SOURCES.grouping}>
        <SelectV2Grouping />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>设置 <code>clearable</code> 显示清空图标。</p>
      <DemoBlock source={SOURCES.clearable}>
        <SelectV2Clearable />
      </DemoBlock>

      <Heading level={2}>自定义选项渲染</Heading>
      <p>通过 <code>children</code> 渲染函数自定义每个选项的内容。</p>
      <DemoBlock source={SOURCES.customizedOption}>
        <SelectV2CustomizedOption />
      </DemoBlock>

      <Heading level={2}>下拉头部</Heading>
      <p>通过 <code>header</code> 在下拉顶部放置内容，例如全选复选框。</p>
      <DemoBlock source={SOURCES.header}>
        <SelectV2CustomHeader />
      </DemoBlock>

      <Heading level={2}>下拉底部</Heading>
      <p>通过 <code>footer</code> 在下拉底部放置内容，例如新增选项。</p>
      <DemoBlock source={SOURCES.footer}>
        <SelectV2CustomFooter />
      </DemoBlock>

      <Heading level={2}>创建选项</Heading>
      <p>
        设置 <code>allowCreate</code> 与 <code>filterable</code>{" "}
        允许输入并创建新选项；<code>defaultFirstOption</code>{" "}
        让回车选中第一个匹配项。
      </p>
      <DemoBlock source={SOURCES.allowCreate}>
        <SelectV2AllowCreate />
      </DemoBlock>

      <Heading level={2}>远程搜索</Heading>
      <p>
        设置 <code>remote</code> 与 <code>remoteMethod</code>{" "}
        从服务端获取选项；<code>remoteShowSuffix</code>{" "}
        控制远程模式下是否显示后缀图标。
      </p>
      <DemoBlock source={SOURCES.remoteSearch}>
        <SelectV2RemoteSearch />
      </DemoBlock>

      <Heading level={2}>使用 value-key</Heading>
      <p>
        值为对象时，通过 <code>valueKey</code>{" "}
        指定唯一标识字段，组件按该字段比较选项。
      </p>
      <DemoBlock source={SOURCES.valueKey}>
        <SelectV2UseValueKey />
      </DemoBlock>

      <Heading level={2}>自定义选项别名</Heading>
      <p>
        通过 <code>props</code> 指定选项对象中 <code>label</code> 与{" "}
        <code>value</code> 对应的字段。
      </p>
      <DemoBlock source={SOURCES.props}>
        <SelectV2PropsDemo />
      </DemoBlock>

      <Heading level={2}>自定义标签</Heading>
      <p>
        通过 <code>tag</code> 渲染函数完全替换标签内容，<code>children</code>{" "}
        同时自定义选项。
      </p>
      <DemoBlock source={SOURCES.customTag}>
        <SelectV2CustomTag />
      </DemoBlock>

      <Heading level={2}>自定义加载内容</Heading>
      <p>
        通过 <code>loadingSlot</code> 自定义加载中的内容。
      </p>
      <DemoBlock source={SOURCES.customLoading}>
        <SelectV2CustomLoading />
      </DemoBlock>

      <Heading level={2}>空值</Heading>
      <p>
        <code>emptyValues</code> 与 <code>valueOnClear</code>{" "}
        控制空值判断和清空后的返回值。
      </p>
      <DemoBlock source={SOURCES.emptyValues}>
        <SelectV2EmptyValues />
      </DemoBlock>

      <Heading level={2}>自定义文案</Heading>
      <p>
        通过 <code>label</code> 渲染函数自定义选中值的展示文案。
      </p>
      <DemoBlock source={SOURCES.customLabel}>
        <SelectV2CustomLabel />
      </DemoBlock>

      <Heading level={2}>自定义宽度</Heading>
      <p>
        <code>fitInputWidth</code> 为 <code>false</code>{" "}
        时下拉按内容宽度展开；传数字时固定为该宽度。
      </p>
      <DemoBlock source={SOURCES.customWidth}>
        <SelectV2CustomWidth />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
