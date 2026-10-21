"use client";

import { useState } from "react";
import { ElInput } from "@/components/element-plus/input";
import { ElSelect } from "@/components/element-plus/select";
import type { SelectValue } from "@/components/element-plus/select";
import { ElButton } from "@/components/element-plus/button";
import "./input-demo.module.css";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Calendar, CloseBold, Lock, Search, Unlock } from "@/components/element-plus/generated/icons";

const stack = { display: "flex", flexDirection: "column", gap: "16px" } as const;
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "center",
} as const;
const width240 = { width: 240 } as const;
const spacer = { margin: "20px 0" } as const;

export function InputBasic() {
  const [value, setValue] = useState("");
  return (
    <ElInput
      value={value}
      onChange={setValue}
      style={width240}
      placeholder="请输入"
    />
  );
}

export function InputDisabled() {
  return <ElInput style={width240} disabled placeholder="请输入" />;
}

export function InputClearable() {
  const [value, setValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  return (
    <div style={row}>
      <ElInput
        value={value}
        onChange={setValue}
        style={width240}
        placeholder="请输入"
        clearable
      />
      <ElInput
        value={textareaValue}
        onChange={setTextareaValue}
        style={width240}
        placeholder="请输入"
        type="textarea"
        clearable
      />
    </div>
  );
}

export function InputPassword() {
  const [value, setValue] = useState("");
  return (
    <div style={row}>
      <ElInput
        value={value}
        onChange={setValue}
        style={width240}
        type="password"
        placeholder="请输入密码"
        showPassword
      />
      <ElInput
        value={value}
        onChange={setValue}
        style={width240}
        type="password"
        placeholder="请输入密码"
        showPassword
        passwordIcon={(visible) =>
          visible ? (
            <ElIcon size={16}>
              <Unlock />
            </ElIcon>
          ) : (
            <ElIcon size={16}>
              <Lock />
            </ElIcon>
          )
        }
      />
    </div>
  );
}

export function InputSizes() {
  return (
    <div style={stack}>
      <div style={row}>
        <ElInput style={width240} size="large" placeholder="请输入" />
        <ElInput style={width240} placeholder="请输入" />
        <ElInput style={width240} size="small" placeholder="请输入" />
      </div>
      <div style={row}>
        <ElInput
          style={width240}
          size="large"
          placeholder="请输入"
          suffixIcon={<Search />}
        />
        <ElInput style={width240} placeholder="请输入" suffixIcon={<Search />} />
        <ElInput
          style={width240}
          size="small"
          placeholder="请输入"
          suffixIcon={<Search />}
        />
      </div>
      <div style={row}>
        <ElInput
          style={width240}
          size="large"
          placeholder="请输入"
          prefixIcon={<Search />}
        />
        <ElInput style={width240} placeholder="请输入" prefixIcon={<Search />} />
        <ElInput
          style={width240}
          size="small"
          placeholder="请输入"
          prefixIcon={<Search />}
        />
      </div>
    </div>
  );
}

export function InputWordLimit() {
  const [text, setText] = useState("");
  const [textarea, setTextarea] = useState("");
  return (
    <>
      <ElInput
        value={text}
        onChange={setText}
        style={width240}
        maxlength={10}
        showWordLimit
        placeholder="请输入"
      />
      <ElInput
        value={text}
        onChange={setText}
        style={{ ...width240, marginLeft: 16 }}
        maxlength={10}
        showWordLimit
        wordLimitPosition="outside"
        placeholder="请输入"
      />
      <div style={{ margin: "20px 0" }} />
      <ElInput
        value={textarea}
        onChange={setTextarea}
        style={width240}
        maxlength={30}
        showWordLimit
        placeholder="请输入"
        type="textarea"
      />
      <ElInput
        value={textarea}
        onChange={setTextarea}
        style={{ ...width240, marginLeft: 16 }}
        maxlength={30}
        showWordLimit
        wordLimitPosition="outside"
        placeholder="请输入"
        type="textarea"
      />
    </>
  );
}

export function InputIcons() {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            display: "block",
            marginBottom: 16,
            color: "var(--el-text-color-regular)",
          }}
        >
          使用属性
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <ElInput style={width240} placeholder="选择日期" suffixIcon={<Calendar />} />
          <ElInput style={width240} placeholder="请输入" prefixIcon={<Search />} />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            display: "block",
            marginBottom: 16,
            color: "var(--el-text-color-regular)",
          }}
        >
          使用插槽
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <ElInput
            style={width240}
            placeholder="选择日期"
            suffix={
              <ElIcon className="el-input__icon">
                <Calendar />
              </ElIcon>
            }
          />
          <ElInput
            style={width240}
            placeholder="请输入"
            prefix={
              <ElIcon className="el-input__icon">
                <Search />
              </ElIcon>
            }
          />
        </div>
      </div>
    </div>
  );
}

export function InputTextarea() {
  const [value, setValue] = useState("");
  return (
    <ElInput
      value={value}
      onChange={setValue}
      style={width240}
      rows={2}
      type="textarea"
      placeholder="请输入"
    />
  );
}

export function InputFormatter() {
  const [value, setValue] = useState("");
  return (
    <ElInput
      value={value}
      onChange={setValue}
      style={width240}
      placeholder="请输入"
      formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
    />
  );
}

export function InputAutoSizingTextarea() {
  const [textarea1, setTextarea1] = useState("");
  const [textarea2, setTextarea2] = useState("");
  return (
    <>
      <ElInput
        value={textarea1}
        onChange={setTextarea1}
        style={width240}
        autosize
        type="textarea"
        placeholder="请输入"
      />
      <div style={{ margin: "20px 0" }} />
      <ElInput
        value={textarea2}
        onChange={setTextarea2}
        style={width240}
        autosize={{ minRows: 2, maxRows: 4 }}
        type="textarea"
        placeholder="请输入"
      />
    </>
  );
}

export function InputClearIcon() {
  const [value, setValue] = useState("自定义清除图标");
  const [textareaValue, setTextareaValue] = useState("自定义清除图标");
  return (
    <div style={stack}>
      <ElInput
        value={value}
        onChange={setValue}
        clearable
        clearIcon={<CloseBold />}
        placeholder="自定义清除图标"
      />
      <ElInput
        value={textareaValue}
        onChange={setTextareaValue}
        clearable
        clearIcon={<CloseBold />}
        placeholder="自定义清除图标"
        type="textarea"
      />
    </div>
  );
}

const countGraphemes = (value: string) => Array.from(value).length;

export function InputCountGraphemes() {
  const [text, setText] = useState("😀😁");
  const [textarea, setTextarea] = useState("😀😁");
  return (
    <>
      <ElInput
        value={text}
        onChange={setText}
        maxlength={10}
        showWordLimit
        countGraphemes={countGraphemes}
        placeholder="请输入"
        type="text"
      />
      <div style={spacer} />
      <ElInput
        value={textarea}
        onChange={setTextarea}
        maxlength={20}
        showWordLimit
        countGraphemes={countGraphemes}
        placeholder="请输入"
        type="textarea"
      />
    </>
  );
}

const SELECT_OPTIONS = [
  { value: "1", label: "餐厅" },
  { value: "2", label: "订单号" },
  { value: "3", label: "电话" },
];

export function InputMixedInput() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [select, setSelect] = useState<SelectValue>("");

  return (
    <>
      <div>
        <ElInput
          value={input1}
          onChange={setInput1}
          style={{ maxWidth: 600 }}
          placeholder="请输入"
          prepend="Http://"
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <ElInput
          value={input2}
          onChange={setInput2}
          style={{ maxWidth: 600 }}
          placeholder="请输入"
          append=".com"
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <ElInput
          className="input-with-select"
          value={input3}
          onChange={setInput3}
          style={{ maxWidth: 600 }}
          placeholder="请输入"
          prepend={
            <ElSelect
              value={select}
              onChange={setSelect}
              options={SELECT_OPTIONS}
              placeholder="选择"
              style={{ width: 115 }}
            />
          }
          append={<ElButton icon={<Search />} />}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <ElInput
          className="input-with-select"
          value={input4}
          onChange={setInput4}
          style={{ maxWidth: 600 }}
          placeholder="请输入"
          prepend={<ElButton icon={<Search />} />}
          append={
            <ElSelect
              value={select}
              onChange={setSelect}
              options={SELECT_OPTIONS}
              placeholder="选择"
              style={{ width: 115 }}
            />
          }
        />
      </div>
    </>
  );
}

export const inputRows = { stack, row };
