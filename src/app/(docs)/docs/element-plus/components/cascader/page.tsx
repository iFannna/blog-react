import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  CascaderAnyLevel,
  CascaderBasic,
  CascaderCheckOnClickNode,
  CascaderClearable,
  CascaderClearIcon,
  CascaderCustomContent,
  CascaderCustomHeaderFooter,
  CascaderCustomSuggestionItem,
  CascaderCustomTag,
  CascaderDynamicLoading,
  CascaderFilterable,
  CascaderFitInputWidth,
  CascaderLastLevel,
  CascaderMultipleSelection,
  CascaderOptionDisabling,
  CascaderPanelDemo,
  CascaderShowCheckedStrategy,
  CascaderVirtualScroll,
} from "@/components/element-plus/examples/cascader";

export const metadata: Metadata = {
  title: "Cascader 级联选择器",
};

const SOURCES = {
  basic: `const [value, setValue] = useState<CascaderValue>([]);

<ElCascader value={value} options={OPTIONS} onChange={setValue} />

<ElCascader
  value={value}
  options={OPTIONS}
  props={{ expandTrigger: "hover" }}
  onChange={setValue}
/>`,

  optionDisabling: `const OPTIONS = [
  {
    value: "guide",
    label: "Guide",
    disabled: true,
    children: [/* ... */],
  },
  // ...
];

<ElCascader options={OPTIONS} />`,

  clearable: `const [value, setValue] = useState<CascaderValue>([]);

<ElCascader
  value={value}
  options={OPTIONS}
  clearable
  onChange={setValue}
/>`,

  clearIcon: `import { CloseBold } from "@/components/element-plus/icons";

<ElCascader
  value={value}
  options={OPTIONS}
  clearable
  clearIcon={<CloseBold />}
  placeholder="Custom clear icon"
  onChange={setValue}
/>`,

  lastLevel: `<ElCascader
  value={value}
  options={OPTIONS}
  showAllLevels={false}
  onChange={setValue}
/>`,

  multipleSelection: `<ElCascader options={OPTIONS} props={{ multiple: true }} clearable />

<ElCascader
  options={OPTIONS}
  props={{ multiple: true }}
  collapseTags
  clearable
/>

<ElCascader
  options={OPTIONS}
  props={{ multiple: true }}
  collapseTags
  collapseTagsTooltip
  clearable
/>

<ElCascader
  options={OPTIONS}
  props={{ multiple: true }}
  collapseTags
  collapseTagsTooltip
  maxCollapseTags={3}
  clearable
/>`,

  anyLevel: `<ElCascader options={OPTIONS} props={{ checkStrictly: true }} clearable />

<ElCascader
  options={OPTIONS}
  props={{ multiple: true, checkStrictly: true }}
  clearable
/>`,

  dynamicLoading: `const props = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node;
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map(() => ({
        value: ++id,
        label: \`Option - \${id}\`,
        leaf: level >= 2,
      }));
      resolve(nodes);
    }, 1000);
  },
};

<ElCascader props={props} />`,

  filterable: `<ElCascader
  placeholder="Try searching Guide"
  options={OPTIONS}
  filterable
/>

<ElCascader
  placeholder="Try searching Guide"
  options={OPTIONS}
  props={{ multiple: true }}
  filterable
/>`,

  customContent: `<ElCascader
  options={OPTIONS}
  renderLabel={({ node, data }) => (
    <span>
      {data.label}
      {!node.isLeaf ? \` (\${data.children?.length})\` : ""}
    </span>
  )}
/>`,

  customSuggestionItem: `<ElCascader
  options={OPTIONS}
  filterable
  placeholder="Try searching: Guide"
  renderSuggestionItem={({ item }) => (
    <span>🔍 {item.pathLabels.join(" > ")}</span>
  )}
/>`,

  panel: `<ElCascaderPanel options={OPTIONS} />`,

  customTag: `<ElCascader
  options={OPTIONS}
  props={{ multiple: true }}
  clearable
  renderTag={({ data }) => (
    <>
      {data.map((item, index) => (
        <ElTag key={item.key} color={index % 2 === 0 ? "#FFDE0A" : ""}>
          {item.text}
        </ElTag>
      ))}
    </>
  )}
/>`,

  showCheckedStrategy: `<ElCascader
  value={value1}
  options={OPTIONS}
  props={{ multiple: true }}
  showCheckedStrategy="child"
  clearable
  onChange={setValue1}
/>

<ElCascader
  value={value2}
  options={OPTIONS}
  props={{ multiple: true }}
  showCheckedStrategy="parent"
  clearable
  onChange={setValue2}
/>`,

  checkOnClickNode: `const [showPrefix, setShowPrefix] = useState(true);

<ElSwitch
  checked={showPrefix}
  activeText="show prefix"
  inactiveText="hide prefix"
  onCheckedChange={setShowPrefix}
/>

<ElCascader
  value={value}
  options={OPTIONS}
  props={{
    showPrefix,
    checkStrictly: true,
    checkOnClickNode: true,
  }}
  clearable
  onChange={setValue}
/>

<ElCascader
  value={value2}
  options={OPTIONS}
  showCheckedStrategy="parent"
  props={{ showPrefix, multiple: true, checkOnClickNode: true }}
  clearable
  onChange={setValue2}
/>`,

  customHeaderFooter: `<ElCascader
  value={value}
  options={OPTIONS}
  props={{ multiple: true }}
  clearable
  header={
    <ElCheckbox
      checked={checkAll}
      indeterminate={indeterminate}
      onCheckedChange={handleCheckAll}
    >
      All
    </ElCheckbox>
  }
  onChange={handleChange}
/>

<ElCascader
  value={value}
  options={OPTIONS}
  props={{ multiple: true }}
  clearable
  footer={<ElButton link size="small" onClick={() => setValue([])}>Clear</ElButton>}
  onChange={handleChange}
/>`,

  virtualScroll: `const OPTIONS = generateOptions(20000);

<ElCascader
  value={value}
  options={OPTIONS}
  filterMethod={(node, keyword) =>
    node.text.toLowerCase().includes(keyword.toLowerCase())
  }
  filterable
  virtualScroll
  clearable
  placeholder="Select with large data"
  onChange={setValue}
/>`,

  fitInputWidth: `<ElCascader
  value={value}
  options={OPTIONS}
  placeholder="Default expanding panel"
  filterable
  onChange={setValue}
/>

<ElCascader
  value={value}
  options={OPTIONS}
  placeholder="Fit input width"
  filterable
  fitInputWidth
  onChange={setValue}
/>

<ElCascader
  value={value}
  options={OPTIONS}
  placeholder="Fixed width (400px)"
  filterable
  fitInputWidth={400}
  onChange={setValue}
  renderSuggestionItem={({ item }) => (
    <div>{item.text} (Custom content that is very long)</div>
  )}
/>`,
};

const API_MD = `
## Cascader API

### Cascader Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] / ^[number] / ^[array] | — |
| options | 选项数据，字段名可通过 props 自定义 | ^[array]\`CascaderOption[]\` | — |
| props | 配置项，见下方 CascaderProps 表 | ^[object]\`CascaderProps\` | — |
| size | 输入框尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| placeholder | 输入框占位文本 | ^[string] | — |
| disabled | 是否禁用 | ^[boolean] | — |
| clearable | 是否可清空 | ^[boolean] | — |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| show-all-levels | 输入框是否显示选中值的完整路径 | ^[boolean] | true |
| collapse-tags | 多选时是否折叠标签 | ^[boolean] | — |
| collapse-tags-tooltip | 折叠标签时，悬停是否显示全部标签（需开启 collapse-tags） | ^[boolean] | false |
| max-collapse-tags-tooltip-height | 折叠标签提示框的最大高度 | ^[string] / ^[number] | — |
| separator | 选项文案分隔符 | ^[string] | ' / ' |
| filterable | 是否可搜索 | ^[boolean] | — |
| filter-method | 自定义搜索逻辑，返回是否命中 | ^[Function]\`(node: Node, keyword: string) => boolean\` | — |
| debounce | 搜索防抖延迟（毫秒） | ^[number] | 300 |
| before-filter | 过滤前钩子，返回 false 或 reject 时中止过滤 | ^[Function]\`(value: string) => boolean\` | — |
| popper-class | 下拉与标签提示框的自定义类名 | ^[string] | '' |
| popper-style | 下拉与标签提示框的自定义样式 | ^[string] / ^[object] | — |
| teleported | 下拉是否挂载到 body | ^[boolean] | true |
| effect | 下拉主题 | ^[enum]\`'dark' \\| 'light'\` | light |
| tag-type | 标签类型 | ^[enum]\`'success' \\| 'info' \\| 'warning' \\| 'danger'\` | info |
| tag-effect | 标签主题 | ^[enum]\`'light' \\| 'dark' \\| 'plain'\` | light |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| max-collapse-tags | 折叠时最多显示的标签数（需开启 collapse-tags） | ^[number] | 1 |
| empty-values | 组件的空值配置 | ^[array] | — |
| value-on-clear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| persistent | 下拉不活跃时是否保留 DOM | ^[boolean] | true |
| fallback-placements | 下拉翻转时的兜底方位 | ^[array]\`Placement[]\` | — |
| placement | 下拉位置 | ^[enum]\`Placement\` | bottom-start |
| show-checked-strategy | 多选时标签显示的节点层级 | ^[enum]\`'parent' \\| 'child'\` | child |
| virtual-scroll | 是否开启虚拟滚动 | ^[boolean] | false |
| fit-input-width | 搜索建议面板是否与输入框等宽；数字表示固定宽度 | ^[boolean] / ^[number] | false |
| item-size | 虚拟滚动时节点高度（px） | ^[number] | 34 |
| height | 虚拟滚动时菜单高度（px） | ^[number] | 204 |
| id | 输入框 id | ^[string] | — |
| className | 根节点类名 | ^[string] | — |
| style | 根节点样式 | ^[object]\`CSSProperties\` | — |

### Cascader Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化时触发 | ^[Function]\`(value: CascaderValue) => void\` |
| onExpandChange | 展开项变化时触发 | ^[Function]\`(value: CascaderValue) => void\` |
| onFocus | 获得焦点时触发 | ^[Function]\`(event: FocusEvent) => void\` |
| onBlur | 失去焦点时触发 | ^[Function]\`(event: FocusEvent) => void\` |
| onClear | 点击清空图标时触发 | ^[Function]\`() => void\` |
| onVisibleChange | 下拉显示状态变化时触发 | ^[Function]\`(visible: boolean) => void\` |
| onRemoveTag | 多选模式移除标签时触发 | ^[Function]\`(value: CascaderNodeValue \\| CascaderNodePathValue) => void\` |

### Cascader Slots（React Render Props）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderLabel | 自定义节点内容，对应官方 default 插槽 | ^[Function]\`({ node, data }) => ReactNode\` |
| empty | 无匹配选项时的内容 | ^[ReactNode] |
| prefix | 输入框前缀内容 | ^[ReactNode] |
| renderSuggestionItem | 自定义搜索建议项，对应官方 suggestion-item 插槽 | ^[Function]\`({ item: Node }) => ReactNode\` |
| renderTag | 自定义标签样式，对应官方 tag 插槽 | ^[Function]\`({ data: Tag[], deleteTag }) => ReactNode\` |
| header | 下拉顶部内容 | ^[ReactNode] |
| footer | 下拉底部内容 | ^[ReactNode] |

### Cascader Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| getCheckedNodes | 获取当前选中的节点，leafOnly 表示是否只返回叶子节点 | ^[Function]\`(leafOnly?: boolean) => Node[]\` |
| panelRef | 级联面板实例 | ^[object]\`CascaderPanelHandle\` |
| togglePopperVisible | 切换下拉显隐 | ^[Function]\`(visible?: boolean) => void\` |
| contentRef | 下拉内容节点 | ^[object]\`HTMLDivElement\` |
| presentText | 当前显示的文本 | ^[string] |
| focus | 聚焦输入框 | ^[Function]\`() => void\` |
| blur | 输入框失焦 | ^[Function]\`() => void\` |

## CascaderPanel API

### CascaderPanel Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value | ^[string] / ^[number] / ^[array] | — |
| options | 选项数据 | ^[array]\`CascaderOption[]\` | — |
| props | 配置项，见下方 CascaderProps 表 | ^[object]\`CascaderProps\` | — |
| virtual-scroll | 是否开启虚拟滚动 | ^[boolean] | false |
| item-size | 虚拟滚动时节点高度（px） | ^[number] | 34 |
| height | 虚拟滚动时菜单高度（px） | ^[number] | 204 |

### CascaderPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化时触发 | ^[Function]\`(value: CascaderValue \\| undefined) => void\` |
| onExpandChange | 展开项变化时触发 | ^[Function]\`(value: CascaderNodePathValue) => void\` |
| onClose | 关闭面板时触发，供 Cascader 收起下拉 | ^[Function]\`() => void\` |
| onCheckedNodesChange | 选中节点快照变化时触发 | ^[Function]\`(checkedNodes: Node[], allCheckedNodes: Node[]) => void\` |

### CascaderPanel Slots（React Render Props）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| renderLabel | 自定义节点内容，对应官方 default 插槽 | ^[Function]\`({ node, data }) => ReactNode\` |
| empty | 无数据时的内容 | ^[ReactNode] |

### CascaderPanel Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| getCheckedNodes | 获取当前选中的节点，leafOnly 表示是否只返回叶子节点 | ^[Function]\`(leafOnly?: boolean) => Node[]\` |
| clearCheckedNodes | 清空选中节点 | ^[Function]\`() => void\` |

## CascaderProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expandTrigger | 展开子选项的触发方式 | ^[enum]\`'click' \\| 'hover'\` | click |
| multiple | 是否开启多选 | ^[boolean] | false |
| checkStrictly | 选中状态是否不与父子节点关联 | ^[boolean] | false |
| emitPath | 选中变化时是否返回节点路径数组；为 false 时只返回值 | ^[boolean] | true |
| lazy | 是否动态加载子节点，需配合 lazyLoad | ^[boolean] | false |
| lazyLoad | 加载子节点数据的方法，仅在 lazy 为 true 时生效 | ^[Function]\`(node: Node, resolve: Resolve, reject: () => void) => void\` | — |
| value | 指定节点对象中作为值的字段名 | ^[string] | value |
| label | 指定节点对象中作为标签的字段名 | ^[string] | label |
| children | 指定节点对象中作为子节点的字段名 | ^[string] | children |
| disabled | 指定节点对象中作为禁用状态的字段名或判断函数 | ^[string] / ^[Function] | disabled |
| leaf | 指定节点对象中作为叶子标识的字段名或判断函数 | ^[string] / ^[Function] | leaf |
| hoverThreshold | 悬停展开的阈值（毫秒） | ^[number] | 500 |
| checkOnClickNode | 点击节点时是否切换选中状态 | ^[boolean] | false |
| checkOnClickLeaf | 点击叶子节点时是否切换选中状态 | ^[boolean] | true |
| showPrefix | 是否显示单选按钮或复选框前缀 | ^[boolean] | true |

## Type Declarations

\`\`\`ts
type CascaderNodeValue = string | number
type CascaderNodePathValue = CascaderNodeValue[]
type CascaderValue =
  | CascaderNodeValue
  | CascaderNodePathValue
  | (CascaderNodeValue | CascaderNodePathValue)[]

type ExpandTrigger = 'click' | 'hover'
type Resolve = (data: CascaderOption[]) => void
type LazyLoad = (node: Node, resolve: Resolve, reject: () => void) => void
type IsDisabled = (data: CascaderOption, node: Node) => boolean
type IsLeaf = (data: CascaderOption, node: Node) => boolean

interface CascaderOption extends Record<string, unknown> {
  label?: string
  value?: CascaderNodeValue
  children?: CascaderOption[]
  disabled?: boolean
  leaf?: boolean
}

interface CascaderProps {
  expandTrigger?: ExpandTrigger
  multiple?: boolean
  checkStrictly?: boolean
  emitPath?: boolean
  lazy?: boolean
  lazyLoad?: LazyLoad
  value?: string
  label?: string
  children?: string
  disabled?: string | IsDisabled
  leaf?: string | IsLeaf
  hoverThreshold?: number
  checkOnClickNode?: boolean
  checkOnClickLeaf?: boolean
  showPrefix?: boolean
}
\`\`\`
`;

export default function CascaderPage() {
  return (
    <>
      <h1>Cascader 级联选择器</h1>
      <p>当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        为 <code>options</code> 属性传入选项数组即可渲染级联选择器。
        <code>props.expandTrigger</code> 决定子选项的展开方式：默认为点击，
        设为 <code>hover</code> 时悬停展开。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CascaderBasic />
      </DemoBlock>

      <Heading level={2}>禁用选项</Heading>
      <p>
        在选项对象中设置 <code>disabled: true</code> 即可禁用该项。默认读取
        <code>disabled</code> 字段；如需使用其他字段名，可通过
        <code>props.disabled</code> 指定。同理，<code>value</code>、
        <code>label</code>、<code>children</code> 字段名也可自定义。
      </p>
      <DemoBlock source={SOURCES.optionDisabling}>
        <CascaderOptionDisabling />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>
        设置 <code>clearable</code> 后，选中并悬停时会出现清空图标。
      </p>
      <DemoBlock source={SOURCES.clearable}>
        <CascaderClearable />
      </DemoBlock>

      <Heading level={2}>自定义清空图标</Heading>
      <p>
        通过 <code>clearIcon</code> 属性可自定义清空图标。
      </p>
      <DemoBlock source={SOURCES.clearIcon}>
        <CascaderClearIcon />
      </DemoBlock>

      <Heading level={2}>仅显示最后一级</Heading>
      <p>
        <code>showAllLevels</code> 决定输入框是否显示完整路径；
        设为 <code>false</code> 时只显示最后一级。
      </p>
      <DemoBlock source={SOURCES.lastLevel}>
        <CascaderLastLevel />
      </DemoBlock>

      <Heading level={2}>多选</Heading>
      <p>
        将 <code>props.multiple</code> 设为 <code>true</code> 即可开启多选。
        默认展示全部选中标签；<code>collapseTags</code> 可折叠标签，
        <code>maxCollapseTags</code> 控制折叠时显示的标签数（默认为 1），
        <code>collapseTagsTooltip</code> 让鼠标悬停折叠文本时展示全部标签。
      </p>
      <DemoBlock source={SOURCES.multipleSelection}>
        <CascaderMultipleSelection />
      </DemoBlock>

      <Heading level={2}>选择任意一级选项</Heading>
      <p>
        单选模式下只能选择叶子节点，多选模式下选中父节点会联动选中全部叶子节点。
        设置 <code>props.checkStrictly = true</code> 可解除父子节点选中状态的关联，
        从而选择任意一级选项。
      </p>
      <DemoBlock source={SOURCES.anyLevel}>
        <CascaderAnyLevel />
      </DemoBlock>

      <Heading level={2}>动态加载</Heading>
      <p>
        设置 <code>props.lazy = true</code> 启用动态加载，并通过
        <code>props.lazyLoad</code> 指定加载数据的方法。其参数 <code>node</code>
        为当前点击的节点，<code>resolve</code> 为加载完成的回调，必须调用。
        可以在数据中增加 <code>leaf</code> 字段更准确地标识叶子节点，
        否则将根据是否存在子节点推断。
      </p>
      <DemoBlock source={SOURCES.dynamicLoading}>
        <CascaderDynamicLoading />
      </DemoBlock>

      <Heading level={2}>可搜索</Heading>
      <p>
        添加 <code>filterable</code> 即可开启搜索。级联选择器会匹配自身或父级标签
        包含关键字的节点；也可以通过 <code>filterMethod</code> 自定义搜索逻辑，
        第一个参数为节点，第二个参数为关键字，返回是否命中。
      </p>
      <DemoBlock source={SOURCES.filterable}>
        <CascaderFilterable />
      </DemoBlock>

      <Heading level={2}>自定义节点内容</Heading>
      <p>
        通过 <code>renderLabel</code> 自定义节点内容，回调参数
        <code>node</code> 与 <code>data</code> 分别为当前节点对象与节点数据。
      </p>
      <DemoBlock source={SOURCES.customContent}>
        <CascaderCustomContent />
      </DemoBlock>

      <Heading level={2}>自定义搜索建议项</Heading>
      <p>
        通过 <code>renderSuggestionItem</code> 自定义搜索建议项，回调参数
        <code>item</code> 为当前建议项节点。
      </p>
      <DemoBlock source={SOURCES.customSuggestionItem}>
        <CascaderCustomSuggestionItem />
      </DemoBlock>

      <Heading level={2}>级联面板</Heading>
      <p>
        <code>CascaderPanel</code> 是级联选择器的核心组件，支持单选、多选、
        动态加载等能力。与 <code>ElCascader</code> 一样，通过
        <code>options</code> 传入选项，通过 <code>props</code> 开启其他特性。
      </p>
      <DemoBlock source={SOURCES.panel}>
        <CascaderPanelDemo />
      </DemoBlock>

      <Heading level={2}>自定义标签</Heading>
      <p>
        通过 <code>renderTag</code> 自定义标签内容。使用自定义标签时，
        <code>collapseTags</code>、<code>collapseTagsTooltip</code>、
        <code>maxCollapseTags</code> 不会生效。
      </p>
      <DemoBlock source={SOURCES.customTag}>
        <CascaderCustomTag />
      </DemoBlock>

      <Heading level={2}>显示选中策略</Heading>
      <p>
        多选模式下，<code>showCheckedStrategy</code> 控制选中值的展示方式。
        默认策略为 <code>child</code>，展示全部选中的子节点；<code>parent</code>
        策略仅在全部子节点选中时展示父节点。
      </p>
      <DemoBlock source={SOURCES.showCheckedStrategy}>
        <CascaderShowCheckedStrategy />
      </DemoBlock>

      <Heading level={2}>点击节点选中</Heading>
      <p>
        仅在启用 <code>multiple</code> 或 <code>checkStrictly</code> 时可用。
        通过 <code>props.checkOnClickNode</code> 可以直接点击节点切换选中状态，
        而不必点击前缀图标；<code>props.showPrefix</code> 控制前缀图标的显隐。
        另外 <code>props.checkOnClickLeaf</code> 可限定只有叶子节点可点击选中，
        该选项默认开启。
      </p>
      <DemoBlock source={SOURCES.checkOnClickNode}>
        <CascaderCheckOnClickNode />
      </DemoBlock>

      <Heading level={2}>自定义下拉头部与底部</Heading>
      <p>
        通过 <code>header</code> 与 <code>footer</code> 属性自定义下拉的顶部和底部内容。
      </p>
      <DemoBlock source={SOURCES.customHeaderFooter}>
        <CascaderCustomHeaderFooter />
      </DemoBlock>

      <Heading level={2}>虚拟滚动</Heading>
      <p>
        处理大量数据时可开启虚拟滚动以提升性能。设置
        <code>virtualScroll</code> 为 <code>true</code> 启用；可通过
        <code>height</code> 与 <code>itemSize</code> 自定义菜单高度与节点高度，
        默认分别为 204px 与 34px。
      </p>
      <DemoBlock source={SOURCES.virtualScroll}>
        <CascaderVirtualScroll />
      </DemoBlock>

      <Heading level={2}>自定义搜索建议宽度</Heading>
      <p>
        搜索建议面板的宽度默认根据匹配项的最大宽度计算。如果通过
        <code>renderSuggestionItem</code> 自定义了建议项内容，显示文本可能与
        <code>label</code> 不一致，导致宽度计算偏差。此时可使用
        <code>fitInputWidth</code> 固定宽度：设为 <code>true</code>
        时与输入框等宽，设为数字时使用固定的像素宽度。
      </p>
      <p>
        该属性只影响搜索时的建议面板宽度，不影响默认的级联面板。
      </p>
      <DemoBlock source={SOURCES.fitInputWidth}>
        <CascaderFitInputWidth />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
