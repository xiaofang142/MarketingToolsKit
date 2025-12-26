<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="批量发布进度"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="publish-progress">
      <el-progress 
        :percentage="progress"
        :status="progress === 100 ? 'success' : ''"
      />
      <div v-if="currentPublishingTab" class="current-publishing">
        正在发布：{{ currentPublishingTab.label }}
      </div>
      
      <!-- 发布结果列表 -->
      <div class="publish-results" v-if="results.length > 0">
        <div 
          v-for="(result, index) in results" 
          :key="index"
          :class="['result-item', result.status]"
        >
          <el-icon v-if="result.status === 'success'"><Check /></el-icon>
          <el-icon v-else-if="result.status === 'error'"><Close /></el-icon>
          <el-icon v-else><InfoFilled /></el-icon>
          <span class="label">{{ result.label }}</span>
          <span class="message">{{ result.msg }}</span>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button 
          @click="handleCancel"
          :disabled="progress === 100"
        >
          取消发布
        </el-button>
        <el-button 
          type="primary" 
          @click="handleClose"
          v-if="progress === 100"
        >
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Check, Close, InfoFilled } from '@element-plus/icons-vue'

defineProps({
  visible: Boolean,
  progress: Number,
  currentPublishingTab: Object,
  results: Array
})

defineEmits(['update:visible', 'cancel', 'close'])

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
/* 样式从原文件迁移 */
.publish-progress {
  padding: 10px 0;
}

.current-publishing {
  margin: 15px 0;
  color: #606266;
}

.publish-results {
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.result-item.success .label {
  color: #67c23a;
}

.result-item.error .label {
  color: #f56c6c;
}

.label {
  margin-left: 10px;
  flex: 1;
}

.message {
  color: #909399;
  font-size: 12px;
}
</style>