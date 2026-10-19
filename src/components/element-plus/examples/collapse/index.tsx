"use client";

import { useState, type CSSProperties } from "react";
import {
  ElCollapse,
  ElCollapseItem,
  type CollapseActiveName,
} from "@/components/element-plus/collapse";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CaretRight, InfoFilled } from "@/components/element-plus/icons";

const itemText = [
  "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念。",
  "在界面中一致：所有元素和结构应保持一致，比如设计风格、图标和文本、元素的位置等。",
  "反馈及时：通过界面样式和交互效果让用户清晰感知自己的操作。",
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

export function CollapseBasic() {
  const [activeNames, setActiveNames] = useState<CollapseActiveName[]>(["1"]);

  return (
    <ElCollapse
      value={activeNames}
      onChange={(value) =>
        setActiveNames(Array.isArray(value) ? value : [value])
      }
    >
      <ElCollapseItem title="一致性 Consistency" name="1">
        {itemText.map((text) => (
          <div key={text}>{text}</div>
        ))}
      </ElCollapseItem>
      <ElCollapseItem title="反馈 Feedback" name="2">
        <div>操作反馈：通过样式更新与交互效果让用户感知操作结果。</div>
        <div>视觉反馈：通过更新或重排页面元素反映当前状态。</div>
      </ElCollapseItem>
      <ElCollapseItem title="效率 Efficiency" name="3">
        <div>简化流程：保持操作流程简单、直观。</div>
        <div>清晰明确：清楚地表达意图，帮助用户快速理解决策。</div>
        <div>易于识别：界面应当直接，减少用户的记忆负担。</div>
      </ElCollapseItem>
      <ElCollapseItem title="可控性 Controllability" name="4">
        <div>决策建议：可以给用户操作建议，但不能代替用户决策。</div>
        <div>结果可控：用户应能自由取消、中止或终止当前操作。</div>
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
      <ElCollapseItem title="一致性 Consistency" name="1">
        {itemText.map((text) => (
          <div key={text}>{text}</div>
        ))}
      </ElCollapseItem>
      <ElCollapseItem title="反馈 Feedback" name="2">
        <div>操作反馈：通过样式更新与交互效果让用户感知操作结果。</div>
        <div>视觉反馈：通过更新或重排页面元素反映当前状态。</div>
      </ElCollapseItem>
      <ElCollapseItem title="效率 Efficiency" name="3">
        <div>简化流程：保持操作流程简单、直观。</div>
        <div>清晰明确：清楚地表达意图，帮助用户快速理解决策。</div>
      </ElCollapseItem>
      <ElCollapseItem title="可控性 Controllability" name="4">
        <div>决策建议：可以给用户操作建议，但不能代替用户决策。</div>
        <div>结果可控：用户应能自由取消、中止或终止当前操作。</div>
      </ElCollapseItem>
    </ElCollapse>
  );
}

export function CollapseIconPosition() {
  const [position, setPosition] = useState<"left" | "right">("left");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <span style={{ marginRight: 16 }}>expand icon position:</span>
        <ElSwitch
          value={position}
          activeValue="right"
          inactiveValue="left"
          activeText="right"
          inactiveText="left"
          onChange={(value) => setPosition(value as "left" | "right")}
        />
      </div>
      <ElCollapse expandIconPosition={position}>
        <ElCollapseItem title="一致性 Consistency" name="1">
          {itemText.map((text) => (
            <div key={text}>{text}</div>
          ))}
        </ElCollapseItem>
        <ElCollapseItem title="反馈 Feedback" name="2">
          <div>操作反馈：通过样式更新与交互效果让用户感知操作结果。</div>
          <div>视觉反馈：通过更新或重排页面元素反映当前状态。</div>
        </ElCollapseItem>
        <ElCollapseItem title="效率 Efficiency" name="3">
          <div>简化流程：保持操作流程简单、直观。</div>
          <div>清晰明确：清楚地表达意图，帮助用户快速理解决策。</div>
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
      <ElCollapseItem title="一致性 Consistency" name="1" icon={<CaretRight />}>
        {itemText.map((text) => (
          <div key={text}>{text}</div>
        ))}
      </ElCollapseItem>
      <ElCollapseItem
        title="反馈 Feedback"
        name="2"
        icon={({ isActive }) => (
          <span style={customIconStyle}>
            {isActive ? "Expanded" : "Collapsed"}
          </span>
        )}
      >
        <div>操作反馈：通过样式更新与交互效果让用户感知操作结果。</div>
        <div>视觉反馈：通过更新或重排页面元素反映当前状态。</div>
      </ElCollapseItem>
      <ElCollapseItem title="效率 Efficiency" name="3">
        <div>简化流程：保持操作流程简单、直观。</div>
        <div>清晰明确：清楚地表达意图，帮助用户快速理解决策。</div>
        <div>易于识别：界面应当直接，减少用户的记忆负担。</div>
      </ElCollapseItem>
      <ElCollapseItem title="可控性 Controllability" name="4">
        <div>决策建议：可以给用户操作建议，但不能代替用户决策。</div>
        <div>结果可控：用户应能自由取消、中止或终止当前操作。</div>
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
        {itemText.map((text) => (
          <div key={text}>{text}</div>
        ))}
      </ElCollapseItem>
      <ElCollapseItem title="Feedback" name="2">
        <div>操作反馈：通过样式更新与交互效果让用户感知操作结果。</div>
        <div>视觉反馈：通过更新或重排页面元素反映当前状态。</div>
      </ElCollapseItem>
      <ElCollapseItem title="Efficiency" name="3">
        <div>简化流程：保持操作流程简单、直观。</div>
        <div>清晰明确：清楚地表达意图，帮助用户快速理解决策。</div>
      </ElCollapseItem>
      <ElCollapseItem title="Controllability" name="4">
        <div>决策建议：可以给用户操作建议，但不能代替用户决策。</div>
        <div>结果可控：用户应能自由取消、中止或终止当前操作。</div>
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
        <span style={{ marginRight: 16 }}>before collapse return:</span>
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
        <ElCollapseItem title="一致性 Consistency" name="1">
          {itemText.map((text) => (
            <div key={text}>{text}</div>
          ))}
        </ElCollapseItem>
        <ElCollapseItem title="反馈 Feedback" name="2">
          <div>操作反馈：通过样式更新与交互效果让用户感知操作结果。</div>
          <div>视觉反馈：通过更新或重排页面元素反映当前状态。</div>
        </ElCollapseItem>
        <ElCollapseItem title="效率 Efficiency" name="3">
          <div>简化流程：保持操作流程简单、直观。</div>
          <div>清晰明确：清楚地表达意图，帮助用户快速理解决策。</div>
        </ElCollapseItem>
        <ElCollapseItem title="可控性 Controllability" name="4">
          <div>决策建议：可以给用户操作建议，但不能代替用户决策。</div>
          <div>结果可控：用户应能自由取消、中止或终止当前操作。</div>
        </ElCollapseItem>
      </ElCollapse>
    </div>
  );
}
