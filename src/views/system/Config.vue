<template>
  <div class="config-page">
    <el-form :model="configForm" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="configForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="网站URL">
        <el-input v-model="configForm.website_url" placeholder="请输入网站URL"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { SystemApi } from '@/api/system'  

// 配置表单数据
const configForm = ref({
  name: '',
  website_url: ''
})

// 模拟调用API获取配置
const fetchConfig = async () => {
  try {
    // 这里应该替换为实际的API调用
    const response = await SystemApi.getConfig()
    configForm.value = response.data
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

// 模拟调用API保存配置
const saveConfig = async () => {
  const res = await SystemApi.saveConfig(configForm.value)
  if (res.code === 200) {
    ElMessage.success('保存成功')
    // 刷新
    fetchConfig()
  } else {
    ElMessage.error(res.msg || '保存失败')
  }
}

// 提交表单方法
const submitForm = async () => {
  await saveConfig()
}

// 组件挂载时加载配置
onMounted(() => {
  fetchConfig()
})
</script>
