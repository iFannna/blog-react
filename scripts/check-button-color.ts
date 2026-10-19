import { tint, darken, isDark } from "../src/components/element-plus/button/color.ts";

/**
 * color.ts 的验证。
 *
 * 断言分成两类，强度不同，不要混为一谈：
 *
 * [外部] tint —— 期望值全部抄自官方编译产物 src/styles/element-plus/index.css
 *   里 sass 预计算的 --el-color-*-light-N。sass 的 color.mix(white, base, n%)
 *   与 tinycolor 的 tint(n) 同在 sRGB 上线性插值，数值应当逐位相等。
 *   这是真正的外部验证：实现错了这里必然红。
 *
 * [推导] darken / isDark —— 期望值由 tinycolor 3.6.1 源码语义手算得出
 *   （算法与取整读自 dist/index.js，算式写在下面）。这是推导验证，
 *   不是跑真库比对。最终裁决以与官网的截图比对准。
 *
 * 注意 darken 混的是 #141414，而 sass 的 --el-color-*-dark-N 混的是 #000000，
 * 两者不是同一个公式，别拿 dark-N 去校验 darken。
 */

// [外部] sass 预计算值
const externalCases = [
  { call: () => tint("#409eff", 90), want: "#ecf5ff", label: "primary tint(90) = light-9" },
  { call: () => tint("#409eff", 80), want: "#d9ecff", label: "primary tint(80) = light-8" },
  { call: () => tint("#409eff", 70), want: "#c6e2ff", label: "primary tint(70) = light-7" },
  { call: () => tint("#409eff", 50), want: "#a0cfff", label: "primary tint(50) = light-5" },
  { call: () => tint("#409eff", 30), want: "#79bbff", label: "primary tint(30) = light-3" },
  { call: () => tint("#67c23a", 90), want: "#f0f9eb", label: "success tint(90) = light-9" },
  { call: () => tint("#67c23a", 30), want: "#95d475", label: "success tint(30) = light-3" },
  { call: () => tint("#e6a23c", 90), want: "#fdf6ec", label: "warning tint(90) = light-9" },
  { call: () => tint("#f56c6c", 90), want: "#fef0f0", label: "danger tint(90) = light-9" },
];

// [推导] 算式：c' = round((target - round(c)) * p + round(c))，target = #141414
const derivedCases = [
  // #409eff: r=(20-64)*.2+64=55.2->55, g=(20-158)*.2+158=130.4->130, b=(20-255)*.2+255=208
  { call: () => darken("#409eff", 20), want: "#3782d0", label: "darken(#409eff, 20)" },
  // #626aef: r=(20-98)*.3+98=74.6->75, g=(20-106)*.3+106=80.2->80, b=(20-239)*.3+239=173.3->173
  { call: () => darken("#626aef", 30), want: "#4b50ad", label: "darken(#626aef, 30)" },
];

// [推导] AERT 亮度 (r*299+g*587+b*114)/1000，阈值 128
const darkCases = [
  { got: () => isDark("#409eff"), want: false, label: "isDark(#409eff) 亮度 140.952" },
  { got: () => isDark("#626aef"), want: true, label: "isDark(#626aef) 亮度 118.77" },
  { got: () => isDark("#ffffff"), want: false, label: "isDark(#ffffff) 亮度 255" },
  { got: () => isDark("#000000"), want: true, label: "isDark(#000000) 亮度 0" },
  { got: () => isDark("rgb(98,106,239)"), want: true, label: "isDark(rgb()) 解析" },
  { got: () => isDark("hsl(240,80%,66%)"), want: true, label: "isDark(hsl()) 解析" },
  { got: () => isDark("transparent"), want: true, label: "isDark(transparent) 退化为黑" },
];

let failed = 0;

function check(label: string, got: unknown, want: unknown, kind: string) {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} [${kind}] ${label}: got ${got}, want ${want}`);
}

console.log("--- [外部] 对着官方编译产物校验 tint ---");
for (const { call, want, label } of externalCases) check(label, call(), want, "外部");

console.log("\n--- [推导] tinycolor 源码语义手算 ---");
for (const { call, want, label } of derivedCases) check(label, call(), want, "推导");
for (const { got, want, label } of darkCases) check(label, got(), want, "推导");

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
