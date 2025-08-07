<template>
  <div class="dynamic-form-container">
    <mtd-form ref="dynamicFormRef" scroll-to-first-error :model="formData" :disabled="noEditPermissions">
      <mtd-tabs v-model="activeName" type="border-card">
        <mtd-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :value="tab.value">
          <component
            :is="tab.layout"
            :form-config="tabsConfig[tab.value]"
            :form-data="formData"
            :no-edit-permissions="noEditPermissions"
            :biz-serial-no="bizSerialNo"
            :split-id="tab.splitId"
          />
        </mtd-tab-pane>
      </mtd-tabs>
    </mtd-form>
    <!-- 历史记录组件 -->
    <slot name="history-record" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'

import {
  DATE_PICKER_LIST_ENUM,
  MULTIPLE_ELEMENT_FORM_ITEM_LIST_ENUM,
  NO_EDIT_FORM_ITEM_LIST_ENUM,
  PADDING_ENUM,
  SINGLE_ELEMENT_FORM_ITEM_LIST_ENUM,
  SINGLE_ELEMENT_FORM_ITEM_VALUE_ARRAY_LIST_ENUM,
} from '../constants/formConstants'
import { formatFormConfig, formatFormData, transformContent } from '../utils/formUtils'
import { addSequence, buildTree, flattenTree, splitArrayByTreeStructure } from '../utils/treeUtils'
import FixedLayout from './FormLayouts/FixedLayout.vue'
import TabsLayout from './FormLayouts/TabsLayout.vue'

export default {
  name: 'DynamicForm',
  components: {
    FixedLayout,
    TabsLayout,
  },
  provide() {
    return {
      updateFormConfig: this.updateFormConfig,
      showHistory: this.showHistory,
      saveForm: this.saveForm,
      validateItem: this.validateItem,
    }
  },
  props: {
    // 表单配置
    formConfig: {
      type: Object,
      default: () => ({}),
    },
    // 表单数据
    value: {
      type: Object,
      default: () => ({}),
    },
    // 表单项
    formItems: {
      type: Array,
      default: () => [],
    },
    // 是否禁用编辑
    noEditPermissions: {
      type: Boolean,
      default: false,
    },
    // 业务流水号
    bizSerialNo: {
      type: String,
      default: '',
    },
    // 标签页配置
    tabs: {
      type: Array,
      default: () => [{ label: '标签页1', value: 'tab1', layout: 'FixedLayout', splitId: '1' }],
    },
    // 事件处理器
    eventHandler: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      activeName: this.tabs[0]?.value || 'tab1',
      formItemRes: this.formItems,
      tabsConfig: {},
      formData: {},
      NO_EDIT_FORM_ITEM_LIST_ENUM,
      SINGLE_ELEMENT_FORM_ITEM_LIST_ENUM,
      SINGLE_ELEMENT_FORM_ITEM_VALUE_ARRAY_LIST_ENUM,
      DATE_PICKER_LIST_ENUM,
      MULTIPLE_ELEMENT_FORM_ITEM_LIST_ENUM,
    }
  },
  watch: {
    formItems: {
      handler(newVal) {
        this.formItemRes = newVal
        this.initForm()
      },
      deep: true,
    },
    value: {
      handler(newVal) {
        this.formData = { ...newVal }
      },
      deep: true,
    },
  },
  created() {
    this.formData = cloneDeep(this.value)
    this.initForm()
  },
  methods: {
    initForm() {
      const allConfig = this.splitArrayByTreeStructure(this.formItemRes)

      // 初始化每个标签页的配置
      this.tabs.forEach((tab) => {
        const rootId = tab.rootId
        if (rootId && allConfig[rootId]) {
          this.tabsConfig[tab.value] = this.formatFormConfig(allConfig[rootId])
          this.formatFormData(this.tabsConfig[tab.value])
        } else {
          this.tabsConfig[tab.value] = []
        }
      })
    },
    splitArrayByTreeStructure(list) {
      return splitArrayByTreeStructure(list)
    },
    formatFormConfig(list = []) {
      const formItemRes = cloneDeep(list)
      const tree = buildTree(formItemRes)
      addSequence(tree)
      const indexTree = flattenTree(tree)
      return formatFormConfig(indexTree, this.formConfig, PADDING_ENUM)
    },
    formatFormData(formItemList) {
      formatFormData(formItemList, this.formData, (item, direction, formData) => {
        return transformContent(item, direction, formData, null, {
          NO_EDIT_FORM_ITEM_LIST_ENUM,
          SINGLE_ELEMENT_FORM_ITEM_LIST_ENUM,
          SINGLE_ELEMENT_FORM_ITEM_VALUE_ARRAY_LIST_ENUM,
          DATE_PICKER_LIST_ENUM,
          MULTIPLE_ELEMENT_FORM_ITEM_LIST_ENUM,
        })
      })
    },
    async updateFormConfig(data, lastValue) {
      if (!this.eventHandler) return

      const updatedFormItems = await this.eventHandler({
        formItemId: data.id,
        value: this.formData[data.id],
        lastValue,
        formItems: this.formItemRes,
      })

      if (updatedFormItems) {
        this.formItemRes = updatedFormItems
        this.initForm()
        this.$emit('form-change', {
          id: data.id,
          value: this.formData[data.id],
          formData: this.formData,
        })
      }
    },
    showHistory(formItem) {
      this.$emit('show-history', formItem)
    },
    async saveForm() {
      this.$emit('save-form', this.formData)
    },
    validateItem(id) {
      this.$refs.dynamicFormRef.validateField(id)
    },
    async validate() {
      try {
        await thi.dynamicFormRef.validate()
        return true
      } catch (err) {
        console.error('表单校验失败', err)
        return false
      }
    },
    resetFields() {
      this.$refs.dynamicFormRef.resetFields()
    },
    setFieldsValue(values) {
      Object.keys(values).forEach((key) => {
        this.$set(this.formData, key, values[key])
      })
    },
    getFieldsValue() {
      return cloneDeep(this.formData)
    },
  },
}
</script>

<style lang="less" scoped>
.dynamic-form-container {
  ::v-deep .mtd-tabs-content {
    padding: 0;
  }
  ::v-deep .mtd-form-item-label {
    padding-right: 40px;
  }
}
</style>
