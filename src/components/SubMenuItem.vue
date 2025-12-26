<template>
  <!-- 有子菜单的菜单项 -->
  <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.key || menu.path">
    <template #title>
      <el-icon><component :is="getIconComponent(menu.icon)" /></el-icon>
      <span>{{ menu.title }}</span>
    </template>
    
    <!-- 递归渲染子菜单 -->
    <template v-for="item in menu.children" :key="item.path || item.key">
      <sub-menu-item :menu="item" :icon-components="iconComponents" />
    </template>
  </el-sub-menu>
  
  <!-- 没有子菜单的菜单项 -->
  <el-menu-item v-else :index="menu.path" @click="handleMenuClick(menu)">
    <el-icon><component :is="getIconComponent(menu.icon || 'Document')" /></el-icon>
    <span>{{ menu.title }}</span>
  </el-menu-item>
</template>

<script setup>
import { useRouter } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const router = useRouter()

// 创建图标组件映射
const iconComponents = {}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  iconComponents[key] = component
}

// 获取图标组件
const getIconComponent = (iconName) => {
  return iconComponents[iconName] || iconComponents['Document']
}

const handleMenuClick = (menu) => {
  if (menu.path) {
    router.push(menu.path)
  }
}

const props = defineProps({
  menu: {
    type: Object,
    required: true
  },
  iconComponents: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
/* 确保三级菜单正确显示 */
:deep(.el-menu .el-sub-menu .el-menu-item) {
  padding-left: 50px !important;
  min-width: 200px;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: var(--el-menu-bg-color);
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: var(--el-menu-hover-bg-color);
}

/* 确保三级菜单缩进正确 */
:deep(.el-menu .el-sub-menu .el-sub-menu .el-menu-item) {
  padding-left: 70px !important;
}

/* 确保子菜单正确展开 */
:deep(.el-sub-menu .el-sub-menu__title) {
  padding-left: 30px !important;
}

:deep(.el-menu .el-sub-menu .el-sub-menu .el-sub-menu__title) {
  padding-left: 50px !important;
}

/* 确保三级菜单子菜单正确展开 */
:deep(.el-sub-menu .el-sub-menu .el-menu) {
  background-color: var(--el-menu-bg-color);
}
</style>