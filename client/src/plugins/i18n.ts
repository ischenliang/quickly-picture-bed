import { reactive, ref } from "vue"


// 方式一
let config = reactive({
  locale: '',
  messages: null
})
// 方式二
let locale = ref('')
export function createI18n (options) {
  // 方式一
  // config.locale = options.locale
  // config.messages = options.messages
  locale.value = options.locale
  return {
    install: (app) => {
      // 注入一个全局可用的 $translate() 方法
      app.config.globalProperties.$translate = (key) => {
        // 获取 `options` 对象的深层属性
        // 使用 `key` 作为索引
        // 方式一
        // return key.split('.').reduce((o, i) => {
        //   if (o) return o[i]
        // }, config.messages[config.locale])

        // 方式二
        return key.split('.').reduce((o, i) => {
          if (o) return o[i]
        }, options.messages[locale.value])
      }
    }
  }
}


export function useI18n () {
  // 方式一
  // return config

  return locale
}


// 使用
// 1、在main.ts中注册我们的i18n插件
// import { createI18n } from '@/plugins/i18n'
// const messages = {
//   zh: {
//     greet: {
//       hello: '哈喽'
//     }
//   },
//   en: {
//     greet: {
//       hello: 'hello'
//     }
//   }
// }
// const i18n = createI18n({
//   locale: localStorage.getItem('locale') || 'zh',
//   messages
// })
// app.use(i18n)

// 2、切换语言
// import { useI18n } from '@/plugins/i18n'
// const i18n = useI18n()
// 方式一
// i18n.locale = i18n.locale === 'en' ? 'zh' : 'en'
// 方式二
// const locale = useI18n()
// locale.value = locale.value === 'en' ? 'zh' : 'en'