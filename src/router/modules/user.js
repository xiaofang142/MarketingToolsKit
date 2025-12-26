export default [
  {
    path: '/user',
    name: 'UserManagement',
    component: () => import('@/views/telegram/user.vue'),
    meta: { 
      title: '用户管理',
      requiresAuth: true
    }
  }
]