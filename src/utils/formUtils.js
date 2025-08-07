/**
 * 表单工具函数
 */

/**
 * 安全解析JSON字符串
 * @param {String} str JSON字符串
 * @param {*} defaultValue 解析失败时的默认值
 * @returns {*} 解析结果
 */
export function safeParse(str, defaultValue = null) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return defaultValue
  }
}

/**
 * 美化JSON字符串
 * @param {*} obj 对象
 * @returns {String} 美化后的JSON字符串
 */
export function beautifyJsonStr(obj) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return String(obj)
  }
}

/**
 * 记录表单项值变化
 * @param {String} componentName 组件名称
 * @param {String|Number} id 表单项ID
 * @param {*} newValue 新值
 * @param {*} oldValue 旧值
 */
export function recordChangeValue(componentName, id, newValue, oldValue) {
  console.log(`表单项值变化: ${componentName} ${id}`, { oldValue, newValue })
}

/**
 * 配置项以及表单项值相互转化的逻辑
 * @param {Object} item 表单项配置
 * @param {String} direction 方向 toFormData：将接口拿到的配置项处理得到表单项的值； toDecideContent 将表单项的值处理成后端决策所需要的值 toSaveContent将表单项的值处理成后端保存所需要的值
 * @param {Object} formData 当前总表单对象的值
 * @param {*} lastValue 上一次的值
 * @param {Object} enums 枚举对象
 * @returns {*} 转换后的值
 */
export function transformContent(item, direction, formData, lastValue, enums) {
  const { id, component, content, extendData } = item

  const firstElementValue = content?.elements?.[0]?.value,
    firstElementType = content?.elements?.[0]?.type || '',
    firstElementTableHeader = content?.elements?.[0]?.tableHeader || {}

  const strategies = {
    NO_EDIT_FORM_ITEM_LIST_ENUM: {
      toFormData: () => content,
      toDecideContent: () => content,
      toSaveContent: () => content,
      toLastContent: () => null,
    },
    SINGLE_ELEMENT_FORM_ITEM_LIST_ENUM: {
      toFormData: () => firstElementValue ?? '',
      toDecideContent: () => ({ elements: [{ value: formData[id] }] }),
      toSaveContent: () => ({
        elements: [
          {
            value: formData[id],
            type: firstElementType,
            tableHeader: firstElementTableHeader,
          },
        ],
      }),
      toLastContent: () => {
        if (!lastValue) return null
        return { elements: [{ value: lastValue }] }
      },
    },
    DATE_PICKER_LIST_ENUM: {
      toFormData: () => {
        if (extendData?.dateType === 'date') {
          return firstElementValue || ''
        } else {
          console.warn(`toFormData表单项id:${id}, 暂不支持的日期类型`)
          return ''
        }
      },
      toDecideContent: () => {
        if (extendData?.dateType === 'date') {
          return { elements: [{ value: formData[id] || '' }] }
        } else {
          console.warn(`toDecideContent表单项id:${id}, 暂不支持的日期类型`)
          return { elements: [{ value: '' }] }
        }
      },
      toSaveContent: () => {
        if (extendData?.dateType === 'date') {
          return {
            elements: [
              {
                value: formData[id],
                type: firstElementType,
                tableHeader: firstElementTableHeader,
              },
            ],
          }
        } else {
          console.warn(`toSaveContent表单项id:${id}, 暂不支持的日期类型`)
          return { elements: [{ value: '' }] }
        }
      },
      toLastContent: () => {
        if (extendData?.dateType === 'date') {
          if (!lastValue) return null
          return { elements: [{ value: lastValue }] }
        } else {
          console.warn(`toLastContent表单项id:${id}, 暂不支持的日期类型`)
          return null
        }
      },
    },
    SINGLE_ELEMENT_FORM_ITEM_VALUE_ARRAY_LIST_ENUM: {
      toFormData: () => (firstElementValue ? safeParse(firstElementValue, []) : []),
      toDecideContent: () => ({ elements: [{ value: JSON.stringify(formData[id]) }] }),
      toSaveContent: () => ({
        elements: [
          {
            value: JSON.stringify(formData[id]),
            type: firstElementType,
            tableHeader: firstElementTableHeader,
          },
        ],
      }),
      toLastContent: () => {
        if (!lastValue) return null
        return { elements: [{ value: JSON.stringify(lastValue) }] }
      },
    },
    MULTIPLE_ELEMENT_FORM_ITEM_LIST_ENUM: {
      toFormData: () => [firstElementValue || '', content?.elements[1]?.value || ''],
      toDecideContent: () => ({ elements: [{ value: formData[id][0] }, { value: formData[id][1] }] }),
      toSaveContent: () => ({
        elements: [
          {
            value: formData[id][0],
            type: firstElementType,
            tableHeader: firstElementTableHeader,
          },
          {
            value: formData[id][1],
            type: content?.elements?.[1]?.type || '',
            tableHeader: content?.elements?.[1]?.tableHeader || {},
          },
        ],
      }),
      toLastContent: () => {
        if (!lastValue) return null
        return { elements: [{ value: lastValue[0] }, { value: lastValue[1] }] }
      },
    },
  }

  for (const key in strategies) {
    if (enums[key].getList().some((item) => item.value === component)) {
      return strategies[key][direction]()
    }
  }

  return null
}

/**
 * 格式化表单配置
 * @param {Array} list 表单项列表
 * @param {Object} formConfig 表单配置
 * @param {Object} paddingEnum 内边距枚举
 * @returns {Array} 格式化后的表单配置
 */
export function formatFormConfig(list = [], formConfig, paddingEnum) {
  const resultArr = []
  list.forEach((item) => {
    const resultItem = {
      ...item,
      ...formConfig[item.id],
      id: `${item.id}`, // 表单项ID需要string类型
      paddingClass: paddingEnum.getValueByLabel(String(item.level)),
      valueContainerPaddingClass: item?.level === 3 ? 'pl-20' : '',
    }

    // 处理表格表头
    if (resultItem.component === 'TableComponent') {
      resultItem.tableHeader = resultItem.content?.elements[1]?.tableHeader || {}
    } else if (resultItem.component === 'SingleValueTableComponent') {
      resultItem.tableHeader = resultItem.content?.elements[0]?.tableHeader || {}
    }

    resultArr.push(resultItem)
  })
  return resultArr
}

/**
 * 格式化表单数据
 * @param {Array} formItemList 表单项列表
 * @param {Object} formData 表单数据
 * @param {Function} transformContentFn 转换内容的函数
 */
export function formatFormData(formItemList, formData, transformContentFn) {
  formItemList.forEach((item) => {
    const { id, isUpdateValue = false } = item

    if (Object.prototype.hasOwnProperty.call(formData, id) && !isUpdateValue) {
      return
    }
    const formValue = transformContentFn(item, 'toFormData', formData)
    formData[id] = formValue
    item.isUpdateValue = false
  })
}
