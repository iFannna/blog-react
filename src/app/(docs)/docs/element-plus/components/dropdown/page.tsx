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
      <p>将动作或菜单折叠到下拉菜单中。</p>

      <Heading level={2}>基础用法</Heading>
      <p>悬停在下拉菜单上以展开更多操作。</p>
      <p>
        通过组件 <code>slot</code> 来设置下拉触发的元素以及需要通过具名{" "}
        <code>slot</code> 为 <code>dropdown</code>{" "}
        来设置下拉菜单。默认情况下，只需要悬停在触发菜单的元素上即可，无需点击也会显示下拉菜单。
      </p>
      <DemoBlock source={SOURCES.basicUsage}>
        <DropdownBasicUsage />
      </DemoBlock>

      <Heading level={2}>位置</Heading>
      <p>支持 6 个位置。</p>
      <p>
        设置 <code>placement</code> 属性，使下拉菜单出现在不同位置。
      </p>
      <DemoBlock source={SOURCES.placements}>
        <DropdownPlacements />
      </DemoBlock>

      <Heading level={2}>触发对象</Heading>
      <p>可使用按钮触发下拉菜单。</p>
      <p>
        设置 <code>split-button</code>{" "}
        属性来让触发下拉元素呈现为按钮组，左边是功能按钮，右边是触发下拉菜单的按钮，设置为{" "}
        <code>true</code>{" "}
        即可。如果你想要在第三和第四个选项之间添加一个分隔符，你只需要为第四个选项添加一个{" "}
        <code>divided</code> 的属性。
      </p>
      <DemoBlock source={SOURCES.triggeringElement}>
        <DropdownTriggeringElement />
      </DemoBlock>

      <Heading level={2}>触发方式</Heading>
      <p>可以配置点击激活或者悬停激活。</p>
      <p>
        将 <code>trigger</code> 属性设置为 click 即可，默认为{" "}
        <code>hover</code>。
      </p>
      <DemoBlock source={SOURCES.howToTrigger}>
        <DropdownHowToTrigger />
      </DemoBlock>

      <Heading level={2}>菜单隐藏方式</Heading>
      <p>
        可以通过 <code>hide-on-click</code> 属性来配置。
      </p>
      <p>
        下拉菜单默认在点击菜单项后会被隐藏，将 hide-on-click 属性设置为 false
        可以关闭此功能。
      </p>
      <DemoBlock source={SOURCES.menuHidingBehavior}>
        <DropdownMenuHidingBehavior />
      </DemoBlock>

      <Heading level={2}>指令事件</Heading>
      <p>
        点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。
      </p>
      <DemoBlock source={SOURCES.commandEvent}>
        <DropdownCommandEvent />
      </DemoBlock>

      <Heading level={2}>下拉方法</Heading>
      <p>
        您可以手动使用 <code>手动打开</code> 或{" "}
        <code>手动关闭下拉菜单以打开或关闭</code>
      </p>
      <DemoBlock source={SOURCES.methods}>
        <DropdownMethods />
      </DemoBlock>

      <Heading level={2}>尺寸</Heading>
      <p>
        Dropdown 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的尺寸。
      </p>
      <p>
        使用 <code>size</code> 属性配置尺寸，可选的尺寸大小有:{" "}
        <code>large</code>, <code>default</code> 或 <code>small</code>
      </p>
      <DemoBlock source={SOURCES.sizes}>
        <DropdownSizes />
      </DemoBlock>

      <Heading level={2} id="虚拟触发">
        虚拟触发<span className="docs-version-tag">2.11.3</span>
      </Heading>
      <p>
        有时候我们想把 dropdown 的触发元素放在别的地方，而不需要写在一起，这时候就可以使用虚拟触发。
      </p>
      <DemoBlock source={SOURCES.virtualTrigger}>
        <DropdownVirtualTrigger />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
