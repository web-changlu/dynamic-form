<template>
  <div :id="'form-item-' + item.id" :class="[item.paddingClass, 'form-item-container']">
    <div class="form-item">
      <label class="form-label">
        {{ `${item?.sequence} ${item?.name}` }}
        <i
          v-if="item.hasHistory && noEditPermissions"
          class="history-icon"
          title="留痕记录"
          @click="() => showHistory(item)"
          >📋</i
        >
      </label>
      <div :class="[item.level === 3 ? 'pl-10' : '', 'radio-group']">
        <div
          v-for="radio in options || []"
          :key="radio.label"
          class="radio-button"
          :class="{ 'radio-button-active': currentValue === radio.value, 'radio-button-disabled': radio.disabled }"
          @click="!radio.disabled && radioChange(radio.value)"
        >
          <input
            v-model="currentValue"
            type="radio"
            :name="'radio-' + item.id"
            :value="radio.value"
            :disabled="radio.disabled"
            style="display: none"
          />
          <span>{{ radio.label }}</span>
        </div>
      </div>
    </div>
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
      if (this.noEditPermissions) return

      const lastValue = cloneDeep(this.value)
      if (this.item?.extendData?.confirm) {
        if (confirm(`${this.item?.extendData?.confirmText || '确认选择此项?'}`)) {
          this.currentValue = selectValue
          this.$emit('input', selectValue)
          this.updateConfig(selectValue, lastValue)
        }
      } else {
        this.currentValue = selectValue
        this.$emit('input', selectValue)
        this.updateConfig(selectValue, lastValue)
      }
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
.form-item-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  .form-item {
    width: 100%;
    display: flex;
    flex-direction: column;

    .form-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: #333;
      display: flex;
      align-items: center;

      .history-icon {
        margin-left: 6px;
        cursor: pointer;
        color: #0a70f5;
        font-size: 16px;
      }
    }

    .radio-group {
      display: flex;
      flex-wrap: wrap;

      .radio-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 15px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover:not(.radio-button-disabled) {
          border-color: #409eff;
          color: #409eff;
        }

        &.radio-button-active {
          background-color: #409eff;
          border-color: #409eff;
          color: white;
        }

        &.radio-button-disabled {
          background-color: #f5f7fa;
          border-color: #e4e7ed;
          color: #c0c4cc;
          cursor: not-allowed;
        }
      }
    }
  }
}

.pl-10 {
  padding-left: 10px;
}
</style>
