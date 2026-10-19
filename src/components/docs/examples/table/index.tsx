"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  ElTable,
  ElTableColumn,
  type DefaultRow,
  type TableExpose,
  type TableSortOrder,
} from "@/components/ui/table";
import { ElButton } from "@/components/ui/button";
import { ElInput } from "@/components/ui/input";
import { ElLink } from "@/components/ui/link";
import { ElRadio, ElRadioGroup } from "@/components/ui/radio";
import { ElTag } from "@/components/ui/tag";

interface User {
  id: number | string;
  date: string;
  name: string;
  state: string;
  city: string;
  address: string;
  zip: string;
  amount1: number;
  amount2: number;
  amount3: number;
  tag?: string;
  children?: User[];
  hasChildren?: boolean;
  [key: string]: unknown;
}

const tableData: User[] = [
  { id: 1, date: "2016-05-03", name: "Tom", state: "California", city: "Los Angeles", address: "No. 189, Grove St, Los Angeles", zip: "CA 90036", amount1: 120, amount2: 45, amount3: 33 },
  { id: 2, date: "2016-05-02", name: "Tom", state: "California", city: "Los Angeles", address: "No. 189, Grove St, Los Angeles", zip: "CA 90036", amount1: 80, amount2: 12, amount3: 9 },
  { id: 3, date: "2016-05-04", name: "Tom", state: "California", city: "Los Angeles", address: "No. 189, Grove St, Los Angeles", zip: "CA 90036", amount1: 200, amount2: 60, amount3: 40 },
  { id: 4, date: "2016-05-01", name: "Tom", state: "California", city: "Los Angeles", address: "No. 189, Grove St, Los Angeles", zip: "CA 90036", amount1: 30, amount2: 20, amount3: 10 },
];

const fullWidth = { width: "100%" as const };

export function TableBasic() {
  return (
    <ElTable data={tableData} style={fullWidth}>
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  );
}

export function TableStriped() {
  return (
    <ElTable data={tableData} stripe style={fullWidth}>
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  );
}

export function TableBorder() {
  return (
    <ElTable data={tableData} border style={fullWidth}>
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  );
}

export function TableFixedHeader() {
  return (
    <ElTable data={[...tableData, ...tableData, ...tableData]} height="250" style={fullWidth}>
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  );
}

export function TableFixedColumn() {
  return (
    <ElTable data={tableData} style={fullWidth}>
      <ElTableColumn fixed prop="date" label="Date" width="150" />
      <ElTableColumn prop="name" label="Name" width="120" />
      <ElTableColumn prop="state" label="State" width="120" />
      <ElTableColumn prop="city" label="City" width="120" />
      <ElTableColumn prop="address" label="Address" width="600" />
      <ElTableColumn prop="zip" label="Zip" width="120" />
      <ElTableColumn fixed="right" label="Operations" minWidth="120">
        {() => (
          <ElButton link type="primary" size="small">
            Detail
          </ElButton>
        )}
      </ElTableColumn>
    </ElTable>
  );
}

export function TableGroupHeader() {
  return (
    <ElTable data={tableData} style={fullWidth}>
      <ElTableColumn prop="date" label="Date" width="150" />
      <ElTableColumn label="Delivery Info">
        <ElTableColumn prop="name" label="Name" width="120" />
        <ElTableColumn label="Address Info">
          <ElTableColumn prop="state" label="State" width="120" />
          <ElTableColumn prop="city" label="City" width="120" />
          <ElTableColumn prop="address" label="Address" />
        </ElTableColumn>
      </ElTableColumn>
    </ElTable>
  );
}

export function TableSort() {
  const [order, setOrder] = useState<TableSortOrder | null>("descending");
  return (
    <ElTable
      data={tableData}
      defaultSort={{ prop: "date", order: "descending" }}
      style={fullWidth}
      onSortChange={(data) => setOrder(data.order)}
    >
      <ElTableColumn prop="date" label="Date" sortable width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
      <ElTableColumn label="当前排序" width="120">
        {() => order ?? "无"}
      </ElTableColumn>
    </ElTable>
  );
}

export function TableSingleSelect() {
  const tableRef = useRef<TableExpose>(null);
  const [current, setCurrent] = useState<User | null>(null);

  return (
    <>
      <ElTable
        ref={tableRef}
        data={tableData}
        highlightCurrentRow
        style={fullWidth}
        onCurrentChange={(row) => setCurrent(row as User | null)}
      >
        <ElTableColumn type="index" width="50" />
        <ElTableColumn prop="date" label="Date" width="120" />
        <ElTableColumn prop="name" label="Name" width="120" />
        <ElTableColumn prop="address" label="Address" />
      </ElTable>
      <div style={{ marginTop: 20 }}>
        <ElButton onClick={() => tableRef.current?.setCurrentRow(tableData[1])}>
          Select second row
        </ElButton>
        <ElButton onClick={() => tableRef.current?.setCurrentRow()}>Clear selection</ElButton>
        <span style={{ marginLeft: 12 }}>
          当前行：{current ? current.name : "无"}
        </span>
      </div>
    </>
  );
}

export function TableMultiSelect() {
  const tableRef = useRef<TableExpose>(null);
  const [selected, setSelected] = useState<User[]>([]);
  const selectable = (row: User) => ![1, 2].includes(Number(row.id));

  return (
    <>
      <ElTable
        ref={tableRef}
        data={tableData}
        rowKey="id"
        style={fullWidth}
        onSelectionChange={(rows) => setSelected(rows as User[])}
      >
        <ElTableColumn type="selection" selectable={selectable} width="55" />
        <ElTableColumn prop="date" label="Date" width="120" />
        <ElTableColumn prop="name" label="Name" width="120" />
        <ElTableColumn prop="address" label="Address" />
      </ElTable>
      <div style={{ marginTop: 20 }}>
        <ElButton
          onClick={() => {
            [tableData[1], tableData[2]].forEach((row) =>
              tableRef.current?.toggleRowSelection(row),
            );
          }}
        >
          切换二三行
        </ElButton>
        <ElButton onClick={() => tableRef.current?.toggleAllSelection()}>全选切换</ElButton>
        <ElButton onClick={() => tableRef.current?.clearSelection()}>清空选择</ElButton>
        <span style={{ marginLeft: 12 }}>已选 {selected.length} 行</span>
      </div>
    </>
  );
}

export function TableExpandable() {
  return (
    <ElTable
      data={tableData}
      style={fullWidth}
      renderExpanded={({ row }) => (
        <div style={{ padding: 12 }}>
          <p style={{ margin: "0 0 8px" }}>State: {(row as User).state}</p>
          <p style={{ margin: "0 0 8px" }}>City: {(row as User).city}</p>
          <p style={{ margin: 0 }}>Address: {(row as User).address}</p>
        </div>
      )}
    >
      <ElTableColumn type="expand" />
      <ElTableColumn prop="date" label="Date" />
      <ElTableColumn prop="name" label="Name" />
    </ElTable>
  );
}

export function TableCustomColumn() {
  return (
    <ElTable data={tableData} style={fullWidth}>
      <ElTableColumn label="Date" width="180">
        {({ row }) => <span>{(row as User).date}</span>}
      </ElTableColumn>
      <ElTableColumn label="Name" width="180">
        {({ row }) => <strong>{(row as User).name}</strong>}
      </ElTableColumn>
      <ElTableColumn label="Operations">
        {({ row }) => (
          <ElButton size="small" onClick={() => console.log("edit", row)}>
            Edit
          </ElButton>
        )}
      </ElTableColumn>
    </ElTable>
  );
}

export function TableWithStatus() {
  const warningRow: CSSProperties = {
    "--el-table-tr-bg-color": "var(--el-color-warning-light-9)",
  } as CSSProperties;
  const successRow: CSSProperties = {
    "--el-table-tr-bg-color": "var(--el-color-success-light-9)",
  } as CSSProperties;

  return (
    <ElTable
      data={tableData}
      style={fullWidth}
      rowStyle={({ rowIndex }) =>
        rowIndex === 1 ? warningRow : rowIndex === 3 ? successRow : {}
      }
    >
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  );
}

export function TableOverflowTooltip() {
  return (
    <ElTable data={tableData} style={fullWidth}>
      <ElTableColumn type="selection" width="55" />
      <ElTableColumn label="Date" width="120">
        {({ row }) => <span>{(row as User).date}</span>}
      </ElTableColumn>
      <ElTableColumn prop="name" label="Name" width="120" />
      <ElTableColumn
        prop="address"
        label="use show-overflow-tooltip"
        width="240"
        showOverflowTooltip
      />
      <ElTableColumn prop="address" label="address" />
    </ElTable>
  );
}

export function TableFixedColumnAndHeader() {
  return (
    <ElTable data={tableData} height="250" style={fullWidth}>
      <ElTableColumn fixed prop="date" label="Date" width="150" />
      <ElTableColumn prop="name" label="Name" width="120" />
      <ElTableColumn prop="state" label="State" width="120" />
      <ElTableColumn prop="city" label="City" width="320" />
      <ElTableColumn prop="address" label="Address" width="600" />
      <ElTableColumn prop="zip" label="Zip" />
    </ElTable>
  );
}

export function TableFixedHeaderFluid() {
  const [rows, setRows] = useState<User[]>([
    { ...tableData[3] },
    { ...tableData[1] },
    { ...tableData[0] },
  ]);

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_row, rowIndex) => rowIndex !== index));
  };

  const addItem = () => {
    setRows((prev) => [
      ...prev,
      {
        ...tableData[2],
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  return (
    <>
      <ElTable data={rows} maxHeight="250" style={fullWidth}>
        <ElTableColumn fixed prop="date" label="Date" width="150" />
        <ElTableColumn prop="name" label="Name" width="120" />
        <ElTableColumn prop="state" label="State" width="120" />
        <ElTableColumn prop="city" label="City" width="120" />
        <ElTableColumn prop="address" label="Address" width="600" />
        <ElTableColumn prop="zip" label="Zip" width="120" />
        <ElTableColumn fixed="right" label="Operations" minWidth="120">
          {({ $index }) => (
            <ElButton link type="primary" size="small" onClick={() => removeRow($index)}>
              Remove
            </ElButton>
          )}
        </ElTableColumn>
      </ElTable>
      <ElButton style={{ width: "100%", marginTop: 16 }} onClick={addItem}>
        Add Item
      </ElButton>
    </>
  );
}

export function TableFixedGroupHeader() {
  return (
    <ElTable data={tableData} height="250" style={fullWidth}>
      <ElTableColumn prop="date" label="Date" />
      <ElTableColumn prop="name" label="Name" />
      <ElTableColumn prop="zip" label="Zip" />
      <ElTableColumn label="Address Info" fixed="right">
        <ElTableColumn prop="state" label="State" />
        <ElTableColumn prop="city" label="City" />
        <ElTableColumn prop="address" label="Address" minWidth="200" />
      </ElTableColumn>
    </ElTable>
  );
}

export function TableFilter() {
  const tableRef = useRef<TableExpose>(null);
  const filters = [
    { text: "2016-05-01", value: "2016-05-01" },
    { text: "2016-05-02", value: "2016-05-02" },
    { text: "2016-05-03", value: "2016-05-03" },
    { text: "2016-05-04", value: "2016-05-04" },
  ];
  const tags = [
    { text: "Home", value: "Home" },
    { text: "Office", value: "Office" },
  ];

  return (
    <>
      <ElButton onClick={() => tableRef.current?.clearFilter(["date"])}>
        reset date filter
      </ElButton>
      <ElButton onClick={() => tableRef.current?.clearFilter()}>
        reset all filters
      </ElButton>
      <ElTable ref={tableRef} rowKey="date" data={tableData} style={{ ...fullWidth, marginTop: 12 }}>
        <ElTableColumn
          prop="date"
          label="Date"
          sortable
          width="180"
          columnKey="date"
          filters={filters}
          filterMethod={(value, row) => (row as User).date === value}
        />
        <ElTableColumn prop="name" label="Name" width="180" />
        <ElTableColumn
          prop="address"
          label="Address"
          formatter={(row) => (row as User).address}
        />
        <ElTableColumn
          prop="tag"
          label="Tag"
          width="100"
          filters={tags}
          filterMethod={(value, row) => (row as User).tag === value}
          filterPlacement="bottom-end"
        >
          {({ row }) => (
            <ElTag type={(row as User).tag === "Home" ? "primary" : "success"}>
              {(row as User).tag}
            </ElTag>
          )}
        </ElTableColumn>
      </ElTable>
    </>
  );
}

export function TableCustomHeader() {
  const [search, setSearch] = useState("");
  const filteredData = tableData.filter(
    (row) => !search || row.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ElTable data={filteredData} style={fullWidth}>
      <ElTableColumn label="Date" prop="date" />
      <ElTableColumn label="Name" prop="name" />
      <ElTableColumn
        align="right"
        renderHeader={() => (
          <ElInput
            value={search}
            size="small"
            placeholder="Type to search"
            onChange={setSearch}
          />
        )}
      >
        {({ $index, row }) => (
          <>
            <ElButton size="small" onClick={() => console.log("edit", $index, row)}>
              Edit
            </ElButton>
            <ElButton
              size="small"
              type="danger"
              onClick={() => console.log("delete", $index, row)}
            >
              Delete
            </ElButton>
          </>
        )}
      </ElTableColumn>
    </ElTable>
  );
}

const treeData: User[] = [
  { ...tableData[1], id: 1, date: "2016-05-02" },
  { ...tableData[2], id: 2, date: "2016-05-04" },
  {
    ...tableData[3],
    id: 3,
    date: "2016-05-01",
    children: [
      { ...tableData[0], id: 31, date: "2016-05-01" },
      { ...tableData[1], id: 32, date: "2016-05-01" },
    ],
  },
  { ...tableData[0], id: 4, date: "2016-05-03" },
];

const lazyData: User[] = [
  { ...tableData[1], id: 1, date: "2016-05-02" },
  { ...tableData[2], id: 2, date: "2016-05-04" },
  { ...tableData[3], id: 3, date: "2016-05-01", hasChildren: true },
  { ...tableData[0], id: 4, date: "2016-05-03" },
];

export function TableTreeAndLazy() {
  const load = (
    _row: DefaultRow,
    _treeNode: unknown,
    resolve: (data: DefaultRow[]) => void,
  ) => {
    window.setTimeout(() => {
      resolve([
        { ...tableData[0], id: 31, date: "2016-05-01", name: "wangxiaohu" },
        { ...tableData[1], id: 32, date: "2016-05-01", name: "wangxiaohu" },
      ]);
    }, 1000);
  };

  return (
    <div>
      <ElTable
        data={treeData}
        rowKey="id"
        border
        defaultExpandAll
        style={{ ...fullWidth, marginBottom: 20 }}
      >
        <ElTableColumn prop="date" label="Date" sortable />
        <ElTableColumn prop="name" label="Name" sortable />
        <ElTableColumn prop="address" label="Address" sortable />
      </ElTable>
      <ElTable
        data={lazyData}
        rowKey="id"
        border
        lazy
        load={load}
        treeProps={{ children: "children", hasChildren: "hasChildren" }}
        style={fullWidth}
      >
        <ElTableColumn prop="date" label="Date" />
        <ElTableColumn prop="name" label="Name" />
        <ElTableColumn prop="address" label="Address" />
      </ElTable>
    </div>
  );
}

export function TableCheckStrictly() {
  const [checkStrictly, setCheckStrictly] = useState(false);

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <ElRadioGroup
          type="button"
          value={checkStrictly}
          onChange={(value) => setCheckStrictly(value === true)}
        >
          <ElRadio value={true}>true</ElRadio>
          <ElRadio value={false}>false</ElRadio>
        </ElRadioGroup>
      </div>
      <ElTable
        data={treeData}
        rowKey="id"
        defaultExpandAll
        treeProps={{ checkStrictly }}
        style={fullWidth}
      >
        <ElTableColumn
          type="selection"
          width="55"
          selectable={(row) => ![1, 31].includes(Number((row as User).id))}
        />
        <ElTableColumn prop="date" label="Date" />
        <ElTableColumn prop="name" label="Name" />
        <ElTableColumn prop="address" label="Address" />
      </ElTable>
    </>
  );
}

export function TableSpan() {
  const spanData: User[] = [
    { ...tableData[0], id: 12987122, amount1: 234, amount2: 3.2, amount3: 10 },
    { ...tableData[1], id: 12987123, amount1: 165, amount2: 4.43, amount3: 12 },
    { ...tableData[2], id: 12987124, amount1: 324, amount2: 1.9, amount3: 9 },
    { ...tableData[3], id: 12987125, amount1: 621, amount2: 2.2, amount3: 17 },
    { ...tableData[0], id: 12987126, amount1: 539, amount2: 4.1, amount3: 15 },
  ];

  const arraySpanMethod = ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) => {
    if (rowIndex % 2 === 0) {
      if (columnIndex === 0) return [1, 2];
      if (columnIndex === 1) return [0, 0];
    }
    return undefined;
  };

  const objectSpanMethod = ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) => {
    if (columnIndex === 0) {
      return rowIndex % 2 === 0
        ? { rowspan: 2, colspan: 1 }
        : { rowspan: 0, colspan: 0 };
    }
    return undefined;
  };

  return (
    <div>
      <ElTable data={spanData} border spanMethod={arraySpanMethod} style={fullWidth}>
        <ElTableColumn prop="id" label="ID" width="180" />
        <ElTableColumn prop="name" label="Name" />
        <ElTableColumn prop="amount1" sortable label="Amount 1" />
        <ElTableColumn prop="amount2" sortable label="Amount 2" />
        <ElTableColumn prop="amount3" sortable label="Amount 3" />
      </ElTable>
      <ElTable
        data={spanData}
        border
        spanMethod={objectSpanMethod}
        style={{ ...fullWidth, marginTop: 20 }}
      >
        <ElTableColumn prop="id" label="ID" width="180" />
        <ElTableColumn prop="name" label="Name" />
        <ElTableColumn prop="amount1" label="Amount 1" />
        <ElTableColumn prop="amount2" label="Amount 2" />
        <ElTableColumn prop="amount3" label="Amount 3" />
      </ElTable>
    </div>
  );
}

export function TableCustomIndex() {
  return (
    <ElTable data={tableData} style={fullWidth}>
      <ElTableColumn type="index" index={(index) => index * 2} />
      <ElTableColumn prop="date" label="Date" width="180" />
      <ElTableColumn prop="name" label="Name" width="180" />
      <ElTableColumn prop="address" label="Address" />
    </ElTable>
  );
}

export function TableLayout() {
  const [tableLayout, setTableLayout] = useState<"fixed" | "auto">("fixed");

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <ElRadioGroup
          type="button"
          value={tableLayout}
          onChange={(value) => setTableLayout(value === "auto" ? "auto" : "fixed")}
        >
          <ElRadio value="fixed">fixed</ElRadio>
          <ElRadio value="auto">auto</ElRadio>
        </ElRadioGroup>
      </div>
      <ElTable data={tableData} tableLayout={tableLayout}>
        <ElTableColumn prop="date" label="Date" />
        <ElTableColumn prop="name" label="Name" />
        <ElTableColumn prop="address" label="Address" />
      </ElTable>
    </>
  );
}

interface TooltipRow {
  address: string;
  tags: string[];
  url: string;
  [key: string]: unknown;
}

export function TableTooltipFormatter() {
  const data: TooltipRow[] = [
    {
      address: "Lohrbergstr. 86c, Süd Lilli, Saarland",
      tags: ["Office", "Home", "Park", "Garden"],
      url: "https://github.com/element-plus/element-plus/issues",
    },
    {
      address: "760 A Street, South Frankfield, Illinois",
      tags: ["error", "warning", "success", "info"],
      url: "https://github.com/element-plus/element-plus/pulls",
    },
    {
      address: "Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen",
      tags: ["one", "two", "three", "four", "five"],
      url: "https://github.com/element-plus/element-plus/discussions",
    },
    {
      address: "23618 Windsor Drive, West Ricardoview, Idaho",
      tags: ["blue", "white", "dark", "gray", "red", "bright"],
      url: "https://github.com/element-plus/element-plus/actions",
    },
  ];

  return (
    <ElTable
      data={data}
      showOverflowTooltip
      tooltipFormatter={({ cellValue }) => `${String(cellValue)}: table formatter`}
      style={fullWidth}
    >
      <ElTableColumn prop="address" label="extends table formatter" width="240" />
      <ElTableColumn
        prop="tags"
        label="formatter object"
        width="240"
        tooltipFormatter={({ row }) => (row as TooltipRow).tags.join(", ")}
      >
        {({ row }) =>
          (row as TooltipRow).tags.map((tag) => (
            <ElTag key={tag} type="primary" style={{ marginRight: 5 }}>
              {tag}
            </ElTag>
          ))
        }
      </ElTableColumn>
      <ElTableColumn
        prop="url"
        label="with vnode"
        width="240"
        tooltipFormatter={({ cellValue }) => (
          <ElLink type="primary" href={String(cellValue)}>
            {String(cellValue)}
          </ElLink>
        )}
      />
    </ElTable>
  );
}

export function TableSummary() {
  const getSummaries = (param: { columns: unknown[]; data: unknown[] }) => {
    const { columns, data } = param;
    const sums: string[] = [];
    columns.forEach((_column, index) => {
      if (index === 0) {
        sums[index] = "Total Cost";
        return;
      }
      const values = (data as User[]).map((item) => item[`amount${index}` as keyof User]);
      const total = values.reduce<number>((prev, curr) => prev + Number(curr ?? 0), 0);
      sums[index] = Number.isNaN(total) ? "" : `$${total}`;
    });
    return sums;
  };

  return (
    <ElTable
      data={tableData}
      border
      showSummary
      summaryMethod={getSummaries}
      style={fullWidth}
    >
      <ElTableColumn prop="id" label="ID" width="180" />
      <ElTableColumn prop="name" label="Name" />
      <ElTableColumn prop="amount1" label="Cost 1 ($)" />
      <ElTableColumn prop="amount2" label="Cost 2 ($)" />
      <ElTableColumn prop="amount3" label="Cost 3 ($)" />
    </ElTable>
  );
}
