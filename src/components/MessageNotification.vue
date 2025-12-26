<template>
  <div v-if="hasNewMessage && !dismissed" class="message-notification">
    <div class="message-content">
      <div class="message-header">
        <el-icon><Bell /></el-icon>
        <span class="message-title">{{ currentMessage.title }}</span>
      </div>
      <div class="message-body">
        <p>{{ currentMessage.content }}</p>
      </div>
      <div class="message-actions">
        <el-button type="primary" size="small" @click="markAsRead">知道了</el-button>
        <el-button type="text" size="small" @click="dismiss">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
import { platformAPI } from '@/api/platform'

const hasNewMessage = ref(false)
const dismissed = ref(false)
const currentMessage = ref({
  id: '',
  title: '',
  content: ''
})

let checkInterval = null

// 检查新消息
const checkNewMessage = async () => {
  try {
    const response = await platformAPI.getLatestMessage()
    if (response && response.data) {
      const message = response.data
      // 检查是否是新消息（简单判断：如果消息ID不同或者是第一次获取）
      if (message.id && message.id !== currentMessage.value.id) {
        currentMessage.value = message
        hasNewMessage.value = true
        dismissed.value = false
      }
    }
  } catch (error) {
    console.error('获取最新消息失败:', error)
  }
}

// 标记为已读
const markAsRead = async () => {
  try {
    if (currentMessage.value.id) {
      await platformAPI.markMessageRead(currentMessage.value.id)
    }
    hasNewMessage.value = false
    dismissed.value = true
    ElMessage.success('消息已标记为已读')
  } catch (error) {
    console.error('标记消息已读失败:', error)
    ElMessage.error('标记消息已读失败')
  }
}

// 关闭消息
const dismiss = () => {
  hasNewMessage.value = false
  dismissed.value = true
}

onMounted(() => {
  // 立即检查一次
  checkNewMessage()
  
  // 每30秒检查一次新消息
  checkInterval = setInterval(checkNewMessage, 30000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<style scoped>
.message-notification {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 320px;
  animation: slideInRight 0.3s ease-out;
}

.message-content {
  padding: 16px;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.message-header .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.message-title {
  font-size: 14px;
}

.message-body {
  margin-bottom: 12px;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.message-body p {
  margin: 0;
}

.message-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.message-notification.hide {
  animation: slideOutRight 0.3s ease-out;
}
</style>