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
import { ElSelectV2 } from "@/components/element-plus/select-v2";
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

/** 官方 demo 的 flex gap 以 16px 基准：gap-4 = 16px，gap-2 = 8px，gap-1 = 4px。 */
const row16 = { display: "flex", gap: "16px", alignItems: "center" };
const row8 = { display: "flex", gap: "8px", alignItems: "center" };
const column = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
  flexBasis: "150px",
};
const fullWidth = { width: "100%" as const };

/** 语言切换：ConfigProvider 的 locale 同时作用于分页与表格的内置文案。 */
export function ConfigProviderLocale() {
  const [lang, setLang] = useState<"zh-cn" | "en">("zh-cn");
  const locale = lang === "zh-cn" ? zhCn : en;

  return (
    <div>
      <ElButton
        style={{ marginBottom: "8px" }}
        onClick={() => setLang((v) => (v === "zh-cn" ? "en" : "zh-cn"))}
      >
        Switch Language
      </ElButton>
      <br />
      <ElConfigProvider locale={locale}>
        <ElTable data={[]} style={{ marginBottom: "4px" }} />
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
      <div>
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
          style={{ maxWidth: "150px", marginLeft: "20px" }}
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
      <div style={row16}>
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
    <div>
      Shadow:
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
  const [enableTransition, setEnableTransition] = useState(false);
  const [isObjectTransition, setIsObjectTransition] = useState(false);

  const dialogConfig = useMemo<DialogConfigContext>(
    () => ({
      ...config,
      // 官方对象形态的过渡依赖 Vue 过渡钩子，React 侧仅透传字符串类名
      transition: enableTransition
        ? isObjectTransition
          ? undefined
          : "dialog-bounce"
        : undefined,
    }),
    [config, enableTransition, isObjectTransition],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        justifyContent: "center",
      }}
    >
      <div style={row8}>
        <ElSwitch
          checked={config.alignCenter ?? false}
          onCheckedChange={(v) => setConfig((c) => ({ ...c, alignCenter: v }))}
          activeText="alignCenter"
        />
      </div>
      <div style={row16}>
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
      <div style={row8}>
        <ElSwitch
          checked={enableTransition}
          onCheckedChange={setEnableTransition}
          activeText="enable transition"
        />
        <ElSwitch
          checked={isObjectTransition}
          disabled={!enableTransition}
          onCheckedChange={setIsObjectTransition}
          activeText="transition: object"
          inactiveText="transition: string"
        />
      </div>
      <div style={row8}>
        <ElButton type="primary" size="small" onClick={() => setVisible(true)}>
          Open Dialog
        </ElButton>
      </div>
      <ElConfigProvider dialog={dialogConfig}>
        <ElDialog
          visible={visible}
          onVisibleChange={setVisible}
          title="Dialog Title"
          destroyOnClose
        >
          Dialog Content
        </ElDialog>
      </ElConfigProvider>
      {enableTransition && (
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          {isObjectTransition ? (
            <div>
              Using JavaScript controlled animation:{" "}
              <code>{JSON.stringify({ css: false })}</code>
            </div>
          ) : (
            <div>
              Using string transition name: <code>dialog-bounce</code>
            </div>
          )}
        </div>
      )}
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
  const [value1, setValue1] = useState<string | number | null | undefined>("");
  const [value2, setValue2] = useState<string | number | null | undefined>("");

  const options = [
    { value: "", label: "All" },
    { value: "Option1", label: "Option1" },
    { value: "Option2", label: "Option2" },
    { value: "Option3", label: "Option3" },
    { value: "Option4", label: "Option4" },
    { value: "Option5", label: "Option5" },
  ];

  const handleChange = (v: unknown) => {
    if (v === null || v === undefined) {
      message.info(`The clear value is: ${v}`);
    }
  };

  return (
    <ElConfigProvider valueOnClear={null} emptyValues={[undefined, null]}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        <ElSelect
          value={value1 ?? undefined}
          onChange={(v) => {
            setValue1(v as string);
            handleChange(v);
          }}
          clearable
          placeholder="Select"
          options={options}
          style={{ width: "240px" }}
        />
        <ElSelectV2
          value={value2 ?? undefined}
          onChange={(v) => {
            setValue2(v as string);
            handleChange(v);
          }}
          valueOnClear={() => undefined}
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
    { date: "2016-05-01", name: "Margie Smith", address: "23618 Windsor Drive, West Ricardoview, Idaho" },
  ];

  return (
    <div>
      <div>
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
          style={{ maxWidth: "150px", marginLeft: "20px" }}
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

