import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  LoadingBasic,
  LoadingCustomization,
  LoadingFullscreen,
} from "@/components/element-plus/examples/notification";

export const metadata: Metadata = { title: "Loading 加载" };

const SOURCES = {
  basic: `const l = Loading.service({ target: "#loading-box", text: "加载中..." });
setTimeout(() => l.close(), 2000);`,

  customization: `Loading.service({ target: "#loading-custom-box", text: "加载中..." });

Loading.service({
  target: "#loading-custom-box",
  text: "带背景色",
  background: "rgba(64, 158, 255, 0.2)",
});`,

  fullscreen: `Loading.service({ fullscreen: true, text: "全屏加载中..." });

Loading.service({ fullscreen: true, lock: true, text: "锁定滚动" });`,
};

const API_MD = `
## Loading API

需在应用根部渲染 \`<ElLoadingContainer />\`。

### Loading 方法

| 方法 | 说明 | 返回 |
| --- | --- | --- |
| Loading.service(options) | 启动加载 | ^[object]\`{ close, target }\` |
| Loading.closeAll() | 关闭全部 | — |

\`service\` 返回的实例上 \`close()\` 可关闭本次加载；\`target\` 为解析后的目标元素。

### LoadingOptions

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 目标元素，字符串经 querySelector 解析 | ^[HTMLElement] / ^[string] | document.body |
| fullscreen | 是否全屏 | ^[boolean] | false |
| lock | 全屏时锁定页面滚动 | ^[boolean] | false |
| text | 加载文案 | ^[string] | — |
| background | 遮罩背景色 | ^[string] | — |
| spinner | 自定义图标 svg 字符串 | ^[boolean] / ^[string] | — |
| custom-class | 自定义类名 | ^[string] | — |
| z-index | 层级 | ^[number] | — |
| before-close | 关闭前钩子，返回 false 阻止 | ^[Function]\`() => boolean\` | — |
| closed | 完全关闭后的回调 | ^[Function]\`() => void\` | — |
`;

export default function LoadingPage() {
  return (
    <>
      <h1>Loading 加载</h1>
      <p>加载数据时显示动效。</p>

      <Heading level={2}>区域加载</Heading>
      <p>在需要的时候展示加载动画，防止页面失去响应提高用户体验（例如表格）。</p>
      <p>
        Element Plus 提供了两种调用 Loading
        的方法：指令和服务。对于自定义指令 <code>v-loading</code>，只需要绑定{" "}
        <code>boolean</code> 值即可。默认状况下，Loading
        遮罩会插入到绑定元素的子节点。通过添加 <code>body</code>{" "}
        修饰符，可以使遮罩插入至 Dom 中的 body 上。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <LoadingBasic />
      </DemoBlock>

      <Heading level={2}>自定义加载中组件内容</Heading>
      <p>你可以自定义加载中组件的文字，图标，以及背景颜色。</p>
      <p>
        在绑定了<code>v-loading</code>指令的元素上添加<code>element-loading-text</code>属性，其值会被渲染为加载文案，并显示在加载图标的下方。类似地，
        <code>element-loading-spinner</code>、<code>element-loading-background</code>{" "}
        和 <code>element-loading-svg</code>{" "}
        属性分别用来设定 svg 图标、背景色值、加载图标。
      </p>
      <DemoBlock source={SOURCES.customization}>
        <LoadingCustomization />
      </DemoBlock>
      <DocsContent
        source={`:::warning

虽然 \`element-loading-spinner / element-loading-svg\` 属性支持传入的 HTML 片段，但是动态在网站上渲染任意的 HTML 是非常危险的，因为很容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。请确保 \`element-loading-spinner / element-loading-svg\`的内容是可信的，**不要**将用户提交的内容赋值给 \`element-loading-spinner / element-loading-svg\` 属性。

:::`}
      />

      <Heading level={2}>让加载组件铺满整个屏幕</Heading>
      <p>加载数据时显示全屏动画。</p>
      <p>
        当使用指令方式时，全屏遮罩需要添加<code>fullscreen</code>修饰符（遮罩会插入至
        body 上）此时若需要锁定屏幕的滚动，可以使用<code>lock</code>
        修饰符；当使用服务方式时，遮罩默认即为全屏，无需额外设置。
      </p>
      <DemoBlock source={SOURCES.fullscreen}>
        <LoadingFullscreen />
      </DemoBlock>

      <Heading level={2}>以服务的方式来调用</Heading>
      <p>
        Loading 还可以以服务的方式调用。你可以像这样引入 Loading 服务：
      </p>
      <pre>
        <code>{`import { Loading } from "@/components/element-plus/loading";`}</code>
      </pre>
      <p>在你需要的时候通过下面的方式调用：</p>
      <pre>
        <code>{`Loading.service(options);`}</code>
      </pre>
      <p>
        其中<code>options</code>参数为 Loading
        的配置项，具体见下表。 <code>LoadingService</code> 会返回一个 Loading
        实例，可通过调用该实例的 <code>close</code> 方法来关闭它：
      </p>
      <pre>
        <code>{`const loadingInstance = Loading.service(options);
setTimeout(() => {
  // Loading should be closed asynchronously
  loadingInstance.close();
});`}</code>
      </pre>
      <p>
        需要注意的是，以服务的方式调用的全屏 Loading
        是单例的。若在前一个全屏 Loading 关闭前再次调用全屏 Loading，并不会创建一个新的
        Loading 实例，而是返回现有全屏 Loading 的实例：
      </p>
      <pre>
        <code>{`const loadingInstance1 = Loading.service({ fullscreen: true });
const loadingInstance2 = Loading.service({ fullscreen: true });
console.log(loadingInstance1 === loadingInstance2); // true`}</code>
      </pre>
      <p>
        此时调用它们中任意一个的 <code>close</code> 方法都能关闭这个全屏 Loading。
      </p>
      <p>
        如果完整引入了 Element Plus，那么{" "}
        <code>app.config.globalProperties</code> 上会有一个全局方法
        <code>$loading</code>，它的调用方式为：<code>this.$loading(options)</code>
        ，同样会返回一个 Loading 实例。
      </p>

      <Heading level={2} id="应用程序上下文">
        应用程序上下文 <span className="docs-version-tag">2.9.10</span>
      </Heading>
      <p>
        现在 Loading 接受一条 <code>context</code>{" "}
        作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Loading
        中，这将允许你继承应用程序的所有属性。
      </p>
      <p>你可以像这样使用它：</p>
      <DocsContent
        source={`:::tip
如果您全局注册了 ELLoading 组件，它将自动继承应用的上下文环境。

:::`}
      />

      <DocsContent source={API_MD} />
    </>
  );
}
