"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RuleItem } from "async-validator";
import {
  ElForm,
  ElFormItem,
  type FormExpose,
  type FormItemRule,
  type FormRules,
} from "@/components/element-plus/form";
import { ElInput } from "@/components/element-plus/input";
import { ElSelect } from "@/components/element-plus/select";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElCheckboxGroup, ElCheckbox } from "@/components/element-plus/checkbox";
import { ElRadioGroup, ElRadio } from "@/components/element-plus/radio";
import { ElButton } from "@/components/element-plus/button";
import { ElAlert } from "@/components/element-plus/alert";
import { ElSpace } from "@/components/element-plus/space";
import { ElRow, ElCol } from "@/components/element-plus/row";
import { ElDatePicker } from "@/components/element-plus/date-picker";
import { ElTimePicker } from "@/components/element-plus/time-picker";
import { ElSelectV2 } from "@/components/element-plus/select-v2";
import { ElSegmented } from "@/components/element-plus/segmented";

const formStyle = { maxWidth: 600 };

export function FormBasic() {
  const [form, setForm] = useState({
    name: "",
    region: "",
    date1: null as Date | null,
    date2: null as Date | null,
    delivery: false,
    type: [] as string[],
    resource: "",
    desc: "",
  });

  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  return (
    <ElForm model={form} labelWidth="auto" style={formStyle}>
      <ElFormItem label="Activity name">
        <ElInput value={form.name} onChange={(v) => patch({ name: v })} />
      </ElFormItem>
      <ElFormItem label="Activity zone">
        <ElSelect
          value={form.region}
          onChange={(v) => patch({ region: String(v) })}
          placeholder="please select your zone"
          options={[
            { value: "shanghai", label: "Zone one" },
            { value: "beijing", label: "Zone two" },
          ]}
        />
      </ElFormItem>
      <ElFormItem label="Activity time">
        <ElCol span={11}>
          <ElDatePicker
            value={form.date1}
            onChange={(v) => patch({ date1: v as Date | null })}
            type="date"
            placeholder="Pick a date"
            style={{ width: "100%" }}
          />
        </ElCol>
        <ElCol span={2} style={{ textAlign: "center" }}>
          <span style={{ color: "var(--el-text-color-secondary)" }}>-</span>
        </ElCol>
        <ElCol span={11}>
          <ElTimePicker
            value={form.date2}
            onChange={(v) => patch({ date2: v as Date | null })}
            placeholder="Pick a time"
            style={{ width: "100%" }}
          />
        </ElCol>
      </ElFormItem>
      <ElFormItem label="Instant delivery">
        <ElSwitch
          checked={form.delivery}
          onCheckedChange={(v) => patch({ delivery: v })}
        />
      </ElFormItem>
      <ElFormItem label="Activity type">
        <ElCheckboxGroup
          value={form.type}
          onChange={(v) => patch({ type: v as string[] })}
        >
          {[
            "Online activities",
            "Promotion activities",
            "Offline activities",
            "Simple brand exposure",
          ].map((item) => (
            <ElCheckbox key={item} value={item}>
              {item}
            </ElCheckbox>
          ))}
        </ElCheckboxGroup>
      </ElFormItem>
      <ElFormItem label="Resources">
        <ElRadioGroup
          value={form.resource}
          onChange={(v) => patch({ resource: String(v) })}
        >
          {["Sponsor", "Venue"].map((item) => (
            <ElRadio key={item} value={item}>
              {item}
            </ElRadio>
          ))}
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Activity form">
        <ElInput
          type="textarea"
          value={form.desc}
          onChange={(v) => patch({ desc: v })}
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary">Create</ElButton>
        <ElButton>Cancel</ElButton>
      </ElFormItem>
    </ElForm>
  );
}

export function FormInline() {
  const [form, setForm] = useState({
    user: "",
    region: "",
    date: null as Date | null,
  });
  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  return (
    <ElForm inline model={form}>
      <ElFormItem label="Approved by">
        <ElInput
          value={form.user}
          onChange={(v) => patch({ user: v })}
          placeholder="Approved by"
          style={{ width: 220 }}
          clearable
        />
      </ElFormItem>
      <ElFormItem label="Activity zone">
        <ElSelect
          value={form.region}
          onChange={(v) => patch({ region: String(v) })}
          placeholder="Activity zone"
          style={{ width: 220 }}
          clearable
          options={[
            { value: "shanghai", label: "Zone one" },
            { value: "beijing", label: "Zone two" },
          ]}
        />
      </ElFormItem>
      <ElFormItem label="Activity time">
        <ElDatePicker
          value={form.date}
          onChange={(v) => patch({ date: v as Date | null })}
          type="date"
          placeholder="Pick a date"
          clearable
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary">Query</ElButton>
      </ElFormItem>
    </ElForm>
  );
}

const RULES: FormRules = {
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    { required: true, message: "Please select Activity zone", trigger: "change" },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
};

const VALIDATION_RULES: FormRules = {
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    { required: true, message: "Please select Activity zone", trigger: "change" },
  ],
  count: [
    { required: true, message: "Please select Activity count", trigger: "change" },
  ],
  date1: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
  location: [
    { required: true, message: "Please select a location", trigger: "change" },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
};

const VALIDATION_OPTIONS = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));

export function FormValidation() {
  const formRef = useRef<FormExpose>(null);
  const [form, setForm] = useState({
    name: "Hello",
    region: "",
    count: "",
    date1: null as Date | null,
    date2: null as Date | null,
    delivery: false,
    location: "",
    type: [] as string[],
    resource: "",
    desc: "",
  });
  const [result, setResult] = useState("");

  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  const submit = async () => {
    try {
      const ok = await formRef.current!.validate();
      setResult(ok ? "submit!" : "not valid");
    } catch (fields) {
      setResult(`error submit! ${JSON.stringify(Object.keys(fields as object))}`);
    }
  };

  return (
    <ElForm
      ref={formRef}
      model={form}
      rules={VALIDATION_RULES}
      labelWidth="auto"
      style={formStyle}
      // resetFields 在 React 里把还原后的 model 交回使用方
      onModelChange={(next) => setForm(next as typeof form)}
    >
      <ElFormItem label="Activity name" prop="name">
        <ElInput value={form.name} onChange={(v) => patch({ name: v })} />
      </ElFormItem>
      <ElFormItem label="Activity zone" prop="region">
        <ElSelect
          value={form.region}
          onChange={(v) => patch({ region: String(v) })}
          placeholder="Activity zone"
          options={[
            { value: "shanghai", label: "Zone one" },
            { value: "beijing", label: "Zone two" },
          ]}
        />
      </ElFormItem>
      <ElFormItem label="Activity count" prop="count">
        <ElSelectV2
          value={form.count}
          onChange={(v) => patch({ count: String(v ?? "") })}
          placeholder="Activity count"
          options={VALIDATION_OPTIONS}
        />
      </ElFormItem>
      <ElFormItem label="Activity time" required>
        <ElCol span={11}>
          <ElFormItem prop="date1">
            <ElDatePicker
              value={form.date1}
              onChange={(v) => patch({ date1: v as Date | null })}
              type="date"
              aria-label="Pick a date"
              placeholder="Pick a date"
              style={{ width: "100%" }}
            />
          </ElFormItem>
        </ElCol>
        <ElCol span={2} style={{ textAlign: "center" }}>
          <span style={{ color: "var(--el-text-color-secondary)" }}>-</span>
        </ElCol>
        <ElCol span={11}>
          <ElFormItem prop="date2">
            <ElTimePicker
              value={form.date2}
              onChange={(v) => patch({ date2: v as Date | null })}
              aria-label="Pick a time"
              placeholder="Pick a time"
              style={{ width: "100%" }}
            />
          </ElFormItem>
        </ElCol>
      </ElFormItem>
      <ElFormItem label="Instant delivery" prop="delivery">
        <ElSwitch
          checked={form.delivery}
          onCheckedChange={(v) => patch({ delivery: v })}
        />
      </ElFormItem>
      <ElFormItem label="Activity location" prop="location">
        <ElSegmented
          value={form.location}
          onChange={(v) => patch({ location: String(v) })}
          options={["Home", "Company", "School"]}
        />
      </ElFormItem>
      <ElFormItem label="Activity type" prop="type">
        <ElCheckboxGroup
          value={form.type}
          onChange={(v) => patch({ type: v as string[] })}
        >
          {[
            "Online activities",
            "Promotion activities",
            "Offline activities",
            "Simple brand exposure",
          ].map((item) => (
            <ElCheckbox key={item} value={item}>
              {item}
            </ElCheckbox>
          ))}
        </ElCheckboxGroup>
      </ElFormItem>
      <ElFormItem label="Resources" prop="resource">
        <ElRadioGroup
          value={form.resource}
          onChange={(v) => patch({ resource: String(v) })}
        >
          {["Sponsorship", "Venue"].map((item) => (
            <ElRadio key={item} value={item}>
              {item}
            </ElRadio>
          ))}
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Activity form" prop="desc">
        <ElInput
          type="textarea"
          value={form.desc}
          onChange={(v) => patch({ desc: v })}
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" onClick={submit}>Create</ElButton>
        <ElButton onClick={() => formRef.current?.resetFields()}>
          Reset
        </ElButton>
      </ElFormItem>
      {result && <p style={{ color: "var(--el-color-info)" }}>{result}</p>}
    </ElForm>
  );
}

export function FormAlignment() {
  const [labelPosition, setLabelPosition] = useState<"left" | "right" | "top">(
    "right",
  );
  const [itemLabelPosition, setItemLabelPosition] = useState<
    "" | "left" | "right" | "top"
  >("");
  const [form, setForm] = useState({ name: "", region: "", type: "" });
  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  return (
    <ElForm
      labelPosition={labelPosition}
      labelWidth="auto"
      model={form}
      style={formStyle}
    >
      <ElFormItem label="Form Align" labelPosition="right">
        <ElRadioGroup
          value={labelPosition}
          onChange={(v) =>
            setLabelPosition(v as "left" | "right" | "top")
          }
          ariaLabel="label position"
        >
          <ElRadio button value="left">Left</ElRadio>
          <ElRadio button value="right">Right</ElRadio>
          <ElRadio button value="top">Top</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Form Item Align" labelPosition="right">
        <ElRadioGroup
          value={itemLabelPosition}
          onChange={(v) =>
            setItemLabelPosition(v as "" | "left" | "right" | "top")
          }
          ariaLabel="item label position"
        >
          <ElRadio button value="">Empty</ElRadio>
          <ElRadio button value="left">Left</ElRadio>
          <ElRadio button value="right">Right</ElRadio>
          <ElRadio button value="top">Top</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="Name" labelPosition={itemLabelPosition}>
        <ElInput value={form.name} onChange={(v) => patch({ name: v })} />
      </ElFormItem>
      <ElFormItem label="Activity zone" labelPosition={itemLabelPosition}>
        <ElInput value={form.region} onChange={(v) => patch({ region: v })} />
      </ElFormItem>
      <ElFormItem label="Activity form" labelPosition={itemLabelPosition}>
        <ElInput value={form.type} onChange={(v) => patch({ type: v })} />
      </ElFormItem>
    </ElForm>
  );
}

export function FormSizeControl() {
  const [size, setSize] = useState<"large" | "default" | "small">("default");
  const [labelPosition, setLabelPosition] = useState<"left" | "right" | "top">(
    "right",
  );
  const [form, setForm] = useState({
    name: "",
    region: "",
    date1: null as Date | null,
    date2: null as Date | null,
    delivery: false,
    type: [] as string[],
    resource: "",
    desc: "",
  });
  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  return (
    <>
      <div>
        <ElRadioGroup
          value={size}
          onChange={(v) =>
            setSize(v as "large" | "default" | "small")
          }
          ariaLabel="size control"
          style={{ marginRight: 12 }}
        >
          <ElRadio button value="large">large</ElRadio>
          <ElRadio button value="default">default</ElRadio>
          <ElRadio button value="small">small</ElRadio>
        </ElRadioGroup>
        <ElRadioGroup
          value={labelPosition}
          onChange={(v) =>
            setLabelPosition(v as "left" | "right" | "top")
          }
          ariaLabel="position control"
          style={{ marginRight: 12 }}
        >
          <ElRadio button value="left">Left</ElRadio>
          <ElRadio button value="right">Right</ElRadio>
          <ElRadio button value="top">Top</ElRadio>
        </ElRadioGroup>
      </div>
      <br />
      <ElForm
        model={form}
        size={size}
        labelPosition={labelPosition}
        labelWidth="auto"
        style={formStyle}
      >
        <ElFormItem label="Activity name">
          <ElInput value={form.name} onChange={(v) => patch({ name: v })} />
        </ElFormItem>
        <ElFormItem label="Activity zone">
          <ElSelect
            value={form.region}
            onChange={(v) => patch({ region: String(v) })}
            placeholder="please select your zone"
            options={[
              { value: "shanghai", label: "Zone one" },
              { value: "beijing", label: "Zone two" },
            ]}
          />
        </ElFormItem>
        <ElFormItem label="Activity time">
          <ElCol span={11}>
            <ElDatePicker
              value={form.date1}
              onChange={(v) => patch({ date1: v as Date | null })}
              type="date"
              aria-label="Pick a date"
              placeholder="Pick a date"
              style={{ width: "100%" }}
            />
          </ElCol>
          <ElCol
            span={1}
            style={{ margin: "0 8px", textAlign: "center" }}
          >
            -
          </ElCol>
          <ElCol span={11}>
            <ElTimePicker
              value={form.date2}
              onChange={(v) => patch({ date2: v as Date | null })}
              aria-label="Pick a time"
              placeholder="Pick a time"
              style={{ width: "100%" }}
            />
          </ElCol>
        </ElFormItem>
        <ElFormItem label="Activity type">
          <ElCheckboxGroup
            value={form.type}
            onChange={(v) => patch({ type: v as string[] })}
          >
            <ElCheckbox button value="Online activities" name="type">
              Online activities
            </ElCheckbox>
            <ElCheckbox button value="Promotion activities" name="type">
              Promotion activities
            </ElCheckbox>
          </ElCheckboxGroup>
        </ElFormItem>
        <ElFormItem label="Resources">
          <ElRadioGroup
            value={form.resource}
            onChange={(v) => patch({ resource: String(v) })}
          >
            <ElRadio border value="Sponsor">Sponsor</ElRadio>
            <ElRadio border value="Venue">Venue</ElRadio>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary">Create</ElButton>
          <ElButton>Cancel</ElButton>
        </ElFormItem>
      </ElForm>
    </>
  );
}

export function FormAccessibility() {
  const [form, setForm] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
  });
  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  return (
    <ElForm
      labelPosition="left"
      labelWidth="auto"
      model={form}
      style={formStyle}
    >
      <ElSpace fill>
        <ElAlert
          type="info"
          showIcon
          closable={false}
          description={<>&quot;Full Name&quot; label is automatically attached to the input:</>}
        />
        <ElFormItem label="Full Name">
          <ElInput
            value={form.fullName}
            onChange={(v) => patch({ fullName: v })}
          />
        </ElFormItem>
      </ElSpace>

      <ElSpace fill>
        <ElAlert
          type="info"
          showIcon
          closable={false}
          description={
            <>
              &quot;Your Information&quot; serves as a label for the group of inputs.{" "}
              <br />
              You must specify labels on the individal inputs. Placeholders are
              not replacements for using the &quot;label&quot; attribute.
            </>
          }
        />
        <ElFormItem label="Your Information">
          <ElRow gutter={20}>
            <ElCol span={12}>
              <ElInput
                aria-label="First Name"
                placeholder="First Name"
                value={form.firstName}
                onChange={(v) => patch({ firstName: v })}
              />
            </ElCol>
            <ElCol span={12}>
              <ElInput
                aria-label="Last Name"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(v) => patch({ lastName: v })}
              />
            </ElCol>
          </ElRow>
        </ElFormItem>
      </ElSpace>
    </ElForm>
  );
}

type FormValidator = NonNullable<RuleItem["validator"]>;

export function FormCustomValidation() {
  const formRef = useRef<FormExpose>(null);
  const [form, setForm] = useState<{
    pass: string;
    checkPass: string;
    age: string | number;
  }>({ pass: "", checkPass: "", age: "" });
  const [result, setResult] = useState("");

  // 校验器要保持引用稳定，否则 rules 每次渲染都是新对象，会触发 validateOnRuleChange
  const formValueRef = useRef(form);
  useEffect(() => {
    formValueRef.current = form;
  }, [form]);

  const patch = (patchValue: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patchValue }));

  const checkAge = useCallback<FormValidator>((_rule, value, callback) => {
    if (!value) {
      callback(new Error("Please input the age"));
      return;
    }
    // 官方示例用 1 秒模拟异步远程校验
    window.setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error("Please input digits"));
      } else if (value < 18) {
        callback(new Error("Age must be greater than 18"));
      } else {
        callback();
      }
    }, 1000);
  }, []);

  const validatePass = useCallback<FormValidator>(
    (_rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
        return;
      }
      // 密码变化时联动校验确认密码
      if (formValueRef.current.checkPass !== "") {
        formRef.current?.validateField("checkPass").catch(() => {});
      }
      callback();
    },
    [],
  );

  const validatePass2 = useCallback<FormValidator>((_rule, value, callback) => {
    if (value === "") {
      callback(new Error("Please input the password again"));
    } else if (value !== formValueRef.current.pass) {
      callback(new Error("Two inputs don't match!"));
    } else {
      callback();
    }
  }, []);

  const rules = useMemo<FormRules>(
    () => ({
      pass: [{ validator: validatePass, trigger: "blur" }],
      checkPass: [{ validator: validatePass2, trigger: "blur" }],
      age: [{ validator: checkAge, trigger: "blur" }],
    }),
    [checkAge, validatePass, validatePass2],
  );

  const submit = () => {
    formRef.current?.validate((valid) => {
      setResult(valid ? "submit!" : "error submit!");
    });
  };

  return (
    <ElForm
      ref={formRef}
      model={form}
      rules={rules}
      labelWidth="auto"
      statusIcon
      scrollToError
      style={formStyle}
      onModelChange={(next) => setForm(next as typeof form)}
    >
      <ElFormItem label="Password" prop="pass">
        <ElInput
          type="password"
          autoComplete="off"
          value={form.pass}
          onChange={(v) => patch({ pass: v })}
        />
      </ElFormItem>
      <ElFormItem label="Confirm" prop="checkPass">
        <ElInput
          type="password"
          autoComplete="off"
          value={form.checkPass}
          onChange={(v) => patch({ checkPass: v })}
        />
      </ElFormItem>
      <ElFormItem label="Age" prop="age">
        <ElInput
          value={form.age}
          onChange={(v) => {
            // 对应官方 v-model.number：能解析成数字时写入 number
            const next = Number.parseFloat(v);
            patch({ age: Number.isNaN(next) ? v : next });
          }}
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" onClick={submit}>Submit</ElButton>
        <ElButton onClick={() => formRef.current?.resetFields()}>
          Reset
        </ElButton>
      </ElFormItem>
      {result && <p style={{ color: "var(--el-color-info)" }}>{result}</p>}
    </ElForm>
  );
}

interface DomainItem {
  key: number;
  value: string;
}

const EMAIL_RULES: FormItemRule[] = [
  { required: true, message: "Please input email address", trigger: "blur" },
  {
    type: "email",
    message: "Please input correct email address",
    trigger: ["blur", "change"],
  },
];

const DOMAIN_RULES: FormItemRule[] = [
  { required: true, message: "domain can not be null", trigger: "blur" },
];

export function FormFormItems() {
  const formRef = useRef<FormExpose>(null);
  const [form, setForm] = useState<{ email: string; domains: DomainItem[] }>({
    email: "",
    domains: [{ key: 1, value: "" }],
  });
  const nextKeyRef = useRef(2);
  const [result, setResult] = useState("");

  const updateDomain = (key: number, value: string) =>
    setForm((prev) => ({
      ...prev,
      domains: prev.domains.map((item) =>
        item.key === key ? { ...item, value } : item,
      ),
    }));

  const removeDomain = (key: number) =>
    setForm((prev) => ({
      ...prev,
      domains: prev.domains.filter((item) => item.key !== key),
    }));

  const addDomain = () =>
    setForm((prev) => ({
      ...prev,
      domains: [
        ...prev.domains,
        { key: nextKeyRef.current++, value: "" },
      ],
    }));

  const submit = () => {
    formRef.current?.validate((valid) => {
      setResult(valid ? "submit!" : "error submit!");
    });
  };

  return (
    <ElForm
      ref={formRef}
      model={form}
      labelWidth="auto"
      style={formStyle}
      onModelChange={(next) => setForm(next as typeof form)}
    >
      <ElFormItem label="Email" prop="email" rules={EMAIL_RULES}>
        <ElInput
          value={form.email}
          onChange={(v) => setForm((prev) => ({ ...prev, email: v }))}
        />
      </ElFormItem>

      {form.domains.map((domain, index) => (
        <ElFormItem
          key={domain.key}
          label={`Domain${index}`}
          prop={`domains.${index}.value`}
          rules={DOMAIN_RULES}
        >
          <ElInput
            value={domain.value}
            onChange={(v) => updateDomain(domain.key, v)}
          />
          <ElButton
            style={{ marginTop: 8 }}
            onClick={() => removeDomain(domain.key)}
          >
            Delete
          </ElButton>
        </ElFormItem>
      ))}

      <ElFormItem>
        <ElButton type="primary" onClick={submit}>Submit</ElButton>
        <ElButton onClick={addDomain}>New domain</ElButton>
        <ElButton onClick={() => formRef.current?.resetFields()}>
          Reset
        </ElButton>
      </ElFormItem>
      {result && <p style={{ color: "var(--el-color-info)" }}>{result}</p>}
    </ElForm>
  );
}

const NUMBER_RULES: FormItemRule[] = [
  { required: true, message: "age is required" },
  { type: "number", message: "age must be a number" },
];

export function FormNumberValidate() {
  const formRef = useRef<FormExpose>(null);
  const [form, setForm] = useState<{ age: string | number }>({ age: "" });
  const [result, setResult] = useState("");

  const submit = () => {
    formRef.current?.validate((valid) => {
      setResult(valid ? "submit!" : "error submit!");
    });
  };

  return (
    <ElForm
      ref={formRef}
      model={form}
      labelWidth="auto"
      style={formStyle}
      onModelChange={(next) => setForm(next as typeof form)}
    >
      <ElFormItem label="age" prop="age" rules={NUMBER_RULES}>
        <ElInput
          value={form.age}
          autoComplete="off"
          onChange={(v) => {
            const next = Number.parseFloat(v);
            setForm({ age: Number.isNaN(next) ? v : next });
          }}
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" onClick={submit}>Submit</ElButton>
        <ElButton onClick={() => formRef.current?.resetFields()}>
          Reset
        </ElButton>
      </ElFormItem>
      {result && <p style={{ color: "var(--el-color-info)" }}>{result}</p>}
    </ElForm>
  );
}
