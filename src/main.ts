import { createApp } from 'vue'
import App from './App.vue'
import AV from 'leancloud-storage'
import router from '@/router/index'

import cComponent from './plugins/register-component'
// import i18n from './plugins/i18n'
// import language from './assets/i18n/index'
// app.use(i18n, language)

// 注意：这里的serverURL必须是非国际版的才支持使用，所以在创建应用时选择非国际版
AV.init({
  appId: "DZNcsGI3WVFNYIVdNCUUHeRy-gzGzoHsz",
  appKey: "iqy1M0UHQ2kqqBWT2VSUNbRO",
  serverURL: "https://dzncsgi3.lc-cn-n1-shared.com"
})



// import { createI18n } from './plugins/i18n'
// import language from './assets/i18n/index'

const app = createApp(App)
// const i18n = createI18n({
//   locale: localStorage.getItem('locale') || 'zh',
//   messages: language
// })
// app.use(i18n)
app.use(cComponent)

app.use(router)

app.mount('#app')

