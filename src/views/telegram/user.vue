<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="showCreateDialog">添加用户</el-button>
    </div>
    
    <!-- 用户列表表格 -->
    <el-table :data="users" v-loading="loading" style="width: 100%">
      <el-table-column prop="tg_id" label="TG ID" width="100" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="real_name" label="真实姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
            {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="加入时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" @click="showPasswordDialog(scope.row)">改密</el-button>
          <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 创建/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="userForm.real_name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usersApi } from '@/api/users'

// 数据
const users = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框状态
const dialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const isEdit = ref(false)

// 表单引用
const userFormRef = ref()
const passwordFormRef = ref()

// 用户表单
const userForm = reactive({
  username: '',
  password: '',
  real_name: '',
  email: '',
  phone: '',
  role: 'user',
  status: 1
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 当前编辑的用户ID
const currentUserId = ref('')

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
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
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await usersApi.list({
      page: currentPage.value,
      page_size: pageSize.value
    })
    users.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchUsers()
}

// 显示创建用户对话框
const showCreateDialog = () => {
  isEdit.value = false
  resetUserForm()
  dialogVisible.value = true
}

// 显示编辑用户对话框
const showEditDialog = (user) => {
  isEdit.value = true
  currentUserId.value = user.id
  
  // 填充表单数据
  Object.keys(userForm).forEach(key => {
    if (user[key] !== undefined) {
      userForm[key] = user[key]
    }
  })
  
  dialogVisible.value = true
}

// 显示修改密码对话框
const showPasswordDialog = (user) => {
  currentUserId.value = user.id
  resetPasswordForm()
  passwordDialogVisible.value = true
}

// 重置表单
const resetUserForm = () => {
  Object.keys(userForm).forEach(key => {
    if (key === 'role') {
      userForm[key] = 'user'
    } else if (key === 'status') {
      userForm[key] = 1
    } else {
      userForm[key] = ''
    }
  })
}

const resetPasswordForm = () => {
  Object.keys(passwordForm).forEach(key => {
    passwordForm[key] = ''
  })
}

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await usersApi.update(currentUserId.value, userForm)
          ElMessage.success('用户更新成功')
        } else {
          await usersApi.create(userForm)
          ElMessage.success('用户创建成功')
        }
        dialogVisible.value = false
        fetchUsers()
      } catch (error) {
        ElMessage.error(isEdit.value ? '用户更新失败' : '用户创建失败')
      }
    }
  })
}

// 修改密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await usersApi.updatePassword(currentUserId.value, {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
        ElMessage.success('密码修改成功')
        passwordDialogVisible.value = false
      } catch (error) {
        ElMessage.error('密码修改失败')
      }
    }
  })
}

// 删除用户
const deleteUser = (id) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await usersApi.delete(id)
      ElMessage.success('用户删除成功')
      fetchUsers()
    } catch (error) {
      ElMessage.error('用户删除失败')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 初始化
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>