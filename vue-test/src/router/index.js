import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      middleware: ['auth']
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      middleware: ['guest']
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      middleware: ['guest']
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
