"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  ElTimeline,
  ElTimelineItem,
  type TimelineMode,
  type TimelineNodeSize,
  type TimelineNodeType,
} from "@/components/element-plus/timeline";
import { ElCard } from "@/components/element-plus/card";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElSwitch } from "@/components/element-plus/switch";
import { MoreFilled } from "@/components/element-plus/icons";

const activities = [
  { content: "Event start", timestamp: "2018-04-15" },
  { content: "Approved", timestamp: "2018-04-13" },
  { content: "Success", timestamp: "2018-04-11" },
];

interface CustomActivity {
  content: string;
  timestamp: string;
  type?: TimelineNodeType;
  color?: string;
  size?: TimelineNodeSize;
  hollow?: boolean;
  icon?: ReactNode;
}

const customActivities: CustomActivity[] = [
  {
    content: "Custom icon",
    timestamp: "2018-04-12 20:46",
    size: "large",
    type: "primary",
    icon: <MoreFilled />,
  },
  {
    content: "Custom color",
    timestamp: "2018-04-03 20:46",
    color: "#0bbd87",
  },
  {
    content: "Custom size",
    timestamp: "2018-04-03 20:46",
    size: "large",
  },
  {
    content: "Custom hollow",
    timestamp: "2018-04-03 20:46",
    type: "primary",
    hollow: true,
  },
  {
    content: "Default node",
    timestamp: "2018-04-03 20:46",
  },
];

const cardTitle = { margin: 0 } as const;
const cardBody = { margin: "16px 0 0" } as const;
const timelineSpacing: CSSProperties = { marginTop: 16 };

export function TimelineBasic() {
  return (
    <ElTimeline>
      {activities.map((activity) => (
        <ElTimelineItem key={activity.timestamp} timestamp={activity.timestamp}>
          {activity.content}
        </ElTimelineItem>
      ))}
    </ElTimeline>
  );
}

export function TimelineCenter() {
  return (
    <ElTimeline>
      <ElTimelineItem center timestamp="2018/4/12" placement="top">
        <ElCard>
          <h4 style={cardTitle}>Update Github template</h4>
          <p style={cardBody}>Tom committed 2018/4/12 20:46</p>
        </ElCard>
      </ElTimelineItem>
      <ElTimelineItem timestamp="2018/4/3" placement="top">
        <ElCard>
          <h4 style={cardTitle}>Update Github template</h4>
          <p style={cardBody}>Tom committed 2018/4/3 20:46</p>
        </ElCard>
      </ElTimelineItem>
      <ElTimelineItem center timestamp="2018/4/2" placement="top">
        Event start
      </ElTimelineItem>
      <ElTimelineItem timestamp="2018/4/2" placement="top">
        Event end
      </ElTimelineItem>
    </ElTimeline>
  );
}

export function TimelineCustomNode() {
  return (
    <ElTimeline>
      {customActivities.map((activity) => (
        <ElTimelineItem
          key={activity.content}
          timestamp={activity.timestamp}
          icon={activity.icon}
          type={activity.type}
          color={activity.color}
          size={activity.size}
          hollow={activity.hollow}
        >
          {activity.content}
        </ElTimelineItem>
      ))}
    </ElTimeline>
  );
}

export function TimelineCustomTimestamp() {
  return (
    <ElTimeline>
      {[
        { timestamp: "2018/4/12", name: "Tom committed 2018/4/12 20:46" },
        { timestamp: "2018/4/3", name: "Tom committed 2018/4/3 20:46" },
        { timestamp: "2018/4/2", name: "Tom committed 2018/4/2 20:46" },
      ].map((item) => (
        <ElTimelineItem key={item.timestamp} timestamp={item.timestamp} placement="top">
          <ElCard>
            <h4 style={cardTitle}>Update Github template</h4>
            <p style={cardBody}>{item.name}</p>
          </ElCard>
        </ElTimelineItem>
      ))}
    </ElTimeline>
  );
}

export function TimelineMode() {
  const [mode, setMode] = useState<TimelineMode>("start");

  return (
    <div>
      <ElRadioGroup
        type="button"
        value={mode}
        onChange={(value) => setMode(value as TimelineMode)}
      >
        <ElRadio value="start">start</ElRadio>
        <ElRadio value="alternate">alternate</ElRadio>
        <ElRadio value="alternate-reverse">alternate-reverse</ElRadio>
        <ElRadio value="end">end</ElRadio>
      </ElRadioGroup>

      <ElTimeline mode={mode} style={timelineSpacing}>
        {activities.map((activity) => (
          <ElTimelineItem key={activity.timestamp} timestamp={activity.timestamp}>
            {activity.content}
          </ElTimelineItem>
        ))}
      </ElTimeline>
    </div>
  );
}

export function TimelineReverse() {
  const [reverse, setReverse] = useState(true);

  return (
    <div>
      <ElSwitch checked={reverse} activeText="reverse" onCheckedChange={setReverse} />
      <ElTimeline reverse={reverse} style={{ marginTop: 8 }}>
        {activities.map((activity) => (
          <ElTimelineItem key={activity.timestamp} timestamp={activity.timestamp}>
            {activity.content}
          </ElTimelineItem>
        ))}
      </ElTimeline>
    </div>
  );
}
