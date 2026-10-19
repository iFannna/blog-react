"use client";

import { useEffect, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  addLoadingClass,
  getServerSnapshot,
  getSnapshot,
  removeLoadingClass,
  subscribe,
  type LoadingState,
} from "./store";

/** 官方默认 spinner：一个由 CSS 动画驱动旋转的 svg 圆环。 */
function DefaultSpinner() {
  return (
    <svg className="circular" viewBox="25 25 50 50">
      <circle className="path" cx="50" cy="50" r="20" fill="none" />
    </svg>
  );
}

function LoadingMask({ instance }: { instance: LoadingState }) {
  const { background, spinner, text, customClass, closing, zIndex } = instance;

  const classes = [
    "el-loading-mask",
    customClass,
    closing && "el-loading-fade-leave-active",
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {
    zIndex,
    ...(background ? { backgroundColor: background } : {}),
  };

  const isCustomSpinner = typeof spinner === "string";

  return (
    <div className={classes} style={style}>
      <div className="el-loading-spinner">
        {isCustomSpinner ? (
          // spinner 传字符串时，官方把它当作 svg 字符串渲染
          <svg className="circular" viewBox="25 25 50 50" dangerouslySetInnerHTML={{ __html: spinner }} />
        ) : (
          <DefaultSpinner />
        )}

        {text !== undefined && text !== "" && (
          <p className="el-loading-text">{text}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Loading 的渲染容器。
 *
 * 需要按目标元素分组渲染：遮罩要挂到「目标元素」内部（而非统一挂 body），
 * 因为非全屏 Loading 只覆盖目标元素的范围。
 *
 * 这里用 createPortal 把遮罩渲染到各自的目标元素里 —— 这是 React 里
 * 实现「渲染到指定 DOM 节点」的标准做法，等价于官方 appendChild 的行为。
 */
export default function ElLoadingContainer() {
  const loadings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <>
      {loadings.map((instance) => (
        <LoadingPortal key={instance.id} instance={instance} />
      ))}
    </>
  );
}

/** 客户端判定不依赖任何外部订阅，这里给 useSyncExternalStore 一个空订阅。 */
const subscribeClient = () => () => {};

function LoadingPortal({ instance }: { instance: LoadingState }) {
  // 服务端渲染时目标节点还不存在，用它替代「挂载后 setState」，避免多余渲染
  const mounted = useSyncExternalStore(
    subscribeClient,
    () => true,
    () => false,
  );

  /**
   * 挂载时给目标元素加定位类，卸载时移除。
   * 对应官方 addClassList / destroySelf 的成对操作。
   */
  useEffect(() => {
    addLoadingClass(instance.resolvedTarget, instance.fullscreen ?? false);
    return () => removeLoadingClass(instance.resolvedTarget);
  }, [instance.resolvedTarget, instance.fullscreen]);

  if (!mounted) return null;

  return createPortal(<LoadingMask instance={instance} />, instance.resolvedTarget);
}
