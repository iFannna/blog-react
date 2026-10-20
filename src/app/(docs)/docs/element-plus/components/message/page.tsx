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
    <span style={{ lineHeight: 1, fontSize: 14 }}>
      Message can be <i style={{ color: "teal" }}>VNode</i>
    </span>
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
      <p>
        常用于主动操作后的反馈提示。与 Notification
        的区别是后者更多用于系统级通知的被动提醒。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>默认情况下在顶部显示并在 3 秒后消失。您可以使用 <code>placement</code> 属性控制位置。</p>
      <p>
        Message 在配置上与 Notification 非常类似，所以部分 options
        在此不做详尽解释。文末有 options 列表，可以结合 Notification
        的文档理解它们。 Element Plus 注册了一个全局的 <code>$message</code>
        方法用于调用。 Message 可以接收一个字符串或一个 VNode
        作为参数，它会被显示为正文内容。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <MessageBasic />
      </DemoBlock>

      <Heading level={2}>不同状态</Heading>
      <p>Used to show the feedback of Primary, Success, Warning, Info and Error activities.</p>
      <p>
        当需要自定义更多属性时，Message 也可以接收一个对象为参数。比如，设置{" "}
        <code>type</code> 字段可以定义不同的状态，默认为<code>info</code>。此时正文内容以{" "}
        <code>message</code> 的值传入。同时，我们也为 Message 的各种
        type 注册了方法，可以在不传入 type 字段的情况下像 <code>open4</code>{" "}
        那样直接调用。 <code>primary</code> 已被添加到
        <span className="docs-version-tag">2.9.11</span>。
      </p>
      <DemoBlock source={SOURCES.differentTypes}>
        <MessageDifferentTypes />
      </DemoBlock>

      <Heading level={2} id="plain">
        Plain <span className="docs-version-tag">2.6.3</span>
      </Heading>
      <p>
        设置 <code>plain</code> 为 plain 背景。
      </p>
      <DemoBlock source={SOURCES.plain}>
        <MessagePlain />
      </DemoBlock>

      <Heading level={2}>可关闭的消息提示</Heading>
      <p>可以添加关闭按钮。</p>
      <p>
        默认的 Message 是不可以被人工关闭的。如果你需要手动关闭功能，你可以把{" "}
        <code>showClose</code> 设置为 true 此外，和 Notification 一样，Message 拥有可控的{" "}
        <code>duration</code>，默认的关闭时间为 3000
        毫秒，当把这个属性的值设置为<code>0</code>便表示该消息不会被自动关闭。
      </p>
      <DemoBlock source={SOURCES.closable}>
        <MessageClosable />
      </DemoBlock>

      <Heading level={2} id="使用-html-片段作为正文内容">
        使用 HTML 片段作为正文内容
      </Heading>
      <p>
        <code>message</code> 还支持使用 HTML 字符串作为正文内容。
      </p>
      <p>
        将<code>dangerouslyUseHTMLString</code>属性设置为 true,
        <code>message</code> 就会被当作 HTML 片段处理。
      </p>
      <DemoBlock source={SOURCES.rawHtml}>
        <MessageRawHtml />
      </DemoBlock>
      <DocsContent
        source={`:::warning

\`message\` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。因此在 \`dangerouslyUseHTMLString\` 打开的情况下，请确保 \`message\` 的内容是可信的，**永远不要**将用户提交的内容赋值给 \`message\` 属性。

:::`}
      />

      <Heading level={2}>分组消息合并</Heading>
      <p>合并相同内容的消息。</p>
      <p>
        设置 <code>grouping</code> 为 true，内容相同的 <code>message</code>{" "}
        将被合并。
      </p>
      <DemoBlock source={SOURCES.grouping}>
        <MessageGrouping />
      </DemoBlock>

      <Heading level={2} id="placement">
        Placement <span className="docs-version-tag">2.11.0</span>
      </Heading>
      <p>
        控制消息出现的位置。消息可以显示在查看端口的顶部(默认) 或其他位置。
      </p>
      <DemoBlock source={SOURCES.placement}>
        <MessagePlacement />
      </DemoBlock>

      <Heading level={2}>全局方法</Heading>
      <p>
        Element Plus 为 <code>app.config.globalProperties</code> 添加了全局方法{" "}
        <code>$message</code>。因此在 vue
        实例中你可以使用当前页面中的调用方式调用 <code>Message</code>
      </p>

      <Heading level={2}>单独引用</Heading>
      <pre>
        <code>{`import { message } from "@/components/element-plus/message";`}</code>
      </pre>
      <p>
        此时调用方法为 <code>ElMessage(options)</code>
        。我们也为每个 type 定义了各自的方法，如{" "}
        <code>ElMessage.success(options)</code>。并且可以调用{" "}
        <code>ElMessage.closeAll()</code> 手动关闭所有实例。
      </p>

      <Heading level={2} id="应用程序上下文继承">
        应用程序上下文继承 <span className="docs-version-tag">2.0.3</span>
      </Heading>
      <p>
        现在 Message 接受一条 <code>context</code>{" "}
        作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Message
        中，这将允许你继承应用程序的所有属性。
      </p>
      <p>你可以像这样使用它：</p>
      <DocsContent
        source={`:::tip
如果您全局注册了 ElMessage 组件，它将自动继承应用的上下文环境。

:::`}
      />

      <DocsContent source={API_MD} />
    </>
  );
}
