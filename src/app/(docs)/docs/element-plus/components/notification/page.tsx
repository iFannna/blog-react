import type { Metadata } from "next";
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

  differentTypes: `{["primary", "success", "warning", "info", "error"].map((type) => (
  <ElButton
    key={type}
    onClick={() => notification({ title: type, message: \`This is a \${type} message\`, type })}
  >
    {type}
  </ElButton>
))}`,

  positioning: `{["top-right", "bottom-right", "bottom-left", "top-left"].map((position) => (
  <ElButton
    key={position}
    onClick={() =>
      notification({
        title: "Custom Position",
        message: \`I'm at the \${position.replace("-", " ")} corner\`,
        position,
      })
    }
  >
    {position}
  </ElButton>
))}`,

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 命令式挂载 Vue 实例 | 模块级 store + 容器组件 | 需在根部渲染 \`<ElNotificationContainer />\` |
| \`message\` 支持 VNode / 返回 VNode 的函数 | \`message\` 支持 ReactNode / 返回 ReactNode 的函数 | — |
| \`progress\` 对象透传给 ElProgress | 同 | 支持 color / status / strokeWidth / type 等 |
| \`this.$notify\` | \`notification(...)\` | 直接调用函数 |

**实现说明**：同位置堆叠间距 16px（与官方一致）；progress 复用 ElProgress；
悬停暂停按剩余时长继续，进度条与倒计时同步。
`;

export default function NotificationPage() {
  return (
    <>
      <h1>Notification 通知</h1>
      <p>悬浮出现在页面角落，显示全局的通知提醒消息。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        设置 <code>duration</code> 控制自动关闭时长，设为 <code>0</code>
        则不自动关闭。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <NotificationBasic />
      </DemoBlock>

      <Heading level={2}>不同类型</Heading>
      <p>
        提供 <code>primary</code>、<code>success</code>、<code>info</code>、
        <code>warning</code>、<code>error</code> 五种类型。
      </p>
      <DemoBlock source={SOURCES.differentTypes}>
        <NotificationDifferentTypes />
      </DemoBlock>

      <Heading level={2}>自定义位置</Heading>
      <p>
        <code>position</code> 定义通知滑入的角落，默认 <code>top-right</code>。
      </p>
      <DemoBlock source={SOURCES.positioning}>
        <NotificationPositioning />
      </DemoBlock>

      <Heading level={2}>偏移量</Heading>
      <p>
        通过 <code>offset</code> 自定义通知距屏幕边缘的距离。
      </p>
      <DemoBlock source={SOURCES.offsetting}>
        <NotificationOffsetting />
      </DemoBlock>

      <Heading level={2}>使用 HTML 片段</Heading>
      <p>
        设置 <code>dangerouslyUseHTMLString</code> 后 <code>message</code>
        会按 HTML 渲染。
      </p>
      <DemoBlock source={SOURCES.rawHtml}>
        <NotificationRawHtml />
      </DemoBlock>

      <Heading level={2}>使用 VNode</Heading>
      <p>
        <code>message</code> 可以是 ReactNode，也可以是返回 ReactNode
        的函数以延迟渲染。
      </p>
      <DemoBlock source={SOURCES.useVnode}>
        <NotificationUseVnode />
      </DemoBlock>

      <Heading level={2}>带进度条</Heading>
      <p>
        <code>progress</code> 为 <code>true</code> 时显示自动关闭倒计时进度条；
        传对象可自定义颜色，<code>pauseOnHover</code> 控制悬停是否暂停。
      </p>
      <DemoBlock source={SOURCES.progressBar}>
        <NotificationProgressBar />
      </DemoBlock>

      <Heading level={2}>隐藏关闭按钮</Heading>
      <p>
        设置 <code>showClose</code> 为 <code>false</code> 可隐藏关闭按钮。
      </p>
      <DemoBlock source={SOURCES.noClose}>
        <NotificationNoClose />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
