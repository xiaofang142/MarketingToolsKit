<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <!-- 消息通知组件 -->
    <MessageNotification />
    
    <!-- 顶部导航栏 -->
    <el-header>
      <div class="logo">营销管理系统</div>
      <el-menu
        :default-active="activeTopMenu"
        mode="horizontal"
        @select="handleTopMenuSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        class="top-menu"
      >
        <!-- 一级菜单 -->
        <el-menu-item 
          v-for="menu in topMenus" 
          :key="menu.key" 
          :index="menu.key"
        >
          <el-icon><component :is="iconComponents[menu.icon]" /></el-icon>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </el-menu>
      
      <!-- 用户登录状态 -->
      <div class="user-info" v-if="userStore.isLoggedIn">
        <el-dropdown @command="handleUserCommand">
          <span class="user-dropdown">
            <el-icon><User /></el-icon>
            <span>{{ userStore.username }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              <el-dropdown-item command="reset" divided v-if="userStore.userInfo.role === 'admin'">一键重置</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      
      <!-- 登录按钮 -->
      <div class="login-button" v-else @click="handleLogin">
        <el-icon><User /></el-icon>
        <span>登录</span>
      </div>
    </el-header>
    
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px" v-if="currentTopMenu && currentTopMenu.children">
        <el-menu
          :default-active="activeSubMenu"
          @select="handleSubMenuSelect"
          :unique-opened="false"
          mode="vertical"
          :router="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 使用递归组件渲染嵌套菜单 -->
          <template v-for="subMenu in currentTopMenu.children" :key="subMenu.key">
            <sub-menu-item :menu="subMenu" :icon-components="iconComponents" />
          </template>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main>
        <!-- 页面切换动画 -->
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import SubMenuItem from '@/components/SubMenuItem.vue'
import MessageNotification from '@/components/MessageNotification.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// 创建图标组件映射
const iconComponents = {}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  iconComponents[key] = component
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeTopMenu = ref('')
const activeSubMenu = ref(route.path)

// 一级菜单配置
const topMenus = ref([
  {
    key: 'clueLibrary',
    title: '线索库',
    icon: 'Document',
    children: [
      {
        key: 'clueList',
        title: '线索列表',
        icon: 'List',
        path: '/clue/list'
      },
      {
        key: 'clueStatistics',
        title: '线索统计',
        icon: 'DataAnalysis',
        path: '/clue/statistics'
      }
    ]
  },
  {
    key: 'reach',
    title: '触达',
    icon: 'ChatDotSquare',
    children: [
      {
        key: 'emailReach',
        title: '邮件触达',
        icon: 'Message',
        children: [
          {
            key: 'emailList',
            title: '邮件列表',
            icon: 'Document',
            path: '/email'
          },
          {
            key: 'emailDrafts',
            title: '我的草稿',
            icon: 'Edit',
            path: '/email/drafts'
          },
          {
            key: 'emailJobs',
            title: '我的任务',
            icon: 'List',
            path: '/email/jobs'
          },
          {
            key: 'emailSmtp',
            title: '邮件账号',
            icon: 'User',
            path: '/email/smtp'
          }
        ]
      },
      {
        key: 'smsReach',
        title: '短信触达',
        icon: 'ChatDotSquare',
        children: [
          {
            key: 'smsList',
            title: '短信列表',
            icon: 'Document',
            path: '/sms/list'
          },
          {
            key: 'smsDrafts',
            title: '短信草稿',
            icon: 'Edit',
            path: '/sms/drafts'
          },
          {
            key: 'smsJobs',
            title: '短信任务',
            icon: 'List',
            path: '/sms/jobs'
          },
          {
            key: 'smsConfig',
            title: '短信配置',
            icon: 'Setting',
            path: '/sms/config'
          }
        ]
      }
    ]
  },
  {
    key: 'community',
    title: '社群',
    icon: 'Connection',
    children: [
      {
        key: 'shortLink',
        title: '短链',
        icon: 'Link',
        path: '/shortLink'
      },
      {
        key: 'douyin',
        title: '抖音',
        icon: 'VideoPlay',
        children: [
          {
            key: 'douyinCard',
            title: '抖音卡片',
            icon: 'VideoPlay',
            path: '/douyinCard'
          },
          {
            key: 'douyinAutoReply',
            title: '抖音自动回复',
            icon: 'ChatDotRound',
            path: '/douyin/auto-reply'
          }
        ]
      },
      {
        key: 'xiaohongshu',
        title: '小红书',
        icon: 'Picture',
        children: [
          {
            key: 'xiaohongshuCard',
            title: '小红书卡片',
            icon: 'Picture',
            path: '/xiaohongshuCard'
          },
          {
            key: 'xiaohongshuAutoReply',
            title: '小红书自动回复',
            icon: 'ChatDotRound',
            path: '/xiaohongshu/auto-reply'
          }
        ]
      },
      {
        key: 'kuaishou',
        title: '快手',
        icon: 'Bell',
        children: [
          {
            key: 'kuaishouCard',
            title: '快手卡片',
            icon: 'Bell',
            path: '/kuaishouCard'
          },
          {
            key: 'kuaishouAutoReply',
            title: '快手自动回复',
            icon: 'ChatDotRound',
            path: '/kuaishou/auto-reply'
          }
        ]
      },
      {
        key: 'xianyu',
        title: '咸鱼',
        icon: 'ShoppingBag',
        children: [
          {
            key: 'xianyuCard',
            title: '咸鱼卡片',
            icon: 'ShoppingBag',
            path: '/xianyuCard'
          },
          {
            key: 'xianyuAutoReply',
            title: '咸鱼自动回复',
            icon: 'ChatDotRound',
            path: '/xianyu/auto-reply'
          }
        ]
      },
      {
        key: 'livecode',
        title: '活码',
        icon: 'QrCode',
        path: '/livecode'
      },
      {
        key: 'telegram',
        title: '电报社群',
        icon: 'ChatDotRound',
        children: [
          {
            key: 'telegramAccount',
            title: '机器人',
            icon: 'Cpu',
            path: '/telegram/account'
          },
          {
            key: 'telegramOrder',
            title: '订单',
            icon: 'List',
            path: '/telegram/order'
          },
          {
            key: 'telegramUser',
            title: '用户',
            icon: 'User',
            path: '/telegram/user'
          },
          {
            key: 'telegramGroup',
            title: '群组',
            icon: 'UserFilled',
            path: '/telegram/group'
          }
        ]
      },
      {
        key: 'whatsapp',
        title: 'WhatsApp',
        icon: 'ChatDotRound',
        children: [
          {
            key: 'whatsappAccount',
            title: '账号管理',
            icon: 'Cpu',
            path: '/whatsapp/account'
          },
          {
            key: 'whatsappDrafts',
            title: '草稿箱',
            icon: 'Document',
            path: '/whatsapp/drafts'
          },
          {
            key: 'whatsappJobs',
            title: '群发',
            icon: 'Promotion',
            path: '/whatsapp/jobs'
          }
        ]
      }
    ]
  },
  {
    key: 'system',
    title: '系统',
    icon: 'Setting',
    children: [
      {
        key: 'systemConfig',
        title: '站点设置',
        icon: 'Tools',
        path: '/system/config'
      },
      {
        key: 'systemObsConfig',
        title: '存储配置',
        icon: 'Cloud',
        path: '/system/obs-config'
      },
      {
        key: 'systemMaterialLibrary',
        title: '素材库',
        icon: 'Picture',
        path: '/system/material-library'
      },
      {
        key: 'systemMonitor',
        title: '监控',
        icon: 'Cpu',
        path: '/system/monitor'
      },
      {
        key: 'domainPool',
        title: '域名池',
        icon: 'Link',
        path: '/domainPool'
      },
      {
        key: 'userManagement',
        title: '用户管理',
        icon: 'User',
        path: '/user'
      }
    ]
  }
])

// 当前选中的一级菜单
const currentTopMenu = computed(() => {
  return topMenus.value.find(menu => menu.key === activeTopMenu.value)
})

// 递归检查菜单项是否包含当前路径
const hasActiveChild = (menu, path) => {
  if (menu.path === path) {
    return true
  }
  
  if (menu.children) {
    for (const child of menu.children) {
      if (hasActiveChild(child, path)) {
        return true
      }
    }
  }
  
  return false
}

// 递归查找第一个有路径的子菜单
const findFirstChild = (menu) => {
  if (menu.path) {
    return menu
  }
  
  if (menu.children) {
    for (const child of menu.children) {
      const result = findFirstChild(child)
      if (result) {
        return result
      }
    }
  }
  
  return null
}

// 监听路由变化，更新激活的菜单项
watch(() => route.path, (newPath) => {
  activeSubMenu.value = newPath
  
  // 根据当前路径确定激活的一级菜单
  for (const menu of topMenus.value) {
    if (hasActiveChild(menu, newPath)) {
      activeTopMenu.value = menu.key
      break
    }
  }
}, { immediate: true })

// 处理一级菜单选择
const handleTopMenuSelect = (key) => {
  activeTopMenu.value = key
  
  // 如果当前菜单有子菜单，默认导航到第一个子菜单
  const menu = topMenus.value.find(item => item.key === key)
  if (menu && menu.children) {
    const firstChild = findFirstChild(menu)
    if (firstChild) {
      router.push(firstChild.path)
    }
  }
}

// 处理子菜单选择
const handleSubMenuSelect = (path) => {
  router.push(path)
}

// 处理一键重置
const handleReset = () => {
  // 显示确认对话框
  ElMessageBox.confirm(
    '确定要重置系统吗？此操作将清除所有数据并恢复到初始状态。',
    '系统重置确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 用户点击确定，执行重置操作
    resetSystem()
  }).catch(() => {
    // 用户点击取消，不做任何操作
  })
}

// 处理用户下拉菜单命令
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      // 跳转到个人资料页面
      router.push('/profile')
      break
    case 'reset':
      // 处理一键重置
      handleReset()
      break
    case 'logout':
      // 退出登录
      userStore.logout()
      ElMessage.success('已退出登录')
      // 如果当前页面需要登录，跳转到登录页
      if (route.meta.requiresAuth) {
        router.push('/login')
      }
      break
  }
}

// 处理登录按钮点击
const handleLogin = () => {
  router.push('/login')
}

// 重置系统函数
const resetSystem = async () => {
  try {
    // 调用重置API
    const response = await fetch('/api/system/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      // 重置前端配置
      const { resetConfig } = await import('@/utils/configManager')
      const result = await resetConfig()
      
      if (result.success) {
        // 更新请求实例配置
        const { updateRequestConfig } = await import('@/utils/request')
        updateRequestConfig()
        
        // 清除初始化状态
        const { resetInitialization } = await import('@/utils/initHelper')
        resetInitialization()
        
        ElMessage.success('系统重置成功，即将跳转到初始化页面')
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.push('/setup')
        }, 1500)
      } else {
        ElMessage.error(`重置失败: ${result.error}`)
      }
    } else {
      const errorData = await response.json()
      ElMessage.error(`重置失败: ${errorData.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('重置系统时出错:', error)
    ElMessage.error('重置系统时出错，请稍后再试')
  }
}

// 组件挂载时初始化请求配置
onMounted(async () => {
  try {
    // 更新请求实例配置
    const { updateRequestConfig } = await import('@/utils/request')
    await updateRequestConfig()
  } catch (error) {
    console.error('初始化请求配置失败:', error)
  }
})
</script>

<style scoped>
.el-header {
  background-color: #545c64;
  color: #fff;
  line-height: 60px;
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  margin-right: 40px;
  color: #fff;
}

.top-menu {
  flex: 1;
}

.el-aside {
  background-color: #545c64;
  border-right: 1px solid #e6e6e6;
}

.el-main {
  background-color: #fff;
  padding: 20px;
}

/* 用户信息样式 */
.user-info {
  margin-left: 15px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-dropdown .el-icon {
  margin-right: 5px;
}

/* 登录按钮样式 */
.login-button {
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer;
  padding: 0 15px;
  margin-left: 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.login-button .el-icon {
  margin-right: 5px;
}

/* 菜单过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
