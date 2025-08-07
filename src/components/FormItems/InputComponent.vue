<template>
  <div :id="'form-item-' + item.id" :class="[item.paddingClass, 'form-item-container']">
    <div class="form-item">
      <label :for="'input-' + item.id" class="form-label">{{ `${item?.sequence} ${item?.name}` }}</label>
      <div class="form-input-wrapper">
        <input
          :id="'input-' + item.id"
          v-model.trim="currentValue"
          type="text"
          class="form-input"
          placeholder="请输入"
          @blur="handleBlur"
        />
        <div v-if="item.rules && item.rules.length" class="form-error">
          <!-- 简化处理，实际使用时需要根据校验规则显示错误信息 -->
        </div>
      </div>
    </div>
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
    }

    .form-input-wrapper {
      position: relative;

      .form-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border-color: #409eff;
        }

        &::placeholder {
          color: #c0c4cc;
        }
      }

      .form-error {
        position: absolute;
        font-size: 12px;
        color: #f56c6c;
        margin-top: 2px;
      }
    }
  }
}
</style>
