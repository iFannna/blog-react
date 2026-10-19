"use client";

import { useMemo, useState } from "react";
import { ElConfigProvider } from "@/components/element-plus/config-provider";
import { ElButton } from "@/components/element-plus/button";
import { ElCheckbox } from "@/components/element-plus/checkbox";
import { ElCard } from "@/components/element-plus/card";
import { ElDivider } from "@/components/element-plus/divider";
import { ElDialog } from "@/components/element-plus/dialog";
import { ElLink } from "@/components/element-plus/link";
import { ElSelect } from "@/components/element-plus/select";
import { ElPagination } from "@/components/element-plus/pagination";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElSwitch } from "@/components/element-plus/switch";
import { message } from "@/components/element-plus/message";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import { en, zhCn } from "@/components/element-plus/config-provider/locales";
import type {
  ButtonConfigContext,
  DialogConfigContext,
  LinkConfigContext,
  TableConfigContext,
} from "@/components/element-plus/config-provider";

const row = { display: "flex", gap: "1.2rem", flexWrap: "wrap" as const, alignItems: "center" };
const column = { display: "flex", flexDirection: "column" as const, gap: "0.4rem", width: "150px" };
const fullWidth = { width: "100%" as const };

/** 语言切换：ConfigProvider 的 locale 同时作用于分页与表格的内置文案。 */
export function ConfigProviderLocale() {
  const [lang, setLang] = useState<"zh-cn" | "en">("zh-cn");
  const locale = lang === "zh-cn" ? zhCn : en;

  return (
    <div>
      <ElButton onClick={() => setLang((v) => (v === "zh-cn" ? "en" : "zh-cn"))}>
        切换语言
      </ElButton>
      <ElDivider />
      <ElConfigProvider locale={locale}>
        <ElTable data={[]} style={{ marginBottom: "1rem" }}>
          <ElTableColumn prop="name" label="Name" />
        </ElTable>
        <ElPagination total={100} />
      </ElConfigProvider>
    </div>
  );
}

/** button 配置：type / plain / round / text / dashed / autoInsertSpace 从全局下发。 */
export function ConfigProviderButton() {
  const [config, setConfig] = useState<ButtonConfigContext>({
    autoInsertSpace: true,
    type: "default",
    plain: true,
    round: true,
    text: false,
    dashed: false,
  });

  const buttonTypes = ["default", "primary", "success", "warning", "info", "danger"] as const;

  return (
    <div>
      <div style={row}>
        <ElCheckbox
          checked={config.autoInsertSpace}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, autoInsertSpace: v }))}
        >
          autoInsertSpace
        </ElCheckbox>
        <ElCheckbox
          checked={config.plain}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, plain: v }))}
        >
          plain
        </ElCheckbox>
        <ElCheckbox
          checked={config.round}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, round: v }))}
        >
          round
        </ElCheckbox>
        <ElCheckbox
          checked={config.dashed}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, dashed: v }))}
        >
          dashed
        </ElCheckbox>
        <ElCheckbox
          checked={config.text}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, text: v }))}
        >
          text
        </ElCheckbox>
        <ElSelect
          value={config.type ?? "default"}
          onChange={(v) => setConfig((c) => ({ ...c, type: v as ButtonConfigContext["type"] }))}
          options={buttonTypes.map((t) => ({ value: t, label: t }))}
          style={{ maxWidth: "150px" }}
        />
      </div>
      <ElDivider />
      <ElConfigProvider button={config}>
        <ElButton>中文</ElButton>
      </ElConfigProvider>
    </div>
  );
}

/** link 配置：type / underline 从全局下发。 */
export function ConfigProviderLink() {
  const [config, setConfig] = useState<LinkConfigContext>({
    type: "success",
    underline: "always",
  });

  const linkTypes = ["primary", "success", "warning", "info", "danger", "default"] as const;
  const underlineOptions = ["always", "never", "hover"] as const;

  return (
    <div>
      <div style={row}>
        <div style={column}>
          <span>Type:</span>
          <ElSelect
            value={config.type ?? "success"}
            onChange={(v) => setConfig((c) => ({ ...c, type: v as LinkConfigContext["type"] }))}
            options={linkTypes.map((t) => ({ value: t, label: t }))}
          />
        </div>
        <div style={column}>
          <span>Underline:</span>
          <ElSelect
            value={config.underline ?? "always"}
            onChange={(v) =>
              setConfig((c) => ({ ...c, underline: v as LinkConfigContext["underline"] }))
            }
            options={underlineOptions.map((t) => ({ value: t, label: t }))}
          />
        </div>
      </div>
      <ElDivider />
      <ElConfigProvider link={config}>
        <ElLink>Link desu!</ElLink>
      </ElConfigProvider>
    </div>
  );
}

/** card 配置：shadow 从全局下发。 */
export function ConfigProviderCard() {
  const [shadow, setShadow] = useState<"always" | "hover" | "never">("always");
  const config = useMemo(() => ({ shadow }), [shadow]);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      Shadow:
      <ElRadioGroup
        value={shadow}
        onChange={(v) => setShadow(v as "always" | "hover" | "never")}
      >
        <ElRadio value="always" label="always" />
        <ElRadio value="hover" label="hover" />
        <ElRadio value="never" label="never" />
      </ElRadioGroup>
      <ElDivider />
      <ElConfigProvider card={config}>
        <ElCard>Card desu!</ElCard>
      </ElConfigProvider>
    </div>
  );
}

/** dialog 配置：alignCenter / draggable / overflow 从全局下发。 */
export function ConfigProviderDialog() {
  const [config, setConfig] = useState<DialogConfigContext>({
    alignCenter: false,
    draggable: false,
    overflow: false,
  });
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <div style={row}>
        <ElSwitch
          checked={config.alignCenter ?? false}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, alignCenter: v }))}
          activeText="alignCenter"
        />
      </div>
      <div style={row}>
        <ElSwitch
          checked={config.draggable ?? false}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, draggable: v }))}
          activeText="draggable"
        />
        <ElSwitch
          checked={config.overflow ?? false}
          disabled={!config.draggable}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, overflow: v }))}
          activeText="overflow"
        />
      </div>
      <div style={row}>
        <ElButton type="primary" size="small" onClick={() => setVisible(true)}>
          Open Dialog
        </ElButton>
      </div>
      <ElConfigProvider dialog={config}>
        <ElDialog visible={visible} onVisibleChange={setVisible} title="Dialog Title">
          Dialog Content
        </ElDialog>
      </ElConfigProvider>
    </div>
  );
}

/** message 配置：max / plain / placement 从全局下发，作用于命令式的 message()。 */
export function ConfigProviderMessage() {
  const config = useMemo(() => ({ max: 3, plain: true, placement: "bottom" }), []);

  return (
    <ElConfigProvider message={config}>
      <ElButton onClick={() => message("This is a message from bottom.")}>OPEN</ElButton>
    </ElConfigProvider>
  );
}

/** empty-values / value-on-clear：清空后写回指定值。 */
export function ConfigProviderEmptyValues() {
  // 初始值为空字符串：空值集合设为 [undefined, null] 后，空字符串是有意义的值
  const [value, setValue] = useState<string | number | null | undefined>("");

  const options = [
    { value: "", label: "All" },
    { value: "Option1", label: "Option1" },
    { value: "Option2", label: "Option2" },
    { value: "Option3", label: "Option3" },
    { value: "Option4", label: "Option4" },
    { value: "Option5", label: "Option5" },
  ];

  return (
    <ElConfigProvider valueOnClear={null} emptyValues={[undefined, null]}>
      <div style={row}>
        <ElSelect
          value={value ?? undefined}
          onChange={(v) => {
            setValue(v as string);
            if (v === null || v === undefined) {
              message.info(`The clear value is: ${v}`);
            }
          }}
          clearable
          placeholder="Select"
          options={options}
          style={{ width: "240px" }}
        />
      </div>
    </ElConfigProvider>
  );
}

/** table 配置：showOverflowTooltip / tooltipEffect 从全局下发到所有列。 */
export function ConfigProviderTable() {
  const [config, setConfig] = useState<TableConfigContext>({
    showOverflowTooltip: true,
    tooltipEffect: "dark",
  });

  const tableData = [
    { date: "2016-05-04", name: "Aleyna Kutzner", address: "Lohrbergstr. 86c, Süd Lilli, Saarland" },
    { date: "2016-05-03", name: "Helen Jacobi", address: "760 A Street, South Frankfield, Illinois" },
    { date: "2016-05-02", name: "Brandon Deckert", address: "Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen" },
  ];

  return (
    <div>
      <div style={row}>
        <ElCheckbox
          checked={config.showOverflowTooltip}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, showOverflowTooltip: v }))}
        >
          showOverflowTooltip
        </ElCheckbox>
        <ElSelect
          value={config.tooltipEffect ?? "dark"}
          onChange={(v) =>
            setConfig((c) => ({ ...c, tooltipEffect: v as "dark" | "light" }))
          }
          options={[
            { value: "dark", label: "dark" },
            { value: "light", label: "light" },
          ]}
          style={{ maxWidth: "150px" }}
        />
      </div>
      <ElDivider />
      <ElConfigProvider table={config}>
        <ElTable data={tableData} style={fullWidth}>
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn prop="date" label="Date" width="120" />
          <ElTableColumn prop="name" label="Name" width="120" />
          <ElTableColumn
            prop="address"
            label="Address (inherited from config-provider)"
            width="300"
          />
          <ElTableColumn
            prop="address"
            label="Address (explicit false)"
            showOverflowTooltip={false}
          />
        </ElTable>
      </ElConfigProvider>
    </div>
  );
}

