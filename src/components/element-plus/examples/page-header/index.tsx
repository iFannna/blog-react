"use client";

import type { CSSProperties } from "react";
import { ElPageHeader } from "@/components/element-plus/page-header";
import { ElBreadcrumb, ElBreadcrumbItem } from "@/components/element-plus/breadcrumb";
import { ElAvatar } from "@/components/element-plus/avatar";
import { ElButton } from "@/components/element-plus/button";
import { ElTag } from "@/components/element-plus/tag";
import { ElDescriptions, ElDescriptionsItem } from "@/components/element-plus/descriptions";
import { notification } from "@/components/element-plus/notification";
import { ArrowLeft } from "@/components/element-plus/icons";

const AVATAR_IMG =
  "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

/**
 * 官方示例用 unocss 工具类（text-large / font-600 / mr-3 等），
 * 本项目没有 unocss，这里按 presetWind3 的默认值换写成等价内联样式：
 * text-large=18px、text-sm=14px、font-600=600、mr-3=12px、mr-2=8px、
 * mt-4=16px、ml-2=8px。
 */
const flexRow: CSSProperties = { display: "flex", alignItems: "center" };
const titleStyle: CSSProperties = { fontSize: 18, fontWeight: 600, marginRight: 12 };
const subtitleStyle: CSSProperties = {
  fontSize: 14,
  marginRight: 8,
  color: "var(--el-text-color-regular)",
};
const mainStyle: CSSProperties = { marginTop: 16, fontSize: 14, fontWeight: 700 };

export function PageHeaderComplete() {
  return (
    <div aria-label="A complete example of page header">
      <ElPageHeader
        onBack={() => notification("Back")}
        breadcrumb={
          <ElBreadcrumb separator="/">
            <ElBreadcrumbItem to="./page-header.html">homepage</ElBreadcrumbItem>
            <ElBreadcrumbItem>
              <a href="./page-header.html">route 1</a>
            </ElBreadcrumbItem>
            <ElBreadcrumbItem>route 2</ElBreadcrumbItem>
          </ElBreadcrumb>
        }
        contentSlot={
          <div style={flexRow}>
            <ElAvatar size={32} src={AVATAR_IMG} style={{ marginRight: 12 }} />
            <span style={titleStyle}>Title</span>
            <span style={subtitleStyle}>Sub title</span>
            <ElTag>Default</ElTag>
          </div>
        }
        extra={
          <div style={flexRow}>
            <ElButton>Print</ElButton>
            <ElButton type="primary" style={{ marginLeft: 8 }}>Edit</ElButton>
          </div>
        }
      >
        <ElDescriptions column={3} size="small" style={{ marginTop: 16 }}>
          <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
          <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
          <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
          <ElDescriptionsItem label="Remarks">
            <ElTag size="small">School</ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="Address">
            No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
          </ElDescriptionsItem>
        </ElDescriptions>
        <p style={{ ...mainStyle, fontWeight: 400 }}>
          Element Plus team uses <b>weekly</b> release strategy under normal
          circumstance, but critical bug fixes would require hotfix so the actual
          release number <b>could be</b> more than 1 per week.
        </p>
      </ElPageHeader>
    </div>
  );
}

export function PageHeaderBasic() {
  return (
    <ElPageHeader
      onBack={() => {
        console.log("go back");
      }}
      contentSlot={<span style={titleStyle}>Title</span>}
    />
  );
}

export function PageHeaderCustomIcon() {
  return <ElPageHeader icon={<ArrowLeft />} contentSlot={<span style={titleStyle}>Title</span>} />;
}

export function PageHeaderNoIcon() {
  return <ElPageHeader icon="" contentSlot={<span style={titleStyle}>Title</span>} />;
}

export function PageHeaderBreadcrumb() {
  return (
    <ElPageHeader
      contentSlot={<span style={titleStyle}>Title</span>}
      breadcrumb={
        <ElBreadcrumb separator="/">
          <ElBreadcrumbItem to="./page-header.html">homepage</ElBreadcrumbItem>
          <ElBreadcrumbItem>
            <a href="./page-header.html">route 1</a>
          </ElBreadcrumbItem>
          <ElBreadcrumbItem>route 2</ElBreadcrumbItem>
        </ElBreadcrumb>
      }
    />
  );
}

export function PageHeaderAdditionalSections() {
  return (
    <ElPageHeader
      icon=""
      contentSlot={
        <div style={flexRow}>
          <ElAvatar size={32} src={AVATAR_IMG} style={{ marginRight: 12 }} />
          <span style={titleStyle}>Title</span>
          <span style={subtitleStyle}>Sub title</span>
          <ElTag>Default</ElTag>
        </div>
      }
      extra={
        <div style={flexRow}>
          <ElButton>Print</ElButton>
          <ElButton type="primary" style={{ marginLeft: 8 }}>Edit</ElButton>
        </div>
      }
    />
  );
}

export function PageHeaderMainContent() {
  return (
    <ElPageHeader contentSlot={<span style={titleStyle}>Title</span>}>
      <div style={mainStyle}>
        Your additional content can be added with default slot, You may put as
        many content as you want here.
      </div>
    </ElPageHeader>
  );
}
