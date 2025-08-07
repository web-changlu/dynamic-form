<template>
  <div class="dynamic-form-container">
    <form class="dynamic-form" @submit.prevent>
      <div class="tabs">
        <div class="tab-header">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeName === tab.value }"
            @click="activeName = tab.value"
          >
            {{ tab.label }}
          </div>
        </div>
        <div class="tab-content">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-pane"
            :style="{ display: activeName === tab.value ? 'block' : 'none' }"
          >
            <component
              :is="tab.layout"
              :form-config="tabsConfig[tab.value]"
              :form-data="formData"
              :no-edit-permissions="noEditPermissions"
              :biz-serial-no="bizSerialNo"
              :split-id="tab.splitId"
            />
          </div>
        </div>
      </div>
    </form>
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
      errors: {},
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
      // 简化校验逻辑
      if (this.errors[id]) {
        delete this.errors[id]
      }
    },
    async validate() {
      // 简化校验逻辑，实际应用中需要根据rules进行校验
      this.errors = {}
      let isValid = true

      // 遍历所有表单项，检查必填项
      Object.keys(this.tabsConfig).forEach((tabKey) => {
        this.tabsConfig[tabKey].forEach((item) => {
          if (item.rules && item.rules.some((rule) => rule.required)) {
            const value = this.formData[item.id]
            if (!value && value !== 0) {
              this.errors[item.id] = '此项为必填项'
              isValid = false
            }
          }
        })
      })

      return isValid
    },
    resetFields() {
      this.formData = {}
      this.errors = {}
      this.initForm()
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
  .dynamic-form {
    width: 100%;

    .tabs {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      overflow: hidden;

      .tab-header {
        display: flex;
        background-color: #f5f7fa;
        border-bottom: 1px solid #dcdfe6;

        .tab-item {
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s;
          border-right: 1px solid #dcdfe6;

          &:hover {
            color: #409eff;
          }

          &.active {
            background-color: #fff;
            color: #409eff;
            border-bottom: 2px solid #409eff;
            margin-bottom: -1px;
          }
        }
      }

      .tab-content {
        background-color: #fff;

        .tab-pane {
          padding: 20px;
        }
      }
    }
  }
}
</style>
