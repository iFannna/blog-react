import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
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
} from "@/components/element-plus/examples/switch";

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
`;

export default function SwitchPage() {
  return (
    <>
      <h1>Switch 开关</h1>
      <p>表示两种相互对立的状态间的切换，多用于触发「开/关」。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        绑定 <code>v-model</code> 到一个 <code>Boolean</code>{" "}
        类型的变量。可以使用 <code>--el-switch-on-color</code> 属性与{" "}
        <code>--el-switch-off-color</code> 属性来设置开关的背景色。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <SwitchBasic />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <DemoBlock source={SOURCES.sizes}>
        <SwitchSizes />
      </DemoBlock>

      <Heading level={2}>文字描述</Heading>
      <p>
        使用<code>active-text</code>属性与<code>inactive-text</code>
        属性来设置开关的文字描述。使用 <code>inline-prompt</code>{" "}
        属性来控制文本是否显示在点内。
      </p>
      <p>
        使用<code>active-text</code>属性与<code>inactive-text</code>
        属性来设置开关的文字描述。
      </p>
      <DemoBlock source={SOURCES.text}>
        <SwitchText />
      </DemoBlock>

      <Heading level={2}>显示自定义图标</Heading>
      <DocsContent
        source={`:::tip

使用 \`inactive-icon\` 和 \`active-icon\` 属性来添加图标。您可以传递组件名称的字符串（提前注册）或组件本身是一个 SVG Vue 组件。 Element Plus 提供了一套图标，你可以在 [icon](./icon) 找到它们。

:::`}
      />
      <p>
        使用 <code>inactive-icon</code> 和 <code>active-icon</code>{" "}
        属性来添加图标。使用 <code>inline-prompt</code> 属性来控制图标显示在点内。
      </p>
      <DemoBlock source={SOURCES.icons}>
        <SwitchIcons />
      </DemoBlock>

      <Heading level={2}>扩展的 value 类型</Heading>
      <p>
        你可以设置 <code>active-value</code> 和 <code>inactive-value</code>{" "}
        属性，它们接受 <code>Boolean</code>、<code>String</code> 或{" "}
        <code>Number</code> 类型的值。
      </p>
      <DemoBlock source={SOURCES.customValue}>
        <SwitchCustomValue />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置<code>disabled</code>属性，接受一个<code>Boolean</code>
        ，设置<code>true</code>即可禁用。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <SwitchDisabled />
      </DemoBlock>

      <Heading level={2}>加载状态</Heading>
      <p>
        设置<code>loading</code>属性，接受一个<code>Boolean</code>
        ，设置<code>true</code>即加载中状态。
      </p>
      <DemoBlock source={SOURCES.loading}>
        <SwitchLoading />
      </DemoBlock>

      <Heading level={2}>阻止切换</Heading>
      <p>
        设置<code>beforeChange</code>属性，若返回 false 或者返回 Promise 且被
        reject，则停止切换。
      </p>
      <DemoBlock source={SOURCES.beforeChange}>
        <SwitchBeforeChange />
      </DemoBlock>

      <Heading level={2} id="自定义动作图标">
        自定义动作图标 <span className="docs-version-tag">2.3.9</span>
      </Heading>
      <p>
        使用 <code>inactive-action-icon</code> 和{" "}
        <code>active-action-icon</code> 属性来添加图标。
      </p>
      <DemoBlock source={SOURCES.customActionIcon}>
        <SwitchCustomActionIcon />
      </DemoBlock>

      <Heading level={2} id="自定义操作图标">
        自定义操作图标 <span className="docs-version-tag">2.4.4</span>
      </Heading>
      <p>
        使用 <code>active-action</code> 和 <code>inactive-action</code>{" "}
        属性来添加图标。
      </p>
      <DemoBlock source={SOURCES.customActionSlot}>
        <SwitchCustomActionSlot />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
