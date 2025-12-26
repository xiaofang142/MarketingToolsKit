<template>
  <div class="livecode-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>活码管理</span>
          <el-button type="primary" @click="handleAdd">新增活码</el-button>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="活码名称">
            <el-input v-model="searchForm.name" placeholder="请输入活码名称" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 表格 -->
      <el-table :data="liveCodeList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="活码名称" />
        <el-table-column prop="short_link" label="短链" />
        <el-table-column prop="full_short_link" label="完整短链" min-width="200">
          <template #default="scope">
            <el-link :href="scope.row.full_short_link" target="_blank" type="primary">
              {{ scope.row.full_short_link }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="total_views" label="总访问量" width="100" />
        <el-table-column prop="today_views" label="今日访问" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click="handleViewQR(scope.row)">二维码</el-button>
            <el-button type="info" size="small" @click="handleStats(scope.row)">统计</el-button>
            <el-button type="warning" size="small" @click="handleShare(scope.row)">分享</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="liveCodeFormRef"
        :model="liveCodeForm"
        :rules="liveCodeRules"
        label-width="120px"
      >
        <el-form-item label="活码名称" prop="name">
          <el-input v-model="liveCodeForm.name" />
        </el-form-item>
        <el-form-item label="短链" prop="short_link">
          <el-input v-model="liveCodeForm.short_link" />
        </el-form-item>
        <el-form-item label="短链域名ID" prop="short_domain_id">
          <el-input-number v-model="liveCodeForm.short_domain_id" :min="1" />
        </el-form-item>
        <el-form-item label="入口域名ID" prop="entry_domain_id">
          <el-input-number v-model="liveCodeForm.entry_domain_id" :min="1" />
        </el-form-item>
        <el-form-item label="落地域名ID" prop="landing_domain_id">
          <el-input-number v-model="liveCodeForm.landing_domain_id" :min="1" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image_url">
          <el-input v-model="liveCodeForm.image_url" />
        </el-form-item>
        <el-form-item label="入口URL" prop="entry_url">
          <el-input v-model="liveCodeForm.entry_url" />
        </el-form-item>
        <el-form-item label="落地URL" prop="landing_url">
          <el-input v-model="liveCodeForm.landing_url" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="liveCodeForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 二维码管理对话框 -->
    <el-dialog
      v-model="qrDialogVisible"
      title="二维码管理"
      width="800px"
    >
      <div class="qr-header">
        <el-button type="primary" @click="handleAddQR">新增二维码</el-button>
      </div>
      
      <el-table :data="qrList" style="width: 100%" v-loading="qrLoading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="daily_limit" label="每日限制" width="100">
            <template #default="scope">
              {{ scope.row.daily_limit }}次
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEditQR(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteQR(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="qrDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增/编辑二维码对话框 -->
    <el-dialog
      v-model="qrFormVisible"
      :title="qrFormTitle"
      width="500px"
      @close="handleQRFormClose"
    >
      <el-form
        ref="qrFormRef"
        :model="qrForm"
        :rules="qrRules"
        label-width="120px"
      >
        <el-form-item label="每日限制" prop="daily_limit">
          <el-input-number 
            v-model="qrForm.daily_limit" 
            :min="50" 
            :max="500" 
            :step="50"
            controls-position="right"
          />
          <span style="margin-left: 10px;">次</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="qrForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="qrFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleQRSubmit" :loading="qrSubmitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 统计对话框 -->
    <el-dialog
      v-model="statsDialogVisible"
      title="活码统计"
      width="800px"
    >
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ statsData.total_views || 0 }}</div>
                <div class="stats-label">总浏览量</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ statsData.today_views || 0 }}</div>
                <div class="stats-label">今日浏览</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ statsData.active_qr_count || 0 }}</div>
                <div class="stats-label">活跃二维码</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card">
              <div class="stats-item">
                <div class="stats-value">{{ statsData.total_qr_count || 0 }}</div>
                <div class="stats-label">总二维码数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <div class="chart-container" style="margin-top: 20px;">
          <div id="statsChart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getLiveCodes, 
  createLiveCode, 
  updateLiveCode, 
  deleteLiveCode, 
  getLiveCodeStats,
  getLiveCodeQRs,
  generateLiveCodeQR,
  deleteLiveCodeQR,
  updateLiveCodeQR,
  shareLiveCode
} from '@/api/livecode'

// 数据
const loading = ref(false)
const submitLoading = ref(false)
const qrLoading = ref(false)
const qrSubmitLoading = ref(false)
const liveCodeList = ref([])
const qrList = ref([])
const dialogVisible = ref(false)
const qrDialogVisible = ref(false)
const qrFormVisible = ref(false)
const statsDialogVisible = ref(false)
const dialogTitle = ref('')
const qrFormTitle = ref('')
const liveCodeFormRef = ref()
const qrFormRef = ref()
const currentLiveCodeId = ref(null)
const statsData = ref({})

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 活码表单
const liveCodeForm = reactive({
  id: null,
  name: '',
  short_link: '',
  short_domain_id: 1,
  entry_domain_id: 1,
  landing_domain_id: 1,
  status: 1,
  image_url: '',
  entry_url: '',
  landing_url: ''
})

// 二维码表单
const qrForm = reactive({
  id: null,
  daily_limit: 200,
  status: 1
})

// 表单验证规则
const liveCodeRules = {
  name: [
    { required: true, message: '请输入活码名称', trigger: 'blur' },
    { min: 2, max: 50, message: '活码名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  short_link: [
    { required: true, message: '请输入短链', trigger: 'blur' }
  ],
  short_domain_id: [
    { required: true, message: '请输入短链域名ID', trigger: 'blur', type: 'number' }
  ],
  entry_domain_id: [
    { required: true, message: '请输入入口域名ID', trigger: 'blur', type: 'number' }
  ],
  landing_domain_id: [
    { required: true, message: '请输入落地域名ID', trigger: 'blur', type: 'number' }
  ]
}

// 二维码验证规则
const qrRules = {
  daily_limit: [
    { required: true, message: '请输入每日限制', trigger: 'blur', type: 'number' }
  ]
}



// 获取活码列表
const fetchLiveCodeList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    // 只添加非空的搜索参数
    if (searchForm.name) {
      params.name = searchForm.name
    }
    if (searchForm.status !== '') {
      params.status = searchForm.status
    }
    
    const response = await getLiveCodes(params)
    liveCodeList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取活码列表失败')
  } finally {
    loading.value = false
  }
}

// 获取二维码列表
const fetchQRList = async (liveCodeId) => {
  qrLoading.value = true
  try {
    const response = await getLiveCodeQRs(liveCodeId)
    qrList.value = response.data
  } catch (error) {
    ElMessage.error('获取二维码列表失败')
  } finally {
    qrLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchLiveCodeList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
  pagination.page = 1
  fetchLiveCodeList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchLiveCodeList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.page = val
  fetchLiveCodeList()
}

// 新增活码
const handleAdd = () => {
  dialogTitle.value = '新增活码'
  dialogVisible.value = true
  
  // 重置表单
  Object.assign(liveCodeForm, {
    id: null,
    name: '',
    short_link: '',
    short_domain_id: 1,
    entry_domain_id: 1,
    landing_domain_id: 1,
    status: 1,
    image_url: '',
    entry_url: '',
    landing_url: ''
  })
}

// 编辑活码
const handleEdit = (row) => {
  dialogTitle.value = '编辑活码'
  dialogVisible.value = true
  
  // 填充表单
  Object.assign(liveCodeForm, {
    id: row.id,
    name: row.name,
    short_link: row.short_link,
    short_domain_id: row.short_domain_id,
    entry_domain_id: row.entry_domain_id,
    landing_domain_id: row.landing_domain_id,
    status: row.status,
    image_url: row.image_url,
    entry_url: row.entry_url,
    landing_url: row.landing_url
  })
}

// 删除活码
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除活码 "${row.name}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteLiveCode(row.id)
        ElMessage.success('删除成功')
        fetchLiveCodeList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 查看二维码
const handleViewQR = (row) => {
  currentLiveCodeId.value = row.id
  qrDialogVisible.value = true
  fetchQRList(row.id)
}

// 新增二维码
const handleAddQR = () => {
  qrFormTitle.value = '新增二维码'
  qrFormVisible.value = true
  
  // 重置表单
  Object.assign(qrForm, {
    id: null,
    daily_limit: 200,
    status: 1
  })
}

// 编辑二维码
const handleEditQR = (row) => {
  qrFormTitle.value = '编辑二维码'
  qrFormVisible.value = true
  
  // 填充表单
  Object.assign(qrForm, {
    id: row.id,
    daily_limit: row.daily_limit,
    status: row.status
  })
}

// 删除二维码
const handleDeleteQR = (row) => {
  ElMessageBox.confirm(
    `确定要删除二维码 "${row.name}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteLiveCodeQR(row.id)
        ElMessage.success('删除成功')
        fetchQRList(currentLiveCodeId.value)
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 查看统计
const handleStats = async (row) => {
  try {
    const response = await getLiveCodeStats(row.id)
    statsData.value = response.data
    statsDialogVisible.value = true
    
    // 这里可以添加图表初始化代码
    // nextTick(() => {
    //   initChart()
    // })
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

// 分享活码
const handleShare = async (row) => {
  try {
    const response = await shareLiveCode(row.id, {})
    const shareUrl = response.data.share_url
    
    // 创建一个临时的输入框来复制链接
    const input = document.createElement('input')
    input.value = shareUrl
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    
    ElMessage.success('分享链接已复制到剪贴板')
  } catch (error) {
    ElMessage.error('分享失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!liveCodeFormRef.value) return
  
  try {
    await liveCodeFormRef.value.validate()
    submitLoading.value = true
    
    if (liveCodeForm.id) {
      // 编辑活码
      await updateLiveCode(liveCodeForm.id, liveCodeForm)
      ElMessage.success('更新成功')
    } else {
      // 新增活码
      await createLiveCode(liveCodeForm)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    fetchLiveCodeList()
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitLoading.value = false
  }
}

// 提交二维码表单
const handleQRSubmit = async () => {
  if (!qrFormRef.value) return
  
  try {
    await qrFormRef.value.validate()
    qrSubmitLoading.value = true
    
    if (qrForm.id) {
      // 编辑二维码
      await updateLiveCodeQR(qrForm.id, qrForm)
      ElMessage.success('更新成功')
    } else {
      // 新增二维码
      await generateLiveCodeQR(currentLiveCodeId.value, qrForm)
      ElMessage.success('创建成功')
    }
    
    qrFormVisible.value = false
    fetchQRList(currentLiveCodeId.value)
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    qrSubmitLoading.value = false
  }
}

// 对话框关闭
const handleDialogClose = () => {
  if (liveCodeFormRef.value) {
    liveCodeFormRef.value.resetFields()
  }
}

// 二维码表单对话框关闭
const handleQRFormClose = () => {
  if (qrFormRef.value) {
    qrFormRef.value.resetFields()
  }
}

// 初始化
onMounted(() => {
  fetchLiveCodeList()
})
</script>

<style scoped>
.livecode-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.qr-header {
  margin-bottom: 20px;
}

.stats-container {
  padding: 10px 0;
}

.stats-card {
  text-align: center;
}

.stats-item {
  padding: 10px 0;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}
</style>