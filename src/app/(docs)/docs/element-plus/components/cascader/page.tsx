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
      <p>有两种触发子菜单的方式</p>
      <p>
        只需为 Cascader 的<code>options</code>
        属性指定选项数组即可渲染出一个级联选择器。通过{" "}
        <code>props.expandTrigger</code> 属性控制子节点的展开方式
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CascaderBasic />
      </DemoBlock>

      <Heading level={2}>有禁用选项</Heading>
      <p>
        通过在数据源中设置 <code>disabled</code> 字段来声明该选项是禁用的
      </p>
      <p>
        本例中，<code>options</code>指定的数组中的第一个元素含有
        <code>disabled: true</code>键值对，因此是禁用的。在默认情况下，Cascader
        会检查数据中每一项的<code>disabled</code>字段是否为<code>true</code>
        ，如果你的数据中表示禁用含义的字段名不为<code>disabled</code>
        ，可以通过<code>props.disabled</code>属性来指定（详见下方 API
        表格）。当然，<code>value</code>、<code>label</code>和<code>children</code>
        这三个字段名也可以通过同样的方式指定。
      </p>
      <DemoBlock source={SOURCES.optionDisabling}>
        <CascaderOptionDisabling />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>
        通过 <code>clearable</code> 设置输入框可清空
      </p>
      <DemoBlock source={SOURCES.clearable}>
        <CascaderClearable />
      </DemoBlock>

      <Heading level={2} id="自定义清除图标">
        自定义清除图标 <span className="docs-version-tag">2.11.0</span>
      </Heading>
      <p>
        你可以通过<code>clear-icon</code>属性自定义清除图标
      </p>
      <DemoBlock source={SOURCES.clearIcon}>
        <CascaderClearIcon />
      </DemoBlock>

      <Heading level={2}>仅显示最后一级</Heading>
      <p>
        可以仅在输入框中显示选中项最后一级的标签，而不是选中项所在的完整路径。
      </p>
      <p>
        属性<code>show-all-levels</code>定义了是否显示完整的路径，将其赋值为{" "}
        <code>false</code> 则仅显示最后一级。
      </p>
      <DemoBlock source={SOURCES.lastLevel}>
        <CascaderLastLevel />
      </DemoBlock>

      <Heading level={2}>多选</Heading>
      <p>
        在标签中添加 <code>:props=&quot;props&quot;</code> 并设置{" "}
        <code>props = {`{ multiple: true }`}</code> 来开启多选模式。
      </p>
      <p>
        使用多选时，所有选中的标签将默认显示。您可以设置{" "}
        <code>collapse = true</code> 将选中的标签折叠。您可以设置{" "}
        <code>max-collapse-tags</code> 来显示最大tag数量，默认1。您可以使用{" "}
        <code>collapse-tags-tooltip</code>{" "}
        属性来启用鼠标悬停折叠文字以显示具体所选值的行为。
      </p>
      <DemoBlock source={SOURCES.multipleSelection}>
        <CascaderMultipleSelection />
      </DemoBlock>

      <Heading level={2}>选择任意一级选项</Heading>
      <p>
        在单选模式下，你只能选择叶子节点；而在多选模式下，勾选父节点真正选中的都是叶子节点。启用该功能后，可让父子节点取消关联，选择任意一级选项。
      </p>
      <p>
        可通过 <code>props.checkStrictly = true</code>{" "}
        来设置父子节点取消选中关联，从而达到选择任意一级选项的目的。
      </p>
      <DemoBlock source={SOURCES.anyLevel}>
        <CascaderAnyLevel />
      </DemoBlock>

      <Heading level={2}>动态加载</Heading>
      <p>当选中某一级时，动态加载该级下的选项。</p>
      <p>
        通过<code>lazy</code>开启动态加载，并通过<code>lazyload</code>
        来设置加载数据源的方法。 <code>lazyload</code>
        方法有两个参数，第一个参数<code>node</code>为当前点击的节点，第二个
        <code>resolve</code>为数据加载完成的回调(必须调用)。
        为了更准确的显示节点的状态，还可以对节点数据添加是否为叶子节点的标志位
        (默认字段为<code>leaf</code>，可通过<code>props.leaf</code>
        修改)。否则，将以有无子节点来判断其是否为叶子节点。
      </p>
      <DemoBlock source={SOURCES.dynamicLoading}>
        <CascaderDynamicLoading />
      </DemoBlock>

      <Heading level={2}>可搜索</Heading>
      <p>可以快捷地搜索选项并选择。</p>
      <p>
        通过添加<code>filterable</code>来启用过滤。 Cascader
        会匹配所有节点的标签和它们的亲节点的标签，是否包含有输入的关键字。你也可以用
        <code>filter-method</code>
        自定义搜索逻辑，接受一个函数，第一个参数是节点<code>node</code>
        ，第二个参数是搜索关键词<code>keyword</code>，通过返回布尔值表示是否命中。
      </p>
      <DemoBlock source={SOURCES.filterable}>
        <CascaderFilterable />
      </DemoBlock>

      <Heading level={2}>自定义节点内容</Heading>
      <p>可以自定义备选项的节点内容</p>
      <p>
        你可以通过 <code>scoped slot</code> 自定义节点的内容。您可以访问 scope 中的{" "}
        <code>node</code> 和 <code>data</code>{" "}
        属性，分别表示当前节点的 Node 对象和当前节点的数据。
      </p>
      <DemoBlock source={SOURCES.customContent}>
        <CascaderCustomContent />
      </DemoBlock>

      <Heading level={2} id="自定义建议项">
        自定义建议项 <span className="docs-version-tag">2.9.5</span>
      </Heading>
      <p>
        你可以通过 <code>suggestion-item</code>{" "}
        插槽自定义建议项。你可以在作用域中访问 <code>item</code>，它代表建议项。
      </p>
      <DemoBlock source={SOURCES.customSuggestionItem}>
        <CascaderCustomSuggestionItem />
      </DemoBlock>

      <Heading level={2}>级联面板</Heading>
      <p>
        级联面板是级联选择器的核心组件，与级联选择器一样，有单选、多选、动态加载等多种功能。
      </p>
      <p>
        和级联选择器一样，通过 <code>options</code> 来指定选项，也可通过{" "}
        <code>props</code> 来设置多选、动态加载等功能，具体详情见下方API表格。
      </p>
      <DemoBlock source={SOURCES.panel}>
        <CascaderPanelDemo />
      </DemoBlock>

      <Heading level={2} id="自定义标签">
        自定义标签 <span className="docs-version-tag">2.10.3</span>
      </Heading>
      <p>您可以自定义标签。</p>
      <p>
        将自定义的标签插入 <code>el-cascader</code> 的 slot 中即可。{" "}
        <code>collapse-tags</code>, <code>collapse-tags-tooltip</code>,{" "}
        <code>max-collapse-tags</code> 在此模式下不生效.
      </p>
      <DemoBlock source={SOURCES.customTag}>
        <CascaderCustomTag />
      </DemoBlock>

      <Heading level={2} id="已勾选项显示策略">
        已勾选项显示策略 <span className="docs-version-tag">2.10.5</span>
      </Heading>
      <p>控制在多选模式下已选值的显示方式。</p>
      <p>
        在多选模式下，你可以使用 <code>show-checked-strategy</code>{" "}
        来控制已选值的显示方式。默认策略为 <code>child</code>
        ，即显示所有已选中的子节点。 <code>parent</code>{" "}
        策略仅在其所有子节点都被选中时显示父节点。
      </p>
      <DemoBlock source={SOURCES.showCheckedStrategy}>
        <CascaderShowCheckedStrategy />
      </DemoBlock>

      <Heading level={2} id="点击选中节点">
        点击选中节点 <span className="docs-version-tag">2.10.5</span>
      </Heading>
      <p>
        只使用 <code>multiple</code> 或 <code>checkStrictly</code> 属性。
      </p>
      <p>
        你可以添加 <code>checkOnClickNode</code>
        ，使节点本身也能被点击（不仅限于前缀图标）。 通过 <code>showPrefix</code>{" "}
        来切换前缀的显示与隐藏。
      </p>
      <DocsContent
        source={`:::tip

添加 \`checkOnClickLeaf\` 属性可以仅勾选叶子节点（最末级子节点），该功能默认启用。

:::`}
      />
      <DemoBlock source={SOURCES.checkOnClickNode}>
        <CascaderCheckOnClickNode />
      </DemoBlock>

      <Heading level={2} id="自定义头部与底部">
        自定义头部与底部 <span className="docs-version-tag">2.10.5</span>
      </Heading>
      <p>你可以通过插槽来自定义下拉菜单的头部和底部。</p>
      <p>使用插槽自定义内容。</p>
      <DemoBlock source={SOURCES.customHeaderFooter}>
        <CascaderCustomHeaderFooter />
      </DemoBlock>

      <Heading level={2} id="虚拟滚动">
        虚拟滚动 <span className="docs-version-tag">2.14.0</span>
      </Heading>
      <p>当处理大量数据时，您可以启用虚拟滚动以提高性能。</p>
      <p>
        将 <code>virtual-scroll</code> 设置为 <code>true</code> 以启用虚拟滚动。
        您还可以使用 <code>height</code> 自定义菜单高度，并使用{" "}
        <code>item-size</code> 自定义节点高度。 默认高度为 204px，默认节点大小为
        34px。
      </p>
      <DemoBlock source={SOURCES.virtualScroll}>
        <CascaderVirtualScroll />
      </DemoBlock>

      <Heading level={2} id="自定义建议面板宽度">
        自定义建议面板宽度 <span className="docs-version-tag">2.14.0</span>
      </Heading>
      <p>
        建议面板（筛选时）的宽度默认会根据匹配到的选项中的最大宽度自动计算。
        如果您通过 <code>suggestion-item</code>{" "}
        插槽自定义建议选项，选项中显示的文本很可能不等于 <code>label</code>{" "}
        的值，从而导致计算错误。 在这种情况下，您可以使用{" "}
        <code>fit-input-width</code> 属性来固定其宽度。 当值为 <code>number</code>{" "}
        时，宽度为固定的具体像素值。
      </p>
      <DocsContent
        source={`:::tip

\`fit-input-width\` 属性仅控制搜索时建议面板的宽度，不影响默认的级联面板。

:::`}
      />
      <DemoBlock source={SOURCES.fitInputWidth}>
        <CascaderFitInputWidth />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
