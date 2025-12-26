1 <template>
  <div class="auto-reply">
    <div class="row-top">
      <div class="panel">
        <el-card class="panel-card">
          <div class="section-title">自动回复账号</div>
          <el-table :data="accounts" size="small" style="width: 100%">
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="is_active" label="状态" />
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
          <el-form :model="rule" label-width="90px" size="small">
            <el-form-item label="关键词">
              <el-input v-model="rule.keywords" type="textarea" />
            </el-form-item>
            <el-form-item label="话术">
              <el-input v-model="rule.reply_content" type="textarea" />
            </el-form-item>
            <el-form-item label="频率(秒)">
              <el-input v-model.number="rule.frequency" type="number" />
            </el-form-item>
            <el-form-item label="每日上限">
              <el-input v-model.number="rule.daily_limit" type="number" />
            </el-form-item>
            <el-form-item>
              <el-switch v-model="rule.is_active" active-text="启用" inactive-text="停用" />
            </el-form-item>
            <el-button type="primary" @click="saveRule">保存规则</el-button>
            <el-button @click="start">启动自动回复</el-button>
            <el-button type="danger" @click="stop">停止</el-button>
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
        <p>平台：闲鱼</p>
        <p>账号昵称：{{ loginDialog.username }}</p>
        <el-alert title="请按照以下步骤操作：1. 在新标签页打开闲鱼网站；2. 登录你的账号；3. 按F12打开开发者工具，切换到Network或Application标签页；4. 复制登录后的Cookie；5. 粘贴到下方输入框；6. 选择是否使用无头浏览器；7. 点击保存Cookie。" type="info" show-icon />
        <el-divider />
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
          <el-button @click="loginDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="saveCookieFromIframe">保存Cookie</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { xianyuAutoReplyApi } from '@/api/xianyuAutoReply'

const platform = 'xianyu'
const accounts = ref([])
const logs = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rule = ref({ platform, keywords: '', reply_content: '', frequency: 60, daily_limit: 100, is_active: true })
const form = ref({ username: '' })
const loginDialogVisible = ref(false)
const loginDialog = ref({ username: '', cookie: '' , status: 'idle', accountId: null, headless: true})

const fetchAll = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录，获取JWT后再访问账号/规则/日志')
    return
  }
  const a = await xianyuAutoReplyApi.listAccounts()
  accounts.value = a.data.list || []
  const r = await xianyuAutoReplyApi.getRule()
  rule.value = Object.assign(rule.value, r.data || {})
  await fetchLogs()
}

const fetchLogs = async () => {
  const l = await xianyuAutoReplyApi.listLogs({ page: page.value, page_size: pageSize.value })
  logs.value = l.data.list || []
  total.value = l.data.total || 0
}

const submitAccount = async () => {
  if (!form.value.username) {
    ElMessage.warning('请输入账号昵称')
    return
  }
  // 设置对话框数据
  loginDialog.value.username = form.value.username
  loginDialog.value.status = 'starting'
  loginDialog.value.cookie = ''
  loginDialog.value.accountId = null
  
  try {
    // 创建账号记录 - 调用不同的API
    const res = await xianyuAutoReplyApi.upsertAccount({ 
      username: form.value.username,
      cookie: ''
    })
    loginDialog.value.accountId = res?.data?.id || null
    form.value.username = ''
    // 显示对话框
    loginDialogVisible.value = true
  } catch (e) {
    ElMessage.error('创建账号失败，请稍后重试')
  }
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
    await xianyuAutoReplyApi.upsertAccount({ 
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
  const token = localStorage.getItem('token')
  if (!token) { ElMessage.warning('请先登录后再保存Cookie'); return }
  await xianyuAutoReplyApi.saveCookies(row.id, row.cookie || '')
  fetchAll()
}

const handleDelete = async (row) => {
  const token = localStorage.getItem('token')
  if (!token) { ElMessage.warning('请先登录后再删除'); return }
  try {
    await xianyuAutoReplyApi.deleteAccount(row.id)
    ElMessage.success('已删除账号')
    fetchAll()
  } catch (e) {
    ElMessage.error('删除失败')
    console.error(e)
  }
}

const saveRule = async () => {
  const token = localStorage.getItem('token')
  if (!token) { ElMessage.warning('请先登录后再保存规则'); return }
  try {
    await xianyuAutoReplyApi.saveRule({ ...rule.value, platform })
    ElMessage.success('规则保存成功')
    fetchAll()
  } catch (e) {
    ElMessage.error('保存规则失败')
    console.error(e)
  }
}

const start = async () => {
  const token = localStorage.getItem('token')
  if (!token) { ElMessage.warning('请先登录后再启动'); return }
  try {
    await xianyuAutoReplyApi.start()
    ElMessage.success('自动回复已启动')
  } catch (e) {
    ElMessage.error('启动失败')
    console.error(e)
  }
}

const stop = async () => {
  const token = localStorage.getItem('token')
  if (!token) { ElMessage.warning('请先登录后再停止'); return }
  try {
    await xianyuAutoReplyApi.stop()
    ElMessage.success('自动回复已停止')
  } catch (e) {
    ElMessage.error('停止失败')
    console.error(e)
  }
}

onMounted(fetchAll)

const handlePageChange = (p) => {
  page.value = p
  fetchLogs()
}
</script>

<style scoped>
.auto-reply { padding: 10px }
.row-top { display: flex; gap: 16px; }
.panel { flex: 1; display: flex; }
.panel-card { width: 100%; height: 100%; display: flex; flex-direction: column; }
.section-title { font-size: 16px; font-weight: 500; margin-bottom: 10px }
.toolbar { display: flex; gap: 8px; margin-top: 8px }
.row-logs { margin-top: 16px; }
.pagination { display: flex; justify-content: flex-end; margin-top: 8px; }
</style>
