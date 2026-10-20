"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ElTabs, ElTabPane, type TabPosition } from "@/components/element-plus/tabs";
import { ElButton } from "@/components/element-plus/button";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Calendar, Select } from "@/components/element-plus/icons";

interface EditableTab {
  title: string;
  name: string;
  content: string;
}

// 对应官方 demo 的 .demo-tabs > .el-tabs__content 样式
const contentStyle: CSSProperties = {
  padding: 32,
  color: "var(--el-text-color-regular)",
  fontSize: 32,
  fontWeight: 600,
};

const labelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

function TabContent({ children }: { children: ReactNode }) {
  return <div style={contentStyle}>{children}</div>;
}

export function TabsBasic() {
  const [active, setActive] = useState<string | number>("first");
  return (
    <ElTabs value={active} onChange={setActive}>
      <ElTabPane name="first" label="User">
        <TabContent>User</TabContent>
      </ElTabPane>
      <ElTabPane name="second" label="Config">
        <TabContent>Config</TabContent>
      </ElTabPane>
      <ElTabPane name="third" label="Role">
        <TabContent>Role</TabContent>
      </ElTabPane>
      <ElTabPane name="fourth" label="Task">
        <TabContent>Task</TabContent>
      </ElTabPane>
    </ElTabs>
  );
}

export function TabsCard() {
  const [active, setActive] = useState<string | number>("first");
  return (
    <ElTabs value={active} onChange={setActive} type="card">
      <ElTabPane name="first" label="User">
        <TabContent>User</TabContent>
      </ElTabPane>
      <ElTabPane name="second" label="Config">
        <TabContent>Config</TabContent>
      </ElTabPane>
      <ElTabPane name="third" label="Role">
        <TabContent>Role</TabContent>
      </ElTabPane>
      <ElTabPane name="fourth" label="Task">
        <TabContent>Task</TabContent>
      </ElTabPane>
    </ElTabs>
  );
}

export function TabsBorderCard() {
  return (
    <ElTabs type="border-card">
      <ElTabPane label="User">
        <TabContent>User</TabContent>
      </ElTabPane>
      <ElTabPane label="Config">
        <TabContent>Config</TabContent>
      </ElTabPane>
      <ElTabPane label="Role">
        <TabContent>Role</TabContent>
      </ElTabPane>
      <ElTabPane label="Task">
        <TabContent>Task</TabContent>
      </ElTabPane>
    </ElTabs>
  );
}

export function TabsCustomLabel() {
  return (
    <ElTabs type="border-card">
      <ElTabPane
        label={
          <span className="custom-tabs-label" style={labelStyle}>
            <ElIcon>
              <Calendar />
            </ElIcon>
            <span>Route</span>
          </span>
        }
      >
        <TabContent>Route</TabContent>
      </ElTabPane>
      <ElTabPane label="Config">
        <TabContent>Config</TabContent>
      </ElTabPane>
      <ElTabPane label="Role">
        <TabContent>Role</TabContent>
      </ElTabPane>
      <ElTabPane label="Task">
        <TabContent>Task</TabContent>
      </ElTabPane>
    </ElTabs>
  );
}

/** 自定义新增按钮图标：addIcon 属性等价于官方 add-icon 插槽 */
export function TabsCustomAddIcon() {
  const [active, setActive] = useState<string | number>("2");
  const nextIndex = useRef(2);
  const [tabs, setTabs] = useState<EditableTab[]>([
    { title: "Tab 1", name: "1", content: "Tab 1 content" },
    { title: "Tab 2", name: "2", content: "Tab 2 content" },
  ]);

  const handleEdit = (
    targetName: string | number | undefined,
    action: "remove" | "add",
  ) => {
    if (action === "add") {
      const nextName = String(++nextIndex.current);
      setTabs((prev) => [
        ...prev,
        {
          title: "New Tab",
          name: nextName,
          content: "New Tab content",
        },
      ]);
      setActive(nextName);
      return;
    }

    const index = tabs.findIndex((tab) => tab.name === targetName);
    if (index < 0) return;
    const nextTab = tabs[index + 1] ?? tabs[index - 1];
    if (active === targetName && nextTab) setActive(nextTab.name);
    setTabs((prev) => prev.filter((tab) => tab.name !== targetName));
  };

  return (
    <ElTabs
      value={active}
      onChange={setActive}
      type="card"
      editable
      onEdit={handleEdit}
      addIcon={
        <ElIcon>
          <Select />
        </ElIcon>
      }
    >
      {tabs.map((tab) => (
        <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
          <TabContent>{tab.content}</TabContent>
        </ElTabPane>
      ))}
    </ElTabs>
  );
}

/** 外部按钮新增 + tab-remove 关闭 */
export function TabsCustomizedTrigger() {
  const [active, setActive] = useState<string | number>("2");
  const nextIndex = useRef(2);
  const [tabs, setTabs] = useState<EditableTab[]>([
    { title: "Tab 1", name: "1", content: "Tab 1 content" },
    { title: "Tab 2", name: "2", content: "Tab 2 content" },
  ]);

  const addTab = () => {
    const nextName = String(++nextIndex.current);
    setTabs((prev) => [
      ...prev,
      {
        title: "New Tab",
        name: nextName,
        content: "New Tab content",
      },
    ]);
    setActive(nextName);
  };

  const removeTab = (targetName: string | number) => {
    const index = tabs.findIndex((tab) => tab.name === targetName);
    if (index < 0) return;
    const nextTab = tabs[index + 1] ?? tabs[index - 1];
    if (active === targetName && nextTab) setActive(nextTab.name);
    setTabs((prev) => prev.filter((tab) => tab.name !== targetName));
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <ElButton size="small" onClick={addTab}>add tab</ElButton>
      </div>
      <ElTabs
        value={active}
        onChange={setActive}
        type="card"
        closable
        onTabRemove={removeTab}
      >
        {tabs.map((tab) => (
          <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
            <TabContent>{tab.content}</TabContent>
          </ElTabPane>
        ))}
      </ElTabs>
    </div>
  );
}

/** 非受控 defaultValue：未传 value 时以 defaultValue 作为初始选中项 */
export function TabsDefaultValue() {
  const [active, setActive] = useState<string | number>();
  return (
    <ElTabs defaultValue="third" onChange={setActive}>
      <ElTabPane name="first" label="User">
        <TabContent>
          default-value: third
          <br />
          active: {active ?? ""}
        </TabContent>
      </ElTabPane>
      <ElTabPane name="second" label="Config">
        <TabContent>
          default-value: third
          <br />
          active: {active ?? ""}
        </TabContent>
      </ElTabPane>
      <ElTabPane name="third" label="Role">
        <TabContent>
          default-value: third
          <br />
          active: {active ?? ""}
        </TabContent>
      </ElTabPane>
      <ElTabPane name="fourth" label="Task">
        <TabContent>
          default-value: third
          <br />
          active: {active ?? ""}
        </TabContent>
      </ElTabPane>
    </ElTabs>
  );
}

/** 可动态增减：editable 同时提供新增按钮与关闭图标，edit 事件统一处理 */
export function TabsDynamic() {
  const [active, setActive] = useState<string | number>("2");
  const nextIndex = useRef(2);
  const [tabs, setTabs] = useState<EditableTab[]>([
    { title: "Tab 1", name: "1", content: "Tab 1 content" },
    { title: "Tab 2", name: "2", content: "Tab 2 content" },
  ]);

  const handleEdit = (
    targetName: string | number | undefined,
    action: "remove" | "add",
  ) => {
    if (action === "add") {
      const nextName = String(++nextIndex.current);
      setTabs((prev) => [
        ...prev,
        {
          title: "New Tab",
          name: nextName,
          content: "New Tab content",
        },
      ]);
      setActive(nextName);
      return;
    }

    const index = tabs.findIndex((tab) => tab.name === targetName);
    if (index < 0) return;
    const nextTab = tabs[index + 1] ?? tabs[index - 1];
    if (active === targetName && nextTab) setActive(nextTab.name);
    setTabs((prev) => prev.filter((tab) => tab.name !== targetName));
  };

  return (
    <ElTabs
      value={active}
      onChange={setActive}
      type="card"
      editable
      onEdit={handleEdit}
    >
      {tabs.map((tab) => (
        <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
          <TabContent>{tab.content}</TabContent>
        </ElTabPane>
      ))}
    </ElTabs>
  );
}

export function TabsPosition() {
  const [position, setPosition] = useState<TabPosition>("left");
  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <ElRadioGroup
          type="button"
          value={position}
          onChange={(value) => setPosition(value as TabPosition)}
        >
          <ElRadio value="top">top</ElRadio>
          <ElRadio value="right">right</ElRadio>
          <ElRadio value="bottom">bottom</ElRadio>
          <ElRadio value="left">left</ElRadio>
        </ElRadioGroup>
      </div>
      <ElTabs tabPosition={position} style={{ height: 200 }}>
        <ElTabPane label="User">
          <TabContent>User</TabContent>
        </ElTabPane>
        <ElTabPane label="Config">
          <TabContent>Config</TabContent>
        </ElTabPane>
        <ElTabPane label="Role">
          <TabContent>Role</TabContent>
        </ElTabPane>
        <ElTabPane label="Task">
          <TabContent>Task</TabContent>
        </ElTabPane>
      </ElTabs>
    </div>
  );
}
