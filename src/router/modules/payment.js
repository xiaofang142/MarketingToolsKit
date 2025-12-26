export default [
  {
    path: 'payment/list',
    name: 'PaymentList',
    component: () => import('@/views/payment/List.vue'),
    meta: { title: '支付列表', group: 'system', icon: 'CreditCard' }
  },
  {
    path: 'payment/config',
    name: 'PaymentConfig',
    component: () => import('@/views/payment/Config.vue'),
    meta: { title: '支付配置', group: 'system', icon: 'Setting' }
  }
]