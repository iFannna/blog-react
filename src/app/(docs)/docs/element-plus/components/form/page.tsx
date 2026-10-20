import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  FormAccessibility,
  FormAlignment,
  FormBasic,
  FormCustomValidation,
  FormFormItems,
  FormInline,
  FormNumberValidate,
  FormSizeControl,
  FormValidation,
} from "@/components/element-plus/examples/form";

export const metadata: Metadata = { title: "Form 表单组件" };

const SOURCES = {
  basic: `const [form, setForm] = useState({
  name: "", region: "", delivery: false,
  type: [] as string[], resource: "", desc: "",
});

<ElForm model={form} labelWidth="auto" style={{ maxWidth: 600 }}>
  <ElFormItem label="Activity name">
    <ElInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
  </ElFormItem>
  <ElFormItem label="Activity zone">
    <ElSelect
      value={form.region}
      onChange={(v) => setForm({ ...form, region: String(v) })}
      options={[
        { value: "shanghai", label: "Zone one" },
        { value: "beijing", label: "Zone two" },
      ]}
    />
  </ElFormItem>
  <ElFormItem label="Instant delivery">
    <ElSwitch
      checked={form.delivery}
      onCheckedChange={(v) => setForm({ ...form, delivery: v })}
    />
  </ElFormItem>
  <ElFormItem label="Activity type">
    <ElCheckboxGroup
      value={form.type}
      onChange={(v) => setForm({ ...form, type: v as string[] })}
    >
      <ElCheckbox value="Online activities">Online activities</ElCheckbox>
      <ElCheckbox value="Promotion activities">Promotion activities</ElCheckbox>
    </ElCheckboxGroup>
  </ElFormItem>
  <ElFormItem label="Resources">
    <ElRadioGroup
      value={form.resource}
      onChange={(v) => setForm({ ...form, resource: String(v) })}
    >
      <ElRadio value="Sponsor">Sponsor</ElRadio>
      <ElRadio value="Venue">Venue</ElRadio>
    </ElRadioGroup>
  </ElFormItem>
  <ElFormItem label="Activity form">
    <ElInput type="textarea" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
  </ElFormItem>
  <ElFormItem>
    <ElButton type="primary">Create</ElButton>
    <ElButton>Cancel</ElButton>
  </ElFormItem>
</ElForm>`,

  inline: `const [form, setForm] = useState({ user: "", region: "" });

<ElForm inline model={form}>
  <ElFormItem label="Approved by">
    <ElInput value={form.user} onChange={(v) => setForm({ ...form, user: v })} />
  </ElFormItem>
  <ElFormItem label="Activity zone">
    <ElSelect value={form.region} onChange={(v) => setForm({ ...form, region: String(v) })} />
  </ElFormItem>
  <ElFormItem>
    <ElButton type="primary">Query</ElButton>
  </ElFormItem>
</ElForm>`,
  alignment: `const [labelPosition, setLabelPosition] = useState<"left" | "right" | "top">("right");
const [itemLabelPosition, setItemLabelPosition] = useState<"" | "left" | "right" | "top">("");

<ElForm labelPosition={labelPosition} labelWidth="auto" model={form}>
  <ElFormItem label="Form Align" labelPosition="right">{/* ... */}</ElFormItem>
  <ElFormItem label="Name" labelPosition={itemLabelPosition}>
    <ElInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
  </ElFormItem>
</ElForm>`,

  validation: `const formRef = useRef<FormExpose>(null);
const [form, setForm] = useState({ name: "Hello", region: "", desc: "" });

const rules: FormRules = {
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [{ required: true, message: "Please select Activity zone", trigger: "change" }],
  desc: [{ required: true, message: "Please input activity form", trigger: "blur" }],
};

<ElForm
  ref={formRef}
  model={form}
  rules={rules}
  labelWidth="auto"
  onModelChange={(next) => setForm(next as typeof form)}
>
  <ElFormItem label="Activity name" prop="name">
    <ElInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
  </ElFormItem>
  <ElFormItem label="Activity zone" prop="region">
    <ElSelect value={form.region} onChange={(v) => setForm({ ...form, region: String(v) })} />
  </ElFormItem>
  <ElFormItem label="Activity form" prop="desc">
    <ElInput type="textarea" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
  </ElFormItem>
  <ElFormItem>
    <ElButton type="primary" onClick={() => formRef.current?.validate()}>Create</ElButton>
    <ElButton onClick={() => formRef.current?.resetFields()}>Reset</ElButton>
  </ElFormItem>
</ElForm>`,

  customValidation: `const formRef = useRef<FormExpose>(null);
const [form, setForm] = useState({ pass: "", checkPass: "", age: "" as string | number });

const checkAge: FormValidator = (_rule, value, callback) => {
  if (!value) return callback(new Error("Please input the age"));
  window.setTimeout(() => {
    if (!Number.isInteger(value)) callback(new Error("Please input digits"));
    else if (value < 18) callback(new Error("Age must be greater than 18"));
    else callback();
  }, 1000);
};

const validatePass2: FormValidator = (_rule, value, callback) => {
  if (value === "") callback(new Error("Please input the password again"));
  else if (value !== form.pass) callback(new Error("Two inputs don't match!"));
  else callback();
};

const rules = useMemo<FormRules>(() => ({
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  age: [{ validator: checkAge, trigger: "blur" }],
}), [validatePass, validatePass2, checkAge]);

<ElForm
  ref={formRef}
  model={form}
  rules={rules}
  statusIcon
  scrollToError
  labelWidth="auto"
  onModelChange={(next) => setForm(next as typeof form)}
>
  <ElFormItem label="Password" prop="pass">
    <ElInput type="password" value={form.pass} onChange={(v) => setForm({ ...form, pass: v })} />
  </ElFormItem>
  <ElFormItem label="Confirm" prop="checkPass">
    <ElInput type="password" value={form.checkPass} onChange={(v) => setForm({ ...form, checkPass: v })} />
  </ElFormItem>
  <ElFormItem label="Age" prop="age">
    <ElInput value={form.age} onChange={(v) => {
      const next = Number.parseFloat(v);
      setForm({ ...form, age: Number.isNaN(next) ? v : next });
    }} />
  </ElFormItem>
  <ElFormItem>
    <ElButton type="primary" onClick={() => formRef.current?.validate()}>Submit</ElButton>
    <ElButton onClick={() => formRef.current?.resetFields()}>Reset</ElButton>
  </ElFormItem>
</ElForm>`,

  formItems: `const formRef = useRef<FormExpose>(null);
const [form, setForm] = useState({
  email: "",
  domains: [{ key: 1, value: "" }],
});

<ElForm
  ref={formRef}
  model={form}
  labelWidth="auto"
  onModelChange={(next) => setForm(next as typeof form)}
>
  <ElFormItem label="Email" prop="email" rules={EMAIL_RULES}>
    <ElInput value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
  </ElFormItem>

  {form.domains.map((domain, index) => (
    <ElFormItem
      key={domain.key}
      label={\`Domain\${index}\`}
      prop={\`domains.\${index}.value\`}
      rules={DOMAIN_RULES}
    >
      <ElInput value={domain.value} onChange={(v) => updateDomain(domain.key, v)} />
      <ElButton onClick={() => removeDomain(domain.key)}>Delete</ElButton>
    </ElFormItem>
  ))}

  <ElFormItem>
    <ElButton type="primary" onClick={() => formRef.current?.validate()}>Submit</ElButton>
    <ElButton onClick={addDomain}>New domain</ElButton>
    <ElButton onClick={() => formRef.current?.resetFields()}>Reset</ElButton>
  </ElFormItem>
</ElForm>`,

  numberValidate: `const formRef = useRef<FormExpose>(null);
const [form, setForm] = useState({ age: "" as string | number });

const rules: FormItemRule[] = [
  { required: true, message: "age is required" },
  { type: "number", message: "age must be a number" },
];

<ElForm
  ref={formRef}
  model={form}
  labelWidth="auto"
  onModelChange={(next) => setForm(next as typeof form)}
>
  <ElFormItem label="age" prop="age" rules={rules}>
    <ElInput
      value={form.age}
      onChange={(v) => {
        // 对应官方 v-model.number
        const next = Number.parseFloat(v);
        setForm({ age: Number.isNaN(next) ? v : next });
      }}
    />
  </ElFormItem>
  <ElFormItem>
    <ElButton type="primary" onClick={() => formRef.current?.validate()}>Submit</ElButton>
    <ElButton onClick={() => formRef.current?.resetFields()}>Reset</ElButton>
  </ElFormItem>
</ElForm>`,

  size: `const [size, setSize] = useState<"large" | "default" | "small">("default");

<ElForm model={form} size={size} labelWidth="auto" labelPosition={labelPosition}>
  <ElFormItem label="Activity name">
    <ElInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
  </ElFormItem>
  <ElFormItem label="Activity zone">
    <ElSelect value={form.region} onChange={(v) => setForm({ ...form, region: String(v) })} />
  </ElFormItem>
</ElForm>`,

  accessibility: `const [form, setForm] = useState({ fullName: "", firstName: "", lastName: "" });

<ElForm labelPosition="left" labelWidth="auto" model={form}>
  <ElAlert
    type="info"
    showIcon
    closable={false}
    title={'"Full Name" label is automatically attached to the input:'}
  />
  <ElFormItem label="Full Name">
    <ElInput value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
  </ElFormItem>

  <ElAlert
    type="info"
    showIcon
    closable={false}
    title={'"Your Information" serves as a label for the group of inputs.'}
  />
  <ElFormItem label="Your Information">
    <ElRow gutter={20}>
      <ElCol span={12}>
        <ElInput aria-label="First Name" placeholder="First Name" value={form.firstName} />
      </ElCol>
      <ElCol span={12}>
        <ElInput aria-label="Last Name" placeholder="Last Name" value={form.lastName} />
      </ElCol>
    </ElRow>
  </ElFormItem>
</ElForm>`,
};

const API_MD = `
## Form API

### Form Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | ^[object]\`Record<string, any>\` | — |
| rules | 表单校验规则 | ^[object]\`FormRules\` | — |
| inline | 是否行内表单 | ^[boolean] | false |
| label-position | 标签位置，取 left / right 时需同时设置 label-width | ^[enum]\`'left' \\| 'right' \\| 'top'\` | right |
| label-width | 标签宽度，所有直接子 FormItem 继承该值，支持 \`auto\` | ^[string] / ^[number] | '' |
| label-suffix | 标签后缀 | ^[string] | '' |
| hide-required-asterisk | 是否隐藏必填字段标签旁的红色星号 | ^[boolean] | false |
| require-asterisk-position | 星号位置 | ^[enum]\`'left' \\| 'right'\` | left |
| show-message | 是否显示错误信息 | ^[boolean] | true |
| inline-message | 错误信息是否显示为行内样式 | ^[boolean] | false |
| status-icon | 是否显示校验结果图标 | ^[boolean] | false |
| validate-on-rule-change | rules 变化时是否立即触发校验 | ^[boolean] | true |
| size | 表单内组件尺寸 | ^[enum]\`'' \\| 'large' \\| 'default' \\| 'small'\` | — |
| disabled | 是否禁用表单内全部组件 | ^[boolean] | false |
| scroll-to-error | 校验失败时是否滚动到第一个错误项 | ^[boolean] | false |
| scroll-into-view-options | scrollIntoView 的参数 | ^[object]\`ScrollIntoViewOptions\` / ^[boolean] | true |
| onModelChange | React 特有：resetFields 还原后的整个 model 通过该回调交回使用方 | ^[Function]\`(model) => void\` | — |

### Form Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onValidate | 单个表单项校验完成后触发 | ^[Function]\`(prop, isValid, message) => void\` |

### Form Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义默认内容 | \`children\` |

### Form Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 校验整个表单，接收回调或返回 Promise | ^[Function]\`(callback?) => Promise<boolean>\` |
| validateField | 校验指定字段 | ^[Function]\`(props?, callback?) => Promise<boolean>\` |
| resetFields | 重置指定字段并移除校验结果 | ^[Function]\`(props?) => void\` |
| clearValidate | 清除指定字段的校验信息 | ^[Function]\`(props?) => void\` |
| scrollToField | 滚动到指定字段 | ^[Function]\`(prop) => void\` |
| getField | 获取某个字段的上下文 | ^[Function]\`(prop) => FormItemContext \\| undefined\` |
| fields | 全部字段上下文 | ^[array]\`FormItemContext[]\` |
| setInitialValues | 设置字段初值，resetFields 会还原到这些值 | ^[Function]\`(initModel) => void\` |

## FormItem API

### FormItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | model 中的字段路径，可以是字符串或路径数组；校验与重置时必填 | ^[string] / ^[array]\`string[]\` | — |
| label | 标签文本 | ^[string] | — |
| label-position | 标签位置，省略时继承 Form | ^[enum]\`'left' \\| 'right' \\| 'top' \\| ''\` | '' |
| label-width | 标签宽度，支持 \`auto\` | ^[string] / ^[number] | — |
| required | 是否必填，省略时由校验规则决定 | ^[boolean] | undefined |
| rules | 校验规则 | ^[object]\`FormItemRule\` / ^[array]\`FormItemRule[]\` | — |
| error | 手动设置错误信息，设置后立即显示该错误；清空后恢复 | ^[string] | — |
| show-message | 是否显示错误信息 | ^[boolean] | true |
| inline-message | 错误信息是否显示为行内样式 | ^[boolean] | undefined |
| size | 表单项内组件尺寸 | ^[enum]\`'' \\| 'large' \\| 'default' \\| 'small'\` | — |
| for | 同原生 label 的 for | ^[string] | — |
| html-for | \`for\` 的 React 惯用写法，与 \`for\` 等价 | ^[string] | — |
| validate-status | 校验状态 | ^[enum]\`'' \\| 'error' \\| 'validating' \\| 'success'\` | — |

### FormItemRule

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| trigger | 校验触发时机；省略时任意 trigger 都会执行 | ^[enum]\`'blur' \\| 'change'\` / ^[array]\`string[]\` | — |

### FormItem Events

无。

### FormItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 表单项内容 | \`children\` |
| label | 自定义标签内容，参数为当前标签文本 | \`labelSlot: (label) => ReactNode\` |
| error | 自定义错误内容，参数为错误信息 | \`errorSlot: (error) => ReactNode\` |

### FormItem Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| size | 表单项当前尺寸 | ^[string] |
| validateMessage | 当前校验错误信息 | ^[string] |
| validateState | 当前校验状态 | ^[enum]\`'' \\| 'error' \\| 'validating' \\| 'success'\` |
| validate | 校验本项 | ^[Function]\`(trigger, callback?) => Promise<boolean>\` |
| resetField | 重置本项并移除校验结果 | ^[Function]\`() => void\` |
| clearValidate | 清除本项校验状态 | ^[Function]\`() => void\` |
| setInitialValue | 设置本项初值，resetField 会还原到该值 | ^[Function]\`(value) => void\` |
`;

export default function FormPage() {
  return (
    <>
      <h1>Form 表单组件</h1>
      <p>
        由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。
      </p>

      <Heading level={2}>典型表单</Heading>
      <p>
        包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。
        每个 form 组件中都需要 form-item 字段作为输入项的容器。
      </p>
      <DemoBlock source={SOURCES.basic}>
        <FormBasic />
      </DemoBlock>

      <Heading level={2}>行内表单</Heading>
      <p>
        设置 <code>inline</code> 属性可以让表单域变为行内的表单域。
      </p>
      <DemoBlock source={SOURCES.inline}>
        <FormInline />
      </DemoBlock>

      <Heading level={2}>对齐方式</Heading>
      <p>
        通过 <code>labelPosition</code> 控制标签对齐方式，FormItem 上的同名属性优先级更高；
        值为空时使用 Form 的 <code>labelPosition</code>。
      </p>
      <DemoBlock source={SOURCES.alignment}>
        <FormAlignment />
      </DemoBlock>

      <Heading level={2}>表单校验</Heading>
      <p>
        Form 组件提供了表单验证的功能，只需为 <code>rules</code> 属性传入约定的验证规则，
        并将 <code>FormItem</code> 的 <code>prop</code> 属性设置为需校验的字段名即可。
      </p>
      <DemoBlock source={SOURCES.validation}>
        <FormValidation />
      </DemoBlock>

      <Heading level={2}>自定义校验规则</Heading>
      <p>
        本例展示如何自定义校验规则以完成二次密码验证，并用 <code>statusIcon</code>
        展示校验结果图标。自定义校验回调必须被调用；设置 <code>scrollToError</code>
        后校验失败会滚动到第一个错误项。
      </p>
      <DemoBlock source={SOURCES.customValidation}>
        <FormCustomValidation />
      </DemoBlock>

      <Heading level={2}>动态增减表单项</Heading>
      <p>
        除了在 Form 上一次性传递所有校验规则外，也可以动态地为单个表单字段传递或删除规则。
      </p>
      <DemoBlock source={SOURCES.formItems}>
        <FormFormItems />
      </DemoBlock>

      <Heading level={2}>数字类型校验</Heading>
      <p>
        数字校验需要先把输入值转换为数字，再交给{" "}
        <code>type: &apos;number&apos;</code> 规则；
        官方通过 <code>v-model.number</code> 实现，这里在 <code>onChange</code> 中完成转换。
      </p>
      <DemoBlock source={SOURCES.numberValidate}>
        <FormNumberValidate />
      </DemoBlock>

      <Heading level={2}>尺寸控制</Heading>
      <p>
        Form 中所有组件都会继承 <code>size</code> 属性，FormItem 也支持单独设置
        <code>size</code> 进行微调。
      </p>
      <DemoBlock source={SOURCES.size}>
        <FormSizeControl />
      </DemoBlock>

      <Heading level={2}>无障碍</Heading>
      <p>
        当 FormItem 内只有一个输入（或关联控件）时，标签会自动关联到该输入；
        当包含多个输入时，FormItem 会使用 <code>group</code> 角色，
        此时需要自行通过 <code>aria-label</code> 等属性为每个输入添加辅助标签。
      </p>
      <DemoBlock source={SOURCES.accessibility}>
        <FormAccessibility />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
