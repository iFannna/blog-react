"use client";

import { Bell } from "@/components/element-plus/generated/icons";
import { ElAlert } from "@/components/element-plus/alert";

const box = { maxWidth: 600 } as const;
const gap = { marginTop: 20 } as const;

export function AlertBasic() {
  return (
    <div style={box}>
      <ElAlert title="Primary alert" type="primary" />
      <ElAlert title="Success alert" type="success" style={gap} />
      <ElAlert title="Info alert" type="info" style={gap} />
      <ElAlert title="Warning alert" type="warning" style={gap} />
      <ElAlert title="Error alert" type="error" style={gap} />
    </div>
  );
}

export function AlertTheme() {
  return (
    <div style={box}>
      <ElAlert title="Primary alert" type="primary" effect="dark" />
      <ElAlert title="Success alert" type="success" effect="dark" style={gap} />
      <ElAlert title="Info alert" type="info" effect="dark" style={gap} />
      <ElAlert title="Warning alert" type="warning" effect="dark" style={gap} />
      <ElAlert title="Error alert" type="error" effect="dark" style={gap} />
    </div>
  );
}

export function AlertCustomClose() {
  return (
    <div style={box}>
      <ElAlert title="Unclosable alert" type="success" closable={false} />
      <ElAlert title="Customized close text" type="info" closeText="Gotcha" style={gap} />
      <ElAlert title="Alert with callback" type="warning" style={gap} />
    </div>
  );
}

export function AlertIcon() {
  return (
    <div style={box}>
      <ElAlert title="Primary alert" type="primary" showIcon />
      <ElAlert title="Success alert" type="success" showIcon style={gap} />
      <ElAlert title="Info alert" type="info" showIcon style={gap} />
      <ElAlert title="Warning alert" type="warning" showIcon style={gap} />
      <ElAlert title="Error alert" type="error" showIcon style={gap} />
      <ElAlert
        title="Error alert with custom icon"
        type="error"
        showIcon
        icon={<Bell />}
        style={gap}
      />
    </div>
  );
}

export function AlertCenter() {
  return (
    <div style={box}>
      <ElAlert title="Primary alert" type="primary" center showIcon />
      <ElAlert title="Success alert" type="success" center showIcon style={gap} />
      <ElAlert title="Info alert" type="info" center showIcon style={gap} />
      <ElAlert title="Warning alert" type="warning" center showIcon style={gap} />
      <ElAlert title="Error alert" type="error" center showIcon style={gap} />
    </div>
  );
}

export function AlertDescription() {
  return (
    <div style={box}>
      <ElAlert
        title="With description"
        type="success"
        description="This is a description."
      />
    </div>
  );
}

export function AlertIconDescription() {
  return (
    <div style={box}>
      <ElAlert
        title="Primary alert"
        type="primary"
        description="More text description"
        showIcon
      />
      <ElAlert
        title="Success alert"
        type="success"
        description="More text description"
        showIcon
        style={gap}
      />
      <ElAlert
        title="Info alert"
        type="info"
        description="More text description"
        showIcon
        style={gap}
      />
      <ElAlert
        title="Warning alert"
        type="warning"
        description="More text description"
        showIcon
        style={gap}
      />
      <ElAlert
        title="Error alert"
        type="error"
        description="More text description"
        showIcon
        style={gap}
      />
    </div>
  );
}
