import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  LinkBasic,
  LinkDisabled,
  LinkIcon,
  LinkUnderline,
} from "@/components/element-plus/examples/link";

export const metadata: Metadata = {
  title: "Link 链接",
};

const SOURCES = {
  basic: `<ElLink type="default" href="#">default 链接</ElLink>
<ElLink type="primary" href="#">primary 链接</ElLink>
<ElLink type="success" href="#">success 链接</ElLink>
<ElLink type="warning" href="#">warning 链接</ElLink>
<ElLink type="danger" href="#">danger 链接</ElLink>
<ElLink type="info" href="#">info 链接</ElLink>`,

  disabled: `<ElLink type="default" href="#" disabled>default 链接</ElLink>
<ElLink type="primary" href="#" disabled>primary 链接</ElLink>
<ElLink type="success" href="#" disabled>success 链接</ElLink>
<ElLink type="warning" href="#" disabled>warning 链接</ElLink>
<ElLink type="danger" href="#" disabled>danger 链接</ElLink>
<ElLink type="info" href="#" disabled>info 链接</ElLink>`,

  underline: `<ElLink type="primary" underline="always" href="#">always 始终显示下划线</ElLink>
<ElLink type="primary" underline="hover" href="#">hover 悬停显示下划线</ElLink>
<ElLink type="primary" underline="never" href="#">never 从不显示下划线</ElLink>`,

  icon: `<ElLink type="primary" icon={<Edit />} href="#">编辑</ElLink>

<ElLink type="primary" href="#">
  右侧图标
  <ElIcon style={{ marginLeft: "0.4rem" }}><Edit /></ElIcon>
</ElLink>`,
};

const API_MD = `
## Link API

### Link Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 链接类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info' \\| 'default'\` | default |
| underline | 下划线时机 | ^[enum]\`'always' \\| 'hover' \\| 'never'\` | hover |
| disabled | 是否禁用 | ^[boolean] | false |
| href | 原生 href | ^[string] | — |
| target | 原生 target | ^[string] | _self |
| icon | 图标，显示在文字左侧 | ^[Component] | — |

### Link Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClick | 点击时触发，禁用时不触发 | ^[Function]\`(event: MouseEvent) => void\` |

### Link Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 链接内容 | \`children\` |
| icon | 图标，显示在文字右侧 | 直接写在 \`children\` 里 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`underline\` 布尔写法 | 未实现 | 官方标记 3.0 移除，请用 \`'always' \\| 'hover' \\| 'never'\` |
| \`<slot name="icon">\` | 直接放 children 里 | 左侧图标用 \`icon\` 属性 |

**实现说明**：

- 禁用或未传 \`href\` 时不下发 \`href\` / \`target\` 属性，链接因此不可聚焦、不可点击，
  与官方的处理一致；禁用时还会 \`preventDefault\` 兜底。
- \`underline\` 为 \`hover\` 且禁用时不加 \`is-hover-underline\` 类，避免禁用态仍有悬停反馈。

\`type\` / \`underline\` 缺省时取 \`ConfigProvider\` 的全局 \`link\` 配置，
再分别回退到 \`default\` / \`hover\`，与官方一致。
`;

export default function LinkPage() {
  return (
    <>
      <h1>Link 链接</h1>
      <p>文字超链接。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        基础的文字链接用法，通过 <code>type</code> 设置类型。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <LinkBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 属性即可禁用链接。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <LinkDisabled />
      </DemoBlock>

      <Heading level={2}>下划线</Heading>
      <p>
        通过 <code>underline</code> 属性控制下划线的显示时机。
      </p>
      <DemoBlock source={SOURCES.underline}>
        <LinkUnderline />
      </DemoBlock>

      <Heading level={2}>图标</Heading>
      <p>
        <code>icon</code> 属性在文字左侧显示图标，右侧图标直接写在
        <code>children</code> 里。
      </p>
      <DemoBlock source={SOURCES.icon}>
        <LinkIcon />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
