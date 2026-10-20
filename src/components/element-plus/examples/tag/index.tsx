"use client";

import { useEffect, useRef, useState } from "react";
import { ElTag } from "@/components/element-plus/tag";
import { ElCheckTag } from "@/components/element-plus/check-tag";
import { ElButton } from "@/components/element-plus/button";
import { ElInput, type InputExpose } from "@/components/element-plus/input";

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
} as const;

const column = {
  display: "flex",
  flexDirection: "column",
  gap: "1.6rem",
} as const;

export function TagBasic() {
  return (
    <div style={row}>
      <ElTag type="primary">Tag 1</ElTag>
      <ElTag type="success">Tag 2</ElTag>
      <ElTag type="info">Tag 3</ElTag>
      <ElTag type="warning">Tag 4</ElTag>
      <ElTag type="danger">Tag 5</ElTag>
    </div>
  );
}

export function TagClosable() {
  return (
    <div style={row}>
      <ElTag type="primary" closable>Tag 1</ElTag>
      <ElTag type="success" closable>Tag 2</ElTag>
      <ElTag type="info" closable>Tag 3</ElTag>
      <ElTag type="warning" closable>Tag 4</ElTag>
      <ElTag type="danger" closable>Tag 5</ElTag>
    </div>
  );
}

export function TagClosableDynamic() {
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputExpose | null>(null);

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
          + New Tag
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
      <div style={row}>
        <span>Dark</span>
        <ElTag type="primary" effect="dark">Tag 1</ElTag>
        <ElTag type="success" effect="dark">Tag 2</ElTag>
        <ElTag type="info" effect="dark">Tag 3</ElTag>
        <ElTag type="warning" effect="dark">Tag 4</ElTag>
        <ElTag type="danger" effect="dark">Tag 5</ElTag>
      </div>
      <div style={row}>
        <span>Light</span>
        <ElTag type="primary" effect="light">Tag 1</ElTag>
        <ElTag type="success" effect="light">Tag 2</ElTag>
        <ElTag type="info" effect="light">Tag 3</ElTag>
        <ElTag type="warning" effect="light">Tag 4</ElTag>
        <ElTag type="danger" effect="light">Tag 5</ElTag>
      </div>
      <div style={row}>
        <span>Plain</span>
        <ElTag type="primary" effect="plain">Tag 1</ElTag>
        <ElTag type="success" effect="plain">Tag 2</ElTag>
        <ElTag type="info" effect="plain">Tag 3</ElTag>
        <ElTag type="warning" effect="plain">Tag 4</ElTag>
        <ElTag type="danger" effect="plain">Tag 5</ElTag>
      </div>
    </div>
  );
}

export function TagRound() {
  return (
    <div style={column}>
      <div style={row}>
        <ElTag type="primary" effect="dark" round>Tag 1</ElTag>
        <ElTag type="success" effect="dark" round>Tag 2</ElTag>
        <ElTag type="info" effect="dark" round>Tag 3</ElTag>
        <ElTag type="warning" effect="dark" round>Tag 4</ElTag>
        <ElTag type="danger" effect="dark" round>Tag 5</ElTag>
      </div>
      <div style={row}>
        <ElTag type="primary" effect="light" round>Tag 1</ElTag>
        <ElTag type="success" effect="light" round>Tag 2</ElTag>
        <ElTag type="info" effect="light" round>Tag 3</ElTag>
        <ElTag type="warning" effect="light" round>Tag 4</ElTag>
        <ElTag type="danger" effect="light" round>Tag 5</ElTag>
      </div>
      <div style={row}>
        <ElTag type="primary" effect="plain" round>Tag 1</ElTag>
        <ElTag type="success" effect="plain" round>Tag 2</ElTag>
        <ElTag type="info" effect="plain" round>Tag 3</ElTag>
        <ElTag type="warning" effect="plain" round>Tag 4</ElTag>
        <ElTag type="danger" effect="plain" round>Tag 5</ElTag>
      </div>
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
        <ElCheckTag checked>Checked</ElCheckTag>
        <ElCheckTag checked={checked} onCheckedChange={setChecked}>
          Toggle me
        </ElCheckTag>
        <ElCheckTag disabled>Disabled</ElCheckTag>
      </div>
      <div style={row}>
        {(["primary", "success", "info", "warning", "danger"] as const).map(
          (type, index) => (
            <ElCheckTag
              key={type}
              type={type}
              checked={types[type]}
              onCheckedChange={(next) =>
                setTypes((current) => ({ ...current, [type]: next }))
              }
            >
              Tag {index + 1}
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
          Tag 6
        </ElCheckTag>
      </div>
    </div>
  );
}
