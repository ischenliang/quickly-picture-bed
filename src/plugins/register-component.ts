// 全局组件注册
import cButton from '@/components/cButton.vue'
// 方式一
// export default function (app, option) {
//   app.component('c-button', cButton)
// }


// 方式二
export default {
  install (app, option) {
    app.component('c-button', cButton)
  }
}