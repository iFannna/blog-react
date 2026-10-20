import type { Metadata } from "next";
import Link from "next/link";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  NotificationBasic,
  NotificationDifferentTypes,
  NotificationNoClose,
  NotificationOffsetting,
  NotificationPositioning,
  NotificationProgressBar,
  NotificationRawHtml,
  NotificationUseVnode,
} from "@/components/element-plus/examples/notification";

export const metadata: Metadata = { title: "Notification 通知" };

const SOURCES = {
  basic: `notification({
  title: "Title",
  message: <i style={{ color: "teal" }}>This is a reminder</i>,
});

notification({
  title: "Prompt",
  message: "This is a message that does not automatically close",
  duration: 0,
});`,

  differentTypes: `<ElButton
  plain
  onClick={() => notification({ title: "Primary", message: "This is a primary message", type: "primary" })}
>
  Primary
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Success", message: "This is a success message", type: "success" })}
>
  Success
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Warning", message: "This is a warning message", type: "warning" })}
>
  Warning
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Info", message: "This is a info message", type: "info" })}
>
  Info
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Error", message: "This is a error message", type: "error" })}
>
  Error
</ElButton>`,

  positioning: `<ElButton
  plain
  onClick={() => notification({ title: "Custom Position", message: "I'm at the top right corner", position: "top-right" })}
>
  Top Right
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Custom Position", message: "I'm at the bottom right corner", position: "bottom-right" })}
>
  Bottom Right
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Custom Position", message: "I'm at the bottom left corner", position: "bottom-left" })}
>
  Bottom Left
</ElButton>
<ElButton
  plain
  onClick={() => notification({ title: "Custom Position", message: "I'm at the top left corner", position: "top-left" })}
>
  Top Left
</ElButton>`,

  offsetting: `notification.success({
  title: "Success",
  message: "This is a success message",
  offset: 100,
});`,

  rawHtml: `notification({
  title: "HTML String",
  dangerouslyUseHTMLString: true,
  message: "<strong>This is <i>HTML</i> string</strong>",
});`,

  useVnode: `notification({
  title: "Use Vnode",
  message: <p style={{ margin: 0 }}>Message can be <i style={{ color: "teal" }}>VNode</i></p>,
});

notification({
  title: "Use Vnode",
  message: () => <DynamicSwitch />,
});`,

  progressBar: `notification({
  title: "Default progress",
  message: "Hover to pause the timer and progress bar",
  duration: 6000,
  progress: true,
});

notification({
  title: "Custom color",
  message: "Custom progress bar color overrides the default",
  duration: 6000,
  progress: {
    color: [
      { color: "#f56c6c", percentage: 20 },
      { color: "#e6a23c", percentage: 40 },
      { color: "#5cb87a", percentage: 60 },
      { color: "#1989fa", percentage: 80 },
      { color: "#6f7ad3", percentage: 100 },
    ],
  },
});

notification({
  title: "No pause on hover",
  message: "Timer and progress bar keep running even when hovering",
  duration: 6000,
  progress: true,
  pauseOnHover: false,
});`,

  noClose: `notification.success({
  title: "Info",
  message: "This is a message without close button",
  showClose: false,
});`,
};

const API_MD = `
## Notification API

需在应用根部渲染 \`<ElNotificationContainer />\`（本站已全局挂载）。

### Notification 方法

| 方法 | 说明 |
| --- | --- |
| notification(options) / notification(string) | 显示通知，字符串等价于只设 message |
| notification.primary(options) | 主要通知 |
| notification.success(options) | 成功通知 |
| notification.info(options) | 信息通知 |
| notification.warning(options) | 警告通知 |
| notification.error(options) | 错误通知 |
| notification.closeAll() | 关闭全部 |

返回实例上的 \`close()\` 可手动关闭单条。

### NotificationOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[ReactNode] | — |
| message | 正文，可为函数以延迟求值 | ^[ReactNode] / ^[Function] | — |
| type | 类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'info' \\| 'error'\` | — |
| icon | 自定义图标 | ^[ReactNode] | — |
| close-icon | 自定义关闭图标 | ^[ReactNode] | Close |
| duration | 自动关闭时长（毫秒），0 不自动关 | ^[number] | 4500 |
| position | 位置 | ^[enum]\`'top-right' \\| 'top-left' \\| 'bottom-right' \\| 'bottom-left'\` | top-right |
| offset | 距视口边缘偏移（px） | ^[number] | 0 |
| show-close | 显示关闭按钮 | ^[boolean] | true |
| progress | 显示自动关闭进度条；传对象可自定义颜色等 | ^[boolean] / ^[ProgressProps] | false |
| pause-on-hover | 悬停暂停倒计时与进度条 | ^[boolean] | true |
| dangerously-use-HTML-string | 以 HTML 渲染 message | ^[boolean] | false |
| append-to | 挂载目标，默认 body | ^[string] / ^[HTMLElement] | — |
| custom-class | 自定义类名 | ^[string] | — |
| z-index | 初始层级 | ^[number] | — |
| on-close | 关闭时回调 | ^[Function]\`() => void\` | — |
| on-click | 点击通知时回调 | ^[Function]\`() => void\` | — |
`;

export default function NotificationPage() {
  return (
    <>
      <h1>Notification 通知</h1>
      <p>悬浮出现在页面角落，显示全局的通知提醒消息。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        Element Plus 注册了 <code>$notify</code> 方法并且它接受一个 Object
        作为其参数。在最简单的情况下，你可以通过设置 <code>title</code> 和{" "}
        <code>message</code> 属性来设置通知的标题和正文内容。默认情况下，通知在4500毫秒后自动关闭，但你可以通过设置{" "}
        <code>duration</code> 属性来自定义通知的展示时间。如果你将它设置为{" "}
        <code>0</code>，那么通知将不会自动关闭。需要注意的是 <code>duration</code>{" "}
        接收一个 <code>Number</code>，单位为毫秒。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <NotificationBasic />
      </DemoBlock>

      <Heading level={2}>不同类型的通知</Heading>
      <p>We provide five types: primary, success, warning, info and error.</p>
      <p>
        Element Plus provides five notification types: <code>primary</code>,{" "}
        <code>success</code>, <code>warning</code>, <code>info</code> and{" "}
        <code>error</code>. 他们可以设置 <code>type</code>{" "}
        字段来修改，除上述的四个值之外的值会被忽略。同时，我们也为 Notification
        的各种 type 注册了单独的方法，可以在不传入 <code>type</code>{" "}
        字段的情况下像 <code>open3</code> 和 <code>open4</code> 那样直接调用。{" "}
        <code>primary</code> 已被添加到
        <span className="docs-version-tag">2.9.11</span>。
      </p>
      <DemoBlock source={SOURCES.differentTypes}>
        <NotificationDifferentTypes />
      </DemoBlock>

      <Heading level={2}>自定义消息弹出的位置</Heading>
      <p>可以让 Notification 从屏幕四角中的任意一角弹出</p>
      <p>
        使用 <code>position</code> 属性设置 Notification
        的弹出位置，支持四个选项：<code>top-right</code>、<code>top-left</code>、
        <code>bottom-right</code> 和 <code>bottom-left</code>，默认为{" "}
        <code>top-right</code>。
      </p>
      <DemoBlock source={SOURCES.positioning}>
        <NotificationPositioning />
      </DemoBlock>

      <Heading level={2}>有位置偏移的通知栏</Heading>
      <p>能够设置偏移量来使 Notification 偏移默认位置。</p>
      <p>
        Notification 提供设置偏移量的功能，通过设置 <code>offset</code>{" "}
        字段，可以使弹出的消息距屏幕边缘偏移一段距离。注意在同一时刻，每一个的
        Notification 实例应当具有一个相同的偏移量。
      </p>
      <DemoBlock source={SOURCES.offsetting}>
        <NotificationOffsetting />
      </DemoBlock>

      <Heading level={2}>使用 HTML 片段作为正文内容</Heading>
      <p>
        <code>message</code> 支持传入 HTML 字符串来作为正文内容。
      </p>
      <p>
        将 <code>dangerouslyUseHTMLString</code> 属性设置为 true，
        <code>message</code> 属性就会被当作 HTML 片段处理。
      </p>
      <DemoBlock source={SOURCES.rawHtml}>
        <NotificationRawHtml />
      </DemoBlock>
      <DocsContent
        source={`:::warning

\`message\` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。因此在 \`dangerouslyUseHTMLString\` 打开的情况下，请确保 \`message\` 的内容是可信的，**永远不要**将用户提交的内容赋值给 \`message\` 属性。

:::`}
      />

      <Heading level={2} id="函数形式的-message">
        函数形式的 message <span className="docs-version-tag">2.9.0</span>
      </Heading>
      <p>
        <code>message</code> 可以是 VNode。
      </p>
      <p>
        在<span className="docs-version-tag">2.9.0</span>之后，{" "}
        <code>message</code> 支持返回值为 VNode的函数。
      </p>
      <DemoBlock source={SOURCES.useVnode}>
        <NotificationUseVnode />
      </DemoBlock>

      <Heading level={2} id="使用进度条">
        使用进度条 <span className="docs-version-tag">2.14.4</span>
      </Heading>
      <p>显示进度条，指示通知自动关闭前的剩余时间。</p>
      <p>
        将 <code>progress</code> 设为 <code>true</code>{" "}
        即可启用进度条。进度条将显示与 <code>duration</code>{" "}
        匹配的倒计时。向 <code>progress</code> 传递一个对象，即可使用{" "}
        <Link href="/docs/element-plus/components/progress#attributes">Progress</Link>{" "}
        的选项进行自定义，例如 <code>color</code>，该选项会覆盖基于{" "}
        <code>type</code> 的状态颜色。当 <code>pauseOnHover</code> 为{" "}
        <code>true</code>（默认值）时，将鼠标悬停在通知上会同时暂停计时器和进度条。
      </p>
      <DemoBlock source={SOURCES.progressBar}>
        <NotificationProgressBar />
      </DemoBlock>

      <Heading level={2}>隐藏关闭按钮</Heading>
      <p>通知的关闭按钮可以被设置为隐藏。</p>
      <p>
        将 <code>showClose</code> 属性设置为 <code>false</code> 即可隐藏关闭按钮。
      </p>
      <DemoBlock source={SOURCES.noClose}>
        <NotificationNoClose />
      </DemoBlock>

      <Heading level={2}>全局方法</Heading>
      <p>
        Element Plus 为 <code>app.config.globalProperties</code> 添加了全局方法{" "}
        <code>$notify</code>。因此在 Vue instance 中可以采用本页面中的方式调用{" "}
        <code>Notification</code>。
      </p>

      <Heading level={2}>单独引用</Heading>
      <pre>
        <code>{`import { notification } from "@/components/element-plus/notification";

notification({
  title: "Title",
  message: "This is a message",
});`}</code>
      </pre>
      <p>
        你可以在对应的处理函数内调用 <code>ElNotification(options)</code>{" "}
        来呼出通知栏。我们也提前定义了多个 type 的单独调用方法，如{" "}
        <code>ElNotification.success(options)</code>
        。当你需要关闭页面上所有的通知栏的时候，可以调用{" "}
        <code>ElNotification.closeAll()</code> 来关闭所有的实例。在{" "}
        <span className="docs-version-tag">2.10.5</span> 版本中，你可以通过调用{" "}
        <code>ElNotification.updateOffsets(position)</code>{" "}
        手动更新所有通知实例在特定方向上的偏移量。
      </p>

      <Heading level={2} id="应用程序上下文继承">
        应用程序上下文继承{" "}
        <span className="docs-version-tag">&gt; 2.0.4</span>
      </Heading>
      <p>
        现在 Notification 接受一条 <code>context</code>{" "}
        作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Notification
        中，这将允许你继承应用程序的所有属性。
      </p>
      <p>你可以像这样使用它：</p>
      <DocsContent
        source={`:::tip
如果您全局注册了 ElNotification 组件，它将自动继承应用的上下文环境。

:::`}
      />

      <DocsContent source={API_MD} />
    </>
  );
}
