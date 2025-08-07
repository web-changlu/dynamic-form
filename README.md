# Dynamic Form

一个灵活的动态表单库，支持条件渲染、表单联动和验证。

## 特性

- 支持多种表单项类型（输入框、单选框、多选框、日期选择器等）
- 支持表单项之间的联动和条件渲染
- 支持表单项的校验规则
- 支持表单项的历史记录
- 支持多种布局方式（单列、双列、Tab 页）
- 支持树形结构的表单项
- 支持表单项的动态增删改

## 安装

```bash
npm install dynamic-form
```

## 基本用法

```vue
<template>
  <dynamic-form
    :form-config="formConfig"
    :form-data="formData"
    @form-change="handleFormChange"
    @form-submit="handleFormSubmit"
  />
</template>

<script>
import { DynamicForm } from 'dynamic-form'

export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      formData: {},
      formConfig: [
        {
          id: '1',
          name: '基本信息',
          component: 'module',
          children: [
            {
              id: '2',
              name: '姓名',
              component: 'InputComponent',
              rules: [{ required: true, message: '请输入姓名' }],
            },
            {
              id: '3',
              name: '性别',
              component: 'RadioComponent',
              options: {
                type: 'static',
                value: [
                  { label: '男', value: '1' },
                  { label: '女', value: '2' },
                ],
              },
            },
          ],
        },
      ],
    }
  },
  methods: {
    handleFormChange(changedValues) {
      console.log('表单值变化:', changedValues)
    },
    handleFormSubmit(formData) {
      console.log('表单提交:', formData)
    },
  },
}
</script>
```

## 表单配置

表单配置是一个数组，每个元素代表一个表单项，具有以下属性：

- `id`: 表单项的唯一标识
- `name`: 表单项的名称
- `component`: 表单项的组件类型
- `rules`: 表单项的校验规则
- `options`: 表单项的选项（用于单选、多选等）
- `children`: 子表单项（用于树形结构）
- `hasEventDecision`: 是否有事件决策（用于表单联动）
- `eventDecisionFormItemIds`: 事件决策影响的表单项 ID 列表

## 表单项类型

- `InputComponent`: 输入框
- `RadioComponent`: 单选框
- `CheckboxComponent`: 多选框
- `DatePickerComponent`: 日期选择器
- `TextComponent`: 文本展示
- `TitleComponent`: 标题
- `TagComponent`: 标签
- `TableComponent`: 表格
- `ListComponent`: 列表
- `TextareaComponent`: 多行文本输入
- `UploadComponent`: 文件上传
- `CascaderComponent`: 级联选择器
- `RadioInputComponent`: 单选框+输入框
- `TagInputComponent`: 标签+输入框

## 布局组件

- `FixedLayout`: 固定双列布局
- `TabsLayout`: 标签页布局

## 事件

- `form-change`: 表单值变化时触发
- `form-submit`: 表单提交时触发
- `form-validate`: 表单校验时触发

## 方法

- `validate()`: 校验表单
- `resetFields()`: 重置表单
- `setFieldsValue(values)`: 设置表单值
- `getFieldsValue()`: 获取表单值

## 高级用法

### 表单联动

```vue
<template>
  <dynamic-form :form-config="formConfig" :form-data="formData" :event-handler="handleFormEvent" />
</template>

<script>
import { DynamicForm } from 'dynamic-form'

export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      formData: {},
      formConfig: [
        {
          id: '1',
          name: '是否有工作',
          component: 'RadioComponent',
          options: {
            type: 'static',
            value: [
              { label: '是', value: '1' },
              { label: '否', value: '0' },
            ],
          },
          hasEventDecision: true,
          eventDecisionFormItemIds: ['2'],
        },
        {
          id: '2',
          name: '工作单位',
          component: 'InputComponent',
          rules: [{ required: true, message: '请输入工作单位' }],
          visible: false,
        },
      ],
    }
  },
  methods: {
    handleFormEvent({ formItemId, value, formItems }) {
      if (formItemId === '1') {
        // 根据"是否有工作"的值决定是否显示"工作单位"
        const workUnitItem = formItems.find((item) => item.id === '2')
        if (workUnitItem) {
          workUnitItem.visible = value === '1'
        }
        return formItems
      }
      return formItems
    },
  },
}
</script>
```

## 许可证

MIT
