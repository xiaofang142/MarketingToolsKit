export default [
  {
    path: 'whatsapp',
    name: 'Whatsapp',
    component: () => import('@/views/whatsapp/account.vue'),
    meta: { title: 'WhatsApp 社群', group: 'community', icon: 'ChatDotRound' }
  },
  {
    path: 'whatsapp/account',
    name: 'WhatsappAccount',
    component: () => import('@/views/whatsapp/account.vue'),
    meta: { title: '账号管理', group: 'community', icon: 'Cpu' }
  },
  {
    path: 'whatsapp/drafts',
    name: 'WhatsappDrafts',
    component: () => import('@/views/whatsapp/drafts.vue'),
    meta: { title: '草稿箱', group: 'community', icon: 'Document' }
  },
  {
    path: 'whatsapp/jobs',
    name: 'WhatsappJobs',
    component: () => import('@/views/whatsapp/jobs.vue'),
    meta: { title: '群发', group: 'community', icon: 'Promotion' }
  }
]

