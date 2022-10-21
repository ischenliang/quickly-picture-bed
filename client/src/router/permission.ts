import { useGetSystemConfig } from '@/hooks/config';
import router from '@/router/index';
import useUserStore from '@/store/user';
import Users from '@/types/User';
// 路由权限控制
router.beforeEach(async (to, from, next) => {
  next()
})