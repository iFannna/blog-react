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
      <h1>MessageBox 消息弹框</h1>
      <p>模拟系统的消息提示框而实现的一套模态对话框组件，用于消息提示、确认消息和提交内容。</p>
      <DocsContent
        source={`:::tip

从设计上来说，MessageBox 的作用是美化系统自带的 \`alert\`、\`confirm\` 和 \`prompt\`，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。

:::`}
      />

      <Heading level={2}>消息提示</Heading>
      <p>当用户进行操作时会被触发，该对话框中断用户操作，直到用户确认知晓后才可关闭。</p>
      <p>
        调用 <code>ElMessageBox.alert</code> 方法以打开 alert 框。它模拟了系统的{" "}
        <code>alert</code>，无法通过按下 ESC 或点击框外关闭。此例中接收了两个参数，
        <code>message</code>和<code>title</code>。值得一提的是，窗口被关闭后，它默认会返回一个<code>Promise</code>
        对象便于进行后续操作的处理。若不确定浏览器是否支持<code>Promise</code>，可自行引入第三方 polyfill 或像本例一样使用回调进行后续处理。
      </p>
      <DemoBlock source={SOURCES.alert}>
        <MessageBoxAlert />
      </DemoBlock>

      <Heading level={2}>确认消息</Heading>
      <p>提示用户确认其已经触发的动作，并询问是否进行此操作时会用到此对话框。</p>
      <p>
        调用 <code>ElMessageBox.confirm</code> 方法以打开 confirm 框。它模拟了系统的{" "}
        <code>confirm</code>。 Message Box 组件也拥有极高的定制性，我们可以传入{" "}
        <code>options</code> 作为第三个参数，它是一个字面量对象。{" "}
        <code>type</code> 字段表明消息类型，可以为<code>success</code>，
        <code>error</code>，<code>info</code>和 <code>warning</code>{" "}
        需要注意的是，第二个参数 <code>title</code> 必须定义为{" "}
        <code>String</code> 类型，如果是 <code>Object</code>，会被当做为{" "}
        <code>options</code>使用。在这里我们返回了一个 <code>Promise</code>{" "}
        来处理后续响应。 <code>primary</code> 已被添加到
        <span className="docs-version-tag">2.9.11</span>。
      </p>
      <DemoBlock source={SOURCES.confirm}>
        <MessageBoxConfirm />
      </DemoBlock>

      <Heading level={2}>提交内容</Heading>
      <p>当需要用户输入内容时，可以使用 Prompt 类型的消息框。</p>
      <p>
        调用 <code>ElMessageBox.prompt</code> 方法以打开 prompt 框。它模拟了系统的{" "}
        <code>prompt</code>。可以用 <code>inputPattern</code>{" "}
        字段自己规定匹配模式，使用 <code>inputValidator</code>{" "}
        来指定验证方法，它应该返回 <code>Boolean</code> 或 <code>String</code>。返回{" "}
        <code>false</code> 或 <code>String</code> 表示验证失败，
        返回的字符串将用作 <code>inputErrorMessage</code>，用来提示用户错误原因。此外，可以用{" "}
        <code>inputPlaceholder</code> 字段来定义输入框的占位符。
      </p>
      <DemoBlock source={SOURCES.prompt}>
        <MessageBoxPrompt />
      </DemoBlock>

      <Heading level={2}>使用 VNode</Heading>
      <p>
        <code>message</code> 可以是 VNode。
      </p>
      <DemoBlock source={SOURCES.useVnode}>
        <MessageBoxUseVnode />
      </DemoBlock>

      <Heading level={2} id="使用带有事件处理函数的-vnode">
        使用带有事件处理函数的 VNode{" "}
        <span className="docs-version-tag">2.14.0</span>
      </Heading>
      <p>
        在 <code>message</code> 中可以接收 <code>{"{ confirm, cancel, close }"}</code>{" "}
        作为参数，使自定义内容能够以编程方式触发相同的 MessageBox
        操作，并自动关闭实例。
      </p>
      <DemoBlock source={SOURCES.useVnodeWithActionHandlers}>
        <MessageBoxUseVnodeWithActionHandlers />
      </DemoBlock>

      <Heading level={2}>个性化</Heading>
      <p>消息弹框可以被定制来展示各种内容。</p>
      <p>
        上面提到的三个方法都是对 <code>ElMessageBox</code>{" "}
        方法的二次包装。本例直接调用 <code>ElMessageBox</code> 方法，使用了{" "}
        <code>showCancelButton</code> 字段，用于显示取消按钮。另外可使用{" "}
        <code>cancelButtonClass</code> 为其添加自定义样式，使用{" "}
        <code>cancelButtonText</code>{" "}
        来自定义取消按钮文本（Confirm
        按钮也具有相同的字段，在文末的 API 说明中有完整的字段列表）。此例还使用了{" "}
        <code>beforeClose</code> 属性，当 beforeClose
        被赋值且被赋值为一个回调函数时，在消息弹框被关闭之前将会被调用，并且可以通过该方法来阻止弹框被关闭。它是一个接收三个参数：
        <code>action</code>、<code>instance</code> 和<code>done</code> 的方法。使用它能够在关闭前对实例进行一些操作，比如为确定按钮添加{" "}
        <code>loading</code> 状态等；此时若需要关闭实例，可以调用 <code>done</code>{" "}
        方法（若在 <code>beforeClose</code> 中没有调用 <code>done</code>，则弹框便不会关闭）。
      </p>
      <DemoBlock source={SOURCES.customization}>
        <MessageBoxCustomization />
      </DemoBlock>

      <Heading level={2}>使用 HTML 片段</Heading>
      <p>
        <code>message</code> 支持传入 HTML 字符串来作为正文内容。
      </p>
      <p>
        将 <code>dangerouslyUseHTMLString</code> 属性设置为 true，
        <code>message</code> 属性就会被当作 HTML 片段处理。
      </p>
      <DemoBlock source={SOURCES.useHtml}>
        <MessageBoxUseHtml />
      </DemoBlock>
      <DocsContent
        source={`:::warning

\`message\` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。因此在 \`dangerouslyUseHTMLString\` 打开的情况下，请确保 \`message\` 的内容是可信的，**永远不要**将用户提交的内容赋值给 \`message\` 属性。

:::`}
      />

      <Heading level={2}>区分取消操作与关闭操作</Heading>
      <p>有些场景下，点击取消按钮与点击关闭按钮有着不同的含义。</p>
      <p>
        默认情况下，当用户触发取消（点击取消按钮）和触发关闭（点击关闭按钮或遮罩层、按下
        ESC 键）时，Promise 的 reject 回调和 <code>callback</code> 回调的参数均为
        &apos;cancel&apos;。如果将<code>distinguishCancelAndClose</code>
        属性设置为 true，则上述两种行为的参数分别为 &apos;cancel&apos; 和{" "}
        &apos;close&apos;。
      </p>
      <DemoBlock source={SOURCES.distinguishableCloseCancel}>
        <MessageBoxDistinguishableCloseCancel />
      </DemoBlock>

      <Heading level={2}>内容居中</Heading>
      <p>消息弹框支持使用居中布局。</p>
      <p>
        将 <code>center</code> 属性设置为 <code>true</code> 可将内容居中显示。
      </p>
      <DemoBlock source={SOURCES.centeredContent}>
        <MessageBoxCenteredContent />
      </DemoBlock>

      <Heading level={2}>自定义图标</Heading>
      <p>
        图标可以使用任意Vue 组件或{" "}
        <a
          href="https://vuejs.org/guide/extras/render-function.html"
          target="_blank"
          rel="noreferrer"
        >
          渲染函数 (JSX)
        </a>
        来自定义。
      </p>
      <DemoBlock source={SOURCES.customizedIcon}>
        <MessageBoxCustomizedIcon />
      </DemoBlock>

      <Heading level={2}>可拖放</Heading>
      <p>设置 MessageBox 可以拖拽。</p>
      <p>
        设置<code>draggable</code>属性为<code>true</code>来开启拖拽弹窗能力。设置{" "}
        <code>overflow</code> <span className="docs-version-tag">2.5.4</span> 为{" "}
        <code>true</code> 可以让拖拽范围超出可视区。
      </p>
      <DemoBlock source={SOURCES.draggable}>
        <MessageBoxDraggable />
      </DemoBlock>

      <Heading level={2}>全局方法</Heading>
      <p>
        如果你完整引入了 Element，它会为{" "}
        <code>app.config.globalProperties</code> 添加如下全局方法：
        <code>$msgbox</code>、 <code>$alert</code>、 <code>$confirm</code> 和{" "}
        <code>$prompt</code>。因此在 Vue
        实例中可以采用本页面中的方式来调用<code>MessageBox</code>。参数如下：
      </p>
      <ul>
        <li>
          <code>$msgbox(options)</code>
        </li>
        <li>
          <code>$alert(message, title, options)</code> 或{" "}
          <code>$alert(message, options)</code>
        </li>
        <li>
          <code>$confirm(message, title, options)</code> 或{" "}
          <code>$confirm(message, options)</code>
        </li>
        <li>
          <code>$prompt(message, title, options)</code> 或{" "}
          <code>$prompt(message, options)</code>
        </li>
      </ul>

      <Heading level={2} id="应用程序上下文继承">
        应用程序上下文继承{" "}
        <span className="docs-version-tag">&gt; 2.0.4</span>
      </Heading>
      <p>
        现在，消息框构造函数支持将 <code>context</code>{" "}
        作为第二个参数（如果你使用的是消息框变体，则为第四个参数），这样你就可以向消息中注入当前应用的上下文，从而继承应用中的所有属性。
      </p>
      <pre>
        <code>{`import { MessageBox } from "@/components/element-plus/message-box";

// 你可以像这样传递参数：
MessageBox({});
// 或者正在使用不同的调用方式
MessageBox.alert("Hello world!", "Title", {});`}</code>
      </pre>

      <Heading level={2}>按需引入</Heading>
      <p>如果您需要按需引入 MessageBox：</p>
      <pre>
        <code>{`import { MessageBox } from "@/components/element-plus/message-box";`}</code>
      </pre>
      <p>
        那么对应于上述四个全局方法的调用方法依次为：
        <code>ElMessageBox</code>、<code>ElMessageBox.alert</code>、
        <code>ElMessageBox.confirm</code> 和 <code>ElMessageBox.prompt</code>
        。参数同上所述。
      </p>

      <DocsContent source={API_MD} />
    </>
  );
}
