<template>
  <div class="email-drafts">
    <div class="drafts-header">
      <h1>邮件草稿箱</h1>
      <el-button type="primary" @click="handleCreateDraft">
        <el-icon-plus /> 新建草稿
      </el-button>
    </div>
    <!-- 草稿列表 -->
    <el-table
      v-if="filteredDrafts.length > 0"
      :data="filteredDrafts"
      style="width: 100%"
      border
      stripe
      @row-dblclick="handleEditDraft"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="subject" label="主题" min-width="200" />
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleEditDraft(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDeleteDraft(scope.row.id)">删除</el-button>
          <el-button size="small" type="primary" @click="handleSend(scope.row)">发送</el-button> 
        </template>
      </el-table-column>
    </el-table>

    <div v-else class="empty-drafts">
      <el-empty description="暂无草稿数据" />
    </div>

    <!-- 新建/编辑草稿对话框 -->
    <el-dialog 
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建草稿' : '编辑草稿'"
      width="70%"
      :before-close="handleClose"
    >
      <p>
        支持自定义变量有 {name} {city} {address} {account} 
      </p>
      <!-- 对话框内容 -->
      <el-form ref="draftFormRef" :model="draftForm" :rules="formRules" label-width="80px">
        <el-form-item label="主题" prop="subject">
          <el-input v-model="draftForm.subject" placeholder="请输入邮件主题" />
        </el-form-item>

        <!-- 富文本编辑器 -->
        <el-form-item label="内容" prop="content">
          <!-- 替换 Tinymce 为 SimpleEditor -->
          <SimpleEditor
            v-model="draftForm.content"
            :disabled="false"
          />
        </el-form-item>

        <!-- 附件上传 -->
        <!-- <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :auto-upload="false"
            list-type="text"
          >
            <el-button type="primary" icon="Upload">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持上传jpg/png/pdf/doc文件，单个文件不超过5MB
              </div>
            </template>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDraft">保存草稿</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { emailApi } from '@/api/email'
import SimpleEditor from '@/components/SimpleEditor/index.vue'

// 草稿列表数据
const drafts = ref([])
// 对话框状态
const dialogVisible = ref(false)
// 对话框类型(create/edit)
const dialogType = ref('create')
// 当前编辑的草稿ID
const currentDraftId = ref(null)
// 表单引用
const draftFormRef = ref(null)
// 文件列表
const fileList = ref([])

// 草稿表单数据
const draftForm = reactive({
  id: '',
  subject: '',
  content: '',
  attachments: []
})

// 对话框状态
const sendDialogVisible = ref(false)
// 草稿表单数据
const sendForm = reactive({
  id: '',
  subject: '',
  content: '',
  attachments: [],
  other: ''
})


// 表单验证规则
const formRules = {
  subject: [
    { required: true, message: '请输入邮件主题', trigger: 'blur' },
    { max: 100, message: '主题长度不能超过100个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入邮件内容', trigger: 'blur' }
  ]
}

// 过滤后的草稿列表
const filteredDrafts = computed(() => {
  return drafts.value
})

// 获取草稿列表
const fetchDrafts = async () => {
  try {
    const response = await emailApi.getDrafts()
    if (response.code === 200) {
      drafts.value = response.data.list || []
    } else {
      ElMessage.error('获取草稿列表失败')
    }
  } catch (error) {
    console.error('获取草稿列表失败:', error)
    ElMessage.error('获取草稿列表失败')
  }
}


// 创建新草稿
const handleCreateDraft = () => {
  dialogType.value = 'create'
  currentDraftId.value = null
  // 重置表单
  Object.assign(draftForm, {
    id: '',
    subject: '',
    content: '',
    attachments: []
  })
  fileList.value = []
  dialogVisible.value = true
}

// 编辑草稿
const handleEditDraft = async (row) => {
  dialogType.value = 'edit'
  currentDraftId.value = row.id
  try {
    const response = await emailApi.getDraftDetail(row.id)
    if (response.code === 200) {
      const draft = response.data
      Object.assign(draftForm, {
        id: draft.id,
        subject: draft.subject,
        content: draft.content,
        attachments: draft.attachments || []
      })
      dialogVisible.value = true
    } else {
      ElMessage.error('获取草稿详情失败')
    }
  } catch (error) {
    console.error('获取草稿详情失败:', error)
    ElMessage.error('获取草稿详情失败')
  }
}

// 删除草稿
const handleDeleteDraft = (id) => {
  ElMessageBox.confirm(
    '确定要删除此草稿吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await emailApi.deleteDraft(id)
      if (response.code === 200) {
        ElMessage.success('草稿删除成功')
        fetchDrafts() // 重新获取草稿列表
      } else {
        ElMessage.error(response.msg || '草稿删除失败')
      }
    } catch (error) {
      console.error('删除草稿失败:', error)
      ElMessage.error('删除草稿失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交草稿
const submitDraft = () => {
  draftFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构建提交数据
        const draftData = {
          id: draftForm.id,
          subject: draftForm.subject,
          content: draftForm.content,
          attachments: []
        }

        let response
        if (!draftData.id) {
          // 创建新草稿
          response = await emailApi.createDraft(draftData)
        } else {
          // 更新现有草稿
          response = await emailApi.updateDraft(draftData.id, draftData)
        }

        if (response.code === 200) {
          ElMessage.success(dialogType.value === 'create' ? '草稿创建成功' : '草稿更新成功')
          dialogVisible.value = false
          fetchDrafts() // 重新获取草稿列表
        } else {
          ElMessage.error(response.msg || (dialogType.value === 'create' ? '草稿创建失败' : '草稿更新失败'))
        }
      } catch (error) {
        console.error('保存草稿失败:', error)
        ElMessage.error('保存草稿失败')
      }
    }
  })
}

// 附件预览
const handlePreview = (file) => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else {
    ElMessage.warning('附件尚未上传，无法预览')
  }
}

// 附件移除
const handleRemove = (file, fileList) => {
  draftForm.attachments = draftForm.attachments.filter(att => att.uid !== file.uid)
}

// 附件删除前确认
const beforeRemove = (file, fileList) => {
  return ElMessageBox.confirm(`确定要移除 ${file.name}？`)
}

// 发送邮件
const handleSend = (draft) => {
  // 重置表单
  Object.assign(sendForm, {
    id: draft.id,
    subject: draft.subject,
    content: draft.content,
    attachments: draft.attachments || []
  })
  submitSend()
  // sendDialogVisible.value = true
}

const submitSend = async () => {
    try {
      // 构建提交数据
      const sendData = {
        id: sendForm.id,
        subject: sendForm.subject,
        content: sendForm.content,
        attachments: []
      }
        // 创建新草稿
      let res  = await emailApi.sendEmail(sendData)

      if (res.code === 200) {
        ElMessage.success('邮件写入计划条数：' + res.data.total || 0)
        sendDialogVisible.value = false
      } else {
        ElMessage.error(res.msg || '邮件发送失败')
      }
    } catch (error) {
      console.error('发送邮件失败:', error)
      ElMessage.error('发送邮件失败')
    }
  }

// 页面加载时获取草稿列表
onMounted(() => {
  fetchDrafts()
})
</script>

<style lang="scss" scoped>
.email-drafts {
  padding: 20px;

  .drafts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .drafts-search {
    margin-bottom: 20px;
    .el-input {
      width: 400px;
    }
  }

  .empty-drafts {
    padding: 60px 0;
    text-align: center;
  }

  .editor-container {
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  /* 使用全局样式替代深度选择器 */
}
</style>

<style>
/* 全局样式，不使用scoped */
.email-drafts .el-upload-list__item {
  margin-top: 5px;
}
</style>