export default [
  {
    path: '/kuaishouCard',
    name: 'KuaishouCard',
    component: () => import('@/views/kuaishouCard/List.vue'),
    meta: { title: '快手卡片', group: 'community', icon: 'ChatDotRound' }
  },
  {
    path: '/kuaishou/auto-reply',
    name: 'KuaishouAutoReply',
    component: () => import('@/views/kuaishouCard/AutoReply.vue'),
    meta: { title: '快手自动回复', group: 'community', icon: 'ChatDotRound' }
  },
  {
    path: '/kuaishou/stats',
    name: 'KuaishouStats',
    component: () => import('@/views/kuaishouCard/Stats.vue'),
    meta: { title: '快手卡片统计', group: 'community', icon: 'DataAnalysis' }
  },
  {
    path: '/kuaishou-card-stats/:id',
    name: 'KuaishouCardStats',
    component: () => import('@/views/kuaishouCard/CardStats.vue'),
    meta: { title: '快手卡片详情统计', group: 'community', icon: 'DataAnalysis' }
  }
]
