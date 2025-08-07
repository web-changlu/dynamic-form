<template>
  <div :id="'guide-form-item-' + item.id" :class="[item.paddingClass, 'guide-item-container']">
    <mtd-form-item :label="`${item?.sequence} ${item?.name}`" :prop="item.id" :rules="item?.rules || []">
      <template #label>
        <span class="guide-form-item-radio-title">
          {{ `${item?.sequence} ${item?.name}` }}
          <i
            v-if="item.hasHistory && noEditPermissions"
            class="mtdicon mtdicon-info-circle-o guide-history-icon"
            title="留痕记录"
            @click="() => showHistory(item)"
          />
        </span>
      </template>
      <div :class="[item.level === 3 ? 'pl-10' : '']">
        <mtd-radio-group v-model="currentValue" @change="radioChange">
          <mtd-radio-button
            v-for="radio in options || []"
            :key="radio.label"
            :value="radio.value"
            :disabled="radio.disabled"
          >
            {{ radio.label }}
          </mtd-radio-button>
        </mtd-radio-group>
      </div>
    </mtd-form-item>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'

import { recordChangeValue } from '../../utils/formUtils'

export default {
  name: 'RadioComponent',
  inject: ['updateFormConfig', 'saveForm', 'showHistory', 'validateItem'],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: String,
      default: '',
    },
    bizSerialNo: {
      type: String,
      default: '',
    },
    noEditPermissions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentValue: this.value,
      options: [],
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    async getOptions() {
      if (this.item.options.type === 'dynamic') {
        // 动态选项需要通过接口获取，这里简化处理
        this.options = []
      } else {
        this.options = this.item.options.value
      }
    },
    radioChange(selectValue) {
      const lastValue = cloneDeep(this.value)
      if (this.item?.extendData?.confirm) {
        return this.$mtd
          .confirm({
            title: `${this.item?.extendData?.confirmText || '提示'}`,
            message: '',
            type: 'warning',
            okButtonText: '我知道了',
            onOk: () => {
              this.$emit('input', selectValue)
              this.updateConfig(selectValue, lastValue)
            },
            onCancel: () => {
              this.currentValue = lastValue
            },
          })
          .catch(() => {})
      }
      this.$emit('input', selectValue)
      this.updateConfig(selectValue, lastValue)
    },
    async updateConfig(selectValue, lastValue) {
      recordChangeValue('RadioComponent', this.item.id, this.currentValue, lastValue)
      if (this.item.hasEventDecision) {
        await this.updateFormConfig(this.item, lastValue)
      }
      if (this.item?.extendData?.autoSave) {
        await this.saveForm()
      }
      // 解决选择后校验文本未消失
      this.validateItem(this.item.id)
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
    ::v-deep .mtd-form-item-label,
    ::v-deep .mtd-form-item-content {
      text-align: left;
      flex: 1;
      margin-left: 0 !important;
    }
  }
  .guide-form-item-radio-title {
    display: inline-flex;
    align-items: center;
  }
}
</style>
