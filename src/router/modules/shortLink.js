export default [
  {
    path: 'shortLink',
    name: 'ShortLink',
    component: () => import('@/views/shortLink/List.vue'),
    meta: { title: '短链管理', group: 'community', icon: 'Link' }
  },
  {
    path: 'shortLink/stats',
    name: 'ShortLinkStats',
    component: () => import('@/views/shortLink/Stats.vue'),
    meta: { title: '短链统计', group: 'community', icon: 'DataAnalysis' }
  }
]