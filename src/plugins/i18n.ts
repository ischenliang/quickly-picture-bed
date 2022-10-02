import { reactive } from "vue"

// 参考: https://cn.vuejs.org/guide/reusability/plugins.html#writing-a-plugin
export default {
  install (app, options) {
    app.config.globalProperties.$i18n = (key: string) => {
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
      // 我们的 $translate 函数会接收一个例如 greetings.hello 的字符串，在用户提供的翻译字典中查找，并返回翻译得到的值。
    }
  }
}

interface I18nConfig {
  locale: string // 语言
  messages: object // 多语言文件
}


const i18n = reactive({
  locale: '',
  messages: null
})
export function createI18n (config: I18nConfig) {
  i18n.locale = config.locale
  i18n.messages = config.messages
 return {
  install (app) {
    app.config.globalProperties.$i18n = (key: string) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, config.messages[config.locale])
    }
  }
 }
}

export function getCurrentLocale () {
  return i18n.locale
} 

export function useChangeLocale (locale: string) {
  i18n.locale = locale
}