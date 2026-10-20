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
      <p>在有限空间内，循环播放同一类型的图片、文字等内容</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        结合使用 <code>el-carousel</code> 和 <code>el-carousel-item</code>{" "}
        标签就得到了一个走马灯。每一个页面的内容是完全可定制的，把你想要展示的内容放在{" "}
        <code>el-carousel-item</code> 标签内。默认情况下，在鼠标 hover
        底部的指示器时就会触发切换。通过设置 <code>trigger</code> 属性为{" "}
        <code>click</code>，可以达到点击触发的效果。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <CarouselBasic />
      </DemoBlock>

      <Heading level={2} id="动态模糊">
        动态模糊 <span className="docs-version-tag">2.6.0</span>
      </Heading>
      <p>添加动态模糊以给走马灯注入活力和流畅性。</p>
      <p>
        启用动态模糊增强了走马灯的活力和流畅性。 <code>motion-blur</code>{" "}
        的默认值是 <code>false</code>，手动激活此功能即可提供视觉感受上的提升。
      </p>
      <DemoBlock source={SOURCES.motionBlur}>
        <CarouselMotionBlur />
      </DemoBlock>

      <Heading level={2}>指示器</Heading>
      <p>可以将指示器的显示位置设置在容器外部</p>
      <p>
        <code>indicator-position</code>{" "}
        属性定义了指示器的位置。默认情况下，它会显示在走马灯内部，设置为{" "}
        <code>outside</code> 则会显示在外部；设置为 <code>none</code>{" "}
        则不会显示指示器。
      </p>
      <DemoBlock source={SOURCES.indicator}>
        <CarouselIndicator />
      </DemoBlock>

      <Heading level={2}>切换箭头</Heading>
      <p>可以设置切换箭头的显示时机</p>
      <p>
        <code>arrow</code> 属性定义了切换箭头的显示时机。默认情况下，切换箭头只有在鼠标
        hover 到走马灯上时才会显示。若将 <code>arrow</code> 设置为{" "}
        <code>always</code>，则会一直显示；设置为 <code>never</code>，则会一直隐藏。
      </p>
      <DemoBlock source={SOURCES.arrows}>
        <CarouselArrows />
      </DemoBlock>

      <Heading level={2}>自动高度</Heading>
      <p>
        当 <code>carousel </code>的<code> height</code> 设置为{" "}
        <code>auto</code>时， <code>carousel</code> 的高度将根据子内容的高度自动设置
      </p>
      <DemoBlock source={SOURCES.autoHeight}>
        <CarouselAutoHeight />
      </DemoBlock>

      <Heading level={2}>卡片模式</Heading>
      <p>当页面宽度方向空间空余，但高度方向空间匮乏时，可使用卡片风格</p>
      <p>
        将 <code>type</code> 属性设置为 <code>card</code>{" "}
        即可启用卡片模式。从交互上来说，卡片模式和一般模式的最大区别在于，卡片模式可以通过直接点击两侧的幻灯片进行切换。
      </p>
      <DemoBlock source={SOURCES.card}>
        <CarouselCard />
      </DemoBlock>

      <Heading level={2}>垂直排列</Heading>
      <p>
        默认情况下，方向 <code>direction</code> 为 水平{" "}
        <code>horizontal</code>。通过设置 <code>direction</code> 为{" "}
        <code>vertical</code> 来让走马灯在垂直方向上显示。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <CarouselVertical />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
