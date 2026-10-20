import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TreeSelectBasic,
  TreeSelectCheckStrictly,
  TreeSelectMultiple,
  TreeSelectDisabled,
  TreeSelectFilterable,
  TreeSelectSlots,
  TreeSelectLazy,
  TreeSelectNodeKey,
} from "@/components/element-plus/examples/tree-select";

export const metadata: Metadata = { title: "TreeSelect 树形选择器" };

const SOURCES = {
  basic: `const [value, setValue] = useState<TreeSelectValue>();
const data = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [{ value: "1-1-1", label: "Level three 1-1-1" }],
      },
    ],
  },
  // ...
];

<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  renderAfterExpand={false}
  style={{ width: 240 }}
/>
<ElDivider />
show checkbox:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  renderAfterExpand={false}
  showCheckbox
  style={{ width: 240 }}
/>`,

  checkStrictly: `<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  checkStrictly
  renderAfterExpand={false}
  style={{ width: 240 }}
/>
show checkbox:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  checkStrictly
  showCheckbox
  renderAfterExpand={false}
  style={{ width: 240 }}
/>
show checkbox with check-on-click-node:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  checkStrictly
  showCheckbox
  checkOnClickNode
  renderAfterExpand={false}
  style={{ width: 240 }}
/>`,

  multiple: `const [value, setValue] = useState<TreeSelectValue | undefined>([]);

<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  multiple
  renderAfterExpand={false}
  style={{ width: 240 }}
/>
show checkbox:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  multiple
  showCheckbox
  renderAfterExpand={false}
  style={{ width: 240 }}
/>
show checkbox with check-strictly:
<ElTreeSelect
  value={valueStrictly}
  onChange={setValueStrictly}
  data={data}
  multiple
  showCheckbox
  checkStrictly
  checkOnClickNode
  renderAfterExpand={false}
  style={{ width: 240 }}
/>`,

  disabled: `// data 里被标记 disabled 的节点不可选中
<ElTreeSelect value={value} onChange={setValue} data={data} style={{ width: 240 }} />`,

  filterable: `<ElTreeSelect value={value} onChange={setValue} data={data} filterable style={{ width: 240 }} />
filter method:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  filterMethod={filterMethod}
  filterable
  style={{ width: 240 }}
/>
filter node method:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  filterNodeMethod={filterNodeMethod}
  filterable
  style={{ width: 240 }}
/>`,

  slots: `<ElTreeSelect value={value} onChange={setValue} data={data} style={{ width: 240 }}>
  {({ data }) => (
    <>
      {String(data.label)}
      <span style={{ color: "gray" }}>(suffix)</span>
    </>
  )}
</ElTreeSelect>
use render content:
<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  renderContent={({ data }) => (
    <span style={{ color: "#626AEF" }}>{String(data.label)}</span>
  )}
  style={{ width: 240 }}
/>`,

  lazy: `const [value, setValue] = useState<TreeSelectValue>();
const [value2, setValue2] = useState<TreeSelectValue | undefined>(5);
const cacheData = [{ value: 5, label: "lazy load node5" }];
const props = { label: "label", children: "children", isLeaf: "isLeaf" };

<ElTreeSelect value={value} onChange={setValue} lazy load={load} props={props} style={{ width: 240 }} />
show lazy load label:
<ElTreeSelect
  value={value2}
  onChange={setValue2}
  lazy
  load={load}
  props={props}
  cacheData={cacheData}
  style={{ width: 240 }}
/>`,

  nodeKey: `const [value, setValue] = useState<TreeSelectValue | undefined>([2]);

<ElTreeSelect
  value={value}
  onChange={setValue}
  data={data}
  nodeKey="id"
  showCheckbox
  multiple
  defaultExpandAll
  style={{ width: 240 }}
/>`,
};

const API_MD = `
## TreeSelect API

树形选择器组合了 \`ElTree\` 与 \`ElSelect\` 的能力，官方文档说明「原有属性未做改动，请查阅原组件文档」。
React 版沿用这一约定：树相关属性见 Tree、下拉相关属性见下表。

### TreeSelect Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中值，单选为单值、多选为数组（对应官方 v-model） | ^[string] / ^[number] / ^[array] | — |
| data | 树数据 | ^[array]\`TreeData\` | [] |
| multiple | 是否多选 | ^[boolean] | false |
| clearable | 是否可清空 | ^[boolean] | false |
| filterable | 是否可筛选 | ^[boolean] | false |
| disabled | 是否禁用整个组件（对应官方 ElSelect 的 disabled） | ^[boolean] | false |
| placeholder | 占位文本 | ^[string] | 请选择 |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| value-key | 取值的字段名，对应官方 value-key | ^[string] | — |
| cache-data | 懒加载节点的缓存数据，结构同 data，用于取未加载节点的 label | ^[array]\`CacheOption[]\` | [] |
| filter-method | 自定义筛选方法，由调用方重建 data | ^[Function]\`(keyword: string) => void\` | — |
| filter-node-method | 自定义节点筛选方法 | ^[Function]\`(value, data, node) => boolean\` | — |
| remote-method | 远程筛选方法 | ^[Function]\`(keyword: string) => void\` | — |
| empty-values | 空值集合，缺省取全局配置 | ^[array] | — |
| value-on-clear | 清空时返回的值，缺省取全局配置 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| popper-class | 下拉浮层的额外类名 | ^[string] | — |
| visible | 下拉是否展开，传入即为受控 | ^[boolean] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Tree 属性透传

\`TreeProps\` 上的属性原样透传给内部的 \`ElTree\`：\`nodeKey\`、\`props\`、\`render-after-expand\`、
\`show-checkbox\`、\`check-strictly\`、\`check-on-click-node\`、\`check-on-click-leaf\`、
\`expand-on-click-node\`、\`default-expand-all\`、\`default-expanded-keys\`、\`default-checked-keys\`、
\`lazy\`、\`load\`、\`accordion\`、\`indent\`、\`highlight-current\`、\`auto-expand-parent\`、
\`render-content\`、\`allow-drag\` / \`allow-drop\` / \`draggable\` 等。
官方同样把 \`node-key || value-key || 'value'\` 作为内部树的 node-key，因此只传
\`value-key\` 也能正确寻址与勾选。

### TreeSelect Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化（对应官方 v-model 的 update:modelValue） | ^[Function]\`(value: TreeSelectValue \\| undefined) => void\` |
| onClear | 点击清空图标 | — |
| onRemoveTag | 多选模式下点击标签的关闭按钮 | ^[Function]\`(value: TreeSelectSingleValue) => void\` |
| onVisibleChange | 下拉展开态变化，配合受控的 \`visible\` 使用 | ^[Function]\`(visible: boolean) => void\` |
| onFocus | 输入框聚焦 | ^[Function]\`(event: FocusEvent<HTMLInputElement>) => void\` |
| onBlur | 输入框失焦 | ^[Function]\`(event: FocusEvent<HTMLInputElement>) => void\` |
| onCheck | 勾选变化，转发自 ElTree 的 check | ^[Function]\`(data, info) => void\` |
| onNodeClick | 节点被点击，转发自 ElTree 的 node-click | ^[Function]\`(data, node, event) => void\` |
| onNodeExpand | 节点展开，转发自 ElTree 的 node-expand | ^[Function]\`(data, node, event) => void\` |
| onReady | 拿到内部 ElTree 的实例句柄（替代官方 treeRef） | ^[Function]\`(instance: TreeInstance) => void\` |

### TreeSelect Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义树节点内容（React 侧通过 \`children\` 函数 prop 传入） | \`({ node, data, store }) => ReactNode\` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| onReady 下发的实例 | 与 \`ElTree\` 的实例同构，含 \`getCheckedKeys\` / \`setCheckedKeys\` / \`filter\` / \`getNode\` 等 | \`TreeInstance\` |

`;

export default function TreeSelectPage() {
  return (
    <>
      <h1>TreeSelect 树形选择器</h1>
      <p>
        下拉菜单形式的树形选择器，组合了 <code>ElTree</code> 与{" "}
        <code>ElSelect</code> 的功能。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>用于树形结构的选择器。</p>
      <DemoBlock source={SOURCES.basic}>
        <TreeSelectBasic />
      </DemoBlock>

      <Heading level={2}>选择任意一级选项</Heading>
      <p>
        在设置 <code>checkStrictly</code> 属性之后，任意一级都可以选择；
        否则只能选择叶子节点。使用 <code>showCheckbox</code> 时，
        <code>checkOnClickNode</code> 默认为 <code>false</code>，
        即只能通过勾选选中，可以将其设置为 <code>true</code> 后点击节点选中。
        使用 <code>showCheckbox</code> 时 <code>checkOnClickLeaf</code> 默认为{" "}
        <code>true</code>，点击叶子节点即可勾选。
      </p>
      <DemoBlock source={SOURCES.checkStrictly}>
        <TreeSelectCheckStrictly />
      </DemoBlock>

      <Heading level={2}>多选</Heading>
      <p>通过点击或复选框多选。</p>
      <DemoBlock source={SOURCES.multiple}>
        <TreeSelectMultiple />
      </DemoBlock>

      <Heading level={2}>禁用选项</Heading>
      <p>
        在数据里用 <code>disabled</code> 字段禁用选项。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <TreeSelectDisabled />
      </DemoBlock>

      <Heading level={2}>可筛选</Heading>
      <p>
        利用关键字进行筛选，或使用自定义筛选方法。<code>filterMethod</code>{" "}
        可自定义对数据进行筛选的方法，<code>filterNodeMethod</code>{" "}
        可自定义对数据节点进行筛选的方法。
      </p>
      <DemoBlock source={SOURCES.filterable}>
        <TreeSelectFilterable />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>自定义树节点的内容。</p>
      <DemoBlock source={SOURCES.slots}>
        <TreeSelectSlots />
      </DemoBlock>

      <Heading level={2}>懒加载</Heading>
      <p>树节点的懒加载，适用于大数据列表。</p>
      <DemoBlock source={SOURCES.lazy}>
        <TreeSelectLazy />
      </DemoBlock>

      <Heading level={2}>使用 node-key 属性</Heading>
      <p>
        默认情况下 <code>modelValue</code> 查找的是 <code>value</code> 键。
        对于不同的数据结构，必须提供 <code>nodeKey</code> 才能正常工作。
      </p>
      <DemoBlock source={SOURCES.nodeKey}>
        <TreeSelectNodeKey />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
