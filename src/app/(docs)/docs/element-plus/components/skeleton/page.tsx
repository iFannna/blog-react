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

`;

export default function SkeletonPage() {
  return (
    <>
      <h1>Skeleton 骨架屏</h1>
      <p>
        在需要等待加载内容的位置设置一个骨架屏，某些场景下比 Loading
        的视觉效果更好。
      </p>

      <Heading level={2}>基础用法</Heading>
      <p>基础的骨架效果。</p>
      <DemoBlock source={SOURCES.basic}>
        <SkeletonBasic />
      </DemoBlock>

      <Heading level={2}>更多参数</Heading>
      <p>
        可以配置骨架屏段落数量，以便更接近真实渲染效果。显示的数量会比传入的数量多
        1，首行会被渲染一个长度 33% 的段首。
      </p>
      <DemoBlock source={SOURCES.rows}>
        <SkeletonRows />
      </DemoBlock>

      <Heading level={2}>动画效果</Heading>
      <p>
        我们提供了一个开关标志，表明是否显示加载动画， 调用 <code>animated</code>{" "}
        如果真是这样，所有的 <code>el-skeleton</code> 的子节点将显示动画。
      </p>
      <DemoBlock source={SOURCES.animation}>
        <SkeletonAnimation />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <p>
        Element Plus 提供的排版模式有时候并不满足要求，当您想要用自己定义的模板时，可以通过一个具名
        Slot <code>template</code> 来自己设定模板。
      </p>
      <p>
        我们提供了不同的模板单元可供使用，具体可选值请看 API
        详细描述。另外，在构建您自己自定义的骨架时，您应该尽可能更接近于真正的DOM。
        避免DOM因高度差而发生抖动。
      </p>
      <DemoBlock source={SOURCES.template}>
        <SkeletonTemplate />
      </DemoBlock>

      <Heading level={2}>加载状态</Heading>
      <p>
        当 <code>Loading</code> 结束之后，我们往往需要显示真实的 UI，可以通过{" "}
        <code>loading</code> 属性的值来控制是否显示加载后的 DOM。也可以通过具名插槽{" "}
        <code>default</code> 来构建 loading 结束之后需要展示的真实 DOM 元素结构。
      </p>
      <DemoBlock source={SOURCES.loading}>
        <SkeletonLoading />
      </DemoBlock>

      <Heading level={2}>渲染多条数据</Heading>
      <p>
        大多时候, 骨架屏都被用来渲染列表,
        当我们需要在从服务器获取数据的时候来渲染一个假的 UI。 利用 <code>count</code>{" "}
        这个属性就能控制渲染多少条假的数据在页面上
      </p>
      <DocsContent
        source={`:::tip

我们不推荐在浏览器中渲染过多的虚假 UI 元素，这样会消耗更多时间销毁骨架元素，从而引起性能问题。为了用户体验，请尽量将 \`count\` 值保持在小一点的数值。

:::`}
      />
      <DemoBlock source={SOURCES.data}>
        <SkeletonData />
      </DemoBlock>

      <Heading level={2}>防止渲染抖动</Heading>
      <p>
        有的时候，API
        的请求回来的特别快，往往骨架占位刚刚被渲染，真实的数据就已经回来了，用户的界面会突然一闪，此时为了避免这种情况，就需要通过{" "}
        <code>throttle</code> 属性来避免这个问题。
      </p>
      <DocsContent
        source={`:::tip

^(2.8.8)版本里， \`throtle\` 属性支持两个值： \`number\` 和 \`object\`。当通过 \`number\`时，它相当于 \`{leading: xxx}\`，控制骨架屏幕显示的节奏。当然，您也可以通过传递 \`{trailing: xxx}\` 来控制骨架屏消失的节奏。

:::`}
      />
      <DemoBlock source={SOURCES.avoidBouncing}>
        <SkeletonAvoidBouncing />
      </DemoBlock>

      <Heading level={2} id="初始渲染加载">
        初始渲染加载 <span className="docs-version-tag">2.8.8</span>
      </Heading>
      <p>
        当初始值为 loading: true 时，您可以设置{" "}
        <code>{"throttle: {initVal: true, leading: xxx}"}</code>
        来控制初始骨架屏的即时显示，而无需进行节流。
      </p>
      <DemoBlock source={SOURCES.initialLoading}>
        <SkeletonInitialLoading />
      </DemoBlock>

      <Heading level={2} id="切换显示-隐藏时避免渲染抖动">
        切换显示/隐藏时避免渲染抖动{" "}
        <span className="docs-version-tag">2.8.8</span>
      </Heading>
      <DocsContent
        source={`:::tip

您可以设置 \`throttle: {initVal: true, leading: xxx, trailing: xxx}\`，以控制骨架效果的初始显示，并使切换加载状态时骨架效果的过渡更加平滑。

:::`}
      />
      <p>
        有时，当加载状态切换显示或隐藏时，您可能希望业务组件的渲染更加平滑。您可以设置{" "}
        <code>{"throttle: {leading: xxx, trailing: xxx}"}</code> 来控制渲染抖动。
      </p>
      <DemoBlock source={SOURCES.leadingTrailing}>
        <SkeletonLeadingTrailing />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
