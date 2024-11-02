import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Frontend views
import Home from '@/views/frontend/HomeView.vue'
import DiseaseList from '@/views/frontend/Disease/DiseaseList.vue'
import DiseaseDetail from '@/views/frontend/Disease/BaseDetailView.vue'

// Backend views
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
        path: 'request',
        name: 'request',
        component: () => import('@/views/frontend/Request/RequestView.vue'),
        meta: { hideFooter: true }
      },
      // Routes cho từ điển bệnh
      {
        path: 'diseases',
        name: 'diseases',
        component: DiseaseList,
        meta: { breadcrumb: 'Từ điển bệnh' }
      },
      {
        path: 'disease',
        children: [
          {
            path: 'bach-bien',
            name: 'bach_bien',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh bạch biến',
              diseaseId: 1
            }
          },
          {
            path: 'trung-ca',
            name: 'trungca',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh trứng cá',
              diseaseId: 2
            }
          },
          {
            path: 'hac-lao',
            name: 'haclao',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh hắc lào',
              diseaseId: 3
            }
          },
          {
            path: 'lang-ben',
            name: 'langben',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh lang ben',
              diseaseId: 4
            }
          },
          {
            path: 'sam-da',
            name: 'benh_samda',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh sạm da',
              diseaseId: 5
            }
          },
          {
            path: 'viem-da-co-dia',
            name: 'viemda_codia',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh viêm da cơ địa',
              diseaseId: 6
            }
          },
          {
            path: 'vay-nen',
            name: 'benh_vaynen',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh vảy nến',
              diseaseId: 7
            }
          },
          {
            path: 'ghe',
            name: 'benhghe',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh ghẻ',
              diseaseId: 8
            }
          },
          {
            path: 'choc-lo',
            name: 'choclo',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh chốc lở',
              diseaseId: 9
            }
          },
          {
            path: 'ram-ma',
            name: 'benh_ramma',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh rám má',
              diseaseId: 10
            }
          },
          {
            path: 'nhot',
            name: 'benhnhot',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh nhọt',
              diseaseId: 11
            }
          },
          {
            path: 'vien-nang-long',
            name: 'viennanglong',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh viêm nang lông',
              diseaseId: 12
            }
          },
          {
            path: 'lao-da',
            name: 'benhlao',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh lao da',
              diseaseId: 13
            }
          },
          {
            path: 'phong',
            name: 'benhphong',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh phong',
              diseaseId: 14
            }
          },
          {
            path: 'nam-toc',
            name: 'benhnamtoc',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh nấm tóc',
              diseaseId: 15
            }
          },
          {
            path: 'nam-mong',
            name: 'benhnammong',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh nấm móng',
              diseaseId: 16
            }
          },
          {
            path: 'zona-than-kinh',
            name: 'zola_thanhkinh',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh Zona thần kinh',
              diseaseId: 17
            }
          },
          {
            path: 'lupus-ban-do',
            name: 'benh_lopus_bando',
            component: DiseaseDetail,
            meta: {
              breadcrumb: 'Bệnh Lupus ban đỏ',
              diseaseId: 18
            }
          }
        ]
      }
    ],
  },
  {
    path: '/admin',
    children: [
      {
        path: '',
        name: 'admin.home',
        component: HomeView,
        meta: { breadcrumb: 'Trang chủ' }
      },
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
            meta: { breadcrumb: 'Thêm' }
          },
          {
            path: ':id',
            name: 'user.edit',
            component: UserEditView,
            meta: { breadcrumb: 'Sửa' }
          },
        ]
      },
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
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/login',
    name: 'admin.login',
    component: LoginView
  },
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

export default router;