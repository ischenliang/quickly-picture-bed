import { RouteRecordRaw } from 'vue-router'

export const constRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-register/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login-register/register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('@/views/login-register/forget.vue'),
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
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'UploadFilled', role: [1, 2, 10] }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/userinfo/index.vue'),
        meta: { title: '个人中心', icon: 'UploadFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      {
        path: '/habits',
        name: 'Habits',
        component: () => import('@/views/userinfo/habits.vue'),
        meta: { title: '使用习惯', icon: 'UploadFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      {
        path: '/gallery',
        name: 'Gallery',
        component: () => import('@/views/gallery/index.vue'),
        meta: { title: '图库', icon: 'PictureFilled', role: [1, 2, 10], keepAlive: true }
      },
      {
        path: '/bucket',
        name: 'Bucket',
        component: () => import('@/views/bucket/index.vue'),
        meta: { title: '存储桶', icon: 'HelpFilled', role: [1, 2, 10] }
      },
      {
        path: '/albums',
        name: 'Albums',
        component: () => import('@/views/album/index.vue'),
        meta: { title: '我的相册', icon: 'Reading', role: [1, 2, 10] }
      },
      {
        path: '/albums/images',
        name: 'AlbumsImages',
        component: () => import('@/views/album/Images.vue'),
        meta: { title: '我的相册', icon: 'Reading', role: [1, 2, 10], hidden: true, active: '/albums', keepAlive: true }
      },
      {
        path: '/log',
        name: 'Log',
        component: () => import('@/views/log/index.vue'),
        meta: { title: '操作日志', icon: 'ChatDotRound', role: [1, 2, 10] }
      },
      {
        path: '/uplog',
        name: 'Uplog',
        component: () => import('@/views/log/uplog.vue'),
        meta: { title: '更新日志', icon: 'PictureFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/log/about.vue'),
        meta: { title: '关于系统', icon: 'PictureFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      {
        path: '/analysis',
        name: 'Analysis',
        component: () => import('@/views/log/analysis.vue'),
        meta: { title: '使用分析', icon: 'PictureFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      {
        path: '/system',
        name: 'System',
        component: () => import('@/views/system/index.vue'),
        meta: { title: '系统管理', icon: 'Setting', role: [10] },
        children: [
          {
            path: '/system/analysis',
            name: 'SystemAnalysis',
            component: () => import('@/views/system/analysis/index.vue'),
            meta: { title: '概况', icon: 'Odometer' }
          },
          {
            path: '/system/user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: { title: '用户管理', icon: 'UserFilled' }
          },
          {
            path: '/system/bucketSource',
            name: 'SystemBucketSource',
            component: () => import('@/views/system/bucket-source/index.vue'),
            meta: { title: '存储桶插件', icon: 'ScaleToOriginal' }
          },
          {
            path: '/system/dict',
            name: 'SystemDict',
            component: () => import('@/views/system/dict/index.vue'),
            meta: { title: '字典管理', icon: 'Basketball' }
          },
          {
            path: '/system/log',
            name: 'SystemLog',
            component: () => import('@/views/system/log/index.vue'),
            meta: { title: '日志管理', icon: 'List' }
          },
          {
            path: '/system/setting',
            name: 'SystemSetting',
            component: () => import('@/views/system/setting/index.vue'),
            meta: { title: '系统设置', icon: 'Tools' }
          },
          {
            path: '/system/bucketSourceDetail',
            name: 'SystemBucketSourceDetail',
            component: () => import('@/views/system/bucket-source/edit.vue'),
            meta: { title: '存储桶插件配置', icon: 'ScaleToOriginal', hidden: true, active: '/system/bucketSource' }
          },
        ]
      }
    ]
  }
]

export default routes