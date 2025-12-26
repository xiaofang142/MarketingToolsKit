<template>
  <div class="sms-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>短信列表</span>
          <el-button type="primary">发送短信</el-button>
        </div>
      </template>
      
      <div class="search-form">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="待发送" value="pending" />
              <el-option label="发送中" value="sending" />
              <el-option label="已发送" value="sent" />
              <el-option label="发送失败" value="failed" />
            </el-select>
          </el-form-item>
          <el-form-item label="发送时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table :data="smsList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="content" label="短信内容" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="handleResend(scope.row)" v-if="scope.row.status === 'failed'">重发</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import smsApi from '@/api/sms'

// 搜索表单
const searchForm = ref({
  phone: '',
  status: '',
  dateRange: []
})

// 短信列表数据
const smsList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'info',
    sending: 'warning',
    sent: 'success',
    failed: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待发送',
    sending: '发送中',
    sent: '已发送',
    failed: '发送失败'
  }
  return statusMap[status] || '未知'
}

// 获取短信列表
const getSmsList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      phone: searchForm.value.phone,
      status: searchForm.value.status,
      startDate: searchForm.value.dateRange?.[0] || '',
      endDate: searchForm.value.dateRange?.[1] || ''
    }
    const response = await smsApi.getSmsList(params)
    smsList.value = response.data.list || []
    total.value = response.data.total || 0
  } catch (error) {
    ElMessage.error('获取短信列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getSmsList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    phone: '',
    status: '',
    dateRange: []
  }
  handleSearch()
}

// 查看
const handleView = async (row) => {
  try {
    const response = await smsApi.getSmsDetail(row.id)
    ElMessageBox.alert(JSON.stringify(response.data, null, 2), '短信详情')
  } catch (error) {
    ElMessage.error('获取短信详情失败')
  }
}

// 重发
const handleResend = async (row) => {
  try {
    await smsApi.resendSms(row.id)
    ElMessage.success('短信重发成功')
    getSmsList()
  } catch (error) {
    ElMessage.error('短信重发失败')
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getSmsList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getSmsList()
}

onMounted(() => {
  getSmsList()
})
</script>

<style scoped>
.sms-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>