import { useGetHabits, useGetSystemConfig } from '@/hooks/config';
import { useDeepClone } from '@/hooks/global';
import router from '@/router/index';
import useUserStore from '@/store/user';
import Users from '@/types/User';
import { UserInter } from '@/typings/interface';
import routes from './routes';
const user = new Users()
// 路由权限控制
router.beforeEach(async (to, from, next) => {
  // 获取系统配置
  const token = localStorage.getItem('token')
  const flag = await useGetSystemConfig()
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  if (token) {
    if (userInfo) {
      next()
    } else {
      const data: UserInter = await user.current()
      userStore.updateUserInfo(data)
      const habit = await useGetHabits()

      // 动态路由
      const menus = []
      routes.forEach(item => {
        const tmp = useDeepClone(item)
        tmp.children.forEach((el, index) => {
          if (!el.meta.role.includes(data.role)) {
            tmp.children.splice(index, 1)
          }
        })
        router.addRoute(tmp)
        // 将其他路由重定向到首页
        router.addRoute({ path: '/:pathMatch(.*)', name: '404', redirect: '/' })
        menus.push(tmp)
        next({ ...to, replace: true })
      })
      userStore.updateUserMenus(menus)

      // 为了避免异步导致页面出不来
      if (!flag || !habit) {
        next({ ...to, replace: true })
      }
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})