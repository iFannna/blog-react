import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TransferBasic,
  TransferFilterable,
  TransferCustomizable,
  TransferEmptyContent,
  TransferPropAlias,
  TransferVirtualScroll,
} from "@/components/element-plus/examples/transfer";

export const metadata: Metadata = { title: "Transfer 穿梭框" };

const SOURCES = {
  basic: `const [value, setValue] = useState([]);
const data = Array.from({ length: 15 }, (_, i) => ({
  key: i + 1,
  label: \`Option \${i + 1}\`,
  disabled: (i + 1) % 4 === 0,
}));

<ElTransfer value={value} onChange={setValue} data={data} />`,

  filterable: `const [value, setValue] = useState([]);

<ElTransfer
  value={value}
  onChange={setValue}
  filterable
  filterMethod={(query, item) =>
    item.initial.toLowerCase().includes(query.toLowerCase())
  }
  filterPlaceholder="State Abbreviations"
  data={data}
/>`,

  customizable: `const [leftValue, setLeftValue] = useState([1]);
const [rightValue, setRightValue] = useState([1]);

const format = {
  noChecked: "\${total}",
  hasChecked: "\${checked}/\${total}",
};

// render-content 版本：用 renderContent 渲染数据项
<ElTransfer
  value={leftValue}
  onChange={setLeftValue}
  filterable
  leftDefaultChecked={[2, 3]}
  rightDefaultChecked={[1]}
  renderContent={(option) => <span>{option.label}</span>}
  titles={["Source", "Target"]}
  buttonTexts={["To left", "To right"]}
  format={format}
  data={data}
  leftFooter={<ElButton size="small">Operation</ElButton>}
  rightFooter={<ElButton size="small">Operation</ElButton>}
/>

// 作用域插槽版本：children 函数等价于默认插槽
<ElTransfer
  value={rightValue}
  onChange={setRightValue}
  filterable
  leftDefaultChecked={[2, 3]}
  rightDefaultChecked={[1]}
  titles={["Source", "Target"]}
  buttonTexts={["To left", "To right"]}
  format={format}
  data={data}
>
  {(option) => <span>{option.key} - {option.label}</span>}
</ElTransfer>`,

  emptyContent: `const [value, setValue] = useState([]);
const empty = <ElEmpty imageSize={60} description="No data" />;

<ElTransfer
  value={value}
  onChange={setValue}
  data={data}
  leftEmpty={empty}
  rightEmpty={empty}
/>`,

  propAlias: `const [value, setValue] = useState([]);

<ElTransfer
  value={value}
  onChange={setValue}
  optionProps={{ key: "value", label: "desc" }}
  data={data}
/>`,

  virtualScroll: `const [value, setValue] = useState([]);

<ElTransfer
  value={value}
  onChange={setValue}
  data={data}
  virtualScroll
  itemSize={30}
/>`,
};

const API_MD = `
## Transfer API

### Transfer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 右侧列表的绑定值，对应官方 model-value / v-model | ^[array]\`TransferKey[]\` | [] |
| data | 数据源 | ^[array]\`TransferDataItem[]\` | [] |
| filterable | 是否可搜索 | ^[boolean] | false |
| filter-placeholder | 搜索框占位文本 | ^[string] | 请输入搜索内容 |
| filter-method | 自定义搜索方法 | ^[Function]\`(query, item) => boolean\` | — |
| target-order | 右侧列表排序策略 | ^[enum]\`'original' \\| 'push' \\| 'unshift'\` | 'original' |
| titles | 自定义列表标题 | ^[array]\`[string, string]\` | [] |
| button-texts | 自定义按钮文案 | ^[array]\`[string, string]\` | [] |
| render-content | 数据项渲染函数 | ^[Function]\`(option) => ReactNode\` | — |
| format | 列表头部勾选统计文案模板 | ^[object]\`TransferFormat\` | {} |
| option-props | 数据源字段别名，对应官方 \`props\` | ^[object]\`TransferPropsAlias\` | — |
| left-default-checked | 左侧列表初始勾选项 | ^[array]\`TransferKey[]\` | [] |
| right-default-checked | 右侧列表初始勾选项 | ^[array]\`TransferKey[]\` | [] |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| virtual-scroll | 是否启用虚拟滚动 | ^[boolean] | false |
| item-size | 虚拟滚动的行高 | ^[number] | 30 |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Transfer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 右侧列表数据变化 | ^[Function]\`(value, direction, movedKeys) => void\` |
| onLeftCheckChange | 左侧列表勾选态变化 | ^[Function]\`(value, movedKeys?) => void\` |
| onRightCheckChange | 右侧列表勾选态变化 | ^[Function]\`(value, movedKeys?) => void\` |

### Transfer Slots（React）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| children | 自定义数据项内容，传入函数即生效 | ^[Function]\`(option: TransferDataItem) => ReactNode\` |
| left-footer / right-footer | 两侧列表底部内容 | ^[ReactNode] |
| left-empty / right-empty | 两侧列表空态内容 | ^[ReactNode] |

### Transfer Exposes（ref）

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| clearQuery | 清空指定面板的搜索词 | ^[Function]\`(which: 'left' \\| 'right') => void\` |
| leftPanel / rightPanel | 左右面板实例：\`query\` 可读写，另提供 \`setQuery(query)\` | ^[object]\`Ref<TransferPanelHandle>\` |

### Type Declarations

| 类型 | 说明 |
| --- | --- |
| \`TransferKey\` | \`string \\| number\` |
| \`TransferDirection\` | \`'left' \\| 'right'\` |
| \`TransferDataItem\` | \`Record<string, any>\` |
| \`TransferFormat\` | \`{ noChecked?: string; hasChecked?: string }\` |
| \`TransferPropsAlias\` | \`{ label?: string; key?: string; disabled?: string }\` |
`;

export default function TransferPage() {
  return (
    <>
      <h1>Transfer 穿梭框</h1>
      <p>在一组列表中选中内容，移动到另一侧完成选择。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>data</code> 传数据，每项需有 <code>key</code> 标识、
        <code>label</code> 显示文本，<code>disabled</code> 可选。
        <code>value</code> 是右侧列表的 key 数组。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <TransferBasic />
      </DemoBlock>

      <Heading level={2}>可搜索</Heading>
      <p>
        设置 <code>filterable</code> 开启搜索；默认按 <code>label</code> 是否包含关键词过滤，
        也可用 <code>filterMethod</code> 自定义匹配逻辑。
      </p>
      <DemoBlock source={SOURCES.filterable}>
        <TransferFilterable />
      </DemoBlock>

      <Heading level={2}>自定义</Heading>
      <p>
        可用 <code>titles</code>、<code>buttonTexts</code>、<code>renderContent</code>、
        <code>format</code> 自定义标题、按钮文案、数据项渲染与头部统计文案；
        用 <code>leftFooter</code> / <code>rightFooter</code> 自定义底部内容；
        用 <code>leftDefaultChecked</code> / <code>rightDefaultChecked</code> 设置初始勾选项。
      </p>
      <DemoBlock source={SOURCES.customizable}>
        <TransferCustomizable />
      </DemoBlock>

      <Heading level={2}>自定义空内容</Heading>
      <p>
        用 <code>leftEmpty</code> / <code>rightEmpty</code> 自定义列表为空或无匹配结果时的内容。
      </p>
      <DemoBlock source={SOURCES.emptyContent}>
        <TransferEmptyContent />
      </DemoBlock>

      <Heading level={2}>数据项别名</Heading>
      <p>
        默认从数据项取 <code>key</code>、<code>label</code>、<code>disabled</code>；
        字段名不同时用 <code>optionProps</code> 声明别名。
      </p>
      <DemoBlock source={SOURCES.propAlias}>
        <TransferPropAlias />
      </DemoBlock>

      <Heading level={2}>虚拟滚动</Heading>
      <p>
        数据量较大时设置 <code>virtualScroll</code> 开启虚拟滚动，用{" "}
        <code>itemSize</code> 指定行高（默认 30px）。
      </p>
      <DemoBlock source={SOURCES.virtualScroll}>
        <TransferVirtualScroll />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
