"use client";

import { useState } from "react";
import { ElSelect } from "@/components/element-plus/select";
import type { SelectOptionType, SelectValue } from "@/components/element-plus/select";
import { ElInput } from "@/components/element-plus/input";
import { ElButton } from "@/components/element-plus/button";
import { ElCheckbox } from "@/components/element-plus/checkbox";
import { ElTag } from "@/components/element-plus/tag";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Loading } from "@/components/element-plus/generated/icons";
import { message } from "@/components/element-plus/message";
import type { ComponentSize } from "@/components/element-plus/button/types";

const row = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap" as const,
  alignItems: "center",
};

const wrap = {
  display: "flex",
  flexWrap: "wrap" as const,
};

const BASIC_OPTIONS: SelectOptionType[] = [
  { value: "Option1", label: "Option1" },
  { value: "Option2", label: "Option2" },
  { value: "Option3", label: "Option3" },
  { value: "Option4", label: "Option4" },
  { value: "Option5", label: "Option5" },
];

const CITIES: SelectOptionType[] = [
  { value: "Beijing", label: "Beijing" },
  { value: "Shanghai", label: "Shanghai" },
  { value: "Nanjing", label: "Nanjing" },
  { value: "Chengdu", label: "Chengdu" },
  { value: "Shenzhen", label: "Shenzhen" },
  { value: "Guangzhou", label: "Guangzhou" },
];

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const REMOTE_LIST: SelectOptionType[] = STATES.map((item) => ({
  value: `value:${item}`,
  label: `label:${item}`,
}));

export function SelectBasic() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      options={BASIC_OPTIONS}
      placeholder="Select"
      style={{ width: 240 }}
    />
  );
}

export function SelectOptions() {
  const [value, setValue] = useState<SelectValue>("");
  const options: SelectOptionType[] = [
    { id: "Option1", label: "Option1" },
    { id: "Option2", label: "Option2", disabled: true },
    { id: "Option3", label: "Option3" },
    { id: "Option4", label: "Option4", disabled: true },
    { id: "Option5", label: "Option5" },
  ];
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      options={options}
      props={{ value: "id", label: "label", options: "options", disabled: "disabled" }}
      placeholder="Select"
      style={{ width: 240 }}
    />
  );
}

export function SelectDisabledOption() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      placeholder="Select"
      style={{ width: 240 }}
      options={[
        { value: "Option1", label: "Option1" },
        { value: "Option2", label: "Option2", disabled: true },
        { value: "Option3", label: "Option3" },
        { value: "Option4", label: "Option4" },
        { value: "Option5", label: "Option5" },
      ]}
    />
  );
}

export function SelectDisabled() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      disabled
      placeholder="Select"
      options={BASIC_OPTIONS}
      style={{ width: 240 }}
    />
  );
}

export function SelectClearable() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      options={BASIC_OPTIONS}
      clearable
      placeholder="Select"
      style={{ width: 240 }}
    />
  );
}

export function SelectMultiple() {
  const [value1, setValue1] = useState<SelectValue>([]);
  const [value2, setValue2] = useState<SelectValue>([]);
  const [value3, setValue3] = useState<SelectValue>([]);
  const [value4, setValue4] = useState<SelectValue>([]);

  return (
    <>
      <div style={{ margin: 16 }}>
        <p>default</p>
        <ElSelect
          value={value1}
          onChange={setValue1}
          multiple
          placeholder="Select"
          options={BASIC_OPTIONS}
          style={{ width: 240 }}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p>use collapse-tags</p>
        <ElSelect
          value={value2}
          onChange={setValue2}
          multiple
          collapseTags
          placeholder="Select"
          options={BASIC_OPTIONS}
          style={{ width: 240 }}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p>use collapse-tags-tooltip</p>
        <ElSelect
          value={value3}
          onChange={setValue3}
          multiple
          collapseTags
          collapseTagsTooltip
          placeholder="Select"
          options={BASIC_OPTIONS}
          style={{ width: 240 }}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p>use max-collapse-tags</p>
        <ElSelect
          value={value4}
          onChange={setValue4}
          multiple
          collapseTags
          collapseTagsTooltip
          maxCollapseTags={3}
          placeholder="Select"
          options={BASIC_OPTIONS}
          style={{ width: 240 }}
        />
      </div>
    </>
  );
}

export function SelectFilterable() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      filterable
      placeholder="Select"
      options={BASIC_OPTIONS}
      style={{ width: 240 }}
    />
  );
}

export function SelectRemoteSearch() {
  const [value, setValue] = useState<SelectValue>([]);
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const [loading, setLoading] = useState(false);

  const remoteMethod = (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOptions(
        REMOTE_LIST.filter((item) =>
          String(item.label).toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }, 200);
  };

  return (
    <div style={wrap}>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>default</p>
        <ElSelect
          value={value}
          onChange={setValue}
          multiple
          filterable
          remote
          reserveKeyword
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          loading={loading}
          options={options}
          style={{ width: 240 }}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>use remote-show-suffix</p>
        <ElSelect
          value={value}
          onChange={setValue}
          multiple
          filterable
          remote
          reserveKeyword
          remoteShowSuffix
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          loading={loading}
          options={options}
          style={{ width: 240 }}
        />
      </div>
    </div>
  );
}

export function SelectAllowCreate() {
  const [value, setValue] = useState<SelectValue>([]);
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      multiple
      filterable
      allowCreate
      defaultFirstOption
      reserveKeyword={false}
      placeholder="Choose tags for your article"
      options={[
        { value: "HTML", label: "HTML" },
        { value: "CSS", label: "CSS" },
        { value: "JavaScript", label: "JavaScript" },
      ]}
      style={{ width: 240 }}
    />
  );
}

export function SelectGrouping() {
  const [value, setValue] = useState<SelectValue>("");
  const options: SelectOptionType[] = [
    {
      label: "Popular cities",
      options: [
        { value: "Shanghai", label: "Shanghai" },
        { value: "Beijing", label: "Beijing" },
      ],
    },
    {
      label: "City name",
      options: [
        { value: "Chengdu", label: "Chengdu" },
        { value: "Shenzhen", label: "Shenzhen" },
        { value: "Guangzhou", label: "Guangzhou" },
        { value: "Dalian", label: "Dalian" },
      ],
    },
  ];
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      placeholder="Select"
      options={options}
      style={{ width: 240 }}
    />
  );
}

export function SelectCustomTemplate() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      placeholder="Select"
      options={CITIES}
      style={{ width: 240 }}
    >
      {({ item }) => (
        <>
          <span style={{ float: "left" }}>{String(item.label)}</span>
          <span
            style={{
              float: "right",
              color: "var(--el-text-color-secondary)",
              fontSize: 13,
            }}
          >
            {String(item.value)}
          </span>
        </>
      )}
    </ElSelect>
  );
}

export function SelectCustomLabel() {
  const [value1, setValue1] = useState<SelectValue>("Option1");
  const [value2, setValue2] = useState<SelectValue>(["Option1"]);
  const options: SelectOptionType[] = [
    { value: "Option1", label: "Label1" },
    { value: "Option2", label: "Label2" },
    { value: "Option3", label: "Label3" },
    { value: "Option4", label: "Label4" },
    { value: "Option5", label: "Label5" },
  ];

  return (
    <div style={row}>
      <ElSelect
        value={value1}
        onChange={setValue1}
        placeholder="Select"
        options={options}
        clearable
        style={{ width: 240 }}
        label={({ label, value }) => (
          <>
            <span>{String(label)}: </span>
            <span style={{ fontWeight: "bold" }}>{String(value)}</span>
          </>
        )}
      />
      <ElSelect
        value={value2}
        onChange={setValue2}
        placeholder="Select"
        options={options}
        clearable
        multiple
        style={{ width: 240 }}
        label={({ label, value }) => (
          <>
            <span>{String(label)}: </span>
            <span style={{ fontWeight: "bold" }}>{String(value)}</span>
          </>
        )}
      />
    </div>
  );
}

export function SelectCustomTag() {
  const [value, setValue] = useState<SelectValue>([
    "#E63415",
    "#FF6600",
    "#FFDE0A",
    "#1EC79D",
    "#14CCCC",
    "#4167F0",
    "#6222C9",
  ]);
  const colors: SelectOptionType[] = [
    { value: "#E63415", label: "red" },
    { value: "#FF6600", label: "orange" },
    { value: "#FFDE0A", label: "yellow" },
    { value: "#1EC79D", label: "green" },
    { value: "#14CCCC", label: "cyan" },
    { value: "#4167F0", label: "blue" },
    { value: "#6222C9", label: "purple" },
  ];

  return (
    <ElSelect
      value={value}
      onChange={setValue}
      multiple
      placeholder="Select"
      options={colors}
      style={{ width: 240 }}
      tag={({ data }) => (
        <>
          {data.map((option) => (
            <ElTag
              key={String(option.value)}
              color={String(option.value)}
              style={{ border: "none", aspectRatio: "1" }}
            />
          ))}
        </>
      )}
    >
      {({ item }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <ElTag
            color={String(item.value)}
            size="small"
            style={{ marginRight: 8 }}
          />
          <span style={{ color: String(item.value) }}>
            {String(item.label)}
          </span>
        </div>
      )}
    </ElSelect>
  );
}

export function SelectCustomHeader() {
  const [value, setValue] = useState<SelectValue>([]);
  const selected = Array.isArray(value) ? value : [];
  const checkAll = selected.length === CITIES.length;
  const indeterminate = selected.length > 0 && selected.length < CITIES.length;

  const handleCheckAll = (checked: boolean) => {
    setValue(checked ? CITIES.map((item) => item.value) : []);
  };

  return (
    <ElSelect
      value={value}
      onChange={setValue}
      multiple
      clearable
      collapseTags
      placeholder="Select"
      maxCollapseTags={1}
      options={CITIES}
      style={{ width: 240 }}
      header={
        <ElCheckbox
          checked={checkAll}
          indeterminate={indeterminate}
          onCheckedChange={handleCheckAll}
        >
          All
        </ElCheckbox>
      }
    />
  );
}

export function SelectCustomFooter() {
  const [value, setValue] = useState<SelectValue>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [optionName, setOptionName] = useState("");
  const [cities, setCities] = useState<SelectOptionType[]>(CITIES);

  const clear = () => {
    setOptionName("");
    setIsAdding(false);
  };

  const onConfirm = () => {
    if (optionName) {
      setCities((prev) => [...prev, { label: optionName, value: optionName }]);
      clear();
    }
  };

  return (
    <ElSelect
      value={value}
      onChange={setValue}
      placeholder="Select"
      options={cities}
      style={{ width: 240 }}
      footer={
        isAdding ? (
          <div>
            <ElInput
              className="option-input"
              value={optionName}
              onChange={setOptionName}
              placeholder="input option name"
              size="small"
              style={{ width: "100%", marginBottom: 8 }}
            />
            <ElButton type="primary" size="small" onClick={onConfirm}>
              confirm
            </ElButton>
            <ElButton size="small" onClick={clear}>cancel</ElButton>
          </div>
        ) : (
          <ElButton text bg size="small" onClick={() => setIsAdding(true)}>
            Add an option
          </ElButton>
        )
      }
    />
  );
}

export function SelectCustomLoading() {
  const [value, setValue] = useState<SelectValue>([]);
  const [options, setOptions] = useState<SelectOptionType[]>([]);
  const [loading, setLoading] = useState(false);

  const remoteMethod = (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOptions(
        REMOTE_LIST.filter((item) =>
          String(item.label).toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }, 1000);
  };

  const loadingSlot = (
    <ElIcon className="is-loading">
      <Loading />
    </ElIcon>
  );

  return (
    <div style={wrap}>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>loading icon1</p>
        <ElSelect
          value={value}
          onChange={setValue}
          multiple
          filterable
          remote
          reserveKeyword
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          loading={loading}
          loadingSlot={loadingSlot}
          options={options}
          style={{ width: 240 }}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>loading icon2</p>
        <ElSelect
          value={value}
          onChange={setValue}
          multiple
          filterable
          remote
          reserveKeyword
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          loading={loading}
          loadingSlot={loadingSlot}
          options={options}
          style={{ width: 240 }}
        />
      </div>
    </div>
  );
}

export function SelectSize() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <div style={row}>
      {(["large", "default", "small"] as ComponentSize[]).map((size) => (
        <ElSelect
          key={size}
          value={value}
          onChange={setValue}
          options={BASIC_OPTIONS}
          size={size}
          placeholder="Select"
          style={{ width: 240 }}
        />
      ))}
    </div>
  );
}

export function SelectEmptyValues() {
  const [value, setValue] = useState<SelectValue>("");
  return (
    <ElSelect
      value={value}
      onChange={setValue}
      emptyValues={[null, undefined]}
      valueOnClear={null}
      onClear={() => message.info("The clear value is: null")}
      clearable
      placeholder="Select"
      options={[
        { value: "", label: "All" },
        ...BASIC_OPTIONS,
      ]}
      style={{ width: 240 }}
    />
  );
}

export function SelectValueKey() {
  const [value, setValue] = useState<SelectValue>(null);
  const options: SelectOptionType[] = [
    { id: 1, label: "Option A", desc: "Option A - 230506" },
    { id: 2, label: "Option B", desc: "Option B - 230506" },
    { id: 3, label: "Option C", desc: "Option C - 230506" },
    { id: 4, label: "Option A", desc: "Option A - 230507" },
  ];
  const selected =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : undefined;

  return (
    <div style={{ margin: 16 }}>
      <ElSelect
        value={value}
        onChange={setValue}
        valueKey="id"
        placeholder="Select"
        options={options}
        style={{ width: 240 }}
      />
      <p>
        selected option&apos;s description: {selected ? String(selected.desc) : "no select"}
      </p>
    </div>
  );
}
