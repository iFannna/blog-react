import { TinyColor } from "@ctrl/tinycolor";
import type { ColorFormats } from "@ctrl/tinycolor";

interface ColorOptions {
  enableAlpha: boolean;
  format: string;
  value?: string | null;
}

/**
 * 对应官方 color-picker-panel/utils/color。
 *
 * 官方直接让 Vue 的 reactive 代理这个类，React 侧由组件用
 * useSyncExternalStore 订阅 `version`，因此这里额外提供订阅接口。
 */
export default class Color {
  private _hue = 0;
  private _saturation = 100;
  private _value = 100;
  private _alpha = 100;
  private _tiny = new TinyColor();
  private _isValid = false;
  private listeners = new Set<() => void>();
  private version = 0;

  public enableAlpha = false;
  public format = "";
  public value = "";
  public selected?: boolean;

  constructor(options: Partial<ColorOptions> = {}) {
    if (options.enableAlpha !== undefined) this.enableAlpha = options.enableAlpha;
    if (options.format !== undefined) this.format = options.format;

    if (options.value) this.fromString(options.value);
    else this.doOnChange();
  }

  /** 同步 enableAlpha / format 并重新生成 value，避免外部直接改字段。 */
  configure(enableAlpha: boolean, format?: string) {
    this.enableAlpha = enableAlpha;
    this.format = format || this.format;
    this.doOnChange();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = () => this.version;

  private notify() {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }

  set(prop: string, value: number): void;
  set(prop: Record<string, number>): void;
  set(prop: string | Record<string, number>, value?: number) {
    if (typeof prop === "object") {
      for (const key in prop) {
        if (Object.prototype.hasOwnProperty.call(prop, key)) {
          this.set(key, prop[key]);
        }
      }
      return;
    }

    (this as unknown as Record<string, number>)[`_${prop}`] = value as number;
    this._isValid = true;
    this.doOnChange();
  }

  get(prop: string) {
    if (["hue", "saturation", "value", "alpha"].includes(prop)) {
      return Math.round(
        (this as unknown as Record<string, number>)[`_${prop}`],
      );
    }
    return (this as unknown as Record<string, unknown>)[`_${prop}`];
  }

  toRgb() {
    return this._isValid
      ? this._tiny.toRgb()
      : { r: 255, g: 255, b: 255, a: 0 };
  }

  fromString(value: string) {
    const color = new TinyColor(value);
    this._isValid = color.isValid;

    if (color.isValid) {
      const { h, s, v, a } = color.toHsv();
      this._hue = h;
      this._saturation = s * 100;
      this._value = v * 100;
      this._alpha = a * 100;
    } else {
      this._hue = 0;
      this._saturation = 100;
      this._value = 100;
      this._alpha = 100;
    }

    this.doOnChange();
  }

  clear() {
    this._isValid = false;
    this.value = "";
    this._hue = 0;
    this._saturation = 100;
    this._value = 100;
    this._alpha = 100;
    this.notify();
  }

  compare(color: Color) {
    const compareColor = new TinyColor({
      h: this.getHueOf(color),
      s: this.getSaturationOf(color) / 100,
      v: this.getValueOf(color) / 100,
      a: this.getAlphaOf(color) / 100,
    });
    return this._tiny.equals(compareColor);
  }

  private getHueOf(color: Color) {
    return (color as unknown as { _hue: number })._hue;
  }

  private getSaturationOf(color: Color) {
    return (color as unknown as { _saturation: number })._saturation;
  }

  private getValueOf(color: Color) {
    return (color as unknown as { _value: number })._value;
  }

  private getAlphaOf(color: Color) {
    return (color as unknown as { _alpha: number })._alpha;
  }

  doOnChange() {
    const { _hue, _saturation, _value, _alpha, format, enableAlpha } = this;
    let nextFormat = format || (enableAlpha ? "rgb" : "hex");

    if (format === "hex" && enableAlpha) nextFormat = "hex8";

    this._tiny = new TinyColor({
      h: _hue,
      s: _saturation / 100,
      v: _value / 100,
      a: _alpha / 100,
    });

    this.value = this._isValid
      ? this._tiny.toString(nextFormat as ColorFormats)
      : "";

    this.notify();
  }
}
