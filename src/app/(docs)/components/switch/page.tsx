import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  SwitchBasic,
  SwitchBeforeChange,
  SwitchCustomActionIcon,
  SwitchCustomActionSlot,
  SwitchCustomValue,
  SwitchDisabled,
  SwitchIcons,
  SwitchLoading,
  SwitchSizes,
  SwitchText,
} from "@/components/docs/examples/switch";

export const metadata: Metadata = {
  title: "Switch 开关",
};

const SOURCES = {
  basic: `const [checked, setChecked] = useState(false);

<ElSwitch checked={checked} onCheckedChange={setChecked} />`,

  disabled: `<ElSwitch disabled />
<ElSwitch checked disabled />`,

  text: `<ElSwitch checked={checked} onCheckedChange={setChecked} activeText="开" inactiveText="关" />

<ElSwitch
  checked={checked}
  onCheckedChange={setChecked}
  inlinePrompt
  activeText="是"
  inactiveText="否"
/>`,

  icons: `<ElSwitch
  checked={checked}
  onCheckedChange={setChecked}
  activeIcon={<Check />}
  inactiveIcon={<Close />}
/>

<ElSwitch
  checked={checked2}
  onCheckedChange={setChecked2}
  inlinePrompt
  activeIcon={<Check />}
  inactiveIcon={<Close />}
/>`,

  sizes: `<ElSwitch checked={checked} onCheckedChange={setChecked} size="large" />
<ElSwitch checked={checked} onCheckedChange={setChecked} />
<ElSwitch checked={checked} onCheckedChange={setChecked} size="small" />`,

  customValue: `const [value, setValue] = useState<string>("off");

<ElSwitch
  value={value}
  onChange={(next) => setValue(String(next))}
  activeValue="on"
  inactiveValue="off"
  activeText="on"
  inactiveText="off"
/>`,

  beforeChange: `<ElSwitch
  checked={checked}
  onCheckedChange={setChecked}
  beforeChange={() =>
    new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(true), 600);
    })
  }
/>`,

  loading: `<ElSwitch checked loading />
<ElSwitch loading />`,

  customActionIcon: `<ElSwitch
  checked={checked}
  onCheckedChange={setChecked}
  activeActionIcon={<View />}
  inactiveActionIcon={<Hide />}
/>`,

  customActionSlot: `<ElSwitch
  checked={checked}
  onCheckedChange={setChecked}
  activeActionContent={<span>T</span>}
  inactiveActionContent={<span>F</span>}
/>`,
};

const API_MD = `
## Switch API

### Switch Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 布尔模式下的选中态 | ^[boolean] | false |
| value | 自定义值模式下的当前值 | ^[boolean] / ^[string] / ^[number] | — |
| active-value | 开启时的值，传入即启用自定义值模式 | ^[boolean] / ^[string] / ^[number] | true |
| inactive-value | 关闭时的值 | ^[boolean] / ^[string] / ^[number] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| loading | 是否处于加载中 | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| width | 开关宽度 | ^[string] / ^[number] | — |
| inline-prompt | 文字或图标是否显示在圆点内部 | ^[boolean] | false |
| active-text | 开启时的文字 | ^[string] | — |
| inactive-text | 关闭时的文字 | ^[string] | — |
| active-icon | 开启时的图标，优先于 active-text | ^[Component] | — |
| inactive-icon | 关闭时的图标，优先于 inactive-text | ^[Component] | — |
| active-action-icon | 圆点上开启态的动作图标 | ^[Component] | — |
| inactive-action-icon | 圆点上关闭态的动作图标 | ^[Component] | — |
| active-action-content | 圆点上开启态的动作内容，优先于 active-action-icon | ^[ReactNode] | — |
| inactive-action-content | 圆点上关闭态的动作内容，优先于 inactive-action-icon | ^[ReactNode] | — |
| name | 原生 name 属性 | ^[string] | — |
| id | 原生 id 属性 | ^[string] | — |
| tabindex | 原生 tabindex 属性 | ^[string] / ^[number] | — |
| aria-label | 无障碍标签 | ^[string] | — |
| before-change | 切换前钩子，返回 false 或 reject 的 Promise 阻止切换 | ^[Function]\`() => boolean \\| Promise<boolean>\` | — |

### Switch Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 布尔模式下选中态变化 | ^[Function]\`(checked: boolean) => void\` |
| onChange | 自定义值模式下值变化 | ^[Function]\`(value: SwitchValue) => void\` |

### Switch Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| active | 开启态文字/图标内容 | \`activeContent\` |
| inactive | 关闭态文字/图标内容 | \`inactiveContent\` |
| active-action | 开启态动作区内容 | \`activeActionContent\` |
| inactive-action | 关闭态动作区内容 | \`inactiveActionContent\` |

### Switch Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 手动聚焦开关 | ^[Function]\`() => void\` |
| checked | 当前是否开启 | ^[boolean] |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model\`（布尔） | \`checked\` + \`onCheckedChange\` | 未传 activeValue/inactiveValue 时 |
| \`v-model\`（自定义值） | \`value\` + \`onChange\` | 传了 activeValue/inactiveValue 时 |
| \`@change\` / \`@input\` | \`onCheckedChange\` / \`onChange\` | 官方两个事件在同一动作里同时触发，React 侧合并为一个 |
| \`active\` / \`inactive\` 插槽 | \`activeContent\` / \`inactiveContent\` | 文字与图标内容 |
| \`active-action\` / \`inactive-action\` 插槽 | \`activeActionContent\` / \`inactiveActionContent\` | 圆点动作区内容 |
| \`ref\` 暴露的 \`focus()\` / \`checked\` | 未实现 | React 侧未提供 imperative handle |

**实现说明**：官方在 modelValue 既不等于 activeValue 也不等于 inactiveValue 时，
会警告并回退到 inactiveValue。React 侧沿用该回退逻辑但去掉了控制台警告，
因为 SSR 阶段无法安全输出警告。

\`validate-event\` 已接入 ElFormItem：当前值变化后触发 \`change\` 校验。
`;

export default function SwitchPage() {
  return (
    <>
      <h1>Switch 开关</h1>
      <p>表示两种相互对立的状态间的切换，多用于触发「开/关」。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        绑定 <code>checked</code> 与 <code>onCheckedChange</code>，默认值为布尔类型。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <SwitchBasic />
      </DemoBlock>

      <Heading level={2}>自定义动作图标</Heading>
      <p>
        使用 <code>activeActionIcon</code> 和 <code>inactiveActionIcon</code>
        设置圆点上的动作图标。
      </p>
      <DemoBlock source={SOURCES.customActionIcon}>
        <SwitchCustomActionIcon />
      </DemoBlock>

      <Heading level={2}>自定义动作插槽</Heading>
      <p>
        官方通过 <code>active-action</code> / <code>inactive-action</code>
        插槽自定义动作区内容；React 侧对应
        <code>activeActionContent</code> 与 <code>inactiveActionContent</code>。
      </p>
      <DemoBlock source={SOURCES.customActionSlot}>
        <SwitchCustomActionSlot />
      </DemoBlock>

      <Heading level={2}>显示图标</Heading>
      <p>
        使用 <code>activeIcon</code> 和 <code>inactiveIcon</code> 属性来设置开关的图标。
      </p>
      <DemoBlock source={SOURCES.icons}>
        <SwitchIcons />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 属性，接受一个 boolean，设置为 true 即可禁用。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <SwitchDisabled />
      </DemoBlock>

      <Heading level={2}>扩展的 value 类型</Heading>
      <p>
        通过 <code>activeValue</code> 和 <code>inactiveValue</code> 属性，
        可以自定义开关的值。传入后改用 <code>value</code> 与 <code>onChange</code>。
      </p>
      <DemoBlock source={SOURCES.customValue}>
        <SwitchCustomValue />
      </DemoBlock>

      <Heading level={2}>加载中</Heading>
      <p>
        设置 <code>loading</code> 属性，表示正在加载中。加载状态下开关不可操作。
      </p>
      <DemoBlock source={SOURCES.loading}>
        <SwitchLoading />
      </DemoBlock>

      <Heading level={2}>切换前的钩子</Heading>
      <p>
        设置 <code>beforeChange</code> 属性，在切换前进行判断，
        返回 false 或 reject 的 Promise 都会阻止切换。
      </p>
      <DemoBlock source={SOURCES.beforeChange}>
        <SwitchBeforeChange />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <DemoBlock source={SOURCES.sizes}>
        <SwitchSizes />
      </DemoBlock>

      <Heading level={2}>文字描述</Heading>
      <p>
        使用 <code>activeText</code> 和 <code>inactiveText</code> 属性来设置开关的文字描述。
        使用 <code>inlinePrompt</code> 属性可以将文字或图标显示在圆点内部。
      </p>
      <DemoBlock source={SOURCES.text}>
        <SwitchText />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
