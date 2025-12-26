<template>
  <div class="account-management">    
    <div class="account-tabs">
          <div class="account-list-container">
            <div class="account-search">
              <el-input
                v-model="searchKeyword"
                placeholder="输入名称或账号搜索"
                prefix-icon="Search"
                clearable
                @clear="handleSearch"
                @input="handleSearch"
              />
              <div class="action-buttons">
                <el-button type="primary" @click="handleAddAccount">添加账号</el-button>
                <el-button type="info" @click="fetchAccounts" :loading="false">
                  <el-icon :class="{ 'is-loading': appStore.isAccountRefreshing }"><Refresh /></el-icon>
                  <span v-if="appStore.isAccountRefreshing">刷新中</span>
                </el-button>
              </div>
            </div>
            
            <div v-if="filteredAccounts.length > 0" class="account-list">
              <el-table :data="filteredAccounts" style="width: 100%" border>
                <el-table-column prop="tg_name" label="Telegram名称" width="180" >
                  <template #default="scope">
                    <el-link :href="scope.row.url" target="_blank">{{ scope.row.tg_name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="100" align="right" />
                <el-table-column prop="group_id" label="群ID" width="180" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'" effect="plain">
                      {{ scope.row.status == 1 ? '正常' : '异常' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="msg" label="错误信息" width="180" />
                <el-table-column label="支付配置" width="180">
                  <template #default="scope">
                    <div class="payment-info">
                      <div>PID: {{ scope.row.epay_pid }}</div>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column label="代理配置" width="300">
                  <template #default="scope">
                    <div v-if="scope.row.proxy_enable_proxy" class="proxy-info">
                      <div>{{ scope.row.proxy_protoclo }}://{{ scope.row.proxy_host }}:{{ scope.row.proxy_port }}</div>
                    </div>
                    <div v-else>未启用</div>
                  </template>
                </el-table-column>
                
                <el-table-column label="操作" width="250" fixed="right">
                  <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                     <el-button size="small" type="primary" @click="handleRun(scope.row)">启动</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div v-else class="empty-data">
              <el-empty description="暂无账号数据" />
            </div>
          </div>
    </div>
    
    <!-- 添加/编辑账号对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加账号' : '编辑账号'"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="!sseConnecting"
      :show-close="!sseConnecting"
    >
      <el-form :model="accountForm" label-width="80px" :rules="rules" ref="accountFormRef">
        <el-form-item label="Bot" prop="tg_bot_token">
          <el-input v-model="accountForm.tg_bot_token" placeholder="请输入Telegram Bot Token" />
        </el-form-item>
        <el-form-item label="群组ID" prop="group_id">
          <el-input v-model.number="accountForm.group_id" placeholder="请输入群组ID" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="accountForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="EpayPID" prop="epay_pid">
          <el-input v-model="accountForm.epay_pid" placeholder="请输入Epay PID" />
        </el-form-item>
        <el-form-item label="EpayKey" prop="epay_key">
          <el-input v-model="accountForm.epay_key" placeholder="请输入Epay Key" />
        </el-form-item>
        <el-form-item label="EpayURL" prop="epay_url">
          <el-input v-model="accountForm.epay_url" placeholder="请输入Epay URL" />
        </el-form-item>
          <el-form-item label="EpayQueryUrl" prop="epay_query_url">
          <el-input v-model="accountForm.epay_query_url" placeholder="请输入Epay Query URL" />
        </el-form-item>
        <el-form-item label="支付类型" prop="epay_pay_type">
          <el-input v-model="accountForm.epay_pay_type" placeholder="请输入Epay支付类型" />
        </el-form-item>
        <el-form-item label="启用代理" prop="proxy_enable_proxy">
          <el-switch v-model="accountForm.proxy_enable_proxy" />
        </el-form-item>
        <el-form-item v-if="accountForm.proxy_enable_proxy" label="代理协议" prop="proxy_protocol">
          <el-select v-model="accountForm.proxy_protoclo" placeholder="请选择代理协议">
            <el-option label="HTTP" value="http" />
            <el-option label="HTTPS" value="https" />
            <el-option label="SOCKS5" value="socks5" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="accountForm.proxy_enable_proxy" label="代理主机" prop="proxy_host">
          <el-input v-model="accountForm.proxy_host" placeholder="请输入代理主机" />
        </el-form-item>
        <el-form-item v-if="accountForm.proxy_enable_proxy" label="代理端口" prop="proxy_port">
          <el-input v-model.number="accountForm.proxy_port" placeholder="请输入代理端口" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="submitAccountForm" 
            :loading="sseConnecting" 
            :disabled="sseConnecting"
          >
            {{ sseConnecting ? '请求中' : '确认' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { accountApi } from '@/api/account'
import { useAccountStore } from '@/stores/account'
import { useAppStore } from '@/stores/app'

import { getPlatformTag, getPlatformName, getPlatformMap } from '@/utils/map'

// 获取账号状态管理
const accountStore = useAccountStore()
// 获取应用状态管理
const appStore = useAppStore()


// 搜索关键词
const searchKeyword = ref('')


// 获取账号数据
const fetchAccounts = async () => {
  if (appStore.isAccountRefreshing) return
  
  appStore.setAccountRefreshing(true)
  
  try {
    const res = await accountApi.getAccounts()
    if (res.code === 200 && res.data) {
      accountStore.setAccounts(res.data.list || [])
      // 标记为已访问
      if (appStore.isFirstTimeAccountManagement) {
        appStore.setAccountManagementVisited()
      }
    } else {
      ElMessage.error('获取账号数据失败')
    }
  } catch (error) {
    console.error('获取账号数据失败:', error)
    ElMessage.error('获取账号数据失败')
  } finally {
    appStore.setAccountRefreshing(false)
  }
}

// 页面加载时获取账号数据
onMounted(() => {
  // 只有第一次进入时才获取数据
  fetchAccounts()
})


// 过滤后的账号列表
const filteredAccounts = computed(() => {
  if (!searchKeyword.value) return accountStore.accounts
  return accountStore.accounts.filter(account => 
    account.tg_name.includes(searchKeyword.value)
  )
})


// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const accountFormRef = ref(null)

// 账号表单
const accountForm = reactive({
  id: null,
  tg_bot_token: '',
  group_id: 0,
  price: '',
  epay_query_url: '',
  epay_pid: '',
  epay_key: '',
  epay_url: '',
  epay_pay_type: '',
  proxy_enable_proxy: false,
  proxy_protocol: 'http',
  proxy_host: '',
  proxy_port: 0,
  status: 1,
  create_time: 0
})

// 表单验证规则
const rules = {
  tg_bot_token: [{ required: true, message: ' Bot Token', trigger: 'blur' }],
  group_id: [{ required: true, message: '请输入群组ID', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  epay_query_url: [{ required: true, message: '请输入Epay Query URL', trigger: 'blur' }],
  epay_pid: [{ required: true, message: '请输入Epay PID', trigger: 'blur' }],
  epay_key: [{ required: true, message: '请输入Epay Key', trigger: 'blur' }],
  epay_url: [{ required: true, message: '请输入Epay URL', trigger: 'blur' }],
  epay_pay_type: [{ required: true, message: '请输入Epay支付类型', trigger: 'blur' }]
}

const sseConnecting = ref(false)
const qrCodeData = ref('')
const loginStatus = ref('')

// 添加账号
const handleAddAccount = () => {
  dialogType.value = 'add'
  Object.assign(accountForm, {
    id: null,
    name: '',
    type: '',
    status: 1
  })
  // 重置SSE状态
  sseConnecting.value = false
  qrCodeData.value = ''
  loginStatus.value = ''
  dialogVisible.value = true
}

// 编辑账号
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(accountForm, { ...row })
  dialogVisible.value = true
}

// 删除账号
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除账号 ${row.tg_name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        // 调用API删除账号
        const response = await accountApi.deleteAccount(row.id)
        if (response.code === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          fetchAccounts()
        } else {
          ElMessage.error(response.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除账号失败:', error)
        ElMessage.error('删除账号失败')
      }
    })
    .catch(() => {
      // 取消删除
    })
}


const handleRun = (row) => {
  ElMessageBox.confirm(
    `确定要启动账号 ${row.tg_name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        // 调用API删除账号
        const response = await accountApi.runAccount(row.id)
        if (response.code === 200) {
          ElMessage({
            type: 'success',
            message: '启动成功',
          })
        } else {
          ElMessage.error(response.msg || '启动失败')
        }
      } catch (error) {
        console.error('启动账号失败:', error)
        ElMessage.error('启动账号失败')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 提交账号表单
const submitAccountForm = () => {
  accountFormRef.value.validate(async (valid) => {
    if (valid) {
          if(accountForm.id){
            const res = await accountApi.updateAccount(accountForm.id,accountForm)
            if (res.code === 200) {
              ElMessage.success('更新成功')
              dialogVisible.value = false
              // 刷新账号列表
              fetchAccounts()
            } else {
              ElMessage.error(res.msg || '更新账号失败')
            }
          }else{
            const res = await accountApi.addAccount(accountForm)
            if (res.code === 200) {
              ElMessage.success('新增成功')
              dialogVisible.value = false
              // 刷新账号列表
              fetchAccounts()
            } else {
              ElMessage.error(res.msg || '新增账号失败')
            }
          }
          

    } else {
      return false
    }
  })
}


</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.account-management {
  .page-header {
    margin-bottom: 20px;
    
    h1 {
      font-size: 24px;
      color: $text-primary;
      margin: 0;
    }
  }
  
  .account-tabs {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: $box-shadow-light;
    
    .account-tabs-nav {
      padding: 20px;
    }
  }
  
  .account-list-container {
    padding: 20px;
    .account-search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      
      .el-input {
        width: 300px;
      }
      
      .action-buttons {
        display: flex;
        gap: 10px;
        
        .el-icon.is-loading {
          animation: rotate 1s linear infinite;
        }
      }
    }
    
    .account-list {
      margin-bottom: 20px;
    }
    
    .empty-data {
      padding: 40px 0;
    }
  }
  
  // 二维码容器样式
  .qrcode-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 250px;
    
    .qrcode-wrapper {
      text-align: center;
      
      .qrcode-tip {
        margin-bottom: 15px;
        color: #606266;
      }
      
      .qrcode-image {
        max-width: 200px;
        max-height: 200px;
        border: 1px solid #ebeef5;
        background-color: black;
      }
    }
    
    .loading-wrapper, .success-wrapper, .error-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      
      .el-icon {
        font-size: 48px;
        
        &.is-loading {
          animation: rotate 1s linear infinite;
        }
      }
      
      span {
        font-size: 16px;
      }
    }
    
    .success-wrapper .el-icon {
      color: #67c23a;
    }
    
    .error-wrapper .el-icon {
      color: #f56c6c;
    }
  }
}
</style>