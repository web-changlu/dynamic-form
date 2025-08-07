import DynamicForm from './components/DynamicForm.vue'
import InputComponent from './components/FormItems/InputComponent.vue'
import RadioComponent from './components/FormItems/RadioComponent.vue'
import FixedLayout from './components/FormLayouts/FixedLayout.vue'
import TabsLayout from './components/FormLayouts/TabsLayout.vue'
import { createComponentConfigItem, createLengthValidator, makeEnum } from './constants/formConstants'
import {
  beautifyJsonStr,
  formatFormConfig,
  formatFormData,
  recordChangeValue,
  safeParse,
  transformContent,
} from './utils/formUtils'
import { addSequence, buildTree, flattenTree, splitArrayByTreeStructure } from './utils/treeUtils'

// 导出组件
export { DynamicForm, FixedLayout, InputComponent, RadioComponent, TabsLayout }

// 导出工具函数
export {
  addSequence,
  beautifyJsonStr,
  buildTree,
  createComponentConfigItem,
  createLengthValidator,
  flattenTree,
  formatFormConfig,
  formatFormData,
  makeEnum,
  recordChangeValue,
  safeParse,
  splitArrayByTreeStructure,
  transformContent,
}

// 安装插件
const install = function (Vue) {
  Vue.component(DynamicForm.name, DynamicForm)
  Vue.component(FixedLayout.name, FixedLayout)
  Vue.component(TabsLayout.name, TabsLayout)
  Vue.component(InputComponent.name, InputComponent)
  Vue.component(RadioComponent.name, RadioComponent)
}

// 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  DynamicForm,
}
