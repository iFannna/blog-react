"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ArrowLeft, ArrowRight } from "../icons";
import { useTranslator } from "../config-provider/context";
import { ElCarouselItem } from "./ElCarouselItem";
import type { CarouselExpose, CarouselProps } from "./types";
import type { CarouselItemLayout, CarouselItemProps } from "./ElCarouselItem";

/** 官方 throttledArrowClick / throttledIndicatorHover 用 300ms 节流 */
const THROTTLE_TIME = 300;

/**
 * 对应官方 ElCarousel。
 *
 * React 侧没有 useOrderedChildren，这里改为「对 children 做一次索引」：
 * 按渲染顺序取出所有 ElCarouselItem，把几何状态（位移 / 缩放 / 类名）算好后
 * 通过 cloneElement 注入回去，等价于官方的 items 列表 + translateItem 回调。
 *
 * 循环的实现与官方一致：非卡片模式下首尾项互为「补位」——
 * 激活首项时把末位摆到 -1 格、激活末项时把首位摆到 length 格，
 * 位移始终只跨 1 格，避免整屏回拉的突变。
 */
export const ElCarousel = forwardRef<CarouselExpose, CarouselProps>(
  function ElCarousel(
    {
      initialIndex = 0,
      height = "",
      trigger = "hover",
      autoplay = true,
      interval = 3000,
      indicatorPosition = "",
      arrow = "hover",
      type = "",
      cardScale = 0.83,
      loop = true,
      direction = "horizontal",
      pauseOnHover = true,
      motionBlur = false,
      onChange,
      className,
      style,
      children,
    },
    ref,
  ) {
    const t = useTranslator();

    const rootRef = useRef<HTMLDivElement>(null);
    // 下标同时存 ref 与 state：定时器/事件回调需要立即读到最新值，不等待提交。
    // 初值取 initialIndex，首帧即可渲染到正确位置，不用等 effect 提交后再摆位。
    const activeIndexRef = useRef(initialIndex);
    // 节流时间戳记账，对应官方 lodash throttle(…, 300)
    const arrowThrottleRef = useRef(0);
    const indicatorThrottleRef = useRef(0);
    // onChange 走 ref：自动播放的 effect 依赖它，若直接依赖 props 里每次渲染
    // 新建的函数，父组件一重渲染计时器就会重置，间隔永远等不到
    const onChangeRef = useRef(onChange);

    const [activeIndex, setActiveIndexState] = useState(initialIndex);
    // 上一次的激活下标。渲染期要读它来判定 is-animating，所以必须是 state 而非 ref
    const [prevIndex, setPrevIndex] = useState(initialIndex);
    const [hover, setHover] = useState(false);
    // 悬停箭头时为该项对应的「舞台内」侧边项加高亮，对应官方 states.hover
    const [hoverStage, setHoverStage] = useState<"left" | "right" | null>(null);
    // height="auto" 时由激活项撑出的容器高度
    const [containerHeight, setContainerHeight] = useState(0);
    // 容器主轴实测尺寸：位移依赖它，官方由 onMounted 内测得，这里放到 state 里保持渲染纯净
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const isVertical = direction === "vertical";
    const isCardType = type === "card";
    const arrowDisplay = arrow !== "never" && !isVertical;

    // 收集子项：只认 ElCarouselItem，顺序即渲染顺序
    const items = Children.toArray(children).filter(
      (child): child is ReactElement<CarouselItemProps> =>
        isValidElement(child) && child.type === ElCarouselItem,
    );
    const itemCount = items.length;

    // 同步最新的 onChange 到 ref，供事件回调随时读取
    useEffect(() => {
      onChangeRef.current = onChange;
    });

    /** 写入下标；与官方 watch 一致地抛 change，首次赋值（prev 为 -1）不发 */
    const setActiveIndex = useCallback((next: number) => {
      const prev = activeIndexRef.current;
      if (next === prev) return;
      activeIndexRef.current = next;
      setPrevIndex(prev);
      setActiveIndexState(next);
      if (prev > -1) onChangeRef.current?.(next, prev);
    }, []);

    const setActiveItemByIndex = useCallback(
      (index: number) => {
        if (!Number.isInteger(index)) return;

        let next = index;
        if (next < 0) {
          next = loop ? itemCount - 1 : 0;
        } else if (next >= itemCount) {
          next = loop ? 0 : itemCount - 1;
        }

        if (next === activeIndexRef.current) {
          // 官方在 oldIndex === activeIndex 时也重置一次位置，保证过渡类名复位
          setPrevIndex(next);
          setActiveIndexState(next);
          return;
        }
        setActiveIndex(next);
      },
      [itemCount, loop, setActiveIndex],
    );

    /** 对应官方 setActiveItem：下标或项的 name 均可用 */
    const setActiveItem = useCallback(
      (target: number | string) => {
        if (typeof target === "string") {
          const found = items.findIndex((item) => item.props.name === target);
          // 找不到同名项时官方只 console.warn，这里直接忽略
          if (found < 0) return;
          setActiveItemByIndex(found);
          return;
        }
        setActiveItemByIndex(target);
      },
      [items, setActiveItemByIndex],
    );

    const prev = useCallback(() => {
      setActiveItemByIndex(activeIndexRef.current - 1);
    }, [setActiveItemByIndex]);

    const next = useCallback(() => {
      setActiveItemByIndex(activeIndexRef.current + 1);
    }, [setActiveItemByIndex]);

    // 挂载与项数变化时按 initialIndex 初始化，对应官方 onMounted 里的 watch immediate
    useEffect(() => {
      if (itemCount > 0) setActiveItemByIndex(initialIndex);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemCount, initialIndex]);

    // 自动播放：官方用 setInterval 并在每次切换后 resetTimer，这里用 effect 承载。
    // 依赖 activeIndex，切换后计时重新开始，与官方 resetTimer 等价。
    useEffect(() => {
      if (interval <= 0 || !autoplay) return;
      if (pauseOnHover && hover) return;
      if (activeIndex < 0) return;

      const timer = window.setInterval(() => {
        const current = activeIndexRef.current;
        if (current < itemCount - 1) {
          setActiveIndex(current + 1);
        } else if (loop) {
          setActiveIndex(0);
        }
      }, interval);

      return () => window.clearInterval(timer);
    }, [
      autoplay,
      interval,
      loop,
      pauseOnHover,
      hover,
      itemCount,
      activeIndex,
      setActiveIndex,
    ]);

    // height="auto"：容器高度跟随激活项，对应官方 item 回写 offsetHeight
    useEffect(() => {
      if (height !== "auto" || activeIndex < 0) return;
      const activeItem =
        rootRef.current?.querySelectorAll<HTMLElement>(".el-carousel__item")[
          activeIndex
        ];
      if (activeItem) setContainerHeight(activeItem.offsetHeight);
    }, [height, activeIndex, itemCount]);

    /** 对应官方 processIndex：把下标折算成离激活项最近的等价格子 */
    const processIndex = (index: number, current: number) => {
      const lastItemIndex = itemCount - 1;
      const prevItemIndex = current - 1;
      const nextItemIndex = current + 1;
      const halfItemIndex = itemCount / 2;

      if (current === 0 && index === lastItemIndex) {
        return -1;
      } else if (current === lastItemIndex && index === 0) {
        return itemCount;
      } else if (index < prevItemIndex && current - index >= halfItemIndex) {
        return itemCount + 1;
      } else if (index > nextItemIndex && index - current >= halfItemIndex) {
        return -2;
      }
      return index;
    };

    /** 对应官方 calcTranslate：普通模式按主轴尺寸平移整数格 */
    const calcTranslate = (index: number, current: number) => {
      const distance = isVertical ? containerSize.height : containerSize.width;
      return distance * (index - current);
    };

    /** 对应官方 calcCardTranslate：卡片模式按 cardScale 分摊左右空间 */
    const calcCardTranslate = (
      index: number,
      current: number,
      inStage: boolean,
    ) => {
      const parentSize = isVertical ? containerSize.height : containerSize.width;

      if (inStage) {
        return (parentSize * ((2 - cardScale) * (index - current) + 1)) / 4;
      } else if (index < current) {
        return (-(1 + cardScale) * parentSize) / 4;
      }
      return ((3 + cardScale) * parentSize) / 4;
    };

    // 对应官方 useResizeObserver(root)：测量容器主轴尺寸并随其变化重算所有项位移。
    // 位移量必须来自实测，props 里的 height 是字符串（可能是 auto 或任意单位）。
    // 用 layout effect：尺寸要在浏览器绘制前写回，避免首帧以零位移闪一帧。
    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const measure = () => {
        const next = { width: root.offsetWidth, height: root.offsetHeight };
        setContainerSize((prev) =>
          prev.width === next.width && prev.height === next.height ? prev : next,
        );
      };

      measure();

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(root);
      return () => observer.disconnect();
    }, []);

    /** 对应官方 translateItem：算出单个项的 translate / scale 与状态 */
    const getItemLayout = (
      index: number,
      current: number,
    ): CarouselItemLayout => {
      const active = index === current;
      // 官方 animating = isActive || index === oldIndex：只有新激活项与被替换的旧项做过渡。
      // prevIndex 初始等于 initialIndex，与官方首帧「位置已就绪、无需过渡」一致。
      const animating = !isCardType && (active || index === prevIndex);

      let normalized = index;
      if (!active && itemCount > 2 && loop) {
        normalized = processIndex(index, current);
      }

      // 对应官方 states.hover：仅在卡片模式下由 handleButtonEnter 置位
      const hovered = isCardType && Boolean(hoverStage) && itemInStage(index) === hoverStage;

      if (isCardType) {
        const inStage = Math.round(Math.abs(normalized - current)) <= 1;
        return {
          active,
          inStage,
          animating,
          hover: hovered,
          translate: calcCardTranslate(normalized, current, inStage),
          scale: active ? 1 : cardScale,
        };
      }

      return {
        active,
        inStage: false,
        animating,
        hover: hovered,
        translate: calcTranslate(normalized, current),
        scale: 1,
      };
    };

    // 官方 PlaceholderItem：双项 + 循环 + 非卡片时会补一个克隆项，
    // 让首尾互换时位移始终只跨 1 格，避免整屏回拉的突变。
    // React 的元素顺序天然稳定，无需官方那份 VNode 重排逻辑。
    const isItemsTwoLength = itemCount === 2 && loop && !isCardType;

    /** 对应官方 isTwoLengthShow：双项循环时只显示当前那一组指示器 */
    const isTwoLengthShow = (index: number) => {
      if (!isItemsTwoLength) return true;
      return activeIndex <= 1 ? index <= 1 : index > 1;
    };

    /** 对应官方 itemInStage：判断某项处于激活项的哪一侧，仅卡片化时有意义 */
    const itemInStage = (index: number): "left" | "right" | false => {
      // 官方的 states.inStage 只在卡片模式下被置位，非卡片模式恒为 false
      if (itemCount === 0 || !isCardType) return false;
      if (Math.round(Math.abs(index - activeIndex)) > 1) return false;

      const lastItemIndex = itemCount - 1;
      const isLastActive = activeIndex === lastItemIndex;
      const isFirstActive = activeIndex === 0;
      // 官方是「下一项是否激活」，而不是「该项是否在激活项之后」
      const isNextActive = index + 1 === activeIndex;
      const isPrevActive = index - 1 === activeIndex;

      if ((index === lastItemIndex && isFirstActive) || isNextActive) {
        return "left";
      } else if ((index === 0 && isLastActive) || isPrevActive) {
        return "right";
      }
      return false;
    };

    /**
     * 对应官方 defineExpose：activeIndex / setActiveItem / prev / next。
     *
     * activeIndex 用 getter 而非快照，父组件通过 ref 读到的永远是最新下标；
     * 依赖里不能放 activeIndex，否则每次切换都会重建句柄。
     */
    useImperativeHandle(
      ref,
      () => ({
        get activeIndex() {
          return activeIndexRef.current;
        },
        setActiveItem,
        prev,
        next,
      }),
      [setActiveItem, prev, next],
    );

    const handleTransitionStart = (event: TransitionEvent<HTMLDivElement>) => {
      if (!motionBlur) return;
      event.currentTarget.classList.add(
        isVertical ? "el-transitioning-vertical" : "el-transitioning",
      );
    };

    const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
      if (!motionBlur) return;
      event.currentTarget.classList.remove(
        isVertical ? "el-transitioning-vertical" : "el-transitioning",
      );
    };

    const rootClasses = [
      "el-carousel",
      `el-carousel--${direction}`,
      isCardType && "el-carousel--card",
      isVertical && indicatorPosition === "outside" && "is-vertical-outside",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const indicatorsClasses = [
      "el-carousel__indicators",
      `el-carousel__indicators--${direction}`,
      hasLabel(items) && "el-carousel__indicators--labels",
      indicatorPosition === "outside" && "el-carousel__indicators--outside",
      isVertical && "el-carousel__indicators--right",
    ]
      .filter(Boolean)
      .join(" ");

    // 指示器是否渲染 label 文本，与 --labels 修饰类同源，避免在循环里重复遍历
    const indicatorsHaveLabel = hasLabel(items);

    const containerStyle =
      height === "auto"
        ? { height: `${containerHeight}px`, overflow: "hidden" as const }
        : { height };

    // 渲染列表：双项循环时在末尾追加一个克隆项（内容取自首项），承接跨格位移。
    // onActivate 里捕获的 setActiveItem 只在点击时读取下标，但 react-hooks/refs
    // 无法区分「渲染期读」和「回调期读」，故对此处放行。
    // eslint-disable-next-line react-hooks/refs -- 回调仅在点击时执行
    const renderItems: ReactNode[] = items.map((item, index) =>
      cloneElement(item, {
        key: item.key ?? index,
        layout: getItemLayout(index, activeIndex),
        isVertical,
        isCardType,
        onActivate: () => setActiveItem(index),
      }),
    );

    if (isItemsTwoLength && items[0]) {
      renderItems.push(
        // eslint-disable-next-line react-hooks/refs -- 同上，回调只在点击时执行
        cloneElement(items[0], {
          key: "__carousel-clone__",
          layout: getItemLayout(itemCount, activeIndex),
          isVertical,
          isCardType,
          onActivate: () => setActiveItem(0),
        }),
      );
    }

    const leftVisible =
      arrow === "always" || hover
        ? loop || activeIndex > 0
        : false;
    const rightVisible =
      arrow === "always" || hover
        ? loop || activeIndex < itemCount - 1
        : false;

    return (
      <div
        ref={rootRef}
        className={rootClasses}
        style={style}
        onMouseEnter={(event) => {
          event.stopPropagation();
          setHover(true);
        }}
        onMouseLeave={(event) => {
          event.stopPropagation();
          setHover(false);
        }}
      >
        {arrowDisplay && (
          <ArrowButton
            side="left"
            visible={leftVisible}
            ariaLabel={t("el.carousel.leftArrow")}
            onEnter={() => {
              // 官方 handleButtonEnter：纵向时不处理
              if (isVertical) return;
              setHoverStage("left");
            }}
            onLeave={() => {
              if (isVertical) return;
              setHoverStage(null);
            }}
            onClick={() => {
              const now = Date.now();
              if (now - arrowThrottleRef.current < THROTTLE_TIME) return;
              arrowThrottleRef.current = now;
              setActiveItem(activeIndexRef.current - 1);
            }}
          />
        )}

        {arrowDisplay && (
          <ArrowButton
            side="right"
            visible={rightVisible}
            ariaLabel={t("el.carousel.rightArrow")}
            onEnter={() => {
              if (isVertical) return;
              setHoverStage("right");
            }}
            onLeave={() => {
              if (isVertical) return;
              setHoverStage(null);
            }}
            onClick={() => {
              const now = Date.now();
              if (now - arrowThrottleRef.current < THROTTLE_TIME) return;
              arrowThrottleRef.current = now;
              setActiveItem(activeIndexRef.current + 1);
            }}
          />
        )}

        <div
          className="el-carousel__container"
          style={containerStyle}
          onTransitionStart={handleTransitionStart}
          onTransitionEnd={handleTransitionEnd}
        >
          {renderItems}
        </div>

        {indicatorPosition !== "none" && (
          <ul className={indicatorsClasses}>
            {items.map((item, index) => {
              const indicatorClasses = [
                "el-carousel__indicator",
                `el-carousel__indicator--${direction}`,
                index === activeIndex && "is-active",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li
                  key={index}
                  className={indicatorClasses}
                  style={
                    isTwoLengthShow(index) ? undefined : { display: "none" }
                  }
                  onMouseEnter={() => {
                    if (trigger !== "hover" || index === activeIndex) return;
                    const now = Date.now();
                    if (now - indicatorThrottleRef.current < THROTTLE_TIME) {
                      return;
                    }
                    indicatorThrottleRef.current = now;
                    setActiveItem(index);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveItem(index);
                  }}
                >
                  <button
                    className="el-carousel__button"
                    type="button"
                    aria-label={t("el.carousel.indicator", { index: index + 1 })}
                  >
                    {indicatorsHaveLabel && <span>{item.props.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* motion-blur 的 SVG 滤镜定义，官方同样在组件内内联这段 svg */}
        {motionBlur && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            style={{ display: "none" }}
          >
            <defs>
              <filter id="elCarouselHorizontal">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12,0" />
              </filter>
              <filter id="elCarouselVertical">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0,10" />
              </filter>
            </defs>
          </svg>
        )}
      </div>
    );
  },
);

/** 官方 hasLabel：任一项的 label 非空即可 */
function hasLabel(items: ReactElement<CarouselItemProps>[]) {
  return items.some((item) => String(item.props.label ?? "").length > 0);
}

interface ArrowButtonProps {
  side: "left" | "right";
  visible: boolean;
  ariaLabel: string;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}

/**
 * 官方箭头由 v-show 控制显隐，DOM 始终存在，所以这里也用 display 切换，
 * 不用条件渲染——否则每次显隐都会重建节点，丢掉落点与过渡状态。
 */
function ArrowButton({
  side,
  visible,
  ariaLabel,
  onEnter,
  onLeave,
  onClick,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      className={`el-carousel__arrow el-carousel__arrow--${side}`}
      style={visible ? undefined : { display: "none" }}
      aria-label={ariaLabel}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <ElIcon>{side === "left" ? <ArrowLeft /> : <ArrowRight />}</ElIcon>
    </button>
  );
}
