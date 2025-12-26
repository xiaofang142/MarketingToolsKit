<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>营销管理系统</h1>
        <p>欢迎登录系统</p>
      </div>
      
      <div class="login-content">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="用户名"
              prefix-icon="User"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="warning"
            plain
            size="large"
            style="width: 100%"
            @click="handleReset"
          >
            一键重置（忘记账号）
          </el-button>
        </el-form-item>
      </el-form>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { usersApi } from '@/api/users'
import { resetInitialization } from '@/utils/initHelper'
import { resetConfig } from '@/utils/configManager'
import { updateRequestConfig } from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 调用登录API
    const response = await usersApi.login(loginForm)
    
    // 保存用户信息和token
    if (response.data && response.data.token) {
      userStore.login(response.data.user, response.data.token)
      ElMessage.success('登录成功')
      // 跳转到首页
      router.push('/')
    } else {
      ElMessage.error('登录失败：服务器返回数据异常')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  try {
    loading.value = true
    await resetConfig()
    resetInitialization()
    userStore.logout()
    await updateRequestConfig()
    ElMessage.success('已重置配置，请重新初始化')
    router.push('/setup')
  } catch (error) {
    ElMessage.error(error.message || '重置失败')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 20px;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.login-header p {
  font-size: 14px;
  color: #909399;
}

.login-content {
  margin-bottom: 20px;
}


:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-divider__text) {
  background-color: #fff;
  padding: 0 15px;
  color: #909399;
}
</style>
