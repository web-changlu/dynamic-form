<template>
  <div class="guide-tab-pane-container p-10">
    <div v-for="item in formConfig.filter((i) => i.component !== 'module')" :key="item.id" class="guide-item">
      <component
        :is="item.component"
        v-model="formData[item.id]"
        :item="item"
        :no-edit-permissions="noEditPermissions"
        :biz-serial-no="bizSerialNo"
      />
    </div>
  </div>
</template>

<script>
import InputComponent from '../FormItems/InputComponent.vue'
import RadioComponent from '../FormItems/RadioComponent.vue'

export default {
  name: 'TabsLayout',
  components: {
    InputComponent,
    RadioComponent,
    // 其他表单项组件需要在这里注册
  },
  props: {
    formConfig: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    noEditPermissions: {
      type: Boolean,
      default: true,
    },
    bizSerialNo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="less" scoped>
.guide-tab-pane-container {
  column-count: 2; /* 设置列数为2 */
  column-gap: 20px; /* 设置列间距 */
  .guide-item {
    break-inside: avoid; /* 避免元素被拆分到两列 */
    margin-bottom: 10px; /* 设置元素之间的间距 */
  }
}
</style>
