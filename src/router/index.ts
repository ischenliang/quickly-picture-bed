import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/home.vue'),
      name: 'Home'
    },
    {
      path: '/test/:id',
      component: () => import('@/views/test.vue'),
      name: 'Test'
    }
  ]
})

export default router