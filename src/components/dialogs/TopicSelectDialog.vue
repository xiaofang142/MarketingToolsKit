<template>
  <el-dialog  :model-value="visible" @update:model-value="$emit('update:visible', $event)" title="话题选择" width="800px" class="material-library-dialog">
            <div class="topic-dialog-content">
              <!-- 自定义话题输入 -->
              <div class="custom-topic-input">
                <el-input style="width:90%;"
                  v-model="customTopic"
                  placeholder="输入自定义话题"
                  class="custom-input"
                >
                  <template #prepend>#</template>
                </el-input>
                <el-button  type="primary" @click="addCustomTopic">添加</el-button>
              </div>

              <!-- 推荐话题 -->
              <div class="recommended-topics">
                <h4>选择话题</h4>
                <div class="topic-grid">
                  <el-button
                    v-for="topic in filteredTopics"
                     :key="topic.id" 
                     :type="hadTopic(topic) ? 'primary' : 'default'"
                     @click="clickSelectTopic(topic)"
                    class="topic-btn" >
                    #{{ topic.name }}
                  </el-button>
                </div>
              </div>
            </div>

            <template #footer>
              <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
              </div>
            </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage, ElMessageBox } from 'element-plus'
import { topicApi } from '@/api/topic'

const appStore = useAppStore()

defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'confirm'])

const selectedTopics = ref([])
const isUploading = ref(false)
const customTopic = ref('')

const handleCancel = () => {
  emit('confirm', [])
  emit('update:visible', false)
}
// 切换推荐话题
const clickSelectTopic = (topic) => {
  const exists =  selectedTopics.value.some(t => t.id === topic.id)
  if (!exists) {
    selectedTopics.value.push(topic)
  } else {
    // 找到索引位置并删除
    const index = selectedTopics.value.findIndex(t => t.id === topic.id)
    selectedTopics.value.splice(index, 1)
  }
}
const hadTopic = (topic) => {
 const exists =  selectedTopics.value.some(t => t.id === topic.id)
 return exists
}
const handleConfirm = () => {
  console.log('handleConfirm',selectedTopics.value) 
  emit('confirm', selectedTopics.value)
  emit('update:visible', false)
  selectedTopics.value = []
}

// 提交上传
const addCustomTopic = async () => {
  if (!customTopic.value) {
    return ElMessage.warning('请输入话题名称')
  }
  isUploading.value = true
  
  try {
    const formData = {name: customTopic.value}
    const response = await topicApi.addOneTopic(formData)
    if (response.code !== 200) {
       ElMessage.error(response.msg || '上传失败')
    }
    ElMessage.success('添加成功')
    categoryDialogVisible.value = false
    fetchTopic()
  } catch (error) {
    ElMessage.error('添加失败: ' + (error.msg || '未知错误'))
  } finally {
    isUploading.value = false
  }
}
const fetchTopic = async () => {
  try {
    const response = await topicApi.getAllTopic()
    
    if (response.code === 200) {
      appStore.setTopics(response.data)
      ElMessage.success('刷新成功')
    } else {
      ElMessage.error('获取话题列表失败')
    }
  } catch (error) {
    ElMessage.error('获取素话题表失败')
  }
}
const filteredTopics = computed(() => {
  return appStore.topics
})
onMounted(() => {
  fetchTopic()
})
</script>

<style scoped>
.active{
  background-color: aquamarine;
}
/* 样式从原文件迁移 */
.material-library-content {
  max-height: 400px;
  overflow-y: auto;
}

.material-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.material-info {
  margin-left: 10px;
}

.material-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.material-details {
  font-size: 12px;
  color: #909399;
}

.file-size {
  margin-right: 15px;
}
</style>