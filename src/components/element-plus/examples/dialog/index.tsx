"use client";

import { useState } from "react";
import { ElDialog } from "@/components/element-plus/dialog";
import { ElButton } from "@/components/element-plus/button";
import { ElInput } from "@/components/element-plus/input";
import { ElSelect } from "@/components/element-plus/select";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import { MessageBox } from "@/components/element-plus/message-box";
import { CircleCloseFilled } from "@/components/element-plus/icons";
import styles from "./dialog.module.css";

function Footer({
  cancel,
  confirm,
  confirmText = "Confirm",
}: {
  cancel: () => void;
  confirm: () => void;
  confirmText?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1.2rem" }}>
      <ElButton onClick={cancel}>Cancel</ElButton>
      <ElButton type="primary" onClick={confirm}>
        {confirmText}
      </ElButton>
    </div>
  );
}

export function DialogBasicUsage() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Click to open the Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        title="Tips"
        width={500}
        beforeClose={(done) => {
          MessageBox.confirm("Are you sure to close this dialog?")
            .then(() => done())
            .catch(() => {});
        }}
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>This is a message</span>
      </ElDialog>
    </>
  );
}

const gridData = [
  { date: "2016-05-02", name: "John Smith", address: "No.1518, Jinshajiang Road, Putuo District" },
  { date: "2016-05-04", name: "John Smith", address: "No.1518, Jinshajiang Road, Putuo District" },
  { date: "2016-05-01", name: "John Smith", address: "No.1518, Jinshajiang Road, Putuo District" },
  { date: "2016-05-03", name: "John Smith", address: "No.1518, Jinshajiang Road, Putuo District" },
];

export function DialogCustomizationContent() {
  const [tableVisible, setTableVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ name: "", region: "" });

  return (
    <>
      <div className={styles.row}>
        <ElButton plain onClick={() => setTableVisible(true)}>
          Open a Table nested Dialog
        </ElButton>
        <ElButton plain onClick={() => setFormVisible(true)}>
          Open a Form nested Dialog
        </ElButton>
      </div>

      <ElDialog visible={tableVisible} onVisibleChange={setTableVisible} title="Shipping address" width={800}>
        <ElTable data={gridData}>
          <ElTableColumn property="date" label="Date" width={150} />
          <ElTableColumn property="name" label="Name" width={200} />
          <ElTableColumn property="address" label="Address" />
        </ElTable>
      </ElDialog>

      <ElDialog
        visible={formVisible}
        onVisibleChange={setFormVisible}
        title="Shipping address"
        width={500}
        footer={
          <Footer
            cancel={() => setFormVisible(false)}
            confirm={() => setFormVisible(false)}
          />
        }
      >
        <div style={{ display: "grid", gap: "1.4rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <span style={{ width: 140 }}>Promotion name</span>
            <ElInput
              value={form.name}
              onChange={(value) => setForm((current) => ({ ...current, name: value }))}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <span style={{ width: 140 }}>Zones</span>
            <ElSelect
              value={form.region}
              onChange={(value) =>
                setForm((current) => ({ ...current, region: String(value ?? "") }))
              }
              placeholder="Please select a zone"
              options={[
                { value: "shanghai", label: "Zone No.1" },
                { value: "beijing", label: "Zone No.2" },
              ]}
              style={{ flex: 1 }}
            />
          </label>
        </div>
      </ElDialog>
    </>
  );
}

export function DialogCustomizationHeader() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Open Dialog with customized header
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        showClose={false}
        width={500}
        header={({ close, titleId, titleClass }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 16,
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
        This is dialog content.
      </ElDialog>
    </>
  );
}

export function DialogNestedDialog() {
  const [outerVisible, setOuterVisible] = useState(false);
  const [innerVisible, setInnerVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setOuterVisible(true)}>
        Open the outer Dialog
      </ElButton>
      <ElDialog
        visible={outerVisible}
        onVisibleChange={setOuterVisible}
        title="Outer Dialog"
        width={800}
        footer={
          <Footer
            cancel={() => setOuterVisible(false)}
            confirm={() => setInnerVisible(true)}
            confirmText="Open the inner Dialog"
          />
        }
      >
        <span>This is the outer Dialog</span>
        <ElDialog
          visible={innerVisible}
          onVisibleChange={setInnerVisible}
          width={500}
          title="Inner Dialog"
          appendToBody
        >
          <span>This is the inner Dialog</span>
        </ElDialog>
      </ElDialog>
    </>
  );
}

export function DialogCenteredContent() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Click to open the Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        title="Warning"
        width={500}
        center
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>
          It should be noted that the content will not be aligned in center by
          default
        </span>
      </ElDialog>
    </>
  );
}

export function DialogAlignCenter() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Click to open the Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        title="Warning"
        width={500}
        alignCenter
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>Open the dialog from the center from the screen</span>
      </ElDialog>
    </>
  );
}

export function DialogDestroyOnClose() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Click to open Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        title="Notice"
        width={500}
        destroyOnClose
        center
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>
          Notice: before the dialog is opened for the first time, this node and
          the one below will not be rendered.
        </span>
        <div>
          <strong>Extra content (Not rendered)</strong>
        </div>
      </ElDialog>
    </>
  );
}

export function DialogDraggableDialog() {
  const [visible, setVisible] = useState(false);
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  return (
    <>
      <div className={styles.rowGap1}>
        <ElButton plain onClick={() => setVisible(true)}>
          Open a draggable Dialog
        </ElButton>
        <ElButton plain onClick={() => setOverflowVisible(true)}>
          Open a overflow draggable Dialog
        </ElButton>
        <ElButton plain onClick={() => setCustomVisible(true)}>
          Open a custom dragging style Dialog
        </ElButton>
      </div>

      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        title="Tips"
        width={500}
        draggable
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>It&apos;s a draggable Dialog</span>
      </ElDialog>

      <ElDialog
        visible={overflowVisible}
        onVisibleChange={setOverflowVisible}
        title="Tips"
        width={500}
        draggable
        overflow
        footer={
          <Footer
            cancel={() => setOverflowVisible(false)}
            confirm={() => setOverflowVisible(false)}
          />
        }
      >
        <span>It&apos;s a overflow draggable Dialog</span>
      </ElDialog>

      <ElDialog
        visible={customVisible}
        onVisibleChange={setCustomVisible}
        className="custom-dragging-style"
        title="Custom Dragging Style"
        width={500}
        draggable
        footer={
          <Footer
            cancel={() => setCustomVisible(false)}
            confirm={() => setCustomVisible(false)}
          />
        }
      >
        <span>
          This dialog has custom dragging styles. Try dragging it to see the
          effects!
        </span>
      </ElDialog>
    </>
  );
}

export function DialogFullscreen() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Open the fullscreen Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        fullscreen
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>It&apos;s a fullscreen Dialog</span>
      </ElDialog>
    </>
  );
}

export function DialogModal() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Open the modal Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        modal={false}
        modalPenetrable
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>It&apos;s a modal Dialog</span>
      </ElDialog>
    </>
  );
}

const objectTransitionConfig = {
  name: "dialog-custom-object",
  appear: true,
  mode: "out-in",
  duration: 500,
};

export function DialogCustomAnimation() {
  const [visible, setVisible] = useState(false);
  const [animation, setAnimation] = useState("fade");
  const [isObjectConfig, setIsObjectConfig] = useState(false);

  const open = (type: string) => {
    setAnimation(type);
    setIsObjectConfig(false);
    setVisible(true);
  };

  const openWithObject = () => {
    setAnimation("object-config");
    setIsObjectConfig(true);
    setVisible(true);
  };

  const transition = isObjectConfig
    ? "dialog-custom-object"
    : `dialog-${animation}`;

  return (
    <>
      <div>
        <ElButton plain onClick={() => open("fade")}>
          Default
        </ElButton>
        <ElButton plain onClick={() => open("scale")}>
          Scale
        </ElButton>
        <ElButton plain onClick={() => open("slide")}>
          Slide
        </ElButton>
        <ElButton plain onClick={() => open("bounce")}>
          Bounce
        </ElButton>
        <ElButton plain onClick={openWithObject}>
          Object Config
        </ElButton>
      </div>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        className="custom-transition-dialog"
        title={`${animation} Animation Dialog`}
        width="30%"
        transition={transition}
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <div>
          <p>
            Current animation: <strong>{animation}</strong>
          </p>
          <p>
            This dialog demonstrates the {animation} animation effect.
          </p>
          {isObjectConfig && (
            <p>
              <strong>Using object configuration:</strong>
              <br />
              <code className={styles.code}>
                {JSON.stringify(objectTransitionConfig, null, 2)}
              </code>
            </p>
          )}
        </div>
      </ElDialog>
    </>
  );
}

export function DialogEvents() {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const log = (name: string) => setLogs((current) => [...current, name]);

  return (
    <>
      <ElButton plain onClick={() => setVisible(true)}>
        Open the event Dialog
      </ElButton>
      <ElDialog
        visible={visible}
        onVisibleChange={setVisible}
        beforeClose={(done) => {
          log("before-close");
          done();
        }}
        onOpen={() => log("open")}
        onOpened={() => log("opened")}
        onClose={() => log("close")}
        onClosed={() => log("closed")}
        onOpenAutoFocus={() => log("open-auto-focus")}
        onCloseAutoFocus={() => log("close-auto-focus")}
        footer={
          <Footer
            cancel={() => setVisible(false)}
            confirm={() => setVisible(false)}
          />
        }
      >
        <span>It&apos;s a event Dialog</span>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--el-text-color-secondary)" }}>
          {logs.length > 0 ? logs.join(" → ") : "No events yet"}
        </div>
      </ElDialog>
    </>
  );
}
