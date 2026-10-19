"use client";

import { ElRow, ElCol } from "@/components/ui/row";
import type { CSSProperties } from "react";

const grid = { borderRadius: 4, minHeight: 36 };
const purpleDark = { ...grid, background: "var(--el-color-primary-dark-2)" };
const purple = { ...grid, background: "var(--el-color-primary-light-5)" };
const purpleLight = { ...grid, background: "var(--el-color-primary-light-8)" };
const rowSpacing: CSSProperties = { marginBottom: 20 };

export function RowBasic() {
  return (
    <div>
      <ElRow style={rowSpacing}>
        <ElCol span={24}>
          <div style={purpleDark} />
        </ElCol>
      </ElRow>
      <ElRow style={rowSpacing}>
        <ElCol span={12}>
          <div style={purple} />
        </ElCol>
        <ElCol span={12}>
          <div style={purpleLight} />
        </ElCol>
      </ElRow>
      <ElRow style={rowSpacing}>
        <ElCol span={8}>
          <div style={purple} />
        </ElCol>
        <ElCol span={8}>
          <div style={purpleLight} />
        </ElCol>
        <ElCol span={8}>
          <div style={purple} />
        </ElCol>
      </ElRow>
      <ElRow style={rowSpacing}>
        {[0, 1, 2, 3].map((index) => (
          <ElCol key={index} span={6}>
            <div style={index % 2 === 0 ? purple : purpleLight} />
          </ElCol>
        ))}
      </ElRow>
      <ElRow>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <ElCol key={index} span={4}>
            <div style={index % 2 === 0 ? purple : purpleLight} />
          </ElCol>
        ))}
      </ElRow>
    </div>
  );
}

export function RowGutter() {
  return (
    <ElRow gutter={20}>
      {[0, 1, 2, 3].map((index) => (
        <ElCol key={index} span={6}>
          <div style={purple} />
        </ElCol>
      ))}
    </ElRow>
  );
}

export function RowOffset() {
  return (
    <div>
      <ElRow gutter={20} style={rowSpacing}>
        <ElCol span={6}>
          <div style={purple} />
        </ElCol>
        <ElCol span={6} offset={6}>
          <div style={purple} />
        </ElCol>
      </ElRow>
      <ElRow gutter={20} style={rowSpacing}>
        <ElCol span={6} offset={6}>
          <div style={purple} />
        </ElCol>
        <ElCol span={6} offset={6}>
          <div style={purple} />
        </ElCol>
      </ElRow>
      <ElRow gutter={20}>
        <ElCol span={12} offset={6}>
          <div style={purple} />
        </ElCol>
      </ElRow>
    </div>
  );
}

export function RowJustify() {
  const justifies = [
    "start",
    "center",
    "end",
    "space-between",
    "space-around",
    "space-evenly",
  ] as const;

  return (
    <div>
      {justifies.map((justify, index) => (
        <ElRow
          key={justify}
          justify={justify}
          style={index === justifies.length - 1 ? undefined : rowSpacing}
        >
          <ElCol span={6}>
            <div style={purple} />
          </ElCol>
          <ElCol span={6}>
            <div style={purpleLight} />
          </ElCol>
          <ElCol span={6}>
            <div style={purple} />
          </ElCol>
        </ElRow>
      ))}
    </div>
  );
}

export function RowHybrid() {
  return (
    <div>
      <ElRow gutter={20} style={rowSpacing}>
        <ElCol span={16}>
          <div style={purple} />
        </ElCol>
        <ElCol span={8}>
          <div style={purple} />
        </ElCol>
      </ElRow>
      <ElRow gutter={20} style={rowSpacing}>
        <ElCol span={8}>
          <div style={purple} />
        </ElCol>
        <ElCol span={8}>
          <div style={purple} />
        </ElCol>
        <ElCol span={4}>
          <div style={purple} />
        </ElCol>
        <ElCol span={4}>
          <div style={purple} />
        </ElCol>
      </ElRow>
      <ElRow gutter={20}>
        <ElCol span={4}>
          <div style={purple} />
        </ElCol>
        <ElCol span={16}>
          <div style={purple} />
        </ElCol>
        <ElCol span={4}>
          <div style={purple} />
        </ElCol>
      </ElRow>
    </div>
  );
}

export function RowResponsive() {
  return (
    <ElRow gutter={10}>
      <ElCol xs={8} sm={6} md={4} lg={3} xl={1}>
        <div style={purple} />
      </ElCol>
      <ElCol xs={4} sm={6} md={8} lg={9} xl={11}>
        <div style={purpleLight} />
      </ElCol>
      <ElCol xs={4} sm={6} md={8} lg={9} xl={11}>
        <div style={purple} />
      </ElCol>
      <ElCol xs={8} sm={6} md={4} lg={3} xl={1}>
        <div style={purpleLight} />
      </ElCol>
    </ElRow>
  );
}
