"use client";

import { useState, type CSSProperties } from "react";
import { ElSegmented } from "@/components/element-plus/segmented";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import type { ComponentSize } from "@/components/element-plus/button/types";

/**
 * 官方示例的水果图标来自 @element-plus/icons-vue，本项目的图标生成清单尚未收录它们，
 * 这里内联官方同一份 SVG path 以免示例示例缺图；图标名同步提报给主控补入生成清单。
 */
const FRUIT_PATHS: Record<string, string[]> = {
  Apple: [
    "M599.872 203.776a189.4 189.4 0 0 1 64.384-4.672l2.624.128c31.168 1.024 51.2 4.096 79.488 16.32 37.632 16.128 74.496 45.056 111.488 89.344 96.384 115.264 82.752 372.8-34.752 521.728-7.68 9.728-32 41.6-30.72 39.936a427 427 0 0 1-30.08 35.776c-31.232 32.576-65.28 49.216-110.08 50.048-31.36.64-53.568-5.312-84.288-18.752l-6.528-2.88c-20.992-9.216-30.592-11.904-47.296-11.904-18.112 0-28.608 2.88-51.136 12.672l-6.464 2.816c-28.416 12.224-48.32 18.048-76.16 19.2-74.112 2.752-116.928-38.08-180.672-132.16-96.64-142.08-132.608-349.312-55.04-486.4 46.272-81.92 129.92-133.632 220.672-135.04 32.832-.576 60.288 6.848 99.648 22.72 27.136 10.88 34.752 13.76 37.376 14.272 16.256-20.16 27.776-36.992 34.56-50.24 13.568-26.304 27.2-59.968 40.704-100.8a32 32 0 1 1 60.8 20.224c-12.608 37.888-25.408 70.4-38.528 97.664m-51.52 78.08c-14.528 17.792-31.808 37.376-51.904 58.816a32 32 0 1 1-46.72-43.776l12.288-13.248c-28.032-11.2-61.248-26.688-95.68-26.112-70.4 1.088-135.296 41.6-171.648 105.792C121.6 492.608 176 684.16 247.296 788.992c34.816 51.328 76.352 108.992 130.944 106.944 52.48-2.112 72.32-34.688 135.872-34.688s81.28 34.688 136.96 33.536c56.448-1.088 75.776-39.04 126.848-103.872 107.904-136.768 107.904-362.752 35.776-449.088-72.192-86.272-124.672-84.096-151.68-85.12-41.472-4.288-81.6 12.544-113.664 25.152",
  ],
  Cherry: [
    "M261.056 449.6c13.824-69.696 34.88-128.96 63.36-177.728 23.744-40.832 61.12-88.64 112.256-143.872H320a32 32 0 0 1 0-64h384a32 32 0 1 1 0 64H554.752c14.912 39.168 41.344 86.592 79.552 141.76 47.36 68.48 84.8 106.752 106.304 114.304a224 224 0 1 1-84.992 14.784c-22.656-22.912-47.04-53.76-73.92-92.608-38.848-56.128-67.008-105.792-84.352-149.312-55.296 58.24-94.528 107.52-117.76 147.2-23.168 39.744-41.088 88.768-53.568 147.072a224.064 224.064 0 1 1-64.96-1.6M288 832a160 160 0 1 0 0-320 160 160 0 0 0 0 320m448-64a160 160 0 1 0 0-320 160 160 0 0 0 0 320",
  ],
  Grape: [
    "M544 195.2a160 160 0 0 1 96 60.8 160 160 0 1 1 146.24 254.976 160 160 0 0 1-128 224 160 160 0 1 1-292.48 0 160 160 0 0 1-128-224A160 160 0 1 1 384 256a160 160 0 0 1 96-60.8V128h-64a32 32 0 0 1 0-64h192a32 32 0 0 1 0 64h-64zM512 448a96 96 0 1 0 0-192 96 96 0 0 0 0 192m-256 0a96 96 0 1 0 0-192 96 96 0 0 0 0 192m128 224a96 96 0 1 0 0-192 96 96 0 0 0 0 192m128 224a96 96 0 1 0 0-192 96 96 0 0 0 0 192m128-224a96 96 0 1 0 0-192 96 96 0 0 0 0 192m128-224a96 96 0 1 0 0-192 96 96 0 0 0 0 192",
  ],
  Orange: [
    "M544 894.72a382.34 382.34 0 0 0 215.936-89.472L577.024 622.272c-10.24 6.016-21.248 10.688-33.024 13.696v258.688zm261.248-134.784A382.34 382.34 0 0 0 894.656 544H635.968c-3.008 11.776-7.68 22.848-13.696 33.024zM894.656 480a382.34 382.34 0 0 0-89.408-215.936L622.272 446.976c6.016 10.24 10.688 21.248 13.696 33.024zm-134.72-261.248A382.34 382.34 0 0 0 544 129.344v258.688c11.776 3.008 22.848 7.68 33.024 13.696zM480 129.344a382.34 382.34 0 0 0-215.936 89.408l182.912 182.976c10.24-6.016 21.248-10.688 33.024-13.696zm-261.248 134.72A382.34 382.34 0 0 0 129.344 480h258.688c3.008-11.776 7.68-22.848 13.696-33.024zM129.344 544a382.34 382.34 0 0 0 89.408 215.936l182.976-182.912A127.2 127.2 0 0 1 388.032 544zm134.72 261.248A382.34 382.34 0 0 0 480 894.656V635.968a127.2 127.2 0 0 1-33.024-13.696zM512 960a448 448 0 1 1 0-896 448 448 0 0 1 0 896m0-384a64 64 0 1 0 0-128 64 64 0 0 0 0 128",
  ],
  Pear: [
    "M542.336 258.816a443 443 0 0 0-9.024 25.088 32 32 0 1 1-60.8-20.032l1.088-3.328a162.69 162.69 0 0 0-122.048 131.392l-17.088 102.72-20.736 15.36C256.192 552.704 224 610.88 224 672c0 120.576 126.4 224 288 224s288-103.424 288-224c0-61.12-32.192-119.296-89.728-161.92l-20.736-15.424-17.088-102.72a162.69 162.69 0 0 0-130.112-133.12m-40.128-66.56c7.936-15.552 16.576-30.08 25.92-43.776 23.296-33.92 49.408-59.776 78.528-77.12a32 32 0 1 1 32.704 55.04c-20.544 12.224-40.064 31.552-58.432 58.304a317 317 0 0 0-9.792 15.104 226.69 226.69 0 0 1 164.48 181.568l12.8 77.248C819.456 511.36 864 587.392 864 672c0 159.04-157.568 288-352 288S160 831.04 160 672c0-84.608 44.608-160.64 115.584-213.376l12.8-77.248a226.624 226.624 0 0 1 213.76-189.184z",
  ],
  Watermelon: [
    "m683.072 600.32-43.648 162.816-61.824-16.512 53.248-198.528L576 493.248l-158.4 158.4-45.248-45.248 158.4-158.4-55.616-55.616-198.528 53.248-16.512-61.824 162.816-43.648L282.752 200A384 384 0 0 0 824 741.248zm231.552 141.056a448 448 0 1 1-632-632z",
  ],
};

function FruitIcon({ name }: { name: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      {FRUIT_PATHS[name].map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
}

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FRUIT_OPTIONS = [
  { label: "Apple", value: "Apple", icon: "Apple" },
  { label: "Cherry", value: "Cherry", icon: "Cherry" },
  { label: "Grape", value: "Grape", icon: "Grape" },
  { label: "Orange", value: "Orange", icon: "Orange" },
  { label: "Pear", value: "Pear", icon: "Pear" },
  { label: "Watermelon", value: "Watermelon", icon: "Watermelon" },
];

const stack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "1.6rem",
};

export function SegmentedBasic() {
  const [value, setValue] = useState<string>("Mon");
  return (
    <div style={stack}>
      <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={DAY_OPTIONS} size="large" />
      <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={DAY_OPTIONS} />
      <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={DAY_OPTIONS} size="small" />
    </div>
  );
}

export function SegmentedCustomDirection() {
  const [value, setValue] = useState<string>("Apple");
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [size, setSize] = useState<ComponentSize>("default");

  const options = FRUIT_OPTIONS.map((item) =>
    item.value === "Watermelon" ? { ...item, disabled: true } : item,
  );

  return (
    <div style={stack}>
      <ElSegmented
        value={size}
        onChange={(v) => setSize(v as ComponentSize)}
        options={["large", "default", "small"]}
      />
      <ElSegmented
        value={direction}
        onChange={(v) => setDirection(v as "horizontal" | "vertical")}
        options={[
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ]}
      />
      <ElSegmented
        value={value}
        onChange={(v) => setValue(v as string)}
        options={options}
        direction={direction}
        size={size}
      >
        {(item) => {
          const option = item as { label: string; icon: string };
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.8rem",
                // 官方仅在水平方向给内容加内边距，纵向靠 item 自身的 padding
                padding: direction === "horizontal" ? "0.8rem" : undefined,
              }}
            >
              <ElIcon size={20}>
                <FruitIcon name={option.icon} />
              </ElIcon>
              <div>{option.label}</div>
            </div>
          );
        }}
      </ElSegmented>
    </div>
  );
}

export function SegmentedDisabled() {
  const [value, setValue] = useState<string>("Mon");
  const options = [
    { label: "Mon", value: "Mon", disabled: true },
    { label: "Tue", value: "Tue" },
    { label: "Wed", value: "Wed", disabled: true },
    { label: "Thu", value: "Thu" },
    { label: "Fri", value: "Fri", disabled: true },
    { label: "Sat", value: "Sat" },
    { label: "Sun", value: "Sun" },
  ];

  return (
    <div style={stack}>
      <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={options} disabled />
      <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={options} />
    </div>
  );
}

export function SegmentedAliases() {
  const [value, setValue] = useState<string>("Mon");
  const optionProps = { label: "myLabel", value: "myValue", disabled: "myDisabled" };
  const options = [
    { myLabel: "Mon", myValue: "Mon", myDisabled: true },
    { myLabel: "Tue", myValue: "Tue" },
    { myLabel: "Wed", myValue: "Wed", myDisabled: true },
    { myLabel: "Thu", myValue: "Thu" },
    { myLabel: "Fri", myValue: "Fri", myDisabled: true },
    { myLabel: "Sat", myValue: "Sat" },
    { myLabel: "Sun", myValue: "Sun" },
  ];

  return (
    <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={options} optionProps={optionProps} />
  );
}

export function SegmentedBlock() {
  const [value, setValue] = useState<string>("Mon");
  const options = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sunday long long long long long long long",
  ];

  return <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={options} block />;
}

export function SegmentedCustomContent() {
  const [value, setValue] = useState<string>("Apple");
  return (
    <ElSegmented value={value} onChange={(v) => setValue(v as string)} options={FRUIT_OPTIONS}>
      {(item) => {
        const option = item as { label: string; icon: string };
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.8rem",
              padding: "0.8rem",
            }}
          >
            <ElIcon size={20}>
              <FruitIcon name={option.icon} />
            </ElIcon>
            <div>{option.label}</div>
          </div>
        );
      }}
    </ElSegmented>
  );
}

export function SegmentedCustomStyle() {
  const [value, setValue] = useState<string>("Delicacy");
  const options = ["Delicacy", "Desserts&Drinks", "Fresh foods", "Supermarket"];

  // 官方示例在 scoped 样式里覆盖这三个 CSS 变量，React 侧等价地下发到根元素
  const customVars = {
    "--el-segmented-item-selected-color": "var(--el-text-color-primary)",
    "--el-segmented-item-selected-bg-color": "#ffd100",
    "--el-border-radius-base": "16px",
  } as CSSProperties;

  return (
    <ElSegmented
      value={value}
      onChange={(v) => setValue(v as string)}
      options={options}
      style={customVars}
    />
  );
}
