"use client";

import { ElEmpty } from "@/components/element-plus/empty";
import { ElResult } from "@/components/element-plus/result";
import { ElButton } from "@/components/element-plus/button";

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))",
  gap: "1.6rem",
} as const;

export function EmptyBasic() {
  return (
    <div style={grid}>
      <ElEmpty />
      <ElEmpty description="自定义描述文字" />
    </div>
  );
}

export function EmptySize() {
  return (
    <div style={grid}>
      <ElEmpty imageSize={80} />
      <ElEmpty imageSize={140} />
      <ElEmpty imageSize="10rem" />
    </div>
  );
}

export function EmptyBottom() {
  return (
    <ElEmpty description="暂无内容，请先创建">
      <ElButton type="primary">立即创建</ElButton>
    </ElEmpty>
  );
}

export function EmptyCustomImage() {
  return (
    <div style={grid}>
      <ElEmpty
        image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' rx='12' fill='%23ecf5ff'/%3E%3Ctext x='60' y='68' font-size='16' text-anchor='middle' fill='%23409eff'%3E自定义%3C/text%3E%3C/svg%3E"
        description="使用自定义插图"
      />
    </div>
  );
}

export function ResultBasic() {
  return (
    <div style={grid}>
      {(["primary", "success", "warning", "error"] as const).map((icon) => (
        <ElResult
          key={icon}
          icon={icon}
          title={`${icon} 提示`}
          subTitle="请根据提示进行后续操作"
          extra={<ElButton type="primary">返回</ElButton>}
        />
      ))}
      <ElResult
        icon="info"
        title="信息提示"
        subTitle={<p>使用插槽自定义副标题</p>}
        extra={<ElButton type="primary">返回</ElButton>}
      />
    </div>
  );
}

/** 官方示例用 el-image 传自定义图标，这里用内联 SVG 保持离线可用。 */
const CUSTOM_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Ccircle cx='80' cy='80' r='76' fill='%23f0f2f5'/%3E%3Ctext x='80' y='92' font-size='40' text-anchor='middle' fill='%23909399'%3E404%3C/text%3E%3C/svg%3E";

export function ResultCustomIcon() {
  return (
    <div style={grid}>
      <ElResult
        title="404"
        subTitle="抱歉，请求出错"
        customIcon={<img src={CUSTOM_ICON} alt="" style={{ width: "100%" }} />}
        extra={<ElButton type="primary">返回</ElButton>}
      />
    </div>
  );
}
