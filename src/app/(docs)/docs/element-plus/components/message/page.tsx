import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  MessageBasic,
  MessageClosable,
  MessageDifferentTypes,
  MessageGrouping,
  MessagePlacement,
  MessagePlain,
  MessageRawHtml,
} from "@/components/element-plus/examples/message";

export const metadata: Metadata = { title: "Message 消息提示" };

const SOURCES = {
  basic: `message("This is a message.");

message({
  message: (
    <p style={{ lineHeight: 1, fontSize: 14, margin: 0 }}>
      Message can be <i style={{ color: "teal" }}>VNode</i>
    </p>
  ),
});`,

  differentTypes: `<ElButton plain onClick={() => message({ message: "This is a primary message.", type: "primary" })}>
  Primary
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a success message.", type: "success" })}>
  Success
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a warning message.", type: "warning" })}>
  Warning
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a info message.", type: "info" })}>
  Info
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a error message.", type: "error" })}>
  Error
</ElButton>`,

  plain: `<ElButton plain onClick={() => message({ message: "This is a primary message.", type: "primary", plain: true })}>
  Primary
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a success message.", type: "success", plain: true })}>
  Success
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a warning message.", type: "warning", plain: true })}>
  Warning
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a info message.", type: "info", plain: true })}>
  Info
</ElButton>
<ElButton plain onClick={() => message({ message: "This is a error message.", type: "error", plain: true })}>
  Error
</ElButton>`,

  closable: `{/* 可手动关闭 */}
message({ message: "This is a success message.", type: "success", showClose: true });

{/* 不会自动关闭 */}
message({
  showClose: true,
  message: "This is a message that does not automatically close.",
  duration: 0,
});`,

  rawHtml: `message({
  dangerouslyUseHTMLString: true,
  message: "<strong>This is <i>HTML</i> string</strong>",
});`,

  grouping: `message({
  message: "This is a message.",
  grouping: true,
  type: "success",
});`,

  placement: `const counters = useRef<Record<string, number>>({});

<ElButton
  plain
  onClick={() => {
    const count = (counters.current.top ?? 0) + 1;
    counters.current.top = count;
    message({
      message: \`This is a message from the top \${count}\`,
      type: "success",
      placement: "top",
    });
  }}
>
  Top
</ElButton>
<ElButton
  plain
  onClick={() => {
    const count = (counters.current["top-left"] ?? 0) + 1;
    counters.current["top-left"] = count;
    message({
      message: \`This is a message from the top-left \${count}\`,
      type: "info",
      placement: "top-left",
    });
  }}
>
  Top Left
</ElButton>
<ElButton
  plain
  onClick={() => {
    const count = (counters.current["top-right"] ?? 0) + 1;
    counters.current["top-right"] = count;
    message({
      message: \`This is a message from the top-right \${count}\`,
      type: "primary",
      placement: "top-right",
    });
  }}
>
  Top Right
</ElButton>
<ElButton
  plain
  onClick={() => {
    const count = (counters.current.bottom ?? 0) + 1;
    counters.current.bottom = count;
    message({
      message: \`This is a message from the bottom \${count}\`,
      type: "warning",
      placement: "bottom",
    });
  }}
>
  Bottom
</ElButton>
<ElButton
  plain
  onClick={() => {
    const count = (counters.current["bottom-left"] ?? 0) + 1;
    counters.current["bottom-left"] = count;
    message({
      message: \`This is a message from the bottom-left \${count}\`,
      type: "warning",
      placement: "bottom-left",
    });
  }}
>
  Bottom Left
</ElButton>
<ElButton
  plain
  onClick={() => {
    const count = (counters.current["bottom-right"] ?? 0) + 1;
    counters.current["bottom-right"] = count;
    message({
      message: \`This is a message from the bottom-right \${count}\`,
      type: "error",
      placement: "bottom-right",
    });
  }}
>
  Bottom Right
</ElButton>`,
};

const API_MD = `
## Message API

使用前需在应用根部渲染容器组件 \`<ElMessageContainer />\`（本站已全局挂载）。

### Message 方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| message(options) | 显示消息 | ^[string] / ^[MessageOptions] |
| message.primary(options) | 主要消息 | 同上 |
| message.success(options) | 成功消息 | 同上 |
| message.info(options) | 信息消息 | 同上 |
| message.warning(options) | 警告消息 | 同上 |
| message.error(options) | 错误消息 | 同上 |
| message.closeAll() | 关闭全部消息 | — |

每个方法返回一个 \`{ close: () => void }\` 句柄，可手动关闭该条消息。

### MessageOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| message | 消息文字，支持字符串、ReactNode 或返回 ReactNode 的函数 | ^[ReactNode] / ^[Function] | — |
| type | 消息类型 | ^[enum]\`'primary' \\| 'success' \\| 'info' \\| 'warning' \\| 'error'\` | info |
| duration | 显示时长（毫秒），0 表示不自动关闭 | ^[number] | 3000 |
| show-close | 是否显示关闭按钮 | ^[boolean] | false |
| plain | 是否使用朴素样式 | ^[boolean] | false |
| offset | 距视口边缘的距离（**px**） | ^[number] | 16 |
| placement | 位置 | ^[enum]\`'top' \\| 'top-left' \\| 'top-right' \\| 'bottom' \\| 'bottom-left' \\| 'bottom-right'\` | top |
| icon | 自定义图标 | ^[ReactNode] | — |
| dangerously-use-HTML-string | 是否以 HTML 片段渲染 | ^[boolean] | false |
| grouping | 相同内容是否合并为一条并显示数量徽标 | ^[boolean] | false |
| append-to | 挂载容器，默认 body | ^[string] / ^[HTMLElement] | — |
| custom-class | 自定义类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| on-close | 关闭时的回调 | ^[Function]\`() => void\` | — |
`;

export default function MessagePage() {
  return (
    <>
      <h1>Message 消息提示</h1>
      <p>常用于主动操作后的反馈提示。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        直接调用 <code>message(...)</code> 即可弹出，参数可以是字符串或
        ReactNode；无需在 JSX 中声明。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <MessageBasic />
      </DemoBlock>

      <Heading level={2}>不同类型</Heading>
      <p>
        通过 <code>type</code> 设置 <code>primary</code>、<code>success</code>、
        <code>warning</code>、<code>info</code>、<code>error</code>。
      </p>
      <DemoBlock source={SOURCES.differentTypes}>
        <MessageDifferentTypes />
      </DemoBlock>

      <Heading level={2}>朴素样式</Heading>
      <p>
        设置 <code>plain</code> 使用浅色背景的朴素样式。
      </p>
      <DemoBlock source={SOURCES.plain}>
        <MessagePlain />
      </DemoBlock>

      <Heading level={2}>可关闭</Heading>
      <p>
        设置 <code>showClose</code> 显示关闭按钮；<code>duration</code> 为
        <code>0</code> 时不会自动关闭。
      </p>
      <DemoBlock source={SOURCES.closable}>
        <MessageClosable />
      </DemoBlock>

      <Heading level={2}>使用 HTML 片段</Heading>
      <p>
        设置 <code>dangerouslyUseHTMLString</code> 后 <code>message</code>
        会按 HTML 渲染。
      </p>
      <DemoBlock source={SOURCES.rawHtml}>
        <MessageRawHtml />
      </DemoBlock>

      <Heading level={2}>合并消息</Heading>
      <p>
        设置 <code>grouping</code> 后，相同内容的消息会合并并显示数量徽标。
      </p>
      <DemoBlock source={SOURCES.grouping}>
        <MessageGrouping />
      </DemoBlock>

      <Heading level={2}>位置</Heading>
      <p>
        通过 <code>placement</code> 设置消息出现的位置，共 6 个方位，
        同一位置的消息会自动堆叠。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <MessagePlacement />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
