import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/User/LoginView.vue'
import SignupView from '@/views/User/SignupView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
  ],
})

export default router
