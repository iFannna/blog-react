"use client";

import { useState } from "react";
import { ElStep, ElSteps } from "@/components/ui/steps";
import { ElButton } from "@/components/ui/button";
import { Edit, Picture, Upload, UploadFilled } from "@/components/ui/icons";

const stepsStyle = { maxWidth: 600 } as const;

export function StepsBasic() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <ElSteps active={active} finishStatus="success" style={stepsStyle}>
        <ElStep title="Step 1" />
        <ElStep title="Step 2" />
        <ElStep title="Step 3" />
      </ElSteps>
      <ElButton
        style={{ marginTop: 12 }}
        onClick={() => setActive((current) => (current > 2 ? 0 : current + 1))}
      >
        Next step
      </ElButton>
    </div>
  );
}

export function StepsCentered() {
  return (
    <ElSteps active={2} alignCenter style={stepsStyle}>
      <ElStep title="Step 1" description="Some description" />
      <ElStep title="Step 2" description="Some description" />
      <ElStep title="Step 3" description="Some description" />
    </ElSteps>
  );
}

export function StepsSimple() {
  return (
    <div>
      <ElSteps active={1} simple space={200} style={{ ...stepsStyle, marginBottom: 16 }}>
        <ElStep title="Step 1" icon={<Edit />} />
        <ElStep title="Step 2" icon={<UploadFilled />} />
        <ElStep title="Step 3" icon={<Picture />} />
      </ElSteps>
      <ElSteps active={1} simple finishStatus="success" style={stepsStyle}>
        <ElStep title="Step 1" />
        <ElStep title="Step 2" />
        <ElStep title="Step 3" />
      </ElSteps>
    </div>
  );
}

export function StepsVertical() {
  return (
    <div style={{ height: 300, maxWidth: 600 }}>
      <ElSteps active={1} direction="vertical">
        <ElStep title="Step 1" />
        <ElStep title="Step 2" />
        <ElStep title="Step 3" />
      </ElSteps>
    </div>
  );
}

export function StepsWithDescription() {
  return (
    <ElSteps active={1} style={stepsStyle}>
      <ElStep title="Step 1" description="Some description" />
      <ElStep title="Step 2" description="Some description" />
      <ElStep title="Step 3" description="Some description" />
    </ElSteps>
  );
}

export function StepsWithIcon() {
  return (
    <ElSteps active={1} style={stepsStyle}>
      <ElStep title="Step 1" icon={<Edit />} />
      <ElStep title="Step 2" icon={<Upload />} />
      <ElStep title="Step 3" icon={<Picture />} />
    </ElSteps>
  );
}

export function StepsWithStatus() {
  return (
    <div>
      <ElSteps
        active={1}
        space={200}
        finishStatus="success"
        style={{ ...stepsStyle, marginBottom: 24 }}
      >
        <ElStep title="Done" />
        <ElStep title="Processing" />
        <ElStep title="Step 3" />
      </ElSteps>
      <ElSteps active={1} processStatus="error" style={stepsStyle}>
        <ElStep title="Done" />
        <ElStep title="Error" />
        <ElStep title="Step 3" />
      </ElSteps>
    </div>
  );
}
