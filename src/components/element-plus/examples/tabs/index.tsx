"use client";

import { useRef, useState } from "react";
import { ElTabs, ElTabPane, type TabPosition } from "@/components/element-plus/tabs";
import { ElButton } from "@/components/element-plus/button";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Calendar, Select } from "@/components/element-plus/icons";
import styles from "./tabs.module.css";

interface EditableTab {
  title: string;
  name: string;
  content: string;
}

export function TabsBasic() {
  const [active, setActive] = useState<string | number>("first");
  return (
    <ElTabs value={active} onChange={setActive} className={styles.demoTabs}>
      <ElTabPane name="first" label="User">User</ElTabPane>
      <ElTabPane name="second" label="Config">Config</ElTabPane>
      <ElTabPane name="third" label="Role">Role</ElTabPane>
      <ElTabPane name="fourth" label="Task">Task</ElTabPane>
    </ElTabs>
  );
}

export function TabsCard() {
  const [active, setActive] = useState<string | number>("first");
  return (
    <ElTabs value={active} onChange={setActive} type="card" className={styles.demoTabs}>
      <ElTabPane name="first" label="User">User</ElTabPane>
      <ElTabPane name="second" label="Config">Config</ElTabPane>
      <ElTabPane name="third" label="Role">Role</ElTabPane>
      <ElTabPane name="fourth" label="Task">Task</ElTabPane>
    </ElTabs>
  );
}

export function TabsBorderCard() {
  return (
    <ElTabs type="border-card">
      <ElTabPane label="User">User</ElTabPane>
      <ElTabPane label="Config">Config</ElTabPane>
      <ElTabPane label="Role">Role</ElTabPane>
      <ElTabPane label="Task">Task</ElTabPane>
    </ElTabs>
  );
}

export function TabsCustomLabel() {
  return (
    <ElTabs type="border-card" className={styles.demoTabs}>
      <ElTabPane
        label={
          <span className="custom-tabs-label">
            <ElIcon>
              <Calendar />
            </ElIcon>
            <span>Route</span>
          </span>
        }
      >
        Route
      </ElTabPane>
      <ElTabPane label="Config">Config</ElTabPane>
      <ElTabPane label="Role">Role</ElTabPane>
      <ElTabPane label="Task">Task</ElTabPane>
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
      className={styles.demoTabs}
      addIcon={
        <ElIcon>
          <Select />
        </ElIcon>
      }
    >
      {tabs.map((tab) => (
        <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
          {tab.content}
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
        className={styles.demoTabs}
      >
        {tabs.map((tab) => (
          <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
            {tab.content}
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
    <ElTabs
      defaultValue="third"
      onChange={setActive}
      className={styles.demoTabs}
    >
      <ElTabPane name="first" label="User">
        default-value: third
        <br />
        active: {active ?? ""}
      </ElTabPane>
      <ElTabPane name="second" label="Config">
        default-value: third
        <br />
        active: {active ?? ""}
      </ElTabPane>
      <ElTabPane name="third" label="Role">
        default-value: third
        <br />
        active: {active ?? ""}
      </ElTabPane>
      <ElTabPane name="fourth" label="Task">
        default-value: third
        <br />
        active: {active ?? ""}
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
      className={styles.demoTabs}
    >
      {tabs.map((tab) => (
        <ElTabPane key={tab.name} name={tab.name} label={tab.title}>
          {tab.content}
        </ElTabPane>
      ))}
    </ElTabs>
  );
}

export function TabsPosition() {
  const [position, setPosition] = useState<TabPosition>("left");
  return (
    <>
      <ElRadioGroup
        type="button"
        value={position}
        onChange={(value) => setPosition(value as TabPosition)}
        className={styles.positionRadio}
      >
        <ElRadio value="top">top</ElRadio>
        <ElRadio value="right">right</ElRadio>
        <ElRadio value="bottom">bottom</ElRadio>
        <ElRadio value="left">left</ElRadio>
      </ElRadioGroup>
      <ElTabs
        tabPosition={position}
        style={{ height: 200 }}
        className={styles.demoTabs}
      >
        <ElTabPane label="User">User</ElTabPane>
        <ElTabPane label="Config">Config</ElTabPane>
        <ElTabPane label="Role">Role</ElTabPane>
        <ElTabPane label="Task">Task</ElTabPane>
      </ElTabs>
    </>
  );
}
