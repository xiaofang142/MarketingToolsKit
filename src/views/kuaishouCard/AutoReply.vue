<template>
  <div class="auto-reply">
    <div class="row-top">
      <div class="panel">
        <el-card class="panel-card">
          <div class="section-title">自动回复账号</div>
          <el-table :data="accounts" size="small" style="width: 100%">
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="is_active" label="状态" />
            <el-table-column label="机器人状态" width="120">
              <template #default>
                <span :class="['status-indicator', botStatus.running ? 'status-running' : 'status-stopped']"></span>
                {{ botStatus.running ? '运行中' : '已停止' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template #default="{ row }">
                <el-button size="small" @click="handleSaveCookie(row)">保存Cookie</el-button>
                <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="toolbar">
            <el-input v-model="form.username" placeholder="输入账号昵称" />
            <el-button type="primary" @click="submitAccount">绑定账号</el-button>
          </div>
        </el-card>
      </div>
      <div class="panel">
        <el-card class="panel-card">
          <div class="section-title">回复规则</div>
          <el-form :model="rule" label-width="100px" size="small">
            <el-form-item label="关键词">
              <el-input 
                v-model="rule.keywords" 
                type="textarea" 
                placeholder="请输入关键词，多个关键词用逗号分隔，例如：你好,咨询,价格" 
                :rows="2"
              />
              <div class="form-help-text">多个关键词用逗号分隔，支持模糊匹配</div>
            </el-form-item>
            <el-form-item label="回复内容">
              <el-input 
                v-model="rule.reply_content" 
                type="textarea" 
                placeholder="请输入回复内容，支持变量：{username}（用户名）" 
                :rows="3"
              />
              <div class="form-help-text">支持变量：{username} 表示用户昵称</div>
            </el-form-item>
            <el-form-item label="回复频率(秒)">
              <el-input-number 
                v-model.number="rule.frequency" 
                :min="10" 
                :max="3600" 
                :step="10"
                controls-position="right"
              />
              <div class="form-help-text">设置最小回复间隔，单位：秒（默认60秒）</div>
            </el-form-item>
            <el-form-item label="每日上限">
              <el-input-number 
                v-model.number="rule.daily_limit" 
                :min="1" 
                :max="10000" 
                :step="10"
                controls-position="right"
              />
              <div class="form-help-text">每天最大回复次数（默认100次）</div>
            </el-form-item>
            <el-form-item label="时间段控制">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-time-picker
                    v-model="rule.start_time"
                    placeholder="开始时间"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width: 100%"
                  />
                </el-col>
                <el-col :span="2" style="text-align: center; line-height: 32px;">至</el-col>
                <el-col :span="10">
                  <el-time-picker
                    v-model="rule.end_time"
                    placeholder="结束时间"
                    format="HH:mm"
                    value-format="HH:mm"
                    style="width: 100%"
                  />
                </el-col>
              </el-row>
              <div class="form-help-text">设置自动回复的有效时间段（留空表示全天有效）</div>
            </el-form-item>
            <el-form-item>
              <el-switch v-model="rule.is_active" active-text="启用" inactive-text="停用" />
            </el-form-item>
            <el-button-group>
              <el-button type="primary" @click="saveRule">保存规则</el-button>
              <el-button @click="start">启动自动回复</el-button>
              <el-button type="danger" @click="stop">停止</el-button>
            </el-button-group>
            <el-button @click="loadTemplate" style="margin-left: 10px;">使用模板</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="row-logs">
      <el-card>
        <div class="section-title">最近回复日志</div>
        <el-table :data="logs" size="small" style="width: 100%">
          <el-table-column prop="created_at" label="时间" width="160" />
          <el-table-column prop="target_content" label="目标" />
          <el-table-column prop="reply_content" label="回复" />
          <el-table-column prop="status" label="状态" width="100" />
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="page"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
    <el-dialog v-model="loginDialogVisible" title="绑定账号与登录" width="600px">
      <div>
        <p>平台：快手</p>
        <p>账号昵称：{{ loginDialog.username }}</p>
        <div v-if="loginDialog.status === 'idle' || loginDialog.status === 'starting'">
          <el-alert title="请按照以下步骤操作：" type="info" show-icon />
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>点击下方"一键登录"按钮</li>
            <li>在弹出的浏览器窗口中登录您的账号</li>
            <li>系统将自动获取登录信息并完成绑定</li>
          </ol>
          <div style="margin-top: 20px; text-align: center;">
            <el-button type="primary" @click="startOneClickLogin" :loading="loginDialog.loading">
              {{ loginDialog.loading ? '正在启动浏览器...' : '一键登录' }}
            </el-button>
          </div>
          <div style="margin-top: 10px;">
            <el-switch 
              v-model="loginDialog.headless" 
              active-text="无头模式（后台运行）" 
              inactive-text="可视化模式（显示浏览器）" 
            />
          </div>
        </div>
        <div v-else-if="loginDialog.status === 'waiting'">
          <el-alert title="正在等待您完成登录，请在弹出的浏览器窗口中登录您的账号..." type="warning" show-icon />
          <div style="text-align: center; margin-top: 20px;">
            <el-icon class="is-loading" style="font-size: 24px;"><component is="Loading" /></el-icon>
            <p style="margin-top: 10px;">系统将在后台等待您完成登录</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <el-button @click="checkLoginStatus">刷新状态</el-button>
            <el-button @click="cancelLogin">取消</el-button>
          </div>
        </div>
        <div v-else-if="loginDialog.status === 'logged_in'">
          <el-alert title="登录成功！账号已绑定。" type="success" show-icon />
          <div style="margin-top: 20px; text-align: center;">
            <el-button type="primary" @click="finishLogin">完成绑定</el-button>
          </div>
        </div>
        <div v-else-if="loginDialog.status === 'failed'">
          <el-alert title="登录失败，请重试。" type="error" show-icon />
          <div style="margin-top: 20px; text-align: center;">
            <el-button @click="retryLogin">重新开始</el-button>
            <el-button @click="manualInputCookie">手动输入Cookie</el-button>
          </div>
        </div>
        <!-- 手动输入Cookie模式 -->
        <div v-else-if="loginDialog.mode === 'manual'">
          <el-alert title="请在新标签页登录您的账号，然后复制Cookie粘贴到下方：" type="info" show-icon style="margin-bottom: 15px;" />
          <p>粘贴登录后的 Cookie：</p>
          <el-input v-model="loginDialog.cookie" type="textarea" placeholder="粘贴 Cookie 文本" rows="6" />
          <div style="margin-top: 10px;">
            <el-switch 
              v-model="loginDialog.headless" 
              active-text="无头模式（后台运行）" 
              inactive-text="可视化模式（显示浏览器）" 
            />
          </div>
          <div style="margin-top:10px; text-align:right">
            <el-button @click="goBackToSelection">返回</el-button>
            <el-button @click="loginDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="saveCookieFromIframe">保存Cookie</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { autoReplyApi } from '@/api/autoReply'

const platform = 'kuaishou'
const accounts = ref([])
const logs = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rule = ref({ platform, keywords: '', reply_content: '', frequency: 60, daily_limit: 100, is_active: true, start_time: null, end_time: null })
const form = ref({ username: '' })
const loginDialogVisible = ref(false)
const loginDialog = ref({ 
  username: '', 
  cookie: '', 
  status: 'idle', 
  accountId: null, 
  headless: true,
  loading: false,
  mode: 'auto' // 'auto' for one-click login, 'manual' for manual cookie input
})

// 添加状态跟踪
const botStatus = ref({ running: false })

// 一键登录功能
const startOneClickLogin = async () => {
  if (!loginDialog.value.username) {
    ElMessage.warning('请先输入账号昵称')
    return
  }
  
  loginDialog.value.loading = true
  loginDialog.value.status = 'starting'
  
  try {
    // 调用后端API启动登录流程
    const response = await autoReplyApi.loginStart({ 
      platform, 
      username: loginDialog.value.username,
      headless: loginDialog.value.headless 
    })
    
    if (response.code === 200) {
      loginDialog.value.accountId = response.data.accountId
      loginDialog.value.status = 'waiting'
      ElMessage.success('浏览器已启动，请在弹出窗口中登录您的账号')
      
      // 开始轮询检查登录状态
      startPollingLoginStatus()
    } else {
      throw new Error(response.msg || '启动登录失败')
    }
  } catch (error) {
    console.error('一键登录失败:', error)
    ElMessage.error(`一键登录失败: ${error.message || error}`)
    loginDialog.value.status = 'failed'
  } finally {
    loginDialog.value.loading = false
  }
}

// 开始轮询登录状态
let pollingInterval = null
const startPollingLoginStatus = () => {
  // 如果已有轮询，先清除
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
  
  // 每3秒检查一次登录状态
  pollingInterval = setInterval(async () => {
    await checkLoginStatus()
  }, 3000)
}

// 检查登录状态
const checkLoginStatus = async () => {
  if (!loginDialog.value.username || !loginDialog.value.accountId) {
    return
  }
  
  try {
    const response = await autoReplyApi.loginStatus(platform, loginDialog.value.username)
    
    if (response.code === 200) {
      const status = response.data.status
      
      if (status === 'logged_in') {
        // 登录成功
        loginDialog.value.status = 'logged_in'
        loginDialog.value.cookie = response.data.cookie
        
        // 停止轮询
        if (pollingInterval) {
          clearInterval(pollingInterval)
          pollingInterval = null
        }
        
        ElMessage.success('登录成功！')
      } else if (status === 'waiting') {
        // 继续等待，保持当前状态
        loginDialog.value.status = 'waiting'
      }
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
}

// 完成登录
const finishLogin = async () => {
  try {
    // 更新账号信息，保存cookie和headless设置
    await autoReplyApi.upsertAccount({ 
      platform, 
      username: loginDialog.value.username,
      cookie: loginDialog.value.cookie,
      headless: loginDialog.value.headless
    })
    
    ElMessage.success('账号绑定成功！')
    loginDialogVisible.value = false
    
    // 刷新数据
    await fetchAll()
  } catch (error) {
    console.error('完成登录失败:', error)
    ElMessage.error(`完成绑定失败: ${error.message || error}`)
  }
}

// 取消登录
const cancelLogin = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  loginDialog.value.status = 'idle'
  loginDialog.value.loading = false
}

// 重试登录
const retryLogin = () => {
  loginDialog.value.status = 'idle'
  loginDialog.value.cookie = ''
  loginDialog.value.accountId = null
}

// 手动输入Cookie
const manualInputCookie = () => {
  loginDialog.value.mode = 'manual'
}

// 返回选择界面
const goBackToSelection = () => {
  loginDialog.value.mode = 'auto'
  loginDialog.value.status = 'idle'
}

// 修改原来的submitAccount函数
const submitAccount = async () => {
  if (!form.value.username) {
    ElMessage.warning('请输入账号昵称')
    return
  }
  
  // 设置对话框数据
  loginDialog.value.username = form.value.username
  loginDialog.value.status = 'idle'
  loginDialog.value.cookie = ''
  loginDialog.value.accountId = null
  loginDialog.value.mode = 'auto'
  
  // 显示对话框
  loginDialogVisible.value = true
}

const fetchAll = async () => {
  const a = await autoReplyApi.listAccounts(platform)
  accounts.value = a.data.list || []
  const r = await autoReplyApi.getRule(platform)
  rule.value = Object.assign(rule.value, r.data.rule || {})
  await fetchLogs()
  
  // 检查机器人运行状态（这里可以通过API检查或者根据账号活动状态判断）
  // 暂时根据是否有活跃账号来简单判断
  botStatus.value.running = accounts.value.length > 0
}

const fetchLogs = async () => {
  const l = await autoReplyApi.listLogs(platform, { page: page.value, page_size: pageSize.value })
  logs.value = l.data.list || []
  total.value = l.data.total || 0
}



const saveCookieFromIframe = async () => {
  if (!loginDialog.value.accountId) {
    ElMessage.error('账号ID不存在，请重新绑定')
    return
  }
  
  // 获取用户输入的cookie
  let cookie = loginDialog.value.cookie
  
  if (!cookie) {
    ElMessage.warning('请先在新标签页完成登录，然后从浏览器开发者工具中复制Cookie并粘贴到上方输入框')
    return
  }
  
  try {
    // 更新账号信息，包括cookie和headless设置
    await autoReplyApi.upsertAccount({ 
      platform, 
      username: loginDialog.value.username,
      cookie: cookie,
      headless: loginDialog.value.headless
    })
    ElMessage.success('账号信息保存成功')
    loginDialogVisible.value = false
    fetchAll()
  } catch (e) {
    ElMessage.error('保存账号信息失败，请稍后重试')
  }
}

const handleSaveCookie = async (row) => {
  await autoReplyApi.saveCookies(row.id, row.cookie || '')
  fetchAll()
}

const handleDelete = async (row) => {
  try {
    await autoReplyApi.deleteAccount(row.id)
    ElMessage.success('已删除账号')
    fetchAll()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

// 添加模板功能
const loadTemplate = () => {
  ElMessageBox.prompt('选择预设模板:', '使用模板', {
    inputValue: 'welcome',
    inputOptions: {
      'welcome': '欢迎语模板',
      'business': '商务咨询模板',
      'out_of_office': '下班时段模板'
    },
    inputPlaceholder: '请选择模板类型'
  }).then(({ value }) => {
    switch(value) {
      case 'welcome':
        rule.value.keywords = '你好,您好,hi,hello,在吗,有人在吗';
        rule.value.reply_content = '您好！感谢您的关注，我会尽快回复您的消息。';
        break;
      case 'business':
        rule.value.keywords = '咨询,价格,多少钱,费用,合作,代理,购买,买';
        rule.value.reply_content = '您好！感谢您的咨询，我们的客服会尽快联系您，也可以留下联系方式方便我们回复您。';
        break;
      case 'out_of_office':
        rule.value.keywords = '工作,上班时间,几点,什么时候';
        rule.value.reply_content = '您好！我们会在工作时间(9:00-18:00)尽快回复您，非工作时间留言我们会第二天统一处理。';
        rule.value.start_time = '09:00';
        rule.value.end_time = '18:00';
        break;
      default:
        rule.value.keywords = '';
        rule.value.reply_content = '';
    }
    ElMessage.success('已加载模板');
  }).catch(() => {
    // 用户取消选择
  });
};

const saveRule = async () => {
  await autoReplyApi.saveRule({ 
    ...rule.value, 
    platform,
    start_time: rule.value.start_time,
    end_time: rule.value.end_time
  });
  fetchAll();
}

const start = async () => {
  // 从账号列表中选择第一个激活的账号
  if (accounts.value.length === 0) {
    ElMessage.warning('请先添加并配置账号')
    return
  }
  const firstAccount = accounts.value[0]
  
  try {
    ElMessage.info('正在启动自动回复机器人...')
    const response = await autoReplyApi.start({ platform, account_id: firstAccount.id })
    if (response.code === 200) {
      ElMessage.success('自动回复机器人启动成功！')
      botStatus.value.running = true
    } else {
      ElMessage.error(`启动失败: ${response.msg}`)
    }
  } catch (error) {
    console.error('启动自动回复失败:', error)
    ElMessage.error(`启动失败: ${error.message || error}`)
  }
  
  // 刷新数据
  await fetchAll()
}

const stop = async () => {
  try {
    ElMessage.info('正在停止自动回复机器人...')
    const response = await autoReplyApi.stop({ platform })
    if (response.code === 200) {
      ElMessage.success('自动回复机器人已停止！')
      botStatus.value.running = false
    } else {
      ElMessage.error(`停止失败: ${response.msg}`)
    }
  } catch (error) {
    console.error('停止自动回复失败:', error)
    ElMessage.error(`停止失败: ${error.message || error}`)
  }
  
  // 刷新数据
  await fetchAll()
}

onMounted(fetchAll)

const handlePageChange = (p) => {
  page.value = p
  fetchLogs()
}
</script>
<style scoped>
.auto-reply { 
  padding: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.row-top { 
  display: flex; 
  gap: 16px; 
  flex-wrap: wrap;
}
.panel { 
  flex: 1; 
  min-width: 300px;
  display: flex; 
}
.panel-card { 
  width: 100%; 
  height: 100%; 
  display: flex; 
  flex-direction: column; 
}
.section-title { 
  font-size: 16px; 
  font-weight: 500; 
  margin-bottom: 10px;
  color: #303133;
}
.toolbar { 
  display: flex; 
  gap: 8px; 
  margin-top: 8px;
  align-items: center;
}
.row-logs { 
  margin-top: 16px; 
}
.pagination { 
  display: flex; 
  justify-content: flex-end; 
  margin-top: 8px; 
}
.form-help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}
.status-active {
  background-color: #67c23a;
}
.status-inactive {
  background-color: #909399;
}
.status-running {
  background-color: #409eff;
}
.status-stopped {
  background-color: #f56c6c;
}
.template-selector {
  max-width: 300px;
}
</style>
