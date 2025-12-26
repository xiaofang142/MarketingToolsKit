<template>
  <el-dialog  :model-value="visible" @update:model-value="$emit('update:visible', $event)" title="账号库选择" width="800px" class="material-library-dialog">
    <div class="material-library-content" style="display: flex;">
      <div style="width:200px; height: 400px;overflow-y: auto;">
          <div class="material-list">
            <div class="material-item"  @click="handleCategoryClick(0)" :class="{ active: 0 === searchPaltformType }">
                <div class="material-info">
                  <div class="material-name">全部</div>
                </div>
            </div>
          </div>
          <div class="material-list">
            <div v-for="platform in platformMap" :key="platform.value" class="material-item"  @click="handleCategoryClick(platform.value)" :class="{ active: platform.value === searchPaltformType }">
                <div class="material-info">
                  <div class="material-name">{{ platform.label }}</div>
                </div>
            </div>
          </div>
      </div>
      <div style="flex:1;height: 400px;overflow-y: auto;">
        <el-input  v-model="searchKeyword" clearable placeholder="输入账号搜索" prefix-icon="Search" />
        <el-checkbox-group v-model="selectedAccounts">
          <div class="material-list">
            <div
              v-for="account in filteredAccounts"
              :key="account.id"
              class="material-item"
            >
              <el-checkbox :label="account.id" class="material-checkbox">
                <div class="material-info">
                  <div class="material-name">{{ account.name }}</div>
                </div>
              </el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
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
import { defineProps, defineEmits, ref, computed,reactive,onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useAccountStore } from '@/stores/account'
import { accountApi } from '@/api/account'
import {getPlatformMap } from '@/utils/map'

// 获取账号状态管理
const accountStore = useAccountStore()
// 获取应用状态管理
const appStore = useAppStore()


const platformMap = getPlatformMap()

defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'confirm'])

const selectedAccounts = ref([])

const handleCancel = () => {
  emit('confirm', [])
  emit('update:visible', false)
}

const handleConfirm = () => {
  const ids = selectedAccounts.value
  const list = []
  if(ids && ids.length > 0){
    for (let i = ids.length - 1; i >= 0; i--) {
      const id = ids[i]
      console.log('id', id)
      const account = accountStore.accounts.find(m => m.id === id)
      if (account) {
        list.push(account)
      }
    }
  }
  emit('confirm', list)
  emit('update:visible', false)
  selectedAccounts.value = []
}

const handleCategoryClick = (id) => {
  searchPaltformType.value = id
}

// 页面加载时获取账号数据
onMounted(() => {
  // 只有第一次进入时才获取数据
  fetchAccounts()
})
// 获取账号数据
const fetchAccounts = async () => {
  try {
    const res = await accountApi.getValidAccounts()
    if (res.code === 200 && res.data) {
      accountStore.setAccounts(res.data)
      ElMessage.success('账号数据获取成功')
    } else {
      ElMessage.error('获取账号数据失败')
    }
  } catch (error) {
    ElMessage.error('获取账号数据失败')
  } finally {
    appStore.setAccountRefreshing(false)
  }
}

// 过滤素材
const searchKeyword = ref('')
const searchPaltformType = ref(0)
const filteredAccounts = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  const type = searchPaltformType.value
  if (!keyword && type < 1) return accountStore.accounts
  // 如果有分类id或者关键词锁执行过滤
  return accountStore.accounts.filter(account => 
    (type < 1 || (account.type == type)) && (!keyword || (account.name.toLowerCase().includes(keyword)) )
  )
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