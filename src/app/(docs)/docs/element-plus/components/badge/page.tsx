import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  BadgeBasic,
  BadgeCustomize,
  BadgeDot,
  BadgeMax,
  BadgeOffset,
} from "@/components/element-plus/examples/badge";

export const metadata: Metadata = {
  title: "Badge 徽章",
};

const SOURCES = {
  basic: `<ElBadge value={12}>
  <ElButton>评论</ElButton>
</ElBadge>
<ElBadge value={3}>
  <ElButton>回复</ElButton>
</ElBadge>
<ElBadge value={1} type="primary">
  <ElButton>评论</ElButton>
</ElBadge>
<ElBadge value={2} type="warning">
  <ElButton>回复</ElButton>
</ElBadge>
<ElBadge value={1} color="green">
  <ElButton>自定义背景</ElButton>
</ElBadge>
<ElDropdown trigger="click" menu={/* 带徽章的菜单 */}>
  <span>点我</span>
</ElDropdown>`,

  max: `<ElBadge value={200} max={99}>
  <ElButton>评论</ElButton>
</ElBadge>
<ElBadge value={100} max={10}>
  <ElButton>回复</ElButton>
</ElBadge>`,

  customize: `<ElBadge value="new">
  <ElButton>评论</ElButton>
</ElBadge>
<ElBadge value="hot">
  <ElButton>回复</ElButton>
</ElBadge>
<ElBadge
  value={99}
  content={(value) => (
    <div className="custom-content">
      <ElIcon><Message /></ElIcon>
      <span>{value}</span>
    </div>
  )}
>
  <ElButton>分享</ElButton>
</ElBadge>`,

  dot: `<ElBadge isDot>查询</ElBadge>
<ElBadge isDot>
  <ElButton icon={<Share />} type="primary" />
</ElBadge>`,

  offset: `<ElBadge value={1} offset={[10, 5]}>
  <ElButton>偏移</ElButton>
</ElBadge>`,
};

const API_MD = `
## Badge API

### Badge Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 显示值 | ^[string] / ^[number] | — |
| max | 最大值，超出显示 {max}+ 形式，仅 value 为数字时生效 | ^[number] | 99 |
| is-dot | 是否显示为小圆点 | ^[boolean] | false |
| hidden | 是否隐藏徽章 | ^[boolean] | false |
| type | 徽章类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'info' \\| 'danger'\` | danger |
| show-zero | value 为 0 时是否显示 | ^[boolean] | true |
| color | 自定义圆点背景色 | ^[string] | — |
| badge-style | 徽章样式 | ^[object]\`CSSProperties\` | — |
| badge-class | 徽章类名 | ^[string] | — |
| offset | 徽章偏移量 [x, y] | ^[array]\`[number, number]\` | [0, 0] |

### Badge Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 徽章包裹的内容 | \`children\` |
| content | 自定义徽章内容，参数为计算后的值 | \`content\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="content" :value="content">\` | \`content\` 函数 | 参数为计算后的显示值 |

**实现说明**：官方的 \`max\` 截断只在 \`value\` 与 \`max\` **都是数字**时生效，
否则直接显示 \`value\`。React 侧沿用该判断，因此 \`value="new"\` 会原样显示。

官方的 \`el-zoom-in-center\` 过渡依赖 Vue 的 \`<transition>\`，
React 侧由 CSS 承载同一动画类名。
`;

export default function BadgePage() {
  return (
    <>
      <h1>Badge 徽章</h1>
      <p>按钮和图标上的数字或状态标记。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>value</code> 设置显示值，<code>type</code> 设置徽章类型，
        <code>color</code> 可自定义背景色。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <BadgeBasic />
      </DemoBlock>

      <Heading level={2}>最大值</Heading>
      <p>
        通过 <code>max</code> 属性设置最大值，超出时显示{" "}
        <code>{"{max}+"}</code>。仅在 <code>value</code> 为数字时生效。
      </p>
      <DemoBlock source={SOURCES.max}>
        <BadgeMax />
      </DemoBlock>

      <Heading level={2}>自定义内容</Heading>
      <p>
        <code>value</code> 为字符串时可直接显示文本；也可以通过{" "}
        <code>content</code> 渲染函数自定义徽章内容。
      </p>
      <DemoBlock source={SOURCES.customize}>
        <BadgeCustomize />
      </DemoBlock>

      <Heading level={2}>小圆点</Heading>
      <p>
        通过 <code>isDot</code> 属性设置为小圆点，不显示具体数值。
      </p>
      <DemoBlock source={SOURCES.dot}>
        <BadgeDot />
      </DemoBlock>

      <Heading level={2}>偏移量</Heading>
      <p>
        通过 <code>offset</code> 属性设置徽标相对于默认位置的偏移，
        格式为 <code>[left, top]</code>。
      </p>
      <DemoBlock source={SOURCES.offset}>
        <BadgeOffset />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
