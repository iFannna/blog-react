"use client";

import { useState } from "react";
import dayjs from "dayjs";

import { ElButton } from "@/components/element-plus/button";
import { ElCountdown } from "@/components/element-plus/countdown";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import {
  ArrowRight,
  Calendar,
  CaretBottom,
  CaretTop,
  ChatLineRound,
  Male,
  Warning,
} from "@/components/element-plus/icons";
import { ElCol, ElRow } from "@/components/element-plus/row";
import { ElStatistic } from "@/components/element-plus/statistic";
import { ElTooltip } from "@/components/element-plus/tooltip";

const colStyle = {
  textAlign: "center" as const,
  marginBottom: "16px",
  borderRadius: 4,
};

const cardColStyle = {
  marginBottom: "16px",
  borderRadius: 4,
};

const footerStyle = { marginTop: "8px" };

export function StatisticBasic() {
  return (
    <ElRow gutter={16}>
      <ElCol xs={24} sm={12} md={6} style={colStyle}>
        <ElStatistic title="Daily active users" value={268500} />
      </ElCol>
      <ElCol xs={24} sm={12} md={6} style={colStyle}>
        <ElStatistic
          value={138}
          title={
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              Ratio of men to women
              <ElIcon size={12} style={{ marginLeft: 4 }}>
                <Male />
              </ElIcon>
            </div>
          }
          suffix="/100"
        />
      </ElCol>
      <ElCol xs={24} sm={12} md={6} style={colStyle}>
        <ElStatistic title="Total Transactions" value={172000} />
      </ElCol>
      <ElCol xs={24} sm={12} md={6} style={colStyle}>
        <ElStatistic
          title="Feedback number"
          value={562}
          suffix={
            <ElIcon style={{ verticalAlign: "-0.125em" }}>
              <ChatLineRound />
            </ElIcon>
          }
        />
      </ElCol>
    </ElRow>
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

const cardStyle = {
  height: "100%",
  padding: 20,
  borderRadius: 4,
  backgroundColor: "var(--el-bg-color-overlay)",
} as const;

const statisticFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap" as const,
  fontSize: 12,
  color: "var(--el-text-color-regular)",
  marginTop: 16,
};

const footerItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
} as const;

const footerValue = {
  display: "inline-flex",
  alignItems: "center",
  marginLeft: 4,
} as const;

const statisticStyle = {
  "--el-statistic-content-font-size": "28px",
} as React.CSSProperties;

const cardTitle = (text: string, tip: string) => (
  <div style={{ display: "inline-flex", alignItems: "center" }}>
    {text}
    <ElTooltip effect="dark" content={tip} placement="top">
      <ElIcon size={12} style={{ marginLeft: 4 }}>
        <Warning />
      </ElIcon>
    </ElTooltip>
  </div>
);

export function StatisticCard() {
  return (
    <div style={{ width: "100%", backgroundColor: "var(--el-fill-color)" }}>
      <ElRow gutter={16}>
        <ElCol xs={24} sm={12} md={8} style={cardColStyle}>
          <div style={cardStyle}>
            <ElStatistic
              value={98500}
              style={statisticStyle}
              title={cardTitle(
                "Daily active users",
                "Number of users who logged into the product in one day",
              )}
            />
            <div style={statisticFooter}>
              <div style={footerItem}>
                <span>than yesterday</span>
                <span style={{ ...footerValue, color: "var(--el-color-success)" }}>
                  24%
                  <ElIcon>
                    <CaretTop />
                  </ElIcon>
                </span>
              </div>
            </div>
          </div>
        </ElCol>
        <ElCol xs={24} sm={12} md={8} style={cardColStyle}>
          <div style={cardStyle}>
            <ElStatistic
              value={693700}
              style={statisticStyle}
              title={cardTitle(
                "Monthly Active Users",
                "Number of users who logged into the product in one month",
              )}
            />
            <div style={statisticFooter}>
              <div style={footerItem}>
                <span>month on month</span>
                <span style={{ ...footerValue, color: "var(--el-color-error)" }}>
                  12%
                  <ElIcon>
                    <CaretBottom />
                  </ElIcon>
                </span>
              </div>
            </div>
          </div>
        </ElCol>
        <ElCol xs={24} sm={12} md={8} style={cardColStyle}>
          <div style={cardStyle}>
            <ElStatistic
              value={72000}
              style={statisticStyle}
              title={
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  New transactions today
                </div>
              }
            />
            <div style={statisticFooter}>
              <div style={footerItem}>
                <span>than yesterday</span>
                <span style={{ ...footerValue, color: "var(--el-color-success)" }}>
                  16%
                  <ElIcon>
                    <CaretTop />
                  </ElIcon>
                </span>
              </div>
              <div style={footerItem}>
                <ElIcon size={14}>
                  <ArrowRight />
                </ElIcon>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>
  );
}

export function StatisticFormatter() {
  return (
    <ElRow gutter={16}>
      <ElCol xs={24} sm={12} md={8} style={colStyle}>
        <ElStatistic
          title="进度"
          value={0.875}
          formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
        />
      </ElCol>
      <ElCol xs={24} sm={12} md={8} style={colStyle}>
        <ElStatistic title="非数字" value="暂无数据" />
      </ElCol>
    </ElRow>
  );
}
