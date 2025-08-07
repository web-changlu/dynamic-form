<template>
  <div class="fixed-layout-container p-10">
    <div class="left-container">
      <div
        v-for="item in adjustedItems.leftItems.filter((i) => i.component !== 'module')"
        :key="item.id"
        class="guide-item"
      >
        <component
          :is="item.component"
          v-model="formData[item.id]"
          :item="item"
          :no-edit-permissions="noEditPermissions"
          :biz-serial-no="bizSerialNo"
        />
      </div>
    </div>
    <div class="right-container">
      <div
        v-for="item in adjustedItems.rightItems.filter((i) => i.component !== 'module')"
        :key="item.id"
        class="guide-item"
      >
        <component
          :is="item.component"
          v-model="formData[item.id]"
          :item="item"
          :no-edit-permissions="noEditPermissions"
          :biz-serial-no="bizSerialNo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputComponent from '../FormItems/InputComponent.vue'
import RadioComponent from '../FormItems/RadioComponent.vue'

export default {
  name: 'FixedLayout',
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
    splitId: {
      type: String,
      default: '1',
    },
    bizSerialNo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {
    adjustedItems() {
      let midIndex = this.formConfig.findIndex((item) => item.id === this.splitId)
      if (midIndex === -1) {
        midIndex = Math.ceil(this.formConfig.length / 2)
      }
      const leftItems = this.formConfig.slice(0, midIndex)
      const rightItems = this.formConfig.slice(midIndex)
      return { leftItems, rightItems }
    },
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.fixed-layout-container {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  gap: 10px 20px;
  .left-container,
  .right-container {
    flex: 1;
    gap: 10px;
  }
  .guide-item {
    margin: 10px 0;
  }
}
</style>
