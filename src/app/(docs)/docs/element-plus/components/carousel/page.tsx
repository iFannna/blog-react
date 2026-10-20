import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  CarouselArrows,
  CarouselAutoHeight,
  CarouselBasic,
  CarouselCard,
  CarouselIndicator,
  CarouselMotionBlur,
  CarouselVertical,
} from "@/components/element-plus/examples/carousel";

export const metadata: Metadata = { title: "Carousel 走马灯" };

const SOURCES = {
  basic: `const itemStyle = (index) => ({
  backgroundColor: index % 2 === 0 ? "#99a9bf" : "#d3dce6",
});

{/* 默认 trigger="hover"，鼠标移入指示器即切换 */}
<ElCarousel height="150px">
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>

{/* trigger="click" 时只有点击指示器才切换 */}
<ElCarousel trigger="click" height="150px">
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,

  motionBlur: `<ElCarousel height="200px" motionBlur>
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>

{/* 纵向同样支持动态模糊 */}
<ElCarousel height="200px" direction="vertical" motionBlur autoplay={false}>
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,

  indicator: `{/* indicatorPosition="outside" 把指示器移到容器外部 */}
<ElCarousel indicatorPosition="outside">
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,

  arrows: `{/* arrow="always" 时箭头常显 */}
<ElCarousel interval={5000} arrow="always">
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,

  autoHeight: `{/* height="auto" 时容器高度跟随当前激活项 */}
<ElCarousel height="auto" autoplay>
  {[100, 200, 300].map((height, index) => (
    <ElCarouselItem
      key={height}
      style={{ ...itemStyle(index + 1), height: \`\${height}px\` }}
    >
      <ItemTitle>{\`height \${height}px\`}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,

  card: `{/* type="card" 时两侧露出相邻卡片，点击侧边卡片可直接切换 */}
<ElCarousel interval={4000} type="card" height="200px">
  {[1, 2, 3, 4, 5, 6].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,

  vertical: `<ElCarousel height="200px" direction="vertical" autoplay={false}>
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>

{/* 纵向 + 卡片化 */}
<ElCarousel height="400px" direction="vertical" type="card" autoplay={false}>
  {[1, 2, 3, 4].map((item) => (
    <ElCarouselItem key={item} style={itemStyle(item)}>
      <ItemTitle>{item}</ItemTitle>
    </ElCarouselItem>
  ))}
</ElCarousel>`,
};

const API_MD = `
## Carousel API

### Carousel Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 轮播高度，设为 \`auto\` 时按激活项高度自适应 | ^[string] | '' |
| initial-index | 初始激活项下标，从 0 开始 | ^[number] | 0 |
| trigger | 指示器触发方式 | ^[enum]\`'hover' \\| 'click'\` | hover |
| autoplay | 是否自动切换 | ^[boolean] | true |
| interval | 自动切换间隔，毫秒 | ^[number] | 3000 |
| indicator-position | 指示器位置 | ^[enum]\`'' \\| 'none' \\| 'outside'\` | '' |
| arrow | 箭头显示时机 | ^[enum]\`'always' \\| 'hover' \\| 'never'\` | hover |
| type | 轮播类型 | ^[enum]\`'' \\| 'card'\` | '' |
| card-scale | 卡片化时非激活项的缩放比例 | ^[number] | 0.83 |
| loop | 是否循环播放 | ^[boolean] | true |
| direction | 展示方向 | ^[enum]\`'horizontal' \\| 'vertical'\` | horizontal |
| pause-on-hover | 鼠标悬停时是否暂停自动切换 | ^[boolean] | true |
| motion-blur | 是否为切换过程加高斯模糊 | ^[boolean] | false |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Carousel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 激活项切换时触发 | ^[Function]\`(current: number, prev: number) => void\` |

### Carousel Exposes（通过 ref 获取）

| 方法 / 属性 | 说明 | 类型 |
| --- | --- | --- |
| activeIndex | 当前激活项下标（只读） | ^[number] |
| setActiveItem | 手动切换到指定项，传下标或项的 name | ^[Function]\`(index: string \\| number) => void\` |
| prev | 切换到上一项 | ^[Function]\`() => void\` |
| next | 切换到下一项 | ^[Function]\`() => void\` |

### Carousel-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 项名称，可在 setActiveItem 中代替下标使用 | ^[string] | '' |
| label | 对应指示器的文本内容 | ^[string] / ^[number] | '' |

`;

export default function CarouselPage() {
  return (
    <>
      <h1>Carousel 走马灯</h1>
      <p>在有限空间内，循环播放同一类型的图片、文字等内容。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        将 <code>ElCarousel</code> 与 <code>ElCarouselItem</code> 组合使用即可得到走马灯。
        幻灯片内容完全可自定义，只需放进 <code>ElCarouselItem</code> 内。默认鼠标移入
        指示器即切换，将 <code>trigger</code> 设为 <code>click</code> 后只有点击指示器才切换。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CarouselBasic />
      </DemoBlock>

      <Heading level={2}>
        动态模糊<span className="docs-version-tag">2.6.0</span>
      </Heading>
      <p>
        开启动态模糊可增强走马灯切换时的动感与流畅度。<code>motionBlur</code> 默认为{" "}
        <code>false</code>，开启后切换过程会带高斯模糊。
      </p>
      <DemoBlock source={SOURCES.motionBlur}>
        <CarouselMotionBlur />
      </DemoBlock>

      <Heading level={2}>指示器</Heading>
      <p>指示器可以显示在走马灯外部。</p>
      <p>
        <code>indicatorPosition</code> 决定指示器位置：默认在内部，设为{" "}
        <code>outside</code> 显示在外部，设为 <code>none</code> 则隐藏。
      </p>
      <DemoBlock source={SOURCES.indicator}>
        <CarouselIndicator />
      </DemoBlock>

      <Heading level={2}>箭头</Heading>
      <p>可以定义箭头显示的时机。</p>
      <p>
        <code>arrow</code> 决定箭头何时显示：默认鼠标移入走马灯时显示，设为{" "}
        <code>always</code> 或 <code>never</code> 表示常显或常隐。
      </p>
      <DemoBlock source={SOURCES.arrows}>
        <CarouselArrows />
      </DemoBlock>

      <Heading level={2}>自动高度</Heading>
      <p>
        当 <code>height</code> 设为 <code>auto</code> 时，走马灯高度会随{" "}
        <code>ElCarouselItem</code> 的高度自动变化。
      </p>
      <DemoBlock source={SOURCES.autoHeight}>
        <CarouselAutoHeight />
      </DemoBlock>

      <Heading level={2}>卡片化</Heading>
      <p>当页面足够宽但高度有限时，可以开启卡片化模式。</p>
      <p>
        将 <code>type</code> 设为 <code>card</code> 即可开启。除了外观，卡片化与普通模式
        最大的区别在于：点击两侧的幻灯片会直接切换走马灯。
      </p>
      <DemoBlock source={SOURCES.card}>
        <CarouselCard />
      </DemoBlock>

      <Heading level={2}>垂直方向</Heading>
      <p>
        <code>direction</code> 默认为 <code>horizontal</code>，设为 <code>vertical</code>{" "}
        即可纵向展示。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <CarouselVertical />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
