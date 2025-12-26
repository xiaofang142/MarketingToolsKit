<template>
  <div class="douyin-card-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>抖音卡片管理</span>
          <div class="header-actions">
            <el-button type="primary" icon="DataAnalysis" @click="goToStats">
              统计分析
            </el-button>
            <el-button type="primary" icon="Plus" @click="handleAdd">
              添加卡片
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="标题、描述或标签" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.is_active" placeholder="请选择" clearable>
            <el-option label="激活" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 抖音卡片列表 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-image 
              style="width: 100px; height: 100px" 
              :src="scope.row.image_url" 
              :preview-src-list="[scope.row.image_url]"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="view_count" label="浏览数" width="100" />
        <el-table-column prop="is_active" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.is_active ? 'success' : 'danger'">
              {{ scope.row.is_active ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="small" type="primary" @click="handleStats(scope.row)">统计</el-button>
            <el-button size="small" type="info" @click="handleCopyLink(scope.row)">复制链接</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.page_size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1000px"
      @close="handleDialogClose"
    >
      <div class="dialog-content">
        <!-- 左侧表单 -->
        <div class="form-section">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入卡片标题" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="请输入卡片描述"
              />
            </el-form-item>
            <el-form-item label="图片URL" prop="image_url">
              <el-input v-model="form.image_url" placeholder="请输入图片URL" />
            </el-form-item>
            <el-form-item label="跳转链接" prop="redirect_url">
              <el-input v-model="form.redirect_url" placeholder="请输入跳转链接" />
            </el-form-item>
            <el-form-item label="域名池" prop="domain_pool_id">
              <el-select 
                v-model="form.domain_pool_id" 
                placeholder="请选择域名池" 
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in domainPoolOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.domain }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
              <el-input v-model="form.tags" placeholder="请输入标签，多个标签用逗号分隔" />
            </el-form-item>
            <el-form-item label="状态" prop="is_active">
              <el-switch v-model="form.is_active" active-text="激活" inactive-text="禁用" />
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 右侧预览 -->
        <div class="preview-section">
          <DouyinCardPreview 
          :card-data="form" 
          @view="handlePreviewView"
        />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import DouyinCardPreview from '@/components/DouyinCardPreview.vue'
import { domainPoolApi } from '@/api/domainPool'
import {
  getDouyinCardList,
  getDouyinCard,
  createDouyinCard,
  updateDouyinCard,
  deleteDouyinCard,
  generateShortLink
} from '@/api/douyinCard'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加抖音卡片')
const formRef = ref(null)
const router = useRouter()

// 域名池数据
const domainPoolOptions = ref([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  is_active: null
})

// 分页数据
const pagination = reactive({
  page: 1,
  page_size: 10,
  total: 0
})

// 表单数据
const form = reactive({
  id: null,
  title: '',
  description: '',
  image_url: '',
  redirect_url: '',
  tags: '',
  is_active: true,
  domain_pool_id: null
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入卡片标题', trigger: 'blur' },
    { max: 255, message: '标题长度不能超过255个字符', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '描述长度不能超过500个字符', trigger: 'blur' }
  ],
  image_url: [
    { required: true, message: '请输入图片URL', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  redirect_url: [
    { required: true, message: '请输入跳转链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ],
  tags: [
    { max: 255, message: '标签长度不能超过255个字符', trigger: 'blur' }
  ]
}

// 获取域名池列表
const getDomainPoolList = async () => {
  try {
    const res = await domainPoolApi.getList({ page: 1, page_size: 100 })
    if (res.code === 200 || res.code === 0) {
      domainPoolOptions.value = res.data.list || []
    } else {
      ElMessage.error(res.message || '获取域名池列表失败')
    }
  } catch (error) {
    ElMessage.error('获取域名池列表失败')
    console.error(error)
  }
}

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.page_size,
      keyword: searchForm.keyword,
      is_active: searchForm.is_active
    }
    const res = await getDouyinCardList(params)
    if (res.code === 200 || res.code === 0) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取列表失败')
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.is_active = null
  pagination.page = 1
  getList()
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.page_size = size
  getList()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.page = page
  getList()
}

// 添加
const handleAdd = () => {
  dialogTitle.value = '添加抖音卡片'
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row) => {
  dialogTitle.value = '编辑抖音卡片'
  try {
    const res = await getDouyinCard(row.id)
    if (res.code === 200 || res.code === 0) {
      Object.assign(form, res.data)
      dialogVisible.value = true
    } else {
      ElMessage.error(res.message || '获取详情失败')
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
    console.error(error)
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该抖音卡片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteDouyinCard(row.id)
      if (res.code === 200 || res.code === 0) {
        ElMessage.success('删除成功')
        getList()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (form.id) {
          // 更新
          res = await updateDouyinCard(form)
        } else {
          // 创建
          res = await createDouyinCard(form)
        }
        
        if (res.code === 200 || res.code === 0) {
          ElMessage.success(form.id ? '更新成功' : '创建成功')
          dialogVisible.value = false
          getList()
        } else {
          ElMessage.error(res.message || (form.id ? '更新失败' : '创建失败'))
        }
      } catch (error) {
        ElMessage.error(form.id ? '更新失败' : '创建失败')
        console.error(error)
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.title = ''
  form.description = ''
  form.image_url = ''
  form.redirect_url = 'https://www.douyin.com'
  form.tags = ''
  form.is_active = true
  form.domain_pool_id = null
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 预览相关方法
const handlePreviewView = (cardData) => {
  ElMessage.info('预览模式下的查看功能')
}

// 统计
const handleStats = (row) => {
  router.push(`/douyin-card-stats/${row.id}`)
}

// 跳转到统计页面
const goToStats = () => {
  router.push('/douyin/stats')
}

// 复制链接
const handleCopyLink = async (row) => {
  try {
    // 优先使用短链接，如果没有则使用原始链接
    let linkUrl = ''
    if (row.short_link_url) {
      // 如果有短链接，使用完整域名
      linkUrl = window.location.origin + row.short_link_url
    } else {
      // 如果没有短链接，先生成短链接
      try {
        const res = await generateShortLink(row.id)
        if (res.code === 200 || res.code === 0) {
          linkUrl = window.location.origin + res.data.short_link_url
          // 更新列表中的数据
          row.short_link_url = res.data.short_link_url
          row.short_code = res.data.short_code
        } else {
          // 生成短链接失败，使用原始链接
          linkUrl = row.redirect_url || window.location.origin + '/douyin/card/' + row.id
        }
      } catch (apiError) {
        console.error('生成短链接API调用失败:', apiError)
        // 生成短链接失败，使用原始链接
        linkUrl = row.redirect_url || window.location.origin + '/douyin/card/' + row.id
      }
    }
    
    // 尝试使用现代浏览器的剪贴板API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(linkUrl)
      ElMessage.success('链接已复制到剪贴板')
    } else {
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement('textarea')
      textArea.value = linkUrl
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
        ElMessage.success('链接已复制到剪贴板')
      } catch (copyError) {
        ElMessage.error('复制链接失败，请手动复制链接')
        console.error('复制失败:', copyError)
      } finally {
        document.body.removeChild(textArea)
      }
    }
  } catch (error) {
    ElMessage.error('复制链接失败')
    console.error('复制链接错误:', error)
  }
}

// 初始化
onMounted(() => {
  getList()
  getDomainPoolList()
})
</script>

<style scoped>
.douyin-card-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-content {
  display: flex;
  gap: 20px;
}

.form-section {
  flex: 1;
  max-width: 500px;
}

.preview-section {
  flex: 1;
  max-width: 400px;
  border-left: 1px solid #ebeef5;
  padding-left: 20px;
}
</style>