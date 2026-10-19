"use client";

import { useEffect, useRef, useState } from "react";
import { ElMention } from "@/components/element-plus/mention";
import type { MentionOption } from "@/components/element-plus/mention";
import { ElAvatar } from "@/components/element-plus/avatar";
import { ElDivider } from "@/components/element-plus/divider";
import { ElForm, ElFormItem } from "@/components/element-plus/form";
import type { FormExpose, FormRules } from "@/components/element-plus/form";
import { ElButton } from "@/components/element-plus/button";

const mentionStyle = { width: 320 };

/** 官方示例里 label 插槽是一个 flex 行：头像 + 6px 左间距的文本。 */
const labelRowStyle = { display: "flex", alignItems: "center" } as const;
const labelTextStyle = { marginLeft: 6 } as const;

const BASIC_OPTIONS: MentionOption[] = [
  { label: "Fuphoenixes", value: "Fuphoenixes" },
  { label: "kooriookami", value: "kooriookami" },
  { label: "Jeremy", value: "Jeremy" },
  { label: "btea", value: "btea" },
];

const MOCK_DATA: Record<string, string[]> = {
  "@": ["Fuphoenixes", "kooriookami", "Jeremy", "btea"],
  "#": ["1.0", "2.0", "3.0"],
};

export function MentionBasic() {
  const [value, setValue] = useState("@");

  return (
    <ElMention
      value={value}
      onChange={setValue}
      options={BASIC_OPTIONS}
      style={mentionStyle}
      placeholder="Please input"
    />
  );
}

export function MentionProps() {
  const [value, setValue] = useState("@");

  const options: MentionOption[] = [
    { name: "Fuphoenixes", id: "Fuphoenixes", unable: true },
    { name: "kooriookami", id: "kooriookami" },
    { name: "Jeremy", id: "Jeremy", unable: true },
    { name: "btea", id: "btea" },
  ];

  return (
    <ElMention
      value={value}
      onChange={setValue}
      options={options}
      props={{ label: "name", value: "id", disabled: "unable" }}
      style={mentionStyle}
      placeholder="Please input"
    />
  );
}

export function MentionTextarea() {
  const [value, setValue] = useState("");

  return (
    <ElMention
      value={value}
      onChange={setValue}
      type="textarea"
      options={BASIC_OPTIONS}
      style={mentionStyle}
      placeholder="Please input"
    />
  );
}

export function MentionLabel() {
  const [value, setValue] = useState("");

  const options: MentionOption[] = [
    { value: "Fuphoenixes", avatar: "https://avatars.githubusercontent.com/u/27912232" },
    { value: "kooriookami", avatar: "https://avatars.githubusercontent.com/u/38392315" },
    { value: "Jeremy", avatar: "https://avatars.githubusercontent.com/u/15975785" },
    { value: "btea", avatar: "https://avatars.githubusercontent.com/u/24516654" },
  ];

  return (
    <ElMention
      value={value}
      onChange={setValue}
      options={options}
      style={mentionStyle}
      placeholder="Please input"
      labelSlot={({ item }) => (
        <div style={labelRowStyle}>
          <ElAvatar size={24} src={item.avatar as string} />
          <span style={labelTextStyle}>{item.value}</span>
        </div>
      )}
    />
  );
}

export function MentionLoading() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<MentionOption[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 卸载时清掉未完成的定时器，与官方 onBeforeUnmount 一致
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSearch = (pattern: string) => {
    clearTimeout(timerRef.current);

    setLoading(true);
    timerRef.current = setTimeout(() => {
      setOptions(
        ["Fuphoenixes", "kooriookami", "Jeremy", "btea"].map((item) => ({
          label: pattern + item,
          value: pattern + item,
        })),
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <ElMention
      value={value}
      onChange={setValue}
      options={options}
      loading={loading}
      onSearch={handleSearch}
      style={mentionStyle}
      placeholder="Please input"
    />
  );
}

export function MentionPrefix() {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<MentionOption[]>([]);

  const handleSearch = (_pattern: string, prefix: string) => {
    setOptions((MOCK_DATA[prefix] || []).map((item) => ({ value: item })));
  };

  return (
    <ElMention
      value={value}
      onChange={setValue}
      options={options}
      prefix={["@", "#"]}
      onSearch={handleSearch}
      style={mentionStyle}
      placeholder="input @ to mention people, # to mention tag"
    />
  );
}

export function MentionWhole() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [options2, setOptions2] = useState<MentionOption[]>([]);

  const options1: MentionOption[] = (MOCK_DATA["@"] || []).map((item) => ({
    value: item,
  }));

  const handleSearch = (_pattern: string, prefix: string) => {
    setOptions2((MOCK_DATA[prefix] || []).map((item) => ({ value: item })));
  };

  const checkIsWhole = (pattern: string, prefix: string) =>
    (MOCK_DATA[prefix] || []).includes(pattern);

  return (
    <div>
      <ElMention
        value={value1}
        onChange={setValue1}
        whole
        options={options1}
        style={mentionStyle}
        placeholder="Please input"
      />
      <ElDivider />
      <ElMention
        value={value2}
        onChange={setValue2}
        options={options2}
        prefix={["@", "#"]}
        whole
        checkIsWhole={checkIsWhole}
        onSearch={handleSearch}
        style={mentionStyle}
        placeholder="input @ to mention people, # to mention tag"
      />
    </div>
  );
}

const formStyle = { maxWidth: 600 };
const resultStyle = { color: "var(--el-color-info)" } as const;

const RULES: FormRules = {
  name: [{ required: true, message: "Please input name", trigger: "blur" }],
  desc: [{ required: true, message: "Please input desc", trigger: "blur" }],
};

export function MentionForm() {
  const formRef = useRef<FormExpose>(null);
  const [form, setForm] = useState({ name: "", desc: "" });
  const [result, setResult] = useState("");

  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  const submit = async () => {
    try {
      const ok = await formRef.current!.validate();
      setResult(ok ? "submit!" : "not valid");
    } catch {
      setResult("error submit!");
    }
  };

  return (
    <ElForm
      ref={formRef}
      model={form}
      rules={RULES}
      style={formStyle}
      onModelChange={(next) => setForm(next as typeof form)}
    >
      <ElFormItem label="name" prop="name">
        <ElMention
          value={form.name}
          onChange={(v) => patch({ name: v })}
          options={BASIC_OPTIONS}
        />
      </ElFormItem>
      <ElFormItem label="desc" prop="desc">
        <ElMention
          value={form.desc}
          onChange={(v) => patch({ desc: v })}
          type="textarea"
          options={BASIC_OPTIONS}
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" onClick={submit}>
          Submit
        </ElButton>
        <ElButton onClick={() => formRef.current?.resetFields()}>Reset</ElButton>
      </ElFormItem>
      {result && <p style={resultStyle}>{result}</p>}
    </ElForm>
  );
}
