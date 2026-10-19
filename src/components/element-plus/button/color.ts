/**
 * Button 的 color 属性需要按官方逻辑算出 hover / active / disabled 各态颜色。
 *
 * 官方用 @ctrl/tinycolor，这里只复刻它被用到的那几个方法，行为逐行对齐：
 * mix 线性插值、getBrightness 用 AERT 加权、isDark 阈值 128。
 * 只支持 EP 的 color 属性会传入的形式：hex / rgb(a) / hsl(a) / 颜色名 / transparent。
 */

const CSS_COLOR_NAMES: Record<string, string> = {
  transparent: "rgba(0,0,0,0)",
  white: "#ffffff",
  black: "#000000",
};

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function clamp(value: number, max: number) {
  return Math.min(max, Math.max(0, value));
}

function parseChannel(value: string, max: number) {
  return value.endsWith("%")
    ? (Number.parseFloat(value) / 100) * max
    : Number.parseFloat(value);
}

function parseHex(hex: string): Rgba {
  let h = hex.replace(/^#/, "");

  if (h.length === 3 || h.length === 4) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (h.length === 6) h += "ff";
  if (h.length !== 8) return { r: 0, g: 0, b: 0, a: 1 };

  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
    a: Number.parseInt(h.slice(6, 8), 16) / 255,
  };
}

function hslToRgb(h: number, s: number, l: number): Rgba {
  const hue = (((h % 360) + 360) % 360) / 360;
  const sat = clamp(s, 1);
  const light = clamp(l, 1);

  if (sat === 0) {
    const v = Math.round(light * 255);
    return { r: v, g: v, b: v, a: 1 };
  }

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;

  const channel = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  return {
    r: Math.round(channel(hue + 1 / 3) * 255),
    g: Math.round(channel(hue) * 255),
    b: Math.round(channel(hue - 1 / 3) * 255),
    a: 1,
  };
}

function parseColor(input: string): Rgba {
  const color = input.trim().toLowerCase();

  const named = CSS_COLOR_NAMES[color];
  if (named) return parseColor(named);

  if (color.startsWith("#")) return parseHex(color);

  const rgb = color.match(
    /^rgba?\(\s*([^,\s]+)[,\s]+([^,\s]+)[,\s]+([^,\s]+)(?:[,/\s]+([^)\s]+))?\s*\)$/,
  );
  if (rgb) {
    return {
      r: clamp(parseChannel(rgb[1], 255), 255),
      g: clamp(parseChannel(rgb[2], 255), 255),
      b: clamp(parseChannel(rgb[3], 255), 255),
      a: rgb[4] === undefined ? 1 : clamp(Number.parseFloat(rgb[4]), 1),
    };
  }

  const hsl = color.match(
    /^hsla?\(\s*([^,\s]+)[,\s]+([^,\s]+)[,\s]+([^,\s]+)(?:[,/\s]+([^)\s]+))?\s*\)$/,
  );
  if (hsl) {
    return hslToRgb(
      Number.parseFloat(hsl[1]),
      parseChannel(hsl[2], 1),
      parseChannel(hsl[3], 1),
    );
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

function toHex({ r, g, b }: Rgba) {
  const part = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** 与 tinycolor 一致：非整数通道先取整，再线性插值。 */
function mix(from: Rgba, target: Rgba, amount: number): Rgba {
  const a = from.a === undefined ? 1 : from.a;
  const p = amount / 100;

  return {
    r: (target.r - Math.round(from.r)) * p + Math.round(from.r),
    g: (target.g - Math.round(from.g)) * p + Math.round(from.g),
    b: (target.b - Math.round(from.b)) * p + Math.round(from.b),
    a: (target.a - a) * p + a,
  };
}

const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };

export function tint(color: string, amount: number) {
  return toHex(mix(parseColor(color), WHITE, amount));
}

/** 官方 darken 是往 #141414 混，不是往纯黑混。 */
export function darken(color: string, amount: number) {
  return toHex(mix(parseColor(color), { r: 20, g: 20, b: 20, a: 1 }, amount));
}

/** AERT 感知亮度，阈值 128 判定深浅。 */
export function isDark(color: string) {
  const { r, g, b } = parseColor(color);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
