<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="card-header">WhatsApp 群发</div>
      </template>
      <el-form label-width="80px">
        <el-form-item label="选择草稿">
          <el-select v-model="draftId" placeholder="选择草稿">
            <el-option v-for="d in drafts" :key="d.id" :label="d.title" :value="d.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!draftId" @click="createJob">开始群发</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/whatsapp'
import { ElMessage } from 'element-plus'

const drafts = ref([])
const draftId = ref('')

onMounted(() => {
  api.listDrafts().then(res => { drafts.value = res.data || [] })
})

function createJob() {
  api.createJob({ draft_id: draftId.value }).then(() => {
    ElMessage.success('群发任务已创建，后台执行中')
  })
}
</script>

<style scoped>
.page { padding: 20px; }
.card-header { font-weight: 600; }
</style>

