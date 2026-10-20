import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  MessageBoxAlert,
  MessageBoxCenteredContent,
  MessageBoxConfirm,
  MessageBoxCustomization,
  MessageBoxCustomizedIcon,
  MessageBoxDistinguishableCloseCancel,
  MessageBoxDraggable,
  MessageBoxPrompt,
  MessageBoxUseHtml,
  MessageBoxUseVnode,
  MessageBoxUseVnodeWithActionHandlers,
} from "@/components/element-plus/examples/feedback";

export const metadata: Metadata = { title: "MessageBox 消息弹出框" };

const SOURCES = {
  alert: `MessageBox.alert("This is a message", "Title", {
  confirmButtonText: "OK",
  callback: (result) => {
    message({ type: "info", message: \`action: \${result.action}\` });
  },
});`,

  confirm: `MessageBox.confirm(
  "proxy will permanently delete the file. Continue?",
  "Warning",
  {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  },
)
  .then(() => message({ type: "success", message: "Delete completed" }))
  .catch(() => message({ type: "info", message: "Delete canceled" }));`,

  prompt: `MessageBox.prompt("Please input your e-mail", "Tip", {
  confirmButtonText: "OK",
  cancelButtonText: "Cancel",
  inputPattern: /[\\w!#$%&'*+/=?^\`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^\`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?/,
  inputErrorMessage: "Invalid Email",
})
  .then((result) => {
    const value = typeof result === "object" ? result.value : result;
    message({ type: "success", message: \`Your email is:\${value}\` });
  })
  .catch(() => message({ type: "info", message: "Input canceled" }));`,

  useVnode: `MessageBox({
  title: "Message",
  message: <p>Message can be <i style={{ color: "teal" }}>VNode</i></p>,
});

MessageBox({
  title: "Message",
  message: () => <DynamicSwitch />,
});`,

  useVnodeWithActionHandlers: `MessageBox.confirm(
  ({ confirm, cancel, close }) => (
    <div>
      <p>Custom buttons with MessageBox action handlers</p>
      <ElButton type="primary" onClick={confirm}>Resolve</ElButton>
      <ElButton type="danger" onClick={cancel}>Reject</ElButton>
      <ElButton onClick={close}>Close</ElButton>
    </div>
  ),
  {
    title: "Message",
    showConfirmButton: false,
    showCancelButton: false,
    distinguishCancelAndClose: true,
  },
)
  .then((action) => message({ type: "success", message: \`resolved: \${action}\` }))
  .catch((reason) => message({ type: "error", message: \`rejected: \${String(reason)}\` }));`,

  customization: `MessageBox({
  title: "Message",
  message: <p>Message can be <i style={{ color: "teal" }}>VNode</i></p>,
  showCancelButton: true,
  confirmButtonText: "OK",
  cancelButtonText: "Cancel",
  beforeClose: (action, instance, done) => {
    if (action === "confirm") {
      instance.confirmButtonLoading = true;
      instance.confirmButtonText = "Loading...";
      setTimeout(() => {
        done();
        setTimeout(() => {
          instance.confirmButtonLoading = false;
        }, 300);
      }, 3000);
    } else {
      done();
    }
  },
}).then((result) => {
  message({ type: "info", message: \`action: \${result.action}\` });
});`,

  useHtml: `MessageBox.alert(
  "<strong>proxy is <i>HTML</i> string</strong>",
  "HTML String",
  { dangerouslyUseHTMLString: true },
);`,

  distinguishableCloseCancel: `MessageBox.confirm("You have unsaved changes, save and proceed?", "Confirm", {
  distinguishCancelAndClose: true,
  confirmButtonText: "Save",
  cancelButtonText: "Discard Changes",
})
  .then(() => message({ type: "info", message: "Changes saved. Proceeding to a new route." }))
  .catch((action) =>
    message({
      type: "info",
      message:
        action === "cancel"
          ? "Changes discarded. Proceeding to a new route."
          : "Stay in the current route",
    }),
  );`,

  centeredContent: `MessageBox.confirm(
  "proxy will permanently delete the file. Continue?",
  "Warning",
  {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
    center: true,
  },
)
  .then(() => message({ type: "success", message: "Delete completed" }))
  .catch(() => message({ type: "info", message: "Delete canceled" }));`,

  customizedIcon: `MessageBox.confirm(
  "It will permanently delete the file. Continue?",
  "Warning",
  {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
    icon: <Delete />,
  },
)
  .then(() => message({ type: "success", message: "Delete completed" }))
  .catch(() => message({ type: "info", message: "Delete canceled" }));`,

  draggable: `MessageBox.confirm(
  "proxy will permanently delete the file. Continue?",
  "Warning",
  {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
    draggable: true,
    overflow: true,
  },
)
  .then(() => message({ type: "success", message: "Delete completed" }))
  .catch(() => message({ type: "info", message: "Delete canceled" }));`,
};

const API_MD = `
## MessageBox API

需在应用根部渲染 \`<ElMessageBoxContainer />\`（本站已全局挂载）。

### MessageBox 方法

| 方法 | 说明 | 返回 |
| --- | --- | --- |
| MessageBox(options) | 通用消息框 | ^[Promise]\`MessageBoxData\` |
| MessageBox.alert(message, title?, options?) | 只有确定按钮 | ^[Promise]\`MessageBoxData\` |
| MessageBox.confirm(message, title?, options?) | 有确定和取消 | ^[Promise]\`MessageBoxData\` |
| MessageBox.prompt(message, title?, options?) | 带输入框 | ^[Promise]\`MessageBoxData\` |
| MessageBox.closeAll() | 关闭全部 | — |

确认时 resolve 动作名 \`'confirm'\`（prompt 为 \`{ value, action }\`）；
取消 / 关闭时 **reject** \`'cancel'\` 或 \`'close'\`（开启
\`distinguishCancelAndClose\` 时点击关闭按钮为 \`'close'\`）。
传入 \`callback\` 后由回调接管，Promise 不再 resolve / reject。

### MessageBoxOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题，传 null 不渲染头部 | ^[ReactNode] | 提示 |
| message | 正文，可为 ReactNode 或返回节点的函数 | ^[ReactNode] / ^[Function] | — |
| type | 图标类型 | ^[enum]\`'primary' \\| 'success' \\| 'info' \\| 'warning' \\| 'error'\` | — |
| icon | 自定义图标 | ^[ReactNode] | — |
| show-confirm-button / show-cancel-button / show-close | 是否显示对应按钮 | ^[boolean] | true / false / true |
| confirm-button-text / cancel-button-text | 按钮文案 | ^[string] | OK / Cancel |
| confirm-button-type / cancel-button-type | 按钮类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info' \\| 'text'\` | primary / text |
| center | 内容居中 | ^[boolean] | false |
| modal | 是否显示遮罩 | ^[boolean] | true |
| close-on-click-modal | 点遮罩关闭 | ^[boolean] | true（快捷方法为 false） |
| close-on-press-escape | ESC 关闭 | ^[boolean] | true |
| distinguish-cancel-and-close | 区分取消与关闭 | ^[boolean] | false |
| show-input | 显示输入框 | ^[boolean] | false |
| input-placeholder | 输入框占位 | ^[string] | — |
| input-value | 输入框初始值 | ^[string] | — |
| input-type | 输入框类型 | ^[string] | text |
| input-pattern | 输入必须匹配的正则 | ^[RegExp] | — |
| input-validator | 输入校验，返回字符串即错误信息 | ^[Function]\`(value) => string \\| boolean\` | — |
| input-error-message | 校验失败默认文案 | ^[string] | 输入的数据不合法! |
| dangerously-use-HTML-string | 以 HTML 渲染正文 | ^[boolean] | false |
| close-icon | 自定义关闭图标 | ^[ReactNode] | Close |
| draggable | 是否可拖拽 | ^[boolean] | false |
| overflow | 拖拽是否允许超出视口 | ^[boolean] | false |
| lock-scroll | 是否锁定 body 滚动 | ^[boolean] | true |
| close-on-hash-change | hash 变化时是否关闭 | ^[boolean] | true |
| callback | 关闭后的回调；传入后接管 Promise | ^[Function]\`(result, instance) => void\` | — |
| custom-class / custom-style | 自定义类名 / 样式 | ^[string] / ^[object] | — |
| modal-class | 遮罩类名 | ^[string] | — |
| confirm-button-class / cancel-button-class | 按钮类名 | ^[string] | — |
| btn-size | 按钮尺寸 | ^[enum]\`'small' \\| 'default' \\| 'large'\` | default |
| round-button | 是否圆角按钮 | ^[boolean] | false |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | body |
| z-index | 层级 | ^[number] | — |
| before-close | 关闭前钩子 | ^[Function]\`(action, instance, done) => void\` | — |

### 实例 API（beforeClose 第二参数）

| 属性 / 方法 | 说明 |
| --- | --- |
| confirmButtonText / cancelButtonText | 可在关闭前动态改写按钮文案 |
| confirmButtonLoading / cancelButtonLoading | 按钮加载态 |
| confirmButtonDisabled | 确认按钮是否禁用 |
| doClose() | 关闭消息框 |
| setConfirmButtonLoading(loading) | 设置确认按钮加载态 |
`;

export default function MessageBoxPage() {
  return (
    <>
      <h1>MessageBox 消息弹出框</h1>
      <p>模拟系统的消息提示框而实现的一组模态对话框。</p>

      <Heading level={2}>警示</Heading>
      <p>
        调用 <code>MessageBox.alert</code> 只能确认，不能通过 ESC 或点击遮罩关闭。
      </p>
      <DemoBlock source={SOURCES.alert}>
        <MessageBoxAlert />
      </DemoBlock>

      <Heading level={2}>确认</Heading>
      <p>
        <code>MessageBox.confirm</code> 有确定和取消，返回 Promise。
      </p>
      <DemoBlock source={SOURCES.confirm}>
        <MessageBoxConfirm />
      </DemoBlock>

      <Heading level={2}>输入</Heading>
      <p>
        <code>MessageBox.prompt</code> 带输入框，支持正则与自定义校验，
        校验失败会留在原地。
      </p>
      <DemoBlock source={SOURCES.prompt}>
        <MessageBoxPrompt />
      </DemoBlock>

      <Heading level={2}>使用 VNode</Heading>
      <p>
        <code>message</code> 可以传 ReactNode，也可以传函数以延迟渲染。
      </p>
      <DemoBlock source={SOURCES.useVnode}>
        <MessageBoxUseVnode />
      </DemoBlock>

      <Heading level={2}>使用 VNode 与动作处理器</Heading>
      <p>
        <code>message</code> 的函数形式会收到 <code>confirm</code>、
        <code>cancel</code>、<code>close</code>，可用于自定义按钮。
      </p>
      <DemoBlock source={SOURCES.useVnodeWithActionHandlers}>
        <MessageBoxUseVnodeWithActionHandlers />
      </DemoBlock>

      <Heading level={2}>自定义</Heading>
      <p>
        通过 <code>beforeClose(action, instance, done)</code> 可以在关闭前
        修改按钮文案与加载态，只有调用 <code>done()</code> 才真正关闭。
      </p>
      <DemoBlock source={SOURCES.customization}>
        <MessageBoxCustomization />
      </DemoBlock>

      <Heading level={2}>使用 HTML 片段</Heading>
      <p>
        设置 <code>dangerouslyUseHTMLString</code> 后正文会按 HTML 渲染。
      </p>
      <DemoBlock source={SOURCES.useHtml}>
        <MessageBoxUseHtml />
      </DemoBlock>

      <Heading level={2}>区分取消与关闭</Heading>
      <p>
        开启 <code>distinguishCancelAndClose</code> 后，取消按钮 reject
        <code>{"'cancel'"}</code>，关闭按钮 / 遮罩 / ESC reject <code>{"'close'"}</code>。
      </p>
      <DemoBlock source={SOURCES.distinguishableCloseCancel}>
        <MessageBoxDistinguishableCloseCancel />
      </DemoBlock>

      <Heading level={2}>内容居中</Heading>
      <p>
        设置 <code>center</code> 让内容居中。
      </p>
      <DemoBlock source={SOURCES.centeredContent}>
        <MessageBoxCenteredContent />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>
        通过 <code>icon</code> 替换默认的类型图标。
      </p>
      <DemoBlock source={SOURCES.customizedIcon}>
        <MessageBoxCustomizedIcon />
      </DemoBlock>

      <Heading level={2}>可拖拽</Heading>
      <p>
        设置 <code>draggable</code> 可拖动消息框；<code>overflow</code>
        允许拖出视口。
      </p>
      <DemoBlock source={SOURCES.draggable}>
        <MessageBoxDraggable />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
