"use client";

import { useRef, useState } from "react";
import { ElAutocomplete } from "@/components/ui/autocomplete";
import type {
  AutocompleteDataItem,
  AutocompleteExpose,
  AutocompleteFetchSuggestionsCallback,
} from "@/components/ui/autocomplete";
import { ElIcon } from "@/components/ui/icon/ElIcon";
import { ElButton } from "@/components/ui/button";
import { Edit } from "@/components/ui/icons";

/*
 * 官方 docs/examples/autocomplete/*.vue 里 .demo-autocomplete / .demo-block /
 * .demo-title 的等价物；这里的演示统一用内联样式表达。
 */

const demoFlex = {
  display: "flex",
  flexWrap: "wrap",
  gap: "2rem",
} as const;

const demoBlock = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
} as const;

const demoTitle = {
  fontSize: "1.4rem",
  color: "var(--el-text-color-secondary)",
  minHeight: "2.5em",
  display: "flex",
  alignItems: "center",
} as const;

/**
 * 注意用 type 而非 interface：interface 没有隐式索引签名，
 * 无法赋给 AutocompleteData（Record<string, unknown>[]）。
 */
type LinkItem = { value: string; link: string };

/** 三条示例共用的数据源，对应官方 loadAll。 */
function loadAll(): LinkItem[] {
  return [
    { value: "vue", link: "https://github.com/vuejs/vue" },
    { value: "element", link: "https://github.com/ElemeFE/element" },
    { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
    { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
    { value: "vuex", link: "https://github.com/vuejs/vuex" },
    { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
    { value: "babel", link: "https://github.com/babel/babel" },
  ];
}

const links = loadAll();

/** 对应官方 createFilter：前缀匹配，忽略大小写。 */
function createFilter(queryString: string) {
  return (item: LinkItem) =>
    item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
}

/** 同步返回建议，对应官方 querySearch。 */
function querySearch(
  queryString: string,
  cb: AutocompleteFetchSuggestionsCallback,
) {
  const results = queryString
    ? links.filter(createFilter(queryString))
    : links;
  cb(results);
}

/** 异步返回建议，对应官方 querySearchAsync。 */
function useQuerySearchAsync(delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (queryString: string, cb: AutocompleteFetchSuggestionsCallback) => {
    const results = queryString
      ? links.filter(createFilter(queryString))
      : links;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => cb(results), delay);
  };
}

const handleSelect = (item: AutocompleteDataItem) => {
  console.log(item);
};

export function AutocompleteBasic() {
  const [state1, setState1] = useState<string | number>("");
  const [state2, setState2] = useState<string | number>("");

  return (
    <div style={demoFlex}>
      <div style={demoBlock}>
        <div style={demoTitle}>list suggestions when activated</div>
        <ElAutocomplete
          value={state1}
          onChange={setState1}
          fetchSuggestions={querySearch}
          clearable
          placeholder="Please Input"
          style={{ width: 240 }}
          onSelect={handleSelect}
        />
      </div>
      <div style={demoBlock}>
        <div style={demoTitle}>list suggestions on input</div>
        <ElAutocomplete
          value={state2}
          onChange={setState2}
          fetchSuggestions={querySearch}
          triggerOnFocus={false}
          clearable
          placeholder="Please Input"
          style={{ width: 240 }}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}

export function AutocompleteTemplate() {
  const [state, setState] = useState<string | number>("");

  return (
    <ElAutocomplete
      value={state}
      onChange={setState}
      fetchSuggestions={querySearch}
      popperClass="my-autocomplete"
      placeholder="Please input"
      style={{ width: 240 }}
      onSelect={handleSelect}
      suffix={
        <ElIcon className="el-input__icon" onClick={() => console.log("click")}>
          <Edit />
        </ElIcon>
      }
      renderItem={(item) => {
        const link = item as LinkItem;
        return (
          <>
            <div className="value">{link.value}</div>
            <span className="link">{link.link}</span>
          </>
        );
      }}
    />
  );
}

export function AutocompleteRemoteSearch() {
  const [state, setState] = useState<string | number>("");
  // 官方示例用 3000 * Math.random() 的随机延迟，这里固定 1000ms 便于观察
  const querySearchAsync = useQuerySearchAsync(1000);

  return (
    <ElAutocomplete
      value={state}
      onChange={setState}
      fetchSuggestions={querySearchAsync}
      placeholder="Please input"
      style={{ width: 240 }}
      onSelect={handleSelect}
    />
  );
}

/** 自定义 loading 内容一：带缺口描边的圆环，靠 el-icon 的旋转动画转起来。 */
function LoadingRing() {
  return (
    <ElIcon className="is-loading">
      <svg viewBox="0 0 50 50" fill="none">
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="var(--el-color-primary)"
          strokeWidth={4}
          strokeDasharray="90 150"
          strokeLinecap="round"
        />
      </svg>
    </ElIcon>
  );
}

/** 自定义 loading 内容二：四点方阵，作为整体旋转。 */
function LoadingDots() {
  return (
    <ElIcon className="is-loading">
      <svg viewBox="0 0 20 20">
        <circle cx="3.375" cy="3.375" r="3.375" fill="var(--el-color-primary)" />
        <circle cx="16.625" cy="3.375" r="3.375" fill="var(--el-color-primary)" />
        <circle cx="3.375" cy="16.625" r="3.375" fill="var(--el-color-primary)" />
        <circle cx="16.625" cy="16.625" r="3.375" fill="var(--el-color-primary)" />
      </svg>
    </ElIcon>
  );
}

export function AutocompleteCustomLoading() {
  const [state1, setState1] = useState<string | number>("");
  const [state2, setState2] = useState<string | number>("");
  // 官方示例用 5000 * Math.random()，这里固定 2000ms
  const querySearchAsync = useQuerySearchAsync(2000);

  return (
    <div style={demoFlex}>
      <div style={demoBlock}>
        <div style={demoTitle}>loading icon1</div>
        <ElAutocomplete
          value={state1}
          onChange={setState1}
          fetchSuggestions={querySearchAsync}
          placeholder="Please input"
          style={{ width: 240 }}
          onSelect={handleSelect}
          loading={<LoadingRing />}
        />
      </div>
      <div style={demoBlock}>
        <div style={demoTitle}>loading icon2</div>
        <ElAutocomplete
          value={state2}
          onChange={setState2}
          fetchSuggestions={querySearchAsync}
          placeholder="Please input"
          style={{ width: 240 }}
          onSelect={handleSelect}
          loading={<LoadingDots />}
        />
      </div>
    </div>
  );
}

export function AutocompleteCustomHeaderFooter() {
  const [headerState, setHeaderState] = useState<string | number>("");
  const [footerState, setFooterState] = useState<string | number>("");
  const footerRef = useRef<AutocompleteExpose>(null);
  const querySearchAsync = useQuerySearchAsync(1000);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, textAlign: "center" }}>
        <p>Custom header content</p>
        <ElAutocomplete
          value={headerState}
          onChange={setHeaderState}
          fetchSuggestions={querySearchAsync}
          placeholder="Please input"
          style={{ width: "50%" }}
          onSelect={handleSelect}
          header="header content"
        />
      </div>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          borderLeft: "1px solid var(--el-border-color)",
        }}
      >
        <p>Custom footer content</p>
        <ElAutocomplete
          ref={footerRef}
          value={footerState}
          onChange={setFooterState}
          fetchSuggestions={querySearchAsync}
          placeholder="Please input"
          style={{ width: "50%" }}
          onSelect={handleSelect}
          footer={
            <ElButton
              link
              size="small"
              onClick={() => {
                setFooterState("");
                footerRef.current?.getData();
              }}
            >
              Clear
            </ElButton>
          }
        />
      </div>
    </div>
  );
}
