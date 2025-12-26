export default [
  {
    path: 'system/config',
    name: 'SystemConfig',
    component: () => import('@/views/system/Config.vue'),
    meta: { title: '站点设置', group: 'system', icon: 'Tools', requiresAuth: true }
  },
  {
    path: 'system/obs-config',
    name: 'SystemObsConfig',
    component: () => import('@/views/system/ObsConfig.vue'),
    meta: { title: '存储配置', group: 'system', icon: 'Cloud', requiresAuth: true }
  },
  {
    path: 'system/material-library',
    name: 'SystemMaterialLibrary',
    component: () => import('@/views/system/MaterialLibrary.vue'),
    meta: { title: '素材库', group: 'system', icon: 'Picture', requiresAuth: true }
  },
  {
    path: 'system/monitor',
    name: 'SystemMonitor',
    component: () => import('@/views/system/Monitor.vue'),
    meta: { title: '监控', group: 'system', icon: 'Cpu', requiresAuth: true }
  },
  {
    path: 'system/guide',
    name: 'SystemGuide',
    component: () => import('@/views/system/Guide.vue'),
    meta: { title: '使用引导', group: 'system', icon: 'Document', requiresAuth: true }
  }
]
