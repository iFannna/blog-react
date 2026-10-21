"use client";

import { ElCard } from "@/components/element-plus/card";

const HAMBURGER =
  "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png";

const listStyle = { margin: 0 } as const;

const listItemStyle = (index: number) => ({
  ...listStyle,
  marginBottom: index < 3 ? 16 : 0,
});

export function CardBasic() {
  return (
    <ElCard
      style={{ maxWidth: 480 }}
      header={
        <div className="card-header">
          <span>Card name</span>
        </div>
      }
      footer="Footer content"
    >
      {[1, 2, 3, 4].map((item) => (
        <p key={item} style={listItemStyle(item - 1)}>
          {`List item ${item}`}
        </p>
      ))}
    </ElCard>
  );
}

export function CardSimple() {
  return (
    <ElCard style={{ maxWidth: 480 }}>
      {[1, 2, 3, 4].map((item) => (
        <p key={item} style={listItemStyle(item - 1)}>
          {`List item ${item}`}
        </p>
      ))}
    </ElCard>
  );
}

export function CardWithImages() {
  return (
    <ElCard style={{ maxWidth: 480 }} header="Yummy hamburger">
      <img src={HAMBURGER} style={{ width: "100%" }} alt="" />
    </ElCard>
  );
}

export function CardShadow() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <ElCard style={{ width: 480 }} shadow="always">
        Always
      </ElCard>
      <ElCard style={{ width: 480 }} shadow="hover">
        Hover
      </ElCard>
      <ElCard style={{ width: 480 }} shadow="never">
        Never
      </ElCard>
    </div>
  );
}
