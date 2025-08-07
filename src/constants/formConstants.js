/**
 * 表单常量定义
 */

/**
 * 创建枚举对象
 * @param {Array} items 枚举项数组
 * @returns {Object} 枚举对象
 */
export function makeEnum(items) {
  const enumObj = {}
  const map = {}

  items.forEach((item) => {
    const { label, value, alias } = item
    map[value] = label
    if (alias) {
      enumObj[alias] = value
    }
  })

  enumObj.getList = () => items
  enumObj.getLabel = (value) => map[value] || ''
  enumObj.getValueByLabel = (label) => {
    const item = items.find((i) => i.label === label)
    return item ? item.value : ''
  }

  return enumObj
}

// 表单项类型
export const FORM_ITEM_TYPE = {
  MODULE: 'module',
  TITLE: 'TitleComponent',
  TEXT: 'TextComponent',
  INPUT: 'InputComponent',
  RADIO: 'RadioComponent',
  CHECKBOX: 'CheckboxComponent',
  DATE_PICKER: 'DatePickerComponent',
  TEXTAREA: 'TextareaComponent',
  UPLOAD: 'UploadComponent',
  CASCADER: 'CascaderComponent',
  TAG: 'TagComponent',
  TABLE: 'TableComponent',
  LIST: 'ListComponent',
  RADIO_INPUT: 'RadioInputComponent',
  TAG_INPUT: 'TagInputComponent',
  INPUT_NUMBER: 'InputNumberComponent',
  SINGLE_VALUE_TABLE: 'SingleValueTableComponent',
}

// 表单项分类
export const NO_EDIT_FORM_ITEM_LIST_ENUM = makeEnum([
  {
    label: '模块表单项',
    value: 'module',
    alias: 'MODULE',
  },
  {
    label: '标题表单项',
    value: 'TitleComponent',
    alias: 'TITLE_COMPONENT',
  },
  {
    label: '文本表单项',
    value: 'TextComponent',
    alias: 'TEXT_COMPONENT',
  },
  {
    label: '标签表单项',
    value: 'TagComponent',
    alias: 'TAG_COMPONENT',
  },
  {
    label: '表格表单项',
    value: 'TableComponent',
    alias: 'TABLE_COMPONENT',
  },
  {
    label: '列表表单项',
    value: 'ListComponent',
    alias: 'LIST_COMPONENT',
  },
  {
    label: '单值表格表单项',
    value: 'SingleValueTableComponent',
    alias: 'SINGLE_VALUE_TABLE_COMPONENT',
  },
])

// 单元素值为字符串的表单项
export const SINGLE_ELEMENT_FORM_ITEM_LIST_ENUM = makeEnum([
  {
    label: '单行输入表单项',
    value: 'InputComponent',
    alias: 'INPUT_COMPONENT',
  },
  {
    label: '单选框表单项',
    value: 'RadioComponent',
    alias: 'RADIO_COMPONENT',
  },
  {
    label: '多行文本输入表单项',
    value: 'TextareaComponent',
    alias: 'TEXTAREA_COMPONENT',
  },
  {
    label: '数字输入表单项',
    value: 'InputNumberComponent',
    alias: 'INPUT_NUMBER_COMPONENT',
  },
])

// 单元素值为数组的表单项
export const SINGLE_ELEMENT_FORM_ITEM_VALUE_ARRAY_LIST_ENUM = makeEnum([
  {
    label: '级联选择表单项',
    value: 'CascaderComponent',
    alias: 'CASCADER_COMPONENT',
  },
  {
    label: '图片上传表单项',
    value: 'UploadComponent',
    alias: 'UPLOAD_COMPONENT',
  },
  {
    label: '复选框表单项',
    value: 'CheckboxComponent',
    alias: 'CHECKBOX_COMPONENT',
  },
])

// 双元素表单项
export const MULTIPLE_ELEMENT_FORM_ITEM_LIST_ENUM = makeEnum([
  {
    label: '单选&输入表单项',
    value: 'RadioInputComponent',
    alias: 'RADIO_INPUT_COMPONENT',
  },
  {
    label: '标签&输入表单项',
    value: 'TagInputComponent',
    alias: 'TAG_INPUT_COMPONENT',
  },
])

// 日期表单项
export const DATE_PICKER_LIST_ENUM = makeEnum([
  {
    label: '日期选择表单项',
    value: 'DatePickerComponent',
    alias: 'DATE_PICKER_COMPONENT',
  },
])

// 内边距枚举
export const PADDING_ENUM = makeEnum([
  {
    label: '2',
    value: 'pl-0',
    alias: 'LEVEL_1_HEADING',
  },
  {
    label: '3',
    value: 'pl-10',
    alias: 'LEVEL_2_HEADING',
  },
  {
    label: '4',
    value: 'pl-30',
    alias: 'LEVEL_3_HEADING',
  },
])

// 默认选项
export const DEFAULT_OPTIONS = {
  type: 'static',
  value: [
    {
      label: '是',
      value: '1',
    },
    {
      label: '否',
      value: '-1',
    },
  ],
}

// 默认最大输入长度
export const DEFAULT_MAX_INPUT_LENGTH = 100

// 默认最小输入长度
export const DEFAULT_MIN_INPUT_LENGTH = 0

/**
 * 创建长度校验器
 * @param {Number} maxLength 最大长度
 * @param {Number} minLength 最小长度
 * @returns {Function} 校验函数
 */
export function createLengthValidator(maxLength = DEFAULT_MAX_INPUT_LENGTH, minLength = DEFAULT_MIN_INPUT_LENGTH) {
  const maxLengthValue = Number.isFinite(Number(maxLength)) ? Number(maxLength) : DEFAULT_MAX_INPUT_LENGTH
  const minLengthValue = Number.isFinite(Number(minLength)) ? Number(minLength) : DEFAULT_MIN_INPUT_LENGTH
  return (rule, value, callback) => {
    if (minLengthValue !== null && value?.length < minLengthValue) {
      return callback(new Error(`不少于${minLengthValue}字符`))
    }
    if (value?.length > maxLengthValue) {
      return callback(new Error(`不超过${maxLengthValue}字符`))
    }
    return callback()
  }
}

/**
 * 创建表单项配置
 * @param {Object} params 配置参数
 * @returns {Object} 表单项配置
 */
export function createComponentConfigItem(params) {
  const { name = 'module', hasHistory = false, options = {}, rules = [], extendData = {} } = params
  const itemConfig = {
    component: name, // 名称，用于匹配组件
    options, // 表单项有单选框时提供选项，
    rules, // 表单项校验规则
    extendData, // 额外需要的扩展数据 例如是否有二次确认
    hasHistory,
  }
  if (
    ['RadioComponent', 'TagComponent', 'TagInputComponent', 'RadioInputComponent'].includes(itemConfig.component) &&
    !itemConfig.options.type
  ) {
    itemConfig.options = DEFAULT_OPTIONS
  }
  return itemConfig
}
