import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  SkeletonAnimation,
  SkeletonAvoidBouncing,
  SkeletonBasic,
  SkeletonData,
  SkeletonInitialLoading,
  SkeletonLeadingTrailing,
  SkeletonLoading,
  SkeletonRows,
  SkeletonTemplate,
} from "@/components/element-plus/examples/skeleton";

export const metadata: Metadata = {
  title: "Skeleton 骨架屏",
};

const SOURCES = {
  basic: `<ElSkeleton />
<br />
<ElSkeleton style={{ "--el-skeleton-circle-size": "100px" }}>
  <ElSkeletonItem variant="circle" />
</ElSkeleton>`,

  rows: `<ElSkeleton rows={5} />`,

  animation: `<ElSkeleton rows={5} animated />`,

  template: `<ElSkeleton style={{ width: 240 }} template={
  <>
    <ElSkeletonItem variant="image" style={{ width: 240, height: 240 }} />
    <div style={{ padding: 14 }}>
      <ElSkeletonItem variant="p" style={{ width: "50%" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ElSkeletonItem variant="text" style={{ marginRight: 16 }} />
        <ElSkeletonItem variant="text" style={{ width: "30%" }} />
      </div>
    </div>
  </>
} />`,

  loading: `const [loading, setLoading] = useState(true);

<ElSwitch checked={loading} onCheckedChange={setLoading} />

<ElSkeleton
  style={{ width: 240 }}
  loading={loading}
  animated
  template={<CardSkeleton />}
>
  <CardContent />
</ElSkeleton>`,

  data: `const [loading, setLoading] = useState(false);

<ElButton onClick={reload}>Click me to reload</ElButton>

<ElSkeleton
  style={{ display: "flex", gap: 8 }}
  loading={loading}
  animated
  count={3}
  template={<MultiSkeleton />}
>
  {lists.map((item) => (
    <ElCard key={item.name}>...</ElCard>
  ))}
</ElSkeleton>`,

  avoidBouncing: `<ElSkeleton
  style={{ width: 240 }}
  loading={loading}
  animated
  throttle={500}
  template={<CardSkeleton />}
>
  <CardContent />
</ElSkeleton>`,

  initialLoading: `<ElSkeleton
  style={{ width: 240 }}
  loading={loading}
  animated
  throttle={{ leading: 500, initVal: true }}
  template={<CardSkeleton />}
>
  <CardContent />
</ElSkeleton>`,

  leadingTrailing: `<ElSkeleton
  style={{ width: 240 }}
  loading={loading}
  animated
  throttle={{ leading: 500, trailing: 500, initVal: true }}
  template={<CardSkeleton />}
>
  <CardContent />
</ElSkeleton>`,
};

const API_MD = `
## Skeleton API

### Skeleton Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| animated | 是否显示动画 | ^[boolean] | false |
| count | 渲染多少个骨架重复单元 | ^[number] | 1 |
| rows | 段落行数，仅在未传 template 时生效 | ^[number] | 3 |
| loading | 是否处于加载中，false 时渲染真实内容 | ^[boolean] | true |
| throttle | 渲染节流，避免加载态闪烁 | ^[number] / ^[object]\`{ leading?, trailing?, initVal? }\` | 0 |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Skeleton Events

无。

### Skeleton Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 加载完成后展示的真实内容 | \`children\` |
| template | 自定义骨架结构 | \`template\` 属性 |

### SkeletonItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 骨架屏元素类型 | ^[enum]\`'circle' \\| 'rect' \\| 'h1' \\| 'h3' \\| 'text' \\| 'caption' \\| 'p' \\| 'image' \\| 'button'\` | text |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### SkeletonItem Events

无。

### SkeletonItem Slots

无。

### Exposes

Skeleton / SkeletonItem 均无 expose。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`<slot name="template">\` | \`template\` 属性 | 传节点而非插槽 |
| 自定义 CSS 变量写在 style 字符串 | \`style\` 对象（自定义属性需断言） | 如 \`--el-skeleton-circle-size\` |

**实现说明**：

- 官方 \`useThrottleRender\` 的三种形态全部保留：\`0\` 直接透传 loading；数字形态在进入加载态时延时显示；对象形态由 \`leading\` / \`trailing\` 分别控制进入与退出延时，\`initVal\` 指定首次渲染的初始值
- 未传 template 时生成官方默认结构：首行 \`is-first\`（宽 33%），最后一行且行数大于 1 时加 \`is-last\`（宽 61%）
- \`count\` 会重复渲染 template 或默认结构；传入真实内容时内容整体渲染一次
- 基础用法中的圆形骨架通过 CSS 变量 \`--el-skeleton-circle-size\` 控制尺寸，与官方一致
`;

export default function SkeletonPage() {
  return (
    <>
      <h1>Skeleton 骨架屏</h1>
      <p>在需要等待加载内容的位置提供一个占位图形组合。</p>

      <Heading level={2}>基础用法</Heading>
      <p>默认渲染段落骨架；也可通过自定义 template 渲染圆形占位。</p>
      <DemoBlock source={SOURCES.basic}>
        <SkeletonBasic />
      </DemoBlock>

      <Heading level={2}>配置行数</Heading>
      <p>
        通过 <code>rows</code> 属性配置段落行数。
      </p>
      <DemoBlock source={SOURCES.rows}>
        <SkeletonRows />
      </DemoBlock>

      <Heading level={2}>动画效果</Heading>
      <p>
        <code>animated</code> 开启闪烁动画。
      </p>
      <DemoBlock source={SOURCES.animation}>
        <SkeletonAnimation />
      </DemoBlock>

      <Heading level={2}>自定义模板</Heading>
      <p>
        通过 <code>template</code> 传入自定义骨架结构，配合
        <code>ElSkeletonItem</code> 组合出贴近真实布局的占位。
      </p>
      <DemoBlock source={SOURCES.template}>
        <SkeletonTemplate />
      </DemoBlock>

      <Heading level={2}>加载状态</Heading>
      <p>
        开关切换 <code>loading</code>，为 <code>false</code> 时渲染真实内容。
      </p>
      <DemoBlock source={SOURCES.loading}>
        <SkeletonLoading />
      </DemoBlock>

      <Heading level={2}>渲染列表数据</Heading>
      <p>
        <code>count</code> 控制骨架重复单元数量；加载完成后渲染真实卡片列表。
      </p>
      <DemoBlock source={SOURCES.data}>
        <SkeletonData />
      </DemoBlock>

      <Heading level={2}>避免渲染抖动</Heading>
      <p>
        <code>throttle</code> 为数字时，切换加载态会等待指定时间后再渲染，避免骨架闪烁。
      </p>
      <DemoBlock source={SOURCES.avoidBouncing}>
        <SkeletonAvoidBouncing />
      </DemoBlock>

      <Heading level={2}>初始渲染加载态</Heading>
      <p>
        对象形态的 <code>initVal</code> 可指定首次渲染的加载态，
        <code>leading</code> 控制进入延时。
      </p>
      <DemoBlock source={SOURCES.initialLoading}>
        <SkeletonInitialLoading />
      </DemoBlock>

      <Heading level={2}>首尾节流</Heading>
      <p>
        <code>trailing</code> 控制退出加载态的延时，与 <code>leading</code> 配合使用。
      </p>
      <DemoBlock source={SOURCES.leadingTrailing}>
        <SkeletonLeadingTrailing />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
