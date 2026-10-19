"use client";

import {
  ElDescriptions,
  ElDescriptionsItem,
} from "@/components/element-plus/descriptions";
import { ElButton } from "@/components/element-plus/button";

export function DescriptionsBasic() {
  return (
    <ElDescriptions title="用户信息" extra={<ElButton size="small">操作</ElButton>}>
      <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
      <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
      <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
      <ElDescriptionsItem label="备注">学校</ElDescriptionsItem>
      <ElDescriptionsItem label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</ElDescriptionsItem>
    </ElDescriptions>
  );
}

export function DescriptionsSizes() {
  return (
    <div style={{ display: "grid", gap: "2.4rem" }}>
      <ElDescriptions title="large" border size="large">
        <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
        <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
      </ElDescriptions>
      <ElDescriptions title="default" border size="default">
        <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
        <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
      </ElDescriptions>
      <ElDescriptions title="small" border size="small">
        <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
        <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
      </ElDescriptions>
    </div>
  );
}

export function DescriptionsVertical() {
  return (
    <ElDescriptions title="垂直列表" direction="vertical" border>
      <ElDescriptionsItem label="用户名">kooriookami</ElDescriptionsItem>
      <ElDescriptionsItem label="手机号">18100000000</ElDescriptionsItem>
      <ElDescriptionsItem label="居住地">苏州市</ElDescriptionsItem>
      <ElDescriptionsItem label="备注">
        <ElButton size="small">编辑</ElButton>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</ElDescriptionsItem>
    </ElDescriptions>
  );
}

export function DescriptionsRowspan() {
  return (
    <div style={{ display: "grid", gap: "2.4rem" }}>
      <ElDescriptions title="带边框" border column={2}>
        <ElDescriptionsItem label="产品">云服务</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">运行中</ElDescriptionsItem>
        <ElDescriptionsItem label="规格">2 核 4G</ElDescriptionsItem>
        <ElDescriptionsItem label="地域">华东</ElDescriptionsItem>
      </ElDescriptions>
      <ElDescriptions border>
        <ElDescriptionsItem label="产品">云服务</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">运行中</ElDescriptionsItem>
        <ElDescriptionsItem label="规格">2 核 4G</ElDescriptionsItem>
        <ElDescriptionsItem label="备注" span={2}>
          跨两列
        </ElDescriptionsItem>
        <ElDescriptionsItem label="地域">华东</ElDescriptionsItem>
      </ElDescriptions>
    </div>
  );
}

export function DescriptionsCustomStyle() {
  return (
    <ElDescriptions title="自定义样式" border column={3} labelWidth="120px">
      <ElDescriptionsItem label="用户名" align="center">
        kooriookami
      </ElDescriptionsItem>
      <ElDescriptionsItem label="手机号" align="center">
        18100000000
      </ElDescriptionsItem>
      <ElDescriptionsItem label="居住地" align="center">
        苏州市
      </ElDescriptionsItem>
      <ElDescriptionsItem label="备注" labelAlign="right">
        学校
      </ElDescriptionsItem>
      <ElDescriptionsItem label="联系地址" labelAlign="right">
        江苏省苏州市吴中区吴中大道 1188 号
      </ElDescriptionsItem>
    </ElDescriptions>
  );
}
