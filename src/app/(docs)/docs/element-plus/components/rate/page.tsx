import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  RateAllowHalf,
  RateBasic,
  RateClearable,
  RateMoreIcons,
  RateReadonly,
  RateSizes,
  RateText,
} from "@/components/element-plus/examples/rate";

export const metadata: Metadata = { title: "Rate 评分" };

const SOURCES = {
  basic: `const [value1, setValue1] = useState(0);
const [value2, setValue2] = useState(0);

<ElRate value={value1} onChange={setValue1} />

<ElRate
  value={value2}
  onChange={setValue2}
  colors={["#99A9BF", "#F7BA2A", "#FF9900"]}
/>`,

  sizes: `{(["large", "default", "small"] as ComponentSize[]).map((size) => (
  <ElRate key={size} value={value} onChange={setValue} size={size} />
))}`,

  allowHalf: `<ElRate value={value} onChange={setValue} allowHalf />`,

  text: `<ElRate
  value={value}
  onChange={setValue}
  texts={["oops", "disappointed", "normal", "good", "great"]}
  showText
/>`,

  clearable: `const [value, setValue] = useState(3);

<ElRate value={value} onChange={setValue} clearable />`,

  moreIcons: `<ElRate
  value={value}
  onChange={setValue}
  icons={[ChatRound, ChatLineRound, ChatDotRound]}
  voidIcon={ChatRound}
  colors={["#409eff", "#67c23a", "#FF9900"]}
/>`,

  readonly: `const [value] = useState(3.7);

<ElRate
  value={value}
  disabled
  showScore
  textColor="#ff9900"
  scoreTemplate="{value} points"
/>`,
};

const API_MD = `
## Rate API

### Rate Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前分值，对应官方 model-value / v-model | ^[number] | 0 |
| max | 最大分值 | ^[number] | 5 |
| size | 尺寸 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| disabled | 是否只读 | ^[boolean] | false |
| allow-half | 是否允许半选 | ^[boolean] | false |
| low-threshold | 低分与中分的阈值，阈值本身算低分 | ^[number] | 2 |
| high-threshold | 中分与高分的阈值，阈值本身算高分 | ^[number] | 4 |
| colors | 图标颜色。数组需 3 个元素；对象以阈值为键 | ^[array]\`string[]\` / ^[object]\`Record<number, string>\` | ['#f7ba2a', '#f7ba2a', '#f7ba2a'] |
| void-color | 未选中图标的颜色 | ^[string] | #c6d1de |
| disabled-void-color | 只读时未选中图标的颜色 | ^[string] | #eff2f7 |
| icons | 图标，形态同 colors | ^[array] / ^[object]\`Record<number, IconPropType>\` | [StarFilled, StarFilled, StarFilled] |
| void-icon | 未选中时的图标 | ^[Component] / ^[ReactNode] | Star |
| disabled-void-icon | 只读时未选中图标 | ^[Component] / ^[ReactNode] | StarFilled |
| show-text | 是否显示辅助文字 | ^[boolean] | false |
| show-score | 是否显示当前分值，与 show-text 互斥 | ^[boolean] | false |
| text-color | 辅助文字颜色 | ^[string] | '' |
| texts | 辅助文字数组 | ^[array]\`string[]\` | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] |
| score-template | 分值模板，必须含 \`{value}\` | ^[string] | {value} |
| clearable | 再次点击相同值是否清空为 0 | ^[boolean] | false |
| id | 原生 \`id\` | ^[string] | — |
| aria-label | 原生 \`aria-label\` | ^[string] | rating |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Rate Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 分值变化时触发 | ^[Function]\`(value: number) => void\` |

### Rate Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| setCurrentValue | 设置当前高亮值，不回写 value | ^[Function]\`(value: number) => void\` |
| resetCurrentValue | 重置高亮为 value 对应值，不回写 value | ^[Function]\`() => void\` |

### CSS 变量

| 变量 | 默认值 |
| --- | --- |
| --el-rate-void-color | var(--el-border-color-darker) |
| --el-rate-fill-color | #f7ba2a |
| --el-rate-disabled-void-color | var(--el-fill-color) |
| --el-rate-text-color | var(--el-text-color-primary) |
`;

export default function RatePage() {
  return (
    <>
      <h1>Rate 评分</h1>
      <p>用于评分</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        评分默认被分为三个等级，可以利用颜色数组对分数及情感倾向进行分级（默认情况下不区分颜色）。三个等级所对应的颜色用{" "}
        <code>colors</code> 属性设置，而它们对应的两个阈值则通过{" "}
        <code>low-threshold</code> 和 <code>high-threshold</code> 设定。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <RateBasic />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <DemoBlock source={SOURCES.sizes}>
        <RateSizes />
      </DemoBlock>

      <Heading level={2}>允许半选</Heading>
      <p>
        属性 <code>allow-half</code> 允许出现半星
      </p>
      <DemoBlock source={SOURCES.allowHalf}>
        <RateAllowHalf />
      </DemoBlock>

      <Heading level={2}>辅助文字</Heading>
      <p>用辅助文字直接地表达对应分数</p>
      <p>
        为组件设置 <code>show-text</code>{" "}
        属性会在右侧显示辅助文字。通过设置 <code>texts</code>{" "}
        可以为每一个分值指定对应的辅助文字。 <code>texts</code>{" "}
        为一个数组，长度应等于最大值 <code>max</code>。
      </p>
      <DemoBlock source={SOURCES.text}>
        <RateText />
      </DemoBlock>

      <Heading level={2}>可清空</Heading>
      <p>
        当你再次点击相同的值时，可以将值重置为 <code>0</code>。
      </p>
      <DemoBlock source={SOURCES.clearable}>
        <RateClearable />
      </DemoBlock>

      <Heading level={2}>更多种类的图标</Heading>
      <p>当有多层评价时，可以用不同类型的图标区分评分层级。</p>
      <p>
        设置<code>icons</code>
        属性可以自定义不同分段的图标。 若传入数组，共有 3 个元素，为 3
        个分段所对应的类名；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的类名。本例还使用{" "}
        <code>void-icon</code> 指定了未选中时的图标类名。
      </p>
      <DemoBlock source={SOURCES.moreIcons}>
        <RateMoreIcons />
      </DemoBlock>

      <Heading level={2}>只读</Heading>
      <p>只读的评分用来展示分数，允许出现半星。</p>
      <p>
        为组件设置 <code>disabled</code> 属性表示组件为只读。此时若设置{" "}
        <code>show-score</code>，则会在右侧显示目前的分值。此外，您可以使用属性{" "}
        <code>score-template</code> 来提供评分模板。模板为一个包含了{" "}
        <code>{"{value}"}</code> 的字符串，<code>{"{value}"}</code>{" "}
        会被替换为当前分值。
      </p>
      <DemoBlock source={SOURCES.readonly}>
        <RateReadonly />
      </DemoBlock>

      <Heading level={2}>自定义样式</Heading>
      <p>
        您可以为 rate 组件设定自定义样式。使用 <code>css</code> 或{" "}
        <code>scss</code> 改变全局或局部的颜色。我们设置了一些全局颜色变量：
        <code>--el-rate-void-color</code>、<code>--el-rate-fill-color</code>、
        <code>--el-rate-disabled-void-color</code> 和{" "}
        <code>--el-rate-text-color</code>。您可以像这样使用：
        <code>:root {"{ --el-rate-void-color: red; --el-rate-fill-color: blue; }"}</code>
        。
      </p>

      <DocsContent source={API_MD} />
    </>
  );
}
