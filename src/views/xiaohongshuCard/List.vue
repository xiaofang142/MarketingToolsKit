<template>
  <div class="xiaohongshu-card-container">
    <!-- 卡片列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>小红书卡片管理</span>
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
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.isActive" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-image
              v-if="scope.row.image_url"
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              style="width: 80px; height: 60px"
              fit="cover"
            />
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column label="跳转链接" width="150">
          <template #default="scope">
            <el-link v-if="scope.row.redirect_url" :href="scope.row.redirect_url" target="_blank" type="primary">
              访问链接
            </el-link>
            <span v-else>无链接</span>
          </template>
        </el-table-column>
        <el-table-column label="统计数据" width="100">
          <template #default="scope">
            <div>
              <span>浏览: {{ scope.row.view_count }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.is_active ? 'success' : 'danger'">
              {{ scope.row.is_active ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="info" @click="handleStats(scope.row)">统计</el-button>
              <el-button size="small" type="info" @click="handleCopyLink(scope.row)">复制链接</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
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
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述"
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
              <el-switch v-model="form.is_active" />
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 右侧预览 -->
        <div class="preview-section">
          <XiaohongshuCardPreview 
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import XiaohongshuCardPreview from '@/components/XiaohongshuCardPreview.vue'
import { domainPoolApi } from '@/api/domainPool'
import { getXiaohongshuCardList, createXiaohongshuCard, updateXiaohongshuCard, deleteXiaohongshuCard, generateShortLink } from '@/api/xiaohongshuCard'

// 路由
const router = useRouter()

// 域名池数据
const domainPoolOptions = ref([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  isActive: null
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()// 表单数据
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

// 表单校验规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 100, message: '标题长度不能超过100个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' },
    { max: 500, message: '描述长度不能超过500个字符', trigger: 'blur' }
  ],
  image_url: [
    { required: true, message: '请输入图片URL', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  redirect_url: [
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  tags: [
    { max: 200, message: '标签长度不能超过200个字符', trigger: 'blur' }
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
      page_size: pagination.pageSize,
      keyword: searchForm.keyword,
      is_active: searchForm.isActive
    }
    const res = await getXiaohongshuCardList(params)
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

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.isActive = null
  pagination.page = 1
  getList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.page = 1
  getList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.page = val
  getList()
}

// 添加
const handleAdd = () => {
  dialogTitle.value = '添加小红书卡片'
  dialogVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑小红书卡片'
  dialogVisible.value = true
  Object.assign(form, {
    id: row.id,
    title: row.title,
    description: row.description,
    image_url: row.image_url,
    redirect_url: row.redirect_url,
    tags: row.tags,
    is_active: row.is_active,
    domain_pool_id: row.domain_pool_id
  })
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除卡片"${row.title}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
    const res = await deleteXiaohongshuCard(row.id)
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
    })
    .catch(() => {
      // 取消删除
    })
}

// 预览事件处理函数
const handlePreviewView = (cardData) => {
  ElMessage.info('预览查看功能')
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (form.id) {
          // 更新
          res = await updateXiaohongshuCard(form)
        } else {
          // 创建
          res = await createXiaohongshuCard(form)
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

// 重置表单
const resetForm = () => {
  form.id = null
  form.title = ''
  form.description = ''
  form.image_url = ''
  form.redirect_url = 'https://www.xiaohongshu.com'
  form.tags = ''
  form.is_active = true
  form.domain_pool_id = null
}

// 关闭对话框
const handleDialogClose = () => {
  resetForm()
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 跳转到统计页面
const goToStats = () => {
  router.push('/xiaohongshu/stats')
}

// 跳转到单个卡片统计页面
const handleStats = (row) => {
  router.push(`/xiaohongshu-card-stats/${row.id}`)
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
          linkUrl = row.redirect_url || window.location.origin + '/xiaohongshu/card/' + row.id
        }
      } catch (apiError) {
        console.error('生成短链接API调用失败:', apiError)
        // 生成短链接失败，使用原始链接
        linkUrl = row.redirect_url || window.location.origin + '/xiaohongshu/card/' + row.id
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
.xiaohongshu-card-container {
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

.search-card {
  margin-bottom: 20px;
}

.list-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-content {
  display: flex;
  gap: 20px;
}

.form-section {
  flex: 1;
  padding-right: 20px;
  border-right: 1px solid #ebeef5;
}

.preview-section {
  flex: 1;
  padding-left: 20px;
  min-width: 400px;
}
</style>