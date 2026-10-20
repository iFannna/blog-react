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
      <h1>Form 表单</h1>
      <p>
        表单包含 <code>input</code>、<code>radio</code>、<code>select</code>、
        <code>checkbox</code> 等需要用户输入的组件。使用表单，您可以收集、验证和提交数据。
      </p>

      <DocsContent
        source={`:::tip

Form 组件已经从 2. x 的 Float 布局升级为 Flex 布局。

:::`}
      />

      <Heading level={2}>典型表单</Heading>
      <p>
        最基础的表单包括各种输入表单项，比如<code>input</code>、<code>select</code>、
        <code>radio</code>、<code>checkbox</code>等。
      </p>
      <p>
        在每一个 <code>form</code> 组件中，你需要一个 <code>form-item</code>{" "}
        字段作为输入项的容器，用于获取值与验证值。
      </p>
      <DocsContent
        source={`:::tip

[W3C](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2) 标准定义：

当一个表单中只有一个单行文本输入字段时， 浏览器应当将在此字段中按下 Enter （回车键）的行为视为提交表单的请求。 如果希望阻止这一默认行为，可以在 \`<el-form>\` 标签上添加 \`@submit.prevent\`。

:::`}
      />
      <DemoBlock source={SOURCES.basic}>
        <FormBasic />
      </DemoBlock>

      <Heading level={2}>行内表单</Heading>
      <p>当垂直方向空间受限且表单较简单时，可以在一行内放置表单。</p>
      <p>
        通过设置 <code>inline</code> 属性为 <code>true</code>{" "}
        可以让表单域变为行内的表单域。
      </p>
      <DemoBlock source={SOURCES.inline}>
        <FormInline />
      </DemoBlock>

      <Heading level={2}>对齐方式</Heading>
      <p>根据你们的设计情况，来选择最佳的标签对齐方式。</p>
      <p>
        您可以分别设置 <code>el-form-item</code> 的<code>label-position</code>{" "}
        <span className="docs-version-tag">2.7.7</span>. 如果值为空, 则会使用{" "}
        <code>el-form</code>的<code>label-position</code>。
      </p>
      <p>
        通过设置 <code>label-position</code> 属性可以改变表单域标签的位置，可选值为{" "}
        <code>top</code>、<code>left</code>, 当设为 <code>top</code>{" "}
        时标签会置于表单域的顶部
      </p>
      <DemoBlock source={SOURCES.alignment}>
        <FormAlignment />
      </DemoBlock>

      <Heading level={2}>表单校验</Heading>
      <p>
        Form 组件允许你验证用户的输入是否符合规范，来帮助你找到和纠正错误。
      </p>
      <p>
        <code>Form</code> 组件提供了表单验证的功能，只需为 <code>rules</code>{" "}
        属性传入约定的验证规则，并将 <code>form-Item</code> 的 <code>prop</code>{" "}
        属性设置为需要验证的特殊键值即可。校验规则参见{" "}
        <a href="https://github.com/yiminghe/async-validator">async-validator</a>
      </p>
      <DemoBlock source={SOURCES.validation}>
        <FormValidation />
      </DemoBlock>

      <Heading level={2}>自定义校验规则</Heading>
      <p>这个例子中展示了如何使用自定义验证规则来完成密码的二次验证。</p>
      <p>
        本例还使用<code>status-icon</code>属性为输入框添加了表示校验结果的反馈图标。
      </p>
      <DocsContent
        source={`:::tip

自定义的校验回调函数必须被调用。校验规则参见 [async-validator](https://github.com/yiminghe/async-validator)

:::`}
      />
      <DemoBlock source={SOURCES.customValidation}>
        <FormCustomValidation />
      </DemoBlock>

      <Heading level={2}>添加/删除表单项</Heading>
      <p>
        除了一次通过表单组件上的所有验证规则外. 您也可以动态地通过验证规则或删除单个表单字段的规则。
      </p>
      <DemoBlock source={SOURCES.formItems}>
        <FormFormItems />
      </DemoBlock>

      <Heading level={2}>数字类型验证</Heading>
      <p>
        数字类型的验证需要在 <code>v-model</code> 处加上 <code>.number</code>{" "}
        的修饰符，这是 Vue 自身提供的用于将绑定值转化为 number 类型的修饰符。
      </p>
      <DocsContent
        source={`:::tip

当一个 \`el-form-item\` 嵌套在另一个 \`el-form-item\` 中时，其标签宽度将为 \`0\`。如果需要可以为 \`el-form-item\` 单独设置 \`label-width\` 属性。

:::`}
      />
      <DemoBlock source={SOURCES.numberValidate}>
        <FormNumberValidate />
      </DemoBlock>

      <Heading level={2}>尺寸控制</Heading>
      <p>
        表单中的所有子组件都继承了该表单的 <code>size</code> 属性。同样，form-item
        也有一个 <code>size</code> 属性。
      </p>
      <p>
        如果希望某个表单项或某个表单组件的尺寸不同于 Form 上的 <code>size</code>{" "}
        属性，直接为这个表单项或表单组件设置自己的 size 属性即可。
      </p>
      <DemoBlock source={SOURCES.size}>
        <FormSizeControl />
      </DemoBlock>

      <Heading level={2}>无障碍</Heading>
      <p>
        当在 <code>el-form-item</code>{" "}
        内只有一个输入框（或相关的控制部件，如选择或复选框），表单项的标签将自动附加在那个输入框上。如果{" "}
        <code>el-form-item</code>内有多个 input，则表单项会被设置成{" "}
        <a href="https://www.w3.org/WAI/standards-guidelines/aria/">WAI-ARIA</a>{" "}
        <a href="https://www.w3.org/TR/wai-aria/#group">组</a> 的
        role。在这种情况下，需要手动给每个 input 指定访问标签。
      </p>
      <DemoBlock source={SOURCES.accessibility}>
        <FormAccessibility />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
