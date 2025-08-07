# Dynamic Form Library

一个灵活的动态表单库，支持条件渲染、表单联动和验证。

## 特性

- 支持多种表单项类型（输入框、单选框、多选框、日期选择器等）
- 支持表单项之间的联动和条件渲染
- 支持表单项的校验规则
- 支持表单项的历史记录
- 支持多种布局方式（单列、双列、Tab 页）
- 支持树形结构的表单项
- 支持表单项的动态增删改
- **框架无关**：使用原生 HTML 元素实现，可以与任何 UI 框架集成

## 安装

```bash
npm install dynamic-form-lib
```

## 基本用法

```vue
<template>
  <dynamic-form
    :form-config="formConfig"
    :form-data="formData"
    :form-items="formItems"
    :tabs="tabs"
    :event-handler="handleFormEvent"
    @form-change="handleFormChange"
    @form-submit="handleFormSubmit"
  />
</template>

<script>
import { DynamicForm, createComponentConfigItem } from 'dynamic-form-lib'

export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      formData: {},
      formConfig: {
        1: createComponentConfigItem({ name: 'module' }),
        2: createComponentConfigItem({
          name: 'InputComponent',
          rules: [{ required: true, message: '请输入姓名' }],
        }),
        3: createComponentConfigItem({
          name: 'RadioComponent',
          options: {
            type: 'static',
            value: [
              { label: '男', value: '1' },
              { label: '女', value: '2' },
            ],
          },
          hasEventDecision: true,
        }),
      },
      formItems: [
        {
          id: '1',
          name: '基本信息',
          component: 'module',
          parentId: null,
          rank: 1,
          level: 1,
        },
        {
          id: '2',
          name: '姓名',
          component: 'InputComponent',
          parentId: '1',
          rank: 1,
          level: 2,
          content: {
            elements: [{ value: '' }],
          },
        },
        {
          id: '3',
          name: '性别',
          component: 'RadioComponent',
          parentId: '1',
          rank: 2,
          level: 2,
          hasEventDecision: true,
          content: {
            elements: [{ value: '' }],
          },
        },
      ],
      tabs: [
        {
          label: '基本信息',
          value: 'basicInfo',
          layout: 'FixedLayout',
          rootId: '1',
        },
      ],
    }
  },
  methods: {
    handleFormEvent({ formItemId, value, formItems }) {
      console.log('表单联动事件', formItemId, value)
      return formItems
    },
    handleFormChange({ id, value, formData }) {
      console.log('表单值变化:', id, value)
      this.formData = formData
    },
    handleFormSubmit(formData) {
      console.log('表单提交:', formData)
    },
  },
}
</script>
```

## 表单配置

表单配置是一个对象，key 为表单项的 ID，value 为表单项的配置：

```javascript
const formConfig = {
  1: createComponentConfigItem({ name: 'module' }),
  2: createComponentConfigItem({
    name: 'InputComponent',
    rules: [{ required: true, message: '请输入姓名' }],
  }),
}
```

## 表单项

表单项是一个数组，每个元素代表一个表单项，具有以下属性：

```javascript
const formItems = [
  {
    id: '1', // 唯一标识
    name: '基本信息', // 表单项名称
    component: 'module', // 组件类型
    parentId: null, // 父级ID，用于构建树形结构
    rank: 1, // 排序
    level: 1, // 层级
    content: {
      // 内容
      elements: [
        { value: '' }, // 值
      ],
    },
  },
]
```

## 自定义样式

库使用了原生 HTML 元素，你可以通过 CSS 自定义样式：

```css
/* 自定义表单样式 */
.dynamic-form-container {
  /* 你的样式 */
}

/* 自定义输入框样式 */
.form-input {
  /* 你的样式 */
}

/* 自定义单选框样式 */
.radio-button {
  /* 你的样式 */
}
```

## 与 UI 框架集成

由于使用了原生 HTML 元素，你可以轻松地与任何 UI 框架集成：

### 与 Element UI 集成

```vue
<template>
  <div>
    <dynamic-form :form-config="formConfig" :form-items="formItems" :tabs="tabs" />
    <el-button type="primary" @click="submitForm">提交</el-button>
  </div>
</template>
```

### 与 Ant Design Vue 集成

```vue
<template>
  <div>
    <dynamic-form :form-config="formConfig" :form-items="formItems" :tabs="tabs" />
    <a-button type="primary" @click="submitForm">提交</a-button>
  </div>
</template>
```

## 更多信息

查看 [FEATURES.md](./FEATURES.md) 了解更多关于动态表单库的特性和优势。

## 许可证

MIT
