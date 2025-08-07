<template>
  <div :id="'guide-form-item-' + item.id" :class="[item.paddingClass, 'guide-item-container']">
    <mtd-form-item :label="`${item?.sequence} ${item?.name}`" :prop="item.id" :rules="item?.rules || []">
      <div class="guide-item">
        <mtd-tooltip :content="currentValue" placement="top-start" :disabled="tooltipDisabled">
          <mtd-input v-model.trim="currentValue" placeholder="请输入" @blur="handleBlur" />
        </mtd-tooltip>
      </div>
    </mtd-form-item>
  </div>
</template>

<script>
import { recordChangeValue } from '../../utils/formUtils'

export default {
  name: 'InputComponent',
  inject: ['updateFormConfig'],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentValue: this.value,
    }
  },
  computed: {
    tooltipDisabled() {
      return !this.currentValue?.length || this.currentValue?.length < 30
    },
  },
  methods: {
    handleBlur() {
      const lastValue = this.value
      recordChangeValue('InputComponent', this.item.id, this.currentValue, lastValue)
      this.$emit('input', this.currentValue)
      if (this.item.hasEventDecision) {
        this.updateFormConfig(this.item, lastValue)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.guide-item-container {
  display: flex;
  align-items: center;
  .font-14 ::v-deep .mtd-form-item-label {
    font-size: 14px;
  }
  .mtd-form-item {
    width: 100%;
    display: flex;
    .mtd-input-wrapper {
      width: 100%;
    }
    ::v-deep .mtd-form-item-label,
    ::v-deep .mtd-form-item-content {
      text-align: left;
      flex: 1;
      margin-left: 0 !important;
    }
  }
}
</style>
