export default [
  {
    path: 'telegram',
    name: 'Telegram',
    component: () => import('@/views/telegram/account.vue'),
    meta: { title: '电报社群', group: 'community', icon: 'ChatDotRound' }
  },
  {
    path: 'telegram/account',
    name: 'TelegramAccount',
    component: () => import('@/views/telegram/account.vue'),
    meta: { title: '机器人', group: 'community', icon: 'Cpu' }
  },
  {
    path: 'telegram/order',
    name: 'TelegramOrder',
    component: () => import('@/views/telegram/order.vue'),
    meta: { title: '订单', group: 'community', icon: 'List' }
  },
  {
    path: 'telegram/user',
    name: 'TelegramUser',
    component: () => import('@/views/telegram/user.vue'),
    meta: { title: '用户', group: 'community', icon: 'User' }
  }
]