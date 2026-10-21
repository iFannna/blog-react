"use client";

import { ElBacktop } from "@/components/element-plus/backtop";
import styles from "./backtop.module.css";

export function BacktopBasic() {
  return (
    <>
      Scroll down to see the bottom-right button.
      <ElBacktop right={100} bottom={100} />
    </>
  );
}

export function BacktopCustom() {
  return (
    <>
      Scroll down to see the bottom-right button.
      <ElBacktop bottom={100}>
        <div className={styles.customContent}>UP</div>
      </ElBacktop>
    </>
  );
}
