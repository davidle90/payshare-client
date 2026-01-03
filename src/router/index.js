import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import HomeView from '../views/public/HomeView.vue';
import LoginView from '../views/auth/LoginView.vue';
import SignupView from '../views/auth/SignupView.vue';

import DashboardView from '../views/dashboard/DashboardView.vue';
import SettingsView from '../views/dashboard/SettingsView.vue';

import NotFoundView from '../views/error/NotFoundView.vue'
import GroupView from '@/views/groups/GroupView.vue';

const routes = [
    // public
    { path: '/', name: 'Home', component: HomeView },

    // auth
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/signup', name: 'Signup', component: SignupView },

    // dashboard
    { path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true} },
    { path: '/settings', name: 'Settings', component: SettingsView, meta: { requiresAuth: true} },

    // groups
    { path: '/groups/:id', name: 'GroupsView', component: GroupView, meta: { requiresAuth: true} },

    // profile

    // logout

    {
      path: '/logout',
      name: 'logout',
      beforeEnter(to, from, next) {
        const authStore = useAuthStore()
        authStore.logout()
        location.reload()
      }
    },

    // error
    {path: '/:catchAll(.*)', name: 'not-found', component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    const stop = authStore.$subscribe(() => {
      if (authStore.initialized) {
        stop()
        if (to.meta.requiresAuth && !authStore.isAuthenticated) next('/login')
        else next()
      }
    })
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) next('/login')
  else next()
})

export default router