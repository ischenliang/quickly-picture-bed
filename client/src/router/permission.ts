import { useGetHabits, useGetSystemConfig } from '@/hooks/config';
import router from '@/router/index';
import useUserStore from '@/store/user';
import Users from '@/types/User';
// 路由权限控制
router.beforeEach(async (to, from, next) => {
  // 获取系统配置
  const flag = await useGetSystemConfig()
  const habit = await useGetHabits()
  if (!flag) {
    next({ ...to, replace: true })
  }
  if (!habit) {
    next({ ...to, replace: true })
  }
  next()
})