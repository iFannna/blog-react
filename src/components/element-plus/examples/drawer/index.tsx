"use client";

import { useState } from "react";
import { ElDrawer, type DrawerDirection } from "@/components/element-plus/drawer";
import { ElButton } from "@/components/element-plus/button";
import { ElInput } from "@/components/element-plus/input";
import { ElSelect } from "@/components/element-plus/select";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import { MessageBox } from "@/components/element-plus/message-box";
import { CircleCloseFilled } from "@/components/element-plus/icons";

export function DrawerBasicUsage() {
  const [direction, setDirection] = useState<DrawerDirection>("rtl");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [radio, setRadio] = useState("Option 1");

  return (
    <>
      <ElRadioGroup
        value={direction}
        onChange={(value) => setDirection(value as DrawerDirection)}
      >
        <ElRadio value="ltr">left to right</ElRadio>
        <ElRadio value="rtl">right to left</ElRadio>
        <ElRadio value="ttb">top to bottom</ElRadio>
        <ElRadio value="btt">bottom to top</ElRadio>
      </ElRadioGroup>
      <ElButton type="primary" style={{ marginLeft: 28 }} onClick={() => setVisible(true)}>
        open
      </ElButton>
      <ElButton type="primary" style={{ marginLeft: 16 }} onClick={() => setVisible2(true)}>
        with footer
      </ElButton>

      <ElDrawer
        visible={visible}
        onVisibleChange={setVisible}
        title="I am the title"
        direction={direction}
        beforeClose={(done) => {
          MessageBox.confirm("Are you sure you want to close this?")
            .then(() => done())
            .catch(() => {});
        }}
      >
        <span>Hi, there!</span>
      </ElDrawer>

      <ElDrawer
        visible={visible2}
        onVisibleChange={setVisible2}
        direction={direction}
        header={<h4 style={{ margin: 0 }}>set title by slot</h4>}
        footer={
          <div style={{ flex: "auto" }}>
            <ElButton onClick={() => setVisible2(false)}>cancel</ElButton>
            <ElButton
              type="primary"
              onClick={() => {
                MessageBox.confirm(`Are you confirm to chose ${radio} ?`)
                  .then(() => setVisible2(false))
                  .catch(() => {});
              }}
            >
              confirm
            </ElButton>
          </div>
        }
      >
        <ElRadioGroup value={radio} onChange={(value) => setRadio(String(value))}>
          <ElRadio value="Option 1" size="large">Option 1</ElRadio>
          <ElRadio value="Option 2" size="large">Option 2</ElRadio>
        </ElRadioGroup>
      </ElDrawer>
    </>
  );
}

export function DrawerNoTitle() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton type="primary" onClick={() => setVisible(true)}>
        open
      </ElButton>
      <ElDrawer
        visible={visible}
        onVisibleChange={setVisible}
        title="I am the title"
        withHeader={false}
      >
        <span>Hi there!</span>
      </ElDrawer>
    </>
  );
}

const gridData = [
  { date: "2016-05-02", name: "Peter Parker", address: "Queens, New York City" },
  { date: "2016-05-04", name: "Peter Parker", address: "Queens, New York City" },
  { date: "2016-05-01", name: "Peter Parker", address: "Queens, New York City" },
  { date: "2016-05-03", name: "Peter Parker", address: "Queens, New York City" },
];

export function DrawerCustomizationContent() {
  const [tableVisible, setTableVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ name: "", region: "" });
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormVisible(false);
    }, 400);
  };

  return (
    <>
      <ElButton text onClick={() => setTableVisible(true)}>
        Open Drawer with nested table
      </ElButton>
      <ElButton text onClick={() => setFormVisible(true)}>
        Open Drawer with nested form
      </ElButton>

      <ElDrawer
        visible={tableVisible}
        onVisibleChange={setTableVisible}
        title="I have a nested table inside!"
        direction="rtl"
        size="50%"
      >
        <ElTable data={gridData}>
          <ElTableColumn property="date" label="Date" width={150} />
          <ElTableColumn property="name" label="Name" width={200} />
          <ElTableColumn property="address" label="Address" />
        </ElTable>
      </ElDrawer>

      <ElDrawer
        visible={formVisible}
        onVisibleChange={setFormVisible}
        title="I have a nested form inside!"
        direction="ltr"
        className="demo-drawer"
        beforeClose={(done) => {
          if (loading) return;
          MessageBox.confirm("Do you want to submit?")
            .then(() => {
              setLoading(true);
              setTimeout(() => {
                done();
                setTimeout(() => setLoading(false), 400);
              }, 2000);
            })
            .catch(() => {});
        }}
      >
        <div style={{ display: "grid", gap: "1.4rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ width: 80 }}>Name</span>
            <ElInput
              value={form.name}
              onChange={(value) => setForm((current) => ({ ...current, name: value }))}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ width: 80 }}>Area</span>
            <ElSelect
              value={form.region}
              onChange={(value) =>
                setForm((current) => ({ ...current, region: String(value ?? "") }))
              }
              placeholder="Please select activity area"
              options={[
                { value: "shanghai", label: "Area1" },
                { value: "beijing", label: "Area2" },
              ]}
              style={{ flex: 1 }}
            />
          </label>
        </div>
        <div style={{ marginTop: "2rem", display: "flex", gap: "1.2rem" }}>
          <ElButton
            onClick={() => {
              setLoading(false);
              setFormVisible(false);
            }}
          >
            Cancel
          </ElButton>
          <ElButton type="primary" loading={loading} onClick={submit}>
            {loading ? "Submitting ..." : "Submit"}
          </ElButton>
        </div>
      </ElDrawer>
    </>
  );
}

export function DrawerCustomizationHeader() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton onClick={() => setVisible(true)}>
        Open Drawer with customized header
      </ElButton>
      <ElDrawer
        visible={visible}
        onVisibleChange={setVisible}
        showClose={false}
        header={({ close, titleId, titleClass }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              width: "100%",
            }}
          >
            <h4 id={titleId} className={titleClass} style={{ margin: 0 }}>
              This is a custom header!
            </h4>
            <ElButton type="danger" onClick={close}>
              <CircleCloseFilled style={{ marginRight: 4 }} />
              Close
            </ElButton>
          </div>
        )}
      >
        This is drawer content.
      </ElDrawer>
    </>
  );
}

export function DrawerResizable() {
  const [direction, setDirection] = useState<DrawerDirection>();
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElRadioGroup
        value={direction}
        onChange={(value) => {
          setDirection(value as DrawerDirection);
          setVisible(true);
        }}
      >
        <ElRadio value="ttb" button>top</ElRadio>
        <ElRadio value="rtl" button>right</ElRadio>
        <ElRadio value="btt" button>bottom</ElRadio>
        <ElRadio value="ltr" button>left</ElRadio>
      </ElRadioGroup>
      <ElDrawer
        visible={visible}
        onVisibleChange={setVisible}
        direction={direction}
        resizable
      >
        This is drawer content.
      </ElDrawer>
    </>
  );
}

export function DrawerNestedDrawer() {
  const [visible, setVisible] = useState(false);
  const [innerVisible, setInnerVisible] = useState(false);
  return (
    <>
      <ElButton type="primary" onClick={() => setVisible(true)}>
        open
      </ElButton>
      <ElDrawer
        visible={visible}
        onVisibleChange={setVisible}
        title="I'm outer Drawer"
        size="50%"
      >
        <div>
          <ElButton onClick={() => setInnerVisible(true)}>Click me!</ElButton>
          <ElDrawer
            visible={innerVisible}
            onVisibleChange={setInnerVisible}
            title="I'm inner Drawer"
            appendToBody
            beforeClose={(done) => {
              MessageBox.confirm("You still have unsaved data, proceed?")
                .then(() => done())
                .catch(() => {});
            }}
          >
            <p>_(:зゝ∠)_</p>
          </ElDrawer>
        </div>
      </ElDrawer>
    </>
  );
}

export function DrawerModal() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Open the modal Drawer
      </ElButton>
      <ElDrawer
        visible={visible}
        onVisibleChange={setVisible}
        modal={false}
        modalPenetrable
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1.2rem" }}>
            <ElButton onClick={() => setVisible(false)}>Cancel</ElButton>
            <ElButton type="primary" onClick={() => setVisible(false)}>
              Confirm
            </ElButton>
          </div>
        }
      >
        <span>It&apos;s a modal Drawer</span>
      </ElDrawer>
    </>
  );
}
