import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TreeAccordion,
  TreeBasic,
  TreeChecking,
  TreeCustomLeaf,
  TreeCustomNodeClass,
  TreeCustomizedNode,
  TreeDefaultState,
  TreeDisabled,
  TreeDraggable,
  TreeFiltering,
  TreeMultipleTimesLoad,
  TreeSelectable,
} from "@/components/element-plus/examples/tree";

export const metadata: Metadata = { title: "Tree 树形控件" };

const SOURCES = {
  basic: `const data = [
  {
    label: "Level one 1",
    children: [
      { label: "Level two 1-1", children: [{ label: "Level three 1-1-1" }] },
    ],
  },
  // ...
];
const defaultProps = { children: "children", label: "label" };

<ElTree
  style={{ maxWidth: "600px" }}
  data={data}
  props={defaultProps}
  onNodeClick={(data) => console.log(data)}
/>`,

  selectable: `const props = { label: "name", children: "zones" };

<ElTree
  style={{ maxWidth: "600px" }}
  props={props}
  lazy
  showCheckbox
  onCheckChange={(data, checked, indeterminate) => console.log(data, checked, indeterminate)}
  load={(node, resolve) => {
    if (node.level === 0) return resolve([{ name: "Root1" }, { name: "Root2" }]);
    if (node.level > 3) return resolve([]);
    setTimeout(() => resolve([{ name: "zone1" }, { name: "zone2" }]), 500);
  }}
/>`,

  customLeaf: `const props = { label: "name", children: "zones", isLeaf: "leaf" };

<ElTree
  style={{ maxWidth: "600px" }}
  props={props}
  lazy
  showCheckbox
  load={(node, resolve) => {
    if (node.level === 0) return resolve([{ name: "region" }]);
    if (node.level > 1) return resolve([]);
    setTimeout(
      () => resolve([{ name: "leaf", leaf: true }, { name: "zone" }]),
      500,
    );
  }}
/>`,

  multipleTimesLoad: `const props = { label: "name", children: "zones", isLeaf: "leaf" };

<ElTree
  style={{ maxWidth: "600px" }}
  props={props}
  lazy
  load={(node, resolve, reject) => {
    if (node.level === 0) return resolve([{ name: "region" }]);
    setTimeout(() => {
      if (loadTime > 3) {
        return resolve([
          { name: "zone1", leaf: true },
          { name: "zone2", leaf: true },
          { name: "zone3", leaf: true },
        ]);
      }
      return reject();
    }, 3000);
  }}
/>`,

  disabled: `const data = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 3,
        label: "Level two 2-1",
        children: [
          { id: 4, label: "Level three 3-1-1" },
          { id: 5, label: "Level three 3-1-2", disabled: true },
        ],
      },
      // ...
    ],
  },
];

<ElTree
  style={{ maxWidth: "600px" }}
  data={data}
  props={{ children: "children", label: "label", disabled: "disabled" }}
  showCheckbox
/>`,

  defaultState: `<ElTree
  style={{ maxWidth: "600px" }}
  data={data}
  showCheckbox
  nodeKey="id"
  defaultExpandedKeys={[2, 3]}
  defaultCheckedKeys={[5]}
  props={{ children: "children", label: "label" }}
/>`,

  checkingTree: `const [tree, setTree] = useState<TreeInstance | null>(null);

<ElTree
  onReady={setTree}
  style={{ maxWidth: "600px" }}
  data={data}
  showCheckbox
  defaultExpandAll
  nodeKey="id"
  highlightCurrent
  props={{ children: "children", label: "label" }}
/>
<ElButton onClick={() => console.log(tree?.getCheckedNodes(false, false))}>get by node</ElButton>
<ElButton onClick={() => console.log(tree?.getCheckedKeys(false))}>get by key</ElButton>
<ElButton onClick={() => tree?.setCheckedNodes([{ id: 5 }, { id: 9 }], false)}>set by node</ElButton>
<ElButton onClick={() => tree?.setCheckedKeys([3], false)}>set by key</ElButton>
<ElButton onClick={() => tree?.setCheckedKeys([], false)}>reset</ElButton>`,

  customizedNode: `const [renderTree, setRenderTree] = useState<TreeInstance | null>(null);

const renderContent = ({ node, data }: RenderContentContext) => (
  <div className="custom-tree-node">
    <span>{node.label}</span>
    <div>
      <ElButton type="primary" link onClick={() => append(data)}>Append</ElButton>
      <ElButton type="danger" link onClick={() => remove(data)}>Delete</ElButton>
    </div>
  </div>
);

<ElTree
  onReady={setRenderTree}
  data={data}
  showCheckbox
  nodeKey="id"
  defaultExpandAll
  expandOnClickNode={false}
  renderContent={renderContent}
/>`,

  customNodeClass: `<ElTree
  style={{ maxWidth: "600px" }}
  data={data}
  showCheckbox
  nodeKey="id"
  defaultExpandAll
  expandOnClickNode={false}
  props={{
    class: (data) => (data.isPenultimate ? "is-penultimate" : ""),
  }}
/>`,

  filtering: `const [tree, setTree] = useState<TreeInstance | null>(null);
const [filterText, setFilterText] = useState("");

<ElInput
  value={filterText}
  onChange={(value) => {
    setFilterText(value);
    tree?.filter(value);
  }}
  placeholder="Filter keyword"
/>

<ElTree
  onReady={setTree}
  style={{ maxWidth: "600px" }}
  data={data}
  props={{ children: "children", label: "label" }}
  defaultExpandAll
  filterNodeMethod={(value, data) => {
    if (!value) return true;
    return String(data.label).includes(String(value));
  }}
/>`,

  accordion: `<ElTree
  style={{ maxWidth: "600px" }}
  data={data}
  props={{ children: "children", label: "label" }}
  accordion
  onNodeClick={(data) => console.log(data)}
/>`,

  draggable: `<ElTree
  style={{ maxWidth: "600px" }}
  data={data}
  draggable
  defaultExpandAll
  nodeKey="label"
  allowDrop={(_dragging, dropNode, type) => {
    if (dropNode.data.label === "Level two 3-1") return type !== "inner";
    return true;
  }}
  allowDrag={(draggingNode) =>
    !String(draggingNode.data.label).includes("Level three 3-1-1")
  }
  onNodeDragStart={(node) => console.log("drag start", node)}
  onNodeDrop={(_dragging, dropNode, dropType) =>
    console.log("tree drop:", dropNode.label, dropType)
  }
/>`,
};

const API_MD = `
## Tree API

### Tree Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树数据 | ^[array]\`TreeNodeData[]\` | [] |
| empty-text | 数据为空时的文本 | ^[string] | 暂无数据（取 locale） |
| node-key | 节点唯一标识字段名，全树唯一 | ^[string] | — |
| props | 节点字段配置，见下表 | ^[object]\`TreeOptionProps\` | — |
| render-after-expand | 是否首次展开后才渲染子节点 | ^[boolean] | true |
| load | 懒加载子树数据的方法 | ^[Function]\`(node, resolve, reject) => void\` | — |
| render-content | 自定义节点内容 | ^[Function]\`(context) => ReactNode\` | — |
| highlight-current | 是否高亮当前节点 | ^[boolean] | false |
| default-expand-all | 是否默认展开所有节点 | ^[boolean] | false |
| expand-on-click-node | 点击节点是否展开/收起 | ^[boolean] | true |
| check-on-click-node | 点击节点是否勾选 | ^[boolean] | false |
| check-on-click-leaf | 点击叶子节点是否勾选 | ^[boolean] | true |
| auto-expand-parent | 子节点展开时是否展开父节点 | ^[boolean] | true |
| default-expanded-keys | 初始展开的节点 key 数组 | ^[array]\`Array<string \\| number>\` | — |
| show-checkbox | 是否显示复选框 | ^[boolean] | false |
| check-strictly | 勾选是否不联动父子 | ^[boolean] | false |
| check-descendants | 勾选时是否下传子节点 | ^[boolean] | false |
| default-checked-keys | 初始勾选的节点 key 数组 | ^[array]\`Array<string \\| number>\` | — |
| current-node-key | 初始选中的节点 key | ^[string] / ^[number] | — |
| filter-node-method | 过滤方法，返回 false 的节点被隐藏 | ^[Function]\`(value, data, node) => boolean\` | — |
| accordion | 同层是否只展开一个节点 | ^[boolean] | false |
| indent | 相邻层级缩进像素 | ^[number] | 18 |
| icon | 自定义展开图标 | ^[ReactNode] | — |
| lazy | 是否懒加载 | ^[boolean] | false |
| draggable | 是否可拖拽节点 | ^[boolean] | false |
| allow-drag | 拖拽前判定，返回 false 不可拖 | ^[Function]\`(node) => boolean\` | — |
| allow-drop | 落点判定，返回 false 不可落 | ^[Function]\`(draggingNode, dropNode, type) => boolean\` | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签字段名或取值函数 | ^[string] / ^[Function]\`(data, node) => string\` | label |
| children | 子树字段名 | ^[string] | children |
| disabled | 禁用字段名或取值函数 | ^[string] / ^[Function]\`(data, node) => boolean\` | disabled |
| isLeaf | 叶子字段名或取值函数，仅 lazy 下生效 | ^[string] / ^[Function]\`(data, node) => boolean\` | — |
| class | 自定义节点类名 | ^[Function]\`(data, node) => string \\| object\` | — |

### Tree Exposes

命令式方法经 \`ref\` 或 \`onReady\` 回调下发（见下方「与 Vue 版 API 的差异」）。

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| filter | 过滤节点，被过滤的节点隐藏 | (value) 传给 filter-node-method 的第一个参数 |
| updateKeyChildren | 设置某节点的新数据，需要 node-key | (key, data) 节点 key 与新数据 |
| getCheckedNodes | 返回当前选中的节点数组 | (leafOnly, includeHalfChecked) 两个布尔参数，默认 false |
| setCheckedNodes | 设置选中某些节点，需要 node-key | (nodes, leafOnly) 节点数组或数据数组，与是否只作用于叶子 |
| getCheckedKeys | 返回当前选中节点的 key 数组 | (leafOnly) 布尔参数，默认 false |
| setCheckedKeys | 设置选中某些 key，需要 node-key | (keys, leafOnly) key 数组与是否只作用于叶子 |
| setChecked | 设置节点勾选态 | (key/data, checked, deep) |
| getHalfCheckedNodes | 返回半选节点数组 | — |
| getHalfCheckedKeys | 返回半选节点的 key 数组 | — |
| getCurrentKey | 返回高亮节点的 key | — |
| getCurrentNode | 返回高亮节点的数据 | — |
| setCurrentKey | 按 key 设置高亮节点 | (key, shouldAutoExpandParent=true) |
| setCurrentNode | 按节点设置高亮节点 | (node, shouldAutoExpandParent=true) |
| getNode | 按数据或 key 取节点 | (data) |
| getNodePath | 返回节点从根到自身的路径 | (data) |
| remove | 删除节点，需要 node-key | (data) 数据或节点 |
| append | 向指定节点追加子节点 | (data, parentNode) |
| insertBefore | 在指定节点前插入 | (data, refNode) |
| insertAfter | 在指定节点后插入 | (data, refNode) |

### Tree Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onNodeClick | 节点被点击时触发 | (data, node, event) |
| onNodeContextmenu | 节点被右键点击时触发 | (event, data, node) |
| onCheckChange | 节点选中态变化时触发 | (data, checked, indeterminate) |
| onCheck | 点击复选框后触发 | (data, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) |
| onCurrentChange | 当前节点变化时触发 | (data, node) |
| onNodeExpand | 节点展开时触发 | (data, node) |
| onNodeCollapse | 节点收起时触发 | (data, node) |
| onNodeDragStart | 开始拖拽时触发 | (node, event) |
| onNodeDragEnter | 拖拽进入某节点时触发 | (draggingNode, dropNode, event) |
| onNodeDragLeave | 拖拽离开某节点时触发 | (draggingNode, dropNode, event) |
| onNodeDragOver | 拖拽悬停某节点时触发 | (draggingNode, dropNode, event) |
| onNodeDragEnd | 拖拽结束时触发 | (draggingNode, dropNode \\| null, dropType, event) |
| onNodeDrop | 拖拽落下后触发 | (draggingNode, dropNode, dropType, event) |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 子组件 \`<el-tree-node>\` | 内部递归渲染 | 官方也只经插槽间接使用，未对外暴露 ElTreeNode 用法 |
| \`render-content\` 的 \`h\` 首参 | 无 | React 不需要渲染函数，回调直接返回 ReactNode |
| \`ref\` 取实例方法 | \`ref\`（forwardRef）或 \`onReady\` | forwardRef 是首选；\`onReady\` 是为不方便挂 ref 的场景补的等价通道 |
| default 作用域插槽 \`{ node, data }\` | \`children\` 函数 | 参数为 \`{ node, data, store }\` |
| empty 插槽 | \`emptySlot\` | 传 ReactNode |
| check / node-click 的第 4 个参数 \`nodeInstance\` | 不传 | React 无组件实例概念，事件参数为 (data, node, event) |
| \`props.class\` 返回对象 | 同样支持 | 字符串与 \`{ [k]: boolean }\` 两种形态都按官方语义拼类名 |

**实现说明**：DOM 结构、类名、元素层级逐条对齐官方模板（\`.el-tree\` / \`.el-tree-node\` /
\`.el-tree-node__content\` / \`.el-tree-node__expand-icon\` / \`.el-tree-node__children\` /
\`.el-tree__empty-block\` / \`.el-tree__drop-indicator\`），状态类
（\`is-expanded\` / \`is-current\` / \`is-checked\` / \`is-focusable\` / \`is-dragging\` /
\`is-drop-not-allow\` / \`is-drop-inner\`）与官方一一对应。模型层（Node / TreeStore）
的勾选联动、过滤、懒加载、拖拽算法逐行移植官方源码；驱动方式由 Vue reactive
改为「节点状态变更 -> store 广播 -> 组件重渲」。

**未实现的官方能力**：\`setCheckedNodes\` 传入真实 \`Node\` 实例的场景（本项目对外只承诺
数据对象形态，与官方文档表格一致）；\`ElTreeSelect\` 的 \`isSelectTree\` 短路（属于
tree-select 组件职责，本篇不涉及）。
`;

export default function TreePage() {
  return (
    <>
      <h1>Tree 树形控件</h1>
      <p>用清晰的层级结构展示信息，可展开或折叠。</p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的树形结构展示。</p>
      <DemoBlock source={SOURCES.basic}>
        <TreeBasic />
      </DemoBlock>

      <Heading level={2}>可选择</Heading>
      <p>用于节点选择，该示例同时演示节点的异步加载。</p>
      <DemoBlock source={SOURCES.selectable}>
        <TreeSelectable />
      </DemoBlock>

      <Heading level={3}>懒加载下的自定义叶子节点</Heading>
      <p>
        节点数据在点击时才拉取，树无法预知某个节点是否为叶子节点，因此每个节点都带一个下拉按钮，
        若是叶子节点则点击后下拉按钮消失。也可以提前用 <code>props.isLeaf</code> 告知，
        从而在叶子节点上不渲染下拉按钮。
      </p>
      <DemoBlock source={SOURCES.customLeaf}>
        <TreeCustomLeaf />
      </DemoBlock>

      <Heading level={3}>懒加载失败重试</Heading>
      <p>
        远程懒加载可能失败，此时调用 <code>reject</code> 保持节点原有状态，以便继续重试加载。
      </p>
      <DemoBlock source={SOURCES.multipleTimesLoad}>
        <TreeMultipleTimesLoad />
      </DemoBlock>

      <Heading level={2}>禁用复选框</Heading>
      <p>
        节点的复选框可以单独禁用：在 <code>props</code> 里声明 <code>disabled</code> 字段名，
        并把节点的该字段设为 <code>true</code>。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <TreeDisabled />
      </DemoBlock>

      <Heading level={2}>默认展开和默认选中</Heading>
      <p>
        用 <code>default-expanded-keys</code> 与 <code>default-checked-keys</code>
        设置初始展开与初始勾选的节点。二者都需要 <code>node-key</code>，
        其值为数据对象里某个全树唯一的字段名。
      </p>
      <DemoBlock source={SOURCES.defaultState}>
        <TreeDefaultState />
      </DemoBlock>

      <Heading level={2}>勾选节点</Heading>
      <p>
        <code>getCheckedNodes</code> / <code>setCheckedKeys</code> 等方法既可作用于节点，
        也可作用于 key；走 key 的写法需要 <code>node-key</code>。
      </p>
      <DemoBlock source={SOURCES.checkingTree}>
        <TreeChecking />
      </DemoBlock>

      <Heading level={2}>自定义节点内容</Heading>
      <p>
        节点的内容可以自定义，从而加入图标或按钮。提供 <code>renderContent</code>{" "}
        与作用域插槽两种写法：前者接收 <code>{"{ node, data, store }"}</code> 并返回内容，
        后者即 <code>children</code> 函数，参数相同。
      </p>
      <DemoBlock source={SOURCES.customizedNode}>
        <TreeCustomizedNode />
      </DemoBlock>

      <Heading level={2}>自定义节点类名</Heading>
      <p>
        用 <code>props.class</code> 生成节点的类名。
      </p>
      <DemoBlock source={SOURCES.customNodeClass}>
        <TreeCustomNodeClass />
      </DemoBlock>

      <Heading level={2}>树节点过滤</Heading>
      <p>
        调用 Tree 实例的 <code>filter</code> 方法过滤节点，参数即过滤关键字。
        该功能需要 <code>filter-node-method</code>，其值为过滤方法。
      </p>
      <DemoBlock source={SOURCES.filtering}>
        <TreeFiltering />
      </DemoBlock>

      <Heading level={2}>手风琴模式</Heading>
      <p>同一层级的节点中，一次只允许展开一个。</p>
      <DemoBlock source={SOURCES.accordion}>
        <TreeAccordion />
      </DemoBlock>

      <Heading level={2}>可拖拽节点</Heading>
      <p>加上 <code>draggable</code> 后即可拖拽节点改变其父子关系与顺序。</p>
      <DemoBlock source={SOURCES.draggable}>
        <TreeDraggable />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
