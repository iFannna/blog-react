import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  DropdownBasicUsage,
  DropdownCommandEvent,
  DropdownHowToTrigger,
  DropdownMenuHidingBehavior,
  DropdownMethods,
  DropdownPlacements,
  DropdownSizes,
  DropdownTriggeringElement,
  DropdownVirtualTrigger,
} from "@/components/element-plus/examples/dropdown";

export const metadata: Metadata = { title: "Dropdown 下拉菜单" };

const SOURCES = {
  basicUsage: `<ElDropdown menu={<Actions />}>
  <span style={{ cursor: "pointer" }}>
    Dropdown List
    <ArrowDown style={{ marginLeft: 6 }} />
  </span>
</ElDropdown>,

// Actions 内部是 ElDropdownMenu + ElDropdownItem`,

  placements: `{["top-start", "top", "top-end", "bottom-start", "bottom", "bottom-end"].map((placement) => (
  <ElDropdown key={placement} placement={placement} menu={<Actions />}>
    <ElButton>{placement}</ElButton>
  </ElDropdown>
))}`,

  triggeringElement: `<ElDropdown menu={<Actions />}>
  <ElButton type="primary">
    Dropdown List
    <ArrowDown style={{ marginLeft: 6 }} />
  </ElButton>
</ElDropdown>

<ElDropdown
  splitButton
  type="primary"
  onButtonClick={() => message("button click")}
  menu={<Actions />}
>
  Dropdown List
</ElDropdown>`,

  howToTrigger: `{["hover", "click", "contextmenu"].map((trigger) => (
  <ElDropdown key={trigger} trigger={trigger} menu={<IconActions />}>
    <span style={{ cursor: "pointer" }}>
      Dropdown List
      <ArrowDown style={{ marginLeft: 6 }} />
    </span>
  </ElDropdown>
))}`,

  menuHidingBehavior: `<ElDropdown hideOnClick={false} menu={<Actions />}>
  <span style={{ cursor: "pointer" }}>
    Dropdown List
    <ArrowDown style={{ marginLeft: 6 }} />
  </span>
</ElDropdown>`,

  commandEvent: `<ElDropdown
  onCommand={(command) => message(\`click on item \${String(command)}\`)}
  menu={
    <ElDropdownMenu>
      <ElDropdownItem command="a">Action 1</ElDropdownItem>
      <ElDropdownItem command="b">Action 2</ElDropdownItem>
      <ElDropdownItem command="c">Action 3</ElDropdownItem>
      <ElDropdownItem command="d" disabled>Action 4</ElDropdownItem>
      <ElDropdownItem command="e" divided>Action 5</ElDropdownItem>
    </ElDropdownMenu>
  }
>
  <span style={{ cursor: "pointer" }}>Dropdown List</span>
</ElDropdown>`,

  methods: `const dropdownRef = useRef<DropdownExpose | null>(null);

<ElButton onClick={() => dropdownRef.current?.handleOpen()}>show</ElButton>
<ElDropdown ref={dropdownRef} trigger="contextmenu" menu={<Actions />}>
  <span>Dropdown List1</span>
</ElDropdown>
<ElDropdown
  trigger="contextmenu"
  menu={<Actions />}
  onVisibleChange={(visible) => {
    if (visible) dropdownRef.current?.handleClose();
    else dropdownRef.current?.handleOpen();
  }}
>
  <span>Dropdown List2</span>
</ElDropdown>`,

  sizes: `{["large", "default", "small"].map((size) => (
  <ElDropdown
    key={size}
    size={size === "default" ? undefined : size}
    splitButton
    type="primary"
    menu={<Actions />}
  >
    {size}
  </ElDropdown>
))}`,

  virtualTrigger: `const dropdownRef = useRef<DropdownExpose | null>(null);
const positionRef = useRef({ x: 0, y: 0 });
const virtualRef = useRef({
  getBoundingClientRect: () =>
    new DOMRect(positionRef.current.x, positionRef.current.y, 0, 0),
});

<div
  style={{ height: 200, border: "1px dashed var(--el-border-color)" }}
  onClick={() => dropdownRef.current?.handleClose()}
  onContextMenu={(event) => {
    const { clientX, clientY } = event;
    positionRef.current = { x: clientX, y: clientY };
    event.preventDefault();
    dropdownRef.current?.handleOpen();
  }}
>
  Right click
</div>
<ElDropdown
  ref={dropdownRef}
  virtualTriggering
  virtualRef={virtualRef.current}
  showArrow={false}
  trigger="contextmenu"
  placement="bottom-start"
  menu={<IconActions />}
/>`,
};

const API_MD = `
## Dropdown API

### Dropdown Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| menu | 菜单内容，即 ElDropdownMenu | ^[ReactElement] | — |
| trigger | 触发方式，可传数组组合 | ^[enum]\`'click' \\| 'hover' \\| 'contextmenu'\` / ^[array] | hover |
| trigger-keys | 键盘触发键 | ^[array]\`string[]\` | — |
| placement | 弹出位置 | ^[enum]\`'top' \\| 'top-start' \\| 'top-end' \\| 'bottom' \\| 'bottom-start' \\| 'bottom-end'\` | bottom |
| effect | 主题 | ^[enum]\`'dark' \\| 'light'\` | light |
| split-button | 是否使用分裂按钮 | ^[boolean] | false |
| type | 按钮类型，仅 splitButton 时有效 | ^[string] | — |
| size | 尺寸，同时作用于分裂按钮 | ^[enum]\`'large' \\| 'default' \\| 'small'\` | — |
| hide-on-click | 点击菜单项后是否关闭 | ^[boolean] | true |
| disabled | 是否禁用 | ^[boolean] | false |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| show-timeout | hover 触发的显示延迟 | ^[number] | 150 |
| hide-timeout | hover 触发的隐藏延迟 | ^[number] | 150 |
| max-height | 弹层最大高度 | ^[string] / ^[number] | — |
| role | 弹层 ARIA role | ^[enum]\`'dialog' \\| 'grid' \\| 'group' \\| 'listbox' \\| 'menu' \\| 'navigation' \\| 'tooltip' \\| 'tree'\` | menu |
| tabindex | 触发元素的 tabindex | ^[number] / ^[string] | 0 |
| popper-class / popper-style | 弹层类名 / 样式 | ^[string] / ^[object] | — |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| append-to | 挂载目标 | ^[string] / ^[HTMLElement] | — |
| persistent | 不可见时是否保留 DOM | ^[boolean] | true |
| virtual-triggering | 是否启用虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| visible | 受控显示状态 | ^[boolean] | — |
| z-index | 层级 | ^[number] | — |

### Dropdown Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 触发元素，必须是可接收事件的元素 | \`children\` |
| dropdown | 菜单内容，通常是 ElDropdownMenu | \`menu\` 属性 |

### Dropdown Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCommand | 点击菜单项 | ^[Function]\`(command: unknown) => void\` |
| onButtonClick | 分裂按钮左半部分点击 | ^[Function]\`(event: MouseEvent) => void\` |
| onVisibleChange | 显隐状态变化 | ^[Function]\`(visible: boolean) => void\` |

### Dropdown Exposes

| 方法 | 说明 |
| --- | --- |
| handleOpen() | 打开菜单 |
| handleClose() | 关闭菜单 |
| handleToggle() | 切换菜单显隐 |

### DropdownMenu

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 菜单项列表 | \`children\` |

### DropdownItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| command | 指令，点击时传给 onCommand | ^[string] / ^[number] / ^[object] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| divided | 是否显示分割线 | ^[boolean] | false |
| icon | 图标 | ^[ReactNode] | — |

### DropdownItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 菜单项内容 | \`children\` |
| icon | 自定义图标，会覆盖 icon 属性 | \`icon\` 属性 |
`;

export default function DropdownPage() {
  return (
    <>
      <h1>Dropdown 下拉菜单</h1>
      <p>向下弹出的菜单列表。</p>

      <Heading level={2}>基础用法</Heading>
      <p>
        通过 <code>menu</code> 传入菜单，默认鼠标悬停触发；触发元素由
        <code>children</code> 提供。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <DropdownBasicUsage />
      </DemoBlock>

      <Heading level={2}>弹出位置</Heading>
      <p>
        通过 <code>placement</code> 设置菜单出现的位置。
      </p>
      <DemoBlock source={SOURCES.placements}>
        <DropdownPlacements />
      </DemoBlock>

      <Heading level={2}>触发元素</Heading>
      <p>
        <code>splitButton</code> 把按钮分为两半：左半触发
        <code>onButtonClick</code>，右半展开菜单。
      </p>
      <DemoBlock source={SOURCES.triggeringElement}>
        <DropdownTriggeringElement />
      </DemoBlock>

      <Heading level={2}>触发方式</Heading>
      <p>
        通过 <code>trigger</code> 设置 hover、click 或 contextmenu。
      </p>
      <DemoBlock source={SOURCES.howToTrigger}>
        <DropdownHowToTrigger />
      </DemoBlock>

      <Heading level={2}>菜单隐藏行为</Heading>
      <p>
        默认点击菜单项后关闭；设置 <code>hideOnClick</code> 为
        <code>false</code> 可保持菜单打开。
      </p>
      <DemoBlock source={SOURCES.menuHidingBehavior}>
        <DropdownMenuHidingBehavior />
      </DemoBlock>

      <Heading level={2}>Command 事件</Heading>
      <p>
        菜单项的 <code>command</code> 会传给 <code>onCommand</code>，
        禁用项不会触发。
      </p>
      <DemoBlock source={SOURCES.commandEvent}>
        <DropdownCommandEvent />
      </DemoBlock>

      <Heading level={2}>Dropdown 方法</Heading>
      <p>
        通过 ref 上的 <code>handleOpen</code> / <code>handleClose</code>
        主动控制菜单。
      </p>
      <DemoBlock source={SOURCES.methods}>
        <DropdownMethods />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        通过 <code>size</code> 设置 <code>large</code>、<code>default</code> 或
        <code>small</code>。
      </p>
      <DemoBlock source={SOURCES.sizes}>
        <DropdownSizes />
      </DemoBlock>

      <Heading level={2}>虚拟触发</Heading>
      <p>
        <code>virtualTriggering</code> + <code>virtualRef</code>
        让菜单出现在任意坐标或元素旁。
      </p>
      <DemoBlock source={SOURCES.virtualTrigger}>
        <DropdownVirtualTrigger />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
