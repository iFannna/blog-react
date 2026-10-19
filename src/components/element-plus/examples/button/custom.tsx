"use client";

import { ElButton } from "@/components/element-plus/button";
import { exampleRow, exampleStack } from "./styles";

const COLOR = "#626aef";

export default function ButtonCustom() {
  return (
    <div style={exampleStack}>
      <div style={exampleRow}>
        <ElButton color={COLOR}>Default</ElButton>
        <ElButton color={COLOR} plain>
          Plain
        </ElButton>
        <ElButton color={COLOR} link>
          Link
        </ElButton>
        <ElButton color={COLOR} text>
          Text
        </ElButton>
        <ElButton color={COLOR} text bg>
          Text BG
        </ElButton>
      </div>

      <div style={exampleRow}>
        <ElButton color={COLOR} disabled>
          Disabled
        </ElButton>
        <ElButton color={COLOR} disabled plain>
          Disabled Plain
        </ElButton>
        <ElButton color={COLOR} disabled link>
          Disabled Link
        </ElButton>
        <ElButton color={COLOR} disabled text>
          Disabled Text
        </ElButton>
        <ElButton color={COLOR} disabled text bg>
          Disabled Text BG
        </ElButton>
      </div>
    </div>
  );
}
