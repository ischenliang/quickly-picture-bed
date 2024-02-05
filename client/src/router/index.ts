import { createRouter, createWebHashHistory } from 'vue-router'
import routes, { constRoutes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...constRoutes,
    // ...routes,
  ]
})

export default router