import { createApp } from 'vue'
import App from './App.vue'
// import AV from 'leancloud-storage'
import router from '@/router/index'
import '@/router/permission'
import cComponent from './plugins/register-component'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

// 不能放在这里初始化，因为在leancloud存储桶时还会调用AV.init导致重载
// 注意：这里的serverURL必须是非国际版的才支持使用，所以在创建应用时选择非国际版
// AV.init({
//   appId: "DZNcsGI3WVFNYIVdNCUUHeRy-gzGzoHsz",
//   appKey: "iqy1M0UHQ2kqqBWT2VSUNbRO",
//   serverURL: "https://dzncsgi3.lc-cn-n1-shared.com"
// })

const app = createApp(App)
const pinia = createPinia()
app.use(cComponent)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})
// 全局注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.config.warnHandler = () => null

app.mount('#app')