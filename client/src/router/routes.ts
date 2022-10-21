import { RouteRecordRaw } from 'vue-router'

export const constRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/logn-register/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/logn-register/register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('@/views/logn-register/forget.vue'),
    meta: { title: '忘记密码' }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test.vue'),
    meta: { title: '忘记密码' }
  }
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    name: 'Layout',
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'UploadFilled' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/userinfo/index.vue'),
        meta: { title: '首页', icon: 'UploadFilled', hidden: true, active: '/' }
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: () => import('@/views/gallery/index.vue'),
        meta: { title: '图库', icon: 'PictureFilled' }
      },
      {
        path: 'bucket',
        name: 'Bucket',
        component: () => import('@/views/bucket/index.vue'),
        meta: { title: '存储桶', icon: 'PictureFilled' }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统管理', icon: 'PictureFilled' },
        children: [
          {
            path: 'dash',
            name: 'SystemDash',
            component: () => import('@/views/system/home/index.vue'),
            meta: { title: '概况', icon: 'PictureFilled' }
          },
          {
            path: 'user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: { title: '用户管理', icon: 'PictureFilled' }
          },
          {
            path: 'bucketSource',
            name: 'SystemBucketSource',
            component: () => import('@/views/system/bucket-source/index.vue'),
            meta: { title: '存储桶源', icon: 'PictureFilled' }
          },
          {
            path: 'dict',
            name: 'SystemDict',
            component: () => import('@/views/system/dict/index.vue'),
            meta: { title: '字典管理', icon: 'PictureFilled' }
          },
          {
            path: 'log',
            name: 'SystemLog',
            component: () => import('@/views/system/log/index.vue'),
            meta: { title: '日志管理', icon: 'PictureFilled' }
          },
          {
            path: 'setting',
            name: 'SystemSetting',
            component: () => import('@/views/system/setting/index.vue'),
            meta: { title: '系统设置', icon: 'PictureFilled' }
          }
        ]
      }
    ]
  }
]

export default routes