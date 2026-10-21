"use client";

import { useRef, useState } from "react";

import { ElButton } from "@/components/element-plus/button";
import { ElCheckbox } from "@/components/element-plus/checkbox";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElInput } from "@/components/element-plus/input";
import { Loading } from "@/components/element-plus/generated/icons";
import { message } from "@/components/element-plus/message";
import { ElSelectV2 } from "@/components/element-plus/select-v2";
import { ElTag } from "@/components/element-plus/tag";
import type {
  SelectV2Expose,
  SelectV2OptionType,
  SelectV2Value,
} from "@/components/element-plus/select-v2";

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "center",
} as const;

const column = {
  display: "flex",
  flexDirection: "column",
} as const;

const wrap = {
  display: "flex",
  flexWrap: "wrap" as const,
};

const initials = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

const baseOptions = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}));

const states = [
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

const stateItems = states.map((item) => ({
  value: `value:${item}`,
  label: `label:${item}`,
}));

const asArray = (value: SelectV2Value) =>
  (Array.isArray(value) ? value : []) as string[];

export function SelectV2BasicUsage() {
  const [value, setValue] = useState<string>();

  return (
    <ElSelectV2
      value={value}
      options={baseOptions}
      placeholder="Please select"
      style={{ width: 240 }}
      onChange={(next) => setValue(next as string)}
    />
  );
}

export function SelectV2Multiple() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <ElSelectV2
      value={value}
      options={baseOptions}
      placeholder="Please select"
      style={{ width: 240 }}
      multiple
      onChange={(next) => setValue(asArray(next))}
    />
  );
}

export function SelectV2Clearable() {
  const [value1, setValue1] = useState<string[]>([]);
  const [value2, setValue2] = useState<string>();

  return (
    <>
      <ElSelectV2
        value={value1}
        options={baseOptions}
        placeholder="Please select"
        style={{ width: 240, marginRight: 16, verticalAlign: "middle" }}
        multiple
        clearable
        onChange={(next) => setValue1(asArray(next))}
      />
      <ElSelectV2
        value={value2}
        options={baseOptions}
        placeholder="Please select"
        style={{ width: 240, verticalAlign: "middle" }}
        clearable
        onChange={(next) => setValue2(next as string)}
      />
    </>
  );
}

export function SelectV2Filterable() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <ElSelectV2
      value={value}
      options={baseOptions}
      placeholder="Please select"
      style={{ width: 240 }}
      multiple
      filterable
      onChange={(next) => setValue(asArray(next))}
    />
  );
}

export function SelectV2Grouping() {
  const [value, setValue] = useState<string[]>([]);

  const options: SelectV2OptionType[] = Array.from({ length: 10 }).map(
    (_, idx) => {
      const label = idx + 1;
      return {
        value: `Group ${label}`,
        label: `Group ${label}`,
        options: Array.from({ length: 10 }).map((__, childIdx) => ({
          value: `Option ${childIdx + 1 + 10 * label}`,
          label: `${initials[childIdx % 10]}${childIdx + 1 + 10 * label}`,
        })),
      };
    },
  );

  return (
    <ElSelectV2
      value={value}
      options={options}
      placeholder="Please select"
      style={{ width: 240 }}
      multiple
      filterable
      onChange={(next) => setValue(asArray(next))}
    />
  );
}

export function SelectV2PropsDemo() {
  const [value, setValue] = useState<string[]>([]);

  const options = Array.from({ length: 1000 }).map((_, idx) => ({
    id: `Option ${idx + 1}`,
    name: `${initials[idx % 10]}${idx}`,
  }));

  return (
    <ElSelectV2
      value={value}
      options={options}
      props={{ label: "name", value: "id" }}
      placeholder="Please select"
      style={{ width: 240 }}
      filterable
      multiple
      onChange={(next) => setValue(asArray(next))}
    />
  );
}

export function SelectV2Disabled() {
  const [value, setValue] = useState<string[]>([]);

  const options = Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`,
    disabled: idx % 10 === 0,
  }));

  return (
    <>
      <ElSelectV2
        value={value}
        filterable
        options={options}
        placeholder="Please select"
        style={{ width: 240, marginRight: 16, verticalAlign: "middle" }}
        multiple
        onChange={(next) => setValue(asArray(next))}
      />
      <ElSelectV2
        value={value}
        disabled
        filterable
        options={options}
        placeholder="Please select"
        style={{ width: 240, verticalAlign: "middle" }}
        multiple
        onChange={(next) => setValue(asArray(next))}
      />
    </>
  );
}

export function SelectV2Size() {
  const [value, setValue] = useState<string>();

  return (
    <div style={row}>
      <ElSelectV2
        value={value}
        options={baseOptions}
        placeholder="Please select"
        size="large"
        style={{ width: 240 }}
        onChange={(next) => setValue(next as string)}
      />
      <ElSelectV2
        value={value}
        options={baseOptions}
        placeholder="Please select"
        style={{ width: 240 }}
        onChange={(next) => setValue(next as string)}
      />
      <ElSelectV2
        value={value}
        options={baseOptions}
        placeholder="Please select"
        size="small"
        style={{ width: 240 }}
        onChange={(next) => setValue(next as string)}
      />
    </div>
  );
}

export function SelectV2AllowCreate() {
  const [value1, setValue1] = useState<string[]>([]);
  const [value2, setValue2] = useState<string>();
  const [value3, setValue3] = useState<string[]>([]);

  return (
    <div style={{ flex: "auto" }}>
      <div>
        <ElSelectV2
          value={value1}
          options={baseOptions}
          placeholder="Please select"
          style={{ width: 240, marginRight: 16, verticalAlign: "middle" }}
          allowCreate
          defaultFirstOption
          filterable
          multiple
          clearable
          onChange={(next) => setValue1(asArray(next))}
        />
        <ElSelectV2
          value={value2}
          options={baseOptions}
          placeholder="Please select"
          style={{ width: 240, verticalAlign: "middle" }}
          allowCreate
          defaultFirstOption
          filterable
          clearable
          onChange={(next) => setValue2(next as string)}
        />
      </div>
      <div>
        <p style={{ marginTop: 20, marginBottom: 8 }}>
          set reserve-keyword false
        </p>
        <ElSelectV2
          value={value3}
          options={baseOptions}
          placeholder="Please select"
          style={{ width: 240, marginRight: 16, verticalAlign: "middle" }}
          allowCreate
          defaultFirstOption
          filterable
          multiple
          clearable
          reserveKeyword={false}
          onChange={(next) => setValue3(asArray(next))}
        />
      </div>
    </div>
  );
}

export function SelectV2RemoteSearch() {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<typeof stateItems>([]);
  const [loading, setLoading] = useState(false);

  const remoteMethod = (query: string) => {
    if (query !== "") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOptions(
          stateItems.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      }, 200);
    } else {
      setOptions([]);
    }
  };

  return (
    <div style={wrap}>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>default</p>
        <ElSelectV2
          value={value}
          style={{ width: 240 }}
          multiple
          filterable
          remote
          clearable
          options={options}
          loading={loading}
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          onChange={(next) => setValue(asArray(next))}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>use remote-show-suffix</p>
        <ElSelectV2
          value={value}
          style={{ width: 240 }}
          multiple
          filterable
          remote
          remoteShowSuffix
          clearable
          options={options}
          loading={loading}
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          onChange={(next) => setValue(asArray(next))}
        />
      </div>
    </div>
  );
}

export function SelectV2CustomLoading() {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<typeof stateItems>([]);
  const [loading, setLoading] = useState(false);

  const remoteMethod = (query: string) => {
    if (query) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOptions(
          stateItems.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      }, 3000);
    } else {
      setOptions([]);
    }
  };

  const loadingSlot = (
    <ElIcon className="is-loading" size={20}>
      <Loading />
    </ElIcon>
  );

  return (
    <div style={wrap}>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>loading icon1</p>
        <ElSelectV2
          value={value}
          multiple
          filterable
          remote
          reserveKeyword
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          loading={loading}
          options={options}
          style={{ width: 240 }}
          loadingSlot={loadingSlot}
          onChange={(next) => setValue(asArray(next))}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p style={{ marginTop: 0 }}>loading icon2</p>
        <ElSelectV2
          value={value}
          multiple
          filterable
          remote
          reserveKeyword
          placeholder="Please enter a keyword"
          remoteMethod={remoteMethod}
          loading={loading}
          options={options}
          style={{ width: 240 }}
          loadingSlot={loadingSlot}
          onChange={(next) => setValue(asArray(next))}
        />
      </div>
    </div>
  );
}

export function SelectV2CustomHeader() {
  const [value, setValue] = useState<string[]>([]);

  const checkAll = value.length === baseOptions.length;
  const indeterminate = value.length > 0 && !checkAll;

  return (
    <ElSelectV2
      value={value}
      options={baseOptions}
      multiple
      clearable
      collapseTags
      placeholder="Select"
      popperClass="custom-header"
      maxCollapseTags={1}
      style={{ width: 240 }}
      onChange={(next) => setValue(asArray(next))}
      header={
        <ElCheckbox
          checked={checkAll}
          indeterminate={indeterminate}
          onCheckedChange={(checked) =>
            setValue(checked ? baseOptions.map((item) => item.value as string) : [])
          }
        >
          All
        </ElCheckbox>
      }
    />
  );
}

export function SelectV2CustomFooter() {
  const selectRef = useRef<SelectV2Expose>(null);
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState(baseOptions);
  const [isAdding, setIsAdding] = useState(false);
  const [optionName, setOptionName] = useState("");

  const clear = () => {
    setOptionName("");
    setIsAdding(false);
  };

  const onConfirm = () => {
    if (!optionName) return;
    const next = [...options, { label: optionName, value: optionName }];
    setOptions(next);
    clear();
    setTimeout(() => selectRef.current?.scrollTo(next.length - 1), 0);
  };

  return (
    <ElSelectV2
      ref={selectRef}
      value={value}
      options={options}
      placeholder="Select"
      style={{ width: 240 }}
      onChange={(next) => setValue(asArray(next))}
      footer={
        !isAdding ? (
          <ElButton text bg size="small" onClick={() => setIsAdding(true)}>
            Add an option
          </ElButton>
        ) : (
          <div style={{ ...column, gap: 8 }}>
            <ElInput
              value={optionName}
              placeholder="input option name"
              size="small"
              style={{ width: "100%" }}
              onChange={setOptionName}
            />
            <div>
              <ElButton type="primary" size="small" onClick={onConfirm}>
                confirm
              </ElButton>
              <ElButton size="small" onClick={clear}>cancel</ElButton>
            </div>
          </div>
        )
      }
    />
  );
}

export function SelectV2CustomizedOption() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <ElSelectV2
      value={value}
      filterable
      options={baseOptions}
      placeholder="Please select"
      style={{ width: 240 }}
      multiple
      onChange={(next) => setValue(asArray(next))}
    >
      {({ item }) => (
        <>
          <span style={{ marginRight: 8 }}>{String(item.label)}</span>
          <span
            style={{
              color: "var(--el-text-color-secondary)",
              fontSize: 13,
            }}
          >
            {String(item.value)}
          </span>
        </>
      )}
    </ElSelectV2>
  );
}

export function SelectV2CustomTag() {
  const colors = [
    { value: "#E63415", label: "red" },
    { value: "#FF6600", label: "orange" },
    { value: "#FFDE0A", label: "yellow" },
    { value: "#1EC79D", label: "green" },
    { value: "#14CCCC", label: "cyan" },
    { value: "#4167F0", label: "blue" },
    { value: "#6222C9", label: "purple" },
  ];
  const [value, setValue] = useState<string[]>(colors.map((item) => item.value));

  return (
    <ElSelectV2
      value={value}
      multiple
      placeholder="Select"
      options={colors}
      style={{ width: 240 }}
      onChange={(next) => setValue(asArray(next))}
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
    </ElSelectV2>
  );
}

export function SelectV2HideExtraTags() {
  const [value, setValue] = useState<string[]>([]);
  const [value2, setValue2] = useState<string[]>([]);
  const [value3, setValue3] = useState<string[]>([]);

  return (
    <>
      <div style={{ margin: 16 }}>
        <p>use collapse-tags</p>
        <ElSelectV2
          value={value}
          options={baseOptions}
          placeholder="Please select"
          style={{ width: 240 }}
          multiple
          collapseTags
          onChange={(next) => setValue(asArray(next))}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p>use collapse-tags-tooltip</p>
        <ElSelectV2
          value={value2}
          options={baseOptions}
          placeholder="Please select"
          style={{ width: 240 }}
          multiple
          collapseTags
          collapseTagsTooltip
          onChange={(next) => setValue2(asArray(next))}
        />
      </div>
      <div style={{ margin: 16 }}>
        <p>use max-collapse-tags</p>
        <ElSelectV2
          value={value3}
          options={baseOptions}
          placeholder="Please select"
          style={{ width: 240 }}
          multiple
          collapseTags
          collapseTagsTooltip
          maxCollapseTags={3}
          onChange={(next) => setValue3(asArray(next))}
        />
      </div>
    </>
  );
}

export function SelectV2CustomWidth() {
  const [value, setValue] = useState<string>();

  const options = Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}${"-".repeat(Math.ceil(idx / 25))}`,
  }));

  return (
    <div style={row}>
      <ElSelectV2
        value={value}
        options={options}
        placeholder="Please select"
        style={{ width: 240 }}
        fitInputWidth={false}
        onChange={(next) => setValue(next as string)}
      />
      <ElSelectV2
        value={value}
        options={options}
        placeholder="Please select"
        style={{ width: 240 }}
        fitInputWidth
        onChange={(next) => setValue(next as string)}
      />
      <ElSelectV2
        value={value}
        options={options}
        placeholder="Please select"
        style={{ width: 240 }}
        fitInputWidth={440}
        onChange={(next) => setValue(next as string)}
      >
        {({ item }) => <span>{`${String(item.value)}${String(item.label)}`}</span>}
      </ElSelectV2>
    </div>
  );
}

export function SelectV2CustomLabel() {
  const [value1, setValue1] = useState<string>("Option 1");
  const [value2, setValue2] = useState<string[]>(["Option 1"]);

  const label = ({ label: text, value }: { label: unknown; value: unknown }) => (
    <>
      <span>{String(text)}: </span>
      <span style={{ fontWeight: "bold" }}>{String(value)}</span>
    </>
  );

  return (
    <div style={row}>
      <ElSelectV2
        value={value1}
        options={baseOptions}
        placeholder="Select"
        style={{ width: 240 }}
        clearable
        label={label}
        onChange={(next) => setValue1(next as string)}
      />
      <ElSelectV2
        value={value2}
        options={baseOptions}
        placeholder="Select"
        style={{ width: 240 }}
        clearable
        multiple
        label={label}
        onChange={(next) => setValue2(asArray(next))}
      />
    </div>
  );
}

export function SelectV2UseValueKey() {
  const [value, setValue] = useState<Record<string, unknown>>({
    name: "Option 1",
    test: "test 0",
  });

  const options = Array.from({ length: 1000 }).map((_, idx) => ({
    value: {
      name: `Option ${idx + 1}`,
      test: `test ${idx % 3}`,
    },
    label: `${initials[idx % 10]}${idx}`,
  }));

  return (
    <ElSelectV2
      value={value}
      options={options}
      placeholder="Please select"
      valueKey="name"
      style={{ width: 240 }}
      onChange={(next) => setValue(next as Record<string, unknown>)}
    />
  );
}

export function SelectV2EmptyValues() {
  const [value, setValue] = useState<string | null>("");

  const options = [
    { value: "", label: "All" },
    ...baseOptions,
  ];

  return (
    <ElSelectV2
      value={value}
      options={options}
      emptyValues={[null, undefined]}
      valueOnClear={null}
      clearable
      placeholder="Select"
      style={{ width: 240 }}
      onChange={(next) => setValue(next as string | null)}
      onClear={() => message.info(`The clear value is: ${value}`)}
    />
  );
}
