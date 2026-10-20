"use client";

import { ElEmpty } from "@/components/element-plus/empty";
import { ElResult } from "@/components/element-plus/result";
import { ElButton } from "@/components/element-plus/button";
import { ElImage } from "@/components/element-plus/image";
import { ElCol, ElRow } from "@/components/element-plus/row";

const HAMBURGER =
  "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png";

export function EmptyBasic() {
  return <ElEmpty description="description" />;
}

export function EmptyCustomImage() {
  return <ElEmpty image={HAMBURGER} />;
}

export function EmptySize() {
  return <ElEmpty imageSize={200} />;
}

export function EmptyBottom() {
  return (
    <ElEmpty>
      <ElButton type="primary">Button</ElButton>
    </ElEmpty>
  );
}

export function ResultBasic() {
  return (
    <ElRow>
      <ElCol sm={12} lg={6} xl={4}>
        <ElResult
          icon="primary"
          title="Primary Tip"
          subTitle="Please follow the instructions"
          extra={<ElButton type="primary">Back</ElButton>}
        />
      </ElCol>
      <ElCol sm={12} lg={6} xl={4}>
        <ElResult
          icon="success"
          title="Success Tip"
          subTitle="Please follow the instructions"
          extra={<ElButton type="primary">Back</ElButton>}
        />
      </ElCol>
      <ElCol sm={12} lg={6} xl={4}>
        <ElResult
          icon="warning"
          title="Warning Tip"
          subTitle="Please follow the instructions"
          extra={<ElButton type="primary">Back</ElButton>}
        />
      </ElCol>
      <ElCol sm={12} lg={6} xl={4}>
        <ElResult
          icon="error"
          title="Error Tip"
          subTitle="Please follow the instructions"
          extra={<ElButton type="primary">Back</ElButton>}
        />
      </ElCol>
      <ElCol sm={12} lg={6} xl={4}>
        <ElResult
          icon="info"
          title="Info Tip"
          subTitle={<p>Using slot as subtitle</p>}
          extra={<ElButton type="primary">Back</ElButton>}
        />
      </ElCol>
    </ElRow>
  );
}

export function ResultCustomIcon() {
  return (
    <ElResult
      title="404"
      subTitle="Sorry, request error"
      customIcon={<ElImage src={HAMBURGER} />}
      extra={<ElButton type="primary">Back</ElButton>}
    />
  );
}
