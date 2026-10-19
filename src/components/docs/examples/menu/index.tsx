"use client";

import { useState } from "react";
import {
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubMenu,
} from "@/components/ui/menu";
import { ElIcon } from "@/components/ui/icon/ElIcon";
import { ElRadio } from "@/components/ui/radio/ElRadio";
import { ElRadioGroup } from "@/components/ui/radio/ElRadioGroup";
import { ElRow } from "@/components/ui/row/ElRow";
import { ElCol } from "@/components/ui/row/ElCol";
import { ArrowDown, Document, House, Menu, Setting } from "@/components/ui/icons";

/** 官方示例里 .el-menu-vertical-demo 的实测尺寸（200x400）。 */
const VERTICAL_STYLE = { width: 200, minHeight: 400 };

/** 侧边栏的两套配色共用同一份节点；flex 容器内复用需要 element 实例，这里用函数生成。 */
function renderNavigatorChildren() {
  return (
    <>
      <ElSubMenu
        index="1"
        title={
          <>
            <ElIcon>
              <House />
            </ElIcon>
            <span>Navigator One</span>
          </>
        }
      >
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
        <ElIcon>
          <Menu />
        </ElIcon>
        <span>Navigator Two</span>
      </ElMenuItem>
      <ElMenuItem index="3" disabled>
        <ElIcon>
          <Document />
        </ElIcon>
        <span>Navigator Three</span>
      </ElMenuItem>
      <ElMenuItem index="4">
        <ElIcon>
          <Setting />
        </ElIcon>
        <span>Navigator Four</span>
      </ElMenuItem>
    </>
  );
}

/** 基础用法：横向菜单，默认配色与自定义配色各一。 */
export function MenuBasic() {
  const [activeIndex, setActiveIndex] = useState("1");
  const [activeIndex2, setActiveIndex2] = useState("1");

  return (
    <>
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
            <ElMenuItem index="2-4-2">item two</ElMenuItem>
            <ElMenuItem index="2-4-3">item three</ElMenuItem>
          </ElSubMenu>
        </ElSubMenu>
        <ElMenuItem index="3" disabled>
          Info
        </ElMenuItem>
        <ElMenuItem index="4">Orders</ElMenuItem>
      </ElMenu>

      <div style={{ height: 24 }} />

      <ElMenu
        defaultActive={activeIndex2}
        mode="horizontal"
        className="el-menu-demo"
        backgroundColor="#545c64"
        textColor="#fff"
        activeTextColor="#ffd04b"
        onSelect={(index) => setActiveIndex2(index)}
      >
        <ElMenuItem index="1">Processing Center</ElMenuItem>
        <ElSubMenu index="2" title="Workspace">
          <ElMenuItem index="2-1">item one</ElMenuItem>
          <ElMenuItem index="2-2">item two</ElMenuItem>
          <ElMenuItem index="2-3">item three</ElMenuItem>
          <ElSubMenu index="2-4" title="item four">
            <ElMenuItem index="2-4-1">item one</ElMenuItem>
            <ElMenuItem index="2-4-2">item two</ElMenuItem>
            <ElMenuItem index="2-4-3">item three</ElMenuItem>
          </ElSubMenu>
        </ElSubMenu>
        <ElMenuItem index="3" disabled>
          Info
        </ElMenuItem>
        <ElMenuItem index="4">Orders</ElMenuItem>
      </ElMenu>
    </>
  );
}

/** 左右分布：关掉省略号，首项用 margin-right: auto 顶到最左，其余靠右。 */
export function MenuLeftAndRight() {
  const [activeIndex, setActiveIndex] = useState("1");

  return (
    <ElMenu
      defaultActive={activeIndex}
      mode="horizontal"
      className="el-menu-demo"
      ellipsis={false}
      textColor="#303133"
      onSelect={(index) => setActiveIndex(index)}
    >
      {/* 官方示例首项是 logo 图，这里用等宽文本占位，靠 margin-right: auto 撑开 */}
      <ElMenuItem index="0" style={{ marginRight: "auto" }}>
        Element Plus
      </ElMenuItem>
      <ElMenuItem index="1">Processing Center</ElMenuItem>
      <ElSubMenu index="2" title="Workspace">
        <ElMenuItem index="2-1">item one</ElMenuItem>
        <ElMenuItem index="2-2">item two</ElMenuItem>
        <ElMenuItem index="2-3">item three</ElMenuItem>
        <ElSubMenu index="2-4" title="item four">
          <ElMenuItem index="2-4-1">item one</ElMenuItem>
          <ElMenuItem index="2-4-2">item two</ElMenuItem>
          <ElMenuItem index="2-4-3">item three</ElMenuItem>
        </ElSubMenu>
      </ElSubMenu>
    </ElMenu>
  );
}

/** 侧边栏：纵向菜单 + 菜单分组 + 两套配色。 */
export function MenuVertical() {
  const [activeIndex, setActiveIndex] = useState("2");

  return (
    <ElRow className="tac">
      <ElCol span={12}>
        <h5 style={{ marginBottom: 8 }}>Default colors</h5>
        <ElMenu
          defaultActive={activeIndex}
          className="el-menu-vertical-demo"
          style={VERTICAL_STYLE}
          onSelect={(index) => setActiveIndex(index)}
        >
          {renderNavigatorChildren()}
        </ElMenu>
      </ElCol>
      <ElCol span={12}>
        <h5 style={{ marginBottom: 8 }}>Custom colors</h5>
        <ElMenu
          defaultActive={activeIndex}
          className="el-menu-vertical-demo"
          style={VERTICAL_STYLE}
          textColor="#fff"
          backgroundColor="#545c64"
          activeTextColor="#ffd04b"
          onSelect={(index) => setActiveIndex(index)}
        >
          {renderNavigatorChildren()}
        </ElMenu>
      </ElCol>
    </ElRow>
  );
}

/** 收起：单选按钮组切换 collapse，收起后菜单项只留图标并显示 tooltip。 */
export function MenuCollapse() {
  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <ElRadioGroup
          value={isCollapse}
          onChange={(value) => setIsCollapse(Boolean(value))}
          type="button"
        >
          <ElRadio value={false} label="expand" />
          <ElRadio value={true} label="collapse" />
        </ElRadioGroup>
      </div>

      <ElMenu
        defaultActive="2"
        className="el-menu-vertical-demo"
        style={isCollapse ? undefined : VERTICAL_STYLE}
        collapse={isCollapse}
      >
        <ElSubMenu
          index="1"
          title={
            <>
              <ElIcon>
                <House />
              </ElIcon>
              <span>Navigator One</span>
            </>
          }
        >
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
        <ElMenuItem index="2" title="Navigator Two">
          <ElIcon>
            <Menu />
          </ElIcon>
        </ElMenuItem>
        <ElMenuItem index="3" disabled title="Navigator Three">
          <ElIcon>
            <Document />
          </ElIcon>
        </ElMenuItem>
        <ElMenuItem index="4" title="Navigator Four">
          <ElIcon>
            <Setting />
          </ElIcon>
        </ElMenuItem>
      </ElMenu>
    </>
  );
}

/** 浮层偏移：菜单级 popperOffset 与子菜单级覆盖。 */
export function MenuPopperOffset() {
  return (
    <ElMenu
      ellipsis
      className="el-menu-popper-demo"
      mode="horizontal"
      popperOffset={16}
      style={{ maxWidth: 600 }}
    >
      <ElMenuItem index="1">Processing Center</ElMenuItem>
      <ElSubMenu index="2" title="Workspace">
        <ElMenuItem index="2-1">item one</ElMenuItem>
        <ElMenuItem index="2-2">item two</ElMenuItem>
        <ElMenuItem index="2-3">item three</ElMenuItem>
        <ElSubMenu index="2-4" title="item four">
          <ElMenuItem index="2-4-1">item one</ElMenuItem>
          <ElMenuItem index="2-4-2">item two</ElMenuItem>
          <ElMenuItem index="2-4-3">item three</ElMenuItem>
        </ElSubMenu>
      </ElSubMenu>
      <ElSubMenu index="3" popperOffset={8} title="Override Popper Offset">
        <ElMenuItem index="3-1">item one</ElMenuItem>
        <ElMenuItem index="3-2">item two</ElMenuItem>
        <ElMenuItem index="3-3">item three</ElMenuItem>
        <ElSubMenu index="3-4" popperOffset={20} title="override child">
          <ElMenuItem index="3-4-1">item one</ElMenuItem>
          <ElMenuItem index="3-4-2">item two</ElMenuItem>
          <ElMenuItem index="3-4-3">item three</ElMenuItem>
        </ElSubMenu>
      </ElSubMenu>
      <ElMenuItem index="4" disabled>
        Info
      </ElMenuItem>
      <ElMenuItem index="5">Orders</ElMenuItem>
    </ElMenu>
  );
}

/** 收起态的箭头图标替换：对应官方 expand/collapse 图标成对使用的写法。 */
export function MenuCollapseIcons() {
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <ElRadioGroup
          value={isCollapse}
          onChange={(value) => setIsCollapse(Boolean(value))}
          type="button"
        >
          <ElRadio value={false} label="expand" />
          <ElRadio value={true} label="collapse" />
        </ElRadioGroup>
      </div>

      <ElMenu
        defaultActive="1-1"
        className="el-menu-vertical-demo"
        style={isCollapse ? undefined : VERTICAL_STYLE}
        collapse={isCollapse}
      >
        <ElSubMenu
          index="1"
          title="Navigator"
          expandCloseIcon={<ArrowDown />}
          expandOpenIcon={<ArrowDown />}
          collapseCloseIcon={<ArrowDown />}
          collapseOpenIcon={<ArrowDown />}
        >
          <ElMenuItem index="1-1">item one</ElMenuItem>
          <ElMenuItem index="1-2">item two</ElMenuItem>
        </ElSubMenu>
      </ElMenu>
    </>
  );
}
