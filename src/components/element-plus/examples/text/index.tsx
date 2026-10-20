"use client";

import { ElText } from "@/components/element-plus/text";
import { ElSpace } from "@/components/element-plus/space";
import { ElRate } from "@/components/element-plus/rate";
import { ElButton } from "@/components/element-plus/button";
import { ElRow } from "@/components/element-plus/row";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Bell, ElementPlus } from "@/components/element-plus/icons";
import styles from "./text.module.css";

export function TextBasic() {
  return (
    <>
      <ElText className={styles.mx1}>Default</ElText>
      <ElText className={styles.mx1} type="primary">Primary</ElText>
      <ElText className={styles.mx1} type="success">Success</ElText>
      <ElText className={styles.mx1} type="info">Info</ElText>
      <ElText className={styles.mx1} type="warning">Warning</ElText>
      <ElText className={styles.mx1} type="danger">Danger</ElText>
    </>
  );
}

export function TextSizes() {
  return (
    <>
      <ElText className={styles.mx1} size="large">Large</ElText>
      <ElText className={styles.mx1}>Default</ElText>
      <ElText className={styles.mx1} size="small">Small</ElText>
    </>
  );
}

export function TextTruncated() {
  return (
    <>
      <ElText className={`${styles.w150} ${styles.mb2}`} truncated>
        Self element set width 100px
      </ElText>
      <ElRow className={`${styles.row} ${styles.w150}`}>
        <ElText truncated>Squeezed by parent element</ElText>
      </ElRow>
      <ElRow className={styles.row}>
        <ElText lineClamp={2}>
          The -webkit-line-clamp CSS property
          <br />
          allows limiting of the contents of
          <br />a block to the specified number of lines.
        </ElText>
      </ElRow>
      <ElRow>
        <ElText className={styles.w150} truncated>
          Show tooltip only when the text is truncated
        </ElText>
      </ElRow>
    </>
  );
}

export function TextMixed() {
  return (
    <ElSpace direction="vertical">
      <ElText>
        <ElIcon>
          <ElementPlus />
        </ElIcon>{" "}
        Element-Plus
      </ElText>
      <ElRow>
        <ElText>Rate</ElText>
        <ElRate className={styles.ml1} />
      </ElRow>
      <ElText>
        This is text mixed icon{" "}
        <ElIcon>
          <Bell />
        </ElIcon>
        {" "}and component{" "}
        <ElButton>Button</ElButton>
      </ElText>
    </ElSpace>
  );
}

export function TextOverride() {
  return (
    <ElSpace direction="vertical">
      <ElText>span</ElText>
      <ElText tag="p">This is a paragraph.</ElText>
      <ElText tag="b">Bold</ElText>
      <ElText tag="i">Italic</ElText>
      <ElText>
        This is{" "}
        <ElText tag="sub" size="small" className={styles.sub}>subscript</ElText>
      </ElText>
      <ElText>
        This is{" "}
        <ElText tag="sup" size="small" className={styles.sup}>superscript</ElText>
      </ElText>
      <ElText tag="ins">Inserted</ElText>
      <ElText tag="del">Deleted</ElText>
      <ElText tag="mark">Marked</ElText>
    </ElSpace>
  );
}
