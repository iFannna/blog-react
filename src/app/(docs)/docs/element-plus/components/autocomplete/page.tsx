import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  AutocompleteBasic,
  AutocompleteTemplate,
  AutocompleteRemoteSearch,
  AutocompleteCustomLoading,
  AutocompleteCustomHeaderFooter,
} from "@/components/element-plus/examples/autocomplete";

export const metadata: Metadata = { title: "Autocomplete 自动补全" };

const SOURCES = {
  basic: `const [state, setState] = useState("");

const querySearch = (queryString: string, cb: (data: LinkItem[]) => void) => {
  const results = queryString
    ? links.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    : links;
  cb(results);
};

<ElAutocomplete
  value={state}
  onChange={setState}
  fetchSuggestions={querySearch}
  clearable
  placeholder="Please Input"
  onSelect={(item) => console.log(item)}
/>`,

  template: `const [state, setState] = useState("");

<ElAutocomplete
  value={state}
  onChange={setState}
  fetchSuggestions={querySearch}
  popperClass="my-autocomplete"
  placeholder="Please input"
  onSelect={(item) => console.log(item)}
  suffix={<ElIcon className="el-input__icon" onClick={handleIconClick}><Edit /></ElIcon>}
  renderItem={(item) => (
    <>
      <div className="value">{item.value}</div>
      <span className="link">{item.link}</span>
    </>
  )}
/>`,

  remoteSearch: `const [state, setState] = useState("");

const querySearchAsync = (queryString: string, cb: (data: LinkItem[]) => void) => {
  const results = queryString
    ? links.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    : links;
  setTimeout(() => cb(results), 3000 * Math.random());
};

<ElAutocomplete
  value={state}
  onChange={setState}
  fetchSuggestions={querySearchAsync}
  placeholder="Please input"
  onSelect={(item) => console.log(item)}
/>`,

  customLoading: `<ElAutocomplete fetchSuggestions={querySearchAsync} loading={<CustomLoading />} />

// loading 插槽可换成任意节点
<ElAutocomplete fetchSuggestions={querySearchAsync} loading={<LoadingDots />} />`,

  customHeaderFooter: `<ElAutocomplete fetchSuggestions={querySearchAsync} header="header content" />

<ElAutocomplete
  ref={footerRef}
  fetchSuggestions={querySearchAsync}
  footer={
    <ElButton link size="small" onClick={handleClear}>Clear</ElButton>
  }
/>`,
};

const API_MD = `
## Autocomplete API

### Autocomplete Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[string] / ^[number] | '' |
| placeholder | 占位文本 | ^[string] | — |
| clearable | 是否可清空 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| read-only | 原生 readonly | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| name | 同原生 input 的 name | ^[string] | — |
| aria-label | 原生 aria-label | ^[string] | — |
| value-key | 显示与回填用的字段名 | ^[string] | value |
| debounce | 输入防抖延迟（毫秒） | ^[number] | 300 |
| placement | 下拉方位 | ^[enum]\`'top' \\| 'top-start' \\| 'top-end' \\| 'bottom' \\| 'bottom-start' \\| 'bottom-end'\` | bottom-start |
| fetch-suggestions | 拉取建议，返回数组或调用 cb | ^[array] / ^[Function]\`(queryString, callback) => void\` | — |
| trigger-on-focus | 聚焦时是否拉取建议 | ^[boolean] | true |
| select-when-unmatched | 无匹配时回车是否派发 select | ^[boolean] | false |
| hide-loading | 远程搜索是否隐藏 loading 图标 | ^[boolean] | false |
| popper-class | 下拉附加类名 | ^[string] | '' |
| popper-style | 下拉附加样式 | ^[string] / ^[object] | — |
| popper-options | popper.js 配置 | ^[object] | {} |
| show-arrow | 下拉是否显示箭头 | ^[boolean] | true |
| teleported | 下拉是否挂在 body 上 | ^[boolean] | true |
| append-to | 下拉的挂载目标（选择器或元素） | ^[string] / ^[HTMLElement] | — |
| highlight-first-item | 是否默认高亮第一条 | ^[boolean] | false |
| fit-input-width | 下拉宽度是否与输入框一致 | ^[boolean] | false |
| loop-navigation | 键盘导航是否回绕 | ^[boolean] | true |
| prefix / suffix / prepend / append | Input 前后缀内容 | ^[ReactNode] | — |

### Autocomplete Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 输入值变化 | ^[Function]\`(value: string \\| number) => void\` |
| onValueChange | 失焦或回车时触发 | ^[Function]\`(value: string \\| number) => void\` |
| onSelect | 点击某条建议 | ^[Function]\`(item: Record<string, unknown>) => void\` |
| onFocus | 输入框聚焦 | ^[Function]\`(event: FocusEvent) => void\` |
| onBlur | 输入框失焦 | ^[Function]\`(event: FocusEvent) => void\` |
| onClear | 点击清空图标 | ^[Function]\`() => void\` |

### Autocomplete Slots

| 插槽名 | 说明 | React 对应 |
| --- | --- | --- |
| default | 自定义建议项 | \`renderItem(item)\` |
| header | 下拉顶部内容 | \`header\` |
| footer | 下拉底部内容 | \`footer\` |
| loading | 覆盖加载内容 | \`loading\` |
| prefix / suffix / prepend / append | Input 前后缀 | 同名 prop |

### Autocomplete Exposes

通过 \`ref\` 拿到实例，暴露 \`focus\` / \`blur\` / \`close\` / \`handleSelect\` /
\`handleKeyEnter\` / \`highlight\` / \`getData\`，以及只读的 \`activated\`、
\`loading\`、\`highlightedIndex\`、\`suggestions\`（官方是 Ref，这里用 getter 暴露当前值）。
官方 \`inputRef\` / \`popperRef\` 对应为 \`input\`（原生 input 元素）与 \`popper\`（浮层容器元素）。
`;

export default function AutocompletePage() {
  return (
    <>
      <h1>自动补全输入框</h1>
      <p>根据输入内容提供对应的输入建议。</p>

      <Heading level={2}>基础用法</Heading>
      <p>Autocomplete 组件提供输入建议。</p>
      <p>
        <code>fetch-suggestions</code> 属性是返回建议输入的方法。在此示例中，{" "}
        <code>querySearch(queryString, cb)</code> 方法通过 <code>cb(data)</code>{" "}
        给 Autocomplete 组件返回建议。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <AutocompleteBasic />
      </DemoBlock>

      <Heading level={2}>自定义模板</Heading>
      <p>自定义如何显示输入建议。</p>
      <p>
        使用 <code>scoped slot</code> 自定义输入建议。在这个范围中，你可以使用{" "}
        <code>item</code> 键来访问当前输入建议对象。
      </p>
      <DemoBlock source={SOURCES.template}>
        <AutocompleteTemplate />
      </DemoBlock>

      <Heading level={2}>远程搜索</Heading>
      <p>从服务端搜索数据。</p>
      <DemoBlock source={SOURCES.remoteSearch}>
        <AutocompleteRemoteSearch />
      </DemoBlock>

      <Heading level={2} id="自定义加载">
        自定义加载 <span className="docs-version-tag">2.5.0</span>
      </Heading>
      <p>修改加载区域内容</p>
      <DemoBlock source={SOURCES.customLoading}>
        <AutocompleteCustomLoading />
      </DemoBlock>

      <Heading level={2} id="自定义头部与底部">
        自定义头部与底部 <span className="docs-version-tag">2.10.6</span>
      </Heading>
      <p>你可以通过插槽来自定义下拉菜单的头部和底部。</p>
      <p>使用插槽自定义内容。</p>
      <DemoBlock source={SOURCES.customHeaderFooter}>
        <AutocompleteCustomHeaderFooter />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
