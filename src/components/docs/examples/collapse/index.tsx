"use client";

import { useState, type CSSProperties } from "react";
import {
  ElCollapse,
  ElCollapseItem,
  type CollapseActiveName,
} from "@/components/element-plus/collapse";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CaretRight, InfoFilled } from "@/components/element-plus/generated/icons";

const consistencyText = [
  "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;",
  "Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.",
];

const feedbackText = [
  "Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;",
  "Visual feedback: reflect current state by updating or rearranging elements of the page.",
];

const efficiencyText = [
  "Simplify the process: keep operating process simple and intuitive;",
  "Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;",
  "Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.",
];

const controllability = (advice: string) => [
  `Decision making: giving ${advice} about operations is acceptable, but do not make decisions for the users;`,
  "Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.",
];

const titleWrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const customIconStyle: CSSProperties = {
  margin: "0 8px 0 auto",
  color: "var(--el-color-primary)",
};

function renderTexts(texts: string[]) {
  return texts.map((text) => <div key={text}>{text}</div>);
}

export function CollapseBasic() {
  const [activeNames, setActiveNames] = useState<CollapseActiveName[]>(["1"]);

  return (
    <ElCollapse
      value={activeNames}
      onChange={(value) =>
        setActiveNames(Array.isArray(value) ? value : [value])
      }
    >
      <ElCollapseItem title="Consistency" name="1">
        {renderTexts(consistencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Feedback" name="2">
        {renderTexts(feedbackText)}
      </ElCollapseItem>
      <ElCollapseItem title="Efficiency" name="3">
        {renderTexts(efficiencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Controllability" name="4">
        {renderTexts(controllability("advice"))}
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapseAccordion() {
  const [activeName, setActiveName] = useState<CollapseActiveName>("1");

  return (
    <ElCollapse
      accordion
      value={activeName}
      onChange={(value) =>
        setActiveName(Array.isArray(value) ? (value[0] ?? "") : value)
      }
    >
      <ElCollapseItem title="Consistency" name="1">
        {renderTexts(consistencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Feedback" name="2">
        {renderTexts(feedbackText)}
      </ElCollapseItem>
      <ElCollapseItem title="Efficiency" name="3">
        {renderTexts(efficiencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Controllability" name="4">
        {renderTexts(controllability("advices"))}
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapseIconPosition() {
  const [position, setPosition] = useState<"left" | "right">("left");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>expand icon position: </span>
        <ElSwitch
          value={position}
          activeValue="right"
          inactiveValue="left"
          activeText="right"
          inactiveText="left"
          style={{ "--el-switch-off-color": "#88b8fe" } as CSSProperties}
          onChange={(value) => setPosition(value as "left" | "right")}
        />
      </div>
      <ElCollapse expandIconPosition={position}>
        <ElCollapseItem title="Consistency" name="1">
          {renderTexts(consistencyText)}
        </ElCollapseItem>
        <ElCollapseItem title="Feedback" name="2">
          {renderTexts(feedbackText)}
        </ElCollapseItem>
        <ElCollapseItem title="Efficiency" name="3">
          {renderTexts(efficiencyText)}
        </ElCollapseItem>
      </ElCollapse>
    </div>
  );
}

export function CollapseCustomIcon() {
  const [activeNames, setActiveNames] = useState<CollapseActiveName[]>(["1"]);

  return (
    <ElCollapse
      value={activeNames}
      onChange={(value) =>
        setActiveNames(Array.isArray(value) ? value : [value])
      }
    >
      <ElCollapseItem title="Consistency" name="1" icon={<CaretRight />}>
        {renderTexts(consistencyText)}
      </ElCollapseItem>
      <ElCollapseItem
        title="Feedback"
        name="2"
        icon={({ isActive }) => (
          <span style={customIconStyle}>
            {isActive ? "Expanded" : "Collapsed"}
          </span>
        )}
      >
        {renderTexts(feedbackText)}
      </ElCollapseItem>
      <ElCollapseItem title="Efficiency" name="3">
        {renderTexts(efficiencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Controllability" name="4">
        {renderTexts(controllability("advices"))}
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapseCustomTitle() {
  return (
    <ElCollapse accordion>
      <ElCollapseItem
        name="1"
        title={({ isActive }) => (
          <div
            style={{
              ...titleWrapperStyle,
              color: isActive ? "var(--el-color-primary)" : undefined,
            }}
          >
            Consistency
            <ElIcon>
              <InfoFilled />
            </ElIcon>
          </div>
        )}
      >
        {renderTexts(consistencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Feedback" name="2">
        {renderTexts(feedbackText)}
      </ElCollapseItem>
      <ElCollapseItem title="Efficiency" name="3">
        {renderTexts(efficiencyText)}
      </ElCollapseItem>
      <ElCollapseItem title="Controllability" name="4">
        {renderTexts(controllability("advices"))}
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapsePreventCollapsing() {
  const [before, setBefore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeNames, setActiveNames] = useState<CollapseActiveName[]>(["1"]);

  const beforeCollapse = () => {
    setLoading(true);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve(before);
      }, 1000);
    });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>before collapse return: </span>
        <ElSwitch
          checked={before}
          activeText="true"
          inactiveText="false"
          disabled={loading}
          onCheckedChange={setBefore}
        />
        {loading && <span style={{ marginLeft: 8 }}>loading...</span>}
      </div>
      <ElCollapse
        value={activeNames}
        onChange={(value) =>
          setActiveNames(Array.isArray(value) ? value : [value])
        }
        beforeCollapse={beforeCollapse}
      >
        <ElCollapseItem title="Consistency" name="1">
          {renderTexts(consistencyText)}
        </ElCollapseItem>
        <ElCollapseItem title="Feedback" name="2">
          {renderTexts(feedbackText)}
        </ElCollapseItem>
        <ElCollapseItem title="Efficiency" name="3">
          {renderTexts(efficiencyText)}
        </ElCollapseItem>
        <ElCollapseItem title="Controllability" name="4">
          {renderTexts(controllability("advices"))}
        </ElCollapseItem>
      </ElCollapse>
    </div>
  );
}
