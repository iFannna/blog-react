"use client";

import { useState } from "react";
import dayjs from "dayjs";

import { ElButton } from "@/components/ui/button";
import { ElCountdown } from "@/components/ui/countdown";
import { ElIcon } from "@/components/ui/icon/ElIcon";
import { Calendar } from "@/components/ui/icons";
import { ElCol, ElRow } from "@/components/ui/row";
import { ElStatistic } from "@/components/ui/statistic";

const stack = { display: "flex", flexDirection: "column" as const, gap: "2.4rem" };

const colStyle = {
  textAlign: "center" as const,
  marginBottom: "16px",
};

const footerStyle = { marginTop: "8px" };

export function StatisticBasic() {
  return (
    <div style={stack}>
      <ElStatistic title="原始值" value={268500} />
      <ElStatistic title="精度 2" value={268500} precision={2} />
      <ElStatistic title="前缀后缀" value={1128} prefix="¥" suffix="元" />
      <ElStatistic
        title="自定义分隔符"
        value={1234567.89}
        precision={2}
        groupSeparator=" "
        decimalSeparator=","
      />
    </div>
  );
}

export function StatisticCountdown() {
  const [value] = useState(() => Date.now() + 1000 * 60 * 60 * 7);
  const [value1, setValue1] = useState(
    () => Date.now() + 1000 * 60 * 60 * 24 * 2,
  );
  const [value2] = useState(() => dayjs().add(1, "month").startOf("month"));

  const reset = () => {
    setValue1(Date.now() + 1000 * 60 * 60 * 24 * 2);
  };

  return (
    <ElRow gutter={16}>
      <ElCol xs={24} sm={12} md={8} style={colStyle}>
        <ElCountdown title="Start to grab" value={value} />
      </ElCol>

      <ElCol xs={24} sm={12} md={8} style={colStyle}>
        <ElCountdown title="Remaining VIP time" format="HH:mm:ss" value={value1} />
        <ElButton type="primary" style={footerStyle} onClick={reset}>
          Reset
        </ElButton>
      </ElCol>

      <ElCol xs={24} sm={12} md={8} style={colStyle}>
        <ElCountdown
          format="DD [days] HH:mm:ss"
          value={value2}
          title={
            <span style={{ display: "inline-flex", alignItems: "center" }}>
              <ElIcon size={12} style={{ marginRight: "4px" }}>
                <Calendar />
              </ElIcon>
              Still to go until next month
            </span>
          }
        />
        <div style={footerStyle}>{value2.format("YYYY-MM-DD")}</div>
      </ElCol>
    </ElRow>
  );
}

export function StatisticFormatter() {
  return (
    <div style={stack}>
      <ElStatistic
        title="进度"
        value={0.875}
        formatter={(v) => `${(Number(v) * 100).toFixed(1)}%`}
      />
      <ElStatistic title="非数字" value="暂无数据" />
    </div>
  );
}
