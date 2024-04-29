import { createRouter, createWebHistory } from 'vue-router'
import UserView from '../views/UserView.vue'
import ProductsView from '../views/ProductsView.vue'
import AboutView from '@/views/AboutView.vue'


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
    },
    {
      path: '/products',
      component: ProductsView,
    },
    {
      path: '/about',
      component: AboutView
    }
  ]
})

export default router
