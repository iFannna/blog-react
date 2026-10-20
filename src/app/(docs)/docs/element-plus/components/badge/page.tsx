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

`;

export default function BadgePage() {
  return (
    <>
      <h1>Badge 徽章</h1>
      <p>按钮和图标上的数字或状态标记。</p>

      <Heading level={2}>基础用法</Heading>
      <p>可以用来展示新消息的数量。</p>
      <p>数量值可接受 Number 或 String。</p>
      <DemoBlock source={SOURCES.basic}>
        <BadgeBasic />
      </DemoBlock>

      <Heading level={2}>最大值</Heading>
      <p>你还可以自定义最大值</p>
      <p>
        由 max 属性定义，接受 Number 值。请注意，仅在值也是 Number 时起作用。
      </p>
      <DemoBlock source={SOURCES.max}>
        <BadgeMax />
      </DemoBlock>

      <Heading level={2}>自定义显示内容</Heading>
      <p>
        你也可以展示除数字以外你想要展示的任何值。或者您可以使用{" "}
        <code>content</code> 栏位自定义内容。
      </p>
      <p>
        当 value 是 String 时，可以显示自定义文字。或者使用{" "}
        <code>content</code> 插槽。
      </p>
      <DemoBlock source={SOURCES.customize}>
        <BadgeCustomize />
      </DemoBlock>

      <Heading level={2}>小红点</Heading>
      <p>通过一个小红点标记来告知用户有新内容。</p>
      <p>
        使用 <code>is-dot</code> 属性。是个布尔值。
      </p>
      <DemoBlock source={SOURCES.dot}>
        <BadgeDot />
      </DemoBlock>

      <Heading level={2} id="偏移量">
        偏移量 <span className="docs-version-tag">2.7.0</span>
      </Heading>
      <p>
        设置徽章点的偏移，格式是[左，顶部]， 代表状态点从左侧和默认位置顶部的偏移。
      </p>
      <DemoBlock source={SOURCES.offset}>
        <BadgeOffset />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
