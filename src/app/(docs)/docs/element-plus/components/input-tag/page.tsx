import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  InputTagBasic,
  InputTagClearable,
  InputTagClearIcon,
  InputTagCollapse,
  InputTagCustomTag,
  InputTagDelimiter,
  InputTagDisabled,
  InputTagDraggable,
  InputTagMax,
  InputTagPrefixSuffix,
  InputTagSize,
  InputTagTrigger,
} from "@/components/element-plus/examples/input-tag";

export const metadata: Metadata = { title: "InputTag 标签输入框" };

const SOURCES = {
  basic: `const [input, setInput] = useState<string[]>();

<ElInputTag
  value={input}
  onChange={setInput}
  placeholder="请输入"
  ariaLabel="输入后请按回车键"
/>`,

  trigger: `const [trigger, setTrigger] = useState<"Enter" | "Space">("Space");
const [input, setInput] = useState<string[]>();

<ElSegmented
  value={trigger}
  onChange={(next) => setTrigger(next as "Enter" | "Space")}
  options={["Enter", "Space"]}
/>
<ElInputTag value={input} onChange={setInput} trigger={trigger} placeholder="请输入" />`,

  max: `const [input, setInput] = useState<string[]>();

<ElInputTag value={input} onChange={setInput} max={3} placeholder="最多输入 3 个标签" />`,

  collapse: `const [input1, setInput1] = useState<string[]>();
const [input2, setInput2] = useState<string[]>();
const [input3, setInput3] = useState<string[]>();

<ElInputTag value={input1} onChange={setInput1} collapseTags placeholder="请输入" />
<ElInputTag value={input2} onChange={setInput2} collapseTags collapseTagsTooltip placeholder="请输入" />
<ElInputTag
  value={input3}
  onChange={setInput3}
  collapseTags
  collapseTagsTooltip
  maxCollapseTags={3}
  placeholder="请输入"
/>`,

  disabled: `const [input, setInput] = useState(["tag1", "tag2", "tag3"]);

<ElInputTag value={input} onChange={setInput} disabled placeholder="请输入" />`,

  clearable: `const [input, setInput] = useState(["tag1", "tag2", "tag3"]);

<ElInputTag value={input} onChange={setInput} clearable placeholder="请输入" />`,

  clearIcon: `const [input, setInput] = useState(["custom", "clear", "icon"]);

<ElInputTag
  value={input}
  onChange={setInput}
  clearable
  clearIcon={<CloseBold />}
  placeholder="自定义清空图标"
/>`,

  draggable: `const [input, setInput] = useState(["tag1", "tag2", "tag3"]);

<ElInputTag value={input} onChange={setInput} draggable placeholder="请输入" />`,

  delimiter: `const [input, setInput] = useState<string[]>([]);

<ElInputTag
  value={input}
  onChange={setInput}
  draggable
  placeholder="试试用 , 分隔单词"
  delimiter=","
/>`,

  size: `const [input, setInput] = useState<string[]>();

{(["large", "default", "small"] as ComponentSize[]).map((size) => (
  <ElInputTag key={size} value={input} onChange={setInput} size={size} placeholder="请输入" />
))}`,

  tag: `const [tagType, setTagType] = useState<TagType>("primary");
const [tagEffect, setTagEffect] = useState<TagEffect>("plain");
const [input, setInput] = useState(["tag1", "tag2", "tag3"]);

<ElSegmented value={tagType} onChange={(v) => setTagType(v as TagType)} options={["primary", "success", "info", "warning", "danger"]} />
<ElSegmented value={tagEffect} onChange={(v) => setTagEffect(v as TagEffect)} options={["light", "dark", "plain"]} />
<ElInputTag value={input} onChange={setInput} tagType={tagType} tagEffect={tagEffect} placeholder="请输入">
  {(value) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ElIcon><ElementPlus /></ElIcon>
      <span>{value}</span>
    </div>
  )}
</ElInputTag>`,

  prefixSuffix: `const [input, setInput] = useState<string[]>();

<ElInputTag
  value={input}
  onChange={setInput}
  clearable
  placeholder="请输入"
  prefix={<ElIcon><ElementPlus /></ElIcon>}
  suffix={<ElIcon><Search /></ElIcon>}
/>`,
};

const API_MD = `
## InputTag API

### InputTag Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[array]\`string[]\` | — |
| max | 最多可输入的标签数 | ^[number] | — |
| tag-type | 标签类型 | ^[enum]\`'primary' \\| 'success' \\| 'info' \\| 'warning' \\| 'danger'\` | info |
| tag-effect | 标签主题 | ^[enum]\`'dark' \\| 'light' \\| 'plain'\` | light |
| effect | 折叠提示浮层的主题 | ^[enum]\`'dark' \\| 'light'\` / ^[string] | light |
| trigger | 触发新增标签的按键 | ^[enum]\`'Enter' \\| 'Space'\` | Enter |
| draggable | 标签是否可拖拽 | ^[boolean] | false |
| delimiter | 匹配到分隔符即创建标签 | ^[string] / ^[regex] | — |
| size | 输入框尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| collapse-tags | 是否折叠多余标签 | ^[boolean] | false |
| collapse-tags-tooltip | 折叠时悬停展示全部标签，开启后 max 失效 | ^[boolean] | false |
| max-collapse-tags | 折叠时保留的标签数 | ^[number] | 1 |
| save-on-blur | 失焦时是否保存输入内容为标签 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | false |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| disabled | 是否禁用 | ^[boolean] | false |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| readonly | 原生只读 | ^[boolean] | false |
| autofocus | 原生自动聚焦 | ^[boolean] | false |
| id | 原生 id | ^[string] | — |
| tabindex | 原生 tabindex | ^[string] / ^[number] | 0 |
| maxlength | 原生 maxlength | ^[string] / ^[number] | — |
| minlength | 原生 minlength | ^[string] / ^[number] | — |
| placeholder | 占位文本 | ^[string] | — |
| autocomplete | 原生 autocomplete | ^[string] | off |
| aria-label | 原生 aria-label | ^[string] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### InputTag Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 绑定值变化（对应官方 v-model / change） | ^[Function]\`(value: string[] \\| undefined) => void\` |
| onInput | 输入框文本变化 | ^[Function]\`(value: string) => void\` |
| onAddTag | 新增标签 | ^[Function]\`(value: string \\| string[]) => void\` |
| onRemoveTag | 移除标签 | ^[Function]\`(value: string, index: number) => void\` |
| onDragTag | 拖拽结束改变顺序 | ^[Function]\`(oldIndex: number, newIndex: number, value: string) => void\` |
| onFocus / onBlur | 聚焦 / 失焦 | ^[Function]\`(event: FocusEvent<HTMLInputElement>) => void\` |
| onClear | 点击清空图标 | ^[Function]\`() => void\` |

### InputTag Slots

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| prefix | 输入框前缀内容 | ^[ReactNode] |
| suffix | 输入框后缀内容 | ^[ReactNode] |
| children | 标签内容，传函数时等价官方 tag 作用域插槽 | ^[ReactNode] / ^[Function]\`(value: string, index: number) => ReactNode\` |

### InputTag Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]\`() => void\` |
| blur | 失焦输入框 | ^[Function]\`() => void\` |

`;

export default function InputTagPage() {
  return (
    <>
      <h1>InputTag 标签输入框</h1>
      <p>InputTag 组件允许用户将输入内容添加为标签。</p>

      <Heading level={2}>基础用法</Heading>
      <p>按回车键即可把输入内容添加为标签。</p>
      <DemoBlock source={SOURCES.basic}>
        <InputTagBasic />
      </DemoBlock>

      <Heading level={2}>自定义触发键</Heading>
      <p>
        通过 <code>trigger</code> 指定触发新增标签的按键，默认是 <code>Enter</code>。
      </p>
      <DemoBlock source={SOURCES.trigger}>
        <InputTagTrigger />
      </DemoBlock>

      <Heading level={2}>最多标签数</Heading>
      <p>
        用 <code>max</code> 限制可添加的标签数量。
      </p>
      <DemoBlock source={SOURCES.max}>
        <InputTagMax />
      </DemoBlock>

      <Heading level={2}>折叠标签</Heading>
      <p>
        设置 <code>collapseTags</code> 后多余标签会合并成一段文本；开启{" "}
        <code>collapseTagsTooltip</code> 后悬停该文本可查看全部标签，
        但此时 <code>max</code> 会失效。<code>maxCollapseTags</code> 控制保留的标签数。
      </p>
      <DemoBlock source={SOURCES.collapse}>
        <InputTagCollapse />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 可禁用整个组件。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <InputTagDisabled />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>
        设置 <code>clearable</code> 后会出现清空按钮。
      </p>
      <DemoBlock source={SOURCES.clearable}>
        <InputTagClearable />
      </DemoBlock>

      <Heading level={2}>自定义清空图标</Heading>
      <p>
        通过 <code>clearIcon</code> 自定义清空图标。
      </p>
      <DemoBlock source={SOURCES.clearIcon}>
        <InputTagClearIcon />
      </DemoBlock>

      <Heading level={2}>可拖拽</Heading>
      <p>
        设置 <code>draggable</code> 后标签可拖拽排序。
      </p>
      <DemoBlock source={SOURCES.draggable}>
        <InputTagDraggable />
      </DemoBlock>

      <Heading level={2}>分隔符</Heading>
      <p>
        设置 <code>delimiter</code> 后，输入内容匹配到分隔符即创建标签。
      </p>
      <DemoBlock source={SOURCES.delimiter}>
        <InputTagDelimiter />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        通过 <code>size</code> 改变尺寸，除默认外还有 <code>large</code>、
        <code>small</code>。
      </p>
      <DemoBlock source={SOURCES.size}>
        <InputTagSize />
      </DemoBlock>

      <Heading level={2}>自定义标签</Heading>
      <p>
        通过函数子节点自定义标签内容，等价官方的 <code>tag</code> 作用域插槽。
      </p>
      <DemoBlock source={SOURCES.tag}>
        <InputTagCustomTag />
      </DemoBlock>

      <Heading level={2}>自定义前缀与后缀</Heading>
      <p>
        通过 <code>prefix</code> 与 <code>suffix</code> 自定义输入框前后内容。
      </p>
      <DemoBlock source={SOURCES.prefixSuffix}>
        <InputTagPrefixSuffix />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
