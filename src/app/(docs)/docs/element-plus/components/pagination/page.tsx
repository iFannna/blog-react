import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  PaginationBackground,
  PaginationBasic,
  PaginationHideOnSinglePage,
  PaginationMore,
  PaginationPagerCount,
  PaginationSmall,
} from "@/components/element-plus/examples/pagination";

export const metadata: Metadata = { title: "Pagination 分页" };

const SOURCES = {
  basic: `const [page, setPage] = useState(1);

<ElPagination
  total={400}
  currentPage={page}
  onCurrentPageChange={setPage}
  layout="prev, pager, next"
/>`,

  pagerCount: `{[7, 11, 13].map((count) => (
  <ElPagination
    key={count}
    total={1000}
    currentPage={page}
    onCurrentPageChange={setPage}
    pagerCount={count}
    layout="prev, pager, next"
  />
))}`,

  background: `<ElPagination total={400} currentPage={page} onCurrentPageChange={setPage} background />`,

  small: `<ElPagination total={400} currentPage={page} onCurrentPageChange={setPage} small />`,

  hideOnSinglePage: `<ElPagination total={10} hideOnSinglePage layout="prev, pager, next" />`,

  more: `<ElPagination
  total={400}
  currentPage={page}
  onCurrentPageChange={setPage}
  layout="prev, pager, next, jumper, ->, total, sizes"
  pageSizes={[100, 200, 300, 400]}
/>`,
};

const API_MD = `
## Pagination API

### Pagination Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 总条数 | ^[number] | — |
| page-size | 每页条数 | ^[number] | 10 |
| page-count | 总页数，传入后优先于 total/pageSize 的计算 | ^[number] | — |
| current-page | 当前页 | ^[number] | — |
| pager-count | 页码按钮数量，必须为 5~21 之间的奇数 | ^[number]\`5 \\| 7 \\| 9 \\| 11 \\| 13 \\| 15 \\| 17 \\| 19 \\| 21\` | 7 |
| layout | 组件布局，逗号分隔 | ^[string]\`sizes, prev, pager, next, jumper, ->, total\` | prev, pager, next, jumper, ->, total |
| page-sizes | sizes 下拉的可选值 | ^[array]\`number[]\` | [10, 20, 30, 40, 50, 100] |
| background | 是否显示背景色 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| hide-on-single-page | 只有一页时是否隐藏 | ^[boolean] | false |
| small | 小号分页 | ^[boolean] | false |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| prev-text / next-text | 上一页 / 下一页文字，传入后替换箭头图标 | ^[string] | '' |

### Pagination Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCurrentPageChange | 当前页变化 | ^[Function]\`(page: number) => void\` |
| onPageSizeChange | 每页条数变化 | ^[Function]\`(size: number) => void\` |

### Pagination Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义内容，需在 layout 里声明 \`slot\` |

`;

export default function PaginationPage() {
  return (
    <>
      <h1>Pagination 分页</h1>
      <p>当数据量过多时，使用分页分解数据。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        设置<code>layout</code>，表示需要显示的内容，用逗号分隔，布局元素会依次显示。分页元素包括：<code>prev</code>（跳转到上一页的按钮）、<code>next</code>（跳转到下一页的按钮）、<code>pager</code>（页码列表）、<code>jumper</code>（跳转输入框）、<code>total</code>（总条目数）、<code>sizes</code>（用于设置每页条数的选择器）以及 <code>-&gt;</code>（该符号之后的所有元素将被靠右对齐）。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <PaginationBasic />
      </DemoBlock>

      <Heading level={2}>设置最大页码按钮数</Heading>
      <p>
        默认情况下，当总页数超过 7 页时，Pagination
        会折叠多余的页码按钮。通过 <code>pager-count</code> 属性可以设置最大页码按钮数。
      </p>
      <DemoBlock source={SOURCES.pagerCount}>
        <PaginationPagerCount />
      </DemoBlock>

      <Heading level={2}>带有背景色的分页</Heading>
      <p>
        设置<code>background</code>属性可以为分页按钮添加背景色。
      </p>
      <DemoBlock source={SOURCES.background}>
        <PaginationBackground />
      </DemoBlock>

      <Heading level={2}>小型分页</Heading>
      <p>在空间有限的情况下，可以使用简单的小型分页。</p>
      <p>
        通过<code>size</code>更改大小这是个 <code>small</code>的例子
      </p>
      <DemoBlock source={SOURCES.small}>
        <PaginationSmall />
      </DemoBlock>

      <Heading level={2}>当只有一页时隐藏分页</Heading>
      <p>
        当只有一页时，通过设置 <code>hide-on-single-page</code> 属性来隐藏分页。
      </p>
      <DemoBlock source={SOURCES.hideOnSinglePage}>
        <PaginationHideOnSinglePage />
      </DemoBlock>

      <Heading level={2}>附加功能</Heading>
      <p>根据场景需要，可以添加其他功能模块。</p>
      <p>
        此示例是一个完整的用例。使用了 <code>size-change</code> 和{" "}
        <code>current-change</code> 事件来处理页码大小和当前页变动时候触发的事件。{" "}
        <code>page-sizes</code>接受一个整数类型的数组，数组元素为展示的选择每页显示个数的选项，<code>[100, 200, 300, 400]</code> 表示四个选项，每页显示 100 个，200 个，300 个或者 400 个。
      </p>
      <DemoBlock source={SOURCES.more}>
        <PaginationMore />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
