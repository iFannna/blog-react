"use client";

import { ElRow, ElCol } from "@/components/element-plus/row";
import { message } from "@/components/element-plus/message";

/**
 * 官方三个示例组件（main/secondary/neutral-color.vue）都在运行时读取
 * CSS 变量实际值显示在色块上，这里直接列出变量的字面默认值，
 * 官方源码里字面量本来就以大写形式出现（`#409EFF`），保持一致。
 */
const COLOR_LEVELS = ["dark-2", "light-3", "light-5", "light-7", "light-8", "light-9"];

const PRIMARY = {
  name: "Brand Color",
  value: "#409EFF",
  /** 官方用内联背景，React 侧改为修饰类映射同名变量 */
  boxClass: "demo-color-box demo-color-box--primary",
  subPrefix: "--el-color-primary-",
  subClass: "bg-blue-sub-item",
};

const SECONDARY = (["success", "warning", "danger", "info"] as const).map(
  (type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: {
      success: "#67C23A",
      warning: "#E6A23C",
      danger: "#F56C6C",
      info: "#909399",
    }[type],
    boxClass: `demo-color-box demo-color-box--${type}`,
    subPrefix: `--el-color-${type}-`,
    subClass: "bg-secondary-sub-item",
  }),
);

/** 顺序与官方 neutral-color.vue 的 textTypes 一致 */
const TEXT_COLORS = [
  { name: "Primary Text", varName: "--el-text-color-primary", value: "#303133" },
  { name: "Regular Text", varName: "--el-text-color-regular", value: "#606266" },
  { name: "Secondary Text", varName: "--el-text-color-secondary", value: "#909399" },
  { name: "Placeholder Text", varName: "--el-text-color-placeholder", value: "#A8ABB2" },
  { name: "Disabled Text", varName: "--el-text-color-disabled", value: "#C0C4CC" },
];

const BORDER_COLORS = [
  { name: "Darker Border", varName: "--el-border-color-darker", value: "#CDD0D6" },
  { name: "Dark Border", varName: "--el-border-color-dark", value: "#D4D7DE" },
  { name: "Base Border", varName: "--el-border-color", value: "#DCDFE6" },
  { name: "Light Border", varName: "--el-border-color-light", value: "#E4E7ED" },
  { name: "Lighter Border", varName: "--el-border-color-lighter", value: "#EBEEF5" },
  { name: "Extra-light Border", varName: "--el-border-color-extra-light", value: "#F2F6FC" },
];

const FILL_COLORS = [
  { name: "Darker Fill", varName: "--el-fill-color-darker", value: "#E6E8EB" },
  { name: "Dark Fill", varName: "--el-fill-color-dark", value: "#EBEDF0" },
  { name: "Base Fill", varName: "--el-fill-color", value: "#F0F2F5" },
  { name: "Light Fill", varName: "--el-fill-color-light", value: "#F5F7FA" },
  { name: "Lighter Fill", varName: "--el-fill-color-lighter", value: "#FAFAFA" },
  { name: "Extra-light Fill", varName: "--el-fill-color-extra-light", value: "#FAFCFF" },
  { name: "Blank Fill", varName: "--el-fill-color-blank", value: "#FFFFFF" },
];

const BACKGROUND_COLORS = [
  { name: "Base Background", varName: "--el-bg-color", value: "#FFFFFF" },
  { name: "Page Background", varName: "--el-bg-color-page", value: "#F2F3F5" },
  { name: "Overlay Background", varName: "--el-bg-color-overlay", value: "#FFFFFF" },
];

/**
 * 官方用 @vueuse 的 useClipboard + ElMessage 提示，这里复用本项目的命令式 message，
 * 复制成功后提示变量名与变量值，失败时提示浏览器不支持。
 */
async function copyColor(varName: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  try {
    await navigator.clipboard.writeText(value);
    message.success(`${varName}: ${value}`);
  } catch {
    message.error("当前浏览器不支持复制");
  }
}

/** 主色卡：底色 + 6 档深浅子色条，对应官方 main-color.vue */
export function ColorMain() {
  return (
    <ElRow gutter={12}>
      <ElCol span={10} xs={{ span: 12 }}>
        <div className={PRIMARY.boxClass}>
          {PRIMARY.name}
          <div className="value">{PRIMARY.value}</div>
          {/* 子色条自身也铺主色，深色档位叠上去才有官方那种厚度 */}
          <div className="bg-color-sub demo-color-box--primary">
            {COLOR_LEVELS.map((level) => (
              <div
                key={level}
                className={`${PRIMARY.subClass} demo-color-box--primary-${level}`}
                onClick={() => copyColor(`${PRIMARY.subPrefix}${level}`)}
              />
            ))}
          </div>
        </div>
      </ElCol>
    </ElRow>
  );
}

/** 场景色卡：success / warning / danger / info，对应官方 secondary-colors.vue */
export function ColorSecondary() {
  return (
    <ElRow gutter={12}>
      {SECONDARY.map((color) => (
        <ElCol span={6} xs={{ span: 12 }} key={color.name}>
          <div className={color.boxClass}>
            {color.name}
            <div className="value">{color.value}</div>
            <div className="bg-color-sub">
              {COLOR_LEVELS.map((level) => (
                <div
                  key={level}
                  className={`${color.subClass} demo-color-box--${color.name.toLowerCase()}-${level}`}
                  onClick={() => copyColor(`${color.subPrefix}${level}`)}
                />
              ))}
            </div>
          </div>
        </ElCol>
      ))}
    </ElRow>
  );
}

/** 中性色卡：文字 / 边框 / 填充 / 背景四列，对应官方 neutral-color.vue */
export function ColorNeutral() {
  return (
    <ElRow gutter={12}>
      <ElCol span={6} xs={{ span: 12 }}>
        {TEXT_COLORS.map((color) => (
          <div
            className={`demo-color-box demo-color-box-other demo-color-box--text-${color.name.split(" ")[0].toLowerCase()}`}
            key={color.varName}
          >
            {color.name}
            <div className="value">{color.value}</div>
          </div>
        ))}
      </ElCol>

      <ElCol span={6} xs={{ span: 12 }}>
        {BORDER_COLORS.map((color) => (
          <div
            className={`demo-color-box demo-color-box-lite demo-color-box-other demo-color-box--border-${color.name.split(" ")[0].toLowerCase()}`}
            key={color.varName}
          >
            {color.name}
            <div className="value">{color.value}</div>
          </div>
        ))}
      </ElCol>

      <ElCol span={6} xs={{ span: 12 }}>
        {FILL_COLORS.map((color) => (
          <div
            className={`demo-color-box demo-color-box-lite demo-color-box-other demo-color-box--fill-${color.name.split(" ")[0].toLowerCase()}`}
            key={color.varName}
          >
            {color.name}
            <div className="value">{color.value}</div>
          </div>
        ))}
      </ElCol>

      <ElCol span={6} xs={{ span: 12 }}>
        <div className="demo-color-box demo-color-box-other demo-color-box--black">
          Basic Black
          <div className="value">#000000</div>
        </div>
        <div className="demo-color-box demo-color-box-other demo-color-box--white">
          Basic White
          <div className="value">#FFFFFF</div>
        </div>
        <div className="demo-color-box demo-color-box-lite bg-transparent">
          Transparent
          <div className="value">Transparent</div>
        </div>
        {BACKGROUND_COLORS.map((color) => (
          <div
            className={`demo-color-box demo-color-box-lite demo-color-box--bg-${color.name.split(" ")[0].toLowerCase()}`}
            key={color.varName}
          >
            {color.name}
            <div className="value">{color.value}</div>
          </div>
        ))}
      </ElCol>
    </ElRow>
  );
}
