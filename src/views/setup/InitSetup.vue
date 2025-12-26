<template>
  <div class="init-setup-container">
    <div class="setup-header">
      <h1>系统初始化向导</h1>
      <p>请按照以下步骤完成系统初始化配置</p>
    </div>

    <div class="progress-container">
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="阅读安全提示" description="阅读并同意使用声明"></el-step>
        <el-step title="下载与安装" description="获取后端并启动服务"></el-step>
        <el-step title="设置管理员" description="配置企业与超管账号"></el-step>
        <el-step title="完成" description="完成初始化"></el-step>
      </el-steps>
    </div>

    <div class="step-content">
      <!-- 第一步：阅读同意声明 -->
      <div v-if="currentStep === 0" class="step-item">
        <h2>软件使用声明</h2>
        <div class="agreement-content">
          <h3>免费授权使用声明</h3>
          <p>本软件基础功能免费授权使用，但请遵守以下条款：</p>
          <ul>
            <li>本软件仅用于合法用途，不得用于从事任何违法活动</li>
            <li>用户需自行承担使用本软件所产生的所有法律责任</li>
            <li>软件作者保留对软件的最终解释权</li>
            <li>未经授权，禁止对本软件进行反编译、逆向工程等行为</li>
          </ul>
          <p>如果您同意以上条款，请勾选下方复选框并继续。</p>
          <el-checkbox v-model="agreed" style="margin-top: 20px;">
            我已阅读并同意以上使用条款
          </el-checkbox>
        </div>
        <div class="step-actions">
          <el-button type="primary" :disabled="!agreed" @click="nextStep">下一步</el-button>
        </div>
      </div>

      <!-- 第二步：下载与安装 -->
      <div v-if="currentStep === 1" class="step-item">
        <h2>下载与安装后端</h2>
        <div class="backend-info">
          <el-alert
            title="安装指引"
            type="info"
            description="添加微信 xiao142000、QQ 1036698712 获取后端代码；后端程序并启动服务，默认地址 http://localhost:8086。完成后进行下一步。"
            show-icon
            :closable="false">
          </el-alert>
        </div>
        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </div>

      <!-- 第三步：设置管理员与企业信息 -->
      <div v-if="currentStep === 2" class="step-item">
        <h2>配置企业信息与超管账号</h2>
        <div class="api-config">
          <el-form :model="initForm" :rules="initRules" ref="initFormRef" label-width="120px">
            <el-form-item label="API地址" prop="baseUrl">
              <el-input v-model="initForm.baseUrl" placeholder="http://localhost:8086" />
            </el-form-item>
            <el-form-item label="联系邮箱" prop="contact_email">
              <el-input v-model="initForm.contact_email" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="管理员用户名" prop="admin_username">
              <el-input v-model="initForm.admin_username" placeholder="请输入管理员用户名" />
            </el-form-item>
            <el-form-item label="管理员密码" prop="admin_password">
              <el-input v-model="initForm.admin_password" type="password" show-password placeholder="请输入管理员密码" />
            </el-form-item>
          </el-form>
          <div class="test-connection">
            <el-button type="primary" @click="testConnection" :loading="testing">测试连接</el-button>
            <span v-if="connectionResult" :class="connectionResult.success ? 'success-text' : 'error-text'">
              {{ connectionResult.message }}
            </span>
          </div>
        </div>
        <div class="step-actions">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" :loading="initializing" @click="handleInit">初始化</el-button>
        </div>
      </div>

      <!-- 第四步：完成初始化 -->
      <div v-if="currentStep === 3" class="step-item">
        <div class="completion-content">
          <el-result icon="success" title="初始化完成" sub-title="系统初始化已成功完成，您现在可以开始使用系统了">
            <template #extra>
              <el-button type="primary" @click="goToSystem">进入系统</el-button>
            </template>
          </el-result>
          <div class="summary-info">
            <h3>配置摘要</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="API地址">
                {{ initForm.baseUrl }}
              </el-descriptions-item>
              <el-descriptions-item label="企业名称">
                {{ initForm.company_name }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { testApiConnection, saveApiConfigToFile, resetInitialization as resetInitFlag, getApiConfig, resetServerData, markInitializationComplete } from '@/utils/initHelper'
import { updateRequestConfig } from '@/utils/request'
import { resetConfig } from '@/utils/configManager'
import { http } from '@/utils/request'

const router = useRouter()

const currentStep = ref(0)
const agreed = ref(false)

const apiConfig = reactive({ baseUrl: 'http://localhost:8086' })
const platformBaseUrl = import.meta.env?.VITE_PLATFORM_BASE_URL || 'http://localhost:5173'
const initFormRef = ref(null)
const initForm = reactive({
  baseUrl: 'http://localhost:8086',
  contact_email: '',
  admin_username: '',
  admin_password: ''
})
const initRules = {
  baseUrl: [{ required: true, message: '请输入API地址', trigger: 'blur' }],
  admin_username: [{ required: true, message: '请输入管理员用户名', trigger: 'blur' }],
  admin_password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }]
}

const connectionResult = ref(null)
const testing = ref(false)

onMounted(async () => {
  try {
    const config = getApiConfig()
    if (config) {
      apiConfig.baseUrl = config.baseUrl
      initForm.baseUrl = config.baseUrl || initForm.baseUrl
    }
    await updateRequestConfig()
  } catch (error) {
    console.error('加载配置失败:', error)
  }
})

const nextStep = () => { if (currentStep.value < 3) currentStep.value++ }
const prevStep = () => { if (currentStep.value > 0) currentStep.value-- }

const testConnection = async () => {
  testing.value = true
  connectionResult.value = null
  try {
    const result = await testApiConnection({ baseUrl: initForm.baseUrl })
    connectionResult.value = result
    if (result.success) {
      ElMessage.success('连接测试成功')
    } else {
      ElMessage.error(`连接测试失败: ${result.message}`)
    }
  } catch (error) {
    connectionResult.value = { success: false, message: error.message || '连接测试失败' }
    ElMessage.error('连接测试失败')
  } finally {
    testing.value = false
  }
}

const initializing = ref(false)
const saveApiConfig = async () => {
  try {
    const result = await saveApiConfigToFile({ baseUrl: initForm.baseUrl })
    if (result.success) {
      await updateRequestConfig()
      ElMessage.success('API配置保存成功')
    } else {
      ElMessage.error(`保存配置失败: ${result.error}`)
    }
  } catch (error) {
    ElMessage.error(`保存配置失败: ${error.message}`)
  }
}

const handleInit = async () => {
  if (!initFormRef.value) return
  try {
    await initFormRef.value.validate()
    initializing.value = true
    // 保存 API 地址
    await saveApiConfig()
    await updateRequestConfig()
    // 调用后端初始化接口
    const resp = await http.post('/api/merchant/init', {
      contact_email: initForm.contact_email,
      admin_username: initForm.admin_username,
      admin_password: initForm.admin_password
    })
    if (resp.code === 200) {
      ElMessage.success('初始化成功')
      await markInitializationComplete()
      nextStep()
    }
  } catch (error) {
    if (error.message && error.message.includes('用户名已存在')) {
      ElMessageBox.confirm(
        '管理员用户已存在。是否要清空数据并重新初始化？此操作将清除所有现有数据！',
        '用户已存在',
        {
          confirmButtonText: '清空并重置',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          resetInitialization()
        })
        .catch(() => {})
    }
    // ElMessage.error(error.message || '初始化失败') // request.js 已处理
  } finally {
    initializing.value = false
  }
}

const goToSystem = async () => {
  try {
    await updateRequestConfig()
    // 初始化完成后跳转到商户端登录页
    router.push('/login')
  } catch (error) {
    ElMessage.error(`跳转失败: ${error.message}`)
  }
}

const resetInitialization = async () => {
  try {
    const result = await resetConfig()
    if (result.success) {
      updateRequestConfig()
      resetInitFlag()
      currentStep.value = 0
      agreed.value = false
      apiConfig.baseUrl = 'http://localhost:8086'
      initForm.admin_username = ''
      initForm.admin_password = ''
      // 触发服务器端数据重置
      try {
        await resetServerData()
        ElMessage.success('服务器数据已重置')
      } catch (e) {
        ElMessage.error('服务器数据重置失败: ' + (e.message || '未知错误'))
      }
      ElMessage.success('初始化已重置')
      // router.push('/setup') // 已经在当前页面，无需跳转
    } else {
      ElMessage.error(`重置失败: ${result.error}`)
    }
  } catch (error) {
    ElMessage.error(`重置失败: ${error.message}`)
  }
}
</script>

<style scoped>
.init-setup-container { max-width: 900px; margin: 0 auto; padding: 20px; }
.setup-header { text-align: center; margin-bottom: 30px; }
.setup-header h1 { font-size: 28px; color: #303133; margin-bottom: 10px; }
.setup-header p { font-size: 16px; color: #606266; }
.progress-container { margin-bottom: 40px; }
.step-content { min-height: 400px; }
.step-item { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); }
.step-item h2 { font-size: 20px; color: #303133; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ebeef5; }
.agreement-content { margin-bottom: 30px; }
.agreement-content h3 { font-size: 16px; color: #303133; margin: 15px 0 10px; }
.agreement-content ul { padding-left: 20px; margin-bottom: 20px; }
.agreement-content li { margin-bottom: 8px; line-height: 1.5; }
.backend-info { margin-bottom: 30px; }
.api-config { margin-bottom: 30px; }
.test-connection { margin-top: 10px; }
.success-text { color: #67C23A; margin-left: 10px; }
.error-text { color: #F56C6C; margin-left: 10px; }
.step-actions { margin-top: 20px; display: flex; gap: 10px; }
</style>
