<template>
  <div class="example-container">
    <h1>动态表单基本示例</h1>
    <dynamic-form
      :form-config="formConfig"
      :form-items="formItems"
      :tabs="tabs"
      :event-handler="handleFormEvent"
      @form-change="handleFormChange"
      @save-form="handleSaveForm"
    />
    <div class="form-actions">
      <button @click="validateForm">校验表单</button>
      <button @click="resetForm">重置表单</button>
      <button @click="submitForm">提交表单</button>
    </div>
    <div class="form-data">
      <h3>表单数据</h3>
      <pre>{{ formDataJson }}</pre>
    </div>
  </div>
</template>

<script>
import { createComponentConfigItem, DynamicForm } from '../src/index'

export default {
  name: 'BasicExample',
  components: {
    DynamicForm,
  },
  data() {
    return {
      formData: {},
      formConfig: {
        // 表单项配置
        1: createComponentConfigItem({ name: 'module' }),
        2: createComponentConfigItem({ name: 'TitleComponent' }),
        3: createComponentConfigItem({
          name: 'InputComponent',
          rules: [{ required: true, message: '请输入姓名' }],
        }),
        4: createComponentConfigItem({
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
        5: createComponentConfigItem({
          name: 'InputComponent',
          rules: [{ required: true, message: '请输入工作单位' }],
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
          name: '个人信息',
          component: 'TitleComponent',
          parentId: '1',
          rank: 1,
          level: 2,
        },
        {
          id: '3',
          name: '姓名',
          component: 'InputComponent',
          parentId: '2',
          rank: 1,
          level: 3,
          content: {
            elements: [{ value: '' }],
          },
        },
        {
          id: '4',
          name: '性别',
          component: 'RadioComponent',
          parentId: '2',
          rank: 2,
          level: 3,
          hasEventDecision: true,
          eventDecisionFormItemIds: ['5'],
          content: {
            elements: [{ value: '' }],
          },
        },
        {
          id: '5',
          name: '工作单位',
          component: 'InputComponent',
          parentId: '2',
          rank: 3,
          level: 3,
          content: {
            elements: [{ value: '' }],
          },
          visible: false,
        },
      ],
      tabs: [
        {
          label: '基本信息',
          value: 'basicInfo',
          layout: 'FixedLayout',
          splitId: '3',
          rootId: '1',
        },
      ],
    }
  },
  computed: {
    formDataJson() {
      return JSON.stringify(this.formData, null, 2)
    },
  },
  methods: {
    handleFormEvent({ formItemId, value, formItems }) {
      // 处理表单联动
      if (formItemId === '4') {
        const workUnitItem = formItems.find((item) => item.id === '5')
        if (workUnitItem) {
          workUnitItem.visible = value === '1'
        }
      }
      return formItems
    },
    handleFormChange({ id, value, formData }) {
      console.log('表单项变化', id, value)
      this.formData = formData
    },
    handleSaveForm(formData) {
      console.log('保存表单', formData)
      this.formData = formData
    },
    validateForm() {
      this.$refs.dynamicForm.validate().then((valid) => {
        if (valid) {
          alert('表单校验通过')
        } else {
          alert('表单校验失败')
        }
      })
    },
    resetForm() {
      this.$refs.dynamicForm.resetFields()
    },
    submitForm() {
      this.$refs.dynamicForm.validate().then((valid) => {
        if (valid) {
          const formData = this.$refs.dynamicForm.getFieldsValue()
          alert('表单提交成功: ' + JSON.stringify(formData))
        } else {
          alert('表单校验失败，请检查表单')
        }
      })
    },
  },
}
</script>

<style scoped>
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.form-actions {
  margin-top: 20px;
}
.form-actions button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #0a70f5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.form-data {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
