import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Frontend views
import Home from '@/views/frontend/HomeView.vue';
import DiseaseList from '@/views/frontend/Disease/DiseaseList.vue';
import DiseaseDetail from '@/views/frontend/Disease/BaseDetailView.vue';

// Backend views
import HomeView from '@/views/backend/HomeView.vue';
import LoginView from '@/views/backend/Login/LoginView.vue';
import PermissonView from '@/views/backend/Permission/PermissonView.vue';
import RoleView from '@/views/backend/Role/RoleView.vue';
import UserView from '@/views/backend/User/UserView.vue';
import UserCreateView from '@/views/backend/User/UserCreateView.vue';
import UserEditView from '@/views/backend/User/UserEditView.vue';
import RequestView from '@/views/backend/Request/RequestView.vue';
import RequestCreateView from '@/views/backend/Request/RequestCreateView.vue';
import RequestEditView from '@/views/backend/Request/RequestEditView.vue';
import DiseaseView from '@/views/backend/Diseases/DiseasesView.vue';
import DiseaseCreateView from '@/views/backend/Diseases/DiseasesCreateView.vue';
import DiseaseEditView from '@/views/backend/Diseases/DiseasesEditView.vue';

const routes = [
  {
    path: '/',
    children: [
      {
        path: 'request',
        name: 'request',
        component: () => import('@/views/frontend/Request/RequestView.vue'),
        meta: { hideFooter: true }
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/frontend/Patient/PatientSearchView.vue'),
        meta: { hideFooter: true }
      },
      // Routes cho từ điển bệnh frontend
      {
        path: 'diseases',
        children: [
          {
            path: '',
            name: 'diseases',
            component: DiseaseList,
            meta: { 
              breadcrumb: 'Từ điển bệnh',
              title: 'Danh sách bệnh da liễu'
            }
          },
          {
            path: ':id',
            name: 'disease.detail',
            component: DiseaseDetail,
            meta: { 
              breadcrumb: 'Chi tiết bệnh',
              title: 'Thông tin chi tiết bệnh'
            },
            // Tùy chọn: Thêm props để component có thể nhận params
            props: true
          }
        ]
      },
    ],
  },
  {
    path: '/admin',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin.home',
        component: HomeView,
        meta: { breadcrumb: 'Trang chủ' }
      },
      // Routes quản lý người dùng
      {
        path: 'user',
        children: [
          {
            path: '',
            name: 'user.index',
            component: UserView,
            meta: { breadcrumb: 'Quản trị người dùng' }
          },
          {
            path: 'create',
            name: 'user.create',
            component: UserCreateView,
            meta: { breadcrumb: 'Thêm người dùng' }
          },
          {
            path: ':id',
            name: 'user.edit',
            component: UserEditView,
            meta: { breadcrumb: 'Sửa người dùng' }
          },
        ]
      },
      // Routes quản lý phân quyền
      {
        path: 'permission',
        name: 'permission',
        component: PermissonView,
        meta: { breadcrumb: 'Quản trị chức năng' }
      },
      {
        path: 'role',
        name: 'role',
        component: RoleView,
        meta: { breadcrumb: 'Quản trị vai trò' }
      },
      // Routes quản lý yêu cầu
      {
        path: 'request',
        children: [
          {
            path: '',
            name: 'request.index',
            component: RequestView,
            meta: { breadcrumb: 'Quản trị yêu cầu' }
          },
          {
            path: 'create',
            name: 'request.create',
            component: RequestCreateView,
            meta: { breadcrumb: 'Thêm yêu cầu' }
          },
          {
            path: ':id',
            name: 'request.edit',
            component: RequestEditView,
            meta: { breadcrumb: 'Sửa yêu cầu' }
          },
        ]
      },
      // Routes quản lý bệnh (admin)
      {
        path: 'diseases',
        children: [
          {
            path: '',
            name: 'diseases.index',
            component: DiseaseView,
            meta: { breadcrumb: 'Quản lý bệnh' }
          },
          {
            path: 'create',
            name: 'diseases.create',
            component: DiseaseCreateView,
            meta: { breadcrumb: 'Thêm bệnh' }
          },
          {
            path: ':id',
            name: 'diseases.edit',
            component: DiseaseEditView,
            meta: { breadcrumb: 'Sửa bệnh' }
          },
        ]
      },
    ]
  },
  {
    path: '/admin/login',
    name: 'admin.login',
    component: LoginView,
    meta: { 
      title: 'Đăng nhập hệ thống',
      guest: true 
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Cập nhật title trang
  if (to.meta.title) {
    document.title = `${to.meta.title} - Hệ thống quản lý bệnh da liễu`;
  }

  // Kiểm tra authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'admin.login' });
  } else if (to.meta.guest && authStore.isLoggedIn) {
    next({ name: 'admin.home' });
  } else {
    next();
  }
});

export default router;