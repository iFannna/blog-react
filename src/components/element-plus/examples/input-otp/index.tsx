"use client";

import { useState } from "react";
import { ElInputOtp } from "@/components/element-plus/input-otp";

const stack = { display: "flex", flexDirection: "column", gap: "2rem" } as const;
const typeWrap = { display: "flex", flexDirection: "column", gap: "1.2rem" } as const;
const label = {
  // 官方 demo 的 p 依赖文档站全局 reset 去掉默认 margin-top
  margin: "0 0 0.8rem",
  fontSize: "1.4rem",
  color: "var(--el-text-color-secondary)",
} as const;
const valueText = { marginTop: "2rem" } as const;

export function InputOtpBasic() {
  const [otp, setOtp] = useState("123");
  return (
    <div>
      <ElInputOtp value={otp} onChange={setOtp} />
      <div style={valueText}>Value: {otp}</div>
    </div>
  );
}

export function InputOtpCustomLength() {
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  return (
    <div style={stack}>
      <ElInputOtp value={otp1} onChange={setOtp1} length={4} />
      <ElInputOtp value={otp2} onChange={setOtp2} length={8} />
    </div>
  );
}

export function InputOtpTypes() {
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  return (
    <div style={stack}>
      <div>
        <p style={label}>Outlined (Default)</p>
        <ElInputOtp value={otp1} onChange={setOtp1} type="outlined" />
      </div>
      <div>
        <p style={label}>Filled</p>
        <ElInputOtp value={otp2} onChange={setOtp2} type="filled" />
      </div>
      <div>
        <p style={label}>Underlined</p>
        <ElInputOtp value={otp3} onChange={setOtp3} type="underlined" />
      </div>
    </div>
  );
}

export function InputOtpSizes() {
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  return (
    <div style={stack}>
      <div>
        <p style={label}>Large</p>
        <ElInputOtp value={otp1} onChange={setOtp1} size="large" />
      </div>
      <div>
        <p style={label}>Default</p>
        <ElInputOtp value={otp2} onChange={setOtp2} size="default" />
      </div>
      <div>
        <p style={label}>Small</p>
        <ElInputOtp value={otp3} onChange={setOtp3} size="small" />
      </div>
    </div>
  );
}

export function InputOtpDisabled() {
  const [otp1] = useState("123");
  const [otp2] = useState("456");
  return (
    <div style={stack}>
      <div style={typeWrap}>
        <p style={label}>Disabled</p>
        <ElInputOtp value={otp1} disabled />
        <ElInputOtp value={otp1} disabled type="filled" />
        <ElInputOtp value={otp1} disabled type="underlined" />
      </div>
      <div style={typeWrap}>
        <p style={label}>Readonly</p>
        <ElInputOtp value={otp2} readonly />
        <ElInputOtp value={otp2} readonly type="filled" />
        <ElInputOtp value={otp2} readonly type="underlined" />
      </div>
    </div>
  );
}

export function InputOtpMask() {
  const [otp, setOtp] = useState("123");
  return (
    <div>
      <ElInputOtp value={otp} onChange={setOtp} mask />
      <div style={valueText}>Value: {otp}</div>
    </div>
  );
}

export function InputOtpSeparator() {
  return (
    <div style={stack}>
      <ElInputOtp separator="/" />
      <ElInputOtp separator={(index) => (index & 1 ? "—" : "")} />
      <ElInputOtp separatorSlot={() => "•"} />
    </div>
  );
}

export function InputOtpValidator() {
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const onlyAllowNumber = (value: string) => /^\d$/.test(value);
  const onlyAllowLetter = (value: string) => /^[a-zA-Z]$/.test(value);
  return (
    <div style={stack}>
      <div>
        <p style={label}>Numbers only</p>
        <ElInputOtp
          value={otp1}
          onChange={setOtp1}
          validator={onlyAllowNumber}
          inputmode="numeric"
        />
      </div>
      <div>
        <p style={label}>Letters only</p>
        <ElInputOtp value={otp2} onChange={setOtp2} validator={onlyAllowLetter} />
      </div>
    </div>
  );
}
