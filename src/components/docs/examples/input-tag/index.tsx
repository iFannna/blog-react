"use client";

import { useState, type CSSProperties } from "react";
import { ElInputTag } from "@/components/element-plus/input-tag";
import { ElSegmented } from "@/components/element-plus/segmented";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CloseBold, ElementPlus, Search } from "@/components/element-plus/generated/icons";
import type { ComponentSize } from "@/components/element-plus/button/types";
import type { TagEffect, TagType } from "@/components/element-plus/tag";

const iconRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const marginRight20: CSSProperties = { marginRight: 20 };

export function InputTagBasic() {
  const [input, setInput] = useState<string[]>();
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      placeholder="Please input"
      ariaLabel="Please click the Enter key after input"
    />
  );
}

export function InputTagTrigger() {
  const [trigger, setTrigger] = useState<"Enter" | "Space">("Space");
  const [input, setInput] = useState<string[]>();
  return (
    <>
      <div>
        <ElSegmented
          value={trigger}
          onChange={(next) => setTrigger(next as "Enter" | "Space")}
          options={["Enter", "Space"]}
        />
      </div>
      <br />
      <ElInputTag
        value={input}
        onChange={setInput}
        trigger={trigger}
        placeholder="Please input"
      />
    </>
  );
}

export function InputTagMax() {
  const [input, setInput] = useState<string[]>();
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      max={3}
      placeholder="enter up to 3 tags"
    />
  );
}

export function InputTagCollapse() {
  const [input1, setInput1] = useState<string[]>();
  const [input2, setInput2] = useState<string[]>();
  const [input3, setInput3] = useState<string[]>();
  return (
    <div style={{ margin: 16 }}>
      <p>use collapse-tags</p>
      <ElInputTag
        value={input1}
        onChange={setInput1}
        collapseTags
        placeholder="Please input"
        ariaLabel="Please click the Enter key after input"
      />
      <p>use collapse-tags-tooltip</p>
      <ElInputTag
        value={input2}
        onChange={setInput2}
        collapseTags
        collapseTagsTooltip
        placeholder="Please input"
        ariaLabel="Please click the Enter key after input"
      />
      <p>use max-collapse-tags</p>
      <ElInputTag
        value={input3}
        onChange={setInput3}
        collapseTags
        collapseTagsTooltip
        maxCollapseTags={3}
        placeholder="Please input"
        ariaLabel="Please click the Enter key after input"
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
      placeholder="Please input"
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
      placeholder="Please input"
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
      placeholder="Custom clear icon"
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
      placeholder="Please input"
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
      placeholder="Try to separate words with ,"
      delimiter=","
    />
  );
}

export function InputTagSize() {
  const [input, setInput] = useState<string[]>();
  return (
    <>
      <ElInputTag
        value={input}
        onChange={setInput}
        size="large"
        placeholder="Please input"
      />
      <br />
      <ElInputTag value={input} onChange={setInput} placeholder="Please input" />
      <br />
      <ElInputTag
        value={input}
        onChange={setInput}
        size={"small" as ComponentSize}
        placeholder="Please input"
      />
    </>
  );
}

export function InputTagCustomTag() {
  const [tagType, setTagType] = useState<TagType>("primary");
  const [tagEffect, setTagEffect] = useState<TagEffect>("plain");
  const [input, setInput] = useState<string[] | undefined>(["tag1", "tag2", "tag3"]);

  return (
    <>
      <div>
        <ElSegmented
          value={tagType}
          onChange={(next) => setTagType(next as TagType)}
          options={["primary", "success", "info", "warning", "danger"]}
          style={marginRight20}
        />
        <ElSegmented
          value={tagEffect}
          onChange={(next) => setTagEffect(next as TagEffect)}
          options={["light", "dark", "plain"]}
        />
      </div>
      <br />
      <ElInputTag
        value={input}
        onChange={setInput}
        tagType={tagType}
        tagEffect={tagEffect}
        placeholder="Please input"
      >
        {(value) => (
          <div style={iconRow}>
            <ElIcon style={{ marginRight: 4 }}>
              <ElementPlus />
            </ElIcon>
            <span>{value}</span>
          </div>
        )}
      </ElInputTag>
    </>
  );
}

export function InputTagPrefixSuffix() {
  const [input, setInput] = useState<string[]>();
  return (
    <ElInputTag
      value={input}
      onChange={setInput}
      clearable
      placeholder="Please input"
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
