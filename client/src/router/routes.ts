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
    component: () => import('@/views/test2.vue'),
    meta: { title: '忘记密码' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/about/index.vue'),
    meta: { title: '关于系统' }
  },
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
        path: '/chatgpt',
        name: 'ChatGpt',
        component: () => import('@/views/chatgpt/index.vue'),
        meta: { title: 'ChatGpt', icon: 'UploadFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      // {
      //   path: '/habits',
      //   name: 'Habits',
      //   component: () => import('@/views/userinfo/habits.vue'),
      //   meta: { title: '偏好设置', icon: 'UploadFilled', hidden: true, active: '/', role: [1, 2, 10] }
      // },
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
        path: '/analysis',
        name: 'Analysis',
        component: () => import('@/views/log/analysis.vue'),
        meta: { title: '仪表盘', icon: 'PieChart', role: [1, 2, 10], hidden: true, active: '/' }
      },
      {
        path: '/albums',
        name: 'Albums',
        component: () => import('@/views/album/index.vue'),
        meta: { title: '我的相册', icon: 'Camera', role: [1, 2, 10] }
      },
      {
        path: '/albums/images',
        name: 'AlbumsImages',
        component: () => import('@/views/album/Images.vue'),
        meta: { title: '我的相册', icon: 'Reading', role: [1, 2, 10], hidden: true, active: '/albums', keepAlive: true }
      },
      {
        path: '/plugin',
        name: 'Plugin',
        component: () => import('@/views/plugin/index.vue'),
        meta: { title: '插件市场', icon: 'Ticket', role: [1, 2, 10] }
      },
      {
        path: '/plugin/detail',
        name: 'PluginDetail',
        component: () => import('@/views/plugin/detail.vue'),
        meta: { title: '插件详情', hidden: true, active: '/plugin', icon: 'DataLine', role: [1, 2, 10] }
      },
      {
        path: '/wiki',
        name: 'Wiki',
        component: () => import('@/views/wiki/index.vue'),
        meta: { title: '我的知识库', icon: 'Collection', role: [1, 2, 10] }
      },
      {
        path: '/wiki/article',
        name: 'WikiArticle',
        component: () => import('@/views/wiki/wiki-articles.vue'),
        meta: { title: '知识库文档管理', icon: 'Collection', role: [1, 2, 10], hidden: true, active: '/wiki' }
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
        component: () => import('@/views/about/about.vue'),
        meta: { title: '关于系统', icon: 'PictureFilled', hidden: true, active: '/', role: [1, 2, 10] }
      },
      {
        path: '/log',
        name: 'Log',
        component: () => import('@/views/log/index.vue'),
        meta: { title: '操作日志', icon: 'ChatDotRound', role: [1, 2, 10] }
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
            path: '/system/plugin',
            name: 'SystemPlugin',
            component: () => import('@/views/system/plugin/index.vue'),
            meta: { title: '插件管理', icon: 'ScaleToOriginal' }
          },
          {
            path: '/system/pluginDetail',
            name: 'SystemPluginDetail',
            component: () => import('@/views/plugin/detail.vue'),
            meta: { title: '插件管理', icon: 'ScaleToOriginal', hidden: true, active: '/system/plugin' }
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
          }
        ]
      }
    ]
  }
]

export default routes