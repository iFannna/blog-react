"use client";

import { useState } from "react";
import { ElButton } from "@/components/element-plus/button";
import { ElDivider } from "@/components/element-plus/divider";
import { ElSpace } from "@/components/element-plus/space";
import { MoreFilled } from "@/components/element-plus/icons";
import { ElTour, ElTourStep } from "@/components/element-plus/tour";

/**
 * ElButton 是普通函数组件、未暴露 ref，示例统一用 id 选择器作为 target，
 * 与官方 target 示例里 "#btn1" 的写法一致。
 */
const targetBy = (id: string) => () => document.querySelector<HTMLElement>(id);

export function TourBasic() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ElButton type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </ElButton>

      <ElDivider />

      <ElSpace>
        <ElButton id="tour-basic-1">Upload</ElButton>
        <ElButton id="tour-basic-2" type="primary">Save</ElButton>
        <ElButton id="tour-basic-3" icon={<MoreFilled />} />
      </ElSpace>

      <ElTour visible={open} onVisibleChange={setOpen}>
        <ElTourStep target={targetBy("#tour-basic-1")} title="Upload File">
          <img
            style={{ width: 240 }}
            src="https://element-plus.org/images/element-plus-logo.svg"
            alt="tour.png"
          />
          <div>Put you files here.</div>
        </ElTourStep>
        <ElTourStep
          target={targetBy("#tour-basic-2")}
          title="Save"
          description="Save your changes"
        />
        <ElTourStep
          target={targetBy("#tour-basic-3")}
          title="Other Actions"
          description="Click to see other"
        />
      </ElTour>
    </>
  );
}

export function TourNonModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ElButton type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </ElButton>

      <ElDivider />

      <ElSpace>
        <ElButton id="tour-non-modal-1">Upload</ElButton>
        <ElButton id="tour-non-modal-2" type="primary">Save</ElButton>
        <ElButton id="tour-non-modal-3" icon={<MoreFilled />} />
      </ElSpace>

      <ElTour visible={open} onVisibleChange={setOpen} type="primary" mask={false}>
        <ElTourStep
          target={targetBy("#tour-non-modal-1")}
          title="Upload File"
          description="Put you files here."
        />
        <ElTourStep
          target={targetBy("#tour-non-modal-2")}
          title="Save"
          description="Save your changes"
        />
        <ElTourStep
          target={targetBy("#tour-non-modal-3")}
          title="Other Actions"
          description="Click to see other"
        />
      </ElTour>
    </>
  );
}

export function TourPlacement() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ElButton
        id="tour-placement-trigger"
        type="primary"
        onClick={() => setOpen(true)}
      >
        Begin Tour
      </ElButton>

      <ElTour visible={open} onVisibleChange={setOpen}>
        <ElTourStep title="Center" description="Displayed in the center of screen." />
        <ElTourStep
          title="Right"
          description="On the right of target."
          placement="right"
          target={targetBy("#tour-placement-trigger")}
        />
        <ElTourStep
          title="Top"
          description="On the top of target."
          placement="top"
          target={targetBy("#tour-placement-trigger")}
        />
      </ElTour>
    </>
  );
}

export function TourMask() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ElButton type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </ElButton>

      <ElDivider />

      <ElSpace>
        <ElButton id="tour-mask-1">Upload</ElButton>
        <ElButton id="tour-mask-2" type="primary">Save</ElButton>
        <ElButton id="tour-mask-3" icon={<MoreFilled />} />
      </ElSpace>

      <ElTour
        visible={open}
        onVisibleChange={setOpen}
        mask={{
          style: { boxShadow: "inset 0 0 15px #333" },
          color: "rgba(80, 255, 255, .4)",
        }}
      >
        <ElTourStep target={targetBy("#tour-mask-1")} title="Upload File">
          <img
            src="https://element-plus.org/images/element-plus-logo.svg"
            alt="tour.png"
          />
          <div>Put you files here.</div>
        </ElTourStep>
        <ElTourStep
          target={targetBy("#tour-mask-2")}
          title="Save"
          description="Save your changes"
          mask={{
            style: { boxShadow: "inset 0 0 15px #fff" },
            color: "rgba(40, 0, 255, .4)",
          }}
        />
        <ElTourStep
          target={targetBy("#tour-mask-3")}
          title="Other Actions"
          description="Click to see other"
          mask={false}
        />
      </ElTour>
    </>
  );
}

export function TourIndicator() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ElButton type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </ElButton>

      <ElDivider />

      <ElSpace>
        <ElButton id="tour-indicator-1">Upload</ElButton>
        <ElButton id="tour-indicator-2" type="primary">Save</ElButton>
        <ElButton id="tour-indicator-3" icon={<MoreFilled />} />
      </ElSpace>

      <ElTour
        visible={open}
        onVisibleChange={setOpen}
        indicators={({ current, total }) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      >
        <ElTourStep
          target={targetBy("#tour-indicator-1")}
          title="Upload File"
          description="Put you files here."
        />
        <ElTourStep
          target={targetBy("#tour-indicator-2")}
          title="Save"
          description="Save your changes"
        />
        <ElTourStep
          target={targetBy("#tour-indicator-3")}
          title="Other Actions"
          description="Click to see other"
        />
      </ElTour>
    </>
  );
}

export function TourTarget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ElButton type="primary" onClick={() => setOpen(true)}>
        Begin Tour
      </ElButton>

      <ElDivider />

      <ElSpace>
        <ElButton id="tour-target-1">Upload</ElButton>
        <ElButton id="tour-target-2" type="primary">Save</ElButton>
        <ElButton id="tour-target-3" icon={<MoreFilled />} />
      </ElSpace>

      <ElTour visible={open} onVisibleChange={setOpen}>
        {/* 选择器字符串 */}
        <ElTourStep
          target="#tour-target-1"
          title="Upload File"
          description="Put you files here."
        />
        {/* 返回元素的函数 */}
        <ElTourStep
          target={targetBy("#tour-target-2")}
          title="Save"
          description="Save your changes"
        />
        {/* 返回元素的函数 */}
        <ElTourStep
          target={() => document.querySelector<HTMLElement>("#tour-target-3")}
          title="Other Actions"
          description="Click to see other"
        />
      </ElTour>
    </>
  );
}
