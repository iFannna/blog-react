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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<el-table-column>\` 子节点 | \`children\` 函数 | 传 \`(scope) => ReactNode\` |
| \`#default="scope"\` 具名插槽 | \`children\` 函数 | 参数同官方 \`scope\` |
| \`#header="scope"\` | \`renderHeader\` 属性 | 传函数 |
| \`render-header\`（已废弃） | \`renderHeader\` | 官方亦标注不推荐 |
| \`#empty\` / \`#append\` 插槽 | \`empty\` / \`append\` 属性 | 直接传 ReactNode |
| \`<el-table-column>\` 嵌套表达分组 | 同样嵌套 | 结构与官方一致 |
| \`filter-icon\` / \`expand\` 插槽 | 未提供 | 筛选图标与展开图标由组件内置 |
| 单例浮层（表格 tooltip / 筛选面板） | 每单元格/每列独立 ElTooltip | 表现一致，DOM 数量更多 |

**实现说明**：

- 列宽计算逐行对齐官方 \`table-layout.ts\` 的 \`updateColumnsWidth\`：带 \`width\` 的列固定宽度，
  其余列（flex）平分剩余空间，flex 多列时首列吸收取整误差，与官方算法一致。
- 固定列的类名与偏移量对齐官方 \`util.ts\` 的 \`isFixedColumn\` / \`getFixedColumnsClass\` /
  \`getFixedColumnOffset\`。
- 表头结构由 \`convertToRows\` 把列树换算成多行，支持任意层级的分组表头。
- 排序用官方同款的 \`orderBy\`（含稳定排序与多字段 \`sortBy\`）。
- 筛选先于排序执行；筛选面板多选带确认/重置，单选点击即生效。
- 树形数据按 \`rowKey\` 拍平展示，父子选择联动遵循官方 \`checkStrictly\` 语义；
  懒加载节点在首次展开时调用 \`load\`。
- 溢出提示在单元格 hover 时测量 \`scrollWidth\`，仅在真正溢出时弹出。
- 列宽拖拽仅在 \`border\` 模式且鼠标位于表头右缘时启用，与前后的滚动位置同步表头。
- 表格滚动容器复用本项目的 \`ElScrollbar\`。
`;

export default function TablePage() {
  return (
    <>
      <h1>Table 表格</h1>
      <p>用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。</p>

      <Heading level={2}>基础表格</Heading>
      <p>基础的表格展示用法。</p>
      <DemoBlock source={SOURCES.basic}>
        <TableBasic />
      </DemoBlock>

      <Heading level={2}>带斑马纹表格</Heading>
      <p>
        使用带斑马纹的表格，可以更容易区分出不同行的数据。
      </p>
      <DemoBlock source={SOURCES.striped}>
        <TableStriped />
      </DemoBlock>

      <Heading level={2}>带边框表格</Heading>
      <DemoBlock source={SOURCES.border}>
        <TableBorder />
      </DemoBlock>

      <Heading level={2}>带状态表格</Heading>
      <p>通过 <code>rowStyle</code> 或 <code>rowClassName</code> 为不同行设置状态样式。</p>
      <DemoBlock source={SOURCES.withStatus}>
        <TableWithStatus />
      </DemoBlock>

      <Heading level={2}>内容溢出提示</Heading>
      <p>
        给列设置 <code>showOverflowTooltip</code>，内容溢出时 hover 显示完整文本。
      </p>
      <DemoBlock source={SOURCES.overflowTooltip}>
        <TableOverflowTooltip />
      </DemoBlock>

      <Heading level={2}>固定表头</Heading>
      <p>
        设置 <code>height</code> 属性即可实现固定表头。
      </p>
      <DemoBlock source={SOURCES.fixedHeader}>
        <TableFixedHeader />
      </DemoBlock>

      <Heading level={2}>固定列</Heading>
      <p>
        通过 <code>fixed</code> 属性固定列，横向滚动时该列保持可见。
      </p>
      <DemoBlock source={SOURCES.fixedColumn}>
        <TableFixedColumn />
      </DemoBlock>

      <Heading level={2}>固定列和表头</Heading>
      <p>同时设置 <code>height</code> 与 <code>fixed</code>，横向、纵向滚动时表头与固定列保持可见。</p>
      <DemoBlock source={SOURCES.fixedColumnAndHeader}>
        <TableFixedColumnAndHeader />
      </DemoBlock>

      <Heading level={2}>流体高度表头</Heading>
      <p>
        设置 <code>maxHeight</code> 后，表头随内容高度自适应，数据超出时表体滚动。
      </p>
      <DemoBlock source={SOURCES.fixedHeaderFluid}>
        <TableFixedHeaderFluid />
      </DemoBlock>

      <Heading level={2}>分组表头</Heading>
      <p>通过嵌套 ElTableColumn 实现多层表头。</p>
      <DemoBlock source={SOURCES.groupHeader}>
        <TableGroupHeader />
      </DemoBlock>

      <Heading level={2}>固定列与分组表头</Heading>
      <p>分组表头同样支持 <code>fixed=&quot;right&quot;</code>。</p>
      <DemoBlock source={SOURCES.fixedGroupHeader}>
        <TableFixedGroupHeader />
      </DemoBlock>

      <Heading level={2}>单选</Heading>
      <p>
        设置 <code>highlightCurrentRow</code> 可以高亮当前行。
      </p>
      <DemoBlock source={SOURCES.singleSelect}>
        <TableSingleSelect />
      </DemoBlock>

      <Heading level={2}>多选</Heading>
      <p>
        通过 <code>type=&quot;selection&quot;</code> 的列开启多选。
      </p>
      <DemoBlock source={SOURCES.multiSelect}>
        <TableMultiSelect />
      </DemoBlock>

      <Heading level={2}>排序</Heading>
      <p>
        设置 <code>sortable</code> 即可对该列排序，配合 <code>defaultSort</code>
        设置默认排序。
      </p>
      <DemoBlock source={SOURCES.sort}>
        <TableSort />
      </DemoBlock>

      <Heading level={2}>筛选</Heading>
      <p>
        通过 <code>filters</code> 与 <code>filterMethod</code> 开启列筛选，
        <code>clearFilter</code> 可按列或全部清空。
      </p>
      <DemoBlock source={SOURCES.filter}>
        <TableFilter />
      </DemoBlock>

      <Heading level={2}>自定义列模板</Heading>
      <p>通过 <code>children</code> 函数自定义单元格内容。</p>
      <DemoBlock source={SOURCES.customColumn}>
        <TableCustomColumn />
      </DemoBlock>

      <Heading level={2}>自定义表头</Heading>
      <p>通过 <code>renderHeader</code> 在表头中放置输入框等交互元素。</p>
      <DemoBlock source={SOURCES.customHeader}>
        <TableCustomHeader />
      </DemoBlock>

      <Heading level={2}>展开行</Heading>
      <p>
        通过 <code>type=&quot;expand&quot;</code> 的列与 <code>renderExpanded</code> 实现展开行。
      </p>
      <DemoBlock source={SOURCES.expandable}>
        <TableExpandable />
      </DemoBlock>

      <Heading level={2}>树形数据与懒加载</Heading>
      <p>
        设置 <code>rowKey</code> 与 <code>treeProps</code> 展示树形数据；配合
        <code>lazy</code>、<code>load</code> 可异步加载子节点。
      </p>
      <DemoBlock source={SOURCES.treeAndLazy}>
        <TableTreeAndLazy />
      </DemoBlock>

      <Heading level={2}>严格树形选择</Heading>
      <p>
        <code>treeProps.checkStrictly</code> 为 true 时父子节点选择互不影响。
      </p>
      <DemoBlock source={SOURCES.checkStrictly}>
        <TableCheckStrictly />
      </DemoBlock>

      <Heading level={2}>合计行</Heading>
      <p>
        设置 <code>showSummary</code> 与 <code>summaryMethod</code> 显示合计行。
      </p>
      <DemoBlock source={SOURCES.summary}>
        <TableSummary />
      </DemoBlock>

      <Heading level={2}>合并行或列</Heading>
      <p>
        通过 <code>spanMethod</code> 返回数组或对象，合并指定单元格。
      </p>
      <DemoBlock source={SOURCES.span}>
        <TableSpan />
      </DemoBlock>

      <Heading level={2}>自定义索引</Heading>
      <p>给 index 列传入函数即可自定义索引值。</p>
      <DemoBlock source={SOURCES.customIndex}>
        <TableCustomIndex />
      </DemoBlock>

      <Heading level={2}>表格布局</Heading>
      <p>
        <code>tableLayout</code> 支持 <code>fixed</code> 与 <code>auto</code> 两种布局。
      </p>
      <DemoBlock source={SOURCES.tableLayout}>
        <TableLayout />
      </DemoBlock>

      <Heading level={2}>Tooltip 格式化</Heading>
      <p>
        表格级与列级 <code>tooltipFormatter</code> 可自定义溢出提示内容，支持返回 React 节点。
      </p>
      <DemoBlock source={SOURCES.tooltipFormatter}>
        <TableTooltipFormatter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
