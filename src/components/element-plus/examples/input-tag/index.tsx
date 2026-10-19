"use client";

import { useState, type CSSProperties } from "react";
import { ElInputTag } from "@/components/element-plus/input-tag";
import { ElSegmented } from "@/components/element-plus/segmented";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CloseBold, ElementPlus, Search } from "@/components/element-plus/icons";
import type { ComponentSize } from "@/components/element-plus/button/types";
import type { TagEffect, TagType } from "@/components/element-plus/tag";

const column: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "1.2rem",
  width: 320,
};

const row: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1.2rem",
};

export function InputTagBasic() {
  const [input, setInput] = useState<string[]>();
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      placeholder="请输入"
      ariaLabel="输入后请按回车键"
      style={{ width: 320 }}
    />
  );
}

export function InputTagTrigger() {
  const [trigger, setTrigger] = useState<"Enter" | "Space">("Space");
  const [input, setInput] = useState<string[]>();
  return (
    <div style={column}>
      <ElSegmented
        value={trigger}
        onChange={(next) => setTrigger(next as "Enter" | "Space")}
        options={["Enter", "Space"]}
      />
      <ElInputTag
        value={input}
        onChange={setInput}
        trigger={trigger}
        placeholder="请输入"
        style={{ width: 320 }}
      />
    </div>
  );
}

export function InputTagMax() {
  const [input, setInput] = useState<string[]>();
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      max={3}
      placeholder="最多输入 3 个标签"
      style={{ width: 320 }}
    />
  );
}

export function InputTagCollapse() {
  const [input1, setInput1] = useState<string[]>();
  const [input2, setInput2] = useState<string[]>();
  const [input3, setInput3] = useState<string[]>();
  return (
    <div style={column}>
      <p>使用 collapse-tags</p>
      <ElInputTag
        value={input1}
        onChange={setInput1}
        collapseTags
        placeholder="请输入"
        ariaLabel="输入后请按回车键"
        style={{ width: 320 }}
      />
      <p>使用 collapse-tags-tooltip</p>
      <ElInputTag
        value={input2}
        onChange={setInput2}
        collapseTags
        collapseTagsTooltip
        placeholder="请输入"
        ariaLabel="输入后请按回车键"
        style={{ width: 320 }}
      />
      <p>使用 max-collapse-tags</p>
      <ElInputTag
        value={input3}
        onChange={setInput3}
        collapseTags
        collapseTagsTooltip
        maxCollapseTags={3}
        placeholder="请输入"
        ariaLabel="输入后请按回车键"
        style={{ width: 320 }}
      />
    </div>
  );
}

export function InputTagDisabled() {
  const [input, setInput] = useState<string[] | undefined>(["tag1", "tag2", "tag3"]);
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      disabled
      placeholder="请输入"
      style={{ width: 320 }}
    />
  );
}

export function InputTagClearable() {
  const [input, setInput] = useState<string[] | undefined>(["tag1", "tag2", "tag3"]);
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      clearable
      placeholder="请输入"
      style={{ width: 320 }}
    />
  );
}

export function InputTagClearIcon() {
  const [input, setInput] = useState<string[] | undefined>(["custom", "clear", "icon"]);
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      clearable
      clearIcon={<CloseBold />}
      placeholder="自定义清空图标"
      style={{ width: 320 }}
    />
  );
}

export function InputTagDraggable() {
  const [input, setInput] = useState<string[] | undefined>(["tag1", "tag2", "tag3"]);
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      draggable
      placeholder="请输入"
      style={{ width: 320 }}
    />
  );
}

export function InputTagDelimiter() {
  const [input, setInput] = useState<string[] | undefined>([]);
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      draggable
      placeholder="试试用 , 分隔单词"
      delimiter=","
      style={{ width: 320 }}
    />
  );
}

export function InputTagSize() {
  const [input, setInput] = useState<string[]>();
  return (
    <div style={column}>
      {(["large", "default", "small"] as ComponentSize[]).map((size) => (
        <ElInputTag
          key={size}
          value={input}
          onChange={setInput}
          size={size}
          placeholder="请输入"
          style={{ width: 320 }}
        />
      ))}
    </div>
  );
}

export function InputTagCustomTag() {
  const [tagType, setTagType] = useState<TagType>("primary");
  const [tagEffect, setTagEffect] = useState<TagEffect>("plain");
  const [input, setInput] = useState<string[] | undefined>(["tag1", "tag2", "tag3"]);

  return (
    <div style={column}>
      <div style={row}>
        <ElSegmented
          value={tagType}
          onChange={(next) => setTagType(next as TagType)}
          options={["primary", "success", "info", "warning", "danger"]}
        />
        <ElSegmented
          value={tagEffect}
          onChange={(next) => setTagEffect(next as TagEffect)}
          options={["light", "dark", "plain"]}
        />
      </div>
      <ElInputTag
        value={input}
        onChange={setInput}
        tagType={tagType}
        tagEffect={tagEffect}
        placeholder="请输入"
        style={{ width: 320 }}
      >
        {(value) => (
          <div style={row}>
            <ElIcon>
              <ElementPlus />
            </ElIcon>
            <span>{value}</span>
          </div>
        )}
      </ElInputTag>
    </div>
  );
}

export function InputTagPrefixSuffix() {
  const [input, setInput] = useState<string[]>();
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      clearable
      placeholder="请输入"
      style={{ width: 320 }}
      prefix={
        <ElIcon>
          <ElementPlus />
        </ElIcon>
      }
      suffix={
        <ElIcon>
          <Search />
        </ElIcon>
      }
    />
  );
}
