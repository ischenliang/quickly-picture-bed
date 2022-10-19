import { useGetSystemConfig } from '@/hooks/config';
import router from '@/router/index';
import useUserStore from '@/store/user';
import Users from '@/types/User';
// 路由权限控制
router.beforeEach(async (to, from, next) => {
  // 获取系统配置
  const flag = await useGetSystemConfig()
  if (!flag) {
    next({ ...to, replace: true })
    // return { ...to, replace: true }
  }

  const token = localStorage.getItem('token')
  const user = new Users()
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  const isAuthenticated  = user.isAuthenticated()
  // 更新管理端菜单
  const backMenu = []
  // 排除项
  const exclude = ['/register', '/login', '/forget']
  if (token && isAuthenticated) {
    // 避免已登录状态下还去登录、注册、忘记密码页
    if (exclude.includes(to.path)) {
      next((from && from.path) || '/')
    }

    if (!userInfo) {
      userStore.updateUserInfo(user.current())
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    if (exclude.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})