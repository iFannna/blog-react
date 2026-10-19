"use client";

import {
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
} from "@/components/element-plus/container";
import { ElMenu, ElMenuItem, ElMenuItemGroup, ElSubMenu } from "@/components/element-plus/menu";
import { ElScrollbar } from "@/components/element-plus/scrollbar";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import { ElDropdown } from "@/components/element-plus/dropdown/ElDropdown";
import { ElDropdownMenu } from "@/components/element-plus/dropdown/ElDropdownMenu";
import { ElDropdownItem } from "@/components/element-plus/dropdown/ElDropdownItem";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Menu, Message, Setting } from "@/components/element-plus/icons";

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--el-color-primary-light-7)",
  color: "var(--el-text-color-primary)",
  textAlign: "center",
} as const;

const footerStyle = headerStyle;

const asideStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--el-color-primary-light-8)",
  color: "var(--el-text-color-primary)",
  textAlign: "center",
} as const;

const mainStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 150,
  background: "var(--el-color-primary-light-9)",
  color: "var(--el-text-color-primary)",
  textAlign: "center",
} as const;

export function ContainerHeaderMain() {
  return (
    <ElContainer>
      <ElHeader style={headerStyle}>Header</ElHeader>
      <ElMain style={mainStyle}>Main</ElMain>
    </ElContainer>
  );
}

export function ContainerBasic() {
  return (
    <ElContainer>
      <ElHeader style={headerStyle}>Header</ElHeader>
      <ElMain style={mainStyle}>Main</ElMain>
      <ElFooter style={footerStyle}>Footer</ElFooter>
    </ElContainer>
  );
}

export function ContainerAsideMain() {
  return (
    <ElContainer>
      <ElAside width="200px" style={asideStyle}>
        Aside
      </ElAside>
      <ElMain style={mainStyle}>Main</ElMain>
      <ElAside width="200px" style={asideStyle}>
        Aside
      </ElAside>
    </ElContainer>
  );
}

export function ContainerAside() {
  return (
    <ElContainer>
      <ElAside width="200px" style={asideStyle}>
        Aside
      </ElAside>
      <ElContainer>
        <ElHeader style={headerStyle}>Header</ElHeader>
        <ElMain style={mainStyle}>Main</ElMain>
      </ElContainer>
    </ElContainer>
  );
}

export function ContainerAsideWithFooter() {
  return (
    <ElContainer>
      <ElAside width="200px" style={asideStyle}>
        Aside
      </ElAside>
      <ElContainer>
        <ElHeader style={headerStyle}>Header</ElHeader>
        <ElMain style={mainStyle}>Main</ElMain>
        <ElFooter style={footerStyle}>Footer</ElFooter>
      </ElContainer>
    </ElContainer>
  );
}

export function ContainerHeaderAside() {
  return (
    <ElContainer>
      <ElHeader style={headerStyle}>Header</ElHeader>
      <ElContainer>
        <ElAside width="200px" style={asideStyle}>
          Aside
        </ElAside>
        <ElMain style={mainStyle}>Main</ElMain>
      </ElContainer>
    </ElContainer>
  );
}

export function ContainerNested() {
  return (
    <ElContainer>
      <ElHeader style={headerStyle}>Header</ElHeader>
      <ElContainer>
        <ElAside width="200px" style={asideStyle}>
          Aside
        </ElAside>
        <ElContainer>
          <ElMain style={mainStyle}>Main</ElMain>
          <ElFooter style={footerStyle}>Footer</ElFooter>
        </ElContainer>
      </ElContainer>
    </ElContainer>
  );
}

const tableData = Array.from({ length: 20 }, () => ({
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
}));

/** 官方 example.vue：完整应用布局，侧边菜单 + 顶栏 + 表格主区 */
export function ContainerExample() {
  return (
    <ElContainer style={{ height: 500 }}>
      <ElAside width="200px" style={{ background: "var(--el-color-primary-light-8)" }}>
        <ElScrollbar>
          <ElMenu defaultOpeneds={["1", "3"]} style={{ borderRight: "none" }}>
            <ElSubMenu
              index="1"
              title={
                <>
                  <ElIcon>
                    <Message />
                  </ElIcon>
                  Navigator One
                </>
              }
            >
              <ElMenuItemGroup title="Group 1">
                <ElMenuItem index="1-1">Option 1</ElMenuItem>
                <ElMenuItem index="1-2">Option 2</ElMenuItem>
              </ElMenuItemGroup>
              <ElMenuItemGroup title="Group 2">
                <ElMenuItem index="1-3">Option 3</ElMenuItem>
              </ElMenuItemGroup>
              <ElSubMenu index="1-4" title="Option 4">
                <ElMenuItem index="1-4-1">Option 4-1</ElMenuItem>
              </ElSubMenu>
            </ElSubMenu>
            <ElSubMenu
              index="2"
              title={
                <>
                  <ElIcon>
                    <Menu />
                  </ElIcon>
                  Navigator Two
                </>
              }
            >
              <ElMenuItemGroup title="Group 1">
                <ElMenuItem index="2-1">Option 1</ElMenuItem>
                <ElMenuItem index="2-2">Option 2</ElMenuItem>
              </ElMenuItemGroup>
              <ElMenuItemGroup title="Group 2">
                <ElMenuItem index="2-3">Option 3</ElMenuItem>
              </ElMenuItemGroup>
              <ElSubMenu index="2-4" title="Option 4">
                <ElMenuItem index="2-4-1">Option 4-1</ElMenuItem>
              </ElSubMenu>
            </ElSubMenu>
            <ElSubMenu
              index="3"
              title={
                <>
                  <ElIcon>
                    <Setting />
                  </ElIcon>
                  Navigator Three
                </>
              }
            >
              <ElMenuItemGroup title="Group 1">
                <ElMenuItem index="3-1">Option 1</ElMenuItem>
                <ElMenuItem index="3-2">Option 2</ElMenuItem>
              </ElMenuItemGroup>
              <ElMenuItemGroup title="Group 2">
                <ElMenuItem index="3-3">Option 3</ElMenuItem>
              </ElMenuItemGroup>
              <ElSubMenu index="3-4" title="Option 4">
                <ElMenuItem index="3-4-1">Option 4-1</ElMenuItem>
              </ElSubMenu>
            </ElSubMenu>
          </ElMenu>
        </ElScrollbar>
      </ElAside>

      <ElContainer>
        <ElHeader
          style={{
            ...headerStyle,
            justifyContent: "flex-end",
            fontSize: 12,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              paddingRight: 20,
            }}
          >
            <ElDropdown
              menu={
                <ElDropdownMenu>
                  <ElDropdownItem command="view">View</ElDropdownItem>
                  <ElDropdownItem command="add">Add</ElDropdownItem>
                  <ElDropdownItem command="delete">Delete</ElDropdownItem>
                </ElDropdownMenu>
              }
            >
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <ElIcon style={{ marginRight: 8, marginTop: 1 }}>
                  <Setting />
                </ElIcon>
              </span>
            </ElDropdown>
            <span>Tom</span>
          </div>
        </ElHeader>

        <ElMain style={{ padding: 0 }}>
          <ElScrollbar>
            <ElTable data={tableData}>
              <ElTableColumn prop="date" label="Date" width={140} />
              <ElTableColumn prop="name" label="Name" width={120} />
              <ElTableColumn prop="address" label="Address" />
            </ElTable>
          </ElScrollbar>
        </ElMain>
      </ElContainer>
    </ElContainer>
  );
}
