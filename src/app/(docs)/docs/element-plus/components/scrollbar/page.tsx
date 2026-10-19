import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  ScrollbarBasic,
  ScrollbarHorizontal,
  ScrollbarInfinite,
  ScrollbarManual,
  ScrollbarMaxHeight,
} from "@/components/element-plus/examples/scrollbar";

export const metadata: Metadata = { title: "Scrollbar 滚动条" };

const SOURCES = {
  basic: `<ElScrollbar height="400px">
  {Array.from({ length: 20 }, (_, i) => (
    <p key={i + 1} style={itemStyle}>{i + 1}</p>
  ))}
</ElScrollbar>`,

  horizontal: `<ElScrollbar>
  <div style={{ display: "flex", width: "fit-content" }}>
    {Array.from({ length: 50 }, (_, i) => (
      <p key={i + 1} style={{ ...itemStyle, flexShrink: 0, width: 100 }}>{i + 1}</p>
    ))}
  </div>
</ElScrollbar>`,

  maxHeight: `const [count, setCount] = useState(3);

<ElButton onClick={() => setCount((n) => n + 1)}>Add Item</ElButton>
<ElButton onClick={() => setCount((n) => (n > 0 ? n - 1 : 0))}>Delete Item</ElButton>

<ElScrollbar maxHeight="400px">
  {Array.from({ length: count }, (_, i) => (
    <p key={i + 1} style={itemStyle}>{i + 1}</p>
  ))}
</ElScrollbar>`,

  manual: `const scrollbarRef = useRef<ScrollbarExpose>(null);
const [value, setValue] = useState(0);

<ElScrollbar ref={scrollbarRef} height="400px" always>
  {Array.from({ length: 20 }, (_, i) => <p key={i + 1}>{i + 1}</p>)}
</ElScrollbar>

<ElSlider
  value={value}
  max={max}
  onChange={(next) => {
    setValue(Number(next) || 0);
    scrollbarRef.current?.setScrollTop(Number(next) || 0);
  }}
/>`,

  infinite: `const [num, setNum] = useState(30);

<ElScrollbar
  height="400px"
  distance={5}
  onEndReached={(direction) => {
    if (direction === "bottom") setNum((n) => n + 5);
  }}
>
  {Array.from({ length: num }, (_, i) => <p key={i + 1}>{i + 1}</p>)}
</ElScrollbar>`,
};

const API_MD = `
## Scrollbar API

### Scrollbar Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 滚动条高度 | ^[string] / ^[number] | — |
| max-height | 滚动条最大高度 | ^[string] / ^[number] | — |
| native | 是否使用原生滚动条样式 | ^[boolean] | false |
| wrap-style | wrap 容器的样式 | ^[object]\`CSSProperties\` | — |
| wrap-class | wrap 容器的类名 | ^[string] | — |
| view-style | view 的样式 | ^[object]\`CSSProperties\` | — |
| view-class | view 的类名 | ^[string] | — |
| noresize | 容器尺寸不变时置为 true 可省去尺寸监听 | ^[boolean] | false |
| tag | view 的标签名 | ^[string] | div |
| always | 是否总是显示滚动条 | ^[boolean] | false |
| min-size | 滚动条最小尺寸 | ^[number] | 20 |
| id | view 的 id | ^[string] | — |
| role | view 的 role | ^[string] | — |
| aria-label | view 的 aria-label | ^[string] | — |
| aria-orientation | view 的 aria-orientation | ^[enum]\`'horizontal' \\| 'vertical'\` | — |
| tabindex | wrap 的 tabindex | ^[number] / ^[string] | — |
| distance | 触发 end-reached 的距离阈值（px） | ^[number] | 0 |

### Scrollbar Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onScroll | 滚动时触发，返回滚动距离 | ^[Function]\`({ scrollLeft, scrollTop }) => void\` |
| onEndReached | 滚动到边界时触发 | ^[Function]\`(direction: 'top' \\| 'bottom' \\| 'left' \\| 'right') => void\` |

### Scrollbar Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | \`children\` |

### Scrollbar Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| wrapRef | scrollbar wrap 的 ref | ^[object]\`Ref<HTMLDivElement>\` |
| update | 手动更新滚动条状态 | ^[Function]\`() => void\` |
| scrollTo | 滚动到指定坐标 | ^[Function]\`(options \\| number, yCoord?) => void\` |
| setScrollTop | 设置距顶部距离 | ^[Function]\`(scrollTop: number) => void\` |
| setScrollLeft | 设置距左侧距离 | ^[Function]\`(scrollLeft: number) => void\` |
| handleScroll | 处理滚动事件 | ^[Function]\`() => void\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`defineExpose\` 的 \`wrapRef\` | \`ScrollbarExpose.wrapRef\` | 同样是一个 ref 对象 |
| \`wrap-style\` 接受字符串 / 数组 | 只接受 \`CSSProperties\` 对象 | React 的 style 语义 |
| \`@end-reached\` | \`onEndReached\` | 同义 |
| \`@scroll\` | \`onScroll\` | 同义 |

**实现说明**：

- 滑块尺寸与位移的换算逐行对齐官方 \`bar.vue\` 的 \`update\` / \`handleScroll\`，
  包括 \`offsetHeight² / scrollHeight\` 得出原始滑块高度、\`ratio\` 的二次比例换算、
  \`GAP = 4\` 的余量扣除。
- 拖动与点击轨道的换算对齐官方 \`thumb.vue\`，含 \`offsetRatio\` 的实现。
- \`distance > 0\` 时的到达判定用官方那套「到达后要等相反方向也到达才允许再次派发」的去抖逻辑。
- 滑块的显隐（鼠标进出滚动容器）直接改 DOM 的 \`display\`，与官方 \`v-show\` 等价，
  同时避免拖动这种高频操作反复触发 React 渲染。

**未实现的官方能力**：

- 官方的滑块显隐带 \`el-scrollbar-fade\` 过渡动画；本项目直接切 \`display\`，没有淡入淡出。
- 官方 \`onActivated\` 的 keep-alive 滚动位置恢复：Next.js App Router 没有 keep-alive，
  该分支无对应场景。
`;

export default function ScrollbarPage() {
  return (
    <>
      <h1>Scrollbar 滚动条</h1>
      <p>用于替换浏览器原生滚动条。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>height</code> 属性设置滚动条高度，若不设置则根据父容器高度自适应。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <ScrollbarBasic />
      </DemoBlock>

      <Heading level={2}>横向滚动</Heading>
      <p>
        当元素宽度大于滚动条宽度时，会显示横向滚动条。
      </p>
      <DemoBlock source={SOURCES.horizontal}>
        <ScrollbarHorizontal />
      </DemoBlock>

      <Heading level={2}>最大高度</Heading>
      <p>
        当元素高度超过最大高度时，会出现纵向滚动条。
      </p>
      <DemoBlock source={SOURCES.maxHeight}>
        <ScrollbarMaxHeight />
      </DemoBlock>

      <Heading level={2}>手动滚动</Heading>
      <p>
        通过 <code>ref</code> 上的 <code>setScrollTop</code> 等方法可以手动控制滚动位置。
      </p>
      <DemoBlock source={SOURCES.manual}>
        <ScrollbarManual />
      </DemoBlock>

      <Heading level={2}>无限滚动</Heading>
      <p>
        配合 <code>distance</code> 与 <code>onEndReached</code> 可以实现无限滚动加载。
      </p>
      <DemoBlock source={SOURCES.infinite}>
        <ScrollbarInfinite />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
