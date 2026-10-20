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
      <h1>
        Tree V2 虚拟化树形控件<span className="docs-version-tag docs-version-tag--beta">beta</span>
      </h1>
      <p>不论你的数据量多大，虚拟树都能毫无压力地处理。</p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的树形结构展示</p>
      <DemoBlock source={SOURCES.basic}>
        <TreeV2Basic />
      </DemoBlock>

      <Heading level={2}>可选择的虚拟树</Heading>
      <p>适用于需要选择层级时使用。</p>
      <DemoBlock source={SOURCES.selectable}>
        <TreeV2Selectable />
      </DemoBlock>
      <DocsContent
        source={`:::warning

在使用 show-checkbox 时，因为 \`check-on-click-leaf\` 默认值为 true， 最后一个树节点可以通过点击节点进行勾选。

:::`}
      />

      <Heading level={2}>禁用复选框</Heading>
      <p>节点的复选框可以设置为禁用。</p>
      <p>
        在示例中，属性在 defaultProps 中声明了 <code>disabled</code>，一些节点被设置为{" "}
        <code>disabled：true</code>。相应的复选框已禁用，不能点击。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <TreeV2Disabled />
      </DemoBlock>

      <Heading level={2}>默认扩展和默认检查</Heading>
      <p>树节点可以在初始化阶段被设置为展开或选中。</p>
      <p>
        分别通过 <code>default-expanded-keys</code> 和{" "}
        <code>default-checked-keys</code> 设置默认展开和默认选中的节点。
      </p>
      <DemoBlock source={SOURCES.defaultState}>
        <TreeV2DefaultState />
      </DemoBlock>

      <Heading level={2}>自定义节点内容</Heading>
      <p>节点的内容支持自定义，可以在节点区添加按钮或图标等内容</p>
      <DemoBlock source={SOURCES.customNode}>
        <TreeV2CustomNode />
      </DemoBlock>

      <Heading level={2} id="自定义节点类">
        自定义节点类 <span className="docs-version-tag">2.9.0</span>
      </Heading>
      <p>节点的类名支持自定义。</p>
      <DemoBlock source={SOURCES.customNodeClass}>
        <TreeV2CustomNodeClass />
      </DemoBlock>

      <Heading level={2} id="自定义图标">
        自定义图标 <span className="docs-version-tag">2.10.3</span>
      </Heading>
      <p>
        您可以自定义不同节点状态的图标。树节点暴露了 <code>expanded</code> 属性和{" "}
        <code>isLeaf</code>{" "}
        属性，允许你根据节点的状态动态渲染不同的图标：叶子节点、展开的节点或折叠的节点。
      </p>
      <DemoBlock source={SOURCES.customIcon}>
        <TreeV2CustomIcon />
      </DemoBlock>

      <Heading level={2} id="树节点过滤">
        树节点过滤 <span className="docs-version-tag">2.9.1</span>
      </Heading>
      <p>
        <code>filter-method</code> 方法只有在版本 <code>2.9.1</code>{" "}
        之后才能接受第三个参数。树节点是可以被过滤的
      </p>
      <p>
        在需要对节点进行过滤时，调用 Tree 实例的 <code>filter</code>{" "}
        方法，参数为关键字。需要注意的是，此时需要设置 <code>filter-method</code>，值为过滤函数。
      </p>
      <DemoBlock source={SOURCES.filter}>
        <TreeV2Filter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
