"use client";

import { useEffect, useRef, useState } from "react";
import { ElTag } from "@/components/ui/tag";
import { ElCheckTag } from "@/components/ui/check-tag";
import { ElButton } from "@/components/ui/button";
import { ElInput, type InputExpose } from "@/components/ui/input";

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
  alignItems: "center",
} as const;

const column = {
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
} as const;

const ITEMS = [
  { type: "primary", label: "Tag 1" },
  { type: "success", label: "Tag 2" },
  { type: "info", label: "Tag 3" },
  { type: "warning", label: "Tag 4" },
  { type: "danger", label: "Tag 5" },
] as const;

const EFFECTS = [
  { effect: "dark", label: "Dark" },
  { effect: "light", label: "Light" },
  { effect: "plain", label: "Plain" },
] as const;

export function TagBasic() {
  return (
    <div style={row}>
      {ITEMS.map((item) => (
        <ElTag key={item.label} type={item.type}>
          {item.label}
        </ElTag>
      ))}
    </div>
  );
}

export function TagClosable() {
  return (
    <div style={row}>
      {ITEMS.map((item) => (
        <ElTag key={item.label} type={item.type} closable>
          {item.label}
        </ElTag>
      ))}
    </div>
  );
}

export function TagClosableDynamic() {
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputExpose | null>(null);

  // 对应官方 nextTick 后聚焦输入框
  useEffect(() => {
    if (inputVisible) inputRef.current?.focus();
  }, [inputVisible]);

  const handleConfirm = () => {
    if (inputValue) {
      setTags((current) => [...current, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <div style={row}>
      {tags.map((tag) => (
        <ElTag
          key={tag}
          closable
          disableTransitions={false}
          onClose={() => setTags((current) => current.filter((item) => item !== tag))}
        >
          {tag}
        </ElTag>
      ))}
      {inputVisible ? (
        <ElInput
          ref={inputRef}
          value={inputValue}
          size="small"
          style={{ width: "10rem" }}
          onChange={(value) => setInputValue(value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleConfirm();
          }}
          onBlur={handleConfirm}
        />
      ) : (
        <ElButton size="small" onClick={() => setInputVisible(true)}>
          + 新标签
        </ElButton>
      )}
    </div>
  );
}

export function TagSizes() {
  return (
    <div style={row}>
      <ElTag size="large">Large</ElTag>
      <ElTag>Default</ElTag>
      <ElTag size="small">Small</ElTag>
    </div>
  );
}

export function TagEffect() {
  return (
    <div style={column}>
      {EFFECTS.map(({ effect, label }) => (
        <div style={row} key={effect}>
          <span>{label}</span>
          {ITEMS.map((item) => (
            <ElTag key={item.label} type={item.type} effect={effect}>
              {item.label}
            </ElTag>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TagRound() {
  return (
    <div style={column}>
      {EFFECTS.map(({ effect }) => (
        <div style={row} key={effect}>
          {ITEMS.map((item) => (
            <ElTag key={item.label} type={item.type} effect={effect} round>
              {item.label}
            </ElTag>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TagCheckable() {
  const [checked, setChecked] = useState(false);
  const [types, setTypes] = useState({
    primary: true,
    success: true,
    info: true,
    warning: true,
    danger: true,
    disabledSuccess: true,
  });

  return (
    <div style={column}>
      <div style={row}>
        <ElCheckTag checked>已选中</ElCheckTag>
        <ElCheckTag checked={checked} onCheckedChange={setChecked}>
          点我切换
        </ElCheckTag>
        <ElCheckTag disabled>禁用</ElCheckTag>
      </div>
      <div style={row}>
        {(["primary", "success", "info", "warning", "danger"] as const).map(
          (type) => (
            <ElCheckTag
              key={type}
              type={type}
              checked={types[type]}
              onCheckedChange={(next) =>
                setTypes((current) => ({ ...current, [type]: next }))
              }
            >
              Tag
            </ElCheckTag>
          ),
        )}
        <ElCheckTag
          type="success"
          disabled
          checked={types.disabledSuccess}
          onCheckedChange={(next) =>
            setTypes((current) => ({ ...current, disabledSuccess: next }))
          }
        >
          禁用标签
        </ElCheckTag>
      </div>
    </div>
  );
}
