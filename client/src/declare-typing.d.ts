import 'vue-router'

// 为路由元信息meta提供智能提示
declare module 'vue-router' {
  interface RouteMeta {
    title: string // 标题
    icon?: string // 图标
    hidden?: boolean // 是否隐藏
    active?: string // 激活菜单
    role?: number[] // 该路由哪些角色可见
    keepAlive?: boolean // 是否需要缓存
  }
}


// 解决window.uploader_ip报警告问题
interface Window {
  uploader_ip: string
}

