import { createRouter, createWebHistory } from 'vue-router'
import UserView from '../views/UserView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user',
      component: UserView
    },
    {
      path: '/login',
      component: LoginView
    }
  ]
})

export default router
