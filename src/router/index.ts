import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
//fontend view
import Home from '@/views/frontend/HomeView.vue'
//backend view
import HomeView from '@/views/backend/HomeView.vue'
import LoginView from '@/views/backend/Login/LoginView.vue'
import PermissonView from '@/views/backend/Permission/PermissonView.vue'
import RoleView from '@/views/backend/Role/RoleView.vue'
import UserView from '@/views/backend/User/UserView.vue'
import UserCreateView from '@/views/backend/User/UserCreateView.vue'
import UserEditView from '@/views/backend/User/UserEditView.vue'
import RequestView from '@/views/backend/Request/RequestView.vue'
import RequestCreateView from '@/views/backend/Request/RequestCreateView.vue'
import RequestEditView from '@/views/backend/Request/RequestEditView.vue'

const routes = [
  {
    path: '/',
    children: [
      {
        path: 'request', name: 'request', component: () => import('@/views/frontend/Request/RequestView.vue'), meta: { hideFooter: true }
      },
    ],
  },
  {
    path: '/admin',
    children: [

      { path: '', name: 'admin.home', component: HomeView, meta: { breadcrumb: 'Trang chủ' } },
      {
        path: 'user', children: [
          { path: '', name: 'user.index', component: UserView, meta: { breadcrumb: 'Quản trị người dùng' } },
          { path: 'create', name: 'user.create', component: UserCreateView, meta: { breadcrumb: 'Thêm' } },
          { path: ':id', name: 'user.edit', component: UserEditView, meta: { breadcrumb: 'Sửa' } },
        ]
      },
      { path: 'permission', name: 'permission', component: PermissonView, meta: { breadcrumb: 'Quản trị chức năng' } },
      { path: 'role', name: 'role', component: RoleView, meta: { breadcrumb: 'Quản trị vai trò' } },
      {
        path: 'request', children: [
          { path: '', name: 'request.index', component: RequestView, meta: { breadcrumb: 'Quản trị yêu cầu' } },
          { path: 'create', name: 'request.create', component: RequestCreateView, meta: { breadcrumb: 'Thêm yêu cầu' } },
          { path: ':id', name: 'request.edit', component: RequestEditView, meta: { breadcrumb: 'Sửa yêu cầu' } },
        ]
      },
    ],
    meta: { requiresAuth: true }
  },
  { path: '/admin/login', name: 'admin.login', component: LoginView },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'admin.login' });
  } else if (to.name === 'admin.login' && authStore.isLoggedIn) {
    next({ name: 'admin.home' });
  } else {
    next();
  }
});

export default router