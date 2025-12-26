<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="user" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleResetPassword(scope.row)">重置密码</el-button>
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
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
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
    
    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetPasswordVisible"
      title="重置密码"
      width="400px"
      @close="handleResetPasswordClose"
    >
      <el-form
        ref="resetPasswordFormRef"
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        label-width="80px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetPasswordForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="resetPasswordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetPasswordVisible = false">取消</el-button>
          <el-button type="primary" @click="handleResetPasswordSubmit" :loading="resetPasswordLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  resetUserPassword 
} from '@/api/user'

// 数据
const loading = ref(false)
const submitLoading = ref(false)
const resetPasswordLoading = ref(false)
const userList = ref([])
const dialogVisible = ref(false)
const resetPasswordVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const userFormRef = ref()
const resetPasswordFormRef = ref()

// 搜索表单
const searchForm = reactive({
  username: '',
  role: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 用户表单
const userForm = reactive({
  id: null,
  username: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active'
})

// 重置密码表单
const resetPasswordForm = reactive({
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 重置密码验证规则
const resetPasswordRules = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetPasswordForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      ...searchForm
    }
    
    const response = await getUsers(params)
    userList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.role = ''
  pagination.page = 1
  fetchUserList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchUserList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.page = val
  fetchUserList()
}

// 新增用户
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
  
  // 重置表单
  Object.assign(userForm, {
    id: null,
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  })
}

// 编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
  
  // 填充表单
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    email: row.email,
    password: '',
    role: row.role,
    status: row.status
  })
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${row.username}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        await deleteUser(row.id)
        ElMessage.success('删除成功')
        fetchUserList()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

// 重置密码
const handleResetPassword = (row) => {
  resetPasswordVisible.value = true
  resetPasswordForm.userId = row.id
  
  // 重置表单
  resetPasswordForm.password = ''
  resetPasswordForm.confirmPassword = ''
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    submitLoading.value = true
    
    if (isEdit.value) {
      // 编辑用户
      await updateUser(userForm.id, userForm)
      ElMessage.success('更新成功')
    } else {
      // 新增用户
      await createUser(userForm)
      ElMessage.success('创建成功')
    }
    
    dialogVisible.value = false
    fetchUserList()
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    submitLoading.value = false
  }
}

// 提交重置密码
const handleResetPasswordSubmit = async () => {
  if (!resetPasswordFormRef.value) return
  
  try {
    await resetPasswordFormRef.value.validate()
    resetPasswordLoading.value = true
    
    await resetUserPassword(resetPasswordForm.userId, {
      password: resetPasswordForm.password
    })
    
    ElMessage.success('重置密码成功')
    resetPasswordVisible.value = false
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    }
  } finally {
    resetPasswordLoading.value = false
  }
}

// 对话框关闭
const handleDialogClose = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
}

// 重置密码对话框关闭
const handleResetPasswordClose = () => {
  if (resetPasswordFormRef.value) {
    resetPasswordFormRef.value.resetFields()
  }
}

// 初始化
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
.user-management {
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
</style>