"use client";

import { useState } from "react";
import {
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubMenu,
} from "@/components/element-plus/menu";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElRadio } from "@/components/element-plus/radio/ElRadio";
import { ElRadioGroup } from "@/components/element-plus/radio/ElRadioGroup";
import { ElRow } from "@/components/element-plus/row/ElRow";
import { ElCol } from "@/components/element-plus/row/ElCol";
import { ArrowDown, Document, House, Menu, Setting } from "@/components/element-plus/icons";
import styles from "./menu.module.css";

const VERTICAL_STYLE = { width: 200, minHeight: 400 };

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
        <ElMenuItem index="3" disabled>Info</ElMenuItem>
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
        <ElMenuItem index="3" disabled>Info</ElMenuItem>
        <ElMenuItem index="4">Orders</ElMenuItem>
      </ElMenu>
    </>
  );
}

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
      <ElMenuItem index="0" style={{ marginRight: "auto" }}>
        <img
          style={{ width: 100 }}
          src="/images/element-plus-logo.svg"
          alt="Element logo"
        />
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

export function MenuVertical() {
  const [activeIndex, setActiveIndex] = useState("2");

  return (
    <ElRow className={`tac ${styles.columns}`}>
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

export function MenuCollapse() {
  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <>
      <ElRadioGroup
        value={isCollapse}
        onChange={(value) => setIsCollapse(Boolean(value))}
        type="button"
        className={styles.radioGroup}
      >
        <ElRadio value={false} label="expand" />
        <ElRadio value={true} label="collapse" />
      </ElRadioGroup>

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
      <ElMenuItem index="4" disabled>Info</ElMenuItem>
      <ElMenuItem index="5">Orders</ElMenuItem>
    </ElMenu>
  );
}

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
