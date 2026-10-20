import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  AvatarBasic,
  AvatarFallback,
  AvatarFit,
  AvatarGroupDemo,
  AvatarTypes,
} from "@/components/element-plus/examples/avatar";

export const metadata: Metadata = {
  title: "Avatar 头像",
};

const SOURCES = {
  basic: `<ElRow>
  <ElCol lg={12} md={12}>
    <div>circle</div>
    <ElAvatar size={50} src={IMG} alt="avatar" />
    <ElAvatar size="small" src={IMG} alt="avatar" />
    <ElAvatar src={IMG} alt="avatar" />
    <ElAvatar size="large" src={IMG} alt="avatar" />
  </ElCol>
  <ElCol lg={12} md={12}>
    <div>square</div>
    <ElAvatar size={50} shape="square" src={IMG} alt="avatar" />
    <ElAvatar size="small" shape="square" src={IMG} alt="avatar" />
    <ElAvatar shape="square" src={IMG} alt="avatar" />
    <ElAvatar size="large" shape="square" src={IMG} alt="avatar" />
  </ElCol>
</ElRow>`,

  types: `<ElAvatar icon={<UserFilled />} />
<ElAvatar src={IMG} alt="avatar" />
<ElAvatar>user</ElAvatar>`,

  fallback: `<ElAvatar size={60} src="https://empty" onError={() => true} alt="avatar">
  <img src={IMG} alt="avatar" />
</ElAvatar>`,

  fit: `<div>
  <span>fill</span>
  <ElAvatar shape="square" size={100} fit="fill" src={IMG} alt="avatar" />
</div>
<div>
  <span>contain</span>
  <ElAvatar shape="square" size={100} fit="contain" src={IMG} alt="avatar" />
</div>
<div>
  <span>cover</span>
  <ElAvatar shape="square" size={100} fit="cover" src={IMG} alt="avatar" />
</div>
<div>
  <span>none</span>
  <ElAvatar shape="square" size={100} fit="none" src={IMG} alt="avatar" />
</div>
<div>
  <span>scale-down</span>
  <ElAvatar shape="square" size={100} fit="scale-down" src={IMG} alt="avatar" />
</div>`,

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

`;

export default function AvatarPage() {
  return (
    <>
      <h1>Avatar 头像</h1>
      <p>
        Avatar 组件可以用来代表人物或对象，支持使用图片、图标或者文字作为 Avatar。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>
        使用 <code>shape</code> 和 <code>size</code> 属性来设置 Avatar
        的形状和大小。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <AvatarBasic />
      </DemoBlock>

      <Heading level={2}>展示类型</Heading>
      <p>支持使用图片，图标或者文字作为 Avatar。</p>
      <DemoBlock source={SOURCES.types}>
        <AvatarTypes />
      </DemoBlock>

      <Heading level={2}>回退行为</Heading>
      <p>图片加载失败时的回退行为。</p>
      <DemoBlock source={SOURCES.fallback}>
        <AvatarFallback />
      </DemoBlock>

      <Heading level={2}>适应容器</Heading>
      <p>
        当使用图片作为用户头像时，设置该图片如何在容器中展示。与
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          object-fit{" "}
        </a>{" "}
        属性一致
      </p>
      <DemoBlock source={SOURCES.fit}>
        <AvatarFit />
      </DemoBlock>

      <Heading level={2} id="头像组">
        头像组 <span className="docs-version-tag">2.13.1</span>
      </Heading>
      <p>显示为头像组</p>
      <p>
        使用标签 <code>&lt;el-avatar-group&gt;</code> 来分组您的头像。
      </p>
      <DemoBlock source={SOURCES.group}>
        <AvatarGroupDemo />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
