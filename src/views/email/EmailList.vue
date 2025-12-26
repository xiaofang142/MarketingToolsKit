<template>
  <div class="email-list">
    <div class="page-header">
      <h1>邮件列表</h1>
    </div>
    
    <div class="table-container">
      <el-table :data="emailList" style="width: 100%" v-loading="loading">
        <el-table-column prop="subject" label="主题" width="200" />
        <el-table-column prop="to" label="收件人" width="150" />
        <el-table-column prop="from" label="发件人" width="150" />
        <el-table-column label="是否发送" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.is_send > 0 ? 'success' : 'info'">
              {{ scope.row.is_send > 0 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" width="150">
          <template #default="scope">
            {{ scope.row.is_send > 0 ? scope.row.send_time : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="是否阅读" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.is_read > 0 ? 'success' : 'info'">
              {{ scope.row.is_read > 0 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="阅读时间" width="150">
          <template #default="scope">
            {{ scope.row.is_read > 0 ? scope.row.read_time : '-' }}
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination 
          v-model:current-page="emailPage"
          :page-size="emailLimit"
          :total="emailTotal"
          @current-change="handlePageChange"
          layout="prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { emailApi } from '@/api/email'

const emailList = ref([])
const emailTotal = ref(0)
const emailPage = ref(1)
const emailLimit = ref(10)
const loading = ref(false) // 添加加载状态

const handlePageChange = (number) => {
  // 防止重复点击同一页码
  if (emailPage.value === number) return
  emailPage.value = number
  fetchEmailList()
}

const fetchEmailList = async () => {
  console.log('loading.value',loading.value)
  // 防止并发请求
  if (loading.value) return
  loading.value = true
  try {
    const response = await emailApi.getEmailList(emailPage.value, emailLimit.value)
    console.log('API响应数据:', response)
    // 根据实际API返回结构获取数据
    emailList.value = response.data?.list || []
    emailTotal.value = response.data?.total || 0
    
    console.log('邮件列表数据:', emailList.value)
    console.log('邮件总数:', emailTotal.value)
  } catch (error) {
    console.error('获取邮件列表失败:', error)
    ElMessage.error('获取邮件列表失败')
  } finally {
    loading.value = false
  }
}
// 组件挂载时获取素材列表
onMounted(() => {
  fetchEmailList()
})

</script>

<style lang="scss" scoped>
.email-list {
  padding: 20px;
  
  .page-header {
    margin-bottom: 20px;
    
    h1 {
      font-size: 24px;
      color: #303133;
      margin: 0;
    }
  }
  
  .table-container {
    background: #fff;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>