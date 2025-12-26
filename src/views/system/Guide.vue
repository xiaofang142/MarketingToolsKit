<template>
  <div class="guide-container">
    <el-steps :active="1" finish-status="success" align-center>
      <el-step title="注册内网传统" description="完成内网传统相关注册操作" />
      <el-step title="配置站点配置" description="完成站点相关配置操作" />
    </el-steps>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeStep = ref(1)
</script>  