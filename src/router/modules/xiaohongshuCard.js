export default [
  {
    path: '/xiaohongshuCard',
    name: 'XiaohongshuCard',
    component: () => import('@/views/xiaohongshuCard/List.vue'),
    meta: {
      title: '小红书卡片',
      group: 'community',
      icon: 'Picture'
    }
  },
  {
    path: '/xiaohongshu/auto-reply',
    name: 'XiaohongshuAutoReply',
    component: () => import('@/views/xiaohongshuCard/AutoReply.vue'),
    meta: {
      title: '小红书自动回复',
      group: 'community',
      icon: 'ChatDotRound'
    }
  },
  {
    path: '/xiaohongshu/stats',
    name: 'XiaohongshuStats',
    component: () => import('@/views/xiaohongshuCard/Stats.vue'),
    meta: {
      title: '小红书卡片统计',
      group: 'community',
      icon: 'DataAnalysis'
    }
  },
  {
    path: '/xiaohongshu-card-stats/:id',
    name: 'XiaohongshuCardStats',
    component: () => import('@/views/xiaohongshuCard/CardStats.vue'),
    meta: {
      title: '小红书卡片详情统计',
      group: 'community',
      icon: 'DataAnalysis'
    }
  }
]
