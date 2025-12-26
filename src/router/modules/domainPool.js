export default [
  {
    path: 'domainPool',
    name: 'DomainPool',
    component: () => import('@/views/domainPool/List.vue'),
    meta: { title: '域名池管理', group: 'system', icon: 'Link' }
  }
]