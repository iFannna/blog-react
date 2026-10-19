import { useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { tint, darken, isDark } from "./color";
import { ButtonGroupContext } from "./context";
import { useGlobalConfig } from "../config-provider/context";
import { useFormDisabled, useFormItem } from "../form/use-form";
import type { ButtonConfigContext } from "../config-provider/types";
import type { ButtonProps, ButtonType, ComponentSize } from "./types";

/** 允许写入 CSS 自定义属性的 style 类型。 */
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

const UNIFIED_IDEOGRAPH_PAIR = /^\p{Unified_Ideograph}{2}$/u;

/**
 * 对应官方 useFormSize 在无 Form 场景下的取值链：
 * props.size || buttonGroup.size || globalSize || ''
 * 注意是 || 不是 ??，空字符串的 size 会继续往下取。
 */
function resolveSize(
  size: ComponentSize | undefined,
  groupSize: ComponentSize | undefined,
  globalSize: string | undefined,
): ComponentSize | string {
  return size || groupSize || globalSize || "";
}

/**
 * 对应官方 useButton 的 _type：
 * props.type || buttonGroup.type || globalConfig.type || ''
 */
function resolveType(
  type: ButtonType | undefined,
  groupType: ButtonType | undefined,
  globalType: ButtonType | undefined,
): ButtonType {
  return type || groupType || globalType || "";
}

/**
 * autoInsertSpace 只作用于「唯一子节点且是纯文本、去掉首尾空白后恰好两个汉字」的情况。
 * 官方判定的是 slot 的原始文本，不是在渲染后的 DOM 上量。
 */
function resolveShouldAddSpace(children: ReactNode, autoInsertSpace: boolean) {
  if (!autoInsertSpace) return false;

  const single = Array.isArray(children)
    ? children.length === 1
      ? children[0]
      : undefined
    : children;

  if (typeof single !== "string") return false;

  return UNIFIED_IDEOGRAPH_PAIR.test(single.trim());
}

/** 对应官方 useNamespace 的 cssVarBlock：--el-button-${key}。 */
function cssVarBlock(entries: Record<string, string | undefined>): StyleWithVars {
  const style: StyleWithVars = {};

  for (const [key, value] of Object.entries(entries)) {
    if (value) (style as Record<string, string>)[`--el-button-${key}`] = value;
  }

  return style;
}

/**
 * color 可以写成 var(--x)，此时要先从 documentElement 上把真实值读出来才能做颜色运算。
 * 该读取只能在浏览器里做，因此放到 effect 中，避免服务端与首次客户端渲染不一致。
 */
function useResolvedColor(color: string | undefined) {
  const [resolved, setResolved] = useState<string | undefined>(undefined);

  useEffect(() => {
    let next: string | undefined;

    const match = color?.match(/var\((.*?)\)/);
    if (match) {
      next =
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(match[1])
          .trim() || undefined;
    }

    // 自定义属性只能在浏览器里解析，写回 state 才能让 SSR 首帧与客户端保持一致。
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 读取计算样式后需要同步回写
    setResolved(next);
  }, [color]);

  return resolved ?? color;
}

/**
 * 对应官方 useButtonCustomStyle：只在使用 color 属性时产出内联的 --el-button-* 变量，
 * 覆盖样式表里的默认值，从而免去为每个自定义色写一遍 CSS。
 */
function buildCustomStyle(
  buttonColor: string | undefined,
  { plain, link, text, dark, disabled }: {
    plain: boolean;
    link: boolean;
    text: boolean;
    dark: boolean;
    disabled: boolean;
  },
): StyleWithVars {
  if (!buttonColor) return {};

  const activeBgColor = dark ? tint(buttonColor, 20) : darken(buttonColor, 20);

  if (plain) {
    const style = cssVarBlock({
      "bg-color": dark ? darken(buttonColor, 90) : tint(buttonColor, 90),
      "text-color": buttonColor,
      "border-color": dark ? darken(buttonColor, 50) : tint(buttonColor, 50),
      "hover-text-color": "var(--el-color-white)",
      "hover-bg-color": buttonColor,
      "hover-border-color": buttonColor,
      "active-bg-color": activeBgColor,
      "active-text-color": "var(--el-color-white)",
      "active-border-color": activeBgColor,
    });

    if (disabled) {
      Object.assign(
        style,
        cssVarBlock({
          "disabled-bg-color": dark ? darken(buttonColor, 90) : tint(buttonColor, 90),
          "disabled-text-color": dark ? darken(buttonColor, 50) : tint(buttonColor, 50),
          "disabled-border-color": dark ? darken(buttonColor, 80) : tint(buttonColor, 80),
        }),
      );
    }

    return style;
  }

  if (link || text) {
    const hoverColor = dark ? darken(buttonColor, 30) : tint(buttonColor, 30);

    const style = cssVarBlock({
      "text-color": buttonColor,
      "hover-text-color": hoverColor,
      "active-text-color": activeBgColor,
    });

    if (link) {
      Object.assign(
        style,
        cssVarBlock({
          "hover-link-text-color": hoverColor,
          "active-color": activeBgColor,
        }),
      );
    }

    if (disabled) {
      Object.assign(
        style,
        cssVarBlock({
          "disabled-bg-color": "transparent",
          "disabled-text-color": dark ? darken(buttonColor, 50) : tint(buttonColor, 50),
          "disabled-border-color": "transparent",
        }),
      );
    }

    return style;
  }

  const hoverBgColor = dark ? darken(buttonColor, 30) : tint(buttonColor, 30);
  const textColor = isDark(buttonColor)
    ? "var(--el-color-white)"
    : "var(--el-color-black)";

  const style = cssVarBlock({
    "bg-color": buttonColor,
    "text-color": textColor,
    "border-color": buttonColor,
    "hover-bg-color": hoverBgColor,
    "hover-text-color": textColor,
    "hover-border-color": hoverBgColor,
    "active-bg-color": activeBgColor,
    "active-border-color": activeBgColor,
  });

  if (disabled) {
    const disabledButtonColor = dark
      ? darken(buttonColor, 50)
      : tint(buttonColor, 50);

    Object.assign(
      style,
      cssVarBlock({
        "disabled-bg-color": disabledButtonColor,
        "disabled-text-color": dark
          ? "rgba(255, 255, 255, 0.5)"
          : "var(--el-color-white)",
        "disabled-border-color": disabledButtonColor,
      }),
    );
  }

  return style;
}

export function useButton(props: ButtonProps) {
  const {
    size,
    type,
    nativeType = "button",
    loading = false,
    plain,
    text,
    link = false,
    bg = false,
    round,
    circle = false,
    dashed,
    color,
    dark = false,
    autoInsertSpace,
    tag = "button",
    disabled,
    autoFocus,
    // icon 与 loadingIcon 由 ElButton 渲染成子节点，不能透传到 DOM
    icon,
    loadingIcon,
    children,
    className,
    style,
    onClick,
    ...restProps
  } = props;

  // icon / loadingIcon 由 ElButton 自行渲染，这里显式读出只是为了防止它们进入 restProps。
  void icon;
  void loadingIcon;

  const group = useContext(ButtonGroupContext);
  const { form } = useFormItem();
  const globalButtonConfig: ButtonConfigContext | undefined = useGlobalConfig("button");
  const globalSize = useGlobalConfig("size");

  const resolvedSize = resolveSize(size, group?.size, globalSize);
  const resolvedType = resolveType(type, group?.type, globalButtonConfig?.type);

  // 对应官方 useFormDisabled：props.disabled ?? form.disabled ?? false
  const resolvedDisabled = useFormDisabled(disabled);

  // 官方 useButton：props.plain ?? globalConfig.plain ?? false，其余同构
  const resolvedPlain = plain ?? globalButtonConfig?.plain ?? false;
  const resolvedRound = round ?? globalButtonConfig?.round ?? false;
  const resolvedText = text ?? globalButtonConfig?.text ?? false;
  const resolvedDashed = dashed ?? globalButtonConfig?.dashed ?? false;
  const resolvedAutoInsertSpace =
    autoInsertSpace ?? globalButtonConfig?.autoInsertSpace ?? false;

  const shouldAddSpace = resolveShouldAddSpace(children, resolvedAutoInsertSpace);

  const resolvedColor = useResolvedColor(color);
  const customStyle = buildCustomStyle(resolvedColor, {
    plain: resolvedPlain,
    link,
    text: resolvedText,
    dark,
    disabled: resolvedDisabled,
  });

  // 官方 class 顺序：块名、类型、尺寸，其余状态类
  const classes = [
    "el-button",
    resolvedType && `el-button--${resolvedType}`,
    resolvedSize && `el-button--${resolvedSize}`,
    resolvedDisabled && "is-disabled",
    loading && "is-loading",
    resolvedPlain && "is-plain",
    resolvedRound && "is-round",
    circle && "is-circle",
    resolvedText && "is-text",
    resolvedDashed && "is-dashed",
    link && "is-link",
    bg && "is-has-bg",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 官方仅在 tag 为原生 button 时才下发原生属性；
  // 非 button 标签既没有 disabled 也没有 type，靠 handleClick 拦截。
  const nativeProps =
    tag === "button"
      ? {
          "aria-disabled": resolvedDisabled || loading,
          disabled: resolvedDisabled || loading,
          autoFocus,
          type: nativeType,
        }
      : {};

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (resolvedDisabled || loading) {
      event.stopPropagation();
      return;
    }

    // 与官方一致：原生 reset 之外，还要让 ElForm 把 model 恢复到初始值
    if (nativeType === "reset") form?.resetFields();

    onClick?.(event);
  };

  return {
    tag,
    classes,
    style: { ...customStyle, ...style } as StyleWithVars,
    nativeProps,
    restProps,
    shouldAddSpace,
    loading,
    handleClick,
  };
}
