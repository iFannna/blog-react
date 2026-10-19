/**
 * 复刻官方 @element-plus/utils 的滚动动画。
 *
 * 官方 el-anchor 不用 CSS 的 scroll-behavior: smooth，
 * 而是用 rAF + easeInOutCubic 自己做动画，这样才能精确控制时长与偏移。
 * 这里保持同样的算法与参数。
 */

/** 与官方 packages/utils/easings.ts 的 easeInOutCubic 逐行一致。 */
export function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}

/**
 * 对应官方 animateScrollTo：从 from 滚动到 to，历时 duration 毫秒。
 * 返回取消函数，供中途打断（例如用户连续点击不同目录项）。
 *
 * 与官方的一点差异：时间基准取「首次真正绘制的那一帧」而不是调用时刻。
 * 官方用调用时刻，若首帧被浏览器延迟（标签页后台、主线程卡顿）超过 duration，
 * 动画会被压缩成一帧直接跳到终点，用户看到的就是"瞬间跳转"而非动画。
 */
export function animateScrollTo(
  from: number,
  to: number,
  duration: number,
  onDone?: () => void,
): () => void {
  let startTime: number | null = null;
  let handle: number | undefined;
  let cancelled = false;

  const scroll = (timestamp: number) => {
    if (cancelled) return;

    if (startTime === null) startTime = timestamp;

    const time = timestamp - startTime;
    const next = easeInOutCubic(
      time > duration ? duration : time,
      from,
      to,
      duration,
    );

    window.scrollTo(window.pageXOffset, next);

    if (time < duration) {
      handle = window.requestAnimationFrame(scroll);
    } else {
      onDone?.();
    }
  };

  handle = window.requestAnimationFrame(scroll);

  return () => {
    cancelled = true;
    if (handle !== undefined) window.cancelAnimationFrame(handle);
  };
}
