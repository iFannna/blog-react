"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ElSkeleton, ElSkeletonItem } from "@/components/element-plus/skeleton";
import { ElButton } from "@/components/element-plus/button";
import { ElCard } from "@/components/element-plus/card";
import { ElSpace } from "@/components/element-plus/space";
import { ElSwitch } from "@/components/element-plus/switch";

const cardImage = {} as const;
const cardFooter = {} as const;

/** 官方 demo 在客户端取当前日期；放到挂载后计算，避免 SSR 与固定时钟不一致。 */
function useCurrentDate() {
  const [date, setDate] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载后再取当前日期，避免 SSR 水合不一致
    setDate(new Date().toDateString());
  }, []);
  return date;
}

export function SkeletonBasic() {
  return (
    <div>
      <ElSkeleton />
      <br />
      <ElSkeleton
        style={
          { "--el-skeleton-circle-size": "100px" } as CSSProperties
        }
        template={<ElSkeletonItem variant="circle" />}
      />
    </div>
  );
}

export function SkeletonRows() {
  return <ElSkeleton rows={5} />;
}

export function SkeletonAnimation() {
  return <ElSkeleton rows={5} animated />;
}

/** 官方 customized-template：图片 + 两行文案的骨架 */
function customizedSkeletonTemplate() {
  return (
    <>
      <ElSkeletonItem
        variant="image"
        style={{ width: 240, height: 240 }}
      />
      <div style={{ padding: 14 }}>
        <ElSkeletonItem variant="p" style={{ width: "50%" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ElSkeletonItem variant="text" style={{ marginRight: 16 }} />
          <ElSkeletonItem variant="text" style={{ width: "30%" }} />
        </div>
      </div>
    </>
  );
}

export function SkeletonTemplate() {
  return (
    <ElSkeleton style={{ width: 240 }} template={customizedSkeletonTemplate()} />
  );
}

/** 官方 loading-state 等示例：h3 标题 + 带 16px 间距的文案行 */
function cardSkeletonTemplate(imageHeight = 240) {
  return (
    <>
      <ElSkeletonItem
        variant="image"
        style={{ width: 240, height: imageHeight }}
      />
      <div style={{ padding: 14 }}>
        <ElSkeletonItem variant="h3" style={{ width: "50%" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 16,
            height: 16,
          }}
        >
          <ElSkeletonItem variant="text" style={{ marginRight: 16 }} />
          <ElSkeletonItem variant="text" style={{ width: "30%" }} />
        </div>
      </div>
    </>
  );
}

/** 加载完成后的卡片真实内容 */
function CardContent({ title, date }: { title: string; date: string }) {
  return (
    <ElCard bodyStyle={{ padding: 0, marginBottom: 1 }}>
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        style={cardImage}
        alt={title}
      />
      <div style={{ padding: 14 }}>
        <span>{title}</span>
        <div style={cardFooter}>
          <div>{date}</div>
          <ElButton text>operation button</ElButton>
        </div>
      </div>
    </ElCard>
  );
}

function LoadingSwitch({
  loading,
  onToggle,
}: {
  loading: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div>
      <label style={{ marginRight: 16 }}>Switch Loading</label>
      <ElSwitch checked={loading} onCheckedChange={onToggle} />
    </div>
  );
}

export function SkeletonLoading() {
  const [loading, setLoading] = useState(true);
  const currentDate = useCurrentDate();

  return (
    <ElSpace direction="vertical" alignment="flex-start">
      <LoadingSwitch loading={loading} onToggle={setLoading} />
      <ElSkeleton
        style={{ width: 240 }}
        loading={loading}
        animated
        template={cardSkeletonTemplate()}
      >
        <CardContent title="Delicious hamburger" date={currentDate} />
      </ElSkeleton>
    </ElSpace>
  );
}

interface ListItem {
  imgUrl: string;
  name: string;
}

const LISTS: ListItem[] = [
  {
    imgUrl:
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
    name: "Deer",
  },
  {
    imgUrl:
      "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
    name: "Horse",
  },
  {
    imgUrl:
      "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
    name: "Mountain Lion",
  },
];

const multiTemplate = (
  <div style={{ flex: 1 }}>
    <ElSkeletonItem variant="image" style={{ height: 240 }} />
    <div style={{ padding: 14 }}>
      <ElSkeletonItem variant="h3" style={{ width: "50%" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
          height: 16,
        }}
      >
        <ElSkeletonItem variant="text" style={{ marginRight: 16 }} />
        <ElSkeletonItem variant="text" style={{ width: "30%" }} />
      </div>
    </div>
  </div>
);

export function SkeletonData() {
  const [loading, setLoading] = useState(false);
  const currentDate = useCurrentDate();

  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ElSpace style={{ width: "100%" }} fill>
      <div>
        <ElButton onClick={reload}>Click me to reload</ElButton>
      </div>
      <ElSkeleton
        style={{ display: "flex", gap: 8 }}
        loading={loading}
        animated
        count={3}
        template={multiTemplate}
      >
        {LISTS.map((item) => (
          <ElCard
            key={item.name}
            bodyStyle={{ padding: 0, marginBottom: 1 }}
          >
            <img
              src={item.imgUrl}
              style={{ ...cardImage, maxWidth: "100%" }}
              alt={item.name}
            />
            <div style={{ padding: 14 }}>
              <span>{item.name}</span>
              <div style={cardFooter}>
                <div>{currentDate}</div>
                <ElButton text>Operation button</ElButton>
              </div>
            </div>
          </ElCard>
        ))}
      </ElSkeleton>
    </ElSpace>
  );
}

export function SkeletonAvoidBouncing() {
  const [loading, setLoading] = useState(false);
  const currentDate = useCurrentDate();

  return (
    <ElSpace direction="vertical" alignment="flex-start">
      <LoadingSwitch loading={loading} onToggle={setLoading} />
      <ElSkeleton
        style={{ width: 240 }}
        loading={loading}
        animated
        throttle={500}
        template={cardSkeletonTemplate(265)}
      >
        <CardContent title="Delicious hamburger" date={currentDate} />
      </ElSkeleton>
    </ElSpace>
  );
}

export function SkeletonInitialLoading() {
  const [loading, setLoading] = useState(true);
  const currentDate = useCurrentDate();

  return (
    <ElSpace direction="vertical" alignment="flex-start">
      <LoadingSwitch loading={loading} onToggle={setLoading} />
      <ElSkeleton
        style={{ width: 240 }}
        loading={loading}
        animated
        throttle={{ leading: 500, initVal: true }}
        template={cardSkeletonTemplate(265)}
      >
        <CardContent title="Delicious hamburger" date={currentDate} />
      </ElSkeleton>
    </ElSpace>
  );
}

export function SkeletonLeadingTrailing() {
  const [loading, setLoading] = useState(false);
  const currentDate = useCurrentDate();

  return (
    <ElSpace direction="vertical" alignment="flex-start">
      <LoadingSwitch loading={loading} onToggle={setLoading} />
      <ElSkeleton
        style={{ width: 240 }}
        loading={loading}
        animated
        throttle={{ leading: 500, trailing: 500, initVal: true }}
        template={cardSkeletonTemplate(265)}
      >
        <CardContent title="Delicious hamburger" date={currentDate} />
      </ElSkeleton>
    </ElSpace>
  );
}
