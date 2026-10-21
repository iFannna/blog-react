"use client";

import { createElement, isValidElement, type ReactNode } from "react";
import { ElIcon } from "../icon/ElIcon";
import { Loading } from "../generated/icons";
import { useButton } from "./use-button";
import type { ButtonProps } from "./types";

/**
 * 对应官方 ElButton。样式全部来自官方编译的 theme-chalk，
 * 组件只负责拼出 .el-button 及其状态类，以及 dom 结构。
 */
export function ElButton(props: ButtonProps) {
  const {
    tag,
    classes,
    style,
    nativeProps,
    restProps,
    shouldAddSpace,
    loading,
    handleClick,
  } = useButton(props);

  const { icon, loadingIcon, children } = props;

  // 官方模板里 loading / icon / icon 插槽是 v-if / else-if 三选一，
  // 三者都不成立时 el-icon 整块不渲染；此处用 null 表达同样的分支。
  let iconNode: ReactNode = null;

  if (loading) {
    // 官方 loading 插槽的内容直接渲染；loading-icon 才包一层 el-icon
    iconNode = isValidElement(loadingIcon) ? (
      loadingIcon
    ) : (
      <ElIcon className="is-loading">
        {loadingIcon ?? <Loading />}
      </ElIcon>
    );
  } else if (icon) {
    iconNode = <ElIcon>{icon}</ElIcon>;
  }

  const hasChildren =
    children !== undefined && children !== null && children !== false && children !== "";

  return createElement(
    tag,
    {
      ...nativeProps,
      ...restProps,
      className: classes,
      style,
      onClick: handleClick,
    },
    iconNode,
    hasChildren && (
      // 官方的 class 绑定是对象语法，条件不成立时渲染成 class="" 而非省略属性
      <span className={shouldAddSpace ? "el-button__text--expand" : ""}>
        {children}
      </span>
    ),
  );
}
