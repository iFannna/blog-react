"use client";

import { useEffect, useRef } from "react";

export type EventListenerTarget = EventTarget | null | undefined;

/**
 * 对应官方 @vueuse/core 的 useEventListener。
 *
 * 事件名与 target 变化时重新绑定；handler 放进 ref，避免每次渲染重建监听。
 */
export function useEventListener<E extends Event = Event>(
  target: EventListenerTarget,
  event: string,
  handler: (event: E) => void,
  options?: boolean | AddEventListenerOptions,
) {
  const handlerRef = useRef(handler);
  const optionsRef = useRef(options);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!target) return;

    const listener = (event: Event) => handlerRef.current(event as E);
    target.addEventListener(event, listener, optionsRef.current);

    return () => target.removeEventListener(event, listener, optionsRef.current);
  }, [target, event]);
}
