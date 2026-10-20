import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TreeV2Basic,
  TreeV2CustomIcon,
  TreeV2CustomNode,
  TreeV2CustomNodeClass,
  TreeV2DefaultState,
  TreeV2Disabled,
  TreeV2Filter,
  TreeV2Selectable,
} from "@/components/element-plus/examples/tree-v2";

export const metadata: Metadata = {
  title: "Tree V2 虚拟化树形控件",
};

const SOURCES = {
  basic: `const data = createData(4, 30, 40);
const props = { value: "id", label: "label", children: "children" };

<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  height={200}
/>`,

  selectable: `<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  showCheckbox
  height={200}
/>`,

  disabled: `const props = {
  value: "id",
  label: "label",
  children: "children",
  disabled: "disabled",
};

<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  showCheckbox
  height={200}
/>`,

  defaultState: `<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  showCheckbox
  defaultCheckedKeys={defaultCheckedKeys}
  defaultExpandedKeys={defaultExpandedKeys}
  height={200}
/>`,

  customNode: `<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  height={200}
>
  {({ node }) => (
    <>
      <ElIcon className="el-icon--left">
        {node.isLeaf ? <Document /> : node.expanded ? <FolderOpened /> : <Folder />}
      </ElIcon>
      <span className="prefix">[ElementPlus]</span>
      <span>{node.label}</span>
    </>
  )}
</ElTreeV2>`,

  customNodeClass: `const customNodeClass = (data: TreeNodeData) =>
  data.isPenultimate ? "is-penultimate" : "";

<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  showCheckbox
  expandOnClickNode={false}
  props={{ class: customNodeClass }}
/>`,

  customIcon: `<ElTreeV2
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  height={200}
>
  {({ node }) => (
    <>
      <ElIcon className={["node-icon", node.isLeaf && "is-leaf"].filter(Boolean).join(" ")}>
        {node.isLeaf ? <Document /> : node.expanded ? <FolderOpened /> : <Folder />}
      </ElIcon>
      <span>{node.label}</span>
    </>
  )}
</ElTreeV2>`,

  filter: `const treeRef = useRef<TreeV2Expose>(null);
const [query, setQuery] = useState("");

<ElInput
  value={query}
  placeholder="Please enter keyword"
  onChange={(value) => {
    setQuery(value);
    treeRef.current?.filter(value);
  }}
/>
<ElTreeV2
  ref={treeRef}
  style={{ maxWidth: "600px" }}
  data={data}
  props={props}
  filterMethod={(value, data) => String(data.label).includes(value)}
  height={200}
/>`,
};

const API_MD = `
## TreeV2 API

### TreeV2 Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | ^[array]\`TreeNodeData[]\` | — |
| empty-text | 数据为空时的文本 | ^[string] | 取 locale 的 el.tree.emptyText |
| props | 节点字段配置，见下表 | ^[object]\`TreeOptionProps\` | — |
| highlight-current | 是否高亮当前节点 | ^[boolean] | false |
| expand-on-click-node | 点击节点是否展开/收起；为 false 时只能点箭头 | ^[boolean] | true |
| check-on-click-node | 点击节点是否勾选；为 false 时只能点复选框 | ^[boolean] | false |
| check-on-click-leaf | 点击叶子节点是否勾选 | ^[boolean] | true |
| default-expanded-keys | 初始展开节点的 key 数组 | ^[array]\`Array<string \\| number>\` | — |
| show-checkbox | 是否显示复选框 | ^[boolean] | false |
| check-strictly | 勾选是否不联动父子节点 | ^[boolean] | false |
| default-checked-keys | 初始勾选节点的 key 数组 | ^[array]\`Array<string \\| number>\` | — |
| current-node-key | 初始选中节点的 key | ^[string] / ^[number] | — |
| filter-method | 过滤方法，返回 false 的节点被隐藏 | ^[Function]\`(query, data, node) => boolean\` | — |
| indent | 相邻层级缩进像素 | ^[number] | 16 |
| icon | 自定义展开图标 | ^[ReactNode] / ^[Component] | — |
| item-size | 节点高度 | ^[number] | 26 |
| scrollbar-always-on | 是否始终显示滚动条 | ^[boolean] | false |
| height | 树的高度 | ^[number] | 200 |
| accordion | 同层是否只展开一个节点 | ^[boolean] | false |
| perf-mode | 性能模式，缓存样式提升滚动流畅度 | ^[boolean] | true |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 节点唯一标识字段名，全树唯一 | ^[string] | id |
| label | 节点标签字段名 | ^[string] | label |
| children | 子树字段名 | ^[string] | children |
| disabled | 复选框禁用字段名 | ^[string] | disabled |
| class | 自定义节点类名 | ^[string] / ^[Function]\`(data, node) => string \\| object\` | — |

### TreeV2 Exposes

命令式方法通过 \`ref\` 获取。

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| filter | 过滤所有节点，被过滤的节点隐藏 | (query) |
| getCheckedNodes | 返回当前选中节点数组 | (leafOnly) |
| getCheckedKeys | 返回当前选中节点的 key 数组 | (leafOnly) |
| setCheckedKeys | 设置选中某些 key | (keys) |
| setChecked | 设置单个节点勾选态，deep 表示是否递归子节点 | (key, checked, deep) |
| setExpandedKeys | 设置展开节点 | (keys) |
| getHalfCheckedNodes | 返回半选节点数组 | — |
| getHalfCheckedKeys | 返回半选节点的 key 数组 | — |
| getCurrentKey | 返回高亮节点的 key，无高亮时为 undefined | — |
| getCurrentNode | 返回高亮节点的数据，无高亮时为 undefined | — |
| setCurrentKey | 按 key 设置高亮节点 | (key) |
| getNode | 按 key 或数据取节点 | (data) |
| expandNode | 展开指定节点 | (node) |
| collapseNode | 收起指定节点 | (node) |
| setData | 直接替换数据，绕开响应式更新的性能开销 | (data) |
| scrollTo | 滚动到指定偏移 | (offset) |
| scrollToNode | 滚动到指定 key，可指定策略 | (key, strategy) |
| toggleCheckbox | 切换节点勾选态 | (node, checked, nodeClick, immediateUpdate, deep) |

### TreeV2 Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onNodeClick | 节点被点击时触发 | (data, node, event) |
| onNodeDrop | 拖拽落到节点上时触发 | (data, node, event) |
| onNodeContextmenu | 节点被右键点击时触发 | (event, data, node) |
| onCheckChange | 节点选中态变化时触发 | (data, checked) |
| onCheck | 点击复选框后触发 | (data, { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }) |
| onCurrentChange | 当前节点变化时触发 | (data, node) |
| onNodeExpand | 节点展开时触发 | (data, node) |
| onNodeCollapse | 节点收起时触发 | (data, node) |

### TreeV2 Slots

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| default | 自定义节点内容，对应 \`children\` 函数 | \`{ node, data }\` |
| empty | 数据为空时的内容，对应 \`empty\` 属性 | — |

`;

export default function TreeV2Page() {
  return (
    <>
      <h1>Tree V2 虚拟化树形控件</h1>
      <p>面向大数据量的虚拟滚动树形控件。</p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的树形结构展示。</p>
      <DemoBlock source={SOURCES.basic}>
        <TreeV2Basic />
      </DemoBlock>

      <Heading level={2}>可选择</Heading>
      <p>用于节点选择。</p>
      <DemoBlock source={SOURCES.selectable}>
        <TreeV2Selectable />
      </DemoBlock>

      <Heading level={2}>禁用复选框</Heading>
      <p>
        节点的复选框可以单独禁用：在 <code>props</code> 里声明{" "}
        <code>disabled</code> 字段名，并把节点的该字段设为 <code>true</code>。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <TreeV2Disabled />
      </DemoBlock>

      <Heading level={2}>默认展开和默认选中</Heading>
      <p>
        用 <code>default-expanded-keys</code> 与{" "}
        <code>default-checked-keys</code> 设置初始展开与初始勾选的节点。
      </p>
      <DemoBlock source={SOURCES.defaultState}>
        <TreeV2DefaultState />
      </DemoBlock>

      <Heading level={2}>自定义节点内容</Heading>
      <p>节点内容可以自定义，从而加入图标或按钮。</p>
      <DemoBlock source={SOURCES.customNode}>
        <TreeV2CustomNode />
      </DemoBlock>

      <Heading level={2}>自定义节点类名</Heading>
      <p>
        用 <code>props.class</code> 生成节点类名。
      </p>
      <DemoBlock source={SOURCES.customNodeClass}>
        <TreeV2CustomNodeClass />
      </DemoBlock>

      <Heading level={2}>自定义节点图标</Heading>
      <p>
        节点暴露 <code>expanded</code> 与 <code>isLeaf</code> 属性，可据此渲染不同的图标。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <TreeV2CustomIcon />
      </DemoBlock>

      <Heading level={2}>树节点过滤</Heading>
      <p>
        调用实例的 <code>filter</code> 方法过滤节点，参数即过滤关键字。
        该功能需要 <code>filter-method</code>。
      </p>
      <DemoBlock source={SOURCES.filter}>
        <TreeV2Filter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
