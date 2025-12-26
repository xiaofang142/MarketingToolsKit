export default [
  {
    path: '/livecode',
    name: 'LiveCodeManagement',
    component: () => import('@/views/livecode/LiveCodeManagement.vue'),
    meta: { 
      title: '活码管理'
    }
  }
]