<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="card-header">WhatsApp 草稿箱</div>
      </template>
      <el-form @submit.prevent label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createDraft">新建草稿</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="drafts" style="width:100%" v-loading="loading">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="updated_at" label="更新时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/whatsapp'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const drafts = ref([])
const form = ref({ title: '', content: '' })

onMounted(load)

function load() {
  loading.value = true
  api.listDrafts().then(res => {
    drafts.value = res.data || []
  }).finally(() => loading.value = false)
}

function createDraft() {
  if (!form.value.title || !form.value.content) { ElMessage.error('请输入标题和内容'); return }
  api.createDraft(form.value).then(() => {
    ElMessage.success('创建成功')
    form.value = { title: '', content: '' }
    load()
  })
}
</script>

<style scoped>
.page { padding: 20px; }
.card-header { font-weight: 600; }
</style>

