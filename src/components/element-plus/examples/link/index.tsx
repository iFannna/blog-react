"use client";

import { ElLink } from "@/components/element-plus/link";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Edit, View } from "@/components/element-plus/icons";
import styles from "./link.module.css";

export function LinkBasic() {
  return (
    <div className={styles.links}>
      <ElLink href="https://element-plus.org" target="_blank">
        default
      </ElLink>
      <ElLink type="primary">primary</ElLink>
      <ElLink type="success">success</ElLink>
      <ElLink type="warning">warning</ElLink>
      <ElLink type="danger">danger</ElLink>
      <ElLink type="info">info</ElLink>
    </div>
  );
}

export function LinkDisabled() {
  return (
    <div className={styles.links}>
      <ElLink disabled>default</ElLink>
      <ElLink type="primary" disabled>
        primary
      </ElLink>
      <ElLink type="success" disabled>
        success
      </ElLink>
      <ElLink type="warning" disabled>
        warning
      </ElLink>
      <ElLink type="danger" disabled>
        danger
      </ElLink>
      <ElLink type="info" disabled>
        info
      </ElLink>
    </div>
  );
}

export function LinkUnderline() {
  return (
    <div className={styles.links}>
      <ElLink>default</ElLink>
      <ElLink underline="always">always</ElLink>
      <ElLink underline="hover">hover</ElLink>
      <ElLink underline="never">never</ElLink>
    </div>
  );
}

export function LinkIcon() {
  return (
    <div className={styles.links}>
      <ElLink icon={<Edit />}>Edit</ElLink>
      <ElLink>
        Check
        <ElIcon className="el-icon--right">
          <View />
        </ElIcon>
      </ElLink>
    </div>
  );
}
