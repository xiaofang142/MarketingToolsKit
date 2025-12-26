<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="card-header">WhatsApp 账号管理</div>
      </template>
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="账号名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createAccount">添加账号</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="accounts" style="width:100%" v-loading="loading">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作" width="260">
          <template #default="{ row }">
            <el-button size="small" @click="startLogin(row)">登录</el-button>
            <el-button size="small" @click="refreshStatus(row)">状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="qrDialog" title="扫码登录" width="360px">
      <div v-if="qrCode" class="qr-box">
        <img :src="qrImageSrc" alt="QR" width="300" height="300" />
      </div>
      <div v-else>等待二维码生成...</div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/whatsapp'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

const accounts = ref([])
const loading = ref(false)
const form = ref({ name: '', remark: '' })
const qrDialog = ref(false)
const qrCode = ref('')
const qrImageSrc = computed(() => qrCode.value ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode.value)}` : '')

onMounted(() => { loadAccounts() })

function loadAccounts() {
  loading.value = true
  api.listAccounts().then(res => {
    accounts.value = res.data || []
  }).finally(() => loading.value = false)
}

function createAccount() {
  if (!form.value.name) { ElMessage.error('请输入名称'); return }
  api.createAccount(form.value).then(() => {
    ElMessage.success('创建成功')
    form.value = { name: '', remark: '' }
    loadAccounts()
  })
}

function startLogin(row) {
  api.startLogin(row.id).then(res => {
    qrCode.value = res.data.qr
    qrDialog.value = true
  })
}

function refreshStatus(row) {
  api.loginStatus(row.id).then(res => {
    if (res.data.logged_in) {
      ElMessage.success('登录成功')
      loadAccounts()
    } else {
      qrCode.value = res.data.qr || ''
      if (qrCode.value) qrDialog.value = true
      else ElMessage.info('未登录，请点击登录生成二维码')
    }
  })
}
</script>

<style scoped>
.page { padding: 20px; }
.card-header { font-weight: 600; }
.qr-box { display:flex; justify-content:center; }
</style>
