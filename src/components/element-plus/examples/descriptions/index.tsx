"use client";

import { useState, type ReactNode } from "react";
import {
  ElDescriptions,
  ElDescriptionsItem,
} from "@/components/element-plus/descriptions";
import { ElButton } from "@/components/element-plus/button";
import { ElRadio } from "@/components/element-plus/radio/ElRadio";
import { ElRadioGroup } from "@/components/element-plus/radio/ElRadioGroup";
import { ElTag } from "@/components/element-plus/tag";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElImage } from "@/components/element-plus/image";
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from "@/components/element-plus/generated/icons";
import styles from "./descriptions.module.css";

type DemoSize = "large" | "default" | "small";

const ICON_MARGIN: Record<DemoSize, number> = {
  large: 8,
  default: 6,
  small: 4,
};

const BLOCK_MARGIN: Record<DemoSize, number> = {
  large: 32,
  default: 28,
  small: 24,
};

const AVATAR =
  "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

export function DescriptionsBasic() {
  return (
    <ElDescriptions title="User Info">
      <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
      <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
      <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
      <ElDescriptionsItem label="Remarks">
        <ElTag size="small">School</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </ElDescriptionsItem>
    </ElDescriptions>
  );
}

function iconLabel(icon: ReactNode, text: string, size: DemoSize) {
  return (
    <div className={styles.cellItem}>
      <ElIcon style={{ marginRight: ICON_MARGIN[size] }}>{icon}</ElIcon>
      {text}
    </div>
  );
}

export function DescriptionsSizes() {
  const [size, setSize] = useState<DemoSize>("default");

  return (
    <>
      <ElRadioGroup
        value={size}
        onChange={(value) => setSize(value as DemoSize)}
        style={{ marginRight: 12 }}
      >
        <ElRadio value="large" label="Large" />
        <ElRadio value="default" label="Default" />
        <ElRadio value="small" label="Small" />
      </ElRadioGroup>

      <ElDescriptions
        title="With border"
        column={3}
        size={size}
        border
        style={{ marginTop: 20 }}
        extra={<ElButton type="primary">Operation</ElButton>}
      >
        <ElDescriptionsItem label={iconLabel(<User />, "Username", size)}>
          kooriookami
        </ElDescriptionsItem>
        <ElDescriptionsItem label={iconLabel(<Iphone />, "Telephone", size)}>
          18100000000
        </ElDescriptionsItem>
        <ElDescriptionsItem label={iconLabel(<Location />, "Place", size)}>
          Suzhou
        </ElDescriptionsItem>
        <ElDescriptionsItem label={iconLabel(<Tickets />, "Remarks", size)}>
          <ElTag size="small">School</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label={iconLabel(<OfficeBuilding />, "Address", size)}
        >
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </ElDescriptionsItem>
      </ElDescriptions>

      <ElDescriptions
        title="Without border"
        column={3}
        size={size}
        style={{ marginTop: BLOCK_MARGIN[size] }}
        extra={<ElButton type="primary">Operation</ElButton>}
      >
        <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
        <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
        <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
        <ElDescriptionsItem label="Remarks">
          <ElTag size="small">School</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Address">
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </ElDescriptionsItem>
      </ElDescriptions>
    </>
  );
}

export function DescriptionsVertical() {
  const [size, setSize] = useState<DemoSize>("default");

  const items = [
    <ElDescriptionsItem key="username" label="Username">
      kooriookami
    </ElDescriptionsItem>,
    <ElDescriptionsItem key="telephone" label="Telephone">
      18100000000
    </ElDescriptionsItem>,
    <ElDescriptionsItem key="place" label="Place" span={2}>
      Suzhou
    </ElDescriptionsItem>,
    <ElDescriptionsItem key="remarks" label="Remarks">
      <ElTag size="small">School</ElTag>
    </ElDescriptionsItem>,
    <ElDescriptionsItem key="address" label="Address">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </ElDescriptionsItem>,
  ];

  return (
    <>
      <ElRadioGroup
        value={size}
        onChange={(value) => setSize(value as DemoSize)}
        style={{ marginRight: 12 }}
      >
        <ElRadio value="large" label="Large" />
        <ElRadio value="default" label="Default" />
        <ElRadio value="small" label="Small" />
      </ElRadioGroup>

      <ElDescriptions
        title="Vertical list with border"
        direction="vertical"
        column={4}
        size={size}
        border
        style={{ marginTop: 20 }}
      >
        {items}
      </ElDescriptions>

      <ElDescriptions
        title="Vertical list without border"
        direction="vertical"
        column={4}
        size={size}
        style={{ marginTop: BLOCK_MARGIN[size] }}
      >
        {items}
      </ElDescriptions>
    </>
  );
}

export function DescriptionsRowspan() {
  return (
    <>
      <ElDescriptions title="Width horizontal list" border>
        <ElDescriptionsItem
          rowspan={2}
          width={140}
          label="Photo"
          align="center"
        >
          <ElImage
            src={AVATAR}
            style={{ width: 100, height: 100 }}
            fit="fill"
          />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
        <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
        <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
        <ElDescriptionsItem label="Remarks">
          <ElTag size="small">School</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Address">
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </ElDescriptionsItem>
      </ElDescriptions>

      <ElDescriptions
        title="Width vertical list"
        direction="vertical"
        border
        style={{ marginTop: 20 }}
      >
        <ElDescriptionsItem
          rowspan={2}
          width={140}
          label="Photo"
          align="center"
        >
          <ElImage
            src={AVATAR}
            style={{ width: 100, height: 100 }}
            fit="fill"
          />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Username">kooriookami</ElDescriptionsItem>
        <ElDescriptionsItem label="Telephone">18100000000</ElDescriptionsItem>
        <ElDescriptionsItem label="Place">Suzhou</ElDescriptionsItem>
        <ElDescriptionsItem label="Remarks">
          <ElTag size="small">School</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="Address">
          No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </ElDescriptionsItem>
      </ElDescriptions>
    </>
  );
}

export function DescriptionsCustomStyle() {
  return (
    <ElDescriptions title="Customized style list" column={3} border>
      <ElDescriptionsItem
        label="Username"
        labelAlign="right"
        align="center"
        labelClassName={styles.myLabel}
        className={styles.myContent}
        width="150px"
      >
        kooriookami
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Telephone" labelAlign="right" align="center">
        18100000000
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Place" labelAlign="right" align="center">
        Suzhou
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Remarks" labelAlign="right" align="center">
        <ElTag size="small">School</ElTag>
      </ElDescriptionsItem>
      <ElDescriptionsItem label="Address" labelAlign="right" align="center">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </ElDescriptionsItem>
    </ElDescriptions>
  );
}
