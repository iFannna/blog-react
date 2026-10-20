"use client";

import { ElText } from "@/components/element-plus/text";
import { ElSpace } from "@/components/element-plus/space";
import { ElRate } from "@/components/element-plus/rate";
import { ElButton } from "@/components/element-plus/button";
import { ElRow } from "@/components/element-plus/row";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Bell, ElementPlus } from "@/components/element-plus/icons";

const spaced = { marginRight: 8 } as const;
const truncateBox = { width: 150, marginBottom: 8 } as const;

export function TextBasic() {
  return (
    <div>
      <ElText style={spaced}>Default</ElText>
      <ElText type="primary" style={spaced}>Primary</ElText>
      <ElText type="success" style={spaced}>Success</ElText>
      <ElText type="info" style={spaced}>Info</ElText>
      <ElText type="warning" style={spaced}>Warning</ElText>
      <ElText type="danger">Danger</ElText>
    </div>
  );
}

export function TextSizes() {
  return (
    <div>
      <ElText size="large" style={spaced}>Large</ElText>
      <ElText style={spaced}>Default</ElText>
      <ElText size="small">Small</ElText>
    </div>
  );
}

export function TextTruncated() {
  return (
    <div>
      <div style={truncateBox}>
        <ElText truncated>Self element set width 100px</ElText>
      </div>
      <div style={truncateBox}>
        <ElRow>
          <ElText truncated>Squeezed by parent element</ElText>
        </ElRow>
      </div>
      <ElText lineClamp={2}>
        The -webkit-line-clamp CSS property
        <br />
        allows limiting of the contents of
        <br />a block to the specified number of lines.
      </ElText>
    </div>
  );
}

export function TextMixed() {
  return (
    <ElSpace direction="vertical">
      <ElText>
        <ElIcon>
          <ElementPlus />
        </ElIcon>
        Element-Plus
      </ElText>
      <ElRow>
        <ElText>Rate</ElText>
        <ElRate style={{ marginLeft: 4 }} />
      </ElRow>
      <ElText>
        This is text mixed icon
        <ElIcon>
          <Bell />
        </ElIcon>
        and component
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
        This is
        <ElText tag="sub" size="small">subscript</ElText>
      </ElText>
      <ElText>
        This is
        <ElText tag="sup" size="small">superscript</ElText>
      </ElText>
      <ElText tag="ins">Inserted</ElText>
      <ElText tag="del">Deleted</ElText>
      <ElText tag="mark">Marked</ElText>
    </ElSpace>
  );
}
