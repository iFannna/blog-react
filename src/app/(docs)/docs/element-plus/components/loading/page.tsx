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

      <Heading level={2}>容器内加载</Heading>
      <p>
        传入 <code>target</code> 可把遮罩显示在指定容器内，默认覆盖整个页面。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <LoadingBasic />
      </DemoBlock>

      <Heading level={2}>自定义</Heading>
      <p>
        通过 <code>text</code> 设置加载文案，<code>background</code> 设置遮罩背景色。
      </p>
      <DemoBlock source={SOURCES.customization}>
        <LoadingCustomization />
      </DemoBlock>

      <Heading level={2}>全屏加载</Heading>
      <p>
        <code>fullscreen</code> 让遮罩铺满视口；<code>lock</code> 可同时锁定页面滚动。
      </p>
      <DemoBlock source={SOURCES.fullscreen}>
        <LoadingFullscreen />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
