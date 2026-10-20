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

命令式方法经 \`ref\` 或 \`onReady\` 回调下发。

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

`;

export default function TreePage() {
  return (
    <>
      <h1>Tree 树形控件</h1>
      <p>用清晰的层级结构展示信息，可展开或折叠。</p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的树形结构展示</p>
      <DemoBlock source={SOURCES.basic}>
        <TreeBasic />
      </DemoBlock>

      <Heading level={2}>可选择</Heading>
      <p>适用于需要选择层级时使用。</p>
      <p>本例还展示了动态加载节点数据的方法。</p>
      <DemoBlock source={SOURCES.selectable}>
        <TreeSelectable />
      </DemoBlock>
      <DocsContent
        source={`:::warning

在使用 show-checkbox 时，因为 \`check-on-click-leaf\` 默认值为 true， 最后一个树节点可以通过点击节点进行勾选。

:::`}
      />

      <Heading level={2}>懒加载自定义叶子节点</Heading>
      <p>
        由于在点击节点时才进行该层数据的获取，默认情况下 Tree
        无法预知某个节点是否为叶子节点，所以会为每个节点添加一个下拉按钮，如果节点没有下层数据，则点击后下拉按钮会消失。同时，你也可以提前告知
        Tree 某个节点是否为叶子节点，从而避免在叶子节点前渲染下拉按钮。
      </p>
      <DemoBlock source={SOURCES.customLeaf}>
        <TreeCustomLeaf />
      </DemoBlock>

      <Heading level={2} id="多次懒加载">
        多次懒加载 <span className="docs-version-tag">2.6.3</span>
      </Heading>
      <p>
        加载远程节点数据时，懒加载有时可能失败。在这种情况下，您可以调用 reject
        以保持节点状态，并允许远程加载继续。
      </p>
      <DemoBlock source={SOURCES.multipleTimesLoad}>
        <TreeMultipleTimesLoad />
      </DemoBlock>

      <Heading level={2}>禁用复选框</Heading>
      <p>节点的复选框可以设置为禁用。</p>
      <p>在示例中，通过 disabled 设置禁用状态。相应的复选框已禁用，不能点击。</p>
      <DemoBlock source={SOURCES.disabled}>
        <TreeDisabled />
      </DemoBlock>

      <Heading level={2}>默认展开以及默认选中</Heading>
      <p>树节点可以在初始化阶段被设置为展开和选中。</p>
      <p>
        分别通过 <code>default-expanded-keys</code> 和{" "}
        <code>default-checked-keys</code>{" "}
        设置默认展开和默认选中的节点。需要注意的是，此时必须设置{" "}
        <code>node-key</code>，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。
      </p>
      <DemoBlock source={SOURCES.defaultState}>
        <TreeDefaultState />
      </DemoBlock>

      <Heading level={2}>树节点的选择</Heading>
      <p>
        本例展示如何获取和设置选中节点。获取和设置各有两种方式：通过 node 或通过
        key。如果需要通过 key 来获取或设置，则必须设置 <code>node-key</code>。
      </p>
      <DemoBlock source={SOURCES.checkingTree}>
        <TreeChecking />
      </DemoBlock>

      <Heading level={2}>自定义节点内容</Heading>
      <p>节点的内容支持自定义，可以在节点区添加按钮或图标等内容</p>
      <p>
        可以通过两种方法进行树节点内容的自定义：<code>render-content</code> 和 scoped
        slot。使用 <code>render-content</code>{" "}
        指定渲染函数，该函数返回需要的节点区内容即可。渲染函数的用法请参考 Vue
        文档。使用 scoped slot 会传入两个参数 <code>node</code> 和{" "}
        <code>data</code>，分别表示当前节点的 Node
        对象和当前节点的数据。注意：由于 JSFiddle 不支持 JSX 语法，所以{" "}
        <code>render-content</code>{" "}
        示例无法在那里运行。但是在实际的项目中，只要正确地配置了相关依赖，就可以正常运行。
      </p>
      <DemoBlock source={SOURCES.customizedNode}>
        <TreeCustomizedNode />
      </DemoBlock>

      <Heading level={2}>自定义节点类名</Heading>
      <p>节点的类名支持自定义。</p>
      <p>
        使用 <code>props.class</code> 来建立节点的类名。
      </p>
      <DemoBlock source={SOURCES.customNodeClass}>
        <TreeCustomNodeClass />
      </DemoBlock>

      <Heading level={2}>树节点过滤</Heading>
      <p>树节点是可以被过滤的</p>
      <p>
        调用 Tree 实例对象的 <code>filter</code>{" "}
        方法来过滤树节点。方法的参数就是过滤关键字。需要注意的是，此时需要设置{" "}
        <code>filter-node-method</code> 属性，其值为过滤函数。
      </p>
      <DemoBlock source={SOURCES.filtering}>
        <TreeFiltering />
      </DemoBlock>

      <Heading level={2}>手风琴模式</Heading>
      <p>对于同一级的节点，每次只能展开一个</p>
      <DemoBlock source={SOURCES.accordion}>
        <TreeAccordion />
      </DemoBlock>

      <Heading level={2}>可拖拽节点</Heading>
      <p>
        通过 <code>draggable</code> 属性可让节点变为可拖拽
      </p>
      <DemoBlock source={SOURCES.draggable}>
        <TreeDraggable />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
