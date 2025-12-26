<template>
  <div class="sms-drafts">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>短信草稿</span>
          <el-button type="primary" @click="handleCreateDraft" :loading="loading">新建草稿</el-button>
        </div>
      </template>
      
      <el-table :data="draftList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="handleSend(scope.row)">发送</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 草稿对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" :before-close="handleDialogClose">
      <el-form :model="formData" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入草稿标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            placeholder="请输入短信内容"
            :rows="6"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发送对话框 -->
    <el-dialog v-model="sendDialogVisible" title="发送短信" width="400px">
      <el-form :model="sendForm" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="sendForm.phone" placeholder="请输入手机号" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="内容预览">
          <div class="content-preview">{{ currentDraft?.content }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmSend" :loading="sending">确定发送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import smsApi from '@/api/sms'

// 草稿列表数据
const draftList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const sending = ref(false)
const currentDraft = ref(null)

// 对话框相关
const dialogVisible = ref(false)
const sendDialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const editingId = ref(null)

// 表单数据
const formData = reactive({
  title: '',
  content: ''
})

// 发送表单
const sendForm = reactive({
  phone: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入草稿标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入短信内容', trigger: 'blur' },
    { min: 1, max: 500, message: '内容长度在 1 到 500 个字符', trigger: 'blur' }
  ]
}

// 获取草稿列表
const getDraftList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    const response = await smsApi.getDraftList(params)
    draftList.value = response.data.list || []
    total.value = response.data.total || 0
  } catch (error) {
    ElMessage.error('获取草稿列表失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.title = ''
  formData.content = ''
  editingId.value = null
}

// 新建草稿
const handleCreateDraft = () => {
  resetForm()
  dialogTitle.value = '新建草稿'
  dialogVisible.value = true
}

// 编辑草稿
const handleEdit = async (row) => {
  try {
    const response = await smsApi.getDraftDetail(row.id)
    const data = response.data
    formData.title = data.title
    formData.content = data.content
    editingId.value = data.id
    dialogTitle.value = '编辑草稿'
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取草稿详情失败')
  }
}

// 关闭对话框
const handleDialogClose = () => {
  resetForm()
  dialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    
    const draftData = {
      title: formData.title,
      content: formData.content
    }
    
    if (editingId.value) {
      // 更新草稿
      await smsApi.updateDraft(editingId.value, draftData)
      ElMessage.success('草稿更新成功')
    } else {
      // 创建草稿
      await smsApi.createDraft(draftData)
      ElMessage.success('草稿创建成功')
    }
    
    dialogVisible.value = false
    getDraftList()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('操作失败：' + (error.message || '未知错误'))
    }
  }
}

// 发送草稿
const handleSend = (row) => {
  currentDraft.value = row
  sendForm.phone = ''
  sendDialogVisible.value = true
}

// 确认发送
const handleConfirmSend = async () => {
  if (!sendForm.phone || sendForm.phone.length !== 11) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  
  sending.value = true
  try {
    await smsApi.sendDraft(currentDraft.value.id)
    ElMessage.success('短信发送成功')
    sendDialogVisible.value = false
  } catch (error) {
    ElMessage.error('短信发送失败')
  } finally {
    sending.value = false
  }
}

// 删除草稿
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除草稿「${row.title}」吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await smsApi.deleteDraft(row.id)
    ElMessage.success('草稿删除成功')
    getDraftList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('草稿删除失败')
    }
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getDraftList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getDraftList()
}

onMounted(() => {
  getDraftList()
})
</script>

<style scoped>
.sms-drafts {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.content-preview {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  min-height: 80px;
  white-space: pre-wrap;
  word-break: break-word;
  color: #606266;
}
</style>