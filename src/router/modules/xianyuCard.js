export default [
  {
    path: '/xianyuCard',
    name: 'XianyuCard',
    component: () => import('@/views/xianyuCard/List.vue'),
    meta: { title: '咸鱼卡片', group: 'community', icon: 'ShoppingBag' }
  },
  {
    path: '/xianyu/auto-reply',
    name: 'XianyuAutoReply',
    component: () => import('@/views/xianyuCard/AutoReply.vue'),
    meta: { title: '咸鱼自动回复', group: 'community', icon: 'ChatDotRound' }
  },
  {
    path: '/xianyu/stats',
    name: 'XianyuStats',
    component: () => import('@/views/xianyuCard/Stats.vue'),
    meta: { title: '咸鱼卡片统计', group: 'community', icon: 'DataAnalysis' }
  },
  {
    path: '/xianyu-card-stats/:id',
    name: 'XianyuCardStats',
    component: () => import('@/views/xianyuCard/CardStats.vue'),
    meta: { title: '咸鱼卡片详情统计', group: 'community', icon: 'DataAnalysis' }
  }
]