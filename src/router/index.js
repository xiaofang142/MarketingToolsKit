import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import { isInitialized } from '@/utils/initHelper'
import { useUserStore } from '@/stores/user'

import EmailRoutes from "./modules/email"
import TelegramRoutes from "./modules/telegram"
import WhatsappRoutes from "./modules/whatsapp"
import ClueRoutes from './modules/clue'
import SystemRoutes from './modules/system'
import DomainPoolRoutes from './modules/domainPool'
import ShortLinkRoutes from './modules/shortLink'
import DouyinCardRoutes from './modules/douyinCard'
import XiaohongshuCardRoutes from './modules/xiaohongshuCard'
import KuaishouCardRoutes from './modules/kuaishouCard'
import XianyuCardRoutes from './modules/xianyuCard'
import SmsRoutes from './modules/sms'
import PaymentRoutes from './modules/payment'
import PaidGroupRoutes from './modules/paidGroup'
import UserRoutes from './modules/user'
import LiveCodeRoutes from './modules/livecode'

// 初始化路由
const initRoutes = [
  {
    path: '/setup',
    name: 'InitSetup',
    component: () => import('@/views/setup/InitSetup.vue'),
    meta: { title: '系统初始化' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  }
]

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/email',
    children: [
      ...EmailRoutes,
      ...TelegramRoutes,
      ...WhatsappRoutes,
      ...ClueRoutes,
      ...SystemRoutes,
      ...DomainPoolRoutes,
      ...ShortLinkRoutes,
      ...DouyinCardRoutes,
      ...XiaohongshuCardRoutes,
      ...KuaishouCardRoutes,
      ...XianyuCardRoutes,
      ...SmsRoutes,
      ...PaymentRoutes,
      ...PaidGroupRoutes,
      ...UserRoutes,
      ...LiveCodeRoutes
    ],
  },
  ...initRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  console.log('路由守卫检查:', {
    to: to.path,
    from: from.path,
    isInitialized: isInitialized()
  })
  
  // 检查是否已初始化
  if (!isInitialized() && to.path !== '/setup') {
    console.log('系统未初始化，重定向到/setup')
    // 未初始化且不是初始化页面，重定向到初始化页面
    next('/setup')
  } else if (isInitialized() && to.path === '/setup') {
    console.log('系统已初始化，重定向到/')
    // 已初始化但访问初始化页面，重定向到首页
    next('/')
  } else if (to.meta.requiresAuth) {
    // 需要登录的页面，检查用户是否已登录
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
      next()
    } else {
      // 未登录，重定向到登录页面
      next('/login')
    }
  } else {
    // 其他情况正常放行
    console.log('正常放行到:', to.path)
    next()
  }
})
export default router
