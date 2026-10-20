"use client";

import { ElButton } from "@/components/element-plus/button";
import styles from "./button.module.css";
import { mb16 } from "./styles";

export default function ButtonLink() {
  return (
    <>
      <p className={styles.demoP}>Basic link button</p>
      <div className={mb16}>
        <ElButton link>plain</ElButton>
        <ElButton type="primary" link>primary</ElButton>
        <ElButton type="success" link>success</ElButton>
        <ElButton type="info" link>info</ElButton>
        <ElButton type="warning" link>warning</ElButton>
        <ElButton type="danger" link>danger</ElButton>
      </div>

      <p className={styles.demoP}>Disabled link button</p>
      <div>
        <ElButton link disabled>plain</ElButton>
        <ElButton type="primary" link disabled>primary</ElButton>
        <ElButton type="success" link disabled>success</ElButton>
        <ElButton type="info" link disabled>info</ElButton>
        <ElButton type="warning" link disabled>warning</ElButton>
        <ElButton type="danger" link disabled>danger</ElButton>
      </div>
    </>
  );
}
