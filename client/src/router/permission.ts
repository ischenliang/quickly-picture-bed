import { useGetHabits, useGetSystemConfig } from '@/hooks/config';
import router from '@/router/index';
import useUserStore from '@/store/user';
import Users from '@/types/User';
import { UserInter } from '@/typings/interface';
const user = new Users()
// 路由权限控制
router.beforeEach(async (to, from, next) => {
  // 获取系统配置
  const token = localStorage.getItem('token')
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  if (token) {
    if (userInfo) {
      next()
    } else {
      const data: UserInter = await user.current()
      userStore.updateUserInfo(data)
      const flag = await useGetSystemConfig()
      const habit = await useGetHabits()
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