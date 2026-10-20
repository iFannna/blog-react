"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useFormItem } from "./use-form";

export interface FormLabelWrapProps {
  isAutoWidth: boolean;
  updateAll: boolean;
  labelPosition?: string;
  children: ReactNode;
}

/**
 * 对应官方 form-label-wrap.tsx。
 *
 * 两个职责：
 * - label-width="auto" 时量出自身宽度并注册给 Form，由 Form 取最大值下发
 * - 由 Form 下发的 autoLabelWidth 与自身宽度的差值，转成对侧的 margin，把内容推齐
 */
export default function FormLabelWrap({
  isAutoWidth,
  updateAll,
  labelPosition,
  children,
}: FormLabelWrapProps) {
  const { form, formItem } = useFormItem();
  const elRef = useRef<HTMLDivElement>(null);
  const measuredRef = useRef(0);
  const registeredRef = useRef(false);
  // Form 每次渲染都会生成新的 context 对象；清理时不能依赖它，否则一次更新就会把
  // 已注册的宽度全部摘掉，autoLabelWidth 永远停在初始值。
  const formRef = useRef(form);
  // eslint-disable-next-line react-hooks/refs -- 渲染期同步最新 form，卸载清理时读取
  formRef.current = form;

  const getLabelWidth = () => {
    const first = elRef.current?.firstElementChild;
    if (!first) return 0;
    return Math.ceil(Number.parseFloat(window.getComputedStyle(first).width));
  };

  // 官方在 mounted / updated / resize 时都重新量一次
  useLayoutEffect(() => {
    if (!isAutoWidth) return;

    const measure = () => {
      const width = getLabelWidth();
      if (width === measuredRef.current) return;
      const old = measuredRef.current;
      measuredRef.current = width;
      if (updateAll) {
        form?.registerLabelWidth(width, old);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    const first = elRef.current?.firstElementChild;
    if (first) observer.observe(first);

    return () => observer.disconnect();
  }, [form, isAutoWidth, updateAll]);

  // 卸载时把宽度从 Form 的统计里摘掉
  useEffect(
    () => () => {
      if (!isAutoWidth || !registeredRef.current) return;
      formRef.current?.deregisterLabelWidth(measuredRef.current);
    },
    [isAutoWidth],
  );

  useEffect(() => {
    registeredRef.current = isAutoWidth && updateAll;
  }, [isAutoWidth, updateAll]);

  if (!isAutoWidth) {
    return <>{children}</>;
  }

  const style: CSSProperties = {};
  const autoLabelWidth = form?.autoLabelWidth;
  const hasLabel = formItem?.hasLabel;

  if (hasLabel && autoLabelWidth && autoLabelWidth !== "auto") {
    // 宽度是布局测量结果，Form 汇总后会触发重渲染，此时读最新测量值是有意为之
    const marginWidth = Math.max(
      0,
      // eslint-disable-next-line react-hooks/refs
      Number.parseInt(autoLabelWidth, 10) - measuredRef.current,
    );
    const position = labelPosition || form?.labelPosition;
    const marginPosition = position === "left" ? "marginRight" : "marginLeft";
    if (marginWidth) style[marginPosition] = `${marginWidth}px`;
  }

  return (
    <div ref={elRef} className="el-form-item__label-wrap" style={style}>
      {children}
    </div>
  );
}
