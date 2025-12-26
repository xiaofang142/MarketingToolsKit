export default [
  {
    path: 'paidGroup/list',
    name: 'PaidGroupList',
    component: () => import('@/views/paidGroup/List.vue'),
    meta: { title: '付费群列表', group: 'community', icon: 'UserFilled' }
  },
  {
    path: 'paidGroup/create',
    name: 'PaidGroupCreate',
    component: () => import('@/views/paidGroup/Create.vue'),
    meta: { title: '创建付费群', group: 'community', icon: 'Plus' }
  },
  {
    path: 'paidGroup/orders',
    name: 'PaidGroupOrders',
    component: () => import('@/views/paidGroup/Orders.vue'),
    meta: { title: '入群订单', group: 'community', icon: 'List' }
  }
]