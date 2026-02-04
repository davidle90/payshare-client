import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import HomeView from '../views/public/HomeView.vue';
import LoginView from '../views/auth/LoginView.vue';
import SignupView from '../views/auth/SignupView.vue';

import DashboardView from '../views/dashboard/DashboardView.vue';
import SettingsView from '../views/dashboard/SettingsView.vue';

import NotFoundView from '../views/error/NotFoundView.vue'
import GroupView from '@/views/groups/GroupView.vue';
import EditExpenseView from '@/views/expenses/EditExpenseView.vue';
import EditProfileView from '@/views/profile/EditProfileView.vue';

import AdminDashboardView from '@/views/admin/AdminDashboardView.vue';
import AdminUserIndex from '@/views/admin/users/AdminUserIndex.vue';
import AdminGroupIndex from '@/views/admin/groups/AdminGroupIndex.vue';
import AdminUserView from '@/views/admin/users/AdminUserView.vue';
import AdminGroupView from '@/views/admin/groups/AdminGroupView.vue';

const routes = [
  // public
  { path: '/', name: 'Home', component: HomeView },

  // auth
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },

  // dashboard
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: SettingsView, meta: { requiresAuth: true } },

  // groups
  { path: '/groups/:id', name: 'GroupsView', component: GroupView, meta: { requiresAuth: true } },

  // expenses
  { path: '/groups/:groupId/expenses/:expenseId/edit', name: 'EditExpenseView', component: EditExpenseView, meta: { requiresAuth: true } },

  // profile
  { path: '/profile', name: 'Profile', component: EditProfileView, meta: { requiresAuth: true } },

  // admin
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboardView, meta: { requiresAuth: true } },

  { path: '/admin/users', name: 'AdminUserIndex', component: AdminUserIndex, meta: { requiresAuth: true } },
  { path: '/admin/users/:id', name: 'AdminUserView', component: AdminUserView, meta: { requiresAuth: true } },

  { path: '/admin/groups', name: 'AdminGroupIndex', component: AdminGroupIndex, meta: { requiresAuth: true } },
  { path: '/admin/groups/:id', name: 'AdminGroupView', component: AdminGroupView, meta: { requiresAuth: true } },

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
  {
    path: '/:catchAll(.*)', name: 'not-found', component: NotFoundView
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