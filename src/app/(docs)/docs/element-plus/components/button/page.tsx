import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import ButtonBasic from "@/components/element-plus/examples/button/basic";
import ButtonCustom from "@/components/element-plus/examples/button/custom";
import ButtonDisabled from "@/components/element-plus/examples/button/disabled";
import ButtonGroupDemo from "@/components/element-plus/examples/button/group";
import ButtonIcon from "@/components/element-plus/examples/button/icon";
import ButtonLink from "@/components/element-plus/examples/button/link";
import ButtonLoading from "@/components/element-plus/examples/button/loading";
import ButtonSize from "@/components/element-plus/examples/button/size";
import ButtonTag from "@/components/element-plus/examples/button/tag";
import ButtonText from "@/components/element-plus/examples/button/text";

export const metadata: Metadata = {
  title: "Button 按钮",
};

const SOURCES = {
  basic: `<ElButton>Default</ElButton>
<ElButton type="primary">Primary</ElButton>
<ElButton type="success">Success</ElButton>
<ElButton type="info">Info</ElButton>
<ElButton type="warning">Warning</ElButton>
<ElButton type="danger">Danger</ElButton>

<ElButton plain>Plain</ElButton>
<ElButton type="primary" plain>Primary</ElButton>

<ElButton round>Round</ElButton>
<ElButton type="primary" round>Primary</ElButton>

<ElButton dashed>Dashed</ElButton>
<ElButton type="primary" dashed>Primary</ElButton>

<ElButton :icon="Search" circle />
<ElButton type="primary" :icon="Edit" circle />`,

  disabled: `<ElButton disabled>Default</ElButton>
<ElButton type="primary" disabled>Primary</ElButton>
<ElButton type="success" disabled>Success</ElButton>
<ElButton type="info" disabled>Info</ElButton>
<ElButton type="warning" disabled>Warning</ElButton>
<ElButton type="danger" disabled>Danger</ElButton>

<ElButton plain disabled>Plain</ElButton>
<ElButton type="primary" plain disabled>Primary</ElButton>`,

  link: `<ElButton type="primary" link>primary</ElButton>
<ElButton type="success" link>success</ElButton>
<ElButton type="info" link>info</ElButton>
<ElButton type="warning" link>warning</ElButton>
<ElButton type="danger" link>danger</ElButton>`,

  text: `<ElButton text>plain</ElButton>
<ElButton type="primary" text>primary</ElButton>
<ElButton type="success" text>success</ElButton>

<ElButton text bg>plain</ElButton>
<ElButton type="primary" text bg>primary</ElButton>`,

  icon: `<ElButton type="primary" :icon="Edit" />
<ElButton type="primary" :icon="Share" />
<ElButton type="primary" :icon="Delete" />
<ElButton type="primary" :icon="Search">Search</ElButton>
<ElButton type="primary">
  Upload<ElIcon class="el-icon--right"><Upload /></ElIcon>
</ElButton>`,

  group: `<ElButtonGroup>
  <ElButton type="primary" :icon="ArrowLeft">Previous Page</ElButton>
  <ElButton type="primary">
    Next Page<ElIcon class="el-icon--right"><ArrowRight /></ElIcon>
  </ElButton>
</ElButtonGroup>

<ElButtonGroup :direction="direction">
  <ElButton type="primary" :icon="House" />
  <ElButton type="primary" :icon="Operation" />
  <ElButton type="primary" :icon="Notification" />
</ElButtonGroup>`,

  loading: `<ElButton type="primary" loading>Loading</ElButton>
<ElButton type="primary" :loading-icon="Eleme" loading>Loading</ElButton>
<ElButton type="primary" loading>
  <template #loading>
    <CustomLoading />
  </template>
  Loading
</ElButton>`,

  size: `<ElButton size="large">Large</ElButton>
<ElButton>Default</ElButton>
<ElButton size="small">Small</ElButton>
<ElButton size="large" :icon="Search">Search</ElButton>

<ElButton size="large" round>Large</ElButton>
<ElButton round>Default</ElButton>
<ElButton size="small" round>Small</ElButton>

<ElButton :icon="Search" size="large" circle />
<ElButton :icon="Search" circle />
<ElButton :icon="Search" size="small" circle />`,

  tag: `<ElButton>button</ElButton>
<ElButton tag="div" role="button" tabindex="0">div</ElButton>
<ElButton
  type="primary"
  tag="a"
  href="https://github.com/element-plus/element-plus"
  target="_blank"
  rel="noopener noreferrer"
>
  a
</ElButton>`,

  custom: `<ElButton color="#626aef">Default</ElButton>
<ElButton color="#626aef" plain>Plain</ElButton>
<ElButton color="#626aef" link>Link</ElButton>
<ElButton color="#626aef" text>Text</ElButton>
<ElButton color="#626aef" text bg>Text BG</ElButton>

<ElButton color="#626aef" disabled>Disabled</ElButton>
<ElButton color="#626aef" disabled plain>Disabled Plain</ElButton>
<ElButton color="#626aef" disabled link>Disabled Link</ElButton>
<ElButton color="#626aef" disabled text>Disabled Text</ElButton>
<ElButton color="#626aef" disabled text bg>Disabled Text BG</ElButton>`,
};

const API_MD = `
## Button API

### Button Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| type | 按钮类型，在设置 color 时，后者优先。 | ^[enum]\`'default' \\| 'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info' \\| '' \\| 'text' (deprecated)\` | — |
| plain | 是否为朴素按钮 | ^[boolean] | false |
| text ^(2.2.0) | 是否为文字按钮 | ^[boolean] | false |
| bg ^(2.2.0) | 是否显示文字按钮背景颜色 | ^[boolean] | false |
| link ^(2.2.1) | 是否为链接按钮 | ^[boolean] | false |
| round | 是否为圆角按钮 | ^[boolean] | false |
| circle | 是否为圆形按钮 | ^[boolean] | false |
| dashed ^(2.13.3) | 是否是虚线按钮 | ^[boolean] | false |
| loading | 是否为加载中状态 | ^[boolean] | false |
| loading-icon | 自定义加载中状态图标组件 | ^[string] / ^[Component] | Loading |
| disabled | 按钮是否为禁用状态 | ^[boolean] | false |
| icon | 图标组件 | ^[string] / ^[Component] | — |
| autofocus | 原生 autofocus 属性 | ^[boolean] | false |
| native-type | 原生 type 属性 | ^[enum]\`'button' \\| 'submit' \\| 'reset'\` | button |
| auto-insert-space | 两个中文字符之间自动插入空格(仅当文本长度为 2 且所有字符均为中文时才生效) | ^[boolean] | false |
| color | 自定义按钮颜色, 并自动计算 hover 和 active 触发后的颜色 | ^[string] | — |
| dark | dark 模式, 意味着自动设置 color 为 dark 模式的颜色 | ^[boolean] | false |
| tag ^(2.3.4) | 自定义元素标签 | ^[string] / ^[Component] | button |

### Button Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClick | 点击按钮时触发；禁用或加载中时不会触发 | ^[Function]\`(event: MouseEvent) => void\` |

### Button Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | \`children\` |
| loading | 自定义加载中组件 | \`loadingIcon\` |
| icon | 自定义图标组件 | \`icon\` |

### Button Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| ref | 按钮 html 元素 | ^[object]\`Ref<HTMLButtonElement>\` |
| size | 按钮尺寸 | ^[object]\`ComputedRef<'' \\| 'small' \\| 'default' \\| 'large'>\` |
| type | 按钮类型 | ^[object]\`ComputedRef<'' \\| 'default' \\| 'primary' \\| 'success' \\| 'warning' \\| 'info' \\| 'danger' \\| 'text'>\` |
| disabled | 按钮禁用状态 | ^[object]\`ComputedRef<boolean>\` |
| shouldAddSpace | 是否添加空格 | ^[object]\`ComputedRef<boolean>\` |

## ButtonGroup API

### ButtonGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 控制组内按钮的尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| type | 控制组内按钮的类型 | ^[enum]\`'primary' \\| 'success' \\| 'warning' \\| 'danger' \\| 'info'\` | — |
| direction ^(2.11.9) | 显示方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | horizontal |

### ButtonGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义按钮组内容 | Button |

`;

export default function ButtonPage() {
  return (
    <>
      <h1>Button 按钮</h1>
      <p>常用的操作按钮。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        使用 <code>type</code>, <code>plain</code>, <code>round</code>,
        <code>dashed</code> 和 <code>circle</code> 来定义按钮的样式。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ButtonBasic />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        你可以使用 <code>disabled</code> 属性来定义按钮是否被禁用。
      </p>
      <p>
        使用 <code>disabled</code> 属性来控制按钮是否为禁用状态。该属性接受一个{" "}
        <code>Boolean</code> 类型的值。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <ButtonDisabled />
      </DemoBlock>

      <Heading level={2}>链接按钮</Heading>
      <DocsContent
        source={`:::warning

\`type="text"\` 已被 **废弃**，将于版本 ^(3.0.0) 时 **移除**，请考虑切换至新的 API。

新的 API \`link\` 于 ^(2.2.1) 版本时添加，你可以使用 \`type\` API 设置链接按钮的主题样式

:::`}
      />
      <DemoBlock source={SOURCES.link}>
        <ButtonLink />
      </DemoBlock>

      <Heading level={2}>文字按钮</Heading>
      <DocsContent
        source={`:::tip

文字按钮在现在有了全新的设计样式。 ^(2.2.0) 如果您想要使用老版样式的按钮，可以考虑使用 [Link](./link) 组件。

API 也已更新，由于 \`type\` 属性会同时控制按钮的样式，因此我们通过一个新的 API \`text: boolean\` 来控制文字按钮。

:::`}
      />
      <p>没有边框和背景色的按钮。</p>
      <DemoBlock source={SOURCES.text}>
        <ButtonText />
      </DemoBlock>

      <Heading level={2}>图标按钮</Heading>
      <p>
        使用图标为按钮添加更多的含义。你也可以单独使用图标不添加文字来节省显示区域占用。
      </p>
      <p>
        使用 <code>icon</code> 属性来为按钮添加图标。您可以在我们的 Icon
        组件中找到所需图标。通过向右方添加 <code>&lt;i&gt;</code>{" "}
        标签来添加图标，你也可以使用自定义图标。
      </p>
      <DemoBlock source={SOURCES.icon}>
        <ButtonIcon />
      </DemoBlock>

      <Heading level={2}>按钮组</Heading>
      <p>以按钮组的方式出现，常用于多项类似操作。</p>
      <p>
        在 <span className="docs-version-tag">2.11.9</span> 中，您可以使用{" "}
        <code>direction</code> 属性。
      </p>
      <p>
        使用 <code>&lt;el-button-group&gt;</code> 对多个按钮分组。
      </p>
      <DemoBlock source={SOURCES.group}>
        <ButtonGroupDemo />
      </DemoBlock>

      <Heading level={2}>加载状态按钮</Heading>
      <p>点击按钮来加载数据，并向用户反馈加载状态。</p>
      <p>
        通过设置 <code>loading</code> 属性为 <code>true</code>{" "}
        来显示加载中状态。
      </p>
      <DocsContent
        source={`:::tip

您可以使用 \`loading\` 插槽或 \`loadingIcon\` 属性自定义您的 loading 图标。

**ps: \`loading\` 插槽优先级高于 \`loadingIcon\` 属性**

:::`}
      />
      <DemoBlock source={SOURCES.loading}>
        <ButtonLoading />
      </DemoBlock>

      <Heading level={2}>调整尺寸</Heading>
      <p>
        除了默认的大小，按钮组件还提供了几种额外的尺寸可供选择，以便适配不同的场景。
      </p>
      <p>
        使用 <code>size</code> 属性额外配置尺寸，可使用 <code>large</code> 和{" "}
        <code>small</code> 两种值。
      </p>
      <DemoBlock source={SOURCES.size}>
        <ButtonSize />
      </DemoBlock>

      <Heading level={2} id="tag">
        Tag <span className="docs-version-tag">2.3.4</span>
      </Heading>
      <p>您可以自定义元素标签。例如，按钮，div，路由链接，nuxt链接。</p>
      <DemoBlock source={SOURCES.tag}>
        <ButtonTag />
      </DemoBlock>

      <Heading level={2} id="自定义颜色">
        自定义颜色{" "}
        <span className="docs-version-tag docs-version-tag--beta">beta</span>
      </Heading>
      <p>您可以自定义按钮的颜色。</p>
      <p>我们将自动计算按钮处于 hover 和 active 状态时的颜色。</p>
      <p>
        自 <span className="docs-version-tag">2.13.7</span> 起，
        <code>color</code> 属性也适用于 <code>link</code> 和 <code>text</code>{" "}
        按钮。
      </p>
      <DemoBlock source={SOURCES.custom}>
        <ButtonCustom />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
