import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  CheckTagBasic,
  CheckTagDisabled,
  CheckTagTypes,
} from "@/components/element-plus/examples/check-tag";

export const metadata: Metadata = { title: "CheckTag 可勾选标签" };

const SOURCES = {
  basic: `const [checked, setChecked] = useState(true);

<ElCheckTag checked={checked} onCheckedChange={setChecked}>标签</ElCheckTag>`,

  types: `const [state, setState] = useState({ primary: true });

{["primary", "success", "info", "warning", "danger"].map((t) => (
  <ElCheckTag
    key={t}
    type={t}
    checked={!!state[t]}
    onCheckedChange={(v) => setState((p) => ({ ...p, [t]: v }))}
  >
    {t}
  </ElCheckTag>
))}`,

  disabled: `<ElCheckTag disabled>未选中禁用</ElCheckTag>
<ElCheckTag checked disabled>选中禁用</ElCheckTag>`,
};

const API_MD = `
## CheckTag API

### CheckTag Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 是否选中 | ^[boolean] | false |
| type | 标签类型 | ^[enum]\`'primary' \\| 'success' \\| 'info' \\| 'warning' \\| 'danger'\` | primary |
| disabled | 是否禁用 | ^[boolean] | false |

### CheckTag Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 选中态变化 | ^[Function]\`(checked: boolean) => void\` |

### CheckTag Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 标签内容 | \`children\` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`v-model:checked\` | \`checked\` + \`onCheckedChange\` | React 惯用写法 |

**实现说明**：官方点击时同时派发 \`change\` 与 \`update:checked\` 两个事件，
React 侧合并为一个 \`onCheckedChange\`。禁用时组件不派发任何事件。
`;

export default function CheckTagPage() {
  return (
    <>
      <h1>CheckTag 可勾选标签</h1>
      <p>可勾选的标签，用于快速切换选中状态。</p>

      <Heading level={2}>基础用法</Heading>
      <p>点击标签切换选中状态。</p>
      <DemoBlock source={SOURCES.basic}>
        <CheckTagBasic />
      </DemoBlock>

      <Heading level={2}>不同类型</Heading>
      <p>
        通过 <code>type</code> 设置标签类型。
      </p>
      <DemoBlock source={SOURCES.types}>
        <CheckTagTypes />
      </DemoBlock>

      <Heading level={2}>禁用状态</Heading>
      <p>
        设置 <code>disabled</code> 后点击不再切换。
      </p>
      <DemoBlock source={SOURCES.disabled}>
        <CheckTagDisabled />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
