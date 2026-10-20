import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TagBasic,
  TagCheckable,
  TagClosable,
  TagClosableDynamic,
  TagEffect,
  TagRound,
  TagSizes,
} from "@/components/element-plus/examples/tag";

export const metadata: Metadata = {
  title: "Tag 标签",
};

const SOURCES = {
  basic: `<ElTag type="primary">Tag 1</ElTag>
<ElTag type="success">Tag 2</ElTag>
<ElTag type="info">Tag 3</ElTag>
<ElTag type="warning">Tag 4</ElTag>
<ElTag type="danger">Tag 5</ElTag>`,

  closable: `<ElTag type="primary" closable>Tag 1</ElTag>
<ElTag type="success" closable>Tag 2</ElTag>
<ElTag type="info" closable>Tag 3</ElTag>
<ElTag type="warning" closable>Tag 4</ElTag>
<ElTag type="danger" closable>Tag 5</ElTag>`,

  dynamic: `const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
const [inputVisible, setInputVisible] = useState(false);
const [inputValue, setInputValue] = useState("");

const handleConfirm = () => {
  if (inputValue) setTags((current) => [...current, inputValue]);
  setInputVisible(false);
  setInputValue("");
};

{tags.map((tag) => (
  <ElTag
    key={tag}
    closable
    onClose={() => setTags((current) => current.filter((item) => item !== tag))}
  >
    {tag}
  </ElTag>
))}
{inputVisible ? (
  <ElInput
    value={inputValue}
    size="small"
    onChange={setInputValue}
    onKeyDown={(event) => event.key === "Enter" && handleConfirm()}
    onBlur={handleConfirm}
  />
) : (
  <ElButton size="small" onClick={() => setInputVisible(true)}>+ 新标签</ElButton>
)}`,

  sizes: `<ElTag size="large">Large</ElTag>
<ElTag>Default</ElTag>
<ElTag size="small">Small</ElTag>`,

  effect: `<div>
  <span>Dark</span>
  <ElTag type="primary" effect="dark">Tag 1</ElTag>
  <ElTag type="success" effect="dark">Tag 2</ElTag>
  <ElTag type="info" effect="dark">Tag 3</ElTag>
  <ElTag type="warning" effect="dark">Tag 4</ElTag>
  <ElTag type="danger" effect="dark">Tag 5</ElTag>
</div>
<div>
  <span>Light</span>
  <ElTag type="primary" effect="light">Tag 1</ElTag>
  <ElTag type="success" effect="light">Tag 2</ElTag>
  <ElTag type="info" effect="light">Tag 3</ElTag>
  <ElTag type="warning" effect="light">Tag 4</ElTag>
  <ElTag type="danger" effect="light">Tag 5</ElTag>
</div>
<div>
  <span>Plain</span>
  <ElTag type="primary" effect="plain">Tag 1</ElTag>
  <ElTag type="success" effect="plain">Tag 2</ElTag>
  <ElTag type="info" effect="plain">Tag 3</ElTag>
  <ElTag type="warning" effect="plain">Tag 4</ElTag>
  <ElTag type="danger" effect="plain">Tag 5</ElTag>
</div>`,

  round: `<div>
  <ElTag type="primary" effect="dark" round>Tag 1</ElTag>
  <ElTag type="success" effect="dark" round>Tag 2</ElTag>
  <ElTag type="info" effect="dark" round>Tag 3</ElTag>
  <ElTag type="warning" effect="dark" round>Tag 4</ElTag>
  <ElTag type="danger" effect="dark" round>Tag 5</ElTag>
</div>
<div>
  <ElTag type="primary" effect="light" round>Tag 1</ElTag>
  <ElTag type="success" effect="light" round>Tag 2</ElTag>
  <ElTag type="info" effect="light" round>Tag 3</ElTag>
  <ElTag type="warning" effect="light" round>Tag 4</ElTag>
  <ElTag type="danger" effect="light" round>Tag 5</ElTag>
</div>
<div>
  <ElTag type="primary" effect="plain" round>Tag 1</ElTag>
  <ElTag type="success" effect="plain" round>Tag 2</ElTag>
  <ElTag type="info" effect="plain" round>Tag 3</ElTag>
  <ElTag type="warning" effect="plain" round>Tag 4</ElTag>
  <ElTag type="danger" effect="plain" round>Tag 5</ElTag>
</div>`,

  checkable: `<ElCheckTag checked>已选中</ElCheckTag>
<ElCheckTag checked={checked} onCheckedChange={setChecked}>
  点我切换
</ElCheckTag>
<ElCheckTag disabled>禁用</ElCheckTag>`,
};

const API_MD = `
## Tag API

### Tag Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 主题类型 | ^[enum]\`'primary' \\| 'success' \\| 'info' \\| 'warning' \\| 'danger'\` | primary |
| closable | 是否可关闭 | ^[boolean] | false |
| disable-transitions | 是否禁用关闭动画 | ^[boolean] | false |
| hit | 是否高亮边框 | ^[boolean] | false |
| color | 自定义背景色 | ^[string] | — |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| effect | 主题 | ^[enum]\`'dark' \\| 'light' \\| 'plain'\` | light |
| round | 是否圆角 | ^[boolean] | false |
| close-label | 关闭按钮的无障碍标签 | ^[string] | 取 locale 的 el.tag.close |

### Tag Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClose | 关闭时触发 | ^[Function]\`(event: MouseEvent) => void\` |
| onClick | 点击时触发 | ^[Function]\`(event: MouseEvent) => void\` |

### Tag Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 标签内容 | \`children\` |

`;

export default function TagPage() {
  return (
    <>
      <h1>Tag 标签</h1>
      <p>用于标记和选择。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        由 <code>type</code> 属性来选择 tag 的类型。也可以通过{" "}
        <code>color</code> 属性来自定义背景色。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TagBasic />
      </DemoBlock>

      <Heading level={2}>可移除标签</Heading>
      <p>
        设置 <code>closable</code> 属性可以定义一个标签是否可移除。它接受一个{" "}
        <code>Boolean</code>。默认的标签移除时会附带渐变动画。如果不想使用，可以设置{" "}
        <code>disable-transitions</code> 属性，它接受一个 <code>Boolean</code>，<code>true</code> 为关闭。当 Tag 被移除时会触发 <code>close</code> 事件。
      </p>
      <DemoBlock source={SOURCES.closable}>
        <TagClosable />
      </DemoBlock>

      <Heading level={2}>动态编辑标签</Heading>
      <p>
        动态编辑标签可以通过点击标签关闭按钮后触发的 <code>close</code> 事件来实现。
      </p>
      <DemoBlock source={SOURCES.dynamic}>
        <TagClosableDynamic />
      </DemoBlock>

      <Heading level={2}>不同尺寸</Heading>
      <p>
        Tag 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。
      </p>
      <p>
        使用 <code>size</code> 属性来设置额外尺寸, 可选值包括 <code>large</code>,{" "}
        <code>default</code> 或 <code>small</code>.
      </p>
      <DemoBlock source={SOURCES.sizes}>
        <TagSizes />
      </DemoBlock>

      <Heading level={2}>主题</Heading>
      <p>
        Tag 组件提供了三个不同的主题：<code>dark</code>、<code>light</code> 和{" "}
        <code>plain</code>。
      </p>
      <p>
        通过设置 <code>effect</code> 属性来改变主题，默认为 <code>light</code>。
      </p>
      <DemoBlock source={SOURCES.effect}>
        <TagEffect />
      </DemoBlock>

      <Heading level={2}>圆角标签</Heading>
      <p>Tag 可以像按钮组件一样变为圆角。</p>
      <DemoBlock source={SOURCES.round}>
        <TagRound />
      </DemoBlock>

      <Heading level={2}>可选中的标签</Heading>
      <p>
        有时候因为业务需求，我们可能会需要用到类似复选框的标签，但是<strong>按钮式的复选框</strong>的样式又不满足需求，此时我们就可以用到{" "}
        <code>check-tag</code>组件。您可以在<span className="docs-version-tag">2.5.4</span>中使用 <code>type</code>{" "}
        属性。
      </p>
      <p>check-tag 的基础使用方法，check-tag 提供的 API 非常简单。</p>
      <DemoBlock source={SOURCES.checkable}>
        <TagCheckable />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
