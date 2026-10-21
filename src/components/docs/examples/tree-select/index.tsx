"use client";

import { useState } from "react";
import { ElDivider } from "@/components/element-plus/divider";
import { ElTreeSelect } from "@/components/element-plus/tree-select";
import type { TreeData, TreeSelectValue } from "@/components/element-plus/tree-select";

const width = { width: 240 };

const DATA: TreeData = [
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
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [{ value: "2-1-1", label: "Level three 2-1-1" }],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [{ value: "2-2-1", label: "Level three 2-2-1" }],
      },
    ],
  },
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [{ value: "3-1-1", label: "Level three 3-1-1" }],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [{ value: "3-2-1", label: "Level three 3-2-1" }],
      },
    ],
  },
];

export function TreeSelectBasic() {
  const [value, setValue] = useState<TreeSelectValue | undefined>();
  return (
    <>
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        renderAfterExpand={false}
        style={width}
      />
      <ElDivider />
      show checkbox:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        renderAfterExpand={false}
        showCheckbox
        style={width}
      />
    </>
  );
}

export function TreeSelectCheckStrictly() {
  const [value, setValue] = useState<TreeSelectValue | undefined>();
  return (
    <>
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        checkStrictly
        renderAfterExpand={false}
        style={width}
      />
      <ElDivider />
      show checkbox:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        checkStrictly
        renderAfterExpand={false}
        showCheckbox
        style={width}
      />
      <ElDivider />
      show checkbox with `check-on-click-node`:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        checkStrictly
        renderAfterExpand={false}
        showCheckbox
        checkOnClickNode
        style={width}
      />
    </>
  );
}

export function TreeSelectMultiple() {
  const [value, setValue] = useState<TreeSelectValue | undefined>([]);
  const [valueStrictly, setValueStrictly] = useState<TreeSelectValue | undefined>(
    [],
  );
  return (
    <>
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        multiple
        renderAfterExpand={false}
        style={width}
      />
      <ElDivider />
      show checkbox:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        multiple
        renderAfterExpand={false}
        showCheckbox
        style={width}
      />
      <ElDivider />
      show checkbox with `check-strictly`:{" "}
      <ElTreeSelect
        value={valueStrictly}
        onChange={setValueStrictly}
        data={DATA}
        multiple
        renderAfterExpand={false}
        showCheckbox
        checkStrictly
        checkOnClickNode
        style={width}
      />
    </>
  );
}

export function TreeSelectDisabled() {
  const [value, setValue] = useState<TreeSelectValue | undefined>();
  return (
    <ElTreeSelect
      value={value}
      onChange={setValue}
      data={[
        {
          value: "1",
          label: "Level one 1",
          disabled: true,
          children: [
            {
              value: "1-1",
              label: "Level two 1-1",
              disabled: true,
              children: [
                { value: "1-1-1", label: "Level three 1-1-1", disabled: true },
              ],
            },
          ],
        },
        ...DATA.slice(1),
      ]}
      style={width}
    />
  );
}

const SOURCE_DATA: TreeData = DATA;

export function TreeSelectFilterable() {
  const [value, setValue] = useState<TreeSelectValue | undefined>();
  const [data, setData] = useState<TreeData>(SOURCE_DATA);

  const filterMethod = (keyword: string) => {
    setData(
      keyword
        ? (SOURCE_DATA.filter((item) =>
            String(item.label).includes(keyword),
          ) as TreeData)
        : SOURCE_DATA,
    );
  };

  const filterNodeMethod = (keyword: unknown, item: Record<string, unknown>) =>
    String(item.label).includes(String(keyword));

  return (
    <>
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={SOURCE_DATA}
        filterable
        style={width}
      />
      <ElDivider />
      filter method:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={data}
        filterMethod={filterMethod}
        filterable
        style={width}
      />
      <ElDivider />
      filter node method:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={SOURCE_DATA}
        filterNodeMethod={filterNodeMethod}
        filterable
        style={width}
      />
    </>
  );
}

export function TreeSelectSlots() {
  const [value, setValue] = useState<TreeSelectValue | undefined>();

  const renderContent = ({ data }: { data: Record<string, unknown> }) => (
    <span style={{ color: "#626AEF" }}>{String(data.label)}</span>
  );

  return (
    <>
      <ElTreeSelect value={value} onChange={setValue} data={DATA} style={width}>
        {({ data }) => (
          <>
            {String(data.label)}
            <span style={{ color: "gray" }}>(suffix)</span>
          </>
        )}
      </ElTreeSelect>
      <ElDivider />
      use render content:{" "}
      <ElTreeSelect
        value={value}
        onChange={setValue}
        data={DATA}
        renderContent={renderContent}
        style={width}
      />
    </>
  );
}

let lazyId = 0;

const loadLazyNode = (
  node: { isLeaf?: boolean },
  resolve: (data: TreeData) => void,
) => {
  if (node.isLeaf) {
    resolve([]);
    return;
  }
  setTimeout(() => {
    lazyId += 1;
    const first = lazyId;
    lazyId += 1;
    const second = lazyId;
    resolve([
      { value: first, label: `lazy load node${first}` },
      { value: second, label: `lazy load node${second}`, isLeaf: true },
    ]);
  }, 400);
};

export function TreeSelectLazy() {
  const [value, setValue] = useState<TreeSelectValue | undefined>();
  const [value2, setValue2] = useState<TreeSelectValue | undefined>(5);

  const treeProps = { label: "label", children: "children", isLeaf: "isLeaf" };

  return (
    <>
      <ElTreeSelect
        value={value}
        onChange={setValue}
        lazy
        load={loadLazyNode}
        props={treeProps}
        style={width}
      />
      <ElDivider />
      show lazy load label:{" "}
      <ElTreeSelect
        value={value2}
        onChange={setValue2}
        lazy
        load={loadLazyNode}
        props={treeProps}
        cacheData={[{ value: 5, label: "lazy load node5" }]}
        style={width}
      />
    </>
  );
}

export function TreeSelectNodeKey() {
  const [value, setValue] = useState<TreeSelectValue | undefined>([2]);
  return (
    <ElTreeSelect
      value={value}
      onChange={setValue}
      style={width}
      data={[
        {
          id: 1,
          label: "Level one 1",
          children: [
            { id: 2, label: "Level two 1-1" },
            { id: 3, label: "Level two 1-2" },
          ],
        },
      ]}
      nodeKey="id"
      showCheckbox
      multiple
      defaultExpandAll
    />
  );
}
