import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  AffixBasic,
  AffixFixed,
  AffixTarget,
} from "@/components/element-plus/examples/affix";

export const metadata: Metadata = { title: "Affix 固钉" };

const SOURCES = {
  basic: `<ElAffix offset={120}>
  <ElButton type="primary">Offset top 120px</ElButton>
</ElAffix>`,

  target: `<div className="affix-container">
  <ElAffix target=".affix-container" offset={80}>
    <ElButton type="primary">Target container</ElButton>
  </ElAffix>
</div>`,

  fixed: `<ElAffix position="bottom" offset={20}>
  <ElButton type="primary">Offset bottom 20px</ElButton>
</ElAffix>`,
};

const API_MD = `
## Affix API

### Affix Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| offset | 偏移距离，px | ^[number] | 0 |
| position | 固定位置 | ^[enum]\`'top' \\| 'bottom'\` | top |
| target | 目标容器选择器，设置后固钉始终留在容器内，超出范围即隐藏 | ^[string] | — |
| z-index | 固定时的 z-index | ^[number] / ^[string] | 100 |
| teleported | 是否把固钉元素传送到 \`append-to\` | ^[boolean] | false |
| append-to | 传送目标 | ^[CSSSelector] / ^[HTMLElement] | body |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Affix Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 固定状态变化时触发 | ^[Function]\`(fixed: boolean) => void\` |
| onScroll | 滚动时触发 | ^[Function]\`(value: { scrollTop: number, fixed: boolean }) => void\` |

### Affix Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | \`children\` |

### Affix Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| update | 手动更新固钉状态 | ^[Function]\`() => void\` |
| updateRoot | 重新测量 root 尺寸信息 | ^[Function]\`() => void\` |

> 通过 \`ref\` 拿到 expose：\`const ref = useRef<AffixExpose>(null)\`，再调用 \`ref.current?.update()\`。
`;

export default function AffixPage() {
  return (
    <>
      <h1>Affix 固钉</h1>
      <p>将页面元素固定在特定可视区域。</p>

      <Heading level={2}>基础用法</Heading>
      <p>固钉默认固定在页面顶部。</p>
      <p>
        通过设置 <code>offset</code> 属性来改变吸顶距离，默认值为 0。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <AffixBasic />
      </DemoBlock>

      <Heading level={2}>指定容器</Heading>
      <p>
        通过设置 <code>target</code> 属性，让固钉始终保持在容器内，超过范围则隐藏。
      </p>
      <p>请注意容器避免出现滚动条。</p>
      <DemoBlock source={SOURCES.target}>
        <AffixTarget />
      </DemoBlock>

      <Heading level={2}>固定位置</Heading>
      <p>
        Affix 组件提供 2 个固定的位置参数 <code>top</code> 和{" "}
        <code>bottom</code>。
      </p>
      <p>
        通过设置 <code>position</code> 属性来改变固定位置，默认值为{" "}
        <code>top</code> 。
      </p>
      <DemoBlock source={SOURCES.fixed}>
        <AffixFixed />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
