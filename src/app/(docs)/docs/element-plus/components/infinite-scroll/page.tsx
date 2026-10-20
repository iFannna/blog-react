import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  InfiniteScrollBasic,
  InfiniteScrollDisableLoading,
} from "@/components/element-plus/examples/infinite-scroll";

export const metadata: Metadata = { title: "Infinite Scroll 无限滚动" };

const SOURCES = {
  basic: `const [count, setCount] = useState(0);
const listRef = useRef<HTMLUListElement>(null);

useInfiniteScroll(listRef, {
  onLoad: () => setCount((value) => value + 2),
});

<ul ref={listRef} className="infinite-list" style={listStyle}>
  {Array.from({ length: count }, (_, index) => (
    <li key={index + 1} className="infinite-list-item" style={itemStyle}>
      {index + 1}
    </li>
  ))}
</ul>`,

  disableLoading: `const [count, setCount] = useState(10);
const [loading, setLoading] = useState(false);
const noMore = count >= 20;
const disabled = loading || noMore;
// 与官方一致：ref 挂在 ul 上，滚动容器是外层可滚动的 wrapper
const listRef = useRef<HTMLUListElement>(null);

useInfiniteScroll(listRef, {
  disabled,
  onLoad: () => {
    setLoading(true);
    window.setTimeout(() => {
      setCount((value) => value + 2);
      setLoading(false);
    }, 2000);
  },
});

<div className="infinite-list-wrapper" style={wrapperStyle}>
  <ul ref={listRef} className="list" style={plainListStyle}>
    {Array.from({ length: count }, (_, index) => (
      <li key={index + 1} className="list-item" style={{ ...dangerItemStyle, marginTop: 10 }}>
        {index + 1}
      </li>
    ))}
  </ul>
  {loading && <p>Loading...</p>}
  {noMore && <p>No more</p>}
</div>`,
};

const API_MD = `
## Infinite Scroll API

### useInfiniteScroll

\`useInfiniteScroll(ref, options)\` 对应官方 \`v-infinite-scroll\` 指令。React 没有指令，
用 hook 承担同一职责：把同一个 ref 挂到滚动元素上即可。

### Options

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onLoad | 滚动到底部时执行的回调，对应 \`v-infinite-scroll\` 的绑定值 | ^[Function]\`() => void\` | — |
| disabled | 是否禁用 | ^[boolean] | false |
| delay | 节流延迟（ms） | ^[number] | 200 |
| distance | 触发距离（px） | ^[number] | 0 |
| immediate | 初始化时若内容未撑满是否立即执行加载 | ^[boolean] | true |

### ElInfiniteScroll

\`useInfiniteScroll\` 的可选包装组件：内置 ref 并渲染一个滚动容器（不额外加语义属性，与官方指令一致）。

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| on-load / disabled / delay / distance / immediate | 同 useInfiniteScroll 的 options | 同上 | 同上 |
| aria-label | 容器无障碍标签 | ^[string] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

`;

export default function InfiniteScrollPage() {
  return (
    <>
      <DocsContent
        source={`:::warning 废弃的 directive

我们将不再维护这个 directive。会在 ^(3.0.0) **被移除**，请使用 [el-scrollbar infinite scroll](./scrollbar#infinite-scroll) 作为代替。

:::`}
      />
      <h1>Infinite Scroll 无限滚动</h1>
      <p>滚动至底部时，加载更多数据。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        在要实现滚动加载的列表上添加<code>v-infinite-scroll</code>
        ，并赋值相应的加载方法，可实现滚动到底部时自动执行加载方法。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <InfiniteScrollBasic />
      </DemoBlock>

      <Heading level={2}>禁用加载</Heading>
      <DemoBlock source={SOURCES.disableLoading}>
        <InfiniteScrollDisableLoading />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
