import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  MenuBasic,
  MenuCollapse,
  MenuLeftAndRight,
  MenuPopperOffset,
  MenuVertical,
} from "@/components/element-plus/examples/menu";

export const metadata: Metadata = {
  title: "Menu 菜单",
};

const SOURCES = {
  basic: `const [activeIndex, setActiveIndex] = useState("1");
const [activeIndex2, setActiveIndex2] = useState("1");

<ElMenu
  defaultActive={activeIndex}
  mode="horizontal"
  className="el-menu-demo"
  onSelect={(index) => setActiveIndex(index)}
>
  <ElMenuItem index="1">Processing Center</ElMenuItem>
  <ElSubMenu index="2" title="Workspace">
    <ElMenuItem index="2-1">item one</ElMenuItem>
    <ElMenuItem index="2-2">item two</ElMenuItem>
    <ElMenuItem index="2-3">item three</ElMenuItem>
    <ElSubMenu index="2-4" title="item four">
      <ElMenuItem index="2-4-1">item one</ElMenuItem>
      {/* ... */}
    </ElSubMenu>
  </ElSubMenu>
  <ElMenuItem index="3" disabled>Info</ElMenuItem>
  <ElMenuItem index="4">Orders</ElMenuItem>
</ElMenu>

<ElMenu
  defaultActive={activeIndex2}
  mode="horizontal"
  className="el-menu-demo"
  backgroundColor="#545c64"
  textColor="#fff"
  activeTextColor="#ffd04b"
  onSelect={(index) => setActiveIndex2(index)}
>
  {/* 同样的菜单结构 */}
</ElMenu>`,

  leftAndRight: `<ElMenu
  defaultActive={activeIndex}
  mode="horizontal"
  className="el-menu-demo"
  ellipsis={false}
  textColor="#303133"
  onSelect={(index) => setActiveIndex(index)}
>
  <ElMenuItem index="0" style={{ marginRight: "auto" }}>
    Element Plus
  </ElMenuItem>
  <ElMenuItem index="1">Processing Center</ElMenuItem>
  <ElSubMenu index="2" title="Workspace">
    {/* ... */}
  </ElSubMenu>
</ElMenu>`,

  vertical: `<ElMenu
  defaultActive={activeIndex}
  className="el-menu-vertical-demo"
  style={{ width: 200, minHeight: 400 }}
  onSelect={(index) => setActiveIndex(index)}
>
  <ElSubMenu index="1" title={<><ElIcon><House /></ElIcon><span>Navigator One</span></>}>
    <ElMenuItemGroup title="Group One">
      <ElMenuItem index="1-1">item one</ElMenuItem>
      <ElMenuItem index="1-2">item two</ElMenuItem>
    </ElMenuItemGroup>
    <ElMenuItemGroup title="Group Two">
      <ElMenuItem index="1-3">item three</ElMenuItem>
    </ElMenuItemGroup>
    <ElSubMenu index="1-4" title="item four">
      <ElMenuItem index="1-4-1">item one</ElMenuItem>
    </ElSubMenu>
  </ElSubMenu>
  <ElMenuItem index="2">
    <ElIcon><Menu /></ElIcon>
    <span>Navigator Two</span>
  </ElMenuItem>
  {/* ... */}
</ElMenu>`,

  collapse: `const [isCollapse, setIsCollapse] = useState(true);

<ElRadioGroup
  value={isCollapse}
  onChange={(value) => setIsCollapse(Boolean(value))}
  type="button"
>
  <ElRadio value={false} label="expand" />
  <ElRadio value={true} label="collapse" />
</ElRadioGroup>

<ElMenu defaultActive="2" collapse={isCollapse}>
  <ElSubMenu
    index="1"
    title={<><ElIcon><House /></ElIcon><span>Navigator One</span></>}
  >
    {/* ... */}
  </ElSubMenu>
  <ElMenuItem index="2" title="Navigator Two">
    <ElIcon><Menu /></ElIcon>
  </ElMenuItem>
  <ElMenuItem index="3" disabled title="Navigator Three">
    <ElIcon><Document /></ElIcon>
  </ElMenuItem>
  <ElMenuItem index="4" title="Navigator Four">
    <ElIcon><Setting /></ElIcon>
  </ElMenuItem>
</ElMenu>`,

  popperOffset: `<ElMenu
  ellipsis
  className="el-menu-popper-demo"
  mode="horizontal"
  popperOffset={16}
  style={{ maxWidth: 600 }}
>
  <ElMenuItem index="1">Processing Center</ElMenuItem>
  <ElSubMenu index="2" title="Workspace">
    {/* 继承根菜单的 16 */}
  </ElSubMenu>
  <ElSubMenu index="3" popperOffset={8} title="Override Popper Offset">
    {/* 覆盖为 8 */}
    <ElSubMenu index="3-4" popperOffset={20} title="override child">
      {/* 继续覆盖为 20 */}
    </ElSubMenu>
  </ElSubMenu>
  {/* ... */}
</ElMenu>`,
};

const API_MD = `
## Menu API

### Menu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 菜单展示模式 | ^[enum]\`'horizontal' \\| 'vertical'\` | vertical |
| collapse | 是否收起菜单（仅纵向模式） | ^[boolean] | false |
| ellipsis | 是否开启省略号收起（仅横向模式） | ^[boolean] | true |
| ellipsisIcon | 自定义省略号图标（仅横向模式且开启省略号） | ^[ReactNode] | — |
| popperOffset | 所有子菜单浮层与触发元素的间距 | ^[number] | 6 |
| defaultActive | 页面加载时激活菜单的 index | ^[string] | '' |
| defaultOpeneds | 初始展开的子菜单 index 数组 | ^[array]\`string[]\` | [] |
| uniqueOpened | 是否只保持一个子菜单展开 | ^[boolean] | false |
| menuTrigger | 子菜单触发方式，仅在横向模式生效 | ^[enum]\`'hover' \\| 'click'\` | hover |
| router | 是否启用路由模式，开启后 index 作为跳转路径 | ^[boolean] | false |
| collapseTransition | 是否开启收起过渡 | ^[boolean] | true |
| popperEffect | 收起态下 tooltip 的主题 | ^[enum]\`'dark' \\| 'light'\` / ^[string] | dark |
| closeOnClickOutside | 点击菜单外部时是否收起全部子菜单 | ^[boolean] | false |
| popperClass | 所有浮层的自定义类名 | ^[string] | — |
| popperStyle | 所有浮层的自定义样式 | ^[object]\`CSSProperties\` | — |
| showTimeout | 所有子菜单显示前的延时 | ^[number] | 300 |
| hideTimeout | 所有子菜单隐藏前的延时 | ^[number] | 300 |
| persistent | 浮层不活跃时是否保留 DOM | ^[boolean] | true |
| backgroundColor | 已废弃，改用 CSS 变量 \`--el-menu-bg-color\` | ^[string] | #ffffff |
| textColor | 已废弃，改用 CSS 变量 \`--el-menu-text-color\` | ^[string] | #303133 |
| activeTextColor | 已废弃，改用 CSS 变量 \`--el-menu-active-color\` | ^[string] | #409eff |

### Menu Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onSelect | 菜单项被激活时触发 | ^[Function]\`MenuSelectEvent\` |
| onOpen | 子菜单展开时触发 | ^[Function]\`MenuOpenEvent\` |
| onClose | 子菜单收起时触发 | ^[Function]\`MenuCloseEvent\` |

### Menu Slots（React children）

| 名称 | 说明 | 子标签 |
| --- | --- | --- |
| children | 自定义默认内容 | SubMenu / MenuItem / MenuItemGroup |

### Menu Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| open | 展开指定子菜单 | ^[Function]\`(index: string) => void\` |
| close | 收起指定子菜单 | ^[Function]\`(index: string) => void\` |
| handleResize | 手动触发菜单宽度重新计算 | ^[Function]\`() => void\` |
| updateActiveIndex | 设置激活菜单的 index | ^[Function]\`(index: string) => void\` |

## SubMenu API

### SubMenu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | ^[string] | — |
| popperClass | 浮层菜单的自定义类名 | ^[string] | — |
| popperStyle | 浮层菜单的自定义样式 | ^[object]\`CSSProperties\` | — |
| showTimeout | 展开前的延时，缺省继承根菜单 | ^[number] | — |
| hideTimeout | 收起前的延时，缺省继承根菜单 | ^[number] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| teleported | 浮层是否挂载到 body，第一层默认为 true，其余默认为 false | ^[boolean] | undefined |
| popperOffset | 浮层偏移，覆盖根菜单的 \`popperOffset\` | ^[number] | — |
| expandCloseIcon | 展开态且子菜单收起时的图标，需与 \`expandOpenIcon\` 成对传入 | ^[ReactNode] | — |
| expandOpenIcon | 展开态且子菜单展开时的图标，需与 \`expandCloseIcon\` 成对传入 | ^[ReactNode] | — |
| collapseCloseIcon | 收起态且子菜单收起时的图标，需与 \`collapseOpenIcon\` 成对传入 | ^[ReactNode] | — |
| collapseOpenIcon | 收起态且子菜单展开时的图标，需与 \`collapseCloseIcon\` 成对传入 | ^[ReactNode] | — |

### SubMenu Slots

| 名称 | 说明 | 子标签 |
| --- | --- | --- |
| children | 自定义默认内容 | SubMenu / MenuItem / MenuItemGroup |
| title | 自定义标题内容，React 通过 \`title\` prop 传入 | — |

## Menu-Item API

### Menu-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| index | 唯一标识（必填） | ^[string] | — |
| route | 路由参数，开启 \`router\` 时使用 | ^[string] / ^[object] | — |
| disabled | 是否禁用 | ^[boolean] | false |

### Menu-Item Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onClick | 菜单项被点击时触发，参数为菜单项的注册信息 | ^[Function]\`(item: MenuItemRegistered) => void\` |

### Menu-Item Slots

| 名称 | 说明 |
| --- | --- |
| children | 自定义默认内容 |
| title | 自定义标题内容，React 通过 \`title\` prop 传入 |

## Menu-Item-Group API

### Menu-Item-Group Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题 | ^[string] | — |

### Menu-Item-Group Slots

| 名称 | 说明 | 子标签 |
| --- | --- | --- |
| children | 自定义默认内容 | MenuItem |
| title | 自定义分组标题，React 通过 \`title\` prop 传入 | — |

## Type Declarations

\`\`\`ts
type MenuSelectEvent = (
  index: string,
  indexPath: string[],
  item: MenuItemClicked,
  routerResult?: Promise<void | NavigationFailure>
) => void

type MenuOpenEvent = (index: string, indexPath: string[]) => void

type MenuCloseEvent = (index: string, indexPath: string[]) => void

interface MenuItemRegistered {
  index: string
  indexPath: string[]
  active: boolean
}

interface MenuItemClicked {
  index: string
  indexPath: string[]
  route?: RouteLocationRaw
}
\`\`\`

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| \`default-active\` / \`default-openeds\` | \`defaultActive\` / \`defaultOpeneds\` | 保持非受控语义；\`defaultActive\` 变化时同步激活项 |
| \`@select\` / \`@open\` / \`@close\` | \`onSelect\` / \`onOpen\` / \`onClose\` | 事件改为 on 前缀 |
| 默认插槽 | \`children\` | — |
| \`title\` 具名插槽 | \`title\` prop（ReactNode） | SubMenu、MenuItem、MenuItemGroup 一致 |
| 图标以组件或字符串传入 | 直接传 \`ReactNode\` | 例如 \`expandOpenIcon={<ArrowDown />}\` |
| \`ref\` + defineExpose | \`ref\` + \`MenuExpose\` | 方法名保持一致 |
| \`vue-router\` 模式 | 保留 \`router\` prop，不做实际跳转 | 由业务侧在 \`onSelect\` 中处理导航 |
`;

export default function MenuPage() {
  return (
    <>
      <h1>Menu 菜单</h1>
      <p>为网站提供导航功能的菜单。</p>
      <p>
        如需覆盖 <code>el-menu</code> 的默认高度，可以使用：
      </p>
      <pre>
        <code>{`.el-menu--horizontal {
  --el-menu-horizontal-height: 100px;
}`}</code>
      </pre>

      <Heading level={2}>顶栏</Heading>
      <p>
        顶栏菜单可用于多种场景。菜单默认是纵向的，将 <code>mode</code> 设为{" "}
        <code>horizontal</code> 即可切换为横向。配合 <code>ElSubMenu</code>{" "}
        可创建二级菜单，并通过 <code>backgroundColor</code>、<code>textColor</code>{" "}
        与 <code>activeTextColor</code> 自定义配色。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <MenuBasic />
      </DemoBlock>

      <Heading level={2}>折叠</Heading>
      <p>纵向菜单可以折叠。</p>
      <DemoBlock source={SOURCES.collapse}>
        <MenuCollapse />
      </DemoBlock>

      <Heading level={2}>左右分布</Heading>
      <p>可以将菜单项分布到左右两侧。</p>
      <DemoBlock source={SOURCES.leftAndRight}>
        <MenuLeftAndRight />
      </DemoBlock>

      <Heading level={2}>浮层偏移</Heading>
      <p>
        子菜单设置 <code>popperOffset</code> 后会覆盖菜单的{" "}
        <code>popperOffset</code>。
      </p>
      <DemoBlock source={SOURCES.popperOffset}>
        <MenuPopperOffset />
      </DemoBlock>

      <Heading level={2}>侧边栏</Heading>
      <p>带子菜单的纵向菜单。</p>
      <p>
        使用 <code>ElMenuItemGroup</code> 创建菜单分组，分组名称由{" "}
        <code>title</code> 决定。
      </p>
      <DemoBlock source={SOURCES.vertical}>
        <MenuVertical />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
