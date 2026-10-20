import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TableBasic,
  TableBorder,
  TableCheckStrictly,
  TableCustomColumn,
  TableCustomHeader,
  TableCustomIndex,
  TableExpandable,
  TableFilter,
  TableFixedColumn,
  TableFixedColumnAndHeader,
  TableFixedGroupHeader,
  TableFixedHeader,
  TableFixedHeaderFluid,
  TableGroupHeader,
  TableLayout,
  TableMultiSelect,
  TableOverflowTooltip,
  TableSingleSelect,
  TableSort,
  TableSpan,
  TableStriped,
  TableSummary,
  TableTooltipFormatter,
  TableTreeAndLazy,
  TableWithStatus,
} from "@/components/element-plus/examples/table";

export const metadata: Metadata = { title: "Table 表格" };

const DATA_SNIPPET = `const tableData = [
  { date: "2016-05-03", name: "Tom", address: "No. 189, Grove St, Los Angeles" },
  { date: "2016-05-02", name: "Tom", address: "No. 189, Grove St, Los Angeles" },
];`;

const SOURCES = {
  basic: `${DATA_SNIPPET}

<ElTable data={tableData} style={{ width: "100%" }}>
  <ElTableColumn prop="date" label="Date" width="180" />
  <ElTableColumn prop="name" label="Name" width="180" />
  <ElTableColumn prop="address" label="Address" />
</ElTable>`,

  striped: `<ElTable data={tableData} stripe style={{ width: "100%" }}>...</ElTable>`,

  border: `<ElTable data={tableData} border style={{ width: "100%" }}>...</ElTable>`,

  fixedHeader: `<ElTable data={tableData} height="250" style={{ width: "100%" }}>...</ElTable>`,

  fixedColumn: `<ElTable data={tableData} style={{ width: "100%" }}>
  <ElTableColumn fixed prop="date" label="Date" width="150" />
  <ElTableColumn prop="name" label="Name" width="120" />
  <ElTableColumn prop="address" label="Address" width="600" />
  <ElTableColumn fixed="right" label="Operations" minWidth="120">
    {() => <ElButton link type="primary" size="small">Detail</ElButton>}
  </ElTableColumn>
</ElTable>`,

  groupHeader: `<ElTable data={tableData} style={{ width: "100%" }}>
  <ElTableColumn prop="date" label="Date" width="150" />
  <ElTableColumn label="Delivery Info">
    <ElTableColumn prop="name" label="Name" width="120" />
    <ElTableColumn label="Address Info">
      <ElTableColumn prop="state" label="State" width="120" />
      <ElTableColumn prop="address" label="Address" />
    </ElTableColumn>
  </ElTableColumn>
</ElTable>`,

  sort: `<ElTable
  data={tableData}
  defaultSort={{ prop: "date", order: "descending" }}
  onSortChange={(data) => setOrder(data.order)}
>
  <ElTableColumn prop="date" label="Date" sortable width="180" />
  <ElTableColumn prop="name" label="Name" width="180" />
</ElTable>`,

  singleSelect: `<ElTable
  ref={tableRef}
  data={tableData}
  highlightCurrentRow
  onCurrentChange={(row) => setCurrent(row)}
>
  <ElTableColumn type="index" width="50" />
  <ElTableColumn prop="date" label="Date" width="120" />
</ElTable>

<ElButton onClick={() => tableRef.current?.setCurrentRow(tableData[1])}>
  Select second row
</ElButton>`,

  multiSelect: `const selectable = (row) => ![1, 2].includes(row.id);

<ElTable
  ref={tableRef}
  data={tableData}
  rowKey="id"
  onSelectionChange={(rows) => setSelected(rows)}
>
  <ElTableColumn type="selection" selectable={selectable} width="55" />
  <ElTableColumn prop="date" label="Date" width="120" />
</ElTable>

<ElButton onClick={() => tableRef.current?.toggleAllSelection()}>全选切换</ElButton>`,

  expandable: `<ElTable
  data={tableData}
  renderExpanded={({ row }) => (
    <div style={{ padding: 12 }}>
      <p>State: {row.state}</p>
      <p>City: {row.city}</p>
    </div>
  )}
>
  <ElTableColumn type="expand" />
  <ElTableColumn prop="date" label="Date" />
</ElTable>`,

  customColumn: `<ElTable data={tableData} style={{ width: "100%" }}>
  <ElTableColumn label="Date" width="180">
    {({ row }) => <span>{row.date}</span>}
  </ElTableColumn>
  <ElTableColumn label="Operations">
    {({ row }) => <ElButton size="small">Edit</ElButton>}
  </ElTableColumn>
</ElTable>`,

  summary: `<ElTable data={tableData} border showSummary summaryMethod={getSummaries}>
  <ElTableColumn prop="id" label="ID" width="180" />
  <ElTableColumn prop="name" label="Name" />
  <ElTableColumn prop="amount1" label="Cost 1 ($)" />
</ElTable>`,

  withStatus: `<ElTable
  data={tableData}
  rowStyle={({ rowIndex }) =>
    rowIndex === 1
      ? { "--el-table-tr-bg-color": "var(--el-color-warning-light-9)" }
      : rowIndex === 3
        ? { "--el-table-tr-bg-color": "var(--el-color-success-light-9)" }
        : {}
  }
>
  <ElTableColumn prop="date" label="Date" width="180" />
</ElTable>`,

  overflowTooltip: `<ElTable data={tableData} style={{ width: "100%" }}>
  <ElTableColumn type="selection" width="55" />
  <ElTableColumn prop="address" label="use show-overflow-tooltip" width="240" showOverflowTooltip />
  <ElTableColumn prop="address" label="address" />
</ElTable>`,

  fixedColumnAndHeader: `<ElTable data={tableData} height="250" style={{ width: "100%" }}>
  <ElTableColumn fixed prop="date" label="Date" width="150" />
  <ElTableColumn prop="address" label="Address" width="600" />
</ElTable>`,

  fixedHeaderFluid: `<ElTable :data="rows" maxHeight="250" style={{ width: "100%" }}>
  <ElTableColumn fixed prop="date" label="Date" width="150" />
  <ElTableColumn fixed="right" label="Operations" minWidth="120">
    {({ $index }) => <ElButton link type="primary" onClick={() => removeRow($index)}>Remove</ElButton>}
  </ElTableColumn>
</ElTable>`,

  fixedGroupHeader: `<ElTable data={tableData} height="250" style={{ width: "100%" }}>
  <ElTableColumn prop="date" label="Date" />
  <ElTableColumn label="Address Info" fixed="right">
    <ElTableColumn prop="state" label="State" />
    <ElTableColumn prop="city" label="City" />
    <ElTableColumn prop="address" label="Address" minWidth="200" />
  </ElTableColumn>
</ElTable>`,

  filter: `<ElTable ref={tableRef} rowKey="date" data={tableData}>
  <ElTableColumn
    prop="date"
    label="Date"
    columnKey="date"
    filters={filters}
    filterMethod={(value, row) => row.date === value}
  />
  <ElTableColumn prop="tag" label="Tag" filters={tagFilters} filterPlacement="bottom-end" />
</ElTable>

<ElButton onClick={() => tableRef.current?.clearFilter(["date"])}>reset date filter</ElButton>`,

  customHeader: `<ElTable data={filteredData}>
  <ElTableColumn label="Date" prop="date" />
  <ElTableColumn
    align="right"
    renderHeader={() => <ElInput value={search} size="small" onChange={setSearch} />}
  >
    {({ $index, row }) => (
      <ElButton size="small" onClick={() => handleEdit($index, row)}>Edit</ElButton>
    )}
  </ElTableColumn>
</ElTable>`,

  treeAndLazy: `<ElTable data={treeData} rowKey="id" border defaultExpandAll>
  <ElTableColumn prop="date" label="Date" sortable />
  <ElTableColumn prop="name" label="Name" />
</ElTable>

<ElTable
  data={lazyData}
  rowKey="id"
  border
  lazy
  load={load}
  treeProps={{ children: "children", hasChildren: "hasChildren" }}
>
  <ElTableColumn prop="date" label="Date" />
</ElTable>`,

  checkStrictly: `const [checkStrictly, setCheckStrictly] = useState(false);

<ElRadioGroup type="button" value={checkStrictly} onChange={setCheckStrictly}>
  <ElRadio value={true}>true</ElRadio>
  <ElRadio value={false}>false</ElRadio>
</ElRadioGroup>

<ElTable data={treeData} rowKey="id" defaultExpandAll treeProps={{ checkStrictly }}>
  <ElTableColumn type="selection" width="55" selectable={(row) => ![1, 31].includes(row.id)} />
  <ElTableColumn prop="date" label="Date" />
</ElTable>`,

  span: `const arraySpanMethod = ({ rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) return [1, 2];
    if (columnIndex === 1) return [0, 0];
  }
};

<ElTable data={tableData} border spanMethod={arraySpanMethod}>
  <ElTableColumn prop="id" label="ID" width="180" />
  <ElTableColumn prop="name" label="Name" />
</ElTable>`,

  customIndex: `<ElTable data={tableData}>
  <ElTableColumn type="index" index={(index) => index * 2} />
  <ElTableColumn prop="date" label="Date" width="180" />
</ElTable>`,

  tableLayout: `const [tableLayout, setTableLayout] = useState("fixed");

<ElRadioGroup type="button" value={tableLayout} onChange={setTableLayout}>
  <ElRadio value="fixed">fixed</ElRadio>
  <ElRadio value="auto">auto</ElRadio>
</ElRadioGroup>

<ElTable data={tableData} tableLayout={tableLayout}>
  <ElTableColumn prop="date" label="Date" />
  <ElTableColumn prop="name" label="Name" />
</ElTable>`,

  tooltipFormatter: `<ElTable
  data={data}
  showOverflowTooltip
  tooltipFormatter={({ cellValue }) => \`\${cellValue}: table formatter\`}
>
  <ElTableColumn
    prop="tags"
    label="formatter object"
    tooltipFormatter={({ row }) => row.tags.join(", ")}
  />
  <ElTableColumn
    prop="url"
    label="with vnode"
    tooltipFormatter={({ cellValue }) => <ElLink href={cellValue}>{cellValue}</ElLink>}
  />
</ElTable>`,
};

const API_MD = `
## Table API

### Table Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表格数据 | ^[array]\`T[]\` | [] |
| size | 表格尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| height | 表格高度，传入后表头固定 | ^[string] / ^[number] | — |
| max-height | 表格最大高度 | ^[string] / ^[number] | — |
| fit | 列宽是否自动撑满容器 | ^[boolean] | true |
| stripe | 是否显示斑马纹 | ^[boolean] | false |
| border | 是否显示纵向边框 | ^[boolean] | false |
| row-key | 行数据的 Key，树形数据与保留选中态时必填 | ^[string] / ^[Function] | — |
| show-header | 是否显示表头 | ^[boolean] | true |
| show-summary | 是否显示合计行 | ^[boolean] | false |
| sum-text | 合计行第一列的文案 | ^[string] | 合计 |
| summary-method | 自定义合计方法 | ^[Function]\`({ columns, data }) => ReactNode[]\` | — |
| row-class-name | 行类名 | ^[string] / ^[Function] | — |
| row-style | 行样式 | ^[object] / ^[Function] | — |
| cell-class-name | 单元格类名 | ^[string] / ^[Function] | — |
| cell-style | 单元格样式 | ^[object] / ^[Function] | — |
| header-row-class-name | 表头行类名 | ^[string] / ^[Function] | — |
| header-row-style | 表头行样式 | ^[object] / ^[Function] | — |
| header-cell-class-name | 表头单元格类名 | ^[string] / ^[Function] | — |
| header-cell-style | 表头单元格样式 | ^[object] / ^[Function] | — |
| highlight-current-row | 是否高亮当前行 | ^[boolean] | false |
| empty-text | 空数据文案 | ^[string] | 暂无数据 |
| empty | 自定义空状态内容 | ^[ReactNode] | — |
| append | 表格尾部追加内容 | ^[ReactNode] | — |
| default-sort | 默认排序 | ^[object]\`{ prop, order }\` | — |
| span-method | 合并行或列的方法 | ^[Function] | — |
| table-layout | 表格布局方式 | ^[enum]\`'fixed' \\| 'auto'\` | fixed |
| scrollbar-always-on | 是否总是显示滚动条 | ^[boolean] | false |
| show-overflow-tooltip | 内容过长是否显示省略号并提供提示 | ^[boolean] | false |
| tooltip-formatter | 表格级溢出提示内容格式化 | ^[Function]\`({ row, column, cellValue }) => ReactNode\` | — |
| tree-props | 树形数据字段配置 | ^[object]\`{ children?, hasChildren?, checkStrictly? }\` | — |
| lazy | 是否懒加载子节点（需 rowKey） | ^[boolean] | false |
| load | 懒加载子节点方法 | ^[Function]\`(row, treeNode, resolve) => void\` | — |
| default-expand-all | 是否默认展开所有树节点 | ^[boolean] | false |
| expand-row-keys | 默认展开的树节点 key | ^[array]\`string[]\` | — |
| indent | 树形层级缩进（px） | ^[number] | 16 |
| render-expanded | 展开行内容 | ^[Function]\`({ row, $index, expanded }) => ReactNode\` | — |
| row-expandable | 本行是否可展开 | ^[Function]\`(row, index) => boolean\` | — |

### Table Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onSelect | 用户勾选/取消某一行时触发 | ^[Function]\`(selection, row) => void\` |
| onSelectAll | 用户全选/取消全选时触发 | ^[Function]\`(selection) => void\` |
| onSelectionChange | 选中项变化时触发 | ^[Function]\`(selection) => void\` |
| onRowClick | 某一行被点击 | ^[Function]\`(row, column, event) => void\` |
| onCellClick | 某个单元格被点击 | ^[Function]\`(row, column, cell, event) => void\` |
| onSortChange | 排序变化 | ^[Function]\`({ column, prop, order }) => void\` |
| onFilterChange | 筛选条件变化 | ^[Function]\`(filters) => void\` |
| onCurrentChange | 当前行变化（单选） | ^[Function]\`(currentRow, oldCurrentRow) => void\` |
| onExpandChange | 展开行/树节点变化 | ^[Function]\`(row, expanded) => void\` |
| onHeaderClick | 表头单元格点击 | ^[Function]\`(column, event) => void\` |
| onHeaderDragend | 列宽拖拽结束 | ^[Function]\`(newWidth, oldWidth, column, event) => void\` |

### Table Exposes

| 方法名 | 说明 |
| --- | --- |
| clearSelection | 清空用户选择 |
| getSelectionRows | 返回当前选中的行 |
| toggleRowSelection | 切换某行的选中状态，参数 \`(row, selected?, ignoreSelectable?)\` |
| toggleAllSelection | 切换全选/取消全选 |
| setCurrentRow | 设置当前行 |
| toggleRowExpansion | 切换展开行或树节点的展开状态 |
| clearSort | 清空排序 |
| sort | 手动排序，参数为 prop 与 order |
| clearFilter | 清空筛选，参数 \`columnKeys?: string \\| string[]\` |
| doLayout | 重新计算表格布局 |

## Table-column API

### Table-column Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 对应列的类型 | ^[enum]\`'default' \\| 'selection' \\| 'index' \\| 'expand'\` | default |
| prop | 字段名，也可用 \`property\` | ^[string] | — |
| label | 列标题 | ^[string] | — |
| width | 列宽 | ^[string] / ^[number] | — |
| min-width | 列最小宽度 | ^[string] / ^[number] | — |
| fixed | 是否固定 | ^[boolean] / ^[enum]\`'left' \\| 'right'\` | — |
| align | 对齐方式 | ^[enum]\`'left' \\| 'center' \\| 'right'\` | — |
| header-align | 表头对齐方式 | ^[enum]\`'left' \\| 'center' \\| 'right'\` | 跟随 align |
| sortable | 是否可排序，传 \`'custom'\` 时不走内置排序 | ^[boolean] / ^[string] | false |
| sort-method | 自定义排序比较函数 | ^[Function]\`(a, b) => number\` | — |
| sort-by | 排序字段 | ^[string] / ^[array] / ^[Function] | — |
| sort-orders | 排序状态循环顺序 | ^[array] | ['ascending', 'descending', null] |
| resizable | 列宽是否可拖动 | ^[boolean] | true |
| column-key | 列标识 | ^[string] | — |
| class-name | 列类名 | ^[string] | — |
| label-class-name | 表头类名 | ^[string] | — |
| show-overflow-tooltip | 内容过长是否省略 | ^[boolean] | false |
| tooltip-formatter | 列级溢出提示内容格式化 | ^[Function]\`({ row, column, cellValue }) => ReactNode\` | — |
| formatter | 内容格式化函数 | ^[Function]\`(row, column, cellValue, index) => ReactNode\` | — |
| selectable | selection 列中该行是否可勾选 | ^[Function]\`(row, index) => boolean\` | — |
| filters | 筛选选项 | ^[array]\`{ text, value }[]\` | — |
| filter-multiple | 是否多选筛选 | ^[boolean] | true |
| filter-method | 筛选逻辑 | ^[Function]\`(value, row, column) => boolean\` | — |
| filter-placement | 筛选面板位置 | ^[string] | bottom-start |
| filter-class-name | 筛选面板类名 | ^[string] | — |
| filtered-value | 受控筛选值 | ^[array]\`string[]\` | — |
| index | index 列的自定义下标 | ^[number] / ^[Function]\`(index) => number\` | — |

### Table Slots（React 属性）

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| empty | 空状态内容 | \`empty\` 属性 |
| append | 表格尾部追加内容 | \`append\` 属性 |

### Table-column Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义单元格内容，参数 \`{ row, column, $index }\` | \`children\` 函数 |
| header | 自定义表头内容，参数 \`{ column, $index }\` | \`renderHeader\` 函数 |

`;

export default function TablePage() {
  return (
    <>
      <h1>Table 表格</h1>
      <p>用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。</p>

      <Heading level={2}>基础表格</Heading>
      <p>基础的表格展示用法。</p>
      <p>
        当 <code>el-table</code> 元素中注入 <code>data</code> 对象数组后，在{" "}
        <code>el-table-column</code> 中用 <code>prop</code>{" "}
        属性来对应对象中的键名即可填入数据，用 <code>label</code>{" "}
        属性来定义表格的列名。可以使用 <code>width</code> 属性来定义列宽。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TableBasic />
      </DemoBlock>

      <Heading level={2}>带斑马纹表格</Heading>
      <p>使用带斑马纹的表格，可以更容易区分出不同行的数据。</p>
      <p>
        <code>stripe</code> 可以创建带斑马纹的表格。如果 <code>true</code>,
        表格将会带有斑马纹。
      </p>
      <DemoBlock source={SOURCES.striped}>
        <TableStriped />
      </DemoBlock>

      <Heading level={2}>带边框表格</Heading>
      <p>
        默认情况下，Table 组件是不具有竖直方向的边框的，如果需要，可以使用{" "}
        <code>border</code> 属性，把该属性设置为 <code>true</code> 即可启用。
      </p>
      <DemoBlock source={SOURCES.border}>
        <TableBorder />
      </DemoBlock>

      <Heading level={2}>带状态表格</Heading>
      <p>
        可将表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。
      </p>
      <p>
        可以通过指定 Table 组件的 <code>row-class-name</code> 属性来为 Table
        中的某一行添加 class，这样就可以自定义每一行的样式了。
      </p>
      <DemoBlock source={SOURCES.withStatus}>
        <TableWithStatus />
      </DemoBlock>

      <Heading level={2}>显示溢出工具提示的表格</Heading>
      <p>
        当内容太长时，它会分成多行。您可以使用 <code>show-overflow-tooltip</code>{" "}
        将其保留在一行中。
      </p>
      <p>
        属性 show-overflow-tooltip 接受一个布尔值。为 <code>true</code>{" "}
        时多余的内容会在 hover 时以 tooltip 的形式显示出来。
      </p>
      <DemoBlock source={SOURCES.overflowTooltip}>
        <TableOverflowTooltip />
      </DemoBlock>

      <Heading level={2}>固定表头</Heading>
      <p>纵向内容过多时，可选择固定表头。</p>
      <p>
        只要在 <code>el-table</code> 元素中定义了 <code>height</code>{" "}
        属性，即可实现固定表头的表格，而不需要额外的代码。
      </p>
      <DemoBlock source={SOURCES.fixedHeader}>
        <TableFixedHeader />
      </DemoBlock>

      <Heading level={2}>固定列</Heading>
      <p>横向内容过多时，可选择固定列。</p>
      <p>
        固定列需要使用 <code>fixed</code> 属性，它接受 <code>Boolean</code>
        值。如果为 <code>true</code>, 列将被左侧固定.
        它还接受传入字符串，left 或 right，表示左边固定还是右边固定。
      </p>
      <DemoBlock source={SOURCES.fixedColumn}>
        <TableFixedColumn />
      </DemoBlock>

      <Heading level={2}>固定列和表头</Heading>
      <p>当您有大量数据块放入表中，您可以同时固定表头和列。</p>
      <p>固定列和表头可以同时使用，只需要将上述两个属性分别设置好即可。</p>
      <DemoBlock source={SOURCES.fixedColumnAndHeader}>
        <TableFixedColumnAndHeader />
      </DemoBlock>

      <Heading level={2}>流体高度</Heading>
      <p>当数据量动态变化时，可以为 Table 设置一个最大高度。</p>
      <p>
        通过设置 <code>max-height</code> 属性为 <code>el-table</code>{" "}
        指定最大高度。此时若表格所需的高度大于最大高度，则会显示一个滚动条。
      </p>
      <DemoBlock source={SOURCES.fixedHeaderFluid}>
        <TableFixedHeaderFluid />
      </DemoBlock>

      <Heading level={2}>多级表头</Heading>
      <p>数据结构比较复杂的时候，可使用多级表头来展现数据的层次关系。</p>
      <p>
        只需要将el-table-column 放置于el-table-column 中，你可以实现组头。
      </p>
      <DemoBlock source={SOURCES.groupHeader}>
        <TableGroupHeader />
      </DemoBlock>

      <Heading level={2} id="固定表头-1">
        固定表头
      </Heading>
      <p>支持固定群组头</p>
      <p>
        组头的属性 <code>fixed</code> 由最外层 <code>el-table-column</code>决定
      </p>
      <DemoBlock source={SOURCES.fixedGroupHeader}>
        <TableFixedGroupHeader />
      </DemoBlock>

      <Heading level={2}>单选</Heading>
      <p>选择单行数据时使用色块表示。</p>
      <p>
        Table 组件提供了单选的支持，只需要配置{" "}
        <code>highlight-current-row</code> 属性即可实现单选。之后由{" "}
        <code>current-change</code> 事件来管理选中时触发的事件，它会传入{" "}
        <code>currentRow</code>，<code>oldCurrentRow</code>。如果需要显示索引，可以增加一列{" "}
        <code>el-table-column</code>，设置 <code>type</code> 属性为{" "}
        <code>index</code> 即可显示从 1 开始的索引号。
      </p>
      <DemoBlock source={SOURCES.singleSelect}>
        <TableSingleSelect />
      </DemoBlock>

      <Heading level={2}>多选</Heading>
      <p>你也可以选择多行。</p>
      <p>
        在<span className="docs-version-tag">2.8.3</span> 之后，{" "}
        <code>toggleRowSelection</code> 支持第三个参数{" "}
        <code>ignoreSelectable</code> 以确定是否忽略可选属性。
      </p>
      <p>
        实现多选非常简单: 手动添加一个 <code>el-table-column</code>，设{" "}
        <code>type</code> 属性为 <code>selection</code> 即可；
      </p>
      <DemoBlock source={SOURCES.multiSelect}>
        <TableMultiSelect />
      </DemoBlock>

      <Heading level={2}>排序</Heading>
      <p>对表格进行排序，可快速查找或对比数据。</p>
      <p>
        在列中设置 <code>sortable</code> 属性即可实现以该列为基准的排序，接受一个{" "}
        <code>Boolean</code>，默认为 <code>false</code>。可以通过 Table 的{" "}
        <code>default-sort</code> 属性设置默认的排序列和排序顺序。可以使用{" "}
        <code>sort-method</code> 或者 <code>sort-by</code>{" "}
        使用自定义的排序规则。如果需要后端排序，需将 <code>sortable</code> 设置为{" "}
        <code>custom</code>，同时在 Table 上监听 <code>sort-change</code>{" "}
        事件，在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。在本例中，我们还使用了{" "}
        <code>formatter</code> 属性，它用于格式化指定列的值，接受一个{" "}
        <code>Function</code>，会传入两个参数：<code>row</code> 和{" "}
        <code>column</code>，可以根据自己的需求进行处理。
      </p>
      <DemoBlock source={SOURCES.sort}>
        <TableSort />
      </DemoBlock>

      <Heading level={2}>筛选</Heading>
      <p>对表格进行筛选，可快速查找到自己想看的数据。</p>
      <p>
        在列中设置 <code>filters</code> 和 <code>filter-method</code>{" "}
        属性即可开启该列的筛选， filters 是一个数组，<code>filter-method</code>{" "}
        是一个方法，它用于决定某些数据是否显示，会传入三个参数：<code>value</code>,{" "}
        <code>row</code> 和 <code>column</code>。
      </p>
      <DemoBlock source={SOURCES.filter}>
        <TableFilter />
      </DemoBlock>

      <Heading level={2}>自定义列模板</Heading>
      <p>自定义列的显示内容，可组合其他组件使用。</p>
      <p>
        通过 <code>slot</code> 可以获取到 row, column, $index 和 store（table
        内部的状态管理）的数据，用法参考 demo。
      </p>
      <DemoBlock source={SOURCES.customColumn}>
        <TableCustomColumn />
      </DemoBlock>

      <Heading level={2}>自定义表头</Heading>
      <p>表头支持自定义。</p>
      <p>
        通过设置{" "}
        <a
          href="https://v3.vuejs.org/guide/component-slots.html"
          target="_blank"
          rel="noreferrer"
        >
          slot
        </a>{" "}
        来自定义表头。
      </p>
      <DemoBlock source={SOURCES.customHeader}>
        <TableCustomHeader />
      </DemoBlock>

      <Heading level={2}>展开行</Heading>
      <p>
        当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能。
      </p>
      <p>
        在 <span className="docs-version-tag">2.9.7</span> 版本后，新增了{" "}
        <code>preserve-expanded-content</code>{" "}
        属性，用于控制折叠时是否在 DOM 中保留已展开的行内容。
      </p>
      <p>
        通过设置 type=&quot;expand&quot; 和 slot 可以开启展开行功能， el-table-column
        的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 slot 相同。
      </p>
      <DemoBlock source={SOURCES.expandable}>
        <TableExpandable />
      </DemoBlock>

      <Heading level={2}>树形数据与懒加载</Heading>
      <p>
        支持树类型的数据的显示。当 row 中包含 <code>children</code>{" "}
        字段时，被视为树形数据。渲染嵌套数据需要 prop 的 <code>row-key</code>。此外，子行数据可以异步加载。设置 Table 的<code>lazy</code>属性为 true
        与加载函数 <code>load</code> 。通过指定 row 中的<code>hasChildren</code>字段来指定哪些行是包含子节点。 <code>children</code> 与<code>hasChildren</code>都可以通过 <code>{"tree-props "}</code>配置。
      </p>
      <DemoBlock source={SOURCES.treeAndLazy}>
        <TableTreeAndLazy />
      </DemoBlock>

      <Heading level={2} id="可选择的树形数据">
        可选择的树形数据<span className="docs-version-tag">2.8.0</span>
      </Heading>
      <p>
        当 <code>treeProps.checkStrictly</code> 为 true，父节点和子节点的选择状态不再关联，
        也就是说，当选择父节点时，它的子节点将不被选择； 当{" "}
        <code>treeProps.checkStrictly</code> 是false，父节点和子节点的选择状态将与子节点的选择状态相关联，
        也就是说，当选择父节点时，将选择其所有子节点。
      </p>
      <DemoBlock source={SOURCES.checkStrictly}>
        <TableCheckStrictly />
      </DemoBlock>

      <Heading level={2}>表尾合计行</Heading>
      <p>若表格展示的是各类数字，可以在表尾显示各列的合计。</p>
      <p>
        将 <code>show-summary</code> 设置为<code>true</code>就会在表格尾部展示合计行。默认情况下，对于合计行，第一列不进行数据求合操作，而是显示「合计」二字（可通过<code>sum-text</code>配置），其余列会将本列所有数值进行求合操作，并显示出来。当然，你也可以定义自己的合计逻辑。使用{" "}
        <code>summary-method</code>{" "}
        并传入一个方法，返回一个数组，这个数组中的各项就会显示在合计行的各列中，可以是一个
        VNode 或 String，具体可以参考本例中的第二个表格。
      </p>
      <DemoBlock source={SOURCES.summary}>
        <TableSummary />
      </DemoBlock>

      <Heading level={2}>合并行或列</Heading>
      <p>多行或多列共用一个数据时，可以合并行或列。</p>
      <p>
        通过给 table 传入<code>span-method</code>方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行
        <code>{" row"}</code>、当前列 <code>{" column"}</code>、当前行号
        <code>{" rowIndex"}</code>、当前列号 <code>{" columnIndex"}</code>{" "}
        四个属性。该函数可以返回一个包含两个元素的数组，第一个元素代表{" "}
        <code>{" rowspan"}</code>，第二个元素代表 <code>{" colspan"}</code>。也可以返回一个键名为<code> rowspan</code> 和<code> colspan</code> 的对象。
      </p>
      <DemoBlock source={SOURCES.span}>
        <TableSpan />
      </DemoBlock>

      <Heading level={2}>自定义索引</Heading>
      <p>
        自定义 <code>type=index</code> 列的行号。
      </p>
      <p>
        通过给<code>{" type=index"}</code> 的列传入 index
        属性，可以自定义索引。该属性传入数字时，将作为索引的起始值。也可以传入一个方法，它提供当前行的行号（从{" "}
        <code>0</code> 开始）作为参数，返回值将作为索引展示。
      </p>
      <DemoBlock source={SOURCES.customIndex}>
        <TableCustomIndex />
      </DemoBlock>

      <Heading level={2}>表格布局</Heading>
      <p>
        通过属性{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout"
          target="_blank"
          rel="noreferrer"
        >
          table-layout
        </a>{" "}
        可以指定表格中单元格、行和列的布局方式
      </p>
      <DemoBlock source={SOURCES.tableLayout}>
        <TableLayout />
      </DemoBlock>

      <Heading level={2} id="tooltip-自定义">
        Tooltip 自定义 <span className="docs-version-tag">2.9.4</span>
      </Heading>
      <p>
        您可以使用 <code>tooltip-formatter</code> 自定义 Tooltip 提示内容。
      </p>
      <DemoBlock source={SOURCES.tooltipFormatter}>
        <TableTooltipFormatter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
