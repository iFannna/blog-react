import type { Metadata } from "next";
import DemoBlock from "../DemoBlock";
import { Heading } from "../Heading";
import DocsContent from "../DocsContent";
import {
  AvatarBasic,
  AvatarFallback,
  AvatarFit,
  AvatarGroupDemo,
  AvatarTypes,
} from "@/components/docs/examples/avatar";

export const metadata: Metadata = {
  title: "Avatar 头像",
};

const SOURCES = {
  basic: `const sizeList = [50, "small", undefined, "large"];

<ElRow>
  <ElCol lg={12} md={12}>
    <div>circle</div>
    {sizeList.map((size) => (
      <ElAvatar key={size} size={size} src={IMG} alt="avatar" />
    ))}
  </ElCol>
  <ElCol lg={12} md={12}>
    <div>square</div>
    {sizeList.map((size) => (
      <ElAvatar key={size} size={size} shape="square" src={IMG} alt="avatar" />
    ))}
  </ElCol>
</ElRow>`,

  types: `<ElAvatar icon={<UserFilled />} />
<ElAvatar src={IMG} alt="avatar" />
<ElAvatar>user</ElAvatar>`,

  fallback: `<ElAvatar size={60} src="https://empty" onError={() => true} alt="avatar">
  <img src={IMG} alt="avatar" />
</ElAvatar>`,

  fit: `const fits = ["fill", "contain", "cover", "none", "scale-down"];

{fits.map((fit) => (
  <ElAvatar
    key={fit}
    shape="square"
    size={100}
    fit={fit}
    src={IMG}
    alt="avatar"
  />
))}`,

  group: `const avatars = Array.from({ length: 5 }, (_, index) => (
  <ElAvatar key={index} src={IMG} alt="avatar" />
));

<ElAvatarGroup>{avatars}</ElAvatarGroup>

<ElAvatarGroup collapseAvatars>{avatars}</ElAvatarGroup>

<ElAvatarGroup
  collapseAvatars
  collapseClass="my-collapse-avatar"
  collapseStyle={{ backgroundColor: "#d9ecff", color: "var(--el-color-primary)" }}
>
  {avatars}
</ElAvatarGroup>

<ElAvatarGroup collapseAvatars maxCollapseAvatars={3}>
  {avatars}
</ElAvatarGroup>

<ElAvatarGroup collapseAvatars collapseAvatarsTooltip maxCollapseAvatars={3}>
  {avatars}
</ElAvatarGroup>`,
};

const API_MD = `
## Avatar API

### Avatar Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸，数字按 px 处理，也可传尺寸名 | ^[number] / ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| shape | 形状 | ^[enum]\`'circle' \\| 'square'\` | circle |
| icon | 图标，图片加载失败时回退显示 | ^[Component] | — |
| src | 图片地址 | ^[string] | — |
| alt | 原生 alt | ^[string] | — |
| src-set | 原生 srcSet | ^[string] | — |
| fit | 图片填充方式 | ^[enum]\`'fill' \\| 'contain' \\| 'cover' \\| 'none' \\| 'scale-down'\` | cover |

### Avatar Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onError | 图片加载失败时触发 | ^[Function]\`(event: SyntheticEvent) => void\` |

### AvatarGroup Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 统一尺寸，下发到组内 Avatar | ^[number] / ^[string] | — |
| shape | 统一形状，下发到组内 Avatar | ^[enum]\`'circle' \\| 'square'\` | — |
| collapse-avatars | 是否折叠超出的头像 | ^[boolean] | false |
| collapse-avatars-tooltip | 悬浮折叠头像时展示全部被折叠的头像 | ^[boolean] | false |
| max-collapse-avatars | 最多展示的头像数量 | ^[number] | 1 |
| effect | 折叠提示主题 | ^[enum]\`'dark' \\| 'light'\` | light |
| placement | 折叠提示位置 | ^[enum] placement | top |
| popper-class / popper-style | 折叠提示的自定义类名与样式 | ^[string] / ^[object] | — |
| collapse-class / collapse-style | 折叠头像的类名与样式 | ^[string] / ^[object] | — |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot />\` | \`children\` | 默认内容；Fragment 内的头像同样会被展开计数 |
| \`@error\` | \`onError\` | — |
`;

export default function AvatarPage() {
  return (
    <>
      <h1>Avatar 头像</h1>
      <p>用来代表用户或事物，支持图片、图标或字符展示。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        头像支持圆形与方形两种形状，并可通过 <code>size</code> 设置尺寸；
        数字按 px 处理，也可传入 <code>small</code> / <code>large</code>。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <AvatarBasic />
      </DemoBlock>

      <Heading level={2}>展示类型</Heading>
      <p>
        支持图片、Icon 与字符三种类型，其中 Icon 和字符型可以自定义样式。
      </p>
      <DemoBlock source={SOURCES.types}>
        <AvatarTypes />
      </DemoBlock>

      <Heading level={2}>加载失败</Heading>
      <p>
        图片加载失败时回退到默认插槽内容，可借此展示兜底图片。
      </p>
      <DemoBlock source={SOURCES.fallback}>
        <AvatarFallback />
      </DemoBlock>

      <Heading level={2}>图片填充方式</Heading>
      <p>
        通过 <code>fit</code> 设置图片的 <code>object-fit</code>。
      </p>
      <DemoBlock source={SOURCES.fit}>
        <AvatarFit />
      </DemoBlock>

      <Heading level={2}>头像组</Heading>
      <p>
        使用 <code>ElAvatarGroup</code> 将多个头像组合展示，支持折叠超出的头像，
        并可选择悬浮时展示全部被折叠的头像。
      </p>
      <DemoBlock source={SOURCES.group}>
        <AvatarGroupDemo />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
